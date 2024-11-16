const Mentee = require('../models/Mentee');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Create a mentee
exports.createMentee = async (req, res) => {
    const { password, ...menteeData } = req.body;

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const mentee = new Mentee({ ...menteeData, password: hashedPassword });
        await mentee.save();
        res.status(201).json({ success: true, mentee });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error creating mentee', error: error.message });
    }
};

// Get all mentees
exports.getMentees = async (req, res) => {
    try {
        const mentees = await Mentee.find();
        res.status(200).json({ success: true, mentees });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error fetching mentees', error: error.message });
    }
};

// Get a mentee by ID
exports.getMenteeById = async (req, res) => {
    try {
        const mentee = await Mentee.findById(req.params.id);
        if(!mentee) return res.status(404).json({ success: false, message: 'Mentee not found' });
        res.status(200).json({ success: true, mentee });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error fetching mentee', error: error.message });
    }
};

// Update a mentee
exports.updateMentee = async (req, res) => {
    try {
        const mentee = await Mentee.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!mentee) return res.status(404).json({ success: false, message: 'Mentee not found' });
        res.status(200).json({ success: true, mentee });
      } catch (error) {
        res.status(500).json({ success: false, message: 'Error updating mentee', error: error.message });
      }
};

// Delete a mentor
exports.deleteMentee = async (req, res) => {
    try {
      const mentee = await Mentee.findByIdAndDelete(req.params.id);
      if (!mentee) return res.status(404).json({ success: false, message: 'Mentee not found' });
      res.status(200).json({ success: true, message: 'Mentee deleted successfully' });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Error deleting mentee', error: error.message });
    }
};

// Mentor login
exports.menteeLogin = async (req, res) => {
    const { email, password } = req.body;
  
    try {
      const mentee = await Mentee.findOne({ email });
      if (!mentee) return res.status(404).json({ success: false, message: 'Invalid email or password' });
  
      const isMatch = await bcrypt.compare(password, mentee.password);
      if (!isMatch) return res.status(401).json({ success: false, message: 'Invalid email or password' });
  
      const token = jwt.sign({ id: mentee._id }, process.env.JWT_SECRET, { expiresIn: '12h' });
      res.status(200).json({ success: true, token, mentee });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Error logging in', error: error.message });
    }
};