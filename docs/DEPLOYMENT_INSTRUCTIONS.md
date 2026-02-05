# 🚀 Deployment Instructions for Run-Run Website

## ✅ Changes Committed & Pushed

All website changes have been committed and are ready for deployment:

### Changes Included:
1. ✅ **ComingSoonModal Component** - Beautiful modal with Portuguese message
2. ✅ **Updated Email** - Changed to suporte@runrungb.com
3. ✅ **Clickable QR Codes** - Show modal when clicked
4. ✅ **QR Code Content** - Shows "Coming Soon" message instead of download links
5. ✅ **All Download Buttons** - Trigger modal instead of downloading

---

## 📋 Deployment Methods

### Method 1: Automatic Netlify Deployment (Recommended)

If your Netlify site is connected to your GitHub repository:

1. **Changes are already pushed to main branch** ✅
2. Netlify will automatically detect the push
3. Netlify will build and deploy automatically
4. Check Netlify dashboard: https://app.netlify.com

**Typical Build Time:** 2-5 minutes

---

### Method 2: Manual Netlify CLI Deployment

If you have Netlify CLI installed:

```bash
# 1. Navigate to the website directory
cd "c:\Users\Colondo Full service\Desktop\Run-Run GW\runrun-web"

# 2. Build the production version
npm run build

# 3. Deploy to Netlify
netlify deploy --prod
```

---

### Method 3: Netlify Dashboard Manual Deploy

1. Go to https://app.netlify.com
2. Select your Run-Run site
3. Click "Deploys" tab
4. Click "Trigger deploy" → "Deploy site"

---

## 🔍 Verify Deployment

After deployment completes, test these features on your live site:

### Test Checklist:
- [ ] Visit your production website
- [ ] Click main download button → Modal appears
- [ ] Click QR code → Modal opens
- [ ] Scan QR code with phone → Shows "Coming Soon" message
- [ ] Check email in modal → Should be suporte@runrungb.com
- [ ] Click phone number → Phone app opens
- [ ] Click email → Email app opens
- [ ] Test on mobile device
- [ ] Test on desktop

---

## 📱 QR Code Message Content

When scanned, QR codes now show:

```
Em Breve Disponível! 🚀
App estará brevemente disponível em Apple Store e Play Store para baixar.

Volte mais logo! 🎉

Para mais informação contacte:

Edivaldo Cardoso
Programador Líder & Fundador
Run-Run Guiné-Bissau

📞 +245 955 971 275
✉️ suporte@runrungb.com
```

---

## 🔗 Production URLs

### Website
- Production URL: (Your Netlify URL - check dashboard)
- Example: https://runrun-gw.netlify.app

### Mobile Apps (APK Downloads)
- **Passenger APK:** https://expo.dev/accounts/edipro/projects/runrun-passenger/builds/7c88e0f3-2564-41b8-9557-bc4e4a65ff2a
- **Driver APK:** https://expo.dev/accounts/edipro/projects/runrun-driver/builds/31a8e9bf-264d-4cc2-a12e-bd8c08a8197e

---

## ⚙️ Build Configuration

**Build Command:** `npm run build`  
**Publish Directory:** `out`  
**Node Version:** 18  
**Framework:** Next.js 14

---

## 🎯 Next Steps After Deployment

1. **Test Live Site** - Verify all features work
2. **Share APK Links** - Distribute to testers
3. **Collect Feedback** - Get user responses
4. **Monitor Analytics** - Check website traffic
5. **Prepare for Store Submission** - When ready, submit AAB files

---

## 📞 Support Contact

**Edivaldo Cardoso**  
Programador Líder & Fundador  
Run-Run Guiné-Bissau  
📞 +245 955 971 275  
✉️ suporte@runrungb.com

---

## ✨ Summary

All code changes are committed and pushed to the main branch. If you have automatic deployments enabled on Netlify, your site should be deploying now. Check your Netlify dashboard to monitor the deployment progress.

**Status:** Ready for Production! 🚀

---

**Date:** January 15, 2025  
**Deployment:** In Progress  
**Next:** Verify live site
