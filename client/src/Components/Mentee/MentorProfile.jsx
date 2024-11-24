import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { ToastContainer, toast, Slide } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FaEnvelope, FaGithub, FaTwitter, FaLinkedin, FaGlobe, FaStar, FaRegStar, FaCalendar, FaClock } from "react-icons/fa";
import Navbar from './MenteeNavbar';

const MentorProfile = () => {
    const [mentorData, setMentorData] = useState(null);
    const [isFollowing, setIsFollowing] = useState(false);
    const [availableSlots, setAvailableSlots] = useState([]);
    const { mentorId } = useParams();

    useEffect(() => {
        fetchAvailability();
    }, []);

    const fetchAvailability = async () => {
        try {
            const token = localStorage.getItem('token');
            const mentorId = localStorage.getItem('mentorId');
            const response = await axios.get(`/api/availability/mentorslot/${mentorId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setAvailableSlots(response.data);
        } catch (error) {
            toast.error('Failed to fetch availability');
            console.error('Error fetching availability:', error);
        }
    };

    const bookSlot = async (slotId) => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                toast.error('Please log in to book a slot');
                return;
            }

            const response = await axios.post(
                '/api/availability/book',
                { slotId },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            if (response.status === 200) {
                toast.success('Slot booked successfully!');
                await fetchAvailability();
            }
        } catch (error) {
            const errorMessage = error.response?.data?.error || 'Failed to book slot';
            toast.error(errorMessage);
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem('token');
                const [followResponse, mentorResponse] = await Promise.all([
                    fetch(`/api/mentor/${mentorId}/is-following`, {
                        headers: { Authorization: `Bearer ${token}` },
                    }),
                    fetch(`/api/mentor/${mentorId}`, {
                        headers: { Authorization: `Bearer ${token}` },
                    })
                ]);

                const [followData, mentorData] = await Promise.all([
                    followResponse.json(),
                    mentorResponse.json()
                ]);

                if (followData.success) setIsFollowing(followData.isFollowing);
                if (mentorData.success) setMentorData(mentorData.mentor);
            } catch (error) {
                console.error('Error fetching data:', error);
                toast.error('Failed to load mentor profile');
            }
        };

        fetchData();
    }, [mentorId]);

    const toggleFollow = async () => {
        try {
            const token = localStorage.getItem('token');
            const mentorId = localStorage.getItem('mentorId');

            if (!token || !mentorId) {
                toast.error('Authentication required');
                return;
            }

            const response = await fetch(`/api/mentor/${mentorId}/follow`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
            });

            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.message || 'Failed to toggle follow status');
            }

            if (data.success) {
                setIsFollowing(!isFollowing);
                const newFollowerCount = isFollowing
                    ? mentorData.followerCount - 1
                    : mentorData.followerCount + 1;
                setMentorData({ ...mentorData, followerCount: newFollowerCount });
                toast.success(isFollowing ? 'Unfollowed successfully' : 'Following successfully');
            }
        } catch (error) {
            toast.error(error.message || 'An unexpected error occurred');
        }
    };

    // Rating component
    const Rating = ({ rating = 4 }) => (
        <div className="flex">
            {[...Array(5)].map((_, index) => (
                index < rating ? <FaStar key={index} className="text-yellow-400" /> : <FaRegStar key={index} className="text-gray-300" />
            ))}
        </div>
    );

    if (!mentorData) return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-50 pb-12">
            <Navbar />
            <ToastContainer position="top-center" autoClose={3000} transition={Slide} className="mt-14" />
            
            {/* Header Section */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-800 h-64 relative">
                <div className="absolute -bottom-20 left-1/2 transform -translate-x-1/2">
                    <img
                        src={mentorData?.image}
                        alt={`${mentorData.firstName} ${mentorData.lastName}`}
                        className="w-40 h-40 rounded-full border-4 border-white shadow-lg object-cover"
                    />
                </div>
            </div>

            {/* Main Content */}
            <div className="container mx-auto px-4 mt-24">
                {/* Profile Header */}
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-800">
                        {mentorData.firstName} {mentorData.lastName}
                    </h1>
                    <p className="text-lg text-gray-600 mt-2">{mentorData.jobTitle}</p>
                    <div className="flex justify-center items-center gap-4 mt-4">
                        <Rating rating={4} />
                        <button
                            onClick={toggleFollow}
                            className={`px-6 py-2 rounded-full transition-all duration-300 ${
                                isFollowing 
                                ? 'bg-green-500 text-white hover:bg-green-600' 
                                : 'bg-blue-500 text-white hover:bg-blue-600'
                            }`}
                        >
                            {isFollowing ? 'Following' : 'Follow'}
                        </button>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    {[
                        { label: 'Followers', value: mentorData.followerCount },
                        { label: 'Communities', value: '52' },
                        { label: 'Workshops', value: '5' }
                    ].map((stat, index) => (
                        <div key={index} className="bg-white rounded-xl shadow-sm p-6 text-center hover:shadow-md transition-shadow duration-300">
                            <h3 className="text-3xl font-bold text-gray-800">{stat.value}</h3>
                            <p className="text-gray-600 mt-1">{stat.label}</p>
                        </div>
                    ))}
                </div>

                {/* Main Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* About Section */}
                        <div className="bg-white rounded-xl shadow-sm p-6">
                            <h2 className="text-xl font-bold text-gray-800 mb-4">About</h2>
                            <p className="text-gray-600 leading-relaxed">{mentorData.bio}</p>
                        </div>

                        {/* Expertise Section */}
                        <div className="bg-white rounded-xl shadow-sm p-6">
                            <h2 className="text-xl font-bold text-gray-800 mb-4">Areas of Expertise</h2>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                {[
                                    'Web Development',
                                    'Data Science',
                                    'Machine Learning',
                                    'App Development',
                                    'Cloud Computing',
                                    'Cybersecurity'
                                ].map((expertise, index) => (
                                    <div
                                        key={index}
                                        className="bg-blue-50 text-blue-700 px-4 py-2 rounded-lg text-center
                                                hover:bg-blue-100 transition-colors duration-300"
                                    >
                                        {expertise}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Right Column */}
                    <div className="space-y-8">
                        {/* Booking Section */}
                        <div className="bg-white rounded-xl shadow-sm p-6">
                            <h2 className="text-xl font-bold text-gray-800 mb-4">Book a Session</h2>
                            {availableSlots.length === 0 ? (
                                <p className="text-gray-500 text-center py-4">
                                    No available slots at the moment.
                                </p>
                            ) : (
                                <div className="space-y-4">
                                    {availableSlots.map((slot) => (
                                        <div
                                            key={slot._id}
                                            className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors duration-300"
                                        >
                                            <div className="flex items-center gap-3 text-gray-600 mb-3">
                                                <FaCalendar />
                                                <span>
                                                    {new Date(slot.date).toLocaleDateString('en-US', {
                                                        weekday: 'short',
                                                        month: 'short',
                                                        day: 'numeric'
                                                    })}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-3 text-gray-600 mb-4">
                                                <FaClock />
                                                <span>{slot.startTime} - {slot.endTime}</span>
                                            </div>
                                            <button
                                                onClick={() => bookSlot(slot._id)}
                                                className="w-full bg-blue-500 text-white py-2 rounded-lg
                                                        hover:bg-blue-600 transition-colors duration-300"
                                            >
                                                Book Session
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Connect Section */}
                        <div className="bg-white rounded-xl shadow-sm p-6">
                            <h2 className="text-xl font-bold text-gray-800 mb-4">Connect</h2>
                            <div className="flex justify-between items-center">
                                {[
                                    { icon: FaEnvelope, link: mentorData.email },
                                    { icon: FaGlobe, link: mentorData.website },
                                    { icon: FaLinkedin, link: mentorData.linkedin },
                                    { icon: FaTwitter, link: mentorData.twitter },
                                    { icon: FaGithub, link: "https://github.com/yourusername" }
                                ].map((social, index) => (
                                    <a
                                        key={index}
                                        href={social.link}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-gray-600 hover:text-blue-500 transition-colors duration-300"
                                    >
                                        <social.icon size={24} />
                                    </a>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MentorProfile;