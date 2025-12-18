// backend/src/controllers/projectController.js
const db = require('../db');

// GET all projects
exports.getAllProjects = async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM projects ORDER BY id ASC');
    res.json(result.rows);
  } catch (err) {
    console.error('Error getting projects:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// GET project by ID
exports.getProjectById = async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM projects WHERE id = $1', [
      req.params.id,
    ]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Project not found' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error getting project:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// CREATE new project
exports.createProject = async (req, res) => {
  try {
    const { name } = req.body;

    const result = await db.query(
      'INSERT INTO projects (name) VALUES ($1) RETURNING *',
      [name]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Error creating project:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// UPDATE project
exports.updateProject = async (req, res) => {
  try {
    const { name } = req.body;

    const result = await db.query(
      'UPDATE projects SET name = $1 WHERE id = $2 RETURNING *',
      [name, req.params.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Project not found' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error updating project:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// DELETE project
exports.deleteProject = async (req, res) => {
  try {
    const result = await db.query(
      'DELETE FROM projects WHERE id = $1 RETURNING *',
      [req.params.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Project not found' });
    }

    res.json({ message: 'Project deleted' });
  } catch (err) {
    console.error('Error deleting project:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};
