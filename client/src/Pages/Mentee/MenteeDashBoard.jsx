import Navbar from "../../Components/Mentee/MenteeNavbar";
import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { FaSpinner } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const MenteeDashBoard = () => {
  const [upcomingSlots, setUpcomingSlots] = useState([]);
  const [followedMentors, setFollowedMentors] = useState([]);
  const [isLoadingSlots, setIsLoadingSlots] = useState(true);
  const [isLoadingMentors, setIsLoadingMentors] = useState(true);
  const [menteeData, setMenteeData] = useState();
  const [error, setError] = useState(null);

  const menteeId = localStorage.getItem("menteeId");

  const fetchMenteeData = useCallback(async () => {
    try {
      const response = await axios.get(`/api/mentee/${menteeId}`);
      setMenteeData(response.data.mentee);
      console.log(response.data.mentee);
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

  useEffect(() => {
    fetchMenteeConfirmedSlots();
    fetchFollowedMentors();
  }, []);

  const navigate = useNavigate();

  return (
    <div className="menteeDashboard bg-gray-50 min-h-screen">
      <Navbar />
      <h1 className="text-lg font-semibold mt-4 mx-4">{menteeData ? `Hello, ${menteeData.firstName} !` : "Hello, Mentee (Loading...)"}</h1>

      <div className="grid grid-cols-3 mx-1 md:mx-4 gap-4 mt-4">
        {/* Left Section */}
        <div className="col-span-2 space-y-4">
          {/* Upcoming Meetings */}
          <div className="upcoming-meetings shadow rounded-md bg-white p-4 h-full">
            <h3 className="text-gray-800 font-medium mb-2">Upcoming Meetings</h3>
            {isLoadingSlots && (
              <div className="flex justify-center items-center h-32">
                <FaSpinner className="animate-spin text-gray-500 text-2xl" />
              </div>
            )}
            {error && <p className="text-red-500 mt-2">{error}</p>}
            {!isLoadingSlots && upcomingSlots.length === 0 && (
              <p className="text-gray-500">No upcoming meetings scheduled</p>
            )}
            <div className="grid grid-cols-3 gap-2">
              {upcomingSlots.map((slot) => (
                <div
                  key={slot._id}
                  className="p-4 border rounded-lg shadow-sm hover:shadow-md"
                >
                  <h4 className="font-medium">
                    Mentor: {slot.mentorId?.firstName || "N/A"} {slot.mentorId?.lastName || ""}
                  </h4>
                  <p>Date: {slot.formattedDate || "N/A"}</p>
                  <p>Time: {slot.startTime} - {slot.endTime}</p>
                  {slot.meetLink ? (
                    <a
                      href={slot.meetLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 underline"
                    >
                      Join Meeting
                    </a>
                  ) : (
                    <p className="text-gray-500">No meeting link yet</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Section: Followed Mentors */}
        <div className="notifications col-span-1 shadow rounded-md bg-white p-4">
          <h2 className="text-gray-800 font-medium mb-4">Followed Mentors</h2>
          {isLoadingMentors && (
            <div className="flex justify-center items-center">
              <FaSpinner className="animate-spin text-blue-500 text-2xl" />
              <p className="ml-2 text-gray-600">Loading mentors...</p>
            </div>
          )}
          {!isLoadingMentors && followedMentors.length === 0 && (
            <p className="text-gray-600">You are not following any mentors yet.</p>
          )}
          <div className="grid grid-cols-1 gap-4">
          {!isLoadingMentors &&
            followedMentors.map((mentor) => (
              <div
                key={mentor._id}
                className="border rounded-lg p-4 shadow-md bg-white hover:shadow-lg transition-shadow duration-300 cursor-pointer grid grid-cols-3"
                onClick={() => navigate(`/mentorProfile/${mentor._id}`)}
              >
                <div className="flex items-center space-x-4 col-span-2">
                  <img
                    src={mentor.image || "/default-avatar.png"}
                    alt={`${mentor.firstName} ${mentor.lastName}`}
                    className="w-16 h-16 rounded-full object-cover border-2 border-blue-100"
                  />
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800">
                      {mentor.firstName} {mentor.lastName}
                    </h3>
                    <p className="text-gray-600 text-sm">{mentor.jobTitle}</p>
                  </div>
                </div>

                <div className="flex mt-8 place-content-end">
                  <button
                      onClick={(e) => {
                        e.stopPropagation();
                        unFollowMentor(mentor._id);
                      }}
                      className="text-red-500 border border-red-500 px-2 py-1 rounded-md hover:bg-red-50 transition-colors"
                    >
                      Unfollow
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MenteeDashBoard;