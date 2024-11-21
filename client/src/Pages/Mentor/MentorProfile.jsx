import React, { useState, useEffect } from 'react';
import Navbar from '../../Components/Mentor/MentorNavbar';

const MentorProfile = () => {
  const [mentorData, setMentorData] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    jobTitle: '',
    company: '',
    location: '',
    industry: '',
    Technologies: '',
    bio: '',
    linkedin: '',
    twitter: '',
    website: '',
  });

  useEffect(() => {
    // Fetch mentor profile data
    const fetchMentorData = async () => {
      const token = localStorage.getItem('token');
      const mentorId = localStorage.getItem('mentorId');
      try {
        const response = await fetch(`/api/mentor/${mentorId}`, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error(`Error: ${response.statusText}`);
        }

        const result = await response.json();

        if (result.success) {
          setMentorData(result.mentor);
          setFormData(result.mentor);
        } else {
          console.error(result.message);
        }
      } catch (error) {
        console.error('Error fetching mentor profile:', error);
      }
    };

    fetchMentorData();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    const mentorId = localStorage.getItem('mentorId');

    try {
      const response = await fetch(`/api/mentor/${mentorId}`, {
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
        setIsEditing(false); // Exit edit mode
      } else {
        console.error(result.message);
      }
    } catch (error) {
      console.error('Error updating mentor profile:', error);
    }
  };

  if (!mentorData) {
    return <p className="text-center text-gray-500">Loading...</p>;
  }

  return (
    <div className='bg-gray-50'>
      <Navbar />
      <div className="max-w-4xl mx-auto p-6 bg-white rounded-md shadow-lg mt-2">
        <h1 className="text-2xl font-semibold text-blue-600 text-center mb-4">
          Mentor Profile
        </h1>
        {isEditing ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            {Object.keys(formData).map((key) =>
              key !== '_id' ? (
                <div key={key} className="flex flex-col">
                  <label
                    htmlFor={key}
                    className="text-gray-700 font-medium mb-1"
                  >
                    {key.charAt(0).toUpperCase() + key.slice(1)}:
                  </label>
                  <input
                    type="text"
                    name={key}
                    value={formData[key]}
                    onChange={handleInputChange}
                    className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              ) : null
            )}
            <button
              type="submit"
              className="w-full bg-blue-500 text-white font-medium py-2 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              Save Changes
            </button>
          </form>
        ) : (
          <div>
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-gray-700">
                {mentorData.firstName} {mentorData.lastName}
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(mentorData).map(([key, value]) =>
                key !== '_id' ? (
                  <div key={key} className="bg-white p-4 rounded-md shadow">
                    <p className="text-sm font-medium text-gray-500">
                      {key.charAt(0).toUpperCase() + key.slice(1)}:
                    </p>
                    <p className="text-gray-700 overflow-hidden">
                      {value &&
                      (key.includes('linkedin') ||
                        key.includes('twitter') ||
                        key.includes('website')) ? (
                        <a
                          href={value}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-500 hover:underline"
                        >
                          {key.charAt(0).toUpperCase() + key.slice(1)}
                        </a>
                      ) : (
                        value || 'N/A'
                      )}
                    </p>
                  </div>
                ) : null
              )}
            </div>
            <button
              onClick={handleEditToggle}
              className="mt-6 w-full bg-green-500 text-white font-medium py-2 rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-400"
            >
              Edit Profile
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default MentorProfile;