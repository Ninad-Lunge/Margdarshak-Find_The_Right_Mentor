import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../Components/Mentor/MentorNavbar';
import 'react-time-picker/dist/TimePicker.css';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const MentorDashboard = () => {
  const [confirmedSlots, setConfirmedSlots] = useState([]);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const [mentorData, setMentorData] = useState(() => {
    try {
      const savedData = localStorage.getItem('mentorData');
      console.log("Mentor data from localStorage:", savedData);
      return savedData ? JSON.parse(savedData) : null;
    } catch (error) {
      console.error("Error parsing mentor data from localStorage:", error);
      return null;
    }
  });

  const mentorId = localStorage.getItem('mentorId');

  // Fetch mentor data from API if not in localStorage
  useEffect(() => {
    if (!mentorData && mentorId) {
      fetch(`/api/mentor/${mentorId}`)
        .then(response => response.json())
        .then(data => {
          if (data.success) {
            setMentorData(data.mentor);
            localStorage.setItem('mentorData', JSON.stringify(data.mentor));
          } else {
            console.error("Failed to fetch mentor data");
          }
        })
        .catch(error => console.error("Error fetching mentor data from API:", error));
    }
  }, [mentorData, mentorId]);

  const handleNavigation = () => {
    navigate('/add-slots');
  };

  const handleEditProfile = () => {
    navigate('/mentor-profile');
  };

  useEffect(() => {
    fetchConfirmedSlots();
  }, []);

  const fetchConfirmedSlots = async () => {
    setError(null);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('No authentication token found. Please log in.');
        return;
      }

      const response = await axios.get('/api/availability/confirmed', {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (Array.isArray(response.data)) {
        setConfirmedSlots(response.data);
      } else {
        console.error('Unexpected response format:', response.data);
        setError('Invalid data format received from server');
      }
    } catch (error) {
      console.error('Error details:', error.response || error);
      const errorMessage = error.response?.data?.error || error.message || 'Failed to load available slots';
      setError(errorMessage);
      toast.error(errorMessage);
    }
  };

  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('No authentication token found. Please log in.');
        return;
      }
  
      const response = await axios.delete(`/api/availability/delete-slot/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
  
      if (response.status === 200) {
        toast.success('Slot deleted successfully');
        fetchConfirmedSlots();
      } else {
        toast.error('Failed to delete slot');
      }
    } catch (error) {
      console.error('Error deleting slot:', error.response || error);
      setError('Error Deleting Slot');
    }
  };  

  if (!mentorData) {
    return <div>Loading mentor data...</div>;
  }

  return (
    <div className="mentor min-h-screen bg-gray-50">
      <Navbar />
      <ToastContainer />
      <div className="grid grid-cols-1 lg:grid-cols-4 mt-3 mx-6 gap-4">

        <div className="col-span-3">
          <div className="grid grid-cols-3 gap-4 mb-4">
            {/* Sidebar */}
            <div className="py-8 bg-white shadow rounded-lg">
              <img
                src={mentorData.image || '../../Assets/logo.png'}
                alt="Mentor Profile"
                className="mentor-img border border-black rounded-full h-36 w-36 mx-auto mt-2"
                onError={(e) => { e.target.src = '../../Assets/logo.png'; }}
              />
              <h1 className="mentor-name mt-8 mx-auto text-center">
                {mentorData.firstName} {mentorData.lastName}
              </h1>
              <p className="text-center text-gray-600">Industry: {mentorData.industrywork}</p>
              <p className="text-center text-gray-600">Location: New York</p>
              <button className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 mx-auto block" onClick={handleEditProfile}>
                Edit Profile
              </button>
            </div>

            {/* Stats Section */}
            <div className="stats col-span-2 bg-white shadow rounded-lg">
              <h2 className="text-center mt-2 font-semibold">Your Stats</h2>
              {/* Add relevant stats here */}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Community Section */}
            <div className="community bg-white shadow rounded-lg h-60 flex flex-col">
              <h2 className="text-center mt-2 font-bold">Community</h2>
              <button
                className="add-slots border border-black px-4 py-2 mt-4 rounded-md hover:shadow-xl hover:-translate-x-1 hover:-translate-y-1 mx-auto"
              >
                Create a new Community
              </button>
            </div>

            {/* Workshops Section */}
            <div className="workshops bg-white shadow rounded-lg h-60 flex flex-col">
              <h2 className="text-center mt-2 font-bold">Workshops</h2>
              <button
                className="add-slots border border-black px-4 py-2 mt-4 rounded-md hover:shadow-xl hover:-translate-x-1 hover:-translate-y-1 mx-auto"
              >
                Conduct Workshop
              </button>
            </div>
          </div>
        </div>

        {/* Meetings Section */}
        <div className="col-span-1 bg-white shadow rounded-lg p-4">
          <h2 className="text-center font-semiold">Meetings</h2>
          <button
            onClick={handleNavigation}
            className="mt-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 w-full"
          >
            Add Availability
          </button>
          <h3 className="mt-2 text-gray-800 font-medium mb-2">Upcoming Meetings</h3>

          {error && <p className="text-red-500">{error}</p>}

          <div className="space-y-2">
            {confirmedSlots.map((slot, index) => (
              <div
                key={index}
                className="bg-white p-4 rounded-lg shadow hover:shadow-lg transition-shadow border border-gray-200"
              >
                <div className="mb-2 grid grid-cols-3">
                  <h3 className="text-md font-medium col-span-2">
                    Mentee: {slot.menteeId?.firstName || 'Not specified'}
                    {slot.menteeId?.lastName ? ` ${slot.menteeId.lastName}` : ''}
                  </h3>
                  <button 
                    className='px-1 py-1 border border-green-500 rounded-md hover:bg-green-500 hover:text-white'
                    onClick={() => handleDelete(slot._id) }
                  >
                    Done
                  </button>
                </div>

                <div className="grid grid-cols-3">
                  <div className="space-y-1 text-gray-600 col-span-2">
                    <div className="flex items-center space-x-1 text-sm">
                      <span className="font-medium">Date:</span>
                      <span>{new Date(slot.date).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center space-x-1 text-sm">
                      <span className="font-medium">Time:</span>
                      <span>{slot.startTime} - {slot.endTime}</span>
                    </div>
                  </div>
                  <div className="flex">
                    <a
                      href={slot.meetLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 text-sm px-2 py-2 border border-blue-500 rounded-md my-auto hover:bg-blue-500 hover:text-white w-full text-center"
                    >
                      Join Meet
                    </a>
                  </div>
                </div>

              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

export default MentorDashboard;