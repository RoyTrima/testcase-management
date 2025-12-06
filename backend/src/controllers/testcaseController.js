import pool from '../db/index.js';

// Get all testcases by user
export const getTestcases = async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM testcases WHERE created_by = $1',
      [req.user.id]
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Create testcase
export const createTestcase = async (req, res) => {
  try {
    const { title, description, status } = req.body;
    const result = await pool.query(
      `INSERT INTO testcases (title, description, status, created_by) 
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [title, description, status, req.user.id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update testcase by id
export const updateTestcase = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, status } = req.body;
    const result = await pool.query(
      `UPDATE testcases SET title=$1, description=$2, status=$3 WHERE id=$4 AND created_by=$5 RETURNING *`,
      [title, description, status, id, req.user.id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Delete testcase by id
export const deleteTestcase = async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query(
      `DELETE FROM testcases WHERE id=$1 AND created_by=$2`,
      [id, req.user.id]
    );
    res.json({ message: 'Testcase deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
