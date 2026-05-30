@echo off
set PORT=5173
set BASE_PATH=/
set VITE_BACKEND_URL=http://localhost:8000
pnpm --filter @workspace/tourism-marketplace run dev
pause
