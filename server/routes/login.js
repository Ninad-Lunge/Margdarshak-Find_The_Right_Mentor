const express = require('express');
const bcrypt = require('bcrypt');
const router = express.Router();
const Mentor = require('../models/Mentor');
const Mentee = require('../models/Mentee');

router.post('/login', async (req, res) => {
    const { email, password, role } = req.body;

    try {
        // Select model based on role
        const User = role === 'Mentor' ? Mentor : Mentee;

        // Find user by email
        const user = await User.findOne({ email });
        if (!user) return res.json({ success: false, message: 'Invalid credentials' });

        // Use bcrypt.compare for async password comparison
        const isMatch = await bcrypt.compare(password, user.password);
        if (isMatch) {
            return res.json({ success: true });
        } else {
            res.json({ success: false, message: 'Invalid credentials' });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

module.exports = router;