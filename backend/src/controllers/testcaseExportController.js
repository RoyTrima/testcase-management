// backend/src/controllers/testcaseExportController.js
import db from "../db/index.js";
import { Parser } from "json2csv";

export const exportTestcases = async (req, res) => {
  try {
    console.log("EXPORT TESTCASES START");

    const result = await db.query(`
      SELECT
        id,
        title,
        expected_result
      FROM testcases
      ORDER BY id
    `);

    console.log("ROWS:", result.rows.length);

    const parser = new Parser({
      fields: ["id", "title", "expected_result"],
    });

    const csv = parser.parse(result.rows);

    res.setHeader("Content-Type", "text/csv");
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=testcases_export.csv"
    );

    return res.status(200).send(csv);
  } catch (error) {
    console.error("exportTestcases error:", error);
    return res.status(500).json({
      message: "Failed to export testcases",
    });
  }
};
