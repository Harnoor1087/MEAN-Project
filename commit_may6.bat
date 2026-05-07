@echo off
echo ==========================================
echo Committing May 6 Work - 5 Commits
echo ==========================================
echo.

cd /d "%~dp0"

echo [1/5] Adding CSS styling...
git add frontend/public/css/style.css
git commit -m "Add comprehensive styling and responsive design

- Create modern gradient-based theme
- Style all components and forms
- Add responsive layouts for mobile
- Design job cards and application cards"
git push origin main
echo.

echo [2/5] Adding authentication JavaScript...
git add frontend/public/js/auth.js frontend/public/js/main.js
git commit -m "Implement authentication and main JavaScript

- Add login/register form handling
- Implement JWT token management
- Create role-based redirects
- Add smooth scrolling and interactions"
git push origin main
echo.

echo [3/5] Adding admin dashboard JavaScript...
git add frontend/public/js/admin.js
git commit -m "Complete admin dashboard functionality

- Implement job CRUD operations
- Add application review features
- Create status update functionality
- Build edit job modal with validation"
git push origin main
echo.

echo [4/5] Adding applicant dashboard JavaScript...
git add frontend/public/js/applicant.js
git commit -m "Complete applicant dashboard functionality

- Implement job browsing and filtering
- Add resume upload with validation
- Create application submission with Job ID disclaimer
- Build application tracking interface"
git push origin main
echo.

echo [5/5] Adding frontend documentation...
git add frontend/README.md
git commit -m "Add frontend documentation

- Document MEAN stack architecture
- Add API endpoints reference
- Include installation instructions
- Document security features"
git push origin main
echo.

echo ==========================================
echo SUCCESS! 5 commits pushed for May 6
echo ==========================================
pause
