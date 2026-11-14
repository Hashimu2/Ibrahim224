@echo off
title Ibrahim Hashimu - Professional Portfolio
echo Starting Ibrahim Hashimu Portfolio Server...
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0start-server.ps1" -StartPath "portfolio/"
pause
