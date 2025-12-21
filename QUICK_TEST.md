# Quick Test - Registration Endpoint

## Wait 3 minutes for Railway to deploy, then run this:

```powershell
# PowerShell command to test registration
$body = @{
    phoneNumber = "+245955123456"
    name = "Test User"
    password = "test123"
    userType = "passenger"
} | ConvertTo-Json

Invoke-RestMethod -Uri "https://zippy-healing-production-24e4.up.railway.app/api/auth/register" -Method POST -Body $body -ContentType "application/json"
```

## Expected Success Response:

```json
{
  "success": true,
  "message": "OTP sent to your phone number",
  "phoneNumber": "+245955123456",
  "otp": "123456"
}
```

## If You Get This:

✅ **Registration is working!**

Copy the OTP number and use it in your mobile app!

## Then Test OTP Verification:

```powershell
$verifyBody = @{
    phoneNumber = "+245955123456"
    otp = "123456"  # Use the OTP from previous response
} | ConvertTo-Json

Invoke-RestMethod -Uri "https://zippy-healing-production-24e4.up.railway.app/api/auth/verify-otp" -Method POST -Body $verifyBody -ContentType "application/json"
```

## Expected Verification Response:

```json
{
  "success": true,
  "message": "Account created successfully",
  "isNewUser": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "name": "Test User",
    "phoneNumber": "+245955123456",
    "userType": "passenger"
  }
}
```

✅ **If you get a token, everything is working perfectly!**

---

**Run these commands after 3 minutes to test the backend is working before testing in the mobile apps!**
