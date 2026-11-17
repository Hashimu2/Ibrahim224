@echo off
title JobPulse - Job Tracking Application
echo Starting JobPulse Application...
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0start-server.ps1"
pause

