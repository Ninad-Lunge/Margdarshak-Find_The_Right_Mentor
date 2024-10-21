const mongoose = require('mongoose');

const MentorSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  jobTitle: { type: String, required: true },
  company: { type: String, required: true },
  location: { type: String, required: true },
  industry: { type: String, required: true },
  skills: { type: String, required: true },
  bio: { type: String },
  linkedin: { type: String },
  twitter: { type: String },
  website: { type: String },
  introVideo: { type: String },
  featuredArticles: { type: String },
  whyMentor: { type: String },
  greatestAchievement: { type: String }
});

module.exports = mongoose.model('Mentor', MentorSchema);