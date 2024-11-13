const express = require('express');
const router = express.Router();
const Slot = require('../models/Slot');

router.post('/add', async (req, res) => {
    const { mentorId, day, startTime, endTime } = req.body;

    try {
        const slot = new Slot({ mentorId, day, startTime, endTime });
        await slot.save();
        res.status(201).json({ success: true, message: 'Slot added successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to add slot', error });
    }
});

module.exports = router;