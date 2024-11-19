const express = require('express');
const cron = require('node-cron');
const router = express.Router();
const { body, validationResult } = require('express-validator');

const Availability = require('../models/Availability');
const { verifyToken } = require('../middleware/authMiddleware');

// Automatically moves expired slots to pending status
cron.schedule('0 * * * *', async () => { // Runs every hour
  try {
    const currentDate = new Date();
    const result = await Availability.updateMany(
      {
        $or: [
          { date: { $lt: currentDate } },
          {
            date: { $eq: currentDate },
            endTime: { $lt: currentDate.toTimeString().split(' ')[0] },
          },
        ],
        status: { $ne: 'pending' },
      },
      { $set: { status: 'pending' } }
    );

    console.log(`Expired slots updated: ${result.modifiedCount}`);
  } catch (error) {
    console.error('Error updating expired slots:', error);
  }
});

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
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { date, startTime, endTime } = req.body;
      const mentorId = req.user.id;

      // Create new slot with explicit status
      const newSlot = new Availability({
        mentorId,
        date: new Date(date),
        startTime,
        endTime,
        status: 'available'
      });

      await newSlot.save();
      
      // Populate mentor details before sending response
      const populatedSlot = await Availability.findById(newSlot._id)
        .populate('mentorId', 'firstName lastName industrywork image');

      res.status(201).json({
        success: true,
        data: populatedSlot,
        message: 'Slot added successfully'
      });
    } catch (error) {
      console.error('Error adding availability slot:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to add availability slot'
      });
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
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const mentorSlots = await Availability.find({ 
      status: 'available',
      date: { $gte: today }
    })
    .populate('mentorId', 'firstName lastName domain image')
    .sort({ date: 1, startTime: 1 })
    .lean();

    const formattedSlots = mentorSlots.map(slot => ({
      ...slot,
      formattedDate: new Date(slot.date).toLocaleDateString(),
      startTime: slot.startTime,
      endTime: slot.endTime
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

// Fetch Confirmed slots
router.get('/confirmed', verifyToken, async (req, res) => {
  try {
    const bookedSlots = await Availability.find({
      mentorId: req.user.id,
      status: 'confirmed'
    }).populate('mentorId menteeId')
    .sort({ date: 1, startTime: 1 })
    .lean();
    res.json(bookedSlots);
  } catch (error) {
    res.status(500).json({ message: 'Error fecthing confirmed slots', error: error.message });
  }
});

router.get('/mentee/confirmed', verifyToken, async (req, res) => {
  try {
    const menteeId = req.user.id;

    const confirmedSlots = await Availability.find({
      menteeId: menteeId,
      status: 'confirmed'
    })
    .populate('mentorId', 'firstName lastName industrywork')
    .sort({ date: 1, startTime: 1 })
    .lean();

    const formattedSlots = confirmedSlots.map(slot => ({
      ...slot,
      formattedDate: new Date(slot.date).toLocaleDateString(),
    }));

    res.json(formattedSlots);
  } catch (error) {
    console.error('Error fetching mentee confirmed slots:', error);
    res.status(500).json({ 
      message: 'Error fetching confirmed slots', 
      error: error.message 
    });
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
    } else if (status === 'rejected') {
      await Availability.findByIdAndDelete(id);
      
    }

    res.json({ message: `Slot ${status} successfully` });
  } catch (error) {
    console.error('Error updating slot status:', error);
    res.status(500).json({ message: 'Error updating slot status', error: error.message });
  }
});

router.delete('/delete-slot/:id', verifyToken, async (req, res) => {
  const { id } = req.params;

  try {
    const deleteSlot = await Availability.findByIdAndDelete(id);

    if(!deleteSlot){
      return res.status(404).json({ message: 'Slot not found' });
    }
    res.json({ message: 'Slot deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting slot', error });
  }
});

// Add a route to view slot history (if keeping rejected slots)
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