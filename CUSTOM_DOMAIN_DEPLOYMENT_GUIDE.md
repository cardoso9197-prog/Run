# 🚀 CUSTOM DOMAIN DEPLOYMENT GUIDE - runrungw.com

**Date:** January 30, 2026
**Domain:** runrungw.com
**Repository:** https://github.com/cardoso9197-prog/runWeb
**Status:** Configuration Pushed ✅

---

## 🎯 DEPLOYMENT STATUS

### ✅ **Code Changes Pushed:**
- **Commit:** `0afd1fc`
- **Files:** `public/CNAME`, `netlify.toml`
- **Status:** Pushed to GitHub main branch

### 🔄 **Netlify Auto-Deployment:**
- **Status:** Building now (2-4 minutes)
- **URL:** https://runrunwebapp.netlify.app
- **Custom Domain:** runrungw.com

---

## 📋 NETLIFY DOMAIN SETUP STEPS

### **Step 1: Access Netlify Dashboard**
1. Go to: https://app.netlify.com/sites/runrunwebapp
2. Login with your Netlify account

### **Step 2: Add Custom Domain**
1. Click **"Domain management"** in the left sidebar
2. Click **"Add custom domain"**
3. Enter: `runrungw.com`
4. Click **"Verify"**

### **Step 3: DNS Configuration**
Netlify will show you DNS records to add to your domain registrar:

#### **Required DNS Records:**

**A Record:**
```
Type: A
Name: @
Value: 75.2.60.5
```

**CNAME Record:**
```
Type: CNAME
Name: www
Value: runrunwebapp.netlify.app
```

### **Step 4: Domain Registrar Setup**
Go to your domain registrar (where you bought runrungw.com) and add these DNS records:

1. **GoDaddy, Namecheap, or similar:**
   - Login to your account
   - Find DNS settings for runrungw.com
   - Add the A record and CNAME record above

2. **Wait for DNS propagation** (5-30 minutes)

### **Step 5: SSL Certificate**
Netlify will automatically:
- ✅ Provision SSL certificate
- ✅ Enable HTTPS
- ✅ Redirect HTTP to HTTPS

---

## 🔧 TECHNICAL CONFIGURATION

### **Files Modified:**

#### **public/CNAME**
```
runrungw.com
```

#### **netlify.toml**
```toml
[build]
  command = "npm run build"
  publish = "out"

[build.environment]
  NODE_VERSION = "18"
  NEXT_PUBLIC_API_URL = "https://zippy-healing-production-24e4.up.railway.app"

# Custom Domain Redirect
[[redirects]]
  from = "https://runrunwebapp.netlify.app/*"
  to = "https://runrungw.com/:splat"
  status = 301
  force = true

# SPA fallback
[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

### **Next.js Configuration:**
- **Output:** Static export (`output: 'export'`)
- **Build Command:** `npm run build`
- **Publish Directory:** `out/`

---

## 🌐 DOMAIN VERIFICATION CHECKLIST

### **Immediate (After DNS Setup):**
- [ ] `runrungw.com` loads the website
- [ ] `www.runrungw.com` redirects to `runrungw.com`
- [ ] HTTPS works (green lock icon)
- [ ] All pages load correctly
- [ ] QR codes work
- [ ] Download links work

### **Test All Features:**
- [ ] Homepage loads
- [ ] Download section displays
- [ ] App toggles work (Passenger/Driver)
- [ ] Platform toggles work (Android/iOS)
- [ ] QR codes generate correctly
- [ ] Direct download links open Expo pages

---

## 🚨 TROUBLESHOOTING

### **If Domain Doesn't Work:**
1. **Check DNS Propagation:**
   ```bash
   nslookup runrungw.com
   # Should return Netlify IP: 75.2.60.5
   ```

2. **Clear DNS Cache:**
   ```bash
   ipconfig /flushdns  # Windows
   # or restart your router
   ```

3. **Check Netlify Domain Settings:**
   - Go to Site Settings → Domain management
   - Verify domain status is "Active"

### **If Build Fails:**
1. Check Netlify deploy logs
2. Verify `package.json` scripts are correct
3. Check Node.js version (18)

---

## 📊 DEPLOYMENT TIMELINE

| Time | Action | Status |
|------|--------|--------|
| Now | Code pushed to GitHub | ✅ Done |
| 2-4 min | Netlify build starts | 🔄 In Progress |
| 5-10 min | Netlify build completes | ⏳ Pending |
| 5-30 min | DNS setup at registrar | 🔄 Your Action Needed |
| 30-60 min | DNS propagation worldwide | ⏳ Pending |
| 1 hour | Full domain activation | ⏳ Pending |

---

## 🔗 IMPORTANT LINKS

- **GitHub Repository:** https://github.com/cardoso9197-prog/runWeb
- **Netlify Dashboard:** https://app.netlify.com/sites/runrunwebapp
- **Current URL:** https://runrunwebapp.netlify.app
- **Target URL:** https://runrungw.com
- **DNS Checker:** https://dnschecker.org/

---

## 📞 SUPPORT

**Email:** suporte@runrungb.com
**WhatsApp:** +245 955 921 474

---

## ✅ FINAL STEPS

1. **Complete DNS Setup** (add A and CNAME records)
2. **Wait for Propagation** (5-30 minutes)
3. **Test Domain** (runrungw.com)
4. **Verify All Features Work**
5. **Share with Users!** 🚀

---

**Configuration Complete:** January 30, 2026
**Next Action:** DNS setup at domain registrar
**Expected Completion:** Within 1 hour
