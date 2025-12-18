import pool from "../db.js";

export const getSuitesByProject = async (req, res) => {
  try {
    const projectId = req.params.projectId;

    const result = await pool.query(
      "SELECT * FROM suites WHERE project_id = $1",
      [projectId]
    );

    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching suites:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
