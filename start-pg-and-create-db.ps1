$ErrorActionPreference = "Stop"

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "PostgreSQL Auto Setup" -ForegroundColor Yellow
Write-Host "========================================`n" -ForegroundColor Cyan

$pgBin = "C:\Program Files\PostgreSQL\18\bin"
$pgData = "C:\Program Files\PostgreSQL\18\data"
$env:PATH += ";$pgBin"
$env:PGPASSWORD = "postgres"

# Check if postgres is already running
$existing = Get-Process postgres -ErrorAction SilentlyContinue
if ($existing) {
    Write-Host "[OK] PostgreSQL is already running (PID: $($existing.Id))" -ForegroundColor Green
} else {
    Write-Host "[1/4] Starting PostgreSQL server..." -ForegroundColor Yellow
    
    # Start postgres in background
    $startInfo = New-Object System.Diagnostics.ProcessStartInfo
    $startInfo.FileName = "$pgBin\postgres.exe"
    $startInfo.Arguments = "-D `"$pgData`""
    $startInfo.UseShellExecute = $false
    $startInfo.CreateNoWindow = $true
    $startInfo.RedirectStandardOutput = $false
    $startInfo.RedirectStandardError = $false
    
    $process = [System.Diagnostics.Process]::Start($startInfo)
    Write-Host "      PostgreSQL started (PID: $($process.Id))" -ForegroundColor Green
    
    Write-Host "[2/4] Waiting for server to initialize (10 seconds)..." -ForegroundColor Yellow
    Start-Sleep -Seconds 10
}

Write-Host "[3/4] Testing connection..." -ForegroundColor Yellow

# Test if we can connect
$testResult = & "$pgBin\psql.exe" -U postgres -h localhost -d postgres -c "SELECT 1;" 2>&1
if ($LASTEXITCODE -ne 0) {
    Write-Host "      [FAILED] Cannot connect to PostgreSQL" -ForegroundColor Red
    Write-Host "      Error: $testResult" -ForegroundColor Red
    Write-Host "`nPlease check:" -ForegroundColor Yellow
    Write-Host "  1. PostgreSQL password is 'postgres'" -ForegroundColor White
    Write-Host "  2. Check logs: C:\Program Files\PostgreSQL\18\data\log" -ForegroundColor White
    exit 1
}

Write-Host "      [OK] Connection successful!" -ForegroundColor Green

Write-Host "[4/4] Creating database 'runrun_db'..." -ForegroundColor Yellow

# Create database
$createResult = & "$pgBin\psql.exe" -U postgres -h localhost -d postgres -c "CREATE DATABASE runrun_db;" 2>&1

if ($createResult -match "already exists") {
    Write-Host "      [OK] Database already exists" -ForegroundColor Cyan
    $dbExists = $true
} elseif ($LASTEXITCODE -eq 0) {
    Write-Host "      [OK] Database created successfully!" -ForegroundColor Green
    $dbExists = $true
} else {
    Write-Host "      [FAILED] Error creating database" -ForegroundColor Red
    Write-Host "      $createResult" -ForegroundColor Red
    $dbExists = $false
}

if ($dbExists) {
    Write-Host "`n========================================" -ForegroundColor Cyan
    Write-Host "SUCCESS!" -ForegroundColor Green
    Write-Host "========================================" -ForegroundColor Cyan
    Write-Host "`nPostgreSQL is running and database 'runrun_db' is ready!" -ForegroundColor Green
    Write-Host "`nNext step: Initialize database tables" -ForegroundColor White
    Write-Host "Run: node database\init.js`n" -ForegroundColor Yellow
} else {
    exit 1
}
