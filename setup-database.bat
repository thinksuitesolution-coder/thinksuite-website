@echo off
echo ==========================================
echo   ThinkSuite Database Setup
echo ==========================================
echo.

set MYSQL=c:\users\kajal\downloads\new folderx\mysql\bin\mysql.exe

echo [1/3] Creating database...
"%MYSQL%" -u root -e "CREATE DATABASE IF NOT EXISTS thinksuite_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: Could not connect to MySQL. Make sure MySQL is running!
    pause
    exit /b 1
)
echo       Done!

echo [2/3] Running schema (creating all tables)...
"%MYSQL%" -u root thinksuite_db < "%~dp0database\schema.sql"
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: Schema import failed.
    pause
    exit /b 1
)
echo       Done!

echo [3/3] Complete!
echo.
echo ==========================================
echo  Database is ready. Now run start-server.bat
echo ==========================================
pause
