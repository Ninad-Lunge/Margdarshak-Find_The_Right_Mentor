const express = require('express');
const router = express.Router();

const Availability = require('../models/Availability');
const { verifyToken } = require('../middleware/authMiddleware');

// Add availability slot
router.post('/add', verifyToken, async (req, res) => {
  try {
    const { date, startTime, endTime } = req.body;
    const mentorId = req.user.id;

    const newSlot = new Availability({ mentorId, date, startTime, endTime });
    await newSlot.save();

    res.status(201).json(newSlot);
  } catch (error) {
    res.status(500).json({ error: 'Failed to add availability slot' });
  }
});

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
    res.status(500).json({ error: 'Failed to update slot' });
  }
});

// Mentor side - fetch data of particular mentor
router.get('/mentorslot', verifyToken, async (req, res) => {
  try {
    const mentorId = req.user.id;

    // Fetch only availability slots for this mentor
    const mentorSlots = await Availability.find({ mentorId, isBooked: false })
      .populate('menteeId', 'firstName lastName')  
      .lean();

    res.status(200).json(mentorSlots);
  } catch (error) {
    console.error('Error fetching mentor’s availability slots:', error);
    res.status(500).json({ error: 'Failed to fetch availability slots for this mentor' });
  }
});

// Fetch Availability slots (Mentee side)
router.get('/mentor', verifyToken, async (req, res) => {
  try {
    const mentorSlots = await Availability.find({ isBooked: false })
      .populate('mentorId', 'firstName lastName expertise')
      .populate('menteeId', 'firstName lastName')
      .lean();

    res.status(200).json(mentorSlots);  // Send available slots to the frontend
  } catch (error) {
    console.error('Error fetching available slots:', error);
    res.status(500).json({ error: 'Failed to fetch available slots' });
  }
});

// Book a slot by mentee (mentee side)
router.post('/book', verifyToken, async (req, res) => {
  try {
    const { slotId } = req.body;
    const menteeId = req.user.id;

    const slot = await Availability.findById(slotId);
    if (!slot) return res.status(404).json({ error: 'Slot not found' });
    if (slot.isBooked) return res.status(400).json({ error: 'Slot already booked' });

    slot.isBooked = true;
    slot.menteeId = menteeId;
    await slot.save();

    res.status(200).json({ message: 'Slot booked successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to book slot' });
  }
});

// Delete a slot
router.delete('/:id', verifyToken, async (req, res) => {
  try {
    await Availability.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Slot deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete slot' });
  }
});

// Fetch all booked slots for a mentor (request page)
router.get('/booked', verifyToken, async (req, res) => {
  try {
    const mentorId = req.user.id;

    const bookedSlots = await Availability.find({ mentorId, isBooked: true })
      .populate('mentorId', 'firstName lastName expertise') // Populating firstName and expertise for the mentor
      .populate('menteeId', 'firstName lastName')
      .lean();

    if (!bookedSlots || bookedSlots.length === 0) {
      return res.status(404).json({ error: 'No booked slots found' });
    }

    res.status(200).json(bookedSlots);
  } catch (error) {
    console.error('Error fetching booked slots:', error);
    res.status(500).json({ error: 'Failed to fetch booked slots' });
  }
});

module.exports = router;