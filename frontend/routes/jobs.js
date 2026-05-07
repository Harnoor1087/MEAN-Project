const express = require('express');
const router = express.Router();
const axios = require('axios');
const authRouter = require('./auth');
const verifyToken = authRouter.verifyToken;

const PYTHON_API = process.env.PYTHON_API_URL || 'http://localhost:8000';

// Get all jobs
router.get('/', async (req, res) => {
    try {
        const response = await axios.get(`${PYTHON_API}/jobs`);
        res.json(response.data);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching jobs', error: error.message });
    }
});

// Get single job
router.get('/:id', async (req, res) => {
    try {
        const response = await axios.get(`${PYTHON_API}/job/${req.params.id}`);
        res.json(response.data);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching job', error: error.message });
    }
});

// Create job (Admin only)
router.post('/', verifyToken, async (req, res) => {
    try {
        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Access denied. Admin only.' });
        }

        const response = await axios.post(`${PYTHON_API}/create-job`, req.body);
        res.json(response.data);
    } catch (error) {
        res.status(500).json({ message: 'Error creating job', error: error.message });
    }
});

// Update job (Admin only)
router.put('/:id', verifyToken, async (req, res) => {
    try {
        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Access denied. Admin only.' });
        }

        const response = await axios.put(`${PYTHON_API}/update-job/${req.params.id}`, req.body);
        res.json(response.data);
    } catch (error) {
        res.status(500).json({ message: 'Error updating job', error: error.message });
    }
});

// Delete job (Admin only)
router.delete('/:id', verifyToken, async (req, res) => {
    try {
        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Access denied. Admin only.' });
        }

        const response = await axios.delete(`${PYTHON_API}/delete-job/${req.params.id}?confirm=true`);
        res.json(response.data);
    } catch (error) {
        res.status(500).json({ message: 'Error deleting job', error: error.message });
    }
});

module.exports = router;
