@echo off
echo ========================================
echo Run-Run PostgreSQL Database Setup
echo ========================================
echo.

set PGBIN=C:\Program Files\PostgreSQL\18\bin
set PGDATA=C:\Program Files\PostgreSQL\18\data
set PGPASSWORD=Inside9791

echo Checking for existing PostgreSQL process...
tasklist /FI "IMAGENAME eq postgres.exe" 2>NUL | find /I /N "postgres.exe">NUL
if "%ERRORLEVEL%"=="0" (
    echo PostgreSQL is already running!
    goto create_db
)

echo.
echo Starting PostgreSQL server...
echo Please wait...
start /B "" "%PGBIN%\postgres.exe" -D "%PGDATA%"

timeout /t 5 /nobreak > nul

:create_db
echo.
echo Creating database 'runrun_db'...
"%PGBIN%\psql.exe" -U postgres -h localhost -c "CREATE DATABASE runrun_db;" 2>nul

if %ERRORLEVEL% equ 0 (
    echo ✓ Database created successfully!
) else (
    "%PGBIN%\psql.exe" -U postgres -h localhost -c "SELECT 1" -d runrun_db >nul 2>&1
    if %ERRORLEVEL% equ 0 (
        echo ✓ Database already exists!
    ) else (
        echo × Failed to create database
        echo.
        echo Please make sure PostgreSQL password is 'postgres'
        echo Or update backend/.env file with correct password
        pause
        exit /b 1
    )
)

echo.
echo ========================================
echo Database setup complete!
echo ========================================
echo.
echo Next step: Initialize database tables
echo Run: node database\init.js
echo.
pause
