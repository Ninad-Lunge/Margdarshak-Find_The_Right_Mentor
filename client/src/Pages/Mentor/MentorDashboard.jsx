import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { X } from 'lucide-react';
import Navbar from '../../Components/Mentor/MentorNavbar';
import FollowersModal from '../../Components/Mentor/FollowersModal';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const MentorDashboard = () => {
  const [confirmedSlots, setConfirmedSlots] = useState([]);
  const [error, setError] = useState(null);
  const [showFollowers, setShowFollowers] = useState(false);
  const navigate = useNavigate();

  const [mentorData, setMentorData] = useState(() => {
    try {
      const savedData = localStorage.getItem('mentorData');
      return savedData ? JSON.parse(savedData) : null;
    } catch (error) {
      console.error("Error parsing mentor data:", error);
      return null;
    }
  });

  const mentorId = localStorage.getItem('mentorId');

  useEffect(() => {
    if (!mentorData && mentorId) {
      fetch(`/api/mentor/${mentorId}`)
        .then(response => response.json())
        .then(data => {
          if (data.success) {
            setMentorData(data.mentor);
            localStorage.setItem('mentorData', JSON.stringify(data.mentor));
          }
        })
        .catch(error => console.error("Error fetching mentor data:", error));
    }
    fetchConfirmedSlots();
  }, [mentorData, mentorId]);

  const fetchConfirmedSlots = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('No authentication token found');
        return;
      }

      const response = await axios.get('/api/availability/confirmed', {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (Array.isArray(response.data)) {
        setConfirmedSlots(response.data);
      }
    } catch (error) {
      const errorMessage = error.response?.data?.error || 'Failed to load slots';
      setError(errorMessage);
      toast.error(errorMessage);
    }
  };

  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('No authentication token found');
        return;
      }
  
      const response = await axios.delete(`/api/availability/delete-slot/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
  
      if (response.status === 200) {
        toast.success('Slot deleted successfully');
        fetchConfirmedSlots();
      }
    } catch (error) {
      toast.error('Error deleting slot');
    }
  };

  const handleClick = () => {
    navigate('/create-community');
  }

  if (!mentorData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <ToastContainer />
      
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Left Column */}
          <div className="lg:col-span-3 space-y-6">
            {/* Profile and Stats Section */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Profile Card */}
              <div className="bg-white rounded-xl shadow-sm p-6 text-center">
                <div className="relative w-32 h-32 mx-auto">
                  <img
                    src={mentorData.image}
                    alt={`${mentorData.firstName} ${mentorData.lastName}`}
                    className="rounded-full w-full h-full object-cover border-4 border-gray-50 shadow-md"
                  />
                </div>
                <h2 className="mt-4 text-xl font-semibold">
                  {mentorData.firstName} {mentorData.lastName}
                </h2>
                <p className="text-gray-600 mt-1">{mentorData.industry}</p>
                <p className="text-gray-600">{mentorData.location}</p>
                <button 
                  onClick={() => navigate('/mentor-profile')}
                  className="mt-4 w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Edit Profile
                </button>
              </div>

              {/* Stats Card */}
              <div className="md:col-span-2 bg-white rounded-xl shadow-sm p-6">
                <div className="grid grid-cols-3 gap-4">
                  <button 
                    onClick={() => setShowFollowers(true)}
                    className="text-center p-4 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <p className="text-2xl font-bold text-blue-600">
                      {mentorData?.followerCount || 0}
                    </p>
                    <p className="text-gray-600">Followers</p>
                  </button>
                  <div className="text-center p-4">
                    <p className="text-2xl font-bold text-blue-600">52</p>
                    <p className="text-gray-600">Communities</p>
                  </div>
                  <div className="text-center p-4">
                    <p className="text-2xl font-bold text-blue-600">5</p>
                    <p className="text-gray-600">Workshops</p>
                  </div>
                </div>

                <div className="mt-6">
                  <h3 className="text-lg font-semibold mb-4">Expertise</h3>
                  <div className="flex flex-wrap gap-2">
                    {['Web Development', 'Data Science', 'Machine Learning', 
                      'App Development', 'Cloud Computing', 'Cybersecurity'].map((skill) => (
                      <span
                        key={skill}
                        className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mt-6">
                  <h3 className="text-lg font-semibold mb-1">Bio</h3>
                  {mentorData.bio}
                </div>

              </div>
            </div>

            {/* Community and Workshops Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h3 className="text-lg font-semibold mb-4">Community</h3>
                <p className="text-gray-600 mb-4">Create and manage your learning communities</p>
                <button 
                  className="w-full px-4 py-2 border-2 border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
                  onClick={handleClick}
                >
                  Create New Community
                </button>
              </div>

              <div className="bg-white rounded-xl shadow-sm p-6">
                <h3 className="text-lg font-semibold mb-4">Workshops</h3>
                <p className="text-gray-600 mb-4">Schedule and conduct interactive workshops</p>
                <button className="w-full px-4 py-2 border-2 border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors">
                  Conduct Workshop
                </button>
              </div>
            </div>
          </div>

          {/* Right Column - Meetings */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-semibold">Meetings</h3>
              <button
                onClick={() => navigate('/manage-slots')}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Add Slots
              </button>
            </div>

            <div className="space-y-4">
              {confirmedSlots.map((slot, index) => (
                <div key={index} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h4 className="font-medium">
                        {slot.menteeId?.firstName} {slot.menteeId?.lastName}
                      </h4>
                      <p className="text-sm text-gray-600">
                        {new Date(slot.date).toLocaleDateString()}
                      </p>
                      <p className="text-sm text-gray-600">
                        {slot.startTime} - {slot.endTime}
                      </p>
                    </div>
                    <button 
                      onClick={() => handleDelete(slot._id)}
                      className="text-green-600 hover:bg-green-50 px-3 py-1 rounded-md text-sm"
                    >
                      Complete
                    </button>
                  </div>
                  <a
                    href={slot.meetLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-full text-center px-4 py-2 bg-blue-50 text-blue-600 rounded-md hover:bg-blue-100 transition-colors"
                  >
                    Join Meeting
                  </a>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <FollowersModal 
        isOpen={showFollowers} 
        onClose={() => setShowFollowers(false)} 
        mentorId={mentorId} 
      />
    </div>
  );
};

export default MentorDashboard;