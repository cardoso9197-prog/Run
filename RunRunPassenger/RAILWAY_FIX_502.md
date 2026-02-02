# 🚨 Fix Railway 502 Error

## Problem
Your backend is deployed but returning:
```
502 - Application failed to respond
```

## Root Cause
Railway doesn't know where your backend files are because your GitHub repo has this structure:
```
https://github.com/cardoso9197-prog/Run.git
├── backend/          ← Your code is HERE
│   ├── server.js
│   ├── package.json
│   ├── routes/
│   └── database/
```

## ✅ Solution

### Step 1: Configure Root Directory
1. Open Railway Dashboard: https://railway.app/dashboard
2. Click on your **Backend Service** (not Postgres)
3. Click **Settings** tab
4. Scroll down to **"Root Directory"**
5. Enter: `backend`
6. Click **Save** or it auto-saves

### Step 2: Configure Start Command
1. Still in **Settings**, scroll to **"Start Command"**
2. Enter: `node server.js`
3. Click **Save**

### Step 3: Redeploy
1. Go to **Deployments** tab
2. Click **Redeploy** on the latest deployment
3. Wait 30-60 seconds for build to complete

## ✅ Expected Result
After redeployment, test your backend:
```bash
curl https://zippy-healing-production-24e4.up.railway.app/
```

Should return:
```json
{"status":"success","message":"Run Run API is running","environment":"production"}
```

## 🔍 If Still Not Working

### Check Deployment Logs
1. Go to **Deployments** tab
2. Click on the latest deployment
3. Look for errors like:
   - `Cannot find module 'express'` → Dependencies not installed
   - `Error: listen EADDRINUSE` → Port conflict
   - `DATABASE_URL is not defined` → Missing environment variable

### Verify Environment Variables
1. Go to **Variables** tab
2. You should see:
   - `DATABASE_URL` (auto-added by Postgres)
   - `PORT` (optional, Railway sets this automatically)

### Check Build Logs
Look for:
- ✅ `npm install` completed successfully
- ✅ `node server.js` started
- ✅ "PostgreSQL database connection established"

---

## 📝 Next Steps After Fix

Once your backend is running (returns 200 status), run the database initialization:

### Initialize Database Schema
1. Go to **Settings**
2. Change **Start Command** to: `node database/init-postgres.js`
3. Click **Redeploy**
4. Wait for "Database initialization complete!" in logs
5. Change **Start Command** back to: `node server.js`
6. Click **Redeploy** again

Now your production backend is fully deployed! 🎉
