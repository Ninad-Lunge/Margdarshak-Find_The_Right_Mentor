import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../Components/Mentor/MentorNavbar';
import 'react-time-picker/dist/TimePicker.css';
import logo from '../../Assets/MentorHands.png';

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

  // Fetch mentor data from API if not in localStorage
  useEffect(() => {
    if (!mentorData) {
      fetch('/api/mentors/current') // Replace with your API endpoint
        .then(response => response.json())
        .then(data => {
          if (data.success) {
            setMentorData(data.mentor);
            localStorage.setItem('mentorData', JSON.stringify(data.mentor)); // Save to localStorage
          } else {
            console.error("Failed to fetch mentor data");
          }
        })
        .catch(error => console.error("Error fetching mentor data from API:", error));
    }
  }, [mentorData]);

  const handleNavigation = () => {
    navigate('/add-slots')
  }

  if (!mentorData) {
    return <div>Loading mentor data...</div>;
  }

  return (
    <div className="mentor min-h-screen bg-gray-50">
      <Navbar />
  
      <div className="grid grid-cols-1 lg:grid-cols-4 mt-6 mx-6 gap-6">
        {/* Sidebar */}
        <div className="col-span-1 bg-white shadow rounded-lg p-6">
          <img
            src={mentorData.profileImage || logo }
            alt="Mentor Profile"
            className="mentor-img border-2 border-gray-300 rounded-full h-32 w-32 mx-auto"
          />
          <h1 className="mt-4 text-center text-lg font-medium text-gray-800">
            {mentorData.firstName + " " + mentorData.lastName}
          </h1>
          <p className="text-center text-gray-600">Industry: Technology</p>
          <p className="text-center text-gray-600">Location: New York</p>
          <button className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 mx-auto block">
            Edit Profile
          </button>
        </div>

  {/* Stats Section */}
<div className="col-span-2 bg-white shadow rounded-lg p-8">
  {/* <h2 className="text-lg font-medium text-gray-800 mb-4">Your Stats</h2> */}

  {/* Row 1: Key Metrics */}
  <div className="grid grid-cols-3 gap-6 mb-6">
    <div className="text-center">
      <span className="text-2xl font-bold text-blue-500">120</span>
      <p className="text-gray-600">Communities Created</p>
    </div>  
    <div className="text-center">
      <span className="text-2xl font-bold text-blue-500">120</span>
      <p className="text-gray-600">Followers</p>
    </div>
    <div className="text-center">
      <span className="text-2xl font-bold text-blue-500">15</span>
      <p className="text-gray-600">Workshops Conducted</p>
    </div>
  
  </div>

{/* Row 2: Area of Expertise */}
<div className="mt-10">
  <div className="flex justify-between items-center mb-4">
    <h3 className="text-lg font-medium text-gray-800">Area of Expertise</h3>
    <button className="bg-blue-500 text-white px-2 py-1 rounded-lg hover:bg-blue-600">
      Add
    </button>
  </div>

  <div className="grid grid-cols-3 gap-4">
    <div className="bg-green-100 text-pink-800 font-medium text-sm rounded-md flex  justify-center h-5 mx-auto px-4">
      Web Development
    </div>
    <div className="bg-green-100 text-pink-800 font-medium text-sm rounded-md flex items-center justify-center h-5 mx-auto px-4">
      Artificial Intelligence
    </div>
    <div className="bg-green-100 text-pink-800 font-medium text-sm rounded-md flex items-center justify-center h-5 mx-auto px-4">
      Cloud Computing
    </div>
    <div className="bg-green-100 text-pink-800 font-medium text-sm rounded-md flex items-center justify-center h-5 mx-auto px-4">
      DevOps
    </div>
    <div className="bg-green-100 text-pink-800 font-medium text-sm rounded-md flex items-center justify-center h-5 mx-auto px-4">
      Machine Learning
    </div>
  </div>
</div>


</div>

  
        {/* Meetings Section */}
        <div className="col-span-1 bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-medium text-gray-800">Meetings</h2>
          <button
            onClick={handleNavigation}
            className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 w-full"
          >
            Add Availability
          </button>
          <h3 className="mt-6 text-gray-800 font-medium">Upcoming Meetings</h3>
          <ul className="mt-2 space-y-2">
            <li className="text-gray-600 text-sm">🌟 Career Guidance - 2 PM</li>
            <li className="text-gray-600 text-sm">🌟 Mock Interview - 4 PM</li>
          </ul>
        </div>
  
        {/* Community Section */}
        <div className="col-span-2 bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-medium text-gray-800 mb-4">Community</h2>
          <p className="text-gray-600 mb-4">
            Engage with like-minded professionals, share knowledge, and grow your network.
          </p>
          <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
            Create Community
          </button>
        </div>
  
        {/* Workshops Section */}
        <div className="col-span-2 bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-medium text-gray-800 mb-4">Workshops</h2>
          <p className="text-gray-600 mb-4">
            Share your expertise by conducting workshops for aspiring professionals.
          </p>
          <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
            Host Workshop
          </button>
        </div>
      </div>
    </div>
  );
  
}

export default MentorDashboard;