# 🔐 Security Information

## Admin Authentication

### Password Security
✅ **Password is now hashed using bcrypt** (10 salt rounds)

**Important:** The admin password is **NOT** stored in plain text. It is hashed using bcrypt for security.

### Admin Credentials
- **Email:** `cardoso9197@gmail.com`
- **Password:** `Inside9791@` (use this to login)
- **Password Hash:** `$2b$10$OG7TuntsK2g6ws1EFP8ZXuxRZWM2viFYUKqq1irqbKhE9hXCRkPz6`

### How It Works
1. User enters email and password
2. System compares entered password with stored bcrypt hash
3. If match, login is successful
4. Session token is stored in localStorage

## Security Features Implemented

### 1. Password Hashing
- ✅ Bcrypt algorithm with 10 salt rounds
- ✅ One-way hashing (cannot be reversed)
- ✅ Secure password comparison

### 2. Session Management
- ✅ Token-based authentication
- ✅ LocalStorage session persistence
- ✅ Automatic logout functionality

### 3. Route Protection
- ✅ Admin routes require authentication
- ✅ Automatic redirect to login if not authenticated
- ✅ Session validation on protected pages

### 4. API Security
- ✅ Admin key header required (`x-admin-key: runrun-admin-2025`)
- ✅ Backend validates all admin requests
- ✅ Error handling for unauthorized access

## Best Practices for Production

### 1. Environment Variables
Move sensitive data to environment variables:

```env
# .env.local (DO NOT commit to git)
NEXT_PUBLIC_ADMIN_EMAIL=cardoso9197@gmail.com
ADMIN_PASSWORD_HASH=$2b$10$OG7TuntsK2g6ws1EFP8ZXuxRZWM2viFYUKqq1irqbKhE9hXCRkPz6
NEXT_PUBLIC_BACKEND_ADMIN_KEY=runrun-admin-2025
```

### 2. HTTPS Only
- ✅ Netlify automatically provides SSL/TLS
- ✅ All data encrypted in transit
- ⚠️ Never use HTTP in production

### 3. Rate Limiting (Recommended)
Consider adding rate limiting to prevent brute force attacks:

```typescript
// Example: Limit login attempts
const MAX_ATTEMPTS = 5
const LOCKOUT_TIME = 15 * 60 * 1000 // 15 minutes
```

### 4. Session Timeout (Recommended)
Add automatic session expiration:

```typescript
// Example: 24 hour session timeout
const SESSION_DURATION = 24 * 60 * 60 * 1000
```

### 5. Two-Factor Authentication (Future Enhancement)
Consider implementing 2FA for additional security:
- Email verification codes
- SMS verification
- Authenticator app (Google Authenticator, Authy)

## Security Checklist

### Current Status
- [x] Password hashing (bcrypt)
- [x] Session management
- [x] Route protection
- [x] API key authentication
- [x] HTTPS (via Netlify)
- [x] CORS configuration
- [x] Security headers

### Future Enhancements
- [ ] Rate limiting on login
- [ ] Session timeout/expiration
- [ ] Two-factor authentication
- [ ] IP whitelist for admin panel
- [ ] Login attempt logging
- [ ] Brute force protection
- [ ] CAPTCHA on login form

## Password Management

### Changing the Admin Password

1. **Generate new hash:**
```bash
cd runrun-web
node -e "const bcrypt = require('bcryptjs'); bcrypt.hash('NEW_PASSWORD_HERE', 10, (err, hash) => { console.log('New hash:', hash); })"
```

2. **Update login page:**
Replace the `ADMIN_PASSWORD_HASH` constant with the new hash.

3. **Test login:**
Try logging in with the new password to verify it works.

### Resetting Password
If you forget the admin password:
1. Generate a new hash (see above)
2. Update the hash in `src/app/admin/login/page.tsx`
3. Rebuild and redeploy the application

## Incident Response

### If Credentials Are Compromised
1. **Immediately** change admin password
2. Generate new admin key for backend
3. Clear all active sessions (users must re-login)
4. Review access logs for unauthorized access
5. Update both frontend and backend with new credentials
6. Redeploy application

### Monitoring
Set up monitoring to detect:
- Multiple failed login attempts
- Unusual access patterns
- API key misuse
- Suspicious admin actions

## Contact Security Team
**Emergency:** +245 955 971 275  
**Email:** security@runrungb.com

---

**Last Updated:** January 5, 2026  
**Security Level:** Medium (Basic Protection)  
**Next Audit:** February 2026
