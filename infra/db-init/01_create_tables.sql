CREATE DATABASE app;

-- Create table users
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(50) UNIQUE NOT NULL,
  password TEXT NOT NULL
);

-- ALTER TABLE testcases
-- ADD COLUMN IF NOT EXISTS created_by INT REFERENCES users(id);


-- Create table testcases
CREATE TABLE IF NOT EXISTS testcases (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    severity VARCHAR(20),          
    priority VARCHAR(20),          
    status VARCHAR(20) DEFAULT 'draft', 
    expected_result TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    created_by INT REFERENCES users(id)
);

-- Create table projects
CREATE TABLE IF NOT EXISTS projects (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT
);

-- Create table suites
CREATE TABLE IF NOT EXISTS suites (
  id SERIAL PRIMARY KEY,
  project_id INT REFERENCES projects(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  description TEXT
);
