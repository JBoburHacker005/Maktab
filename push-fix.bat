@echo off
echo Committing and pushing changes to Railway...
echo.
git add .
git commit -m "Fix: Switch to bun run and update configs"
git push
echo.
echo ----------------------------------------------------------------
echo If you see 'git is not recognized', please use VS Code or GitHub Desktop to push.
echo ----------------------------------------------------------------
echo.
echo DONT FORGET: You must set VITE_SUPABASE_URL in Railway Variables!
echo.
pause
