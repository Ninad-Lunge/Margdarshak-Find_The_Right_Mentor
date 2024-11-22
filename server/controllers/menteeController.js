const Mentee = require('../models/Mentee');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { validateEmail } = require('../utils/validation');

exports.createMentee = async (req, res) => {
    try {
        const { 
            firstName, 
            lastName, 
            email, 
            password, 
            phone = '', 
            skills = '', 
            linkedin = '', 
            github = '', 
            role = 'Mentee' 
        } = req.body;

        // Validation checks
        if (!firstName || !lastName) {
            return res.status(400).json({ message: 'First and last name are required' });
        }

        if (!validateEmail(email)) {
            return res.status(400).json({ message: 'Invalid email format' });
        }

        // if (!validatePassword(password)) {
        //     return res.status(400).json({ 
        //         message: 'Password must be at least 8 characters long, include uppercase, lowercase, number, and special character' 
        //     });
        // }

        // Check if mentee already exists
        const existingMentee = await Mentee.findOne({ email });
        if (existingMentee) {
            return res.status(400).json({ message: 'Mentee with this email already exists' });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Convert skills to array if it's a string
        const skillsArray = typeof skills === 'string' 
            ? skills.split(',').map(skill => skill.trim())
            : skills;

        // Create new mentee
        const newMentee = new Mentee({
            firstName,
            lastName,
            email,
            password: hashedPassword,
            phone,
            skills: skillsArray,
            linkedin,
            github,
            role
        });

        // Save mentee
        await newMentee.save();

        // Generate token
        const token = jwt.sign({ id: newMentee._id }, process.env.JWT_SECRET, { expiresIn: '12h' });

        // Prepare response (remove sensitive data)
        const menteeResponse = newMentee.toObject();
        delete menteeResponse.password;

        res.status(201).json({
            ...menteeResponse,
            token
        });

    } catch (error) {
        console.error('Registration Error:', error);
        res.status(500).json({ 
            message: 'Server error during registration',
            error: error.message 
        });
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

// exports.getFollowedMentors = async (req, res) => {
//     console.log('Mentee ID:', req.user);
//     const menteeId = req.user.id;

//     try {
//         console.log('Searching for mentee:', menteeId);
//         const mentee = await Mentee.findById(menteeId)
//             .populate({
//                 path: 'following',
//                 select: 'firstName lastName image jobTitle industry skills followerCount'
//             });
        
//         if (!mentee) {
//             console.error('No mentee found with ID:', menteeId);
//             return res.status(404).json({ success: false, message: 'Mentee not found' });
//         }
        
//         res.status(200).json({ success: true, followedMentors: mentee.following });
//     } catch (error) {
//         console.error('Full error in getFollowedMentors:', error);
//         res.status(500).json({ 
//             success: false, 
//             message: 'Error fetching followed mentors', 
//             error: error.message 
//         });
//     }
// };

exports.getFollowedMentors = async (req, res) => {
    try {
        // const menteeId = req.user?.id;
        const { menteeId } = req.params;

        if (!menteeId || !mongoose.Types.ObjectId.isValid(menteeId)) {
            return res.status(400).json({ success: false, message: 'Invalid or missing mentee ID' });
        }

        const mentee = await Mentee.findById(menteeId).populate('following');
        if (!mentee) {
            return res.status(404).json({ success: false, message: 'Mentee not found' });
        }

        res.json({ success: true, following: mentee.following });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Error fetching mentee', error: error.message });
    }
};