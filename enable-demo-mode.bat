@echo off
echo Creating .env file for Demo Mode...
echo.
echo # Demo/Test Mode Configuration > .env
echo REACT_APP_DISABLE_SUPABASE=true >> .env
echo REACT_APP_DEMO_MODE=true >> .env
echo.
echo Demo mode enabled successfully!
echo.
echo Now you can run:
echo   npm start
echo.
echo Then visit: http://localhost:3000/fitness
echo.
echo Press any key to exit...
pause > nul 