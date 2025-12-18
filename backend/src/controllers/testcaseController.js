import pool from "../db/index.js";

// GET all
export const getTestcases = async (req, res) => {
  const result = await pool.query("SELECT * FROM testcases ORDER BY id");
  res.json(result.rows);
};

// GET by id
export const getTestcaseById = async (req, res) => {
  const { id } = req.params;
  const result = await pool.query(
    "SELECT * FROM testcases WHERE id = $1",
    [id]
  );
  res.json(result.rows[0]);
};

// CREATE
// export const createTestcase = async (req, res) => {
//   const { title, suite_id } = req.body;
//   const result = await pool.query(
//     "INSERT INTO testcases (title, suite_id) VALUES ($1, $2) RETURNING *",
//     [title, suite_id]
//   );
//   res.status(201).json(result.rows[0]);
// };
export const createTestcase = async (req, res) => {
  const { suite_id, title, description, expected_result, severity, priority } = req.body;
  const userId = req.user.id;

  try {
    const result = await pool.query(
      `
      INSERT INTO testcases
      (suite_id, title, description, expected_result, severity, priority, created_by)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *
      `,
      [suite_id, title, description, expected_result, severity, priority, userId]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};


// UPDATE
export const updateTestcase = async (req, res) => {
  const { id } = req.params;
  const { title } = req.body;

  const result = await pool.query(
    "UPDATE testcases SET title=$1 WHERE id=$2 RETURNING *",
    [title, id]
  );

  res.json(result.rows[0]);
};

// DELETE  ⬅️ INI YANG TADI HILANG
export const deleteTestcase = async (req, res) => {
  const { id } = req.params;

  await pool.query(
    "DELETE FROM testcases WHERE id=$1",
    [id]
  );

  res.json({ message: "Testcase deleted" });
};
