# 🚀 Deploy Run-Run Website to Netlify

## Quick Deployment Steps

Since the code is already on GitHub at **https://github.com/cardoso9197-prog/runWeb**, follow these steps to deploy to Netlify:

---

## Method 1: Netlify Dashboard (Easiest - 2 Minutes)

### Step-by-Step:

1. **Go to Netlify Dashboard**
   - Visit: https://app.netlify.com
   - Log in to your account

2. **Import Project**
   - Click **"Add new site"**
   - Select **"Import an existing project"**

3. **Connect to GitHub**
   - Choose **"Deploy with GitHub"**
   - Authorize Netlify if prompted
   - Search for: **runWeb**
   - Select: **cardoso9197-prog/runWeb**

4. **Configure Build Settings**
   ```
   Base directory: (leave empty)
   Build command: npm run build
   Publish directory: out
   ```

5. **Advanced Settings (Optional)**
   - Add environment variable if needed:
     - Key: `NODE_VERSION`
     - Value: `18`

6. **Deploy**
   - Click **"Deploy site"**
   - Wait 2-3 minutes for build to complete

7. **Your Site is Live!**
   - You'll get a URL like: `https://amazing-site-name.netlify.app`
   - You can change the site name in settings

---

## Method 2: Netlify CLI (From Command Line)

If you prefer using the terminal:

### Step 1: Install Netlify CLI
```bash
npm install -g netlify-cli
```

### Step 2: Login to Netlify
```bash
cd "c:\Users\Colondo Full service\Desktop\Run-Run GW\runrun-web"
netlify login
```
This will open a browser to authenticate.

### Step 3: Initialize Netlify Site
```bash
netlify init
```

Choose:
- **Create & configure a new site**
- Select your team
- Enter site name (or press enter for random)
- Build command: `npm run build`
- Publish directory: `out`

### Step 4: Deploy
```bash
netlify deploy --prod
```

---

## Configuration File Already Exists

Your project already has `netlify.toml` with the correct settings:

```toml
[build]
  command = "npm run build"
  publish = "out"

[build.environment]
  NODE_VERSION = "18"
  NEXT_PUBLIC_API_URL = "https://zippy-healing-production-24e4.up.railway.app"
```

---

## What Happens After Deployment

✅ Netlify will:
1. Pull code from GitHub
2. Install dependencies (`npm install`)
3. Build the site (`npm run build`)
4. Publish to CDN
5. Give you a live URL

⚡ Automatic Updates:
- Every time you push to GitHub, Netlify auto-deploys
- No need to manually redeploy

---

## Testing Your Live Site

Once deployed, test these features:

### Download Section:
- [ ] Click main download button → Modal appears
- [ ] Click QR code → Modal opens
- [ ] Scan QR code → Shows "Coming Soon" message
- [ ] Click phone number → Opens tel: link
- [ ] Click email → Opens mailto: suporte@runrungb.com

### Mobile Responsiveness:
- [ ] Test on phone
- [ ] Test on tablet
- [ ] Test on desktop

---

## Troubleshooting

### If Build Fails:

**Error: "npm install failed"**
- Check that package.json is in the root
- Make sure all dependencies are listed

**Error: "Build command failed"**
- Verify Next.js configuration
- Check for TypeScript errors
- Review build logs in Netlify dashboard

**Error: "Page not found"**
- Confirm publish directory is set to `out`
- Check that `npm run build` generates the `out` folder

---

## Custom Domain (Optional)

After deployment, you can add a custom domain:

1. Go to Netlify site settings
2. Click **"Domain settings"**
3. Click **"Add custom domain"**
4. Follow DNS configuration instructions

---

## Environment Variables

The site uses these environment variables (already in netlify.toml):

- `NODE_VERSION`: 18
- `NEXT_PUBLIC_API_URL`: https://zippy-healing-production-24e4.up.railway.app

If you need to add more:
1. Go to site settings
2. Click **"Environment variables"**
3. Add key-value pairs

---

## 📱 Mobile App Links

Share these with users once the website is live:

**Passenger APK:**
https://expo.dev/accounts/edipro/projects/runrun-passenger/builds/7c88e0f3-2564-41b8-9557-bc4e4a65ff2a

**Driver APK:**
https://expo.dev/accounts/edipro/projects/runrun-driver/builds/31a8e9bf-264d-4cc2-a12e-bd8c08a8197e

---

## Summary

**Easiest Way:** Use Netlify Dashboard (Method 1)
1. Go to https://app.netlify.com
2. Import cardoso9197-prog/runWeb
3. Click deploy
4. Done! 🎉

Your website will be live in 2-3 minutes with automatic deployments enabled.

---

**GitHub Repository:** https://github.com/cardoso9197-prog/runWeb  
**Netlify Dashboard:** https://app.netlify.com  
**Contact:** Edivaldo Cardoso - +245 955 971 275 - suporte@runrungb.com

---

**Ready to Deploy!** 🚀
