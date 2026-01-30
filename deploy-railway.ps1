# Railway PostgreSQL Deployment Script
# Run this script to deploy backend with PostgreSQL to Railway
# Office: Run Run Team

Write-Host "🚂 Railway PostgreSQL Deployment" -ForegroundColor Cyan
Write-Host "=================================" -ForegroundColor Cyan
Write-Host ""

# Check if we're in the backend directory
if (-not (Test-Path "server.js")) {
    Write-Host "❌ Please run this script from the backend directory" -ForegroundColor Red
    Write-Host "   cd backend" -ForegroundColor Yellow
    exit 1
}

Write-Host "✅ Step 1: Verifying package.json dependencies..." -ForegroundColor Green
if (-not (Select-String -Path "package.json" -Pattern '"pg"')) {
    Write-Host "⚠️  Installing pg package..." -ForegroundColor Yellow
    npm install pg
} else {
    Write-Host "   ✓ pg package already installed" -ForegroundColor Gray
}

Write-Host ""
Write-Host "✅ Step 2: Verifying server.js uses PostgreSQL..." -ForegroundColor Green
$serverContent = Get-Content "server.js" -Raw
if ($serverContent -match "db-postgres") {
    Write-Host "   ✓ server.js configured for PostgreSQL" -ForegroundColor Gray
} else {
    Write-Host "   ⚠️  server.js still using SQLite!" -ForegroundColor Yellow
    Write-Host "   Please update line 24 in server.js:" -ForegroundColor Yellow
    Write-Host "   const { pool } = require('./database/db-postgres');" -ForegroundColor Cyan
}

Write-Host ""
Write-Host "📋 MANUAL STEPS REQUIRED:" -ForegroundColor Yellow
Write-Host "=========================" -ForegroundColor Yellow
Write-Host ""
Write-Host "1. Go to Railway Dashboard:" -ForegroundColor White
Write-Host "   https://railway.app/project/3769a5dc-4f76-4b74-999a-ce124b76486d" -ForegroundColor Cyan
Write-Host ""
Write-Host "2. Add PostgreSQL Database:" -ForegroundColor White
Write-Host "   • Click '+ New' button" -ForegroundColor Gray
Write-Host "   • Select 'Database'" -ForegroundColor Gray
Write-Host "   • Choose 'PostgreSQL'" -ForegroundColor Gray
Write-Host "   • Railway will auto-create DATABASE_URL variable" -ForegroundColor Gray
Write-Host ""
Write-Host "3. Initialize Database Schema:" -ForegroundColor White
Write-Host "   Option A - Via Railway Dashboard:" -ForegroundColor Gray
Write-Host "     • Click on backend service → Settings → Deploy" -ForegroundColor Gray
Write-Host "     • Set custom start command:" -ForegroundColor Gray
Write-Host "       node database/init-postgres.js ; node server.js" -ForegroundColor Cyan
Write-Host "     • Click 'Redeploy' - this creates all tables" -ForegroundColor Gray
Write-Host "     • After success, change back to: node server.js" -ForegroundColor Cyan
Write-Host ""
Write-Host "   Option B - Via Railway CLI:" -ForegroundColor Gray
Write-Host "     railway run node database/init-postgres.js" -ForegroundColor Cyan
Write-Host ""
Write-Host "4. Deploy the Updated Code:" -ForegroundColor White
Write-Host "   If using Git:" -ForegroundColor Gray
Write-Host "     git add ." -ForegroundColor Cyan
Write-Host "     git commit -m 'Switch to PostgreSQL'" -ForegroundColor Cyan
Write-Host "     git push" -ForegroundColor Cyan
Write-Host ""
Write-Host "   Or use Railway CLI:" -ForegroundColor Gray
Write-Host "     railway up" -ForegroundColor Cyan
Write-Host ""
Write-Host "5. Verify Deployment:" -ForegroundColor White
Write-Host "   Test URL: https://zippy-healing-production-24e4.up.railway.app" -ForegroundColor Cyan
Write-Host "   Should return: 'Run Run API is running'" -ForegroundColor Gray
Write-Host ""
Write-Host "📝 Files Created:" -ForegroundColor Green
Write-Host "   ✓ backend/database/db-postgres.js" -ForegroundColor Gray
Write-Host "   ✓ backend/database/init-postgres.js" -ForegroundColor Gray
Write-Host "   ✓ RAILWAY_POSTGRESQL_GUIDE.md" -ForegroundColor Gray
Write-Host ""
Write-Host "📖 For detailed instructions, see:" -ForegroundColor Yellow
Write-Host "   RAILWAY_POSTGRESQL_GUIDE.md" -ForegroundColor Cyan
Write-Host ""
Write-Host "✨ Ready to deploy!" -ForegroundColor Green
