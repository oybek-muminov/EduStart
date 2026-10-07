@echo off
setlocal
cd /d "%~dp0\..\.."
node tools\automation\runner.cjs
exit /b %errorlevel%
