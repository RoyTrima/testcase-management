import fs from "fs";
import { parse } from "csv-parse";
import db from "../db/index.js";

export const importTestcases = async (req, res) => {
  const client = await db.connect();

  let total = 0;
  let inserted = 0;
  let skipped = 0;
  const errors = [];

  try {
    const { suite_id } = req.body;

    if (!suite_id) {
      return res.status(400).json({ message: "suite_id is required" });
    }

    if (!req.file) {
      return res.status(400).json({ message: "CSV file is required" });
    }

    // pastikan suite ada
    const suiteCheck = await client.query(
      `SELECT id FROM suites WHERE id = $1`,
      [suite_id]
    );

    if (suiteCheck.rows.length === 0) {
      return res.status(404).json({ message: "Suite not found" });
    }

    // ===============================
    // READ CSV
    // ===============================
    const records = [];

    await new Promise((resolve, reject) => {
      fs.createReadStream(req.file.path)
        .pipe(parse({ columns: true, trim: true }))
        .on("data", (row) => records.push(row))
        .on("end", resolve)
        .on("error", reject);
    });

    total = records.length;

    await client.query("BEGIN");

    for (let i = 0; i < records.length; i++) {
      const row = records[i];
      const rowNumber = i + 1;

      // rule 1: title wajib
      if (!row.title) {
        skipped++;
        errors.push({
          row: rowNumber,
          reason: "title is empty",
        });
        continue;
      }

      // rule 2: prevent duplicate title in same suite
      const duplicate = await client.query(
        `
        SELECT id FROM testcases
        WHERE suite_id = $1 AND title = $2
        `,
        [suite_id, row.title]
      );

      if (duplicate.rows.length > 0) {
        skipped++;
        errors.push({
          row: rowNumber,
          reason: "duplicate title in same suite",
        });
        continue;
      }

      // insert
      await client.query(
        `
        INSERT INTO testcases
        (suite_id, title, expected_result, status, created_at, updated_at)
        VALUES ($1, $2, $3, 'draft', NOW(), NOW())
        `,
        [suite_id, row.title, row.expected_result || null]
      );

      inserted++;
    }

    await client.query("COMMIT");

    res.status(201).json({
      message: "Import finished",
      total,
      inserted,
      skipped,
      errors,
    });
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("importTestcases error:", error);

    res.status(500).json({
      message: "Failed to import testcases",
    });
  } finally {
    client.release();
    if (req.file?.path) fs.unlink(req.file.path, () => {});
  }
};
