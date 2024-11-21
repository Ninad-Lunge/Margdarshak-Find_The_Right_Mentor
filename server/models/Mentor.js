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
  bio: { type: String, required: true },
  linkedin: { type: String, required: true },
  twitter: { type: String, required: true },
  website: { type: String, required: true },
  whyMentor: { type: String, required: true },
  positionofmentors: { type: String, required: true },

    
  Technologies: {
    type: [String],
    required: true,
    enum: [
      "JavaScript", 
      "Python",
      "Java",
      "React",
      "Node.js",
      "Data Science",
      "Machine Learning",
      "Project Management",
      "Leadership",
      "Communication"
    ]
  },
  industry: {
    type: String,
    required: true,
    enum: [
      "Technology",
      "Healthcare",
      "Finance",
      "Education",
      "Manufacturing",
      "Retail",
      "Consulting",
      "Media & Entertainment",
      "Real Estate",
      "Energy"
    ]
  },
  domain: {
    type: String,
    required: true,
    enum: [
      "Software Development",
      "Data & Analytics",
      "Product Management",
      "Design",
      "Marketing",
      "Sales",
      "Operations",
      "Human Resources",
      "Finance & Accounting",
      "Research & Development"
    ]
  },
  subdomain: {
    type: String,
    required: true,
    // The validation for subdomain will depend on the selected domain
    validate: {
      validator: function(value) {
        const validSubdomains = {
          "Software Development": [
            "Frontend Development",
            "Backend Development",
            "Mobile Development",
            "DevOps",
            "Quality Assurance",
            "Full Stack Development",
            "Cloud Computing",
            "Database Development",
            "API Development",
            "System Architecture"
          ],
          
          "Data & Analytics": [
            "Data Engineering",
            "Data Science",
            "Business Intelligence",
            "Data Analytics",
            "Machine Learning",
            "Big Data",
            "Statistical Analysis",
            "Predictive Analytics",
            "Data Visualization",
            "Data Mining"
          ],
          
          "Product Management": [
            "Product Strategy",
            "Product Development",
            "Product Marketing",
            "Product Analytics",
            "User Research",
            "Product Operations",
            "Growth Product Management",
            "Technical Product Management",
            "Product Design",
            "Agile Product Management"
          ],
          
          "Design": [
            "UI Design",
            "UX Design",
            "Graphic Design",
            "Web Design",
            "Product Design",
            "Visual Design",
            "Interaction Design",
            "Motion Design",
            "Brand Design",
            "Design Systems"
          ],
          
          "Marketing": [
            "Digital Marketing",
            "Content Marketing",
            "Social Media Marketing",
            "Email Marketing",
            "SEO/SEM",
            "Brand Marketing",
            "Marketing Analytics",
            "Growth Marketing",
            "Product Marketing",
            "Performance Marketing"
          ],
          
          "Sales": [
            "Inside Sales",
            "Field Sales",
            "Enterprise Sales",
            "Sales Operations",
            "Sales Management",
            "Business Development",
            "Account Management",
            "Channel Sales",
            "Sales Strategy",
            "Technical Sales"
          ],
          
          "Operations": [
            "Project Operations",
            "Business Operations",
            "Technical Operations",
            "Supply Chain Operations",
            "Customer Operations",
            "IT Operations",
            "Process Improvement",
            "Quality Management",
            "Operations Analytics",
            "Vendor Management"
          ],
          
          "Human Resources": [
            "Talent Acquisition",
            "Employee Relations",
            "Compensation & Benefits",
            "HR Operations",
            "Learning & Development",
            "Performance Management",
            "HR Analytics",
            "Organizational Development",
            "HR Strategy",
            "Diversity & Inclusion"
          ],
          
          "Finance & Accounting": [
            "Financial Planning",
            "Financial Analysis",
            "Corporate Finance",
            "Investment Banking",
            "Risk Management",
            "Tax Planning",
            "Audit",
            "Management Accounting",
            "Treasury",
            "Financial Reporting"
          ],
          
          "Research & Development": [
            "Product R&D",
            "Software R&D",
            "Scientific Research",
            "Technology Innovation",
            "Applied Research",
            "Experimental Development",
            "Research Strategy",
            "Prototype Development",
            "Research Analytics",
            "Innovation Management"
          ]
        };
        return validSubdomains[this.domain]?.includes(value);
      },
      message: 'Invalid subdomain for the selected domain'
    }
  },
  yearofexperience: { type: String, required: true },
  followers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Mentee' }],
  followerCount: { type: Number, default: 0 }
});

module.exports = mongoose.model('Mentor', MentorSchema);
