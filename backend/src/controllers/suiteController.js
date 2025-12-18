import pool from "../db/index.js";

export const getSuitesByProject = async (req, res) => {
  const { projectId } = req.params;

  try {
    const result = await pool.query(
      "SELECT * FROM suites WHERE project_id = $1 ORDER BY id ASC",
      [projectId]
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getSuiteById = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      "SELECT * FROM suites WHERE id = $1",
      [id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const createSuite = async (req, res) => {
  const { project_id, name } = req.body;

  try {
    const result = await pool.query(
      "INSERT INTO suites (project_id, name) VALUES ($1, $2) RETURNING *",
      [project_id, name]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
