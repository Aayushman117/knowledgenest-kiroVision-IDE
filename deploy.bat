@echo off
echo 🚀 VisionKiro Deployment Script
echo ================================
echo.

REM Check if git is initialized
if not exist .git (
    echo 📦 Initializing Git repository...
    git init
    git add .
    git commit -m "Initial commit - VisionKiro Platform"
    echo ✅ Git initialized
) else (
    echo ✅ Git already initialized
)

echo.
echo 📋 Next Steps:
echo.
echo 1. Create GitHub repository:
echo    → Go to https://github.com/new
echo    → Name: visionkiro-platform
echo    → Run: git remote add origin https://github.com/YOUR_USERNAME/visionkiro-platform.git
echo    → Run: git push -u origin main
echo.
echo 2. Deploy Backend to Render:
echo    → Go to https://render.com
echo    → New Web Service → Connect GitHub
echo    → Root Directory: server
echo    → Build: npm install ^&^& npx prisma generate ^&^& npm run build
echo    → Start: npm start
echo.
echo 3. Deploy Frontend to Vercel:
echo    → Go to https://vercel.com/new
echo    → Import GitHub repository
echo    → Root Directory: client
echo    → Framework: Vite
echo.
echo 4. Configure Environment Variables:
echo    → Backend (Render): DATABASE_URL, JWT_SECRET, etc.
echo    → Frontend (Vercel): VITE_API_URL
echo.
echo 📖 Full guide: See VERCEL_DEPLOYMENT.md
echo.
pause
