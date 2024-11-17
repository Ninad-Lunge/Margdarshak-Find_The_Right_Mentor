const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/authMiddleware');
const {
    createMentee,
    getMentees,
    getMenteeById,
    updateMentee,
    deleteMentee,
    menteeLogin
} = require('../controllers/menteeController');

// CRUD routes
router.post('/', createMentee);
router.get('/', getMentees);
router.get('/:id', getMenteeById);
router.put('/:id', verifyToken, updateMentee);
router.delete('/:id', verifyToken, deleteMentee);

// Other routes
router.post('/login', menteeLogin);

module.exports = router;