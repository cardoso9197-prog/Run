-- Migration: Create business accounts and invoice system
-- Date: 2026-01-29

-- Create business_accounts table
CREATE TABLE IF NOT EXISTS business_accounts (
  id SERIAL PRIMARY KEY,
  passenger_id INTEGER NOT NULL REFERENCES passengers(id) ON DELETE CASCADE,
  company_name VARCHAR(255) NOT NULL,
  tax_id VARCHAR(50) UNIQUE,
  company_address TEXT,
  company_phone VARCHAR(20),
  company_email VARCHAR(255),
  business_type VARCHAR(100),
  invoice_email VARCHAR(255) NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create invoices table
CREATE TABLE IF NOT EXISTS invoices (
  id SERIAL PRIMARY KEY,
  invoice_number VARCHAR(50) UNIQUE NOT NULL,
  business_account_id INTEGER NOT NULL REFERENCES business_accounts(id) ON DELETE CASCADE,
  ride_id INTEGER NOT NULL REFERENCES rides(id) ON DELETE CASCADE,
  passenger_id INTEGER NOT NULL REFERENCES passengers(id) ON DELETE CASCADE,
  driver_id INTEGER NOT NULL REFERENCES drivers(id),
  
  -- Invoice details
  issue_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  due_date TIMESTAMP,
  
  -- Trip details
  pickup_address TEXT,
  dropoff_address TEXT,
  trip_date TIMESTAMP,
  distance_km DECIMAL(10, 2),
  
  -- Financial details
  subtotal DECIMAL(10, 2) NOT NULL,
  tax_rate DECIMAL(5, 2) DEFAULT 0.00,
  tax_amount DECIMAL(10, 2) DEFAULT 0.00,
  total_amount DECIMAL(10, 2) NOT NULL,
  currency VARCHAR(10) DEFAULT 'XOF',
  
  -- Payment info
  payment_method VARCHAR(50),
  payment_status VARCHAR(50) DEFAULT 'paid',
  
  -- Invoice status
  status VARCHAR(50) DEFAULT 'issued', -- issued, sent, paid, cancelled
  sent_to_email BOOLEAN DEFAULT false,
  email_sent_at TIMESTAMP,
  
  -- PDF storage
  pdf_url TEXT,
  pdf_generated BOOLEAN DEFAULT false,
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create invoice_items table (for detailed breakdown)
CREATE TABLE IF NOT EXISTS invoice_items (
  id SERIAL PRIMARY KEY,
  invoice_id INTEGER NOT NULL REFERENCES invoices(id) ON DELETE CASCADE,
  description TEXT NOT NULL,
  quantity DECIMAL(10, 2) DEFAULT 1,
  unit_price DECIMAL(10, 2) NOT NULL,
  amount DECIMAL(10, 2) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_business_accounts_passenger_id ON business_accounts(passenger_id);
CREATE INDEX IF NOT EXISTS idx_business_accounts_tax_id ON business_accounts(tax_id);
CREATE INDEX IF NOT EXISTS idx_invoices_business_account_id ON invoices(business_account_id);
CREATE INDEX IF NOT EXISTS idx_invoices_ride_id ON invoices(ride_id);
CREATE INDEX IF NOT EXISTS idx_invoices_invoice_number ON invoices(invoice_number);
CREATE INDEX IF NOT EXISTS idx_invoices_issue_date ON invoices(issue_date);
CREATE INDEX IF NOT EXISTS idx_invoice_items_invoice_id ON invoice_items(invoice_id);

-- Add trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_business_accounts_updated_at BEFORE UPDATE ON business_accounts 
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_invoices_updated_at BEFORE UPDATE ON invoices 
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert sample business account (optional - for testing)
-- INSERT INTO business_accounts (passenger_id, company_name, tax_id, company_email, invoice_email)
-- VALUES (1, 'Test Company Ltd', 'TAX123456', 'company@test.com', 'invoices@test.com');

COMMIT;
