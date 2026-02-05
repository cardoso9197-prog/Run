# ✅ BUILD COMPLETE - Ready to Deploy to runrungw.com

## 🎉 Your Website is Built and Ready!

The production build is complete. All files are in:
```
C:\Users\Colondo Full service\Desktop\Run-Run GW\runrun-web\out
```

---

## 🚀 QUICK DEPLOYMENT - Choose Your Method:

### Method 1: Upload via Web Hosting Control Panel (Easiest)

#### Step 1: Access Your Hosting
- Go to your hosting provider's control panel for runrungw.com
- Common panels: cPanel, Plesk, Hostinger, etc.
- Login with your credentials

#### Step 2: Open File Manager
- Find "File Manager" or "Files" section
- Navigate to your website's root folder:
  - Usually: `public_html` or `www` or `htdocs`

#### Step 3: Clear Old Files
- Select all files in the folder
- Delete them (or move to backup folder)

#### Step 4: Upload New Files
- Click "Upload" button
- Navigate to: `C:\Users\Colondo Full service\Desktop\Run-Run GW\runrun-web\out`
- **IMPORTANT:** Select ALL files and folders INSIDE the `out` folder
- Upload them directly to `public_html` (not into a subfolder)

#### Step 5: Verify Structure
Your public_html should look like this:
```
public_html/
├── index.html          ← Main page
├── _next/             ← Next.js files
├── motorista.html
├── contato.html
├── sobre.html
├── termos.html
├── privacidade.html
├── admin.html
└── 404.html
```

---

### Method 2: FTP Upload (FileZilla)

1. **Download FileZilla** (if you don't have it)
   - https://filezilla-project.org/

2. **Get FTP Credentials**
   - FTP Host: Usually `ftp.runrungw.com`
   - Username: (from your hosting provider)
   - Password: (from your hosting provider)

3. **Connect and Upload**
   - Open FileZilla
   - Enter Host, Username, Password
   - Click "Quickconnect"
   - Navigate to `public_html` on the right side (server)
   - Navigate to `C:\Users\Colondo Full service\Desktop\Run-Run GW\runrun-web\out` on the left side (local)
   - Select all files inside `out`
   - Drag to public_html

---

### Method 3: Create Deployment ZIP

If you prefer to upload a ZIP file:

1. **Create ZIP**
   - Go to: `C:\Users\Colondo Full service\Desktop\Run-Run GW\runrun-web\out`
   - Select ALL files inside
   - Right-click → Send to → Compressed (zipped) folder
   - Name it: `runrungw-deployment.zip`

2. **Upload and Extract**
   - Upload ZIP to your hosting control panel
   - Use the "Extract" or "Unzip" feature
   - Make sure files are extracted to `public_html` root

---

## 🔧 Required: Create .htaccess File

After uploading, create a file named `.htaccess` in public_html with this content:

```apache
# Force HTTPS
RewriteEngine On
RewriteCond %{HTTPS} off
RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]

# Next.js Static Export
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  RewriteRule ^index\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteCond %{REQUEST_FILENAME} !-l
  RewriteRule . /index.html [L]
</IfModule>

# Cache Control
<IfModule mod_expires.c>
  ExpiresActive On
  ExpiresDefault "access plus 1 month"
  ExpiresByType image/jpg "access plus 1 year"
  ExpiresByType image/jpeg "access plus 1 year"
  ExpiresByType image/gif "access plus 1 year"
  ExpiresByType image/png "access plus 1 year"
  ExpiresByType image/webp "access plus 1 year"
  ExpiresByType text/css "access plus 1 year"
  ExpiresByType application/javascript "access plus 1 year"
</IfModule>

# Compression
<IfModule mod_deflate.c>
  AddOutputFilterByType DEFLATE text/html text/plain text/xml text/css text/javascript application/javascript
</IfModule>
```

---

## ✅ After Deployment Checklist

Once files are uploaded:

1. **Clear Browser Cache**
   - Press `Ctrl + Shift + Delete`
   - Clear all cached data
   - Or use Incognito/Private mode

2. **Visit Your Website**
   - https://runrungw.com

3. **Test All Features**
   - [ ] Home page loads
   - [ ] Click "Baixar" button → Modal appears
   - [ ] Click QR code → Modal opens
   - [ ] Scan QR code → Shows "Coming Soon" message
   - [ ] Phone number: +245 955 971 275 (clickable)
   - [ ] Email: suporte@runrungb.com (clickable)
   - [ ] Navigate to /sobre, /contato pages
   - [ ] Test on mobile phone
   - [ ] Test on different browsers

4. **Performance Check**
   - Page loads quickly
   - Images load
   - Modal animations work
   - No console errors

---

## 🔍 Troubleshooting

### Problem: Website shows old version
**Solution:** 
- Clear browser cache (Ctrl+F5)
- Wait 5-10 minutes for CDN to update
- Try incognito mode

### Problem: 404 errors on pages
**Solution:**
- Verify `.htaccess` file exists in public_html
- Check that all HTML files uploaded correctly

### Problem: Blank white page
**Solution:**
- Open browser console (F12)
- Check for errors
- Verify `_next` folder uploaded completely
- Check file permissions (644 for files, 755 for folders)

### Problem: Modal not working
**Solution:**
- Check browser console for JavaScript errors
- Verify all files from `_next` folder are present
- Clear cache and hard refresh (Ctrl+Shift+R)

---

## 📱 Mobile App Links

Once website is live, users can:
- Click any download button
- See the "Coming Soon" modal
- Get contact information

**Passenger APK:**
https://expo.dev/accounts/edipro/projects/runrun-passenger/builds/7c88e0f3-2564-41b8-9557-bc4e4a65ff2a

**Driver APK:**
https://expo.dev/accounts/edipro/projects/runrun-driver/builds/31a8e9bf-264d-4cc2-a12e-bd8c08a8197e

---

## 📞 Need Help?

If you encounter issues during deployment:

**Contact:**
Edivaldo Cardoso  
Programador Líder & Fundador  
Run-Run Guiné-Bissau  
📞 +245 955 971 275  
✉️ suporte@runrungb.com

---

## 🎯 Summary

1. ✅ Build is complete
2. ✅ Files are in: `C:\Users\Colondo Full service\Desktop\Run-Run GW\runrun-web\out`
3. ⏳ Upload to your hosting provider's `public_html` folder
4. ⏳ Create `.htaccess` file
5. ⏳ Visit https://runrungw.com to test

**Your website is ready to go live!** 🚀

---

**Next Action:** Upload the `out` folder contents to your hosting provider now!
