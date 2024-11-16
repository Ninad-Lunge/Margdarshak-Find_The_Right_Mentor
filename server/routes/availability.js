const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');

const Availability = require('../models/Availability');
const { verifyToken } = require('../middleware/authMiddleware');

// Add availability slot
router.post(
  '/add',
  [
    verifyToken,
    body('date').isISO8601().withMessage('Invalid date format'),
    body('startTime').isString().notEmpty().withMessage('Start time is required'),
    body('endTime').isString().notEmpty().withMessage('End time is required'),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { date, startTime, endTime } = req.body;
      const mentorId = req.user.id;

      const newSlot = new Availability({ mentorId, date, startTime, endTime });
      await newSlot.save();

      res.status(201).json({ success: true, data: newSlot, message: 'Slot added successfully' });
    } catch (error) {
      console.error('Error adding availability slot:', error);
      res.status(500).json({ success: false, error: 'Failed to add availability slot' });
    }
  }
);

// Update availability slot
router.put('/:id', verifyToken, async (req, res) => {
  try {
    const { date, startTime, endTime } = req.body;
    const slotId = req.params.id;

    const slot = await Availability.findById(slotId);
    if (!slot) return res.status(404).json({ error: 'Slot not found' });

    slot.date = new Date(date);
    slot.startTime = startTime;
    slot.endTime = endTime;
    await slot.save();

    res.status(200).json(slot);
  } catch (error) {
    console.error('Error updating slot:', error);
    res.status(500).json({ error: 'Failed to update slot' });
  }
});

// Fetch mentor's available slots
router.get('/mentorslot', verifyToken, async (req, res) => {
  try {
    const mentorId = req.user.id;

    const mentorSlots = await Availability.find({ mentorId, isBooked: false })
      .populate('menteeId', 'firstName lastName')
      .lean();

    res.status(200).json(mentorSlots);
  } catch (error) {
    console.error('Error fetching mentor’s availability slots:', error);
    res.status(500).json({ error: 'Failed to fetch availability slots' });
  }
});

// Fetch all available slots (mentee view)
router.get('/mentor', verifyToken, async (req, res) => {
  try {
    const mentorSlots = await Availability.find({ 
      status: 'available',
      date: { $gte: new Date() } // Only show future dates
    })
      .populate('mentorId', 'firstName lastName expertise')
      .populate('menteeId', 'firstName lastName')
      .sort({ date: 1, startTime: 1 }) // Sort by date and time
      .lean();

    // Format dates and add formatted time for client
    const formattedSlots = mentorSlots.map(slot => ({
      ...slot,
      formattedDate: new Date(slot.date).toLocaleDateString(),
      formattedStartTime: slot.startTime,
      formattedEndTime: slot.endTime
    }));

    res.status(200).json(formattedSlots);
  } catch (error) {
    console.error('Error fetching available slots:', error);
    res.status(500).json({ error: 'Failed to fetch available slots' });
  }
});

// Book a slot (mentee)
router.post('/book', verifyToken, async (req, res) => {
  try {
    const { slotId } = req.body;
    const menteeId = req.user.id;

    const slot = await Availability.findById(slotId);
    if (!slot) return res.status(404).json({ error: 'Slot not found' });
    if (slot.status !== 'available') return res.status(400).json({ error: 'Slot is not available' });

    slot.status = 'pending';
    slot.menteeId = menteeId;
    await slot.save();

    res.status(200).json({ message: 'Slot booked successfully' });
  } catch (error) {
    console.error('Error booking slot:', error);
    res.status(500).json({ error: 'Failed to book slot' });
  }
});

// Delete an availability slot
router.delete('/:id', verifyToken, async (req, res) => {
  try {
    const slotId = req.params.id;

    const slot = await Availability.findById(slotId);
    if (!slot) return res.status(404).json({ error: 'Slot not found' });

    await slot.deleteOne();
    res.status(200).json({ message: 'Slot deleted successfully' });
  } catch (error) {
    console.error('Error deleting slot:', error);
    res.status(500).json({ error: 'Failed to delete slot' });
  }
});

// Existing route to get booked slots
router.get('/booked', verifyToken, async (req, res) => {
  try {
    const bookedSlots = await Availability.find({
      mentorId: req.user.id,
      status: 'pending'
    }).populate('menteeId mentorId');
    res.json(bookedSlots);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching booked slots', error: error.message });
  }
});

// Updated route to handle slot status changes
router.put('/:id/status', verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { status, meetLink } = req.body;

    // Validate status
    if (!['confirmed', 'rejected'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status provided' });
    }

    // Find the slot first to check if it exists
    const slot = await Availability.findById(id);
    if (!slot) {
      return res.status(404).json({ message: 'Slot not found' });
    }

    // Check if the mentor is authorized to update this slot
    if (slot.mentorId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to update this slot' });
    }

    if (status === 'confirmed') {
      // For confirmed slots, update status and add meet link
      slot.status = status;
      slot.meetLink = meetLink;
      await slot.save();

      // You might want to notify the mentee here
      // await notifyMentee(slot.menteeId, 'accepted', meetLink);
    } else if (status === 'rejected') {
      // For rejected slots, you can either:
      // Option 1: Delete the slot completely
      await Availability.findByIdAndDelete(id);
      
      // Option 2: Update status to rejected and keep for record
      // slot.status = 'rejected';
      // await slot.save();

      // You might want to notify the mentee here
      // await notifyMentee(slot.menteeId, 'rejected');
    }

    res.json({ message: `Slot ${status} successfully` });
  } catch (error) {
    console.error('Error updating slot status:', error);
    res.status(500).json({ message: 'Error updating slot status', error: error.message });
  }
});

// Optional: Add a route to view slot history (if keeping rejected slots)
router.get('/history', verifyToken, async (req, res) => {
  try {
    const slots = await Availability.find({
      mentorId: req.user.id,
      status: { $in: ['confirmed', 'rejected'] }
    }).populate('menteeId mentorId');
    res.json(slots);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching slot history', error: error.message });
  }
});

module.exports = router;