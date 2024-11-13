import React, { useState } from 'react';
import axios from 'axios';
import TimePicker from 'react-time-picker';
import Navbar from '../../Components/Navbar/Navbar';
import 'react-time-picker/dist/TimePicker.css';

const MentorDashboard = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [slots, setSlots] = useState([]); // Store all added slots here
  const [selectedSlot, setSelectedSlot] = useState({ date: '', startTime: '', endTime: '' });
  const [error, setError] = useState('');

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const handleSlotChange = (e) => {
    const { name, value } = e.target;
    setSelectedSlot({ ...selectedSlot, [name]: value });
  };

  const handleAddSlot = () => {
    setSlots([...slots, selectedSlot]);
    setSelectedSlot({ date: '', startTime: '', endTime: '' }); // Reset slot input
  };

  const handleRemoveSlot = (index) => {
    setSlots(slots.filter((_, i) => i !== index));
  };

  const handleSaveSlots = async () => {
    try {
      const response = await axios.post('/api/slots/add', { mentorId: 'mentorIdHere', slots });
      if (response.data.success) {
        alert('Slots saved successfully');
        setSlots([]); // Clear slots after saving
        closeModal();
      } else {
        setError(response.data.message || 'Failed to save slots');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    }
  };

  return (
    <div className="mentor">
      <Navbar />

      <div className="grid grid-cols-4 mt-20 mx-12 gap-6">
        {/* Sidebar */}
        <div className="col-span-1 border border-black rounded-md px-2 py-16 mx-6">
          <img src="" alt="" className="mentor-img border border-black rounded-full h-32 w-32 mx-auto" />
          <h1 className="mentor-name mt-10 mx-auto text-center">Replace with name</h1>
        </div>

        {/* Stats Section */}
        <div className="stats col-span-2 border border-black rounded-md">Stats</div>

        {/* Meetings Section */}
        <div className="meetings col-span-1 border border-black rounded-md flex flex-col">
          <button 
            onClick={openModal} 
            className="add-slots border border-black px-4 py-2 self-center mt-4 rounded-md hover:shadow-xl hover:-translate-x-1 hover:-translate-y-1"
          >
            Add Slots
          </button>
          <div className="meets self-center mt-4">Upcoming Meetings</div>
        </div>

        {/* Community Section */}
        <div className="community col-span-2 border border-black rounded-md h-60 flex flex-col">
          Community
          <button className="add-slots border border-black px-4 py-2 mt-4 rounded-md hover:shadow-xl hover:-translate-x-1 hover:-translate-y-1 mx-auto">
            Create a new Community
          </button>
        </div>

        {/* Workshops Section */}
        <div className="workshops col-span-2 border border-black rounded-md h-60 flex flex-col">
          Workshops
          <button className="add-slots border border-black px-4 py-2 mt-4 rounded-md hover:shadow-xl hover:-translate-x-1 hover:-translate-y-1 mx-auto">
            Conduct Workshop
          </button>
        </div>
      </div>

      {/* Modal for Adding Slots */}
      {isModalOpen && (
        <div className="modal fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
          <div className="modal-content bg-white rounded-lg p-6 w-1/3">
            <h2 className="text-xl font-semibold mb-4">Add Free Slot</h2>
            
            <label className="block mb-2">
              Select Date:
              <input 
                type="date" 
                name="date" 
                value={selectedSlot.date} 
                onChange={handleSlotChange} 
                className="border rounded-md w-full mt-1 p-2"
              />
            </label>
            
            <label className="block mb-2">
              Start Time:
              <TimePicker
                onChange={(time) => setSelectedSlot({ ...selectedSlot, startTime: time })}
                value={selectedSlot.startTime}
                disableClock
                className="border rounded-md w-full mt-1 p-2"
                format="h:mm a"
              />
            </label>

            <label className="block mb-4">
              End Time:
              <TimePicker
                onChange={(time) => setSelectedSlot({ ...selectedSlot, endTime: time })}
                value={selectedSlot.endTime}
                disableClock
                className="border rounded-md w-full mt-1 p-2"
                format="h:mm a"
              />
            </label>

            <button 
              onClick={handleAddSlot} 
              className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 mb-4"
            >
              Add Slot
            </button>

            {/* Display Added Slots */}
            <h3 className="text-lg font-semibold mb-2">Review Slots:</h3>
            <ul className="mb-4">
              {slots.map((slot, index) => (
                <li key={index} className="flex justify-between items-center mb-2">
                  <span>{`${slot.date} | ${slot.startTime} - ${slot.endTime}`}</span>
                  <button 
                    onClick={() => handleRemoveSlot(index)} 
                    className="text-red-500 hover:underline"
                  >
                    Remove
                  </button>
                </li>
              ))}
            </ul>

            {error && <p className="text-red-500 mb-2">{error}</p>}

            <div className="flex justify-end space-x-4">
              <button 
                onClick={closeModal} 
                className="bg-gray-300 px-4 py-2 rounded-md hover:bg-gray-400"
              >
                Cancel
              </button>
              <button 
                onClick={handleSaveSlots} 
                className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
              >
                Save All Slots
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default MentorDashboard;