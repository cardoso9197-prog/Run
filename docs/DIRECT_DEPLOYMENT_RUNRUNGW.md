# 🌐 Direct Deployment to runrungw.com

## Current Status

The website is building now. Once complete, you need to upload the built files to your hosting provider for runrungw.com.

---

## 📦 Files to Upload

After the build completes, you'll have an `out` folder with all the static files:

```
runrun-web/
  └── out/          ← Upload this entire folder to your web hosting
      ├── index.html
      ├── _next/
      ├── images/
      └── ... (all static files)
```

---

## 🚀 Deployment Methods for runrungw.com

### Method 1: cPanel File Manager (Most Common)

1. **Log in to cPanel** for runrungw.com
   - Usually at: https://runrungw.com:2083 or your hosting provider's panel

2. **Go to File Manager**
   - Navigate to `public_html` or `www` folder

3. **Delete Old Files** (if any)
   - Select all files in public_html
   - Delete them

4. **Upload New Files**
   - Click "Upload"
   - Navigate to: `C:\Users\Colondo Full service\Desktop\Run-Run GW\runrun-web\out`
   - Select ALL files and folders inside `out` folder
   - Upload them to `public_html`

5. **Verify Structure**
   Your public_html should have:
   ```
   public_html/
   ├── index.html
   ├── _next/
   ├── 404.html
   └── other files...
   ```

### Method 2: FTP Upload

1. **Get FTP Credentials**
   - FTP Host: ftp.runrungw.com (or check your hosting)
   - Username: (from your hosting provider)
   - Password: (from your hosting provider)

2. **Use FileZilla or WinSCP**
   - Download: https://filezilla-project.org/
   - Connect to your FTP server

3. **Upload Files**
   - Navigate to `public_html` on the server
   - Delete old files
   - Upload all files from `out` folder

### Method 3: Via Command Line (if you have SSH)

```bash
# From your computer, upload via SCP
scp -r "c:\Users\Colondo Full service\Desktop\Run-Run GW\runrun-web\out\*" user@runrungw.com:/home/user/public_html/
```

---

## 🔧 Server Configuration

### For Apache (.htaccess)

Create `.htaccess` in public_html:

```apache
# Redirect all requests to HTTPS
RewriteEngine On
RewriteCond %{HTTPS} off
RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]

# Handle Next.js routes
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  RewriteRule ^index\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule . /index.html [L]
</IfModule>

# Cache static assets
<IfModule mod_expires.c>
  ExpiresActive On
  ExpiresByType image/jpg "access plus 1 year"
  ExpiresByType image/jpeg "access plus 1 year"
  ExpiresByType image/gif "access plus 1 year"
  ExpiresByType image/png "access plus 1 year"
  ExpiresByType text/css "access plus 1 month"
  ExpiresByType application/javascript "access plus 1 month"
</IfModule>
```

### For Nginx (nginx.conf)

```nginx
server {
    listen 80;
    server_name runrungw.com www.runrungw.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name runrungw.com www.runrungw.com;
    
    root /var/www/html;
    index index.html;
    
    location / {
        try_files $uri $uri/ /index.html;
    }
    
    location /_next/static {
        add_header Cache-Control "public, max-age=31536000, immutable";
    }
}
```

---

## ✅ After Upload Checklist

1. **Visit Website**
   - Go to: https://runrungw.com
   - Should load the home page

2. **Test Features**
   - [ ] Click download buttons → Modal appears
   - [ ] Click QR codes → Modal appears
   - [ ] Scan QR codes → Shows contact info
   - [ ] Phone link works: +245 955 971 275
   - [ ] Email link works: suporte@runrungb.com

3. **Check Mobile**
   - [ ] Test on phone browser
   - [ ] Verify responsive design

4. **Clear Cache**
   - Clear browser cache if old site still shows
   - Try incognito/private mode

---

## 🔍 Troubleshooting

### Problem: "404 Not Found"
**Solution:** Make sure `index.html` is in the root of public_html

### Problem: "Blank page"
**Solution:** 
- Check browser console for errors
- Verify all files from `out` folder were uploaded
- Check that `_next` folder is present

### Problem: "Old site still showing"
**Solution:**
- Clear browser cache (Ctrl+Shift+Delete)
- Wait 5-10 minutes for DNS to propagate
- Try different browser or incognito mode

### Problem: "CSS not loading"
**Solution:**
- Make sure `_next` folder uploaded completely
- Check file permissions (should be 644 for files, 755 for folders)
- Verify .htaccess is present

---

## 📱 Quick Upload via Hosting Provider

Most hosting providers have a web interface:

1. **Hostinger:** Dashboard → File Manager
2. **cPanel:** File Manager → public_html
3. **Plesk:** Files → File Manager
4. **DirectAdmin:** File Manager

Navigate to `public_html`, delete old files, and upload contents of the `out` folder.

---

## 🎯 Summary

1. ✅ Wait for build to complete (running now)
2. ✅ Log in to your hosting provider for runrungw.com
3. ✅ Navigate to public_html or www folder
4. ✅ Delete old files
5. ✅ Upload all files from `runrun-web/out` folder
6. ✅ Visit https://runrungw.com to verify

---

**Building now...** Check back in 2-3 minutes when build completes!

Contact: Edivaldo Cardoso - +245 955 971 275 - suporte@runrungb.com
