const express = require('express');
const Mentee = require('../models/Mentee');

const router = express.Router();

// Post route to add a mentee to the DB
router.post('/', async (req, res) => {
    const menteeData = req.body; // Get data from the form

    const mentee = new Mentee({
        firstName: menteeData['first-name'],
        lastName: menteeData['last-name'],
        email: menteeData.email,
        password: menteeData.password,
        role: menteeData.role,
    });

    try {
        const savedMentee = await mentee.save();
        res.status(201).json(savedMentee);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

module.exports = router;