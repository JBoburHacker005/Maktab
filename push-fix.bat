@echo off
echo Committing GalleryAdmin.tsx fix...
git add src/pages/admin/GalleryAdmin.tsx
git commit -m "Fix JSX syntax error in GalleryAdmin.tsx - add missing closing div"
echo.
echo Pushing to repository...
git push
echo.
echo Done! Railway should now rebuild automatically.
pause
