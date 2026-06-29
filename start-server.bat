@echo off
echo ==========================================
echo   ThinkSuite Admin Server
echo ==========================================
echo.
echo Admin Panel: http://localhost:3001/admin/login.html
echo Press Ctrl+C to stop.
echo.
cd /d "%~dp0backend"
node server.js
pause
