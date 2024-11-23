import Navbar from "../../Components/Mentee/MenteeNavbar";
import { useState, useEffect, useCallback } from "react";
import { useNavigate } from 'react-router-dom';

import axios from "axios";
import { toast } from "react-toastify";
import { FaEnvelope, FaLinkedin, FaSpinner } from "react-icons/fa";

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
  // const mentorId = localStorage.getItem("mentorId");

  const handleChange = (mentorId) => {

    if (mentorId) {
      localStorage.setItem('mentorId', mentorId);
      // console.log(mentorId);
      navigate('/mentorprofilebymentee');
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
    <div className="menteeDashboard bg-gray-50 min-h-screen">
      <Navbar />
      <h1 className="text-lg font-semibold mt-4 mx-4">{menteeData ? `Hello, ${menteeData.firstName} !` : "Hello, Mentee (Loading...)"}</h1>

      <div className="grid grid-cols-3 mx-1 md:mx-4 gap-4 mt-4">
        {/* Left Section */}
        <div className="col-span-2 space-y-2">
          {/* Upcoming Meetings */}
          <div className="upcoming-meetings shadow rounded-md bg-white p-4 ">
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


          {/* Recommended Mentors */}

          <div className="recommended-mentors shadow-lg rounded-xl bg-gradient-to-r from-purple-500 to-indigo-500 p-6 mt-6 text-white">
            <h3 className="text-xl font-bold mb-4 text-white">Recommended Mentors</h3>

            {isLoadingMentors ? (
              <div className="flex justify-center items-center">
                <FaSpinner className="animate-spin text-white text-3xl" />
                <p className="ml-2 text-white">Loading mentors...</p>
              </div>
            ) : mentors.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {mentors.map((mentor) => (
                  <div
                    key={mentor._id}
                    className="bg-white text-gray-800 p-4 rounded-lg shadow-md hover:shadow-xl transition-all hover:scale-105 flex items-center space-x-4"
                  >
                    {/* Mentor Image */}
                    <img
                      src={mentor.image || '/default-avatar.png'}
                      alt={`${mentor.firstName} ${mentor.lastName}`}
                      className="w-16 h-16 rounded-full object-cover border-2 border-purple-500"
                    />

                    {/* Mentor Details */}
                    <div className="flex-grow">
                      {/* Name and View Profile Button */}
                      <div className="flex justify-between items-center">
                        <h4 className="font-semibold text-lg text-gray-800">
                          {mentor.firstName} {mentor.lastName}
                        </h4>
                        <button
                          onClick={() => handleChange(mentor._id)}
                          className="text-indigo-600 border border-indigo-500 px-3 py-1 text-sm rounded-md hover:bg-indigo-500 hover:text-white transition-colors"
                        >
                          View Profile
                        </button>
                      </div>

                      {/* Job Title */}
                      <p className="text-purple-700 text-sm font-medium">{mentor.jobTitle}</p>

                      {/* Skills */}
                      <p className="text-gray-600 text-sm">
                        Skills: <span className="font-medium">{mentor.Technologies?.join(', ') || 'N/A'}</span>
                      </p>

                      {/* Experience and Followers */}
                      <div className="mt-2 flex items-center space-x-2">
                        <span className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded-md">
                          {mentor.yearofexperience} years experience
                        </span>
                        <span className="text-xs bg-indigo-100 text-indigo-800 px-2 py-1 rounded-md">
                          {mentor.followerCount} followers
                        </span>
                      </div>
                    </div>
                  </div>

                ))}
              </div>
            ) : (
              <p className="text-white">No mentors available based on your profile.</p>
            )}
          </div>




        </div>

{/* Right Section: Followed Mentors */}
<div className="notifications col-span-1 shadow-lg rounded-md bg-white p-6">
  <h2 className="text-gray-800 font-bold text-xl mb-4 border-b pb-2 border-gray-200">
    Followed Mentors
  </h2>

  {isLoadingMentors ? (
    <div className="flex justify-center items-center">
      <FaSpinner className="animate-spin text-blue-500 text-2xl" />
      <p className="ml-2 text-gray-600">Loading mentors...</p>
    </div>
  ) : followedMentors.length === 0 ? (
    <p className="text-gray-600 text-center mt-4">
      No mentors available based on your profile.
    </p>
  ) : (
    <div className="grid grid-cols-1 gap-4 max-h-[calc(90vh-150px)] overflow-y-auto">
      {followedMentors.map((mentor) => (
        <div
          key={mentor._id}
          className="rounded-lg p-5 shadow-md bg-gradient-to-r from-blue-50 to-white hover:shadow-lg transition-all duration-300"
        >
          <div className="flex items-center justify-between">
            {/* Mentor Image and Details */}
            <div className="flex items-center space-x-4">
              <img
                src={mentor.image || "/default-avatar.png"}
                onClick={() => handleChange(mentor._id)}
                alt={`${mentor.firstName} ${mentor.lastName}`}
                className="w-20 h-20 cursor-pointer rounded-full object-cover border-4 border-blue-200 shadow-md hover:scale-105 transition-transform"
              />
              <div>
                <h3 className="text-lg font-semibold text-gray-800 hover:text-blue-600 transition-colors cursor-pointer">
                  {mentor.firstName} {mentor.lastName}
                </h3>
                <p className="text-sm text-gray-600 font-medium">{mentor.jobTitle}</p>
                <div className="flex space-x-3 mt-2">
                  <a
                    href={`mailto:${mentor.email}`}
                    className="text-blue-600 hover:text-blue-400 transition-colors"
                    title="Email"
                  >
                    <FaEnvelope size={20} />
                  </a>
                  {mentor.linkedin && (
                    <a
                      href={mentor.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-400 transition-colors"
                      title="LinkedIn"
                    >
                      <FaLinkedin size={20} />
                    </a>
                  )}
                </div>
              </div>
            </div>

            {/* Unfollow Button */}
            <button
              onClick={() => unFollowMentor(mentor._id)}
              className="text-white bg-red-500 px-3 py-1 text-sm font-medium rounded-md hover:bg-red-600 transition-colors"
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

  )

};


export default MenteeDashBoard;