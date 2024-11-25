import Navbar from "../../Components/Mentee/MenteeNavbar";
import { useState, useEffect, useCallback } from "react";
import { useNavigate } from 'react-router-dom';
import axios from "axios";
import { toast } from "react-toastify";
import { 
  FaEnvelope, 
  FaLinkedin, 
  FaSpinner, 
  FaCalendarAlt, 
  FaUserFriends, 
  FaChartLine 
} from "react-icons/fa";

const MenteeDashBoard = () => {
  const [mentors, setMentors] = useState([]);
  const [upcomingSlots, setUpcomingSlots] = useState([]);
  const [followedMentors, setFollowedMentors] = useState([]);
  const [isLoadingSlots, setIsLoadingSlots] = useState(true);
  const [isLoadingMentors, setIsLoadingMentors] = useState(true);
  const [menteeData, setMenteeData] = useState();
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const menteeId = localStorage.getItem("menteeId");

  const handleChange = (mentorId) => {

    if (mentorId) {
      // localStorage.setItem('mentorId', mentorId);
      // console.log(mentorId);
      navigate(`/mentorProfile/${mentorId}`);
    } else {
      console.error('Slot or mentorId is undefined');
    }
  };

  const fetchMenteeData = useCallback(async () => {
    try {
      const response = await axios.get(`/api/mentee/${menteeId}`);
      setMenteeData(response.data.mentee);
      // console.log(response.data.mentee);
      localStorage.setItem("mentee", JSON.stringify(response.data.mentee));

    } catch (error) {
      console.error("Error fetching mentee:", error.response || error);
      setError(error.response?.data?.error || "Error fetching mentee");
      toast.error("Failed to fetch mentee data.");
    }
  }, [menteeId]);

  useEffect(() => {
    fetchMenteeData();
  }, [fetchMenteeData]);

  // Fetch Confirmed Slots
  const fetchMenteeConfirmedSlots = async () => {
    setError(null);
    setIsLoadingSlots(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("No authentication token found. Please log in.");
        return;
      }

      const response = await axios.get("/api/availability/mentee/confirmed", {
        headers: { Authorization: `Bearer ${token}` },
      });

      setUpcomingSlots(response.data || []);
    } catch (error) {
      console.error("Error fetching slots:", error.response || error);
      setError(error.response?.data?.error || "Failed to load confirmed slots");
      toast.error("Failed to fetch slots");
    } finally {
      setIsLoadingSlots(false);
    }
  };

  // Fetch Followed Mentors
  const fetchFollowedMentors = async () => {
    setIsLoadingMentors(true);
    try {
      //   const token = localStorage.getItem("token");
      const menteeId = localStorage.getItem("menteeId");
      const response = await axios.get(`/api/mentee/${menteeId}/followed-mentors`);

      setFollowedMentors(response.data.following || []);
    } catch (error) {
      console.error("Error fetching mentors:", error.response || error);
      toast.error("Failed to fetch followed mentors");
    } finally {
      setIsLoadingMentors(false);
    }
  };

  // Unfollow Mentor
  const unFollowMentor = async (mentorId) => {
    try {
      const token = localStorage.getItem("token");
      await axios.post(`/api/mentor/${mentorId}/follow`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setFollowedMentors(followedMentors.filter((mentor) => mentor._id !== mentorId));
      toast.info("Unfollowed mentor successfully");
    } catch (error) {
      console.error("Error unfollowing mentor:", error);
      toast.error("Failed to unfollow mentor");
    }
  };

  const fetchMentors = async () => {
    try {
      const mentee = JSON.parse(localStorage.getItem("mentee"));

      // console.log(menteeSkills);
      const response = await axios.post("/api/mentor/recommended-mentors", {
        skills: mentee.skills,
      });

      setMentors(response.data.mentors);
    } catch (error) {
      console.error('Error fetching recommended mentors', error);
    } finally {
      setIsLoadingMentors(false);
    }
  };

  useEffect(() => {
    fetchMentors();
    fetchMenteeConfirmedSlots();
    fetchFollowedMentors();
  }, []);

  return (
    <div className="menteeDashboard bg-gradient-to-br from-gray-50 to-indigo-50 min-h-screen">
      <Navbar />
      
      {/* Enhanced Header with Dashboard Insights */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-6 flex justify-between items-center">
          <h1 className="text-lg text-gray-800 flex items-center gap-3">
            <FaChartLine className="text-indigo-600" />
            {menteeData ? (
              <>
                Welcome, <span className="text-indigo-600">{menteeData.firstName}</span>
              </>
            ) : (
              "Mentee Dashboard"
            )}
          </h1>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 bg-indigo-50 px-3 py-2 rounded-lg">
              <FaUserFriends className="text-indigo-600" />
              <span className="text-sm font-medium text-gray-700">
                Followed Mentors: {followedMentors.length}
              </span>
            </div>
            <div className="flex items-center space-x-2 bg-purple-50 px-3 py-2 rounded-lg">
              <FaCalendarAlt className="text-purple-600" />
              <span className="text-sm font-medium text-gray-700">
                Upcoming Meetings: {upcomingSlots.length}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
        {/* Left Section: Upcoming Meetings */}
        <div className="md:col-span-2 space-y-6">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold text-gray-800 flex items-center gap-3">
                <FaCalendarAlt className="text-indigo-600" />
                Upcoming Meetings
              </h3>
              {upcomingSlots.length > 0 && (
                <a 
                  href="#" 
                  className="text-sm text-indigo-600 hover:underline"
                >
                  View All
                </a>
              )}
            </div>

            {isLoadingSlots ? (
              <div className="flex justify-center items-center h-40">
                <FaSpinner className="animate-spin text-indigo-600 text-3xl" />
              </div>
            ) : upcomingSlots.length === 0 ? (
              <div className="text-center text-gray-500 py-10">
                <p>No upcoming meetings scheduled</p>
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {upcomingSlots.map((slot) => (
                  <div 
                    key={slot._id} 
                    className="bg-white border border-gray-300 rounded-lg p-4 hover:shadow-md transition-all"
                  >
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="font-semibold text-gray-800">
                        {slot.mentorId?.firstName || "Mentor"} {slot.mentorId?.lastName || ""}
                      </h4>
                      {slot.meetLink && (
                        <a
                          href={slot.meetLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-indigo-600 hover:underline px-3 py-1 border border-blue-600 rounded-md"
                        >
                          Join
                        </a>
                      )}
                    </div>
                    <div className="text-sm text-gray-600">
                      <p>{slot.formattedDate || "N/A"}</p>
                      <p>{slot.startTime} - {slot.endTime}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Recommended Mentors Section */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold text-gray-800 flex items-center gap-3">
                <FaUserFriends className="text-purple-600" />
                Recommended Mentors
              </h3>
            </div>

            {isLoadingMentors ? (
              <div className="flex justify-center items-center h-40">
                <FaSpinner className="animate-spin text-purple-600 text-3xl" />
              </div>
            ) : mentors.length === 0 ? (
              <div className="text-center text-gray-500 py-10">
                <p>No recommended mentors found</p>
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 gap-4">
                {mentors.map((mentor) => (
                  <div 
                    key={mentor._id} 
                    className="bg-gradient-to-r from-purple-50 to-white border border-purple-100 rounded-lg p-4 hover:shadow-lg transition-all flex"
                  >
                    <img
                      src={mentor.image || '/default-avatar.png'}
                      alt={`${mentor.firstName} ${mentor.lastName}`}
                      className="w-20 h-20 rounded-full object-cover mr-4 border-2 border-purple-200"
                    />
                    <div className="flex-grow">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-semibold text-gray-800">
                            {mentor.firstName} {mentor.lastName}
                          </h4>
                          <p className="text-sm text-purple-600">{mentor.jobTitle}</p>
                        </div>
                        <button
                          onClick={() => handleChange(mentor._id)}
                          className="text-sm text-purple-600 border border-purple-300 px-2 py-1 rounded-md hover:bg-purple-50"
                        >
                          Profile
                        </button>
                      </div>
                      <div className="mt-2">
                        <p className="text-xs text-gray-600">
                          Skills: {mentor.Technologies?.slice(0, 3).join(', ') || 'N/A'}
                        </p>
                        <div className="flex space-x-2 mt-2">
                          <span className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded-full">
                            {mentor.yearofexperience} years
                          </span>
                          <span className="text-xs bg-indigo-100 text-indigo-800 px-2 py-1 rounded-full">
                            {mentor.followerCount} followers
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Section: Followed Mentors */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-3 mb-4">
            <FaUserFriends className="text-blue-600" />
            Followed Mentors
          </h2>

          {isLoadingMentors ? (
            <div className="flex justify-center items-center h-40">
              <FaSpinner className="animate-spin text-blue-600 text-3xl" />
            </div>
          ) : followedMentors.length === 0 ? (
            <div className="text-center text-gray-500 py-10">
              <p>You haven't followed any mentors yet</p>
            </div>
          ) : (
            <div className="space-y-4 max-h-[600px] overflow-y-auto">
              {followedMentors.map((mentor) => (
                <div 
                  key={mentor._id} 
                  className="bg-gray-50 rounded-lg p-4 flex justify-between items-center hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center space-x-4">
                    <img
                      src={mentor.image || "/default-avatar.png"}
                      onClick={() => handleChange(mentor._id)}
                      alt={`${mentor.firstName} ${mentor.lastName}`}
                      className="w-16 h-16 rounded-full object-cover border-2 border-blue-200 cursor-pointer"
                    />
                    <div>
                      <h3 
                        onClick={() => handleChange(mentor._id)} 
                        className="font-semibold text-gray-800 cursor-pointer hover:text-blue-600"
                      >
                        {mentor.firstName} {mentor.lastName}
                      </h3>
                      <p className="text-sm text-gray-600">{mentor.jobTitle}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <a
                      href={`mailto:${mentor.email}`}
                      className="text-blue-500 hover:text-blue-700"
                      title="Email"
                    >
                      <FaEnvelope />
                    </a>
                    {mentor.linkedin && (
                      <a
                        href={mentor.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500 hover:text-blue-700"
                        title="LinkedIn"
                      >
                        <FaLinkedin />
                      </a>
                    )}
                    <button
                      onClick={() => unFollowMentor(mentor._id)}
                      className="text-red-500 hover:text-red-700 text-sm border border-red-300 px-2 py-1 rounded-md hover:bg-red-50"
                    >
                      Unfollow
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MenteeDashBoard;