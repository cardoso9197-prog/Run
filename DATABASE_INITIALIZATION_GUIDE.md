# 🗄️ Database Initialization Guide

## 🎯 What This Does

This process will create all the database tables your app needs:

**Tables to be created:**
- ✅ `users` - User accounts (passengers & drivers)
- ✅ `passengers` - Passenger profiles
- ✅ `drivers` - Driver profiles
- ✅ `vehicles` - Driver vehicles
- ✅ `rides` - Ride requests and history
- ✅ `payments` - Payment transactions
- ✅ `notifications` - Push notifications
- ✅ `driver_locations` - Real-time driver tracking

**Plus:**
- Indexes for performance
- Foreign key relationships
- Red zone data for surge pricing

---

## 📋 Step-by-Step Instructions

### Step 1: Go to Railway Settings

1. Open **Railway Dashboard**: https://railway.app/dashboard
2. Click on **zippy-healing-production-24e4** service
3. Click the **"Settings"** tab at the top

---

### Step 2: Change Start Command

1. Scroll down to find **"Start Command"** section
   - May be labeled "Custom Start Command"
   - Currently shows: `node server.js`

2. Click on the field to edit it

3. **Replace** the entire command with:
   ```
   node database/init-postgres.js
   ```

4. Click outside or press Enter (Railway auto-saves)

5. **Verify** it changed to: `node database/init-postgres.js`

---

### Step 3: Redeploy to Initialize Database

1. Click the **"Deployments"** tab

2. You'll see the latest deployment at the top

3. Click **"Redeploy"** button (or three dots → Redeploy)

4. **Wait** 60-90 seconds for deployment to complete

5. The deployment status should change to **"Deployed"** with a green checkmark

---

### Step 4: Check Initialization Logs

1. Click on the **latest deployment** (the one you just triggered)

2. Look at the **Deploy Logs**

3. **What you should see:**

   ```
   Starting Container
   🔗 Connecting to PostgreSQL using DATABASE_URL
   ✅ PostgreSQL database connection established
   🚀 Starting database initialization...
   
   📊 Creating tables...
   ✅ Table 'users' created
   ✅ Table 'passengers' created
   ✅ Table 'drivers' created
   ✅ Table 'vehicles' created
   ✅ Table 'rides' created
   ✅ Table 'payments' created
   ✅ Table 'notifications' created
   ✅ Table 'driver_locations' created
   
   📍 Inserting red zones...
   ✅ Red zone: Bissau Centro (surge 1.5x)
   ✅ Red zone: Aeroporto (surge 1.3x)
   ✅ Red zone: Bandim (surge 1.4x)
   
   ✅ Database schema created successfully!
   ✅ Database initialization complete!
   ```

4. **If you see errors instead:**
   - Copy the error messages
   - Send them to me
   - We'll troubleshoot

---

### Step 5: Restore Normal Start Command

**IMPORTANT:** Don't forget this step! Your app won't run normally without it.

1. Go back to the **"Settings"** tab

2. Find **"Start Command"** again

3. **Change it back** to:
   ```
   node server.js
   ```

4. Click outside to save

5. **Verify** it shows: `node server.js`

---

### Step 6: Redeploy to Start Normal Server

1. Go to **"Deployments"** tab again

2. Click **"Redeploy"** on the latest deployment

3. Wait 60-90 seconds

4. Check the logs - you should see:
   ```
   ✅ PostgreSQL database connection established
   🚀 Run Run Backend Server
   Server is ready to accept connections...
   ```

---

## ✅ Success Checklist

After completing all steps:

- [ ] Start Command changed to `node database/init-postgres.js`
- [ ] Redeployed successfully
- [ ] Logs show "Database initialization complete!"
- [ ] All 8 tables created
- [ ] Red zones inserted
- [ ] Start Command changed back to `node server.js`
- [ ] Redeployed again successfully
- [ ] Server running normally

---

## 🧪 Verify Database is Working

After restoring the server, test user registration:

```powershell
curl -X POST https://zippy-healing-production-24e4.up.railway.app/api/auth/register `
  -H "Content-Type: application/json" `
  -d '{
    "name": "Test Passenger",
    "email": "test@runrun.com",
    "password": "password123",
    "phone": "+245123456789",
    "role": "passenger"
  }'
```

**Expected Response (200 OK):**
```json
{
  "user": {
    "id": 1,
    "name": "Test Passenger",
    "email": "test@runrun.com",
    "role": "passenger"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

This confirms:
- ✅ Database tables exist
- ✅ API can insert data
- ✅ Authentication works
- ✅ Everything is operational!

---

## ⚠️ Important Notes

### Don't Skip Step 5!

If you forget to change the start command back to `node server.js`:
- Your app will keep trying to initialize the database
- It might create duplicate data
- API endpoints won't work

### One-Time Process

You only need to run `init-postgres.js` **ONCE**.

After the tables are created:
- Always use `node server.js` as the start command
- Tables persist in the database
- Data is preserved across deployments

### If You Need to Reset

To drop all tables and start fresh:
1. Go to Railway → Postgres service → Data tab
2. Execute: `DROP SCHEMA public CASCADE; CREATE SCHEMA public;`
3. Run the initialization process again

---

## 🆘 Troubleshooting

### Error: "relation 'users' already exists"

**Cause:** Tables were already created  
**Solution:** This is fine! It means initialization already ran. Skip to Step 5 and restore the start command.

### Error: "permission denied"

**Cause:** Database user doesn't have permissions  
**Solution:** Unlikely on Railway. Check DATABASE_URL is correct.

### Error: "timeout" or "connection refused"

**Cause:** Can't connect to Postgres  
**Solution:** 
1. Check Postgres service is running (should be green/active)
2. Verify DATABASE_URL variable exists
3. Redeploy Postgres service if needed

### Logs show nothing

**Cause:** Wrong start command or deployment failed  
**Solution:**
1. Verify start command is exactly: `node database/init-postgres.js`
2. Check for build errors in logs
3. Make sure `database/init-postgres.js` exists in your GitHub repo

---

## 📸 What to Send Me

After completing all steps, send me:

1. **Initialization logs** (from Step 4)
   - Should show tables being created
   - Should end with "initialization complete"

2. **Final server logs** (after Step 6)
   - Should show normal server startup
   - Should show Postgres connection established

3. **Test registration result** (optional)
   - Confirms database is working
   - Shows you can create users

---

## 🎯 After Database is Initialized

You can then:
1. ✅ Test all API endpoints
2. ✅ Update mobile apps with production URL
3. ✅ Test real ride flows
4. ✅ Build production APKs
5. ✅ Launch your app! 🚀

Good luck! Follow the steps carefully and send me the logs when done! 💪
