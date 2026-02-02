# 🔍 Railway Deployment Debug Checklist

## Current Status: 502 Error Persists

## ✅ What We Fixed
- [x] Server now listens on `0.0.0.0:PORT` instead of `127.0.0.1:3000`
- [x] All routes use PostgreSQL (`db.js` = `db-postgres.js`)
- [x] PostgreSQL connection with SSL enabled for production
- [x] Code pushed to GitHub (commit 31fb905)

## 🔍 Next Steps to Debug

### 1. Check Railway Deployment Logs
**Go to Railway Dashboard → Backend Service → Deployments → Latest Deployment**

Look for these specific errors:

#### ❌ Database Connection Error
```
❌ PostgreSQL connection error: connect ECONNREFUSED
```
**Solution**: DATABASE_URL environment variable is missing or wrong

#### ❌ Missing Dependencies
```
Error: Cannot find module 'express'
Error: Cannot find module 'pg'
```
**Solution**: Railway didn't run `npm install`. Check Build Logs.

#### ❌ Port Binding Error
```
Error: listen EADDRINUSE :::3000
```
**Solution**: App is trying to bind to wrong port. Railway sets $PORT dynamically.

#### ✅ Success Logs Should Show
```
✅ PostgreSQL database connection established
🚀 Run Run Backend Server
📍 Host: 0.0.0.0:XXXX
Server is ready to accept connections...
```

---

### 2. Verify Environment Variables
**Go to Railway Dashboard → Backend Service → Variables**

Required variables:
- ✅ `DATABASE_URL` (auto-set by Postgres plugin)
- ⚠️ `NODE_ENV` = `production` (optional but recommended)

**Test DATABASE_URL exists:**
1. Go to Variables tab
2. You should see `DATABASE_URL` = `postgresql://...`
3. The value comes from the Postgres service reference

---

### 3. Check Railway Settings
**Go to Railway Dashboard → Backend Service → Settings**

#### Root Directory
```
backend
```
⚠️ **CRITICAL**: If this is wrong, Railway can't find package.json

#### Start Command
```
node server.js
```
Default is fine since we have it in package.json, but being explicit helps.

#### Build Command (Auto-detected)
Should be: `npm install` or `npm ci`

---

### 4. Check GitHub Repository Structure

Your repo should look like this:
```
https://github.com/cardoso9197-prog/Run.git
├── backend/
│   ├── package.json          ← Railway looks here
│   ├── server.js             ← Start command runs this
│   ├── database/
│   │   ├── db.js             ← PostgreSQL (was db-postgres.js)
│   │   └── init-postgres.js
│   ├── routes/
│   └── middleware/
```

**Verify on GitHub:**
1. Go to https://github.com/cardoso9197-prog/Run
2. Click `backend` folder
3. Confirm `package.json` and `server.js` are there
4. Click `database` folder
5. Confirm `db.js` exists (the PostgreSQL version)

---

### 5. Test PostgreSQL Connection Directly

**Option A: Use Railway CLI**
```bash
railway run node -e "const {Pool}=require('pg');const pool=new Pool({connectionString:process.env.DATABASE_URL,ssl:{rejectUnauthorized:false}});pool.query('SELECT NOW()').then(r=>console.log('✅ DB OK:',r.rows[0])).catch(e=>console.error('❌',e.message))"
```

**Option B: Add Debugging to server.js**
Already have it! Check logs for:
```
✅ PostgreSQL database connection established
```
or
```
❌ PostgreSQL connection error: [error message]
```

---

### 6. Common Railway Issues

#### Issue: "Application failed to respond"
**Cause**: Server not listening on `0.0.0.0` or wrong port  
**Fix**: ✅ Already fixed (commit 31fb905)

#### Issue: "Error: Cannot find module"
**Cause**: Dependencies not installed  
**Fix**: Check Railway Build Logs → Should show `npm install` running

#### Issue: "connect ECONNREFUSED"
**Cause**: DATABASE_URL not set or wrong  
**Fix**: 
1. Go to Variables tab
2. Add DATABASE_URL reference to Postgres service
3. **Or** Manually copy from Postgres → Variables → DATABASE_URL

#### Issue: "ENOENT: no such file"
**Cause**: Root Directory setting is wrong  
**Fix**: Set Root Directory = `backend`

---

## 📋 Quick Verification Commands

### Test Backend Health
```powershell
curl https://zippy-healing-production-24e4.up.railway.app/
```
**Expected**: `{"status":"success","message":"Run Run API is running"...}`  
**Current**: `502 - Application failed to respond`

### Test Database Route
```powershell
curl https://zippy-healing-production-24e4.up.railway.app/api/auth/health
```

---

## 🎯 Most Likely Issue

Based on your logs showing:
```
❌ PostgreSQL connection error: connect ECONNREFUSED 127.0.0.1:5432
✅ SQLite database connection established  ← This shouldn't happen anymore!
```

**The problem is:**
1. **Root Directory is NOT set to `backend`** ← Railway is looking in wrong place
2. **OR DATABASE_URL is not properly connected** ← Postgres service not linked

---

## ✅ Action Items (Do This Now)

### Step 1: Check Root Directory
1. Railway Dashboard → Backend Service → **Settings**
2. Scroll to **"Root Directory"**
3. **MUST BE**: `backend`
4. If empty or wrong → Set it to `backend` → Save → Redeploy

### Step 2: Verify DATABASE_URL
1. Railway Dashboard → Backend Service → **Variables**
2. Look for `DATABASE_URL`
3. If missing:
   - Click **"+ New Variable"**
   - Select **"Add Reference"**
   - Choose your **Postgres service**
   - Select **DATABASE_URL**
   - Click **Add**

### Step 3: Force Redeploy
1. Go to **Deployments** tab
2. Click **"Deploy"** or **"Redeploy"** on latest
3. Wait 60-90 seconds
4. Check **Deployment Logs** for errors

### Step 4: Read Deployment Logs
1. Click on the latest deployment
2. Look for:
   - Build errors
   - Startup errors
   - Database connection errors
3. **Copy the error and send it to me**

---

## 🆘 If Still Failing

Send me:
1. **Railway Deployment Logs** (last 50 lines)
2. **Railway Variables** screenshot (hide sensitive values)
3. **Railway Settings** screenshot (Root Directory, Start Command)

Then we can pinpoint the exact issue!
