# AI Resume Intelligence - Frontend

MEAN Stack frontend for AI-powered resume screening system.

## Features

### For Companies (Admin)
- Create, update, and delete job postings
- View all applications with AI-generated scores
- Manage application status (pending, reviewed, accepted, rejected)
- Configure mandatory and optional skills
- Enable certification scoring

### For Job Applicants
- Browse available job listings
- Apply for jobs with resume upload
- Upload multiple certificates (optional)
- View application status and AI scores
- Track all submitted applications

## Tech Stack

- **MongoDB** - Database for users and applications
- **Express.js** - Backend API server
- **Angular/Vanilla JS** - Frontend (using vanilla JS for simplicity)
- **Node.js** - Runtime environment
- **Python FastAPI** - AI/ML backend for resume analysis

## Installation

1. Install dependencies:
```bash
npm install
```

2. Create `.env` file with:
```
PORT=3000
MONGODB_URI=mongodb://localhost:27017/resume-intelligence
JWT_SECRET=your_secret_key
PYTHON_API_URL=http://localhost:8000
```

3. Make sure MongoDB is running:
```bash
mongod
```

4. Make sure Python backend is running on port 8000

5. Start the server:
```bash
npm start
```

Or for development with auto-reload:
```bash
npm run dev
```

## Usage

1. Visit `http://localhost:3000`
2. Register as either:
   - **Applicant** - To apply for jobs
   - **Admin/Company** - To post jobs and review applications

### Admin Workflow
1. Login with admin account
2. Create job postings with required skills
3. View incoming applications
4. Review AI-generated scores and analysis
5. Update application status

### Applicant Workflow
1. Login with applicant account
2. Browse available jobs
3. **Note the Job ID** (displayed prominently)
4. Apply with resume and certificates
5. View application status and scores

## Important Notes

⚠️ **Job ID Disclaimer**: When applying for a job, applicants must note the Job ID as it's required for tracking. The system displays a prominent disclaimer before submission.

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user

### Jobs
- `GET /api/jobs` - Get all jobs
- `GET /api/jobs/:id` - Get single job
- `POST /api/jobs` - Create job (admin only)
- `PUT /api/jobs/:id` - Update job (admin only)
- `DELETE /api/jobs/:id` - Delete job (admin only)

### Applications
- `POST /api/applications/submit` - Submit application
- `GET /api/applications/my-applications` - Get user's applications
- `GET /api/applications/all` - Get all applications (admin only)
- `PATCH /api/applications/:id/status` - Update status (admin only)

## Project Structure

```
frontend/
├── models/           # MongoDB models
│   ├── User.js
│   └── Application.js
├── routes/           # API routes
│   ├── auth.js
│   ├── jobs.js
│   └── applications.js
├── public/           # Static files
│   ├── css/
│   │   └── style.css
│   ├── js/
│   │   ├── main.js
│   │   ├── auth.js
│   │   ├── admin.js
│   │   └── applicant.js
│   ├── index.html
│   ├── login.html
│   ├── register.html
│   ├── admin.html
│   └── applicant.html
├── uploads/          # Uploaded resumes and certificates
├── server.js         # Main server file
├── .env              # Environment variables
└── package.json
```

## Security Features

- JWT-based authentication
- Password hashing with bcrypt
- Role-based access control (admin/applicant)
- Protected routes with middleware
- File upload validation

## Future Enhancements

- Email notifications
- Advanced search and filtering
- Interview scheduling
- Candidate messaging system
- Analytics dashboard
- Export reports to PDF/Excel
