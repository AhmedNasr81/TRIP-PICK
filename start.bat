@echo off
echo Starting WanderLust frontend...
echo Backend expected at http://localhost:8080
echo Frontend will open at http://localhost:5173
pnpm --filter @workspace/tourism-marketplace run dev
pause
