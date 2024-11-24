import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ToastContainer, toast, Slide } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Navbar from './MentorNavbar';
import { Calendar, Clock, Plus, Edit2, Trash2, X, Save, AlertCircle } from 'lucide-react';

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
  
      const selectedDate = new Date(date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
  
      if (selectedDate < today) {
        toast.error('Cannot add slots for past dates');
        return;
      }
  
      if (selectedDate.getTime() === today.getTime()) {
        const currentTime = new Date().toISOString().slice(11, 16);
        if (startTime < currentTime) {
          toast.error('Start time must be later than the current time');
          return;
        }
      }
  
      const token = localStorage.getItem('token');
      const response = await axios.post(
        '/api/availability/add',
        { date, startTime, endTime, status: 'available' },
        { headers: { Authorization: `Bearer ${token}` } }
      );
  
      if (response.data.success) {
        setAvailabilityList([...availabilityList, response.data.data]);
        toast.success('New Availability Added Successfully!');
        setDate('');
        setStartTime('');
        setEndTime('');
      }
    } catch (error) {
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
    try {
      const dateValue = slot.date ? new Date(slot.date) : null;
      setDate(dateValue && !isNaN(dateValue) ? dateValue.toISOString().slice(0, 10) : '');
    } catch (error) {
      setDate('');
      toast.error('Invalid date format');
    }
    setStartTime(slot.startTime || '');
    setEndTime(slot.endTime || '');
  };

  const handleSaveEdit = async () => {
    try {
      if (!date || !startTime || !endTime) {
        toast.error('Please fill in all fields');
        return;
      }
  
      const selectedDate = new Date(date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
  
      if (selectedDate < today) {
        toast.error('Cannot set slots for past dates');
        return;
      }
  
      if (selectedDate.getTime() === today.getTime()) {
        const currentTime = new Date().toISOString().slice(11, 16);
        if (startTime < currentTime) {
          toast.error('Start time must be later than the current time');
          return;
        }
      }
  
      const token = localStorage.getItem('token');
      const response = await axios.put(
        `/api/availability/${editingSlot._id}`,
        { date, startTime, endTime },
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
      return !isNaN(date) ? date.toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      }) : 'Invalid Date';
    } catch (error) {
      return 'Invalid Date';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <ToastContainer position="top-right" autoClose={3000} closeOnClick pauseOnHover transition={Slide} />

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 text-center">Availability Management</h1>
          <p className="mt-2 text-gray-600 text-center">Set and manage your mentoring schedule</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Add/Edit Form */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">
                {editingSlot ? 'Edit Time Slot' : 'Add New Time Slot'}
              </h2>
              {editingSlot && (
                <button
                  onClick={() => {
                    setEditingSlot(null);
                    setDate('');
                    setStartTime('');
                    setEndTime('');
                  }}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <X className="h-5 w-5" />
                </button>
              )}
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="pl-10 w-full border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Start Time</label>
                <div className="relative">
                  <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="time"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    className="pl-10 w-full border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">End Time</label>
                <div className="relative">
                  <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="time"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    className="pl-10 w-full border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              <button
                onClick={editingSlot ? handleSaveEdit : handleAdd}
                className="w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                {editingSlot ? (
                  <>
                    <Save className="h-5 w-5 mr-2" />
                    Save Changes
                  </>
                ) : (
                  <>
                    <Plus className="h-5 w-5 mr-2" />
                    Add Time Slot
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Availability List */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200">
              <div className="p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Available Time Slots</h2>
                
                {error && (
                  <div className="mb-4 flex items-center p-4 text-red-800 rounded-lg bg-red-50">
                    <AlertCircle className="h-5 w-5 mr-2" />
                    <p>{error}</p>
                  </div>
                )}

                <div className="space-y-4">
                  {availabilityList.length === 0 ? (
                    <div className="text-center py-12">
                      <Calendar className="mx-auto h-12 w-12 text-gray-400" />
                      <h3 className="mt-2 text-sm font-medium text-gray-900">No time slots</h3>
                      <p className="mt-1 text-sm text-gray-500">Get started by adding a new availability slot.</p>
                    </div>
                  ) : (
                    availabilityList.map((slot) => (
                      <div
                        key={slot._id}
                        className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors"
                      >
                        <div className="flex items-center space-x-4">
                          <Calendar className="h-5 w-5 text-gray-400" />
                          <div>
                            <p className="font-medium text-gray-900">{formatDate(slot.date)}</p>
                            <p className="text-sm text-gray-500">
                              {slot.startTime || 'N/A'} - {slot.endTime || 'N/A'}
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleEdit(slot)}
                            className="p-2 text-yellow-600 hover:bg-yellow-100 rounded-lg transition-colors"
                          >
                            <Edit2 className="h-5 w-5" />
                          </button>
                          <button
                            onClick={() => handleDelete(slot._id)}
                            className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                          >
                            <Trash2 className="h-5 w-5" />
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MentorAvailability;