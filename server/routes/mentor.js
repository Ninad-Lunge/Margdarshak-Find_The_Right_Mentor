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
  isFollowingMentor,
  toggleFollowMentor,
  recommendedmentors

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
router.get('/:mentorId/is-following', verifyToken, isFollowingMentor); // Check if mentee is following a mentor
router.post('/:mentorId/follow', verifyToken, toggleFollowMentor); // Follow or unfollow a mentor
router.post('/recommended-mentors', recommendedmentors); 

module.exports = router;