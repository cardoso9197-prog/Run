-- Migration: Create withdrawals table
-- Date: December 20, 2025
-- Purpose: Allow drivers to withdraw earnings through Orange Money or MTN

-- Create withdrawal status ENUM
DO $$ BEGIN
    CREATE TYPE withdrawal_status AS ENUM ('pending', 'processing', 'completed', 'failed', 'cancelled');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Create withdrawal frequency ENUM
DO $$ BEGIN
    CREATE TYPE withdrawal_frequency AS ENUM ('daily', 'weekly');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- ====================================
-- Withdrawals Table
-- ====================================
CREATE TABLE IF NOT EXISTS withdrawals (
    id SERIAL PRIMARY KEY,
    driver_id INTEGER NOT NULL REFERENCES drivers(id) ON DELETE CASCADE,
    
    -- Amount details
    amount DECIMAL(10,2) NOT NULL,
    platform_commission DECIMAL(10,2) NOT NULL DEFAULT 0,
    net_amount DECIMAL(10,2) NOT NULL, -- Amount after commission
    
    -- Withdrawal method
    withdrawal_method payment_method NOT NULL, -- orange_money or mtn_momo
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

-- ====================================
-- Driver Withdrawal Settings Table
-- ====================================
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
    minimum_withdraw_amount DECIMAL(10,2) DEFAULT 5000, -- 5000 XOF minimum
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_withdrawal_settings_driver_id ON driver_withdrawal_settings(driver_id);

-- ====================================
-- Add available_balance to drivers table
-- ====================================
DO $$ 
BEGIN
    -- Add available_balance column if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'drivers' AND column_name = 'available_balance'
    ) THEN
        ALTER TABLE drivers ADD COLUMN available_balance DECIMAL(10,2) DEFAULT 0;
        -- Initialize with total_earnings for existing drivers
        UPDATE drivers SET available_balance = COALESCE(total_earnings, 0) WHERE total_earnings > 0;
    END IF;
    
    -- Add pending_withdrawals column if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'drivers' AND column_name = 'pending_withdrawals'
    ) THEN
        ALTER TABLE drivers ADD COLUMN pending_withdrawals DECIMAL(10,2) DEFAULT 0;
    END IF;
END $$;

-- ====================================
-- Verification Query
-- ====================================
SELECT 
    'withdrawals' as table_name,
    CASE WHEN EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'withdrawals') 
    THEN '✅ EXISTS' ELSE '❌ MISSING' END as status
UNION ALL
SELECT 'driver_withdrawal_settings',
    CASE WHEN EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'driver_withdrawal_settings') 
    THEN '✅ EXISTS' ELSE '❌ MISSING' END
UNION ALL
SELECT 'available_balance column',
    CASE WHEN EXISTS (SELECT FROM information_schema.columns WHERE table_name = 'drivers' AND column_name = 'available_balance') 
    THEN '✅ EXISTS' ELSE '❌ MISSING' END
UNION ALL
SELECT 'pending_withdrawals column',
    CASE WHEN EXISTS (SELECT FROM information_schema.columns WHERE table_name = 'drivers' AND column_name = 'pending_withdrawals') 
    THEN '✅ EXISTS' ELSE '❌ MISSING' END
ORDER BY table_name;
