const mongoose = require('mongoose');

const ApplicationSchema = new mongoose.Schema({
    applicantId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    applicantName: {
        type: String,
        required: true
    },
    applicantEmail: {
        type: String,
        required: true
    },
    jobId: {
        type: Number,
        required: true
    },
    jobTitle: {
        type: String,
        required: true
    },
    resumePath: {
        type: String,
        required: true
    },
    certificates: [{
        type: String
    }],
    status: {
        type: String,
        enum: ['pending', 'reviewed', 'accepted', 'rejected'],
        default: 'pending'
    },
    scores: {
        semantic: Number,
        skill: Number,
        experience: Number,
        certification: Number,
        final: Number
    },
    category: String,
    eligibility: String,
    appliedAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Application', ApplicationSchema);
