# START BOTH APPS SCRIPT

Write-Host "🚀 Starting Run-Run Apps..." -ForegroundColor Yellow
Write-Host ""

# Kill any existing node processes
Write-Host "Stopping existing processes..." -ForegroundColor Cyan
taskkill /F /IM node.exe 2>$null
Start-Sleep -Seconds 2

# Start Passenger App on Port 8081
Write-Host ""
Write-Host "📱 Starting Passenger App on port 8081..." -ForegroundColor Green
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd 'C:\Users\Colondo Full service\Desktop\Run-Run GW\RunRunPassenger'; npm start"

# Wait a bit
Start-Sleep -Seconds 5

# Start Driver App on Port 8082
Write-Host "📱 Starting Driver App on port 8082..." -ForegroundColor Green
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd 'C:\Users\Colondo Full service\Desktop\Run-Run GW\RunRunDriver'; npx expo start --port 8082"

Write-Host ""
Write-Host "✅ Both apps are starting in separate windows!" -ForegroundColor Green
Write-Host ""
Write-Host "📱 Passenger App: Scan QR code in first window" -ForegroundColor Yellow
Write-Host "📱 Driver App: Scan QR code in second window" -ForegroundColor Yellow
Write-Host ""
Write-Host "Press any key to exit this window..." -ForegroundColor Cyan
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
