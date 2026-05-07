# Quick Start Guide

## 🚀 Get Started in 5 Minutes

### Option 1: Automated Setup (Recommended)

**Windows:**
```bash
setup.bat
```

**Linux/Mac:**
```bash
chmod +x setup.sh
./setup.sh
```

### Option 2: Manual Setup

#### Step 1: Backend Setup
```bash
cd backend
pip install -r requirements.txt
pip install https://github.com/explosion/spacy-models/releases/download/en_core_web_sm-3.8.0/en_core_web_sm-3.8.0.tar.gz
python init_db.py
```

#### Step 2: Frontend Setup
```bash
cd frontend
npm install
```

Create `frontend/.env`:
```
PORT=3000
MONGODB_URI=mongodb://localhost:27017/resume-intelligence
JWT_SECRET=your_secret_key
PYTHON_API_URL=http://localhost:8000
```

### Running the Application

Open **3 terminals**:

**Terminal 1 - MongoDB:**
```bash
mongod
```

**Terminal 2 - Python Backend:**
```bash
cd backend
python -m uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

**Terminal 3 - Node Frontend:**
```bash
cd frontend
npm start
```

### Access the Application

Open browser: **http://localhost:3000**

## 📝 First Time Usage

### As Company/Admin:

1. Click **"Register"**
2. Select **"Company/Admin"** role
3. Enter company name
4. Login and create your first job posting

### As Job Seeker:

1. Click **"Register"**
2. Select **"Job Applicant"** role
3. Login and browse available jobs
4. **Note the Job ID** before applying!
5. Upload resume and apply

## ⚠️ Important Notes

- **Job ID**: Always note the Job ID when applying - it's required for tracking
- **File Format**: Only PDF files are accepted for resumes and certificates
- **MongoDB**: Must be running for frontend to work
- **Both Servers**: Backend (8000) and Frontend (3000) must run simultaneously

## 🔧 Troubleshooting

### Backend won't start
- Check if Python 3.8+ is installed: `python --version`
- Install missing packages: `pip install -r requirements.txt`
- Check if port 8000 is available

### Frontend won't start
- Check if Node.js is installed: `node --version`
- Install dependencies: `npm install`
- Check if MongoDB is running: `mongod`
- Check if port 3000 is available

### spaCy model error
```bash
pip install https://github.com/explosion/spacy-models/releases/download/en_core_web_sm-3.8.0/en_core_web_sm-3.8.0.tar.gz
```

### MongoDB connection error
- Start MongoDB: `mongod`
- Check connection string in `.env`

## 📊 Test the System

1. **Create a test job** (as admin):
   - Title: "Python Developer"
   - Skills: Python, Django, REST API
   
2. **Apply with sample resume** (as applicant):
   - Upload a Python developer resume
   - Check the AI scores

3. **Review application** (as admin):
   - View semantic match score
   - Check skill matches
   - Update status

## 🎯 Next Steps

- Explore the admin dashboard
- Try different job postings
- Test with various resumes
- Check the scoring system
- Review application analytics

## 📞 Need Help?

Check the main README.md for detailed documentation.
