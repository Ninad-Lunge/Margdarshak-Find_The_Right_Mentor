import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from '../../Components/Mentor/MentorNavbar';
import { ToastContainer, toast, Slide } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const MentorRequests = () => {
  const [bookedSlots, setBookedSlots] = useState([]);
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchBookedSlots();
  }, []);

  const openGoogleAuthPopup = () => {
    try {
      const width = 800;
      const height = 600;
      const left = window.innerWidth / 2 - width / 2;
      const top = window.innerHeight / 2 - height / 2;

      setIsAuthenticating(true);
      const authWindow = window.open(
        'http://localhost:5000/api/auth/google',
        'Google Auth',
        `width=${width},height=${height},top=${top},left=${left}`
      );

      window.addEventListener('message', async (event) => {
        if (event.origin !== 'http://localhost:5000') return;
        
        if (event.data.type === 'GOOGLE_AUTH_SUCCESS') {
          authWindow.close();
          localStorage.setItem('google_access_token', event.data.token);
          setIsAuthenticating(false);
          toast.success('Google authentication successful!');
          if (localStorage.getItem('pending_slot')) {
            const slot = JSON.parse(localStorage.getItem('pending_slot'));
            localStorage.removeItem('pending_slot');
            acceptRequest(slot);
          }
        }
      });
    } catch (err) {
      setError(err.message);
      toast.error('Failed to open authentication window');
      setIsAuthenticating(false);
    }
  };

  const fetchBookedSlots = async () => {
    try {
      setError(null);
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No token found, please log in.');
      }

      const response = await axios.get('http://localhost:5000/api/availability/booked', {
        headers: { Authorization: `Bearer ${token}` },
      });

      setBookedSlots(response.data);
    } catch (err) {
      setError(err.message);
      toast.error('Failed to load booked slots');
      console.error('Error fetching booked slots:', err);
    }
  };

  const updateSlotStatus = async (slotId, status, meetLink = null) => {
    const token = localStorage.getItem('token');
    const updateData = { status };
    if (meetLink) updateData.meetLink = meetLink;
    
    await axios.put(
      `http://localhost:5000/api/availability/${slotId}/status`,
      updateData,
      { headers: { Authorization: `Bearer ${token}` }}
    );
    
    // Remove the slot from local state
    setBookedSlots(prev => prev.filter(slot => slot._id !== slotId));
  };

  const acceptRequest = async (slot) => {
    try {
      setError(null);
      setIsProcessing(true);
      
      const token = localStorage.getItem('google_access_token');
      if (!token) {
        localStorage.setItem('pending_slot', JSON.stringify(slot));
        openGoogleAuthPopup();
        return;
      }

      const formattedDate = new Date(slot.date).toISOString();
      const meetingData = {
        date: formattedDate,
        startTime: slot.startTime,
        endTime: slot.endTime,
        mentorName: slot.mentorId?.firstName || 'Unknown Mentor',
        menteeName: slot.menteeId?.firstName || 'Unknown Mentee',
        emails: [
          slot.menteeId?.email || '',
          slot.mentorId?.email || ''
        ].filter(email => email)
      };

      const response = await axios.post(
        'http://localhost:5000/api/auth/schedule-meet',
        meetingData,
        {
          headers: { 
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data.meetLink) {
        await updateSlotStatus(slot._id, 'confirmed', response.data.meetLink);
        toast.success('Meeting scheduled and request accepted!');
      }
    } catch (err) {
      setError(err.message);
      if (err.response?.status === 401) {
        localStorage.removeItem('google_access_token');
        localStorage.setItem('pending_slot', JSON.stringify(slot));
        openGoogleAuthPopup();
      } else {
        toast.error('Failed to schedule meeting: ' + (err.response?.data?.message || err.message));
      }
    } finally {
      setIsProcessing(false);
    }
  };

  const rejectRequest = async (slot) => {
    try {
      setIsProcessing(true);
      await updateSlotStatus(slot._id, 'rejected');
      toast.info('Request rejected successfully');
    } catch (err) {
      setError(err.message);
      toast.error('Failed to reject request: ' + err.message);
    } finally {
      setIsProcessing(false);
    }
  };

  const formatTime = (time) => {
    try {
      const date = new Date(`1970-01-01T${time}Z`);
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch (err) {
      console.error('Error formatting time:', err);
      return time;
    }
  };

  return (
    <>
      <Navbar />
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        closeOnClick
        pauseOnHover
        draggable
        transition={Slide}
        className="mt-14"
      />

      <div className="container mx-auto px-10 mt-4">
        <h2 className="text-2xl font-semibold text-center mb-4 text-[#3B50D5]">
          Mentee's Request
        </h2>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 relative">
            <span className="absolute top-0 bottom-0 right-0 px-4 py-3">
              <button onClick={() => setError(null)}>×</button>
            </span>
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {bookedSlots.length > 0 ? (
            bookedSlots.map((slot) => (
              <div 
                key={slot._id} 
                className="bg-white p-4 rounded shadow-md space-y-4 transition-all duration-300 hover:shadow-lg"
              >
                <p><strong>Date:</strong> {new Date(slot.date).toLocaleDateString()}</p>
                <p><strong>Time:</strong> {formatTime(slot.startTime)} - {formatTime(slot.endTime)}</p>

                <div>
                  <p>
                    <strong>Mentee Name:</strong> 
                    {slot.menteeId?.firstName || 'Not Specified'}
                  </p>
                  <p>
                    <strong>Mentee Expertise:</strong> 
                    {slot.menteeId?.expertise || 'Not specified'}
                  </p>
                </div>

                <div className="flex justify-end space-x-2">
                  <button
                    className={`px-4 py-2 rounded transition-colors duration-200 ${
                      isProcessing || isAuthenticating
                        ? 'bg-gray-400 cursor-not-allowed'
                        : 'bg-blue-500 hover:bg-blue-600 text-white'
                    }`}
                    onClick={() => acceptRequest(slot)}
                    disabled={isProcessing || isAuthenticating}
                  >
                    {isAuthenticating ? 'Authenticating...' : 
                     isProcessing ? 'Processing...' : 'Accept'}
                  </button>
                  <button 
                    className={`px-4 py-2 rounded transition-colors duration-200 ${
                      isProcessing
                        ? 'bg-gray-400 cursor-not-allowed'
                        : 'bg-red-500 hover:bg-red-600 text-white'
                    }`}
                    onClick={() => rejectRequest(slot)}
                    disabled={isProcessing}
                  >
                    {isProcessing ? 'Processing...' : 'Reject'}
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-10">
              <p className="text-gray-500 text-lg">No pending requests available.</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default MentorRequests;