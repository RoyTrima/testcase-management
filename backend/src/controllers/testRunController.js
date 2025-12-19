// backend/src/controllers/testRunController.js
import db from "../db/index.js";

/**
 * Create Test Run
 * POST /api/test-runs
 */
export const createTestRun = async (req, res) => {
  try {
    const { project_id, name, description } = req.body;

    if (!project_id || !name) {
      return res.status(400).json({
        message: "project_id and name are required",
      });
    }

    const result = await db.query(
      `
      INSERT INTO test_runs (project_id, name, description, created_by)
      VALUES ($1, $2, $3, $4)
      RETURNING *
      `,
      [project_id, name, description || null, req.user.id]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("createTestRun error:", error);
    res.status(500).json({ message: "Failed to create test run" });
  }
};

/**
 * Get Test Runs by Project
 * GET /api/test-runs/project/:projectId
 */
export const getTestRunsByProject = async (req, res) => {
  try {
    const { projectId } = req.params;

    const result = await db.query(
      `
      SELECT tr.*, u.username AS created_by_name
      FROM test_runs tr
      LEFT JOIN users u ON u.id = tr.created_by
      WHERE tr.project_id = $1
      ORDER BY tr.created_at DESC
      `,
      [projectId]
    );

    res.json(result.rows);
  } catch (error) {
    console.error("getTestRunsByProject error:", error);
    res.status(500).json({ message: "Failed to fetch test runs" });
  }
};

/**
 * Get Test Run Detail
 * GET /api/test-runs/:id
 */
export const getTestRunById = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await db.query(
      `
      SELECT tr.*, u.username AS created_by_name
      FROM test_runs tr
      LEFT JOIN users u ON u.id = tr.created_by
      WHERE tr.id = $1
      `,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Test run not found" });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error("getTestRunById error:", error);
    res.status(500).json({ message: "Failed to fetch test run" });
  }
};

/**
 * Update Test Run Status
 * PATCH /api/test-runs/:id/status
 */
export const updateTestRunStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const allowedStatus = ["open", "completed", "archived"];
    if (!allowedStatus.includes(status)) {
      return res.status(400).json({
        message: "Invalid status",
      });
    }

    const result = await db.query(
      `
      UPDATE test_runs
      SET status = $1, updated_at = NOW()
      WHERE id = $2
      RETURNING *
      `,
      [status, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Test run not found" });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error("updateTestRunStatus error:", error);
    res.status(500).json({ message: "Failed to update test run status" });
  }
};
