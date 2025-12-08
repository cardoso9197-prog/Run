# Initialize Git Repository for Backend
Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "Initializing Git Repository" -ForegroundColor Yellow
Write-Host "========================================`n" -ForegroundColor Cyan

# Check if git is installed
$gitInstalled = Get-Command git -ErrorAction SilentlyContinue
if (-not $gitInstalled) {
    Write-Host "❌ Git is not installed!" -ForegroundColor Red
    Write-Host "`nPlease install Git from: https://git-scm.com/download/win" -ForegroundColor Yellow
    Write-Host "Then run this script again.`n" -ForegroundColor Yellow
    exit 1
}

Write-Host "✅ Git is installed" -ForegroundColor Green

# Initialize repository
if (Test-Path ".git") {
    Write-Host "ℹ️  Git repository already initialized" -ForegroundColor Cyan
} else {
    Write-Host "`nInitializing Git repository..." -ForegroundColor Yellow
    git init
    Write-Host "✅ Repository initialized" -ForegroundColor Green
}

# Add files
Write-Host "`nAdding files..." -ForegroundColor Yellow
git add .

# Check git status
Write-Host "`nGit Status:" -ForegroundColor Cyan
git status --short

# Commit
Write-Host "`nCreating initial commit..." -ForegroundColor Yellow
git commit -m "Initial commit: Run Run backend server"

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Commit created successfully!" -ForegroundColor Green
} else {
    Write-Host "⚠️  Commit may have failed - check output above" -ForegroundColor Yellow
}

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "NEXT STEPS:" -ForegroundColor Yellow  
Write-Host "========================================`n" -ForegroundColor Cyan

Write-Host "1. Create a new repository on GitHub:" -ForegroundColor White
Write-Host "   🔗 https://github.com/new" -ForegroundColor Cyan
Write-Host "   • Name: runrun-backend" -ForegroundColor Gray
Write-Host "   • Private repository" -ForegroundColor Gray
Write-Host "   • Don't initialize with README" -ForegroundColor Gray

Write-Host "`n2. Copy the repository URL from GitHub`n" -ForegroundColor White

Write-Host "3. Run these commands (replace YOUR_REPO_URL):" -ForegroundColor White
Write-Host "   git remote add origin YOUR_REPO_URL" -ForegroundColor Yellow
Write-Host "   git branch -M main" -ForegroundColor Yellow
Write-Host "   git push -u origin main`n" -ForegroundColor Yellow

Write-Host "4. Then deploy on Render.com or Railway.app`n" -ForegroundColor White

Write-Host "========================================`n" -ForegroundColor Cyan
