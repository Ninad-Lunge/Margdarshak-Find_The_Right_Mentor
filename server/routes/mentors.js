const express = require('express');
const bcrypt = require('bcrypt');
const router = express.Router();
const Mentor = require('../models/Mentor');

const saltRounds = 10;

// POST route to add mentor data
router.post('/register-mentor', async (req, res) => {
  const { firstName, lastName, email, password, jobTitle, company, location, industry, skills, bio, linkedin, twitter, website, introVideo, featuredArticles, whyMentor, greatestAchievement } = req.body;

  try {
      // Hash the password
      const hashedPassword = await bcrypt.hash(password, saltRounds);

      // Create new mentor entry with hashed password
      const newMentor = new Mentor({
          firstName,
          lastName,
          email,
          password: hashedPassword,
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

      const savedMentor = await newMentor.save();
      res.status(201).json(savedMentor);
  } catch (err) {
      res.status(500).json({ message: 'Server Error', error: err });
  }
});

module.exports = router;