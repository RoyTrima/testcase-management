import pool from '../db/index.js';

export const getTestcases = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM testcases ORDER BY id DESC');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error fetching testcases' });
  }
};

export const createTestcase = async (req, res) => {
  try {
    const { title, description, status } = req.body;
    const result = await pool.query(
      `INSERT INTO testcases (title, description, status) VALUES ($1, $2, $3) RETURNING *`,
      [title, description, status]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error creating testcase' });
  }
};

// update testcase by id
export const updateTestcase = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, status } = req.body;
    const result = await pool.query(
      `UPDATE testcases SET title=$1, description=$2, status=$3 WHERE id=$4 RETURNING *`,
      [title, description, status, id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error updating testcase' });
  }
};

// delete testcase by id
export const deleteTestcase = async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query(`DELETE FROM testcases WHERE id=$1`, [id]);
    res.json({ message: 'Testcase deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error deleting testcase' });
  }
};
