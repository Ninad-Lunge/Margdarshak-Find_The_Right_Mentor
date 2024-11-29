import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Mail, MapPin, Briefcase, Book, Calendar } from 'lucide-react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const MenteeProfileOverview = () => {
  const { menteeId } = useParams();
  const navigate = useNavigate();
  const [menteeData, setMenteeData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sessions, setSessions] = useState([]);

  useEffect(() => {
    fetchMenteeData();
    fetchMenteeSessions();
  }, [menteeId]);

  const fetchMenteeData = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`https://margdarshak-find-the-right-mentor.onrender.com/api/mentee/${menteeId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data.success) {
        setMenteeData(response.data.mentee);
      }
    } catch (err) {
      setError('Failed to fetch mentee data');
      toast.error('Error loading mentee profile');
    } finally {
      setLoading(false);
    }
  };

  const fetchMenteeSessions = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`https://margdarshak-find-the-right-mentor.onrender.com/api/availability/mentee-sessions/${menteeId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data.success) {
        setSessions(response.data.sessions);
      }
    } catch (err) {
      console.error('Error fetching sessions:', err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error || !menteeData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 mb-4">{error || 'Failed to load mentee profile'}</p>
          <button
            onClick={() => navigate(-1)}
            className="text-blue-500 hover:text-blue-700"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <ToastContainer />
      
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back
          </button>
          
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
            <img
              src={menteeData.image || `https://margdarshak-find-the-right-mentor.onrender.com/api/placeholder/128/128`}
              alt={`${menteeData.firstName} ${menteeData.lastName}`}
              className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-lg"
            />
            
            <div>
              <h1 className="text-2xl font-bold">
                {menteeData.firstName} {menteeData.lastName}
              </h1>
              
              <div className="flex flex-wrap gap-4 mt-3">
                {menteeData.email && (
                  <div className="flex items-center text-gray-600">
                    <Mail className="w-4 h-4 mr-2" />
                    {menteeData.email}
                  </div>
                )}
                {menteeData.location && (
                  <div className="flex items-center text-gray-600">
                    <MapPin className="w-4 h-4 mr-2" />
                    {menteeData.location}
                  </div>
                )}
                {menteeData.occupation && (
                  <div className="flex items-center text-gray-600">
                    <Briefcase className="w-4 h-4 mr-2" />
                    {menteeData.occupation}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="space-y-6">
            {/* About Section */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4">About</h2>
              <p className="text-gray-600">
                {menteeData.bio || 'No bio available'}
              </p>
            </div>

            {/* Skills Section */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4">Skills & Interests</h2>
              <div className="flex flex-wrap gap-2">
                {menteeData.skills?.map((skill, index) => (
                  <span
                    key={index}
                    className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm"
                  >
                    {skill}
                  </span>
                )) || <p className="text-gray-500">No skills listed</p>}
              </div>
            </div>

            {/* Education Section */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4">Education</h2>
              {menteeData.education?.map((edu, index) => (
                <div key={index} className="mb-4 last:mb-0">
                  <div className="flex items-start gap-3">
                    <Book className="w-5 h-5 text-gray-400 mt-1" />
                    <div>
                      <h3 className="font-medium">{edu.institution}</h3>
                      <p className="text-sm text-gray-600">{edu.degree}</p>
                      <p className="text-sm text-gray-500">{edu.year}</p>
                    </div>
                  </div>
                </div>
              )) || <p className="text-gray-500">No education details available</p>}
            </div>
          </div>

          {/* Right Column */}
          <div className="md:col-span-2">
            {/* Session History */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-6">Mentoring Sessions</h2>
              
              {sessions.length === 0 ? (
                <p className="text-gray-500 text-center py-8">
                  No mentoring sessions yet
                </p>
              ) : (
                <div className="space-y-6">
                  {sessions.map((session) => (
                    <div 
                      key={session._id}
                      className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="flex items-center gap-2 text-gray-600 mb-2">
                            <Calendar className="w-4 h-4" />
                            <span>
                              {new Date(session.date).toLocaleDateString()} at {session.startTime}
                            </span>
                          </div>
                          
                          {session.meetLink && (
                            <a
                              href={session.meetLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:text-blue-800 text-sm"
                            >
                              Meeting Link
                            </a>
                          )}
                        </div>
                        
                        <span 
                          className={`px-3 py-1 rounded-full text-sm ${
                            session.status === 'completed' 
                              ? 'bg-green-100 text-green-800'
                              : 'bg-blue-100 text-blue-800'
                          }`}
                        >
                          {session.status || 'scheduled'}
                        </span>
                      </div>
                      
                      {session.notes && (
                        <p className="mt-3 text-gray-600 text-sm">
                          {session.notes}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MenteeProfileOverview;