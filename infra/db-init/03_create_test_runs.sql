-- =========================
-- TABLE: test_runs
-- =========================
CREATE TABLE IF NOT EXISTS test_runs (
  id SERIAL PRIMARY KEY,

  project_id INTEGER NOT NULL
    REFERENCES projects(id)
    ON DELETE CASCADE,

  name VARCHAR(255) NOT NULL,
  description TEXT,

  status VARCHAR(20) DEFAULT 'open',
  -- open | completed | archived

  created_by INTEGER
    REFERENCES users(id),

  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_test_runs_project
  ON test_runs(project_id);

-- =========================
-- TABLE: test_run_cases
-- =========================
CREATE TABLE IF NOT EXISTS test_run_cases (
  id SERIAL PRIMARY KEY,

  test_run_id INTEGER NOT NULL
    REFERENCES test_runs(id)
    ON DELETE CASCADE,

  testcase_id INTEGER NOT NULL
    REFERENCES testcases(id)
    ON DELETE CASCADE,

  status VARCHAR(20) DEFAULT 'untested',
  -- untested | passed | failed | blocked

  actual_result TEXT,

  executed_by INTEGER
    REFERENCES users(id),

  executed_at TIMESTAMP,

  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),

  UNIQUE (test_run_id, testcase_id)
);

CREATE INDEX IF NOT EXISTS idx_test_run_cases_run
  ON test_run_cases(test_run_id);

CREATE INDEX IF NOT EXISTS idx_test_run_cases_status
  ON test_run_cases(status);

