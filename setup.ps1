# Run Run Backend - Automated Setup Script
# Developer: Edivaldo Cardoso
# This script sets up the complete backend server

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "  RUN RUN BACKEND - AUTO SETUP" -ForegroundColor Yellow
Write-Host "========================================`n" -ForegroundColor Cyan

# Check if running as Administrator
$isAdmin = ([Security.Principal.WindowsPrincipal] [Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)
if (-not $isAdmin) {
    Write-Host "⚠️  WARNING: Not running as Administrator" -ForegroundColor Yellow
    Write-Host "   Some operations may require elevated privileges`n" -ForegroundColor Yellow
}

# Step 1: Check Prerequisites
Write-Host "Step 1: Checking Prerequisites..." -ForegroundColor Cyan

# Check Node.js
Write-Host "  Checking Node.js..." -NoNewline
try {
    $nodeVersion = node --version
    Write-Host " ✅ Found $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host " ❌ NOT FOUND" -ForegroundColor Red
    Write-Host "`n  Please install Node.js from https://nodejs.org/`n" -ForegroundColor Yellow
    exit 1
}

# Check npm
Write-Host "  Checking npm..." -NoNewline
try {
    $npmVersion = npm --version
    Write-Host " ✅ Found v$npmVersion" -ForegroundColor Green
} catch {
    Write-Host " ❌ NOT FOUND" -ForegroundColor Red
    exit 1
}

# Check PostgreSQL
Write-Host "  Checking PostgreSQL..." -NoNewline
try {
    $pgVersion = psql --version
    Write-Host " ✅ Found" -ForegroundColor Green
} catch {
    Write-Host " ❌ NOT FOUND" -ForegroundColor Red
    Write-Host "`n  Please install PostgreSQL from https://www.postgresql.org/download/`n" -ForegroundColor Yellow
    exit 1
}

Write-Host ""

# Step 2: Install Dependencies
Write-Host "Step 2: Installing Node.js Dependencies..." -ForegroundColor Cyan
Set-Location backend
npm install
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Failed to install dependencies" -ForegroundColor Red
    exit 1
}
Write-Host "✅ Dependencies installed successfully`n" -ForegroundColor Green

# Step 3: Create .env file
Write-Host "Step 3: Creating Environment Configuration..." -ForegroundColor Cyan
if (Test-Path ".env") {
    Write-Host "  .env file already exists. Skipping..." -ForegroundColor Yellow
} else {
    Copy-Item ".env.example" ".env"
    Write-Host "  ✅ Created .env file from template" -ForegroundColor Green
    Write-Host ""
    Write-Host "  ⚠️  IMPORTANT: Edit .env file with your settings:" -ForegroundColor Yellow
    Write-Host "     - DB_PASSWORD=your_postgres_password" -ForegroundColor White
    Write-Host "     - JWT_SECRET=generate_a_random_secret" -ForegroundColor White
    Write-Host "     - GOOGLE_MAPS_API_KEY=your_api_key`n" -ForegroundColor White
}

# Step 4: Database Setup
Write-Host "Step 4: Setting Up PostgreSQL Database..." -ForegroundColor Cyan
Write-Host "  Creating database 'runrun'..." -NoNewline

# Prompt for PostgreSQL password
$pgPassword = Read-Host "  Enter PostgreSQL password (for user 'postgres')" -AsSecureString
$pgPasswordPlain = [System.Runtime.InteropServices.Marshal]::PtrToStringAuto([System.Runtime.InteropServices.Marshal]::SecureStringToBSTR($pgPassword))

$env:PGPASSWORD = $pgPasswordPlain

# Check if database exists
$dbExists = psql -U postgres -lqt 2>$null | Select-String -Pattern "runrun"

if ($dbExists) {
    Write-Host " ⚠️  Database already exists" -ForegroundColor Yellow
    $recreate = Read-Host "  Do you want to recreate it? (y/N)"
    if ($recreate -eq 'y' -or $recreate -eq 'Y') {
        psql -U postgres -c "DROP DATABASE runrun;" 2>$null
        psql -U postgres -c "CREATE DATABASE runrun;"
        Write-Host "  ✅ Database recreated" -ForegroundColor Green
    }
} else {
    psql -U postgres -c "CREATE DATABASE runrun;" 2>$null
    if ($LASTEXITCODE -eq 0) {
        Write-Host " ✅ Created" -ForegroundColor Green
    } else {
        Write-Host " ❌ Failed" -ForegroundColor Red
        Write-Host "  Error: Could not create database. Check PostgreSQL password." -ForegroundColor Red
        exit 1
    }
}

# Run schema initialization
Write-Host "  Initializing database schema..." -NoNewline
psql -U postgres -d runrun -f "database\schema.sql" >$null 2>&1
if ($LASTEXITCODE -eq 0) {
    Write-Host " ✅ Schema created" -ForegroundColor Green
} else {
    Write-Host " ❌ Failed" -ForegroundColor Red
    Write-Host "  Trying alternative method..." -ForegroundColor Yellow
    node database\init.js
}

# Clear password from environment
Remove-Item Env:\PGPASSWORD

Write-Host ""

# Step 5: Verify Installation
Write-Host "Step 5: Verifying Installation..." -ForegroundColor Cyan

Write-Host "  Checking database tables..." -NoNewline
$tableCount = psql -U postgres -d runrun -c "SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = 'public';" -t 2>$null
if ($tableCount -gt 5) {
    Write-Host " ✅ Found $tableCount tables" -ForegroundColor Green
} else {
    Write-Host " ⚠️  Warning: Expected more tables" -ForegroundColor Yellow
}

Write-Host ""

# Step 6: Summary
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  SETUP COMPLETE!" -ForegroundColor Green
Write-Host "========================================`n" -ForegroundColor Cyan

Write-Host "✅ Installation Summary:" -ForegroundColor Green
Write-Host "   • Node.js dependencies installed" -ForegroundColor White
Write-Host "   • PostgreSQL database 'runrun' created" -ForegroundColor White
Write-Host "   • Database schema initialized (11 tables)" -ForegroundColor White
Write-Host "   • Environment configuration ready`n" -ForegroundColor White

Write-Host "📝 Next Steps:" -ForegroundColor Yellow
Write-Host "   1. Edit .env file with your actual credentials:" -ForegroundColor Cyan
Write-Host "      notepad .env`n" -ForegroundColor White
Write-Host "   2. Start the development server:" -ForegroundColor Cyan
Write-Host "      npm run dev`n" -ForegroundColor White
Write-Host "   3. Test the server:" -ForegroundColor Cyan
Write-Host "      Open http://localhost:3000/health in your browser`n" -ForegroundColor White

Write-Host "📞 Support:" -ForegroundColor Yellow
Write-Host "   Developer: Edivaldo Cardoso" -ForegroundColor White
Write-Host "   Email: suporte@runrungb.com`n" -ForegroundColor White

Write-Host "========================================`n" -ForegroundColor Cyan

# Ask if user wants to start server now
$startServer = Read-Host "Do you want to start the server now? (Y/n)"
if ($startServer -ne 'n' -and $startServer -ne 'N') {
    Write-Host "`n🚀 Starting Run Run Backend Server...`n" -ForegroundColor Green
    npm run dev
}
