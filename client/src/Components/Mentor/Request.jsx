import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ToastContainer, toast, Slide } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { CalendarDays, Clock, UserCircle, Briefcase, CheckCircle, XCircle, Loader2 } from 'lucide-react';
import Navbar from './MentorNavbar';

const MentorRequests = () => {
  const [bookedSlots, setBookedSlots] = useState([]);
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

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
        'http://localhost:5000https://margdarshak-find-the-right-mentor.onrender.com/api/auth/google',
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
      setIsLoading(true);
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No token found, please log in.');
      }

      const response = await axios.get('http://localhost:5000https://margdarshak-find-the-right-mentor.onrender.com/api/availability/booked', {
        headers: { Authorization: `Bearer ${token}` },
      });

      setBookedSlots(response.data);
    } catch (err) {
      setError(err.message);
      toast.error('Failed to load booked slots');
    } finally {
      setIsLoading(false);
    }
  };

  const updateSlotStatus = async (slotId, status, meetLink = null) => {
    const token = localStorage.getItem('token');
    const updateData = { status };
    if (meetLink) updateData.meetLink = meetLink;

    await axios.put(
      `http://localhost:5000https://margdarshak-find-the-right-mentor.onrender.com/api/availability/${slotId}/status`,
      updateData,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    
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
        'http://localhost:5000https://margdarshak-find-the-right-mentor.onrender.com/api/auth/schedule-meet',
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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex items-center space-x-2 text-blue-600">
          <Loader2 className="animate-spin" />
          <span className="text-lg">Loading requests...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      <Navbar />
      <ToastContainer position="top-right" autoClose={3000} transition={Slide} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Mentee Requests</h1>
          <p className="mt-2 text-gray-600">Manage your pending mentorship session requests</p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-800">{error}</p>
          </div>
        )}

        {bookedSlots.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm text-center py-12">
            <div className="flex flex-col items-center space-y-4">
              <CalendarDays className="h-12 w-12 text-gray-400" />
              <div className="space-y-2">
                <h3 className="text-lg font-medium text-gray-900">No Pending Requests</h3>
                <p className="text-gray-500">You don't have any pending mentorship requests at the moment.</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {bookedSlots.map((slot) => (
              <div key={slot._id} className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-lg transition-shadow duration-300">
                <div className="p-6">
                  <div className="space-y-6">
                    {/* Date and Time Section */}
                    <div className="space-y-3">
                      <div className="flex items-center space-x-3 text-gray-600">
                        <CalendarDays className="h-5 w-5" />
                        <span>{new Date(slot.date).toLocaleDateString('en-US', {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}</span>
                      </div>
                      <div className="flex items-center space-x-3 text-gray-600">
                        <Clock className="h-5 w-5" />
                        <span>{formatTime(slot.startTime)} - {formatTime(slot.endTime)}</span>
                      </div>
                    </div>

                    {/* Mentee Details Section */}
                    <div className="space-y-3 border-t pt-4">
                      <div className="flex items-center space-x-3">
                        <UserCircle className="h-5 w-5 text-blue-500" />
                        <span className="font-medium">{slot.menteeId?.firstName || 'Not Specified'}</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Briefcase className="h-5 w-5 text-blue-500" />
                        <span>{slot.menteeId?.expertise || 'Not specified'}</span>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex space-x-3 pt-4 border-t">
                      <button
                        onClick={() => acceptRequest(slot)}
                        disabled={isProcessing || isAuthenticating}
                        className={`flex-1 flex items-center justify-center space-x-2 px-4 py-2 rounded-lg text-white transition-colors duration-200 
                          ${isProcessing || isAuthenticating ? 
                            'bg-gray-400 cursor-not-allowed' : 
                            'bg-green-500 hover:bg-green-600'}`}
                      >
                        {isAuthenticating || isProcessing ? (
                          <Loader2 className="animate-spin h-5 w-5" />
                        ) : (
                          <CheckCircle className="h-5 w-5" />
                        )}
                        <span>{isAuthenticating ? 'Authenticating' : 
                               isProcessing ? 'Processing' : 'Accept'}</span>
                      </button>
                      
                      <button
                        onClick={() => rejectRequest(slot)}
                        disabled={isProcessing}
                        className={`flex-1 flex items-center justify-center space-x-2 px-4 py-2 rounded-lg text-white transition-colors duration-200 
                          ${isProcessing ? 
                            'bg-gray-400 cursor-not-allowed' : 
                            'bg-red-500 hover:bg-red-600'}`}
                      >
                        {isProcessing ? (
                          <Loader2 className="animate-spin h-5 w-5" />
                        ) : (
                          <XCircle className="h-5 w-5" />
                        )}
                        <span>{isProcessing ? 'Processing' : 'Reject'}</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MentorRequests;