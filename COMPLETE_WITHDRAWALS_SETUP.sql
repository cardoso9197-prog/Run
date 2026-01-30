-- ====================================
-- COMPLETE WITHDRAWALS TABLE SETUP
-- Run this ENTIRE script in DBeaver
-- ====================================

-- STEP 1: Create payment_method ENUM (REQUIRED!)
DO $$ BEGIN
    CREATE TYPE payment_method AS ENUM ('orange_money', 'mtn_momo');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- STEP 2: Create withdrawal status ENUM
DO $$ BEGIN
    CREATE TYPE withdrawal_status AS ENUM ('pending', 'processing', 'completed', 'failed', 'cancelled');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- STEP 3: Create withdrawal frequency ENUM
DO $$ BEGIN
    CREATE TYPE withdrawal_frequency AS ENUM ('daily', 'weekly');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- STEP 4: Create withdrawals table
CREATE TABLE IF NOT EXISTS withdrawals (
    id SERIAL PRIMARY KEY,
    driver_id INTEGER NOT NULL REFERENCES drivers(id) ON DELETE CASCADE,
    
    -- Amount details
    amount DECIMAL(10,2) NOT NULL,
    platform_commission DECIMAL(10,2) NOT NULL DEFAULT 0,
    net_amount DECIMAL(10,2) NOT NULL,
    
    -- Withdrawal method
    withdrawal_method payment_method NOT NULL,
    mobile_number VARCHAR(20) NOT NULL,
    account_name VARCHAR(100),
    
    -- Status and tracking
    status withdrawal_status DEFAULT 'pending',
    frequency withdrawal_frequency NOT NULL,
    
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

-- STEP 5: Create driver_withdrawal_settings table
CREATE TABLE IF NOT EXISTS driver_withdrawal_settings (
    id SERIAL PRIMARY KEY,
    driver_id INTEGER UNIQUE NOT NULL REFERENCES drivers(id) ON DELETE CASCADE,
    
    -- Preferred withdrawal method
    preferred_method payment_method NOT NULL,
    preferred_mobile_number VARCHAR(20) NOT NULL,
    account_name VARCHAR(100),
    
    -- Auto-withdrawal settings
    auto_withdraw_enabled BOOLEAN DEFAULT false,
    auto_withdraw_frequency withdrawal_frequency DEFAULT 'weekly',
    minimum_withdraw_amount DECIMAL(10,2) DEFAULT 5000,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_withdrawal_settings_driver_id ON driver_withdrawal_settings(driver_id);

-- STEP 6: Verify everything was created
SELECT 
    'payment_method ENUM' as item,
    CASE WHEN EXISTS (SELECT FROM pg_type WHERE typname = 'payment_method') 
    THEN '✅ EXISTS' ELSE '❌ MISSING' END as status
UNION ALL
SELECT 'withdrawal_status ENUM',
    CASE WHEN EXISTS (SELECT FROM pg_type WHERE typname = 'withdrawal_status') 
    THEN '✅ EXISTS' ELSE '❌ MISSING' END
UNION ALL
SELECT 'withdrawal_frequency ENUM',
    CASE WHEN EXISTS (SELECT FROM pg_type WHERE typname = 'withdrawal_frequency') 
    THEN '✅ EXISTS' ELSE '❌ MISSING' END
UNION ALL
SELECT 'withdrawals table',
    CASE WHEN EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'withdrawals') 
    THEN '✅ EXISTS' ELSE '❌ MISSING' END
UNION ALL
SELECT 'driver_withdrawal_settings table',
    CASE WHEN EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'driver_withdrawal_settings') 
    THEN '✅ EXISTS' ELSE '❌ MISSING' END
ORDER BY item;
