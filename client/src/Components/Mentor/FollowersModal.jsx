import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { X } from 'lucide-react';
import axios from 'axios';

const FollowersModal = ({ isOpen, onClose, mentorId }) => {
  const [followers, setFollowers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const fetchFollowers = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.get(`/api/mentor/${mentorId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data.success && response.data.mentor.followers) {
        // Fetch detailed information for each follower
        const followersDetails = await Promise.all(
          response.data.mentor.followers.map(async (followerId) => {
            const menteeResponse = await axios.get(`/api/mentee/${followerId}`, {
              headers: { Authorization: `Bearer ${token}` }
            });
            return menteeResponse.data.mentee;
          })
        );
        setFollowers(followersDetails);
      }
    } catch (err) {
      setError('Failed to fetch followers');
      console.error('Error fetching followers:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen && mentorId) {
      fetchFollowers();
    }
  }, [isOpen, mentorId]);

  const handleProfileClick = (menteeId) => {
    navigate(`/mentee-profile/${menteeId}`);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg w-full max-w-md">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Followers</h2>
            <button 
              onClick={onClose}
              className="p-1 hover:bg-gray-100 rounded-full"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="max-h-72 overflow-y-auto">
            {loading && (
              <div className="flex justify-center py-4">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
              </div>
            )}

            {error && (
              <div className="text-red-500 text-center py-4">
                {error}
              </div>
            )}

            {!loading && !error && followers.length === 0 && (
              <div className="text-gray-500 text-center py-4">
                No followers yet
              </div>
            )}

            {!loading && !error && followers.map((follower, index) => (
              <div key={follower._id} className="py-3">
                <div 
                  className="flex items-center gap-4 cursor-pointer hover:bg-gray-50 p-2 rounded-lg transition-colors"
                  onClick={() => handleProfileClick(follower._id)}
                >
                  <img
                    src={follower.image || `/api/placeholder/40/40`}
                    alt={`${follower.firstName} ${follower.lastName}`}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div>
                    <p className="font-medium">
                      {follower.firstName} {follower.lastName}
                    </p>
                    <p className="text-sm text-gray-500">
                      {follower.occupation || 'Mentee'}
                    </p>
                  </div>
                </div>
                {index < followers.length - 1 && (
                  <div className="h-px bg-gray-200 mt-3"></div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FollowersModal;