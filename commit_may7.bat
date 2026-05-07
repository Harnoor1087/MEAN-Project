@echo off
echo ==========================================
echo Committing May 7 Work - 3 Commits
echo ==========================================
echo.

cd /d "%~dp0"

echo [1/3] Adding project summary and testing guide...
git add PROJECT_SUMMARY.md TESTING_GUIDE.md
git commit -m "Add project summary and comprehensive testing guide

- Create detailed project completion summary
- Add step-by-step testing guide
- Document all test scenarios
- Include troubleshooting tips"
git push origin main
echo.

echo [2/3] Adding running status documentation...
git add RUNNING_STATUS.md
git commit -m "Add running status documentation

- Document all running services
- Add health check results
- Include access points and URLs
- Document current system status"
git push origin main
echo.

echo [3/3] Updating database...
git add backend/resume.db
git commit -m "Update database with test data

- Add sample job entries
- Initialize database schema
- Prepare for testing phase"
git push origin main
echo.

echo ==========================================
echo SUCCESS! 3 commits pushed for May 7
echo ==========================================
echo.
echo All commits completed!
echo Your project is ready for submission on May 8!
echo.
pause
