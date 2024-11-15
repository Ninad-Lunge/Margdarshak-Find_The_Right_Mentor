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
        headers: { Authorization: token },
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
      const token = localStorage.getItem('token');
      const response = await axios.post(
        '/api/availability/add',
        { date, startTime, endTime },
        { headers: { Authorization: token } }
      );
      setAvailabilityList([...availabilityList, response.data]);
      toast.success('New Availability Added Successfully!');

      setDate('');
      setStartTime('');
      setEndTime('');
    } catch (error) {
      toast.error('Failed to add availability');
    }
  };

  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`/api/availability/${id}`, {
        headers: { Authorization: token },
      });
      setAvailabilityList(availabilityList.filter((slot) => slot._id !== id));
      toast.success('Availability Deleted Successfully!');
    } catch (error) {
      toast.error('Failed to delete slot');
    }
  };

  const handleEdit = (slot) => {
    setEditingSlot(slot);
    setDate(slot.date.slice(0, 10));
    setStartTime(slot.startTime);
    setEndTime(slot.endTime);
  };

  const handleSaveEdit = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(
        `/api/availability/${editingSlot._id}`,
        { date, startTime, endTime },
        { headers: { Authorization: token } }
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

  return (
    <>
      <div className="mt-4 container mx-auto">
        <ToastContainer position="top-right" autoClose={3000} closeOnClick pauseOnHover transition={Slide} />

        <h2 className="text-2xl font-semibold mb-4 text-center text-[#3B50D5]">Manage Your Availability</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 p-5 gap-8">
          <div className="bg-white p-6 rounded shadow w-full max-w-md mx-auto">
            <h3 className="text-xl font-semibold mb-6 text-center">Add or Edit Slot</h3>
            <div className="flex flex-col space-y-4">
              <label>Date</label>
              <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="border rounded p-2 w-full" />

              <label>Start Time</label>
              <input type="time" value={startTime} onChange={(e) => setStartTime(e.target.value)} className="border rounded p-2 w-full" />

              <label>End Time</label>
              <input type="time" value={endTime} onChange={(e) => setEndTime(e.target.value)} className="border rounded p-2 w-full" />

              <button onClick={editingSlot ? handleSaveEdit : handleAdd} className="bg-blue-500 text-white px-6 py-2 rounded mt-4">
                {editingSlot ? "Save Changes" : "Add Slot"}
              </button>
            </div>
          </div>

          <div className="bg-white p-4 rounded shadow">
            <h3 className="text-xl font-semibold mb-6 text-center">Your Availability</h3>
            {error && <p className="text-red-500">{error}</p>}
            <ul className="space-y-2">
              {availabilityList.map((slot) => (
                <li key={slot._id} className="flex justify-between items-center bg-gray-100 p-2 rounded">
                  <div>
                    <span>Date: {new Date(slot.date).toLocaleDateString()}</span>
                    <span> | Time: {slot.startTime} - {slot.endTime}</span>
                  </div>
                  <div className="flex space-x-2">
                    <button onClick={() => handleEdit(slot)} className="bg-yellow-500 px-2 py-1 text-white rounded">Edit</button>
                    <button onClick={() => handleDelete(slot._id)} className="bg-red-500 px-2 py-1 text-white rounded">Delete</button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </>
  );
};

export default MentorAvailability;