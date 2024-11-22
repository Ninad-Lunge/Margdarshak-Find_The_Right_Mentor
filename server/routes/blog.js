const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/authMiddleware');
const Community = require('../models/Community');
const Blog = require('../models/Blog');

router.get('/communities/:communityId/blogs', async (req, res) => {
  try {
    const blogs = await Blog.find({ community: req.params.communityId });
    if (!blogs) {
      return res.status(404).json({ message: 'No blogs found' });
    }
    res.json({ blogs });
  } catch (error) {
    console.error('Error fetching blogs:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
});

  
  // CREATE new blog in community
  router.post('/communities/:id/blogs', verifyToken, async (req, res) => {
    try {
      const community = await Community.findById(req.params.id);
      
      if (!community) {
        return res.status(404).json({ message: 'Community not found' });
      }
      
      // Check if user is a member
      if (!community.members.includes(req.user.id)) {
        return res.status(403).json({ message: 'Must be a member to post' });
      }
      
      const { title, content, link } = req.body;
      
      const blog = new Blog({
        title,
        content,
        link,
        author: req.user.id,
        community: req.params.id
      });
      
      await blog.save();
      res.status(201).json(blog);
    } catch (error) {
      res.status(400).json({ message: 'Invalid data', error: error.message });
    }
  });
  
  // UPDATE blog
  router.put('/communities/:communityId/blogs/:blogId', verifyToken, async (req, res) => {
    try {
      const blog = await Blog.findById(req.params.blogId);
      
      if (!blog) {
        return res.status(404).json({ message: 'Blog not found' });
      }
      
      // Check if user is author
      if (blog.author.toString() !== req.user.id) {
        return res.status(403).json({ message: 'Not authorized' });
      }
      
      const { title, content, link } = req.body;
      blog.title = title || blog.title;
      blog.content = content || blog.content;
      blog.link = link || blog.link;
      blog.updatedAt = Date.now();
      
      await blog.save();
      res.json(blog);
    } catch (error) {
      res.status(400).json({ message: 'Invalid data', error: error.message });
    }
  });
  
// DELETE blog
router.delete('/communities/:communityId/blogs/:blogId', verifyToken, async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.blogId);
    
    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }
    
    // Check if user is the blog author or community creator
    const community = await Community.findById(req.params.communityId);
    if (!community) {
      return res.status(404).json({ message: 'Community not found' });
    }

    if (blog.author.toString() !== req.user.id && 
        community.creator.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    // Delete the blog
    await Blog.findByIdAndDelete(req.params.blogId);
    res.json({ message: 'Blog deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

//Like blog
router.post('/blogs/:id/like', verifyToken, async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ message: 'Blog not found' });

    blog.likes += 1;
    await blog.save();
    res.json(blog);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

//dislike blog 
router.post('/blogs/:id/dislike', verifyToken, async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ message: 'Blog not found' });

    blog.dislikes += 1;
    await blog.save();
    res.json(blog);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});


  
module.exports = router;