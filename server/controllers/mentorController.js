const Mentor = require('../models/Mentor');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Create a mentor
exports.createMentor = async (req, res) => {
  const { password, ...mentorData } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const mentor = new Mentor({ ...mentorData, password: hashedPassword });
    await mentor.save();
    res.status(201).json({ success: true, mentor });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error creating mentor', error: error.message });
  }
};

// Get all mentors
exports.getMentors = async (req, res) => {
  try {
    const mentors = await Mentor.find();
    res.status(200).json({ success: true, mentors });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching mentors', error: error.message });
  }
};

// Get a mentor by ID
exports.getMentorById = async (req, res) => {
  try {
    const mentor = await Mentor.findById(req.params.id);
    if (!mentor) return res.status(404).json({ success: false, message: 'Mentor not found' });
    res.status(200).json({ success: true, mentor });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching mentor', error: error.message });
  }
};

// Update a mentor
exports.updateMentor = async (req, res) => {
  try {
    const mentor = await Mentor.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!mentor) return res.status(404).json({ success: false, message: 'Mentor not found' });
    res.status(200).json({ success: true, mentor });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error updating mentor', error: error.message });
  }
};

// Delete a mentor
exports.deleteMentor = async (req, res) => {
  try {
    const mentor = await Mentor.findByIdAndDelete(req.params.id);
    if (!mentor) return res.status(404).json({ success: false, message: 'Mentor not found' });
    res.status(200).json({ success: true, message: 'Mentor deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error deleting mentor', error: error.message });
  }
};

// Search mentors by filters
exports.searchMentors = async (req, res) => {
  const { industry, skills, location, company } = req.query;

  try {
    const mentors = await Mentor.find({
      ...(industry && { industry }),
      ...(skills && { skills: { $regex: skills, $options: 'i' } }),
      ...(location && { location }),
      ...(company && { company })
    });

    res.status(200).json({ success: true, mentors });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error searching mentors', error: error.message });
  }
};

// Mentor login
exports.mentorLogin = async (req, res) => {
  const { email, password } = req.body;

  try {
    const mentor = await Mentor.findOne({ email });
    if (!mentor) return res.status(404).json({ success: false, message: 'Invalid email or password' });

    const isMatch = await bcrypt.compare(password, mentor.password);
    if (!isMatch) return res.status(401).json({ success: false, message: 'Invalid email or password' });

    const token = jwt.sign({ id: mentor._id }, process.env.JWT_SECRET, { expiresIn: '12h' });
    res.status(200).json({ success: true, token, mentor });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error logging in', error: error.message });
  }
};


exports.toggleFollowMentor = async (req, res) => {
  const { mentorId } = req.params;
  const menteeId = req.user?.id;

  console.log('Mentor ID:', mentorId);
  console.log('Mentee ID:', menteeId);

  try {
      const mentor = await Mentor.findById(mentorId);
      if (!mentor) {
          console.log('Mentor not found');
          return res.status(404).json({ success: false, message: 'Mentor not found' });
      }

      const isFollowing = mentor.followers.includes(menteeId);
      console.log('Is Following:', isFollowing);

      if (isFollowing) {
        await Mentor.updateOne(
          { _id: mentorId },
          { $pull: { followers: menteeId }, $set: { followerCount: mentor.followers.length - 1 } }
        );
        return res.status(200).json({ success: true, message: 'Unfollowed mentor successfully' });
      }
      await Mentor.updateOne(
        { _id: mentorId },
        { $push: { followers: menteeId }, $set: { followerCount: mentor.followers.length + 1 } }
      );
      res.status(200).json({ success: true, message: 'Followed mentor successfully' });
      
  } catch (error) {
      console.error('Error toggling follow status:', error);
      res.status(500).json({ success: false, message: 'Error toggling follow status', error: error.message });
  }
};


// Check if mentee follows a mentor
exports.isFollowingMentor = async (req, res) => {
  const { mentorId } = req.params;
  const menteeId = req.user.id;

  try {
    const mentor = await Mentor.findById(mentorId);
    if (!mentor) {
      return res.status(404).json({ success: false, message: 'Mentor not found' });
    }

    const isFollowing = mentor.followers.includes(menteeId);
    res.status(200).json({ success: true, isFollowing });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error checking follow status', error: error.message });
  }
};

