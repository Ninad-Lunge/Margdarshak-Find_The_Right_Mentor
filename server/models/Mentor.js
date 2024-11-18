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
  industrywork: { type: String, required: true },   //change
  skills: { type: String, required: true },
  bio: { type: String, required: true },
  linkedin: { type: String, required: true },
  twitter: { type: String, required: true },
  website: { type: String, required: true },
  introVideo: { type: String, required: true },
  featuredArticles: { type: String, required: true },
  whyMentor: { type: String, required: true },
  greatestAchievement: { type: String, required: true },

  // for recommendation engine
  industry: { type: String, required: true },         //new added
  companytype: { type: String, required: true },      //new added
  noofmentoredstudent: { type: String, required: true },        //new added
  domain: { type: String, required: true },            //new added
  subdomain: { type: String, required: true },        //new added
  noofprojects: { type: String, required: true },        //new added
  yearofexperience: { type: String, required: true },        //new added
  technologies: { type: String, required: true },        //new added
  positionofmentors: { type: String, required: true } ,       //new added

  followers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Mentee' }], // Array of mentee IDs
  followerCount: { type: Number, default: 0 } // Count of followers

});

module.exports = mongoose.model('Mentor', MentorSchema);
