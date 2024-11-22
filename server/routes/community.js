const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/authMiddleware');
const Community = require('../models/Community');
const Blog = require('../models/Blog');

// GET all communities
router.get('/communities', async (req, res) => {
  try {
    const communities = await Community.find();
    
    res.json(communities);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// GET single community
router.get('/communities/:id', async (req, res) => {
  try {
    const community = await Community.findById(req.params.id)
      .populate('creator', 'name email')
      .populate('members', 'name email');
    
    if (!community) {
      return res.status(404).json({ message: 'Community not found' });
    }
    
    res.json(community);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// CREATE new community
router.post('/communities', verifyToken, async (req, res) => {
  try {
    const { title, description } = req.body;
    
    const community = new Community({
      title,
      description,
      creator: req.user.id,
      members: [req.user.id]
    });
    
    await community.save();
    res.status(201).json(community);
  } catch (error) {
    res.status(400).json({ message: 'Invalid data', error: error.message });
  }
});

// UPDATE community
router.put('/communities/:id', verifyToken, async (req, res) => {
  try {
    const community = await Community.findById(req.params.id);
    
    if (!community) {
      return res.status(404).json({ message: 'Community not found' });
    }
    
    // Check if user is creator
    if (community.creator.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    
    const { title, description } = req.body;
    community.title = title || community.title;
    community.description = description || community.description;
    community.updatedAt = Date.now();
    
    await community.save();
    res.json(community);
  } catch (error) {
    res.status(400).json({ message: 'Invalid data', error: error.message });
  }
});

// DELETE community
router.delete('/communities/:id', verifyToken, async (req, res) => {
  try {
    const community = await Community.findById(req.params.id);
    
    if (!community) {
      return res.status(404).json({ message: 'Community not found' });
    }
    
    // Check if user is creator
    if (community.creator.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    
    // Delete all blogs in the community
    await Blog.deleteMany({ community: req.params.id });
    
    await community.remove();
    res.json({ message: 'Community deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// JOIN community
router.post('/communities/:id/join', verifyToken, async (req, res) => {
  try {
    const community = await Community.findById(req.params.id);
    
    if (!community) {
      return res.status(404).json({ message: 'Community not found' });
    }
    
    // Check if user is already a member
    if (community.members.includes(req.user.id)) {
      return res.status(400).json({ message: 'Already a member' });
    }
    
    community.members.push(req.user.id);
    await community.save();
    
    res.json(community);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// LEAVE community
router.post('/communities/:id/leave', verifyToken, async (req, res) => {
  try {
    const community = await Community.findById(req.params.id);
    
    if (!community) {
      return res.status(404).json({ message: 'Community not found' });
    }
    
    // Check if user is a member
    if (!community.members.includes(req.user.id)) {
      return res.status(400).json({ message: 'Not a member' });
    }
    
    // Remove user from members array
    community.members = community.members.filter(
      memberId => memberId.toString() !== req.user.id
    );
    
    await community.save();
    res.json(community);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;