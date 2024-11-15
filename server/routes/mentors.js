const express = require('express');
const bcrypt = require('bcrypt');
const router = express.Router();
const Mentor = require('../models/Mentor');

const saltRounds = 10;

// POST route to add mentor data
router.post('/register-mentor', async (req, res) => {
  const { firstName, lastName, email, password, jobTitle, company, location, industrywork, skills, bio, linkedin, twitter, website, introVideo, featuredArticles, whyMentor, greatestAchievement, industry, companytype, noofmentoredstudent, domain, subdomain, noofprojects, yearofexperience, technologies, positionofmentors } = req.body;

  try {
    console.log("in try catch");
      // Hash the password,,yearofexperience
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
          industrywork,
          skills,
          bio,
          linkedin,
          twitter,
          website,
          introVideo,
          featuredArticles,
          whyMentor,
          greatestAchievement,
            industry,
            companytype,
            noofmentoredstudent,
            domain,
            subdomain,
            noofprojects,
            yearofexperience,
            technologies,
            positionofmentors
      });

      const savedMentor = await newMentor.save();
      console.log("save data");
      res.status(201).json(savedMentor);
  } catch (err) {
      res.status(500).json({ message: 'Server Error', error: err });
  }
});

module.exports = router;