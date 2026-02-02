# Run Run Web - Admin Panel & Deployment

## 🔐 Admin Access

### Login URL
```
Development: http://localhost:3002/admin/login
Production: https://your-site.netlify.app/admin/login
```

### Credentials
- **Email:** `cardoso9197@gmail.com`
- **Password:** `Inside9791@`

---

## 🚀 Quick Start

### Development
```powershell
# Start backend (Terminal 1)
cd backend
npm start

# Start frontend (Terminal 2)
cd runrun-web
npm run dev
```

Access:
- Frontend: http://localhost:3002
- Backend: http://localhost:5000
- Admin: http://localhost:3002/admin/login

---

## 📦 What's Included

### ✅ Admin Panel Features
- Secure login system (email/password)
- Protected admin routes
- Real-time dashboard with Railway data
- User management
- Driver activation/deactivation
- Ride monitoring
- Support ticket system

### ✅ Production Ready
- Environment configuration (`.env.local`, `.env.production`)
- Netlify deployment config (`netlify.toml`)
- Security headers
- Error handling
- Loading states
- TypeScript types

---

## 🌐 Deployment

### Quick Deploy to Netlify

1. **Update Production URL**
   ```bash
   # Edit .env.production
   NEXT_PUBLIC_API_URL=https://your-railway-backend.up.railway.app
   ```

2. **Deploy**
   - Go to [Netlify](https://netlify.com)
   - Import Git repository
   - Build settings:
     - Build command: `npm run build`
     - Publish directory: `.next`
   - Add environment variable: `NEXT_PUBLIC_API_URL`
   - Deploy!

3. **Test**
   - Visit: `https://your-site.netlify.app/admin/login`
   - Login with admin credentials
   - Verify data loads from Railway

📖 **Full instructions:** See `DEPLOYMENT_GUIDE.md`

---

## 📁 Key Files

| File | Purpose |
|------|---------|
| `src/app/admin/login/page.tsx` | Admin login page |
| `src/app/admin/page.tsx` | Protected admin dashboard |
| `src/lib/adminAuth.ts` | Authentication utilities |
| `src/lib/api.ts` | Railway API client |
| `.env.local` | Local development config |
| `.env.production` | Production config |
| `netlify.toml` | Netlify deployment config |
| `DEPLOYMENT_GUIDE.md` | Complete deployment guide |
| `PRODUCTION_READY_SUMMARY.md` | What was built |

---

## 🔧 Configuration

### Environment Variables

**Local Development (`.env.local`):**
```bash
NEXT_PUBLIC_API_URL=http://localhost:5000
```

**Production (`.env.production` or Netlify):**
```bash
NEXT_PUBLIC_API_URL=https://your-railway-backend.up.railway.app
```

---

## 🧪 Testing

### Test Production Build Locally
```powershell
npm run build
npm start
# Visit: http://localhost:3000/admin/login
```

### Test Admin Features
1. Login at `/admin/login`
2. Check dashboard loads stats
3. Test user management
4. Test driver management
5. Verify API calls to Railway

---

## 📞 Support

- **Email:** admin@runrungb.com
- **Phone:** +245 955 971 275 / +245 955 981 398

---

## ✅ Status

**Production Ready:** ✅  
**Admin Panel:** ✅  
**Railway Integration:** ✅  
**Deployment Config:** ✅  

**Ready to deploy to Netlify!** 🚀
