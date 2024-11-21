const mongoose = require('mongoose');

const MentorSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  image: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  jobTitle: { type: String, required: true },
  company: { type: String, required: true },
  location: { type: String, required: true },
  skills: { type: String, required: true },
  bio: { type: String, required: true },
  linkedin: { type: String, required: true },
  twitter: { type: String, required: true },
  website: { type: String, required: true },
  whyMentor: { type: String, required: true },

  // for recommendation engine
  industry: { type: String, required: true },
  domain: { type: String, required: true },
  subdomain: { type: String, required: true },
  yearofexperience: { type: String, required: true },
  positionofmentors: { type: String, required: true } ,
  followers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Mentee' }],
  followerCount: { type: Number, default: 0 }
});

module.exports = mongoose.model('Mentor', MentorSchema);
