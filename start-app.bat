@echo off
title SkillProof AI Platform
cls
echo ======================================================================
echo           SkillProof AI - Evidence-Based Skill Passport
echo ======================================================================
echo.
echo Starting unified server on http://localhost:5000 ...
echo.

cd /d "%~dp0server"

start http://localhost:5000

node server.js
pause
