import React, { useState, useEffect } from "react";
import axios from "axios";
import { Plus, Users, ArrowLeft } from "lucide-react";
import Navbar from "./MentorNavbar";
import CommunityView from "./CommunityView";

const CommunityCard = ({ community, onSelect }) => (
  <div className="bg-white rounded-lg shadow-md p-4 mb-4 w-full max-w-md">
    <div className="mb-4">
      <div className="flex items-center gap-2 text-xl font-semibold mb-1">
        <Users className="h-5 w-5" />
        {community.title}
      </div>
      <p className="text-gray-600 text-sm">{community.description}</p>
    </div>
    {/* <div className="mb-4">
      <p className="text-sm text-gray-600">
        {community.blogs?.length || 0} blog posts
      </p>
    </div> */}
    <button
      onClick={() => onSelect(community)}
      className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded transition-colors"
    >
      View Community
    </button>
  </div>
);

const CreateCommunityForm = ({ onClose, refreshCommunities }) => {
  const [communityData, setCommunityData] = useState({ title: "", description: "" });

  const handleCommunitySubmit = async () => {
    if (!communityData.title.trim() || !communityData.description.trim()) return;

    try {
      await axios.post("http://localhost:5000/api/communities", communityData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`, // Adjust if needed
        },
      });
      alert("Community created successfully!");
      setCommunityData({ title: "", description: "" });
      refreshCommunities();
      onClose();
    } catch (error) {
      console.error("Error creating community:", error);
      alert("Failed to create community. Please try again.");
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4 w-full max-w-md mx-auto">
      <h2 className="text-xl font-semibold mb-4">Create a New Community</h2>
      <input
        type="text"
        placeholder="Community Title"
        value={communityData.title}
        onChange={(e) => setCommunityData({ ...communityData, title: e.target.value })}
        className="w-full p-2 border border-gray-300 rounded mb-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <textarea
        placeholder="Community Description"
        value={communityData.description}
        onChange={(e) => setCommunityData({ ...communityData, description: e.target.value })}
        className="w-full p-2 border border-gray-300 rounded mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
        rows="4"
      />
      <div className="flex justify-end gap-2">
        <button
          onClick={onClose}
          className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-medium py-2 px-4 rounded transition-colors"
        >
          Cancel
        </button>
        <button
          onClick={handleCommunitySubmit}
          disabled={!communityData.title.trim() || !communityData.description.trim()}
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          Submit
        </button>
      </div>
    </div>
  );
};

const CommunityPlatform = () => {
  const [communities, setCommunities] = useState([]);
  const [selectedCommunity, setSelectedCommunity] = useState(null);
  const [isCreatingCommunity, setIsCreatingCommunity] = useState(false);

  const fetchCommunities = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/communities");
      setCommunities(response.data);
    } catch (error) {
      console.error("Error fetching communities:", error);
    }
  };

  useEffect(() => {
    fetchCommunities();
  }, []);

  if (selectedCommunity) {
    return (
      <div className="container mx-auto p-4">
        <CommunityView
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
        <h1 className="text-3xl font-bold mb-6">Community Platform</h1>

        {isCreatingCommunity ? (
          <CreateCommunityForm
            onClose={() => setIsCreatingCommunity(false)}
            refreshCommunities={fetchCommunities}
          />
        ) : (
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold">Communities</h2>
            <button
              onClick={() => setIsCreatingCommunity(true)}
              className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded transition-colors"
            >
              <Plus className="h-5 w-5" />
              Create Community
            </button>
          </div>
        )}

        <div className="flex flex-wrap gap-4">
          {communities.map((community) => (
            <CommunityCard
              key={community._id}
              community={community}
              onSelect={setSelectedCommunity}
            />
          ))}
        </div>
      </div>
    </>
  );
};

export default CommunityPlatform;