import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ToastContainer, toast, Slide } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const MentorAvailability = () => {
  const [date, setDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [availabilityList, setAvailabilityList] = useState([]);
  const [error,] = useState(null);
  const [editingSlot, setEditingSlot] = useState(null);

  const fetchAvailability = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('/api/availability/mentorslot', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAvailabilityList(response.data);
    } catch (error) {
      toast.error('Failed to fetch availability');
    }
  };

  useEffect(() => {
    fetchAvailability();
  }, []);

  const handleAdd = async () => {
    try {
      if (!date || !startTime || !endTime) {
        toast.error('Please fill in all fields');
        return;
      }
  
      if (new Date(date) < new Date().setHours(0, 0, 0, 0)) {
        toast.error('Cannot add slots for past dates');
        return;
      }
  
      const token = localStorage.getItem('token');
      const response = await axios.post(
        '/api/availability/add',
        { 
          date,  // Send the date directly
          startTime, 
          endTime,
          status: 'available' // Explicitly set status
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      if (response.data.success) {
        setAvailabilityList([...availabilityList, response.data.data]);
        toast.success('New Availability Added Successfully!');
        
        // Clear form
        setDate('');
        setStartTime('');
        setEndTime('');
      }
    } catch (error) {
      console.error('Add availability error:', error.response || error);
      toast.error(error.response?.data?.error || 'Failed to add availability');
    }
  };

  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`/api/availability/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAvailabilityList(availabilityList.filter((slot) => slot._id !== id));
      toast.success('Availability Deleted Successfully!');
    } catch (error) {
      toast.error('Failed to delete slot');
    }
  };

  const handleEdit = (slot) => {
    if (!slot) {
      toast.error('Invalid slot data');
      return;
    }

    setEditingSlot(slot);
    
    // Handle the date carefully
    try {
      // Check if date exists and is in a valid format
      const dateValue = slot.date ? new Date(slot.date) : null;
      setDate(dateValue && !isNaN(dateValue) ? dateValue.toISOString().slice(0, 10) : '');
    } catch (error) {
      setDate('');
      toast.error('Invalid date format');
    }

    // Set time values if they exist, otherwise set empty strings
    setStartTime(slot.startTime || '');
    setEndTime(slot.endTime || '');
  };

  const handleSaveEdit = async () => {
    try {
      if (!date || !startTime || !endTime) {
        toast.error('Please fill in all fields');
        return;
      }

      if (!editingSlot?._id) {
        toast.error('Invalid slot data');
        return;
      }

      const formattedDate = new Date(date).toISOString().slice(0, 10);
  
      const token = localStorage.getItem('token');
      const response = await axios.put(
        `/api/availability/${editingSlot._id}`,
        { date: formattedDate, startTime, endTime },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const updatedSlot = response.data;
      setAvailabilityList(availabilityList.map(slot =>
        slot._id === updatedSlot._id ? updatedSlot : slot
      ));
      toast.success('Availability Edited Successfully!');
  
      setEditingSlot(null);
      setDate('');
      setStartTime('');
      setEndTime('');
    } catch (error) {
      toast.error('Failed to update slot');
    }
  };

  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return !isNaN(date) ? date.toLocaleDateString() : 'Invalid Date';
    } catch (error) {
      return 'Invalid Date';
    }
  };

  return (
    <>
      <div className="mt-4 container mx-auto">
        <ToastContainer position="top-right" autoClose={3000} closeOnClick pauseOnHover transition={Slide} />

        <h2 className="text-2xl font-semibold mb-6 text-center text-blue-600">Manage Your Availability</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 py-5">
          {/* Add/Edit Slot Section */}
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h3 className="text-xl font-semibold mb-6 text-center text-gray-700">
              {editingSlot ? 'Edit Slot' : 'Add New Slot'}
            </h3>
            <div className="flex flex-col space-y-2">
              <label className="font-medium text-gray-600">Date</label>
              <input 
                type="date" 
                value={date} 
                onChange={(e) => setDate(e.target.value)} 
                className="border rounded p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-400" 
                required
              />

              <label className="font-medium text-gray-600">Start Time</label>
              <input 
                type="time" 
                value={startTime} 
                onChange={(e) => setStartTime(e.target.value)} 
                className="border rounded p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-400" 
                required
              />

              <label className="font-medium text-gray-600">End Time</label>
              <input 
                type="time" 
                value={endTime} 
                onChange={(e) => setEndTime(e.target.value)} 
                className="border rounded p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-400" 
                required
              />

              <div className="flex gap-4">
                <button 
                  onClick={editingSlot ? handleSaveEdit : handleAdd} 
                  className="bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition duration-300 mt-6 flex-1"
                >
                  {editingSlot ? "Save Changes" : "Add Slot"}
                </button>
                {editingSlot && (
                  <button 
                    onClick={() => {
                      setEditingSlot(null);
                      setDate('');
                      setStartTime('');
                      setEndTime('');
                    }} 
                    className="bg-gray-500 text-white py-3 rounded-lg hover:bg-gray-600 transition duration-300 mt-6 flex-1"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Availability List Section */}
          <div className="bg-white p-6 rounded-lg shadow-lg col-span-2">
            <h3 className="text-xl font-semibold mb-6 text-center text-gray-700">Your Availability</h3>
            {error && <p className="text-red-500">{error}</p>}
            <ul className="space-y-4">
              {availabilityList.map((slot) => (
                <li key={slot._id} className="flex justify-between items-center p-4 bg-gray-100 rounded-lg shadow hover:bg-gray-200 transition">
                  <div>
                    <span className="text-gray-700">Date: {formatDate(slot.date)}</span>
                    <span className="ml-2 text-gray-600">| Time: {slot.startTime || 'N/A'} - {slot.endTime || 'N/A'}</span>
                  </div>
                  <div>
                    <button 
                      onClick={() => handleEdit(slot)} 
                      className="bg-yellow-400 text-white px-4 py-2 rounded-md hover:bg-yellow-500 transition duration-300"
                    >
                      Edit
                    </button>
                    <button 
                      onClick={() => handleDelete(slot._id)} 
                      className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition duration-300 ml-2"
                    >
                      Delete
                    </button>
                  </div>
                </li>
              ))}
              {availabilityList.length === 0 && (
                <p className="text-center text-gray-500">No availability slots found</p>
              )}
            </ul>
          </div>
        </div>
      </div>
    </>
  );
};

export default MentorAvailability;