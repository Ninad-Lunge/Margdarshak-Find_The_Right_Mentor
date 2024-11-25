import React, { useState, useEffect } from "react";
import axios from "axios";
import { Users } from "lucide-react";
import Navbar from "./MenteeNavbar";
import ReadBlogs from "./ReadBlogs";

const CommunityCard = ({ community, onSelect, isMember, onJoinLeave }) => (
  <div className="bg-white rounded-lg shadow-md p-6 mb-4 w-full max-w-sm hover:shadow-lg transition-shadow">
    <div className="mb-6">
      <div className="flex items-center gap-2 text-xl font-semibold mb-2">
        <Users className="h-6 w-6 text-blue-600" />
        {community.title}
        {isMember && (
          <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full font-medium">
            Joined
          </span>
        )}
      </div>
      <p className="text-gray-600 text-sm leading-relaxed">{community.description}</p>
    </div>
    <div className="flex flex-col gap-3">
      <button
        onClick={() => onSelect(community)}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-all duration-200 ease-in-out transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 shadow-sm"
      >
        View Community
      </button>
      {isMember ? (
        <button
          onClick={() => onJoinLeave(community._id)}
          className="w-full border-2 border-red-500 text-red-500 hover:bg-red-50 font-medium py-3 px-4 rounded-lg transition-all duration-200 ease-in-out transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
        >
          Leave Community
        </button>
      ) : (
        <button
          onClick={() => onJoinLeave(community._id)}
          className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-4 rounded-lg transition-all duration-200 ease-in-out transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 shadow-sm"
        >
          Join Community
        </button>
      )}
    </div>
  </div>
);

const JoinCommunity = () => {
  const [communities, setCommunities] = useState([]);
  const [selectedCommunity, setSelectedCommunity] = useState(null);
  const [userCommunities, setUserCommunities] = useState([]);

  const fetchCommunities = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/communities");
      setCommunities(response.data);
    } catch (error) {
      console.error("Error fetching communities:", error);
    }
  };

  const fetchUserCommunities = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/user/communities", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setUserCommunities(response.data);
    } catch (error) {
      console.error("Error fetching user communities:", error);
    }
  };

  const handleJoinLeave = async (communityId) => {
    const isAlreadyMember = userCommunities.includes(communityId);
    try {
      if (isAlreadyMember) {
        // Leave community
        await axios.post(
          `http://localhost:5000/api/communities/${communityId}/leave`,
          {},
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
      } else {
        // Join community
        await axios.post(
          `http://localhost:5000/api/communities/${communityId}/join`,
          {},
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
      }
      // Refresh user communities after join/leave
      fetchUserCommunities();
    } catch (error) {
      console.error("Error joining or leaving community:", error);
    }
  };

  useEffect(() => {
    fetchCommunities();
    fetchUserCommunities(); // Fetch user's communities when the component mounts
  }, []);

  if (selectedCommunity) {
    return (
      <div className="container mx-auto p-4">
        <ReadBlogs
          community={selectedCommunity}
          onBack={() => setSelectedCommunity(null)}
        />
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-6">Community Platform</h1>
        <div className="flex flex-wrap gap-6 justify-center">
          {communities.map((community) => {
            const isMember = userCommunities.includes(community._id); // Check if user is a member
            return (
              <CommunityCard
                key={community._id}
                community={community}
                onSelect={setSelectedCommunity}
                isMember={isMember}
                onJoinLeave={handleJoinLeave}
              />
            );
          })}
        </div>
      </div>
    </>
  );
};

export default JoinCommunity;
