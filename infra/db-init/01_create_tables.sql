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
    updated_at TIMESTAMP DEFAULT NOW()
);
