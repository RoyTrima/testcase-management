-- ===========================
-- 1. Insert User Admin
-- ===========================
INSERT INTO users (username, password)
VALUES ('admin', '$2a$10$B5cYb0AELQxBvVx4FfPpUOZ3Y42FQUVxEqWQKSDXz1JK5vuvx26Oq') 
-- password = admin123 (bcrypt)
ON CONFLICT (username) DO NOTHING;


-- ===========================
-- 2. Insert Project Default
-- ===========================
INSERT INTO projects (name, description)
VALUES ('Project Automation', 'Default project for test case management')
ON CONFLICT DO NOTHING;


-- ===========================
-- 3. Insert Suites Default
-- ===========================
INSERT INTO suites (project_id, name, description)
VALUES 
  (1, 'Smoke Test', 'Basic sanity test suite'),
  (1, 'Regression Test', 'Full regression suite')
ON CONFLICT DO NOTHING;
