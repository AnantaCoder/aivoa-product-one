CREATE TABLE IF NOT EXISTS complaints (
    id VARCHAR(36) PRIMARY KEY,
    ticket_number VARCHAR(50) UNIQUE,
    complaint_source VARCHAR(100),
    customer_name VARCHAR(200),
    product_name VARCHAR(200),
    product_strength VARCHAR(100),
    batch_number VARCHAR(100),
    manufacturing_date VARCHAR(50),
    expiry_date VARCHAR(50),
    quantity_affected VARCHAR(50),
    complaint_type VARCHAR(100),
    complaint_date VARCHAR(50),
    description TEXT,
    initial_severity VARCHAR(50),
    priority VARCHAR(50),
    status VARCHAR(50) DEFAULT 'Pending Triage',
    ai_summary TEXT,
    completeness_score INTEGER,
    missing_fields TEXT,
    risk_category VARCHAR(100),
    risk_rationale TEXT,
    suggested_capa TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_ticket_number ON complaints(ticket_number);
CREATE INDEX idx_batch_number ON complaints(batch_number);
CREATE INDEX idx_status ON complaints(status);
CREATE INDEX idx_created_at ON complaints(created_at);
