-- ====================================
-- MINIMAL WITHDRAWALS TABLE (No ENUMs)
-- This creates the tables using VARCHAR instead of ENUMs
-- ====================================

-- Create withdrawals table
CREATE TABLE IF NOT EXISTS withdrawals (
    id SERIAL PRIMARY KEY,
    driver_id INTEGER NOT NULL REFERENCES drivers(id) ON DELETE CASCADE,
    
    -- Amount details
    amount DECIMAL(10,2) NOT NULL,
    platform_commission DECIMAL(10,2) NOT NULL DEFAULT 0,
    net_amount DECIMAL(10,2) NOT NULL,
    
    -- Withdrawal method (using VARCHAR instead of ENUM)
    withdrawal_method VARCHAR(20) NOT NULL,
    mobile_number VARCHAR(20) NOT NULL,
    account_name VARCHAR(100),
    
    -- Status and tracking (using VARCHAR instead of ENUM)
    status VARCHAR(20) DEFAULT 'pending',
    frequency VARCHAR(20) NOT NULL,
    
    -- External transaction details
    transaction_id VARCHAR(100) UNIQUE,
    external_payment_id VARCHAR(100),
    
    -- Timestamps
    requested_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    processing_at TIMESTAMP,
    completed_at TIMESTAMP,
    failed_at TIMESTAMP,
    
    -- Error handling
    error_message TEXT,
    retry_count INTEGER DEFAULT 0,
    
    -- Metadata
    notes TEXT
);

CREATE INDEX IF NOT EXISTS idx_withdrawals_driver_id ON withdrawals(driver_id);
CREATE INDEX IF NOT EXISTS idx_withdrawals_status ON withdrawals(status);
CREATE INDEX IF NOT EXISTS idx_withdrawals_created_at ON withdrawals(requested_at);
CREATE INDEX IF NOT EXISTS idx_withdrawals_transaction_id ON withdrawals(transaction_id);

-- Create driver_withdrawal_settings table
CREATE TABLE IF NOT EXISTS driver_withdrawal_settings (
    id SERIAL PRIMARY KEY,
    driver_id INTEGER UNIQUE NOT NULL REFERENCES drivers(id) ON DELETE CASCADE,
    
    -- Preferred withdrawal method (using VARCHAR instead of ENUM)
    preferred_method VARCHAR(20) NOT NULL,
    preferred_mobile_number VARCHAR(20) NOT NULL,
    account_name VARCHAR(100),
    
    -- Auto-withdrawal settings
    auto_withdraw_enabled BOOLEAN DEFAULT false,
    auto_withdraw_frequency VARCHAR(20) DEFAULT 'weekly',
    minimum_withdraw_amount DECIMAL(10,2) DEFAULT 5000,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_withdrawal_settings_driver_id ON driver_withdrawal_settings(driver_id);

-- Verify tables were created
SELECT 
    'withdrawals' as table_name,
    CASE WHEN EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'withdrawals') 
    THEN '✅ EXISTS' ELSE '❌ MISSING' END as status
UNION ALL
SELECT 'driver_withdrawal_settings',
    CASE WHEN EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'driver_withdrawal_settings') 
    THEN '✅ EXISTS' ELSE '❌ MISSING' END
ORDER BY table_name;
