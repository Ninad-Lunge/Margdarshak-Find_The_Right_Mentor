const express = require('express');
const router = express.Router();
const Mentor = require('../models/Mentor');

// POST route to add mentor data
router.post('/', async (req, res) => {
  const { firstName, lastName, email, password, jobTitle, company, location, industry, skills, bio, linkedin, twitter, website, introVideo, featuredArticles, whyMentor, greatestAchievement } = req.body;
  
  try {
    // Create new mentor entry
    const newMentor = new Mentor({
      firstName,
      lastName,
      email,
      password,
      jobTitle,
      company,
      location,
      industry,
      skills,
      bio,
      linkedin,
      twitter,
      website,
      introVideo,
      featuredArticles,
      whyMentor,
      greatestAchievement,
    });
    
    // Save to database
    const savedMentor = await newMentor.save();
    res.status(201).json(savedMentor);
  } catch (err) {
    res.status(500).json({ message: 'Server Error', error: err });
  }
});

module.exports = router;