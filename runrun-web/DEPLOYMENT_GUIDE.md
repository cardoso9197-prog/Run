# Run Run Web - Deployment Guide

## 🚀 Quick Deployment to Netlify

### Prerequisites
- ✅ Backend deployed on Railway
- ✅ Railway backend URL
- ✅ Netlify account
- ✅ Git repository

### Step 1: Update Environment Variables

1. Get your Railway backend URL (e.g., `https://your-app.up.railway.app`)

2. Update `.env.production`:
   ```bash
   NEXT_PUBLIC_API_URL=https://your-railway-backend.up.railway.app
   ```

### Step 2: Deploy to Netlify

#### Option A: Deploy via Netlify UI (Recommended)

1. Go to [Netlify](https://netlify.com)
2. Click "Add new site" → "Import an existing project"
3. Connect your Git repository
4. Configure build settings:
   - **Build command:** `npm run build`
   - **Publish directory:** `.next`
   - **Base directory:** `runrun-web`

5. Add environment variable:
   - Key: `NEXT_PUBLIC_API_URL`
   - Value: `https://your-railway-backend.up.railway.app`

6. Click "Deploy site"

#### Option B: Deploy via Netlify CLI

```powershell
# Install Netlify CLI
npm install -g netlify-cli

# Login to Netlify
netlify login

# Deploy from runrun-web directory
cd "c:\Users\Colondo Full service\Desktop\Run-Run GW\runrun-web"

# Build the app
npm run build

# Deploy
netlify deploy --prod
```

### Step 3: Configure Custom Domain (Optional)

1. In Netlify dashboard, go to "Domain settings"
2. Add custom domain: `runrungb.com`
3. Update DNS settings with your domain provider:
   - Add CNAME record pointing to Netlify URL

### Step 4: Test Your Deployment

1. Visit your Netlify URL
2. Test admin login:
   - Go to `/admin/login`
   - Email: `cardoso9197@gmail.com`
   - Password: `Inside9791@`
3. Verify admin dashboard connects to Railway backend

---

## 🔐 Admin Access

### Login Credentials
- **URL:** `https://your-site.netlify.app/admin/login`
- **Email:** `cardoso9197@gmail.com`
- **Password:** `Inside9791@`

### Admin Features
- ✅ Dashboard with real-time stats from Railway DB
- ✅ User management
- ✅ Driver activation/deactivation
- ✅ Ride monitoring
- ✅ Support ticket system

---

## 🛠 Local Testing

### Test Production Build Locally

```powershell
# Navigate to web directory
cd "c:\Users\Colondo Full service\Desktop\Run-Run GW\runrun-web"

# Build for production
npm run build

# Start production server
npm start

# Open browser
# http://localhost:3000
```

### Test with Railway Backend

1. Ensure backend is running on Railway
2. Update `.env.local`:
   ```bash
   NEXT_PUBLIC_API_URL=https://your-railway-backend.up.railway.app
   ```
3. Restart dev server:
   ```powershell
   npm run dev
   ```

---

## 📋 Pre-Deployment Checklist

- [ ] Backend deployed on Railway
- [ ] DATABASE_URL configured in Railway
- [ ] Backend health check passing
- [ ] Railway backend URL obtained
- [ ] `.env.production` updated with Railway URL
- [ ] Production build tested locally
- [ ] Admin login working
- [ ] API connection to Railway verified
- [ ] All pages loading correctly
- [ ] Mobile responsive design checked

---

## 🔧 Troubleshooting

### Issue: Admin dashboard shows "Erro ao carregar estatísticas"

**Solution:**
1. Check Railway backend is running
2. Verify `NEXT_PUBLIC_API_URL` in Netlify environment variables
3. Check browser console for CORS errors
4. Ensure Railway backend has CORS enabled for your Netlify domain

### Issue: Admin login not working

**Solution:**
1. Clear browser localStorage
2. Verify credentials:
   - Email: `cardoso9197@gmail.com`
   - Password: `Inside9791@`
3. Check browser console for errors

### Issue: 404 errors on page refresh

**Solution:**
- Netlify should automatically handle this with the `netlify.toml` configuration
- If issues persist, check that `netlify.toml` is in the repository root

---

## 🌐 URLs

### Production URLs
- **Web App:** `https://your-site.netlify.app`
- **Admin Panel:** `https://your-site.netlify.app/admin`
- **Admin Login:** `https://your-site.netlify.app/admin/login`
- **Backend API:** `https://your-railway-backend.up.railway.app`

### API Endpoints Used by Web
- `GET /api/admin/dashboard` - Dashboard stats
- `GET /api/admin/users` - User list
- `GET /api/admin/drivers` - Driver list
- `POST /api/admin/drivers/activate/:id` - Activate driver
- `POST /api/admin/drivers/deactivate/:id` - Deactivate driver
- `GET /api/admin/rides` - Ride list
- `GET /api/admin/support` - Support tickets

---

## 📞 Support

For deployment issues:
- **Email:** admin@runrungb.com
- **Phone:** +245 955 971 275 / +245 955 981 398

---

## 🎉 Post-Deployment

After successful deployment:
1. ✅ Update mobile apps with web URL
2. ✅ Test all admin features
3. ✅ Monitor Railway backend logs
4. ✅ Set up analytics (Google Analytics, etc.)
5. ✅ Configure SSL certificate (automatic on Netlify)
6. ✅ Set up monitoring/alerts

---

**Last Updated:** January 5, 2026  
**Version:** 1.0  
**Status:** Production Ready ✅
