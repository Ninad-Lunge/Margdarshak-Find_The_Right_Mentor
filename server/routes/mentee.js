const express = require('express');
const bcrypt = require('bcrypt');
const Mentee = require('../models/Mentee');

const router = express.Router();
const saltRounds = 10;

// Post route to add a mentee to the DB
router.post('/register-mentee', async (req, res) => {
    const menteeData = req.body;

    try {
        // Hash the password
        const hashedPassword = await bcrypt.hash(menteeData.password, saltRounds);

        const mentee = new Mentee({
            firstName: menteeData['first-name'],
            lastName: menteeData['last-name'],
            email: menteeData.email,
            password: hashedPassword,
            role: menteeData.role,
        });

        const savedMentee = await mentee.save();
        res.status(201).json(savedMentee);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

module.exports = router;