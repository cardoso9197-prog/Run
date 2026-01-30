# 🔧 CHANGE START COMMAND - Step by Step

## 🎯 What You Need to Do

Change the Railway start command from:
- ❌ `node database/init-postgres.js` (initialization script)
- ✅ `node server.js` (actual API server)

---

## 📋 Follow These Steps EXACTLY:

### Step 1: Open Railway Dashboard

1. Click this link: **https://railway.app/dashboard**
2. You should see your project

---

### Step 2: Select Your Backend Service

1. Look for the service named: **zippy-healing-production-24e4**
   - It might have a colorful icon
   - Should show "Active" or "Running" status
2. **Click on it** (NOT the Postgres service)

---

### Step 3: Go to Settings

1. At the top of the page, you'll see tabs:
   - Deployments
   - Observability
   - Variables
   - **Settings** ← Click this one!
   - Metrics

---

### Step 4: Find Start Command Field

1. Scroll down the Settings page
2. Look for a section labeled:
   - **"Start Command"** OR
   - **"Custom Start Command"**
3. You should see a text field/input box

---

### Step 5: Check Current Value

The field currently shows:
```
node database/init-postgres.js
```

This is why your API isn't working!

---

### Step 6: Edit the Field

1. **Click inside the text field** (it should become editable)
2. **Select all the text** (Ctrl+A or triple-click)
3. **Delete it completely**
4. **Type exactly**: `node server.js`
5. Make sure there are NO extra spaces before or after

---

### Step 7: Save the Change

1. **Click outside the field** (anywhere else on the page)
   - OR press **Tab** key
   - OR press **Enter** key
2. **Wait 2-3 seconds**
3. Railway should auto-save (you might see a "Saved" notification)

---

### Step 8: Verify It Changed

Look at the Start Command field again.

**It should now show:**
```
node server.js
```

**NOT:**
```
node database/init-postgres.js
```

If it still shows the old value, try steps 6-7 again!

---

### Step 9: Redeploy the Service

1. Click the **"Deployments"** tab at the top
2. You'll see a list of deployments
3. Find the **"Redeploy"** button
   - It might be a button with a circular arrow icon
   - OR click the three dots (•••) on the latest deployment → "Redeploy"
4. **Click "Redeploy"**
5. Confirm if Railway asks for confirmation

---

### Step 10: Wait for Deployment

1. You'll see a new deployment starting
2. **Wait 60-90 seconds**
3. The deployment should turn green with "Success" or "Deployed"

---

### Step 11: Check the NEW Logs

1. **Click on the new deployment** (the one you just triggered)
2. Look at the **Deploy Logs**

---

## ✅ What You Should See in the NEW Logs:

```
Starting Container
🔗 Connecting to PostgreSQL using DATABASE_URL
✅ PostgreSQL database connection established
🚀 Run Run Backend Server
📱 Socket.IO server is running
🌍 Environment: production
Server is ready to accept connections...
Server running on 0.0.0.0:3000
```

---

## ❌ What You Should NOT See:

```
🚀 Starting PostgreSQL database initialization...
📊 Created tables:
```

If you still see "database initialization", the start command didn't change!

---

## 📸 After You Redeploy:

**Send me the NEW logs** that start with:
```
Starting Container
```

Copy and paste them here so I can verify the server is running correctly!

---

## 🆘 If You Get Stuck:

Take screenshots of:
1. The Settings page showing the Start Command field
2. The new deployment logs

And send them to me - I'll help you troubleshoot!

---

## 🎉 Once This Works:

Your API will be fully operational and you can:
- ✅ Test user registration
- ✅ Test driver registration  
- ✅ Connect mobile apps
- ✅ Test ride flows
- ✅ Launch your app! 🚀

---

**You're almost there! Just need to change this one setting!** 💪
