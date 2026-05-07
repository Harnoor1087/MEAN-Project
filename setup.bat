@echo off
echo ==========================================
echo AI Resume Intelligence - Setup Script
echo ==========================================
echo.

REM Check if Python is installed
python --version >nul 2>&1
if errorlevel 1 (
    echo X Python is not installed. Please install Python 3.8+ first.
    exit /b 1
)

REM Check if Node.js is installed
node --version >nul 2>&1
if errorlevel 1 (
    echo X Node.js is not installed. Please install Node.js 14+ first.
    exit /b 1
)

echo √ Prerequisites check passed
echo.

REM Setup Backend
echo Setting up Python Backend...
cd backend

echo Installing Python dependencies...
pip install -r requirements.txt

echo Installing spaCy model...
pip install https://github.com/explosion/spacy-models/releases/download/en_core_web_sm-3.8.0/en_core_web_sm-3.8.0.tar.gz

echo Initializing database...
python init_db.py

cd ..
echo √ Backend setup complete
echo.

REM Setup Frontend
echo Setting up Node.js Frontend...
cd frontend

echo Installing Node dependencies...
call npm install

REM Create .env if it doesn't exist
if not exist .env (
    echo Creating .env file...
    (
        echo PORT=3000
        echo MONGODB_URI=mongodb://localhost:27017/resume-intelligence
        echo JWT_SECRET=your_secret_key_change_this_in_production
        echo PYTHON_API_URL=http://localhost:8000
    ) > .env
    echo √ .env file created
)

cd ..
echo √ Frontend setup complete
echo.

echo ==========================================
echo √ Setup Complete!
echo ==========================================
echo.
echo To start the application:
echo.
echo 1. Start MongoDB (in a new terminal):
echo    mongod
echo.
echo 2. Start Python Backend (in a new terminal):
echo    cd backend
echo    python -m uvicorn main:app --reload --host 0.0.0.0 --port 8000
echo.
echo 3. Start Node Frontend (in a new terminal):
echo    cd frontend
echo    npm start
echo.
echo 4. Open browser:
echo    http://localhost:3000
echo.
echo ==========================================
pause
