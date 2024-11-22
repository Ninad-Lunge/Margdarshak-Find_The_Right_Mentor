const mongoose = require('mongoose');

const menteeSchema = new mongoose.Schema({
    firstName: { 
        type: String, 
        required: true,
        trim: true
    },
    lastName: { 
        type: String, 
        required: true,
        trim: true
    },
    email: { 
        type: String, 
        required: true, 
        unique: true,
        lowercase: true,
        trim: true,
        match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']
    },
    password: { 
        type: String, 
        required: true,
        minlength: 6
    },
    phone: { 
        type: String,
        trim: true,
        default: ''
    },
    skills: { 
        type: [String],
        default: []
    },
    linkedin: { 
        type: String,
        trim: true,
        default: ''
    },
    github: { 
        type: String,
        trim: true,
        default: ''
    },
    resumeUrl: { 
        type: String,
        default: ''
    },
    role: { 
        type: String, 
        default: 'Mentee',
    },
    following: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Mentor'
    }],
    followingCount: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Mentee', menteeSchema);