# 🚀 QUICK FIX: Passenger Profile Error

## ❌ Error You're Seeing
```
Error: column "name" does not exist
```

## ✅ Fix in 2 Minutes

### Step 1: Open Railway Query Tab
1. Go to https://railway.app
2. Open your **Run-Run** project
3. Click **PostgreSQL** service (the database icon)
4. Click **Query** tab at the top

### Step 2: Run This SQL
Open the file:
```
backend/database/migrations/006_add_passenger_profile_columns_MANUAL.sql
```

**Copy the ENTIRE file contents** (all 100+ lines)

Paste into Railway Query tab

Click **Execute** or **Run** button

### Step 3: Verify Success
You should see output like:
```
✅ Added name column to passengers table
✅ Set default names for existing passengers
✅ Made name column NOT NULL
✅ Added email column to passengers table
✅ Added profile_photo_url column to passengers table
```

And a table showing your passengers with the new columns.

### Step 4: Test in App
1. Open Run-Run Passenger app
2. Go to Profile screen
3. Update your name
4. Click Save
5. ✅ Should work now!

---

## 🔍 What This Does

**Before:**
```
passengers table:
├── id
├── user_id
├── average_rating
├── total_rides
├── created_at
└── updated_at
❌ No name, email, or profile_photo_url
```

**After:**
```
passengers table:
├── id
├── user_id
├── name ✅ (NEW)
├── email ✅ (NEW)
├── profile_photo_url ✅ (NEW)
├── average_rating
├── total_rides
├── created_at
└── updated_at
```

---

## 🆘 Need Help?

**If you see "name column already exists":**
- ✅ That's good! The column is already there.
- The error might be coming from a different issue.
- Check the backend logs in Railway.

**If Railway Query tab doesn't work:**
- Try refreshing the page
- Make sure you're on the PostgreSQL service (not the backend)
- Try pasting smaller sections of the SQL

**If app still shows error after migration:**
- Restart the backend service in Railway:
  - Go to backend service
  - Click "Restart" button
- Clear passenger app data and re-login

---

## 📁 Files Involved

**Migration SQL:**
- `backend/database/migrations/006_add_passenger_profile_columns_MANUAL.sql`

**Backend API:**
- `backend/routes/passengers.js` (expects name, email, profile_photo_url)

**Frontend:**
- `RunRunPassenger/src/screens/ProfileScreen.js` (sends name and email)

**Documentation:**
- `docs/guides/PASSENGER_PROFILE_FIX.md` (detailed guide)

---

**Safe to run:** ✅ Uses IF NOT EXISTS checks  
**Impact:** Fixes profile updates for all passengers  
**Time:** 2 minutes  
**Risk:** None - won't break existing data
