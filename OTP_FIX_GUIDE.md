# OTP Registration Fix

## Problem
Both passenger and driver apps were failing to register users because:
1. Apps were calling `/api/auth/register` which didn't exist
2. Backend only had `/api/auth/send-otp` and `/api/auth/verify-otp` 
3. OTP was only logged to console, not returned to app

## Solution Applied

### Backend Changes (routes/auth.js)
Added new `/api/auth/register` endpoint that:
1. Validates phone number and user data
2. Generates OTP automatically
3. Stores OTP with user data (name, email, password, userType)
4. **Returns OTP in response for development/testing** 
5. Logs OTP to Railway console for visibility

### Updated `/api/auth/verify-otp` endpoint to:
1. Retrieve stored user data from OTP store
2. Hash passwords properly with bcrypt
3. Create user account with all provided data
4. Generate JWT token for automatic login

## How It Works Now

### Registration Flow:
```
1. User fills registration form
2. App calls: POST /api/auth/register
   {
     "phoneNumber": "+245XXXXXXXXX",
     "name": "User Name",
     "email": "user@example.com", // optional
     "password": "password123",
     "userType": "passenger" // or "driver"
   }

3. Backend generates OTP and returns:
   {
     "success": true,
     "message": "OTP sent to your phone number",
     "phoneNumber": "+245XXXXXXXXX",
     "otp": "123456" // INCLUDED FOR TESTING
   }

4. App navigates to OTP screen and shows the OTP

5. User enters OTP (or it's auto-filled)

6. App calls: POST /api/auth/verify-otp
   {
     "phoneNumber": "+245XXXXXXXXX",
     "otp": "123456"
   }

7. Backend verifies OTP, creates account, returns:
   {
     "success": true,
     "message": "Account created successfully",
     "isNewUser": true,
     "token": "jwt_token_here",
     "user": { ...user data... }
   }

8. App stores token and logs user in automatically
```

## Testing

The OTP is now returned in the API response AND logged to Railway console:

**Railway Logs will show:**
```
📝 Registration OTP for +245XXXXXXXXX: 123456
```

**API Response includes:**
```json
{
  "otp": "123456"
}
```

So you can see the OTP in both places for testing!

## Production Ready

For production deployment:
1. The `otp` field is only included when `NODE_ENV !== 'production'`
2. In production, users would receive OTP via SMS
3. Integrate SMS gateway (Twilio, Africa's Talking, etc.) in `sendOTP()` function

## Deployment

To deploy these changes to Railway:

```powershell
cd backend
git add routes/auth.js
git commit -m "Add /auth/register endpoint and return OTP for testing"
git push origin master
```

Railway will auto-deploy within 2-3 minutes.

## Mobile App Changes Needed

The apps need to:
1. ✅ Call `/api/auth/register` (already doing this)
2. ✅ Navigate to OTP screen after registration
3. ✅ Show OTP returned in response (for easy testing)
4. ✅ Call `/api/auth/verify-otp` with phone and OTP
5. ✅ Store token and navigate to home

---

**Status:** ✅ Backend Updated - Ready to Deploy
**Next Step:** Deploy to Railway and test registration in both apps
