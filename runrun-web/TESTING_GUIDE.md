# 🧪 Admin Panel Testing Guide

## Current Status: Dev Server Running ✅

**Server:** http://localhost:3000  
**Admin Login:** http://localhost:3000/admin/login

---

## 🔐 Test Admin Login

### Step 1: Open Admin Login Page
- URL: http://localhost:3000/admin/login
- ✅ Page should display with Run Run Admin branding

### Step 2: Test Invalid Credentials
**Test 1: Wrong Email**
- Email: `wrong@email.com`
- Password: `Inside9791@`
- ✅ Expected: "Email ou senha incorretos" error message

**Test 2: Wrong Password**
- Email: `cardoso9197@gmail.com`
- Password: `wrongpassword`
- ✅ Expected: "Email ou senha incorretos" error message

**Test 3: Empty Fields**
- Leave fields empty and click "Entrar"
- ✅ Expected: Browser validation prevents submission

### Step 3: Test Valid Credentials ⭐
**Correct Credentials:**
- Email: `cardoso9197@gmail.com`
- Password: `Inside9791@`
- ✅ Expected: Redirect to `/admin` dashboard

### Step 4: Verify Dashboard
After successful login:
- ✅ Dashboard loads at `/admin`
- ✅ "Sair" (Logout) button visible in top right
- ✅ Statistics cards display
- ✅ No console errors

### Step 5: Test Session Persistence
1. Stay logged in
2. Refresh the page (F5)
- ✅ Expected: Still logged in, dashboard displays

### Step 6: Test Route Protection
1. While logged in, note your session
2. Click "Sair" (Logout)
3. Try to access http://localhost:3000/admin directly
- ✅ Expected: Redirect to `/admin/login`

### Step 7: Test API Connection
1. Login to admin panel
2. Open browser DevTools (F12)
3. Go to "Network" tab
4. Refresh dashboard
5. Look for API calls to backend
- ✅ Expected: API calls attempt to fetch data
- ⚠️ May show errors if Railway backend not configured yet

---

## 🔍 What to Check

### Visual Checks
- [ ] Login page has dark theme with yellow accent
- [ ] Email and password fields have icons
- [ ] Error messages display in red
- [ ] Loading state shows "Entrando..." text
- [ ] Dashboard has statistics cards
- [ ] All text in Portuguese displays correctly

### Functional Checks
- [ ] Invalid login shows error message
- [ ] Valid login redirects to dashboard
- [ ] Session persists on refresh
- [ ] Logout clears session
- [ ] Protected routes redirect to login
- [ ] Dashboard attempts to fetch data

### Browser Console Checks
Open DevTools (F12) → Console tab:
- [ ] No JavaScript errors (except API fetch errors if backend not connected)
- [ ] No React warnings
- [ ] No TypeScript errors

---

## 🐛 Common Issues & Solutions

### Issue: "Cannot read properties of undefined"
**Cause:** API not connected yet  
**Solution:** Normal - will work once Railway URL is configured

### Issue: Login button doesn't respond
**Check:**
1. Browser console for errors
2. Email format is valid
3. No network errors in DevTools

### Issue: Stuck on login page after correct credentials
**Check:**
1. Browser console for routing errors
2. LocalStorage is enabled in browser
3. JavaScript is enabled

### Issue: Dashboard is blank
**Check:**
1. API endpoint is configured
2. Backend is running
3. CORS headers allow frontend domain

---

## 📊 Expected Behavior Flow

```
1. User visits /admin/login
   ↓
2. Enters credentials
   ↓
3. Click "Entrar" button
   ↓
4. bcrypt.compare() validates password
   ↓
5. If valid: Store session in localStorage
   ↓
6. router.push('/admin')
   ↓
7. Dashboard page loads
   ↓
8. useAdminAuth() checks session
   ↓
9. If authenticated: Show dashboard
   ↓
10. Dashboard fetches data from API
```

---

## 🎯 Test Checklist

### Basic Authentication ✅
- [x] Bcrypt password hashing implemented
- [x] Invalid credentials rejected
- [x] Valid credentials accepted
- [x] Session stored in localStorage
- [x] Redirect to dashboard works

### Security Features ✅
- [x] Password is hashed (not plain text)
- [x] Session token generated
- [x] Route protection active
- [x] Logout clears session

### User Experience
- [ ] Test on Chrome/Edge
- [ ] Test on Firefox
- [ ] Test on mobile (responsive)
- [ ] Test with slow connection
- [ ] Test error messages clear

---

## 🚀 Next Steps After Testing

1. **If Login Works:**
   - ✅ Authentication system verified
   - Move to production build testing
   - Proceed with Netlify deployment

2. **If Dashboard Shows API Errors:**
   - ⚠️ Normal if Railway not configured
   - Update `.env.production` with Railway URL
   - Dashboard will work after deployment

3. **If Any Errors:**
   - Check browser console
   - Review this testing guide
   - Check SECURITY_INFO.md for troubleshooting

---

## 📝 Test Results Template

**Date:** _____________  
**Tester:** _____________  
**Browser:** _____________  

| Test | Result | Notes |
|------|--------|-------|
| Login page loads | ⬜ Pass / ⬜ Fail | |
| Invalid credentials rejected | ⬜ Pass / ⬜ Fail | |
| Valid credentials accepted | ⬜ Pass / ⬜ Fail | |
| Dashboard loads | ⬜ Pass / ⬜ Fail | |
| Session persists | ⬜ Pass / ⬜ Fail | |
| Logout works | ⬜ Pass / ⬜ Fail | |
| Route protection works | ⬜ Pass / ⬜ Fail | |
| Mobile responsive | ⬜ Pass / ⬜ Fail | |

**Overall Result:** ⬜ Ready for Production / ⬜ Needs Fixes

**Additional Notes:**
_________________________________
_________________________________
_________________________________

---

## 🔐 Test Credentials Reference

**Admin Email:** `cardoso9197@gmail.com`  
**Admin Password:** `Inside9791@`  
**Backend Admin Key:** `runrun-admin-2025`

---

**Last Updated:** January 5, 2026  
**Status:** Ready for Testing ✅
