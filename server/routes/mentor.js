const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/authMiddleware'); // Adjusted import
const {
  createMentor,
  getMentors,
  getMentorById,
  updateMentor,
  deleteMentor,
  searchMentors,
  mentorLogin,
  followMentor
} = require('../controllers/mentorController');

// CRUD routes
router.post('/', createMentor); // Create a mentor
router.get('/', getMentors); // Get all mentors
router.get('/:id', getMentorById); // Get a specific mentor by ID
router.put('/:id', verifyToken, updateMentor); // Update a mentor
router.delete('/:id', verifyToken, deleteMentor); // Delete a mentor

// Other routes
router.get('/search', searchMentors); // Search mentors by filters
router.post('/login', mentorLogin); // Mentor login
router.post('/:mentorId/follow', verifyToken, followMentor); // Mentee follows a mentor


module.exports = router;