import fs from "fs";
import { parse } from "csv-parse";
import db from "../db/index.js";

export const importTestcases = async (req, res) => {
  const client = await db.connect();

  let total = 0;
  let inserted = 0;
  let updated = 0;
  let skipped = 0;
  const errors = [];

  try {
    const { suite_id } = req.body;

    // ===============================
    // BASIC VALIDATION
    // ===============================
    if (!suite_id) {
      return res.status(400).json({ message: "suite_id is required" });
    }

    if (!req.file) {
      return res.status(400).json({ message: "CSV file is required" });
    }

    // cek suite exists
    const suiteCheck = await client.query(
      `SELECT id FROM suites WHERE id = $1`,
      [suite_id]
    );

    if (suiteCheck.rowCount === 0) {
      return res.status(404).json({ message: "Suite not found" });
    }

    // ===============================
    // READ CSV (NO STREAM — ANTI HANG)
    // ===============================
    const records = [];
    const fileContent = fs.readFileSync(req.file.path);

    await new Promise((resolve, reject) => {
      parse(
        fileContent,
        { columns: true, trim: true },
        (err, output) => {
          if (err) return reject(err);
          records.push(...output);
          resolve();
        }
      );
    });

    total = records.length;

    // ===============================
    // PROCESS ROW BY ROW (NO ROLLBACK)
    // ===============================
    for (let i = 0; i < records.length; i++) {
      const row = records[i];
      const rowNumber = i + 2; // header = row 1

      const id = row.id ? Number(row.id) : null;
      const title = row.title?.trim();
      const expectedResult = row.expected_result || null;

      // rule: title wajib
      if (!title) {
        skipped++;
        errors.push({
          row: rowNumber,
          reason: "title is required",
        });
        continue;
      }

      try {
        // ===============================
        // UPDATE BY ID
        // ===============================
        if (id) {
          const tc = await client.query(
            `SELECT id, suite_id FROM testcases WHERE id = $1`,
            [id]
          );

          if (tc.rowCount === 0) {
            skipped++;
            errors.push({
              row: rowNumber,
              reason: `testcase id ${id} not found`,
            });
            continue;
          }

          if (tc.rows[0].suite_id !== Number(suite_id)) {
            skipped++;
            errors.push({
              row: rowNumber,
              reason: `testcase id ${id} does not belong to this suite`,
            });
            continue;
          }

          // prevent duplicate title (exclude self)
          const duplicate = await client.query(
            `SELECT id FROM testcases
             WHERE suite_id = $1 AND title = $2 AND id <> $3`,
            [suite_id, title, id]
          );

          if (duplicate.rowCount > 0) {
            skipped++;
            errors.push({
              row: rowNumber,
              reason: `duplicate title "${title}" in this suite`,
            });
            continue;
          }

          await client.query(
            `UPDATE testcases
             SET title = $1,
                 expected_result = $2,
                 updated_at = NOW()
             WHERE id = $3`,
            [title, expectedResult, id]
          );

          updated++;
          continue;
        }

        // ===============================
        // INSERT
        // ===============================
        const duplicate = await client.query(
          `SELECT id FROM testcases
           WHERE suite_id = $1 AND title = $2`,
          [suite_id, title]
        );

        if (duplicate.rowCount > 0) {
          skipped++;
          errors.push({
            row: rowNumber,
            reason: `duplicate title "${title}" in this suite`,
          });
          continue;
        }

        await client.query(
          `INSERT INTO testcases
           (suite_id, title, expected_result, status, created_at, updated_at)
           VALUES ($1, $2, $3, 'draft', NOW(), NOW())`,
          [suite_id, title, expectedResult]
        );

        inserted++;
      } catch (err) {
        // DB unique constraint (safety net)
        if (err.code === "23505") {
          skipped++;
          errors.push({
            row: rowNumber,
            reason: "duplicate title in this suite (DB constraint)",
          });
          continue;
        }

        skipped++;
        errors.push({
          row: rowNumber,
          reason: err.message,
        });
      }
    }

    // ===============================
    // RESPONSE
    // ===============================
    return res.status(201).json({
      message: "Import finished",
      total,
      inserted,
      updated,
      skipped,
      errors,
    });
  } catch (error) {
    console.error("importTestcases fatal error:", error);
    return res.status(500).json({
      message: "Failed to import testcases",
    });
  } finally {
    client.release();
    if (req.file?.path) fs.unlink(req.file.path, () => {});
  }
};
