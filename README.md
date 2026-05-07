
# AI Resume Intelligence System

An intelligent resume screening and candidate matching system powered by Machine Learning and Natural Language Processing.

## 🎯 Project Overview

This system automates the resume screening process using AI to match candidates with job requirements. It analyzes resumes, extracts skills, validates certifications, and provides comprehensive scoring to help companies make better hiring decisions.

## ✨ Key Features

### AI-Powered Analysis
- **Semantic Matching** - Uses sentence transformers to understand context and meaning
- **Skill Extraction** - Automatically identifies technical and soft skills
- **Experience Scoring** - Evaluates candidate experience level
- **Certificate Validation** - Verifies and scores relevant certifications using Gemini AI
- **Multi-dimensional Scoring** - Combines semantic, skill, experience, and certification scores

### For Companies (Admin)
- Create and manage job postings
- Define mandatory and optional skills
- Configure certification requirements
- View AI-generated candidate scores
- Manage application status
- Review detailed candidate analysis

### For Job Seekers (Applicants)
- Browse available positions
- Upload resume and certificates
- Get instant AI feedback
- Track application status
- View detailed scoring breakdown

## 🏗️ Architecture

### Backend (Python FastAPI)
- Resume parsing and text extraction
- NLP processing with spaCy
- Embedding generation with Sentence Transformers
- Semantic similarity calculation
- Skill matching and scoring
- Certificate validation with Google Gemini AI
- SQLite database for candidate records

### Frontend (MEAN Stack)
- MongoDB for user management and applications
- Express.js REST API
- Node.js server
- Vanilla JavaScript for UI
- JWT authentication
- Role-based access control

## 📋 Prerequisites

- Python 3.8+
- Node.js 14+
- MongoDB
- pip (Python package manager)
- npm (Node package manager)

## 🚀 Installation & Setup

### 1. Backend Setup (Python)

```bash
cd backend

# Install dependencies
pip install -r requirements.txt

# Download spaCy model
pip install https://github.com/explosion/spacy-models/releases/download/en_core_web_sm-3.8.0/en_core_web_sm-3.8.0.tar.gz

# Initialize database
python init_db.py

# Start backend server
python -m uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

Backend will run on: `http://localhost:8000`

### 2. Frontend Setup (Node.js)

```bash
cd frontend

# Install dependencies
npm install

# Create .env file
# Add the following:
PORT=3000
MONGODB_URI=mongodb://localhost:27017/resume-intelligence
JWT_SECRET=your_secret_key_here
PYTHON_API_URL=http://localhost:8000

# Start MongoDB
mongod

# Start frontend server
npm start
```

Frontend will run on: `http://localhost:3000`

## 📖 Usage Guide

### For Companies

1. **Register** as Admin/Company
2. **Create Job Posting**
   - Add job title and description
   - Define mandatory skills (required)
   - Add optional skills (preferred)
   - Enable certification scoring if needed
3. **Review Applications**
   - View AI-generated scores
   - Check skill matches
   - Review eligibility status
   - Update application status

### For Job Seekers

1. **Register** as Applicant
2. **Browse Jobs**
   - View available positions
   - Check required skills
   - **Note the Job ID** (important!)
3. **Apply**
   - Upload resume (PDF)
   - Upload certificates (optional, PDF)
   - Confirm Job ID
   - Submit application
4. **Track Status**
   - View application status
   - Check AI scores
   - See detailed analysis

## ⚠️ Important: Job ID Disclaimer

When applying for a job, applicants **must note the Job ID** before submission. The system displays a prominent disclaimer with the Job ID that must be acknowledged before applying. This ID is used for tracking and reference.

## 🔧 Technology Stack

### Backend
- **FastAPI** - Modern Python web framework
- **spaCy** - NLP and text processing
- **Sentence Transformers** - Semantic embeddings
- **scikit-learn** - ML utilities
- **Google Gemini AI** - Certificate validation
- **PyPDF2** - PDF parsing
- **SQLAlchemy** - Database ORM
- **SQLite** - Database

### Frontend
- **MongoDB** - NoSQL database
- **Express.js** - Web framework
- **Node.js** - Runtime
- **Vanilla JavaScript** - Frontend logic
- **JWT** - Authentication
- **Multer** - File uploads
- **Axios** - HTTP client

## 📊 Scoring System

The system uses a weighted scoring approach:

- **Semantic Score (40%)** - Resume-job description similarity
- **Skill Score (40%)** - Mandatory and optional skill matches
- **Experience Score (20%)** - Years of experience evaluation
- **Certification Bonus** - Additional points for relevant certificates

### Categories
- **Excellent** - Score ≥ 0.8
- **Good** - Score ≥ 0.6
- **Average** - Score ≥ 0.4
- **Below Average** - Score < 0.4

### Eligibility
- **Eligible** - All mandatory skills present
- **Rejected** - Missing mandatory skills

## 🔐 Security Features

- Password hashing with bcrypt
- JWT token authentication
- Role-based access control
- Protected API routes
- File upload validation
- Input sanitization

## 📁 Project Structure

```
Minor-Project/
├── backend/                 # Python FastAPI backend
│   ├── main.py             # Main API endpoints
│   ├── models.py           # Database models
│   ├── database.py         # Database configuration
│   ├── resume_parser.py    # PDF parsing
│   ├── nlp_processor.py    # NLP processing
│   ├── embedding_generator.py  # Embeddings
│   ├── skill_extractor.py  # Skill extraction
│   ├── insight_engine.py   # Scoring logic
│   ├── gemini_processor.py # Certificate validation
│   ├── init_db.py          # Database initialization
│   └── requirements.txt    # Python dependencies
│
├── frontend/               # MEAN stack frontend
│   ├── models/            # MongoDB models
│   ├── routes/            # API routes
│   ├── public/            # Static files
│   │   ├── css/
│   │   ├── js/
│   │   └── *.html
│   ├── server.js          # Express server
│   ├── package.json
│   └── .env
│
└── README.md              # This file
```

## 🎓 Academic Project Information

**Project Type:** Minor Project  
**Submission Date:** May 8, 2026  
**Development Period:** May 5-8, 2026

## 🤝 Contributing

This is an academic project. For any questions or suggestions, please contact the project team.

## 📝 License

This project is created for academic purposes.

## 🙏 Acknowledgments

- spaCy for NLP capabilities
- Sentence Transformers for embeddings
- Google Gemini AI for certificate validation
- FastAPI and Express.js communities

## 📞 Support

For issues or questions:
1. Check the documentation
2. Review error logs
3. Ensure all services are running
4. Verify environment variables

---

**Note:** Make sure both backend (port 8000) and frontend (port 3000) servers are running simultaneously for the system to work properly.
