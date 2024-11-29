import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Mail, MapPin, Briefcase, Book, Calendar, Edit2, Globe, Twitter, Linkedin } from 'lucide-react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Navbar from '../../Components/Mentor/MentorNavbar';

const TECHNOLOGIES = [
  "JavaScript", "Python", "Java", "React", "Node.js",
  "Data Science", "Machine Learning", "Project Management",
  "Leadership", "Communication"
];

const INDUSTRIES = [
  "Technology", "Healthcare", "Finance", "Education",
  "Manufacturing", "Retail", "Consulting",
  "Media & Entertainment", "Real Estate", "Energy"
];

const DOMAINS = [
  "Software Development", "Data & Analytics", "Product Management",
  "Design", "Marketing", "Sales", "Operations", "Human Resources",
  "Finance & Accounting", "Research & Development"
];

const SUBDOMAINS = {
  "Software Development": [
    "Frontend Development", "Backend Development", "Mobile Development",
    "DevOps", "Quality Assurance", "Full Stack Development",
    "Cloud Computing", "Database Development", "API Development",
    "System Architecture"
  ],
  "Data & Analytics": [
    "Data Engineering", "Data Science", "Business Intelligence",
    "Data Analytics", "Machine Learning", "Big Data",
    "Statistical Analysis", "Predictive Analytics",
    "Data Visualization", "Data Mining"
  ],
  
  "Product Management": [
    "Product Strategy", "Product Development", "Product Marketing",
    "Product Analytics", "User Research","Product Operations",
    "Growth Product Management", "Technical Product Management",
    "Product Design", "Agile Product Management"
  ],
  "Design": [
    "UI Design", "UX Design", "Graphic Design", "Web Design",
    "Product Design", "Visual Design", "Interaction Design",
    "Motion Design", "Brand Design", "Design Systems"
  ],
  "Marketing": [
    "Digital Marketing", "Content Marketing", "Social Media Marketing",
    "Email Marketing", "SEO/SEM", "Brand Marketing", "Marketing Analytics",
    "Growth Marketing", "Product Marketing", "Performance Marketing"
  ],
  "Sales": [
    "Inside Sales", "Field Sales", "Enterprise Sales", "Sales Operations",
    "Sales Management", "Business Development", "Account Management",
    "Channel Sales", "Sales Strategy", "Technical Sales"
  ],
  "Operations": [
    "Project Operations", "Business Operations", "Technical Operations",
    "Supply Chain Operations", "Customer Operations", "IT Operations",
    "Process Improvement", "Quality Management", "Operations Analytics",
    "Vendor Management"
  ],
  "Human Resources": [
    "Talent Acquisition", "Employee Relations", "Compensation & Benefits",
    "HR Operations", "Learning & Development", "Performance Management",
    "HR Analytics", "Organizational Development", "HR Strategy", "Diversity & Inclusion"
  ],
  "Finance & Accounting": [
    "Financial Planning", "Financial Analysis", "Corporate Finance", "Investment Banking",
    "Risk Management", "Tax Planning", "Audit", "Management Accounting", "Treasury",
    "Financial Reporting"
  ],
  "Research & Development": [
    "Product R&D", "Software R&D", "Scientific Research", "Technology Innovation",
    "Applied Research", "Experimental Development", "Research Strategy", "Prototype Development",
    "Research Analytics", "Innovation Management"
  ]
};

const MentorProfile = () => {
  const navigate = useNavigate();
  const [mentorData, setMentorData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [sessions, setSessions] = useState([]);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    image: '',
    jobTitle: '',
    company: '',
    location: '',
    bio: '',
    linkedin: '',
    twitter: '',
    website: '',
    whyMentor: '',
    positionofmentors: '',
    Technologies: [],
    industry: '',
    domain: '',
    subdomain: '',
    yearofexperience: ''
  });

  useEffect(() => {
    fetchMentorData();
    fetchMentorSessions();
  }, []);

  const fetchMentorData = async () => {
    const token = localStorage.getItem('token');
    const mentorId = localStorage.getItem('mentorId');
    try {
      const response = await fetch(`https://margdarshak-find-the-right-mentor.onrender.com/api/mentor/${mentorId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }

      const result = await response.json();

      if (result.success) {
        setMentorData(result.mentor);
        setFormData(result.mentor);
      } else {
        throw new Error(result.message);
      }
    } catch (error) {
      setError('Failed to fetch mentor profile');
      toast.error('Error loading mentor profile');
    } finally {
      setLoading(false);
    }
  };

  const fetchMentorSessions = async () => {
    const token = localStorage.getItem('token');
    const mentorId = localStorage.getItem('mentorId');
    try {
      const response = await fetch(`https://margdarshak-find-the-right-mentor.onrender.com/api/availability/mentor-sessions/${mentorId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }

      const result = await response.json();

      if (result.success) {
        setSessions(result.sessions);
      }
    } catch (error) {
      console.error('Error fetching sessions:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type } = e.target;

    if (type === 'select-multiple') {
      const selectedOptions = Array.from(e.target.selectedOptions).map(option => option.value);
      setFormData(prev => ({
        ...prev,
        [name]: selectedOptions
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }

    // Reset subdomain if domain changes
    if (name === 'domain') {
      setFormData(prev => ({
        ...prev,
        domain: value,
        subdomain: ''
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    const mentorId = localStorage.getItem('mentorId');

    try {
      const response = await fetch(`https://margdarshak-find-the-right-mentor.onrender.com/api/mentor/${mentorId}`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }

      const result = await response.json();

      if (result.success) {
        setMentorData(result.mentor);
        setIsEditing(false);
        toast.success('Profile updated successfully');
      } else {
        throw new Error(result.message);
      }
    } catch (error) {
      toast.error('Error updating profile');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error || !mentorData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 mb-4">{error || 'Failed to load mentor profile'}</p>
          <button
            onClick={() => navigate(-1)}
            className="text-blue-500 hover:text-blue-700"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const renderEditForm = () => (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6 space-y-6">
      <h2 className="text-xl font-semibold">Edit Profile</h2>

      {/* Basic Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">First Name</label>
          <input
            type="text"
            name="firstName"
            value={formData.firstName}
            onChange={handleInputChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Last Name</label>
          <input
            type="text"
            name="lastName"
            value={formData.lastName}
            onChange={handleInputChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Image URL</label>
          <input
            type="url"
            name="image"
            value={formData.image}
            onChange={handleInputChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
            required
          />
        </div>
      </div>

      {/* Professional Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">Job Title</label>
          <input
            type="text"
            name="jobTitle"
            value={formData.jobTitle}
            onChange={handleInputChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Company</label>
          <input
            type="text"
            name="company"
            value={formData.company}
            onChange={handleInputChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Location</label>
          <input
            type="text"
            name="location"
            value={formData.location}
            onChange={handleInputChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Years of Experience</label>
          <input
            type="text"
            name="yearofexperience"
            value={formData.yearofexperience}
            onChange={handleInputChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
            required
          />
        </div>
      </div>

      {/* Domain Selection */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">Industry</label>
          <select
            name="industry"
            value={formData.industry}
            onChange={handleInputChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
            required
          >
            <option value="">Select Industry</option>
            {INDUSTRIES.map(industry => (
              <option key={industry} value={industry}>{industry}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Domain</label>
          <select
            name="domain"
            value={formData.domain}
            onChange={handleInputChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
            required
          >
            <option value="">Select Domain</option>
            {DOMAINS.map(domain => (
              <option key={domain} value={domain}>{domain}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Subdomain</label>
          <select
            name="subdomain"
            value={formData.subdomain}
            onChange={handleInputChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
            required
          >
            <option value="">Select Subdomain</option>
            {SUBDOMAINS[formData.domain]?.map(subdomain => (
              <option key={subdomain} value={subdomain}>{subdomain}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Technologies</label>
          <select
            multiple
            name="Technologies"
            value={formData.Technologies}
            onChange={handleInputChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
            required
          >
            {TECHNOLOGIES.map(tech => (
              <option key={tech} value={tech}>{tech}</option>
            ))}
          </select>
          <p className="text-sm text-gray-500 mt-1">Hold Ctrl/Cmd to select multiple</p>
        </div>
      </div>

      {/* Social Links */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">LinkedIn Profile</label>
          <input
            type="url"
            name="linkedin"
            value={formData.linkedin}
            onChange={handleInputChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Twitter Profile</label>
          <input
            type="url"
            name="twitter"
            value={formData.twitter}
            onChange={handleInputChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Personal Website</label>
          <input
            type="url"
            name="website"
            value={formData.website}
            onChange={handleInputChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
            required
          />
        </div>
      </div>

      {/* Text Areas */}
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Bio</label>
          <textarea
            name="bio"
            value={formData.bio}
            onChange={handleInputChange}
            rows={4}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Why do you want to mentor?</label>
          <textarea
            name="whyMentor"
            value={formData.whyMentor}
            onChange={handleInputChange}
            rows={4}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Position of Mentors</label>
          <textarea
            name="positionofmentors"
            value={formData.positionofmentors}
            onChange={handleInputChange}
            rows={4}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
            required
          />
        </div>
      </div>

      <div className="flex justify-end gap-4">
        <button
          type="button"
          onClick={() => setIsEditing(false)}
          className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Save Changes
        </button>
      </div>
    </form>
  );

  const renderProfile = () => (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      {/* Left Column */}
      <div className="space-y-6">
        {/* About Section */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex justify-between items-start">
            <img
              src={mentorData.image || `https://margdarshak-find-the-right-mentor.onrender.com/api/placeholder/128/128`}
              alt={`${mentorData.firstName} ${mentorData.lastName}`}
              className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-lg mb-4"
            />
            <button
              onClick={() => setIsEditing(true)}
              className="text-blue-600 hover:text-blue-800"
            >
              <Edit2 className="w-5 h-5" />
            </button>
          </div>
          <h2 className="text-xl font-semibold mb-2">About</h2>
          <p className="text-gray-600 mb-4">{mentorData.bio || 'No bio available'}</p>
        </div>

        {/* Contact Information */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Contact Information</h2>
          <div className="space-y-3">
            <div className="flex items-center">
              <Mail className="w-5 h-5 text-gray-400 mr-2" />
              <span className="text-gray-600">{mentorData.email}</span>
            </div>
            <div className="flex items-center">
              <MapPin className="w-5 h-5 text-gray-400 mr-2" />
              <span className="text-gray-600">{mentorData.location}</span>
            </div>
            <div className="flex items-center">
              <Briefcase className="w-5 h-5 text-gray-400 mr-2" />
              <span className="text-gray-600">{mentorData.jobTitle} at {mentorData.company}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Middle Column */}
      <div className="space-y-6">
        {/* Professional Details */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Professional Details</h2>
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold mb-2">Industry</h3>
              <p className="text-gray-600">{mentorData.industry}</p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Domain</h3>
              <p className="text-gray-600">{mentorData.domain}</p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Subdomain</h3>
              <p className="text-gray-600">{mentorData.subdomain}</p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Years of Experience</h3>
              <p className="text-gray-600">{mentorData.yearofexperience} years</p>
            </div>
          </div>
        </div>

        {/* Technologies */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Technologies</h2>
          <div className="flex flex-wrap gap-2">
            {mentorData.Technologies?.map((tech, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Right Column */}
      <div className="space-y-6">
        {/* Social Links */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Connect</h2>
          <div className="space-y-3">
            {mentorData.linkedin && (
              <a
                href={mentorData.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center text-gray-600 hover:text-blue-600"
              >
                <Linkedin className="w-5 h-5 mr-2" />
                LinkedIn Profile
              </a>
            )}
            {mentorData.twitter && (
              <a
                href={mentorData.twitter}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center text-gray-600 hover:text-blue-400"
              >
                <Twitter className="w-5 h-5 mr-2" />
                Twitter Profile
              </a>
            )}
            {mentorData.website && (
              <a
                href={mentorData.website}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center text-gray-600 hover:text-green-600"
              >
                <Globe className="w-5 h-5 mr-2" />
                Personal Website
              </a>
            )}
          </div>
        </div>

        {/* Recent Sessions */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Recent Sessions</h2>
          {sessions.length > 0 ? (
            <div className="space-y-4">
              {sessions.map((session, index) => (
                <div key={index} className="border-b pb-4 last:border-b-0 last:pb-0">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold">{session.title}</h3>
                    <span className="text-sm text-gray-500 flex items-center">
                      <Calendar className="w-4 h-4 mr-1" />
                      {new Date(session.date).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-gray-600">{session.description}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No recent sessions</p>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 py-8">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-gray-600 hover:text-gray-800 mb-6"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back
        </button>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : error ? (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        ) : isEditing ? (
          renderEditForm()
        ) : (
          renderProfile()
        )}
      </div>
      <ToastContainer position="bottom-right" />
    </div>
  );
};

export default MentorProfile;