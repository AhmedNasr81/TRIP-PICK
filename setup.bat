@echo off
echo Checking Node.js...
node -v >nul 2>&1 || (echo ERROR: Node.js not installed. Download from https://nodejs.org && pause && exit /b 1)

echo Installing pnpm...
npm install -g pnpm

echo Installing dependencies...
pnpm install

echo Done! Run start.bat to launch the frontend.
pause
