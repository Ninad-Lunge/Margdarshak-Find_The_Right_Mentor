import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const EditMenteeProfile = () => {
  const { menteeId } = useParams();
  const navigate = useNavigate();
  const [menteeData, setMenteeData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    location: '',
    occupation: '',
    bio: '',
    image: '',
    skills: [],
    education: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMenteeData();
  }, [menteeId]);

  const fetchMenteeData = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`https://margdarshak-find-the-right-mentor.onrender.com/api/mentee/${menteeId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data.success) {
        setMenteeData(response.data.mentee);
      }
    } catch (err) {
      toast.error('Failed to fetch mentee data');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setMenteeData({ ...menteeData, [name]: value });
  };

  const handleArrayChange = (field, index, value) => {
    const updatedArray = [...menteeData[field]];
    updatedArray[index] = value;
    setMenteeData({ ...menteeData, [field]: updatedArray });
  };

  const handleAddArrayItem = (field) => {
    setMenteeData({ ...menteeData, [field]: [...menteeData[field], ''] });
  };

  const handleRemoveArrayItem = (field, index) => {
    const updatedArray = menteeData[field].filter((_, i) => i !== index);
    setMenteeData({ ...menteeData, [field]: updatedArray });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(`https://margdarshak-find-the-right-mentor.onrender.com/api/mentee/${menteeId}`, menteeData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data.success) {
        toast.success('Profile updated successfully!');
        navigate(`/mentee-profile`);
      }
    } catch (err) {
      toast.error('Failed to update profile');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <ToastContainer />
      <div className="max-w-3xl mx-auto py-8 px-4">
        <h1 className="text-2xl font-bold mb-6">Edit Mentee Profile</h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* First Name */}
          <div>
            <label className="block text-sm font-medium mb-1">First Name</label>
            <input
              type="text"
              name="firstName"
              value={menteeData.firstName}
              onChange={handleInputChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          {/* Last Name */}
          <div>
            <label className="block text-sm font-medium mb-1">Last Name</label>
            <input
              type="text"
              name="lastName"
              value={menteeData.lastName}
              onChange={handleInputChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          {/* Email */}
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              type="email"
              name="email"
              value={menteeData.email}
              onChange={handleInputChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          {/* Bio */}
          <div>
            <label className="block text-sm font-medium mb-1">Bio</label>
            <textarea
              name="bio"
              value={menteeData.bio}
              onChange={handleInputChange}
              className="w-full p-2 border rounded"
              rows="4"
            ></textarea>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Image URL</label>
            <input
              type='text'
              name="image"
              value={menteeData.image}
              alt={`${menteeData.firstName} ${menteeData.lastName}`}
              onChange={handleInputChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          {/* Skills */}
          <div>
            <label className="block text-sm font-medium mb-1">Skills</label>
            {menteeData.skills.map((skill, index) => (
              <div key={index} className="flex items-center gap-2 mb-2">
                <input
                  type="text"
                  value={skill}
                  onChange={(e) =>
                    handleArrayChange('skills', index, e.target.value)
                  }
                  className="w-full p-2 border rounded"
                />
                <button
                  type="button"
                  onClick={() => handleRemoveArrayItem('skills', index)}
                  className="text-red-500"
                >
                  Remove
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() => handleAddArrayItem('skills')}
              className="text-blue-500"
            >
              Add Skill
            </button>
          </div>
          {/* Submit Button */}
          <div>
            <button
              type="submit"
              className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
            >
              Update Profile
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditMenteeProfile;