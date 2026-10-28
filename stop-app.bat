@echo off
title Stop SkillProof AI
cls
echo ======================================================================
echo           Stopping SkillProof AI Background Server...
echo ======================================================================
echo.

for /f "tokens=5" %%a in ('netstat -aon ^| findstr ":5000" ^| findstr "LISTENING"') do (
    echo Stopping server process PID: %%a ...
    taskkill /F /PID %%a >nul 2>&1
)

echo.
echo SkillProof AI server has been stopped.
timeout /t 3 >nul
