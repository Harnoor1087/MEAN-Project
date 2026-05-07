#!/bin/bash

echo "=========================================="
echo "AI Resume Intelligence - Setup Script"
echo "=========================================="
echo ""

# Check if Python is installed
if ! command -v python &> /dev/null; then
    echo "❌ Python is not installed. Please install Python 3.8+ first."
    exit 1
fi

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 14+ first."
    exit 1
fi

# Check if MongoDB is installed
if ! command -v mongod &> /dev/null; then
    echo "⚠️  MongoDB is not installed. Please install MongoDB."
    echo "   You can continue, but the frontend won't work without MongoDB."
fi

echo "✅ Prerequisites check passed"
echo ""

# Setup Backend
echo "📦 Setting up Python Backend..."
cd backend

echo "Installing Python dependencies..."
pip install -r requirements.txt

echo "Installing spaCy model..."
pip install https://github.com/explosion/spacy-models/releases/download/en_core_web_sm-3.8.0/en_core_web_sm-3.8.0.tar.gz

echo "Initializing database..."
python init_db.py

cd ..
echo "✅ Backend setup complete"
echo ""

# Setup Frontend
echo "📦 Setting up Node.js Frontend..."
cd frontend

echo "Installing Node dependencies..."
npm install

# Create .env if it doesn't exist
if [ ! -f .env ]; then
    echo "Creating .env file..."
    cat > .env << EOF
PORT=3000
MONGODB_URI=mongodb://localhost:27017/resume-intelligence
JWT_SECRET=$(openssl rand -hex 32)
PYTHON_API_URL=http://localhost:8000
EOF
    echo "✅ .env file created with random JWT secret"
fi

cd ..
echo "✅ Frontend setup complete"
echo ""

echo "=========================================="
echo "✅ Setup Complete!"
echo "=========================================="
echo ""
echo "To start the application:"
echo ""
echo "1. Start MongoDB (in a new terminal):"
echo "   mongod"
echo ""
echo "2. Start Python Backend (in a new terminal):"
echo "   cd backend"
echo "   python -m uvicorn main:app --reload --host 0.0.0.0 --port 8000"
echo ""
echo "3. Start Node Frontend (in a new terminal):"
echo "   cd frontend"
echo "   npm start"
echo ""
echo "4. Open browser:"
echo "   http://localhost:3000"
echo ""
echo "=========================================="
