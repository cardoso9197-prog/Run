# 🔐 Driver Activation & Deactivation Queries

**Run-Run Guinea-Bissau - Admin Database Management**  
**Date:** December 17, 2025  
**Database:** Railway PostgreSQL

---

## 📋 TABLE OF CONTENTS

1. [Overview](#overview)
2. [View Driver Status](#view-driver-status)
3. [Activate Drivers](#activate-drivers)
4. [Deactivate Drivers](#deactivate-drivers)
5. [Bulk Operations](#bulk-operations)
6. [Statistics & Reports](#statistics--reports)
7. [Admin API Endpoints](#admin-api-endpoints)

---

## 🎯 OVERVIEW

The driver activation system ensures only verified drivers can accept rides. All new drivers must visit the office for document verification before their account is activated.

### Required Documents:
- ✅ Driver's license
- ✅ Vehicle registration
- ✅ Insurance certificate
- ✅ Inspection certificate
- ✅ National ID/Passport
- ✅ Phone number verification

---

## 👀 VIEW DRIVER STATUS

### View All Drivers with Status

```sql
SELECT 
    d.id AS driver_id,
    u.name AS driver_name,
    u.phone AS phone_number,
    u.email,
    d.vehicle_type,
    d.vehicle_plate,
    d.is_activated,
    d.verified_by,
    d.verification_date,
    d.verification_notes,
    d.created_at AS registered_on
FROM drivers d
JOIN users u ON d.user_id = u.id
ORDER BY d.created_at DESC;
```

### View Only Pending Drivers (Not Activated)

```sql
SELECT 
    d.id AS driver_id,
    u.name AS driver_name,
    u.phone AS phone_number,
    d.vehicle_type,
    d.vehicle_plate,
    d.created_at AS registered_on,
    EXTRACT(DAY FROM (NOW() - d.created_at)) AS days_waiting
FROM drivers d
JOIN users u ON d.user_id = u.id
WHERE d.is_activated = FALSE OR d.is_activated IS NULL
ORDER BY d.created_at ASC;
```

### View Only Active Drivers

```sql
SELECT 
    d.id AS driver_id,
    u.name AS driver_name,
    u.phone AS phone_number,
    d.vehicle_type,
    d.is_activated,
    d.verified_by,
    d.verification_date
FROM drivers d
JOIN users u ON d.user_id = u.id
WHERE d.is_activated = TRUE
ORDER BY d.verification_date DESC;
```

### View Driver Details by Phone Number

```sql
SELECT 
    d.id AS driver_id,
    u.name AS driver_name,
    u.phone AS phone_number,
    u.email,
    d.vehicle_type,
    d.vehicle_plate,
    d.vehicle_make,
    d.vehicle_model,
    d.vehicle_year,
    d.vehicle_color,
    d.is_activated,
    d.verified_by,
    d.verification_date,
    d.verification_notes,
    d.created_at AS registered_on
FROM drivers d
JOIN users u ON d.user_id = u.id
WHERE u.phone = '+245955971275';  -- Replace with actual phone number
```

---

## ✅ ACTIVATE DRIVERS

### Activate Single Driver by ID

```sql
UPDATE drivers 
SET 
    is_activated = TRUE,
    verified_by = 'Admin Name',  -- Replace with admin's name
    verification_date = NOW(),
    verification_notes = 'Documents verified. All requirements met.'  -- Optional notes
WHERE id = 1;  -- Replace with actual driver ID
```

### Activate Driver by Phone Number

```sql
UPDATE drivers 
SET 
    is_activated = TRUE,
    verified_by = 'Admin Name',
    verification_date = NOW(),
    verification_notes = 'Documents verified. All requirements met.'
WHERE user_id = (
    SELECT id FROM users WHERE phone = '+245955971275'  -- Replace with phone
);
```

### Activate Driver with Conditional Notes

```sql
UPDATE drivers 
SET 
    is_activated = TRUE,
    verified_by = 'Maria Silva',
    verification_date = NOW(),
    verification_notes = 'Verified on 2025-12-17. Insurance expires 2026-06-15. Next inspection due 2026-01-10.'
WHERE id = 5;
```

---

## ❌ DEACTIVATE DRIVERS

### Deactivate Single Driver by ID

```sql
UPDATE drivers 
SET 
    is_activated = FALSE,
    verification_notes = CONCAT(
        COALESCE(verification_notes, ''), 
        ' | DEACTIVATED on ', 
        TO_CHAR(NOW(), 'YYYY-MM-DD HH24:MI:SS'), 
        ' by Admin Name. Reason: Expired insurance.'  -- Replace with actual reason
    )
WHERE id = 1;  -- Replace with actual driver ID
```

### Deactivate Driver by Phone Number

```sql
UPDATE drivers 
SET 
    is_activated = FALSE,
    verification_notes = CONCAT(
        COALESCE(verification_notes, ''), 
        ' | DEACTIVATED on ', 
        TO_CHAR(NOW(), 'YYYY-MM-DD HH24:MI:SS'), 
        ' - Reason: Failed vehicle inspection.'
    )
WHERE user_id = (
    SELECT id FROM users WHERE phone = '+245955971275'
);
```

### Temporary Suspension (with note)

```sql
UPDATE drivers 
SET 
    is_activated = FALSE,
    verification_notes = CONCAT(
        COALESCE(verification_notes, ''), 
        ' | SUSPENDED ', 
        TO_CHAR(NOW(), 'YYYY-MM-DD'), 
        ' - Documents need renewal. Contact office.'
    )
WHERE id = 3;
```

---

## 📦 BULK OPERATIONS

### Activate All Existing Drivers (Initial Migration)

```sql
-- Use this ONLY once during initial setup
UPDATE drivers 
SET 
    is_activated = TRUE,
    verified_by = 'System Migration',
    verification_date = NOW(),
    verification_notes = 'Auto-activated during system migration'
WHERE created_at < NOW() 
  AND (is_activated IS NULL OR is_activated = FALSE);
```

### Activate Multiple Drivers by ID List

```sql
UPDATE drivers 
SET 
    is_activated = TRUE,
    verified_by = 'Admin Batch Activation',
    verification_date = NOW(),
    verification_notes = 'Batch activation - documents verified 2025-12-17'
WHERE id IN (1, 2, 5, 8, 12);  -- Replace with actual driver IDs
```

### Deactivate Drivers with Expired Documents

```sql
-- Example: Deactivate drivers registered more than 1 year ago without recent verification
UPDATE drivers 
SET 
    is_activated = FALSE,
    verification_notes = CONCAT(
        COALESCE(verification_notes, ''), 
        ' | AUTO-DEACTIVATED ', 
        TO_CHAR(NOW(), 'YYYY-MM-DD'), 
        ' - Annual re-verification required'
    )
WHERE verification_date < (NOW() - INTERVAL '1 year')
  AND is_activated = TRUE;
```

---

## 📊 STATISTICS & REPORTS

### Activation Statistics

```sql
SELECT 
    COUNT(*) AS total_drivers,
    SUM(CASE WHEN is_activated = TRUE THEN 1 ELSE 0 END) AS activated_drivers,
    SUM(CASE WHEN is_activated = FALSE OR is_activated IS NULL THEN 1 ELSE 0 END) AS pending_drivers,
    ROUND(100.0 * SUM(CASE WHEN is_activated = TRUE THEN 1 ELSE 0 END) / NULLIF(COUNT(*), 0), 2) AS activation_rate
FROM drivers;
```

### Activations by Date

```sql
SELECT 
    DATE(verification_date) AS activation_date,
    COUNT(*) AS drivers_activated,
    STRING_AGG(verified_by, ', ' ORDER BY verification_date) AS activated_by
FROM drivers
WHERE verification_date IS NOT NULL
GROUP BY DATE(verification_date)
ORDER BY activation_date DESC
LIMIT 30;
```

### Drivers by Vehicle Type

```sql
SELECT 
    vehicle_type,
    COUNT(*) AS total_drivers,
    SUM(CASE WHEN is_activated = TRUE THEN 1 ELSE 0 END) AS active_drivers,
    SUM(CASE WHEN is_activated = FALSE OR is_activated IS NULL THEN 1 ELSE 0 END) AS pending_drivers
FROM drivers
GROUP BY vehicle_type
ORDER BY total_drivers DESC;
```

### Recent Activations (Last 7 Days)

```sql
SELECT 
    d.id AS driver_id,
    u.name AS driver_name,
    u.phone,
    d.vehicle_type,
    d.vehicle_plate,
    d.verified_by,
    d.verification_date,
    d.verification_notes
FROM drivers d
JOIN users u ON d.user_id = u.id
WHERE d.verification_date >= (NOW() - INTERVAL '7 days')
ORDER BY d.verification_date DESC;
```

### Pending Drivers by Wait Time

```sql
SELECT 
    d.id AS driver_id,
    u.name AS driver_name,
    u.phone,
    d.vehicle_type,
    d.created_at AS registered_on,
    EXTRACT(DAY FROM (NOW() - d.created_at)) AS days_waiting,
    CASE 
        WHEN EXTRACT(DAY FROM (NOW() - d.created_at)) > 7 THEN '🔴 Urgent'
        WHEN EXTRACT(DAY FROM (NOW() - d.created_at)) > 3 THEN '🟡 High Priority'
        ELSE '🟢 Recent'
    END AS priority
FROM drivers d
JOIN users u ON d.user_id = u.id
WHERE d.is_activated = FALSE OR d.is_activated IS NULL
ORDER BY d.created_at ASC;
```

---

## 🔌 ADMIN API ENDPOINTS

### Using the Backend API

The backend provides REST API endpoints for driver activation management.

**Base URL:** `https://zippy-healing-production-24e4.up.railway.app/api`

**Authentication:** Requires `X-Admin-Key` header

### 1. Get All Drivers

```http
GET /api/admin/drivers
Headers:
  X-Admin-Key: your-admin-key-here
```

**Response:**
```json
{
  "success": true,
  "drivers": [
    {
      "id": 1,
      "name": "João Silva",
      "phone": "+245955971275",
      "vehicle_type": "Normal Car",
      "is_activated": true,
      "verified_by": "Admin",
      "verification_date": "2025-12-17T10:30:00Z"
    }
  ]
}
```

### 2. Activate Driver

```http
POST /api/admin/drivers/:driverId/activate
Headers:
  X-Admin-Key: your-admin-key-here
  Content-Type: application/json

Body:
{
  "verified_by": "Admin Name",
  "notes": "Documents verified. All requirements met."
}
```

### 3. Deactivate Driver

```http
POST /api/admin/drivers/:driverId/deactivate
Headers:
  X-Admin-Key: your-admin-key-here
  Content-Type: application/json

Body:
{
  "reason": "Insurance expired"
}
```

### 4. Using PowerShell to Call API

```powershell
# Activate driver
$headers = @{
    "X-Admin-Key" = "your-admin-key-here"
    "Content-Type" = "application/json"
}

$body = @{
    verified_by = "Admin Name"
    notes = "Documents verified"
} | ConvertTo-Json

Invoke-RestMethod -Uri "https://zippy-healing-production-24e4.up.railway.app/api/admin/drivers/1/activate" `
    -Method POST `
    -Headers $headers `
    -Body $body
```

---

## 🏢 OFFICE WORKFLOW

### Step-by-Step Activation Process:

1. **Driver Arrives at Office**
   - Location: Avenida Principal, Bissau Center
   - Phone: +245 955 971 275 / +245 955 981 398
   - Hours: Mon-Fri 8AM-6PM, Sat 9AM-2PM

2. **Document Verification**
   - Check all 6 required documents
   - Verify driver's license validity
   - Confirm vehicle insurance is current
   - Check vehicle inspection certificate

3. **Database Check**
   ```sql
   SELECT d.id, u.name, u.phone, d.vehicle_plate, d.is_activated
   FROM drivers d
   JOIN users u ON d.user_id = u.id
   WHERE u.phone = '+245XXXXXXXXX';
   ```

4. **Activate Account**
   ```sql
   UPDATE drivers 
   SET 
       is_activated = TRUE,
       verified_by = 'Your Name',
       verification_date = NOW(),
       verification_notes = 'All documents verified on 2025-12-17'
   WHERE id = [DRIVER_ID];
   ```

5. **Notify Driver**
   - Driver can now go online in the app
   - Starts receiving ride requests immediately

---

## ⚠️ IMPORTANT NOTES

1. **Never activate without verification** - Always verify documents in person
2. **Record verification details** - Use the `verification_notes` field
3. **Annual renewal** - Re-verify drivers annually
4. **Insurance expiry** - Track insurance expiration dates
5. **Backup admin key** - Keep admin API key secure
6. **Audit trail** - All activations/deactivations are logged

---

## 🆘 TROUBLESHOOTING

### Driver says "Account Pending Activation"

**Check activation status:**
```sql
SELECT d.is_activated, u.phone 
FROM drivers d 
JOIN users u ON d.user_id = u.id 
WHERE u.phone = '+245XXXXXXXXX';
```

**If FALSE:** Activate using queries above  
**If TRUE:** Driver needs to restart the app

### Accidentally Deactivated Driver

**Re-activate immediately:**
```sql
UPDATE drivers 
SET 
    is_activated = TRUE,
    verification_notes = CONCAT(verification_notes, ' | REACTIVATED ', NOW(), ' - Error correction')
WHERE id = [DRIVER_ID];
```

### Driver Shows Activated But Can't Go Online

1. Check database connection
2. Verify driver is using latest app version
3. Check backend logs for API errors
4. Restart app completely

---

## 📞 SUPPORT CONTACTS

**Technical Support:**  
Email: support@runrun-gw.com  
Phone: +245 955 971 275

**Office Location:**  
Avenida Principal, Bissau Center  
GPS: 11.8636, -15.5984  
Guinea-Bissau 🇬🇼

---

**Last Updated:** December 17, 2025  
**Version:** 1.0  
**System:** Run-Run Guinea-Bissau
