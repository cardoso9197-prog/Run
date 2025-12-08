@echo off
echo ========================================
echo PostgreSQL Service Registration
echo ========================================
echo.
echo This script requires Administrator privileges.
echo Please run as Administrator if it fails.
echo.
pause

cd "C:\Program Files\PostgreSQL\18\bin"

echo Registering PostgreSQL as Windows service...
pg_ctl.exe register -N "PostgreSQL18" -D "C:\Program Files\PostgreSQL\18\data"

if %ERRORLEVEL% equ 0 (
    echo ✓ Service registered successfully!
    echo.
    echo Starting PostgreSQL service...
    net start PostgreSQL18
    
    if %ERRORLEVEL% equ 0 (
        echo ✓ PostgreSQL is now running!
    ) else (
        echo × Failed to start service
        echo Try running: sc start PostgreSQL18
    )
) else (
    echo × Failed to register service
    echo.
    echo Common reasons:
    echo 1. Not running as Administrator
    echo 2. pg_ctl.exe not found
    echo 3. Service already registered
    echo.
    echo If service already exists, try:
    echo   net start postgresql-x64-18
    echo   or sc query PostgreSQL to find service name
)

echo.
pause
