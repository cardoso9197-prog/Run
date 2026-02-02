# 🔧 Payment Methods Issue - Fix Guide

**Date:** December 21, 2025  
**Issue:** Passenger app fails to add payment methods (cards and mobile money)  
**Status:** 🔍 INVESTIGATING

---

## 🐛 Problems Reported

### 1. Add Card Failed
**Issue:** In passenger app, "Add Payment Method" → Card fails to add

### 2. Orange Money Failed  
**Issue:** Orange Money mobile money account fails to add

### 3. MTN Mobile Money - Unknown
**Request:** Check MTN add mobile money account functionality

---

## 🔍 Investigation

### Backend Code Review:

#### File: `backend/routes/paymentMethods.js`

**GET /api/payment-methods** ✅ (Lines 18-60)
- Retrieves all payment methods for logged-in user
- Filters by `is_active = true`
- Returns card details (last 4 digits, brand) and mobile money details

**POST /api/payment-methods/card** ✅ (Lines 64-151)
- Adds Visa/Mastercard
- Validates:
  - Card number length (min 13 digits)
  - Card brand (Visa starts with 4, Mastercard starts with 5[1-5])
  - Expiry date (not expired)
- Encrypts card token
- Sets as default if it's the first payment method
- **Requires columns:** user_id, type, card_token, card_last_four, card_brand, cardholder_name, expiry_month, expiry_year, is_default

**POST /api/payment-methods/mobile** ✅ (Lines 154-222)
- Adds Orange Money or MTN Mobile Money
- Validates:
  - Type must be 'orange_money' or 'mtn_momo'
  - Phone format: `+245XXXXXXXXX` (Guinea Bissau)
  - No duplicate mobile numbers
- Sets as default if it's the first payment method
- **Requires columns:** user_id, type, mobile_number, account_name, is_default

---

## 🗃️ Database Schema

### Required Table: `payment_methods`

```sql
CREATE TABLE payment_methods (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    type payment_method NOT NULL,
    -- For card payments
    card_token TEXT,
    card_last_four VARCHAR(4),
    card_brand VARCHAR(20),
    cardholder_name VARCHAR(100),
    expiry_month INTEGER,
    expiry_year INTEGER,
    -- For mobile money
    mobile_number VARCHAR(20),
    account_name VARCHAR(100),
    -- Management
    is_default BOOLEAN DEFAULT false,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    -- Constraints
    CONSTRAINT valid_card_payment CHECK (
        type != 'card' OR (
            card_token IS NOT NULL AND 
            card_last_four IS NOT NULL AND 
            card_brand IS NOT NULL AND
            expiry_month IS NOT NULL AND
            expiry_year IS NOT NULL
        )
    ),
    CONSTRAINT valid_mobile_payment CHECK (
        type = 'card' OR mobile_number IS NOT NULL
    )
);
```

### Required ENUM: `payment_method`

```sql
CREATE TYPE payment_method AS ENUM ('card', 'orange_money', 'mtn_momo');
```

### Required Indexes:

```sql
CREATE INDEX idx_payment_methods_user ON payment_methods(user_id);
CREATE INDEX idx_payment_methods_active ON payment_methods(user_id, is_active);
CREATE INDEX idx_payment_methods_default ON payment_methods(user_id, is_default);
```

---

## 🔧 Possible Causes

### 1. Table Doesn't Exist
**Symptom:** Error: `relation "payment_methods" does not exist`  
**Fix:** Run migration to create table

### 2. ENUM Type Missing
**Symptom:** Error: `type "payment_method" does not exist`  
**Fix:** Create ENUM before table

### 3. Column Mismatch
**Symptom:** Error: `column "mobile_number" does not exist`  
**Fix:** Alter table to add missing columns

### 4. Constraint Violation
**Symptom:** Error: `new row violates check constraint "valid_mobile_payment"`  
**Fix:** Ensure mobile_number is provided for mobile money types

### 5. Authentication Issue
**Symptom:** Error: `Authentication failed`  
**Fix:** Check token is valid and user is logged in

### 6. Phone Format Invalid
**Symptom:** Error: `Invalid phone number format`  
**Fix:** Ensure format is `+245XXXXXXXXX`

---

## 🚀 Solutions

### Solution 1: Create Payment Methods Table

Run this migration script on Railway database:

```javascript
// add-payment-methods-table.js
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

async function addPaymentMethodsTable() {
  // 1. Create ENUM
  await pool.query(`
    DO $$ BEGIN
      CREATE TYPE payment_method AS ENUM ('card', 'orange_money', 'mtn_momo');
    EXCEPTION
      WHEN duplicate_object THEN null;
    END $$;
  `);

  // 2. Create Table
  await pool.query(`
    CREATE TABLE IF NOT EXISTS payment_methods (
      id SERIAL PRIMARY KEY,
      user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      type payment_method NOT NULL,
      card_token TEXT,
      card_last_four VARCHAR(4),
      card_brand VARCHAR(20),
      cardholder_name VARCHAR(100),
      expiry_month INTEGER,
      expiry_year INTEGER,
      mobile_number VARCHAR(20),
      account_name VARCHAR(100),
      is_default BOOLEAN DEFAULT false,
      is_active BOOLEAN DEFAULT true,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      CONSTRAINT valid_card_payment CHECK (
        type != 'card' OR (
          card_token IS NOT NULL AND 
          card_last_four IS NOT NULL AND 
          card_brand IS NOT NULL AND
          expiry_month IS NOT NULL AND
          expiry_year IS NOT NULL
        )
      ),
      CONSTRAINT valid_mobile_payment CHECK (
        type = 'card' OR mobile_number IS NOT NULL
      )
    );
  `);

  // 3. Create Indexes
  await pool.query(`
    CREATE INDEX IF NOT EXISTS idx_payment_methods_user ON payment_methods(user_id);
    CREATE INDEX IF NOT EXISTS idx_payment_methods_active ON payment_methods(user_id, is_active);
    CREATE INDEX IF NOT EXISTS idx_payment_methods_default ON payment_methods(user_id, is_default);
  `);

  await pool.end();
  console.log('✅ Payment methods table created!');
}

addPaymentMethodsTable().catch(console.error);
```

**Run with:**
```bash
node add-payment-methods-table.js
```

---

### Solution 2: Test API Endpoints

#### Test 1: Get Payment Methods
```powershell
$headers = @{ "Authorization" = "Bearer YOUR_PASSENGER_TOKEN" }
Invoke-RestMethod -Uri "https://zippy-healing-production-24e4.up.railway.app/api/payment-methods" -Method GET -Headers $headers | ConvertTo-Json
```

**Expected Response:**
```json
{
  "success": true,
  "paymentMethods": []
}
```

#### Test 2: Add Orange Money
```powershell
$headers = @{ "Authorization" = "Bearer YOUR_PASSENGER_TOKEN"; "Content-Type" = "application/json" }
$body = @{
  type = "orange_money"
  mobileNumber = "+245955123456"
  accountName = "My Orange Account"
} | ConvertTo-Json

Invoke-RestMethod -Uri "https://zippy-healing-production-24e4.up.railway.app/api/payment-methods/mobile" -Method POST -Headers $headers -Body $body | ConvertTo-Json
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Orange Money added successfully",
  "paymentMethod": {
    "id": 1,
    "type": "orange_money",
    "mobileNumber": "+245955123456",
    "isDefault": true,
    "createdAt": "2025-12-21T..."
  }
}
```

#### Test 3: Add MTN Mobile Money
```powershell
$headers = @{ "Authorization" = "Bearer YOUR_PASSENGER_TOKEN"; "Content-Type" = "application/json" }
$body = @{
  type = "mtn_momo"
  mobileNumber = "+245966789012"
  accountName = "My MTN Account"
} | ConvertTo-Json

Invoke-RestMethod -Uri "https://zippy-healing-production-24e4.up.railway.app/api/payment-methods/mobile" -Method POST -Headers $headers -Body $body | ConvertTo-Json
```

**Expected Response:**
```json
{
  "success": true,
  "message": "MTN Mobile Money added successfully",
  "paymentMethod": {
    "id": 2,
    "type": "mtn_momo",
    "mobileNumber": "+245966789012",
    "isDefault": false,
    "createdAt": "2025-12-21T..."
  }
}
```

#### Test 4: Add Card
```powershell
$headers = @{ "Authorization" = "Bearer YOUR_PASSENGER_TOKEN"; "Content-Type" = "application/json" }
$body = @{
  cardNumber = "4242424242424242"
  cardholderName = "Test User"
  expiryMonth = 12
  expiryYear = 2026
  cvv = "123"
} | ConvertTo-Json

Invoke-RestMethod -Uri "https://zippy-healing-production-24e4.up.railway.app/api/payment-methods/card" -Method POST -Headers $headers -Body $body | ConvertTo-Json
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Card added successfully",
  "paymentMethod": {
    "id": 3,
    "type": "card",
    "cardLastFour": "4242",
    "cardBrand": "visa",
    "isDefault": false,
    "createdAt": "2025-12-21T..."
  }
}
```

---

## 🧪 Testing Checklist

### Backend Tests:
- [ ] payment_methods table exists
- [ ] payment_method ENUM exists with values: card, orange_money, mtn_momo
- [ ] All required columns present
- [ ] Indexes created
- [ ] GET /api/payment-methods returns empty array for new user
- [ ] POST /api/payment-methods/card successfully adds card
- [ ] POST /api/payment-methods/mobile with orange_money succeeds
- [ ] POST /api/payment-methods/mobile with mtn_momo succeeds
- [ ] First payment method is set as default automatically
- [ ] Duplicate mobile numbers are rejected
- [ ] Invalid phone formats are rejected
- [ ] Invalid card brands are rejected
- [ ] Expired cards are rejected

### Mobile App Tests (Passenger):
- [ ] "Add Payment Method" screen loads
- [ ] Can select "Card" option
- [ ] Can enter card details
- [ ] Card validation works (Luhn algorithm if implemented)
- [ ] Can select "Orange Money" option
- [ ] Can enter Orange Money mobile number
- [ ] Can select "MTN Mobile Money" option
- [ ] Can enter MTN mobile number
- [ ] Success message shows after adding
- [ ] New payment method appears in list
- [ ] Can set payment method as default
- [ ] Can delete payment method

---

## 📝 Error Messages Guide

| Error Message | Cause | Fix |
|---------------|-------|-----|
| "relation 'payment_methods' does not exist" | Table not created | Run migration script |
| "type 'payment_method' does not exist" | ENUM not created | Create ENUM first |
| "Invalid mobile money type" | Wrong type value | Use 'orange_money' or 'mtn_momo' |
| "Invalid phone number format" | Wrong format | Use +245XXXXXXXXX |
| "This mobile number is already added" | Duplicate | Use different number or remove existing |
| "Only Visa and Mastercard are supported" | Wrong card brand | Use Visa (4xxx) or Mastercard (5[1-5]xxx) |
| "Card has expired" | Expired card | Use valid future expiry date |
| "Invalid card number" | Too short | Use at least 13 digits |
| "Authentication failed" | No/invalid token | Login first |

---

## 🚀 Quick Fix Steps

1. **Check if table exists:**
   ```sql
   SELECT EXISTS (
     SELECT FROM information_schema.tables 
     WHERE table_name = 'payment_methods'
   );
   ```

2. **If table doesn't exist, create it:**
   ```bash
   node add-payment-methods-table.js
   ```

3. **Test with passenger account:**
   - Login as passenger
   - Try adding Orange Money
   - Try adding MTN Mobile Money
   - Try adding Card

4. **Check Railway logs for errors:**
   - Go to Railway dashboard
   - Open backend service
   - Check Deployments → Logs
   - Look for payment-related errors

5. **Fix any schema mismatches:**
   - Compare local schema.sql with Railway database
   - Run necessary ALTER TABLE commands

---

## 📊 Expected Flow

### Adding Orange Money:
```
Passenger App → Add Payment Method → Select Orange Money
→ Enter +245955123456 → Submit
→ API POST /api/payment-methods/mobile
→ Validate phone format
→ Check not duplicate
→ Insert into payment_methods
→ Return success with payment method details
→ App shows "Orange Money added successfully"
→ Payment method appears in list
```

### Adding MTN Mobile Money:
```
Passenger App → Add Payment Method → Select MTN Mobile Money
→ Enter +245966789012 → Submit
→ API POST /api/payment-methods/mobile
→ Validate phone format
→ Check not duplicate
→ Insert into payment_methods
→ Return success with payment method details
→ App shows "MTN Mobile Money added successfully"
→ Payment method appears in list
```

### Adding Card:
```
Passenger App → Add Payment Method → Select Card
→ Enter card details (number, name, expiry, CVV) → Submit
→ API POST /api/payment-methods/card
→ Validate card number (13+ digits)
→ Detect brand (Visa/Mastercard)
→ Check not expired
→ Encrypt and tokenize
→ Insert into payment_methods
→ Return success with masked card details
→ App shows "Card added successfully"
→ Card appears in list (****4242)
```

---

## 🔐 Security Notes

- Card numbers are never stored (only tokens and last 4 digits)
- CVV is never stored (used only for tokenization)
- Mobile money account names are optional
- Payment methods are soft-deleted (is_active = false)
- Only user's own payment methods are accessible

---

**Status:** 🔍 Investigation in progress  
**Next Step:** Run migration and test endpoints  
**Expected:** All payment methods should work after migration
