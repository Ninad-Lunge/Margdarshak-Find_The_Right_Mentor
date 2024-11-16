import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../Components/Mentor/MentorNavbar';
import 'react-time-picker/dist/TimePicker.css';

const MentorDashboard = () => {
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

  if (!mentorData) {
    return <div>Loading mentor data...</div>;
  }

  return (
    <div className="mentor">
      <Navbar />

      <div className="grid grid-cols-4 mt-4 mx-12 gap-6">
        {/* Sidebar */}
        <div className="col-span-1 border border-black rounded-md px-2 py-16 mx-6">
          <img
            src={mentorData.profileImage || '/default-profile.png'}
            alt="Mentor Profile"
            className="mentor-img border border-black rounded-full h-32 w-32 mx-auto"
          />
          <h1 className="mentor-name mt-10 mx-auto text-center">
            {mentorData.firstName} {mentorData.lastName}
          </h1>
        </div>

        {/* Stats Section */}
        <div className="stats col-span-2 border border-black rounded-md">
          <h2 className="text-center mt-2 font-bold">Your Stats</h2>
          {/* Add relevant stats here */}
        </div>

        {/* Meetings Section */}
        <div className="meetings col-span-1 border border-black rounded-md flex flex-col">
          <button
            onClick={handleNavigation}
            className="add-slots border border-black px-4 py-2 self-center mt-4 rounded-md hover:shadow-xl hover:-translate-x-1 hover:-translate-y-1"
          >
            Add Slots
          </button>
          <div className="meets self-center mt-4">Upcoming Meetings</div>
        </div>

        {/* Community Section */}
        <div className="community col-span-2 border border-black rounded-md h-60 flex flex-col">
          <h2 className="text-center mt-2 font-bold">Community</h2>
          <button
            className="add-slots border border-black px-4 py-2 mt-4 rounded-md hover:shadow-xl hover:-translate-x-1 hover:-translate-y-1 mx-auto"
          >
            Create a new Community
          </button>
        </div>

        {/* Workshops Section */}
        <div className="workshops col-span-2 border border-black rounded-md h-60 flex flex-col">
          <h2 className="text-center mt-2 font-bold">Workshops</h2>
          <button
            className="add-slots border border-black px-4 py-2 mt-4 rounded-md hover:shadow-xl hover:-translate-x-1 hover:-translate-y-1 mx-auto"
          >
            Conduct Workshop
          </button>
        </div>
      </div>
    </div>
  );
};

export default MentorDashboard;