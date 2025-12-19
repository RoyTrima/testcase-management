// backend/src/controllers/testRunCaseController.js
import db from "../db/index.js";

export const addTestcasesToRun = async (req, res) => {
    const client = await db.connect();
  
    try {
      const { runId } = req.params;
      const { testcase_ids } = req.body;
  
      if (!Array.isArray(testcase_ids) || testcase_ids.length === 0) {
        return res.status(400).json({
          message: "testcase_ids must be a non-empty array",
        });
      }
  
      await client.query("BEGIN");
  
      for (const testcaseId of testcase_ids) {
        await client.query(
          `
          INSERT INTO test_run_cases (test_run_id, testcase_id)
          VALUES ($1, $2)
          ON CONFLICT (test_run_id, testcase_id) DO NOTHING
          `,
          [runId, testcaseId]
        );
      }
  
      await client.query("COMMIT");
  
      res.status(201).json({
        message: "Testcases added to test run",
      });
    } catch (error) {
      await client.query("ROLLBACK");
      console.error("addTestcasesToRun error:", error);
  
      res.status(500).json({
        message: "Failed to add testcases to run",
      });
    } finally {
      client.release();
    }
  };
  
/**
 * Get all testcases in a test run
 * GET /api/test-runs/:runId/cases
 */
export const getTestRunCases = async (req, res) => {
  try {
    const { runId } = req.params;

    const result = await db.query(
      `
      SELECT
        trc.id,
        trc.status,
        trc.actual_result,
        trc.executed_at,
        tc.id AS testcase_id,
        tc.title,
        tc.expected_result
      FROM test_run_cases trc
      JOIN testcases tc ON tc.id = trc.testcase_id
      WHERE trc.test_run_id = $1
      ORDER BY trc.id
      `,
      [runId]
    );

    res.json(result.rows);
  } catch (error) {
    console.error("getTestRunCases error:", error);
    res.status(500).json({ message: "Failed to fetch test run cases" });
  }
};

/**
 * Update execution result of a test case in a run
 * PATCH /api/test-runs/:runId/cases/:id
 * body: { status, actual_result }
 */
export const updateTestRunCase = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, actual_result } = req.body;

    const allowedStatus = ["untested", "passed", "failed", "blocked"];
    if (!allowedStatus.includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const result = await db.query(
      `
      UPDATE test_run_cases
      SET
        status = $1,
        actual_result = $2,
        executed_by = $3,
        executed_at = NOW(),
        updated_at = NOW()
      WHERE id = $4
      RETURNING *
      `,
      [status, actual_result || null, req.user.id, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Test run case not found" });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error("updateTestRunCase error:", error);
    res.status(500).json({ message: "Failed to update test run case" });
  }
};
