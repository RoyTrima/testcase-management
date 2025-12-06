// backend/src/routes/api.testcases.js
const express = require('express');
const router = express.Router();
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://tcmuser:tcmpassword@localhost:5432/tcmdb'
});

// Helper: query wrapper
async function query(text, params) {
  const client = await pool.connect();
  try {
    const res = await client.query(text, params);
    return res;
  } finally {
    client.release();
  }
}

/**
 * Projects
 */
router.get('/projects', async (req, res) => {
  try {
    const r = await query('SELECT * FROM projects ORDER BY id', []);
    res.json(r.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'DB error' });
  }
});

router.post('/projects', async (req, res) => {
  const { name, description } = req.body;
  if (!name) return res.status(400).json({ error: 'name is required' });
  try {
    const r = await query('INSERT INTO projects (name, description) VALUES ($1,$2) RETURNING *', [name, description || null]);
    res.status(201).json(r.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'DB error' });
  }
});

/**
 * Suites
 */
router.get('/projects/:projectId/suites', async (req, res) => {
  const projectId = parseInt(req.params.projectId);
  try {
    const r = await query('SELECT * FROM suites WHERE project_id = $1 ORDER BY id', [projectId]);
    res.json(r.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'DB error' });
  }
});

router.post('/projects/:projectId/suites', async (req, res) => {
  const projectId = parseInt(req.params.projectId);
  const { name, description } = req.body;
  if (!name) return res.status(400).json({ error: 'name required' });
  try {
    const r = await query('INSERT INTO suites (project_id, name, description) VALUES ($1,$2,$3) RETURNING *', [projectId, name, description || null]);
    res.status(201).json(r.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'DB error' });
  }
});

/**
 * Testcases
 */
router.get('/suites/:suiteId/testcases', async (req, res) => {
  const suiteId = parseInt(req.params.suiteId);
  try {
    const r = await query('SELECT * FROM testcases WHERE suite_id = $1 ORDER BY id', [suiteId]);
    res.json(r.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'DB error' });
  }
});

router.post('/suites/:suiteId/testcases', async (req, res) => {
  const suiteId = parseInt(req.params.suiteId);
  const { title, precondition, steps, expected } = req.body;
  if (!title) return res.status(400).json({ error: 'title required' });
  try {
    const r = await query(
      'INSERT INTO testcases (suite_id, title, precondition, steps, expected) VALUES ($1,$2,$3,$4,$5) RETURNING *',
      [suiteId, title, precondition || null, steps || null, expected || null]
    );
    res.status(201).json(r.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'DB error' });
  }
});

router.put('/testcases/:id', async (req, res) => {
  const id = parseInt(req.params.id);
  const { title, precondition, steps, expected } = req.body;
  try {
    const r = await query(
      `UPDATE testcases SET title=$1, precondition=$2, steps=$3, expected=$4, updated_at=NOW() WHERE id=$5 RETURNING *`,
      [title, precondition || null, steps || null, expected || null, id]
    );
    if (r.rowCount === 0) return res.status(404).json({ error: 'not found' });
    res.json(r.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'DB error' });
  }
});

router.delete('/testcases/:id', async (req, res) => {
  const id = parseInt(req.params.id);
  try {
    const r = await query('DELETE FROM testcases WHERE id=$1 RETURNING *', [id]);
    if (r.rowCount === 0) return res.status(404).json({ error: 'not found' });
    res.json({ deleted: true, testcase: r.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'DB error' });
  }
});

/**
 * Import testcases (JSON array)
 * POST /api/import/testcases?suiteId=1
 * body: [{title, precondition, steps, expected}, ...]
 */
router.post('/import/testcases', async (req, res) => {
  const suiteId = parseInt(req.query.suiteId || req.body.suiteId);
  const items = req.body.items || req.body;
  if (!suiteId) return res.status(400).json({ error: 'suiteId required (query or body)' });
  if (!Array.isArray(items)) return res.status(400).json({ error: 'body should be an array of testcases' });
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const inserted = [];
    for (const t of items) {
      const r = await client.query(
        'INSERT INTO testcases (suite_id, title, precondition, steps, expected) VALUES ($1,$2,$3,$4,$5) RETURNING *',
        [suiteId, t.title || 'Untitled', t.precondition || null, t.steps || null, t.expected || null]
      );
      inserted.push(r.rows[0]);
    }
    await client.query('COMMIT');
    res.json({ inserted });
  } catch (err) {
    await client.query('ROLLBACK');
    console.error(err);
    res.status(500).json({ error: 'DB error' });
  } finally {
    client.release();
  }
});

/**
 * Export testcases JSON (or CSV)
 * GET /api/export/testcases/:suiteId?format=json|csv
 */
router.get('/export/testcases/:suiteId', async (req, res) => {
  const suiteId = parseInt(req.params.suiteId);
  const fmt = (req.query.format || 'json').toLowerCase();
  try {
    const r = await query('SELECT * FROM testcases WHERE suite_id = $1 ORDER BY id', [suiteId]);
    const rows = r.rows;
    if (fmt === 'csv') {
      // basic CSV
      const header = ['id','title','precondition','steps','expected','created_at','updated_at'];
      const lines = [header.join(',')];
      for (const row of rows) {
        const esc = v => (v===null||v===undefined) ? '' : `"${String(v).replace(/"/g,'""')}"`;
        lines.push([row.id, row.title, row.precondition, row.steps, row.expected, row.created_at, row.updated_at].map(esc).join(','));
      }
      res.setHeader('Content-Type','text/csv');
      res.setHeader('Content-Disposition',`attachment; filename="testcases_suite_${suiteId}.csv"`);
      res.send(lines.join('\n'));
    } else {
      res.json(rows);
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'DB error' });
  }
});

module.exports = router;
