const express = require('express');
const router = express.Router();
const multer = require('multer');
const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');
const path = require('path');
const authRouter = require('./auth');
const verifyToken = authRouter.verifyToken;
const Application = require('../models/Application');

const PYTHON_API = process.env.PYTHON_API_URL || 'http://localhost:8000';

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadDir = path.join(__dirname, '../uploads');
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const upload = multer({ storage });

// Submit application
router.post('/submit', verifyToken, upload.fields([
    { name: 'resume', maxCount: 1 },
    { name: 'certificates', maxCount: 10 }
]), async (req, res) => {
    try {
        const { jobId } = req.body;
        
        if (!jobId) {
            return res.status(400).json({ message: 'Job ID is required' });
        }

        if (!req.files.resume) {
            return res.status(400).json({ message: 'Resume is required' });
        }

        // Get job details
        const jobResponse = await axios.get(`${PYTHON_API}/job/${jobId}`);
        const job = jobResponse.data;

        // Prepare form data for Python API
        const formData = new FormData();
        formData.append('file', fs.createReadStream(req.files.resume[0].path), req.files.resume[0].originalname);
        formData.append('job_id', jobId);

        // Add certificates if any
        if (req.files.certificates) {
            req.files.certificates.forEach(cert => {
                formData.append('certificates', fs.createReadStream(cert.path), cert.originalname);
            });
        }

        // Send to Python API for analysis
        const analysisResponse = await axios.post(`${PYTHON_API}/analyze-resume`, formData, {
            headers: formData.getHeaders()
        });

        // Save application to MongoDB
        const application = new Application({
            applicantId: req.user.id,
            applicantName: req.body.name || 'Unknown',
            applicantEmail: req.body.email || 'unknown@email.com',
            jobId: parseInt(jobId),
            jobTitle: job.title,
            resumePath: req.files.resume[0].path,
            certificates: req.files.certificates ? req.files.certificates.map(c => c.path) : [],
            scores: analysisResponse.data.scores,
            category: analysisResponse.data.category,
            eligibility: analysisResponse.data.eligibility,
            status: analysisResponse.data.eligibility.includes('Rejected') ? 'rejected' : 'pending'
        });

        await application.save();

        res.json({
            message: 'Application submitted successfully',
            application: application,
            analysis: analysisResponse.data
        });
    } catch (error) {
        console.error('Application error:', error);
        res.status(500).json({ message: 'Error submitting application', error: error.message });
    }
});

// Get user's applications
router.get('/my-applications', verifyToken, async (req, res) => {
    try {
        const applications = await Application.find({ applicantId: req.user.id })
            .sort({ appliedAt: -1 });
        res.json(applications);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching applications', error: error.message });
    }
});

// Get all applications (Admin only)
router.get('/all', verifyToken, async (req, res) => {
    try {
        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Access denied. Admin only.' });
        }

        const applications = await Application.find()
            .populate('applicantId', 'name email')
            .sort({ appliedAt: -1 });
        res.json(applications);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching applications', error: error.message });
    }
});

// Update application status (Admin only)
router.patch('/:id/status', verifyToken, async (req, res) => {
    try {
        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Access denied. Admin only.' });
        }

        const { status } = req.body;
        const application = await Application.findByIdAndUpdate(
            req.params.id,
            { status },
            { new: true }
        );

        res.json({ message: 'Status updated', application });
    } catch (error) {
        res.status(500).json({ message: 'Error updating status', error: error.message });
    }
});

module.exports = router;
