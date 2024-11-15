const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const router = express.Router();

const Mentor = require('../models/Mentor');
const Mentee = require('../models/Mentee');

router.post('/login', async (req, res) => {
    const { email, password, role } = req.body;

    try {
        const User = role === 'Mentor' ? Mentor : Mentee;
        const user = await User.findOne({ email }).lean(); // Use `.lean()` to get a plain JavaScript object

        if (!user) return res.json({ success: false, message: 'Invalid credentials' });

        const isMatch = await bcrypt.compare(password, user.password);

        if (isMatch) {
            const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '12h' });

            // Remove password from user data before sending it
            const { password, ...userData } = user;

            return res.json({ 
                success: true, 
                token, 
                role: user.role,
                [`${role.toLowerCase()}Data`]: userData // Send as mentorData or menteeData based on role
            });
        } else {
            return res.json({ success: false, message: 'Invalid credentials' });
        }
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

module.exports = router;