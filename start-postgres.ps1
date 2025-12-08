# Start PostgreSQL Server
Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "Starting PostgreSQL Server" -ForegroundColor Yellow
Write-Host "========================================`n" -ForegroundColor Cyan

$pgBin = "C:\Program Files\PostgreSQL\18\bin\postgres.exe"
$pgData = "C:\Program Files\PostgreSQL\18\data"

# Check if already running
$existing = Get-Process postgres -ErrorAction SilentlyContinue
if ($existing) {
    Write-Host "PostgreSQL is already running (PID: $($existing.Id))" -ForegroundColor Green
} else {
    Write-Host "Starting PostgreSQL server..." -ForegroundColor Yellow
    
    # Start PostgreSQL in a new window
    $process = Start-Process -FilePath $pgBin -ArgumentList "-D", $pgData -WindowStyle Minimized -PassThru
    
    Write-Host "PostgreSQL started (PID: $($process.Id))" -ForegroundColor Green
    Write-Host "  Waiting for server to initialize..." -ForegroundColor Gray
    Start-Sleep -Seconds 5
}

# Test connection
Write-Host "`nTesting connection..." -ForegroundColor Yellow
$env:PGPASSWORD = "Inside9791"

try {
    $result = & "C:\Program Files\PostgreSQL\18\bin\psql.exe" -U postgres -h localhost -c "SELECT 1;" 2>&1
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "Connection successful!" -ForegroundColor Green
        
        # Create database
        Write-Host "`nCreating database 'runrun_db'..." -ForegroundColor Yellow
        $createResult = & "C:\Program Files\PostgreSQL\18\bin\psql.exe" -U postgres -h localhost -c "CREATE DATABASE runrun_db;" 2>&1
        
        if ($createResult -match 'already exists') {
            Write-Host "i Database already exists" -ForegroundColor Cyan
        } elseif ($LASTEXITCODE -eq 0) {
            Write-Host "Database created successfully!" -ForegroundColor Green
        } else {
            Write-Host "Error creating database:" -ForegroundColor Red
            Write-Host $createResult -ForegroundColor Red
        }
        
        Write-Host "`n========================================" -ForegroundColor Cyan
        Write-Host "PostgreSQL is ready!" -ForegroundColor Green
        Write-Host "========================================" -ForegroundColor Cyan
        Write-Host "`nNext step: Initialize database tables" -ForegroundColor White
        Write-Host "Run: node database\init.js`n" -ForegroundColor Yellow
        
    } else {
        Write-Host "Connection failed" -ForegroundColor Red
        Write-Host "Error: $result" -ForegroundColor Red
        Write-Host "`nPlease check:" -ForegroundColor Yellow
        Write-Host "1. PostgreSQL password is 'Inside9791'" -ForegroundColor White
        Write-Host "2. PostgreSQL is accepting connections" -ForegroundColor White
        Write-Host "3. Check logs in: C:\Program Files\PostgreSQL\18\data\log" -ForegroundColor White
    }
} catch {
    Write-Host "Error occurred: $_" -ForegroundColor Red
}
