import React, { useState, useEffect } from 'react';
import axios from 'axios';
// import Navbar from './MeNavbar';

import { ToastContainer, toast, Slide } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// const backendUrl = process.env.REACT_APP_API_URL;

const MenteeBooking = () => {
  const [availableSlots, setAvailableSlots] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchAvailableSlots();
  }, []);

  // Function to fetch all slots for the mentor
  const fetchAvailableSlots = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No token found, please log in.');
      }

      // Fetch all the slots from the backend
      const response = await axios.get('/api/availability/mentor', {
        headers: { Authorization: token },
      });

      // Set the fetched slots to state
      if (response.status === 200) {
        console.log(response);
        setAvailableSlots(response.data);
      } else {
        throw new Error('Failed to fetch available slots');
      }
    } catch (error) {
      setError('Failed to load available slots');
      console.error('Error fetching available slots:', error);
    }
  };

  // Function to book a slot
  const bookSlot = async (slotId) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No token found, please log in.');
      }

      // Send request to book the slot
      await axios.post('/api/availability/book',
        { slotId },
        {
        headers: { Authorization: token },
      });

      // Refresh the available slots
      fetchAvailableSlots();
      toast.success('Slot Booked Successfully');

    } catch (error) {
      toast.error('Failed to book slot');
      console.error('Error booking slot:', error);
    }
  };

  return (
    <>
    {/* <Navbar/> */}
    <ToastContainer
      position="top-right"
      autoClose={3000}           // Auto close after 3 seconds
      hideProgressBar={false}     // Show or hide the progress bar
      closeOnClick                // Close on click
      pauseOnHover                // Pause on hover
      draggable   
      transition={Slide}  
      className="mt-14"               
    />
    <div className="py-20">
      <h1 className="text-3xl font-semibold text-center mb-6">Available Slots for Mentoring</h1>
      {error && <p className="text-red-500 text-center mb-4">{error}</p>}

      {/* Grid layout for available slots */}
      <div className="grid grid-cols-1 sm:grid-cols-2 p-5 lg:grid-cols-3 gap-6">
      {availableSlots.length > 0 ? (
  availableSlots.map((slot) => (
    <div
      key={slot._id}
      className="p-4 bg-white shadow-lg rounded-lg border border-gray-200"
    >
      <div className="mb-4">
        <p className="text-lg font-semibold">
          Mentor: {(slot.mentorId && slot.mentorId.firstName) ? slot.mentorId.firstName : 'Not Specified'}
        </p>
        <p className="text-gray-600">
          Expertise: {(slot.mentorId && slot.mentorId.expertise) || 'Not specified'}
        </p>
      </div>
      <div className="mb-4">
        <p className="font-medium">Date: {new Date(slot.date).toLocaleDateString()}</p>
        <p className="font-medium">Time: {slot.time}</p>
      </div>

      {/* Display button if slot is available for booking */}
      {slot.menteeId ? (
        <p className="text-gray-500"><strong>Booked by:</strong> {slot.menteeId.username}</p>
              ) : (
                <button
                  onClick={() => bookSlot(slot._id)}
                  className="w-full bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
                >
                  Book Slot
                </button>
              )}
            </div>
          ))
        ) : (
          <p className="col-span-full text-center text-xl">No available slots</p>
        )}
      </div>
    </div>
    </>
  );
};

export default MenteeBooking;