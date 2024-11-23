import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from '../../Components/Mentee/MenteeNavbar.jsx';
import { ToastContainer, toast, Slide } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { FaEnvelope,  FaGithub, FaTwitter, FaLinkedin, FaGlobe } from "react-icons/fa";

const MentorProfile = () => {
    const [mentorData, setMentorData] = useState(null);
    const [isFollowing, setIsFollowing] = useState(false);
    const [availableSlots, setAvailableSlots] = useState([]);
    // const [error, setError] = useState(null);
    // const [isLoading, setIsLoading] = useState(true);
    const mentorId = localStorage.getItem('mentorId');

    useEffect(() => {
        fetchAvailability();
    }, []);

    const fetchAvailability = async () => {
        try {
          const token = localStorage.getItem('token');
          const mentorId = localStorage.getItem('mentorId'); // Get the mentor ID
          
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
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );
    
          if (response.status === 200) {
            toast.success('Slot booked successfully!');
            // Refresh the available slots after booking
            await fetchAvailability();
          }
        } catch (error) {
          console.error('Booking error:', error.response || error);
          const errorMessage = error.response?.data?.error || 'Failed to book slot';
          toast.error(errorMessage);
        }
    };

    useEffect(() => {
        const fetchFollowStatus = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await fetch(`/api/mentor/${mentorId}/is-following`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                const data = await response.json();
                if (data.success) {
                    setIsFollowing(data.isFollowing);
                }
            } catch (error) {
                console.error('Error checking follow status:', error);
            }
        };

        const fetchMentorData = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await fetch(`/api/mentor/${mentorId}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                const data = await response.json();
                if (data.success) {
                    setMentorData(data.mentor);
                }
            } catch (error) {
                console.error('Error fetching mentor data:', error);
            }
        };

        fetchFollowStatus();
        fetchMentorData();
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

            if (response.ok && data.success) {
                setIsFollowing(!isFollowing);
                const newFollowerCount = isFollowing
                    ? mentorData.followerCount - 1
                    : mentorData.followerCount + 1;
                setMentorData({ ...mentorData, followerCount: newFollowerCount });
                if (!isFollowing) {
                    toast.success('You are now following the mentor!');
                } else {
                    toast.info('You have unfollowed the mentor.');
                }

            } else {
                console.error('Error:', data.message || 'Unknown error');
                alert(data.message || 'Error toggling follow status');
            }
        } catch (error) {
            console.error('Detailed follow toggle error:', error);
            toast.error(error.message || 'An unexpected error occurred');
        }
    };

    return (
        <div className="mentor min-h-screen bg-gray-50">
            <Navbar />
            <ToastContainer
                position="top-center"
                autoClose={3000}
                hideProgressBar={false}
                closeOnClick
                pauseOnHover
                draggable
                transition={Slide}
                className="mt-14"
            />

            <div className="grid grid-cols-1 md:grid-cols-4 mt-3 mx-6 gap-3">
                {/* Sidebar */}
                <div className="rounded-lg shadow bg-white py-8">
                    <img
                        src={mentorData?.image}
                        alt="Mentor Profile"
                        className="mentor-img border-4 border-blue-300 rounded-full h-32 w-32 mx-auto"
                    />
                    <h1 className="mentor-name mt-4 text-xl font-bold text-center">
                        {mentorData?.firstName} {mentorData?.lastName}
                    </h1>
                    <p className="text-center text-gray-600 mt-2">Job Title: {mentorData?.jobTitle}</p>
                    <div className=" flex justify-center gap-5 mt-2 text-gray-700">
                        <span className="text-lg font-medium ">Rating:</span>
                        <div className="flex justify-center mt-1">
                            {/* Example Rating with 4 Stars */}
                            <span className="text-yellow-400">★</span>
                            <span className="text-yellow-400">★</span>
                            <span className="text-yellow-400">★</span>
                            <span className="text-yellow-400">★</span>
                            <span className="text-gray-300">★</span>
                        </div>
                    </div>

                    <button
                        className={`mt-4 px-3 py-1 rounded ${isFollowing ? 'mx-auto block  text-white bg-green-400' : 'bg-blue-500 text-white hover:bg-blue-600 mx-auto block'
                            }`}
                        onClick={toggleFollow}>
                        {isFollowing ? 'Following' : 'Follow'}
                    </button>
                </div>


                {/* Stats Section */}
                <div className="stats col-span-2 rounded-lg shadow bg-white mx-0 p-6">
                    <div className="grid grid-cols-3 gap-4 mt-4">
                        <div className="text-center">
                            <h3 className="text-2xl font-bold">{mentorData?.followerCount}</h3>
                            <p className="text-gray-600">Followers</p>
                        </div>
                        <div className="text-center">
                            <h3 className="text-2xl font-bold">52</h3>
                            <p className="text-gray-600">Community Created</p>
                        </div>
                        <div className="text-center">
                            <h3 className="text-2xl font-bold">5</h3>
                            <p className="text-gray-600">Workshops</p>
                        </div>
                    </div>

                    <div className="mt-10">
                        <h2 className="text-lg font-semibold text-gray-800">Areas of Expertise:</h2>
                        <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4 text-center">
                            {/* Expertise Item 1 */}
                            <li className="bg-green-100 text-green-700 p-3 text-sm rounded-lg shadow-sm hover:shadow-md hover:bg-green-200 transition duration-300">
                                Web Development
                            </li>
                            {/* Expertise Item 2 */}
                            <li className="bg-green-100 text-green-700 p-3 text-sm rounded-lg shadow-sm hover:shadow-md hover:bg-green-200 transition duration-300">
                                Data Science
                            </li>
                            {/* Expertise Item 3 */}
                            <li className="bg-green-100 text-green-700 p-3 text-sm rounded-lg shadow-sm hover:shadow-md hover:bg-green-200 transition duration-300">
                                Machine Learning
                            </li>
                            {/* Expertise Item 4 */}
                            <li className="bg-green-100 text-green-700 p-3 text-sm rounded-lg shadow-sm hover:shadow-md hover:bg-green-200 transition duration-300">
                                App Development
                            </li>
                            {/* Expertise Item 5 */}
                            <li className="bg-green-100 text-green-700 p-3 text-sm rounded-lg shadow-sm hover:shadow-md hover:bg-green-200 transition duration-300">
                                Cloud Computing
                            </li>
                            {/* Expertise Item 6 */}
                            <li className="bg-green-100 text-green-700 p-3 text-sm rounded-lg shadow-sm hover:shadow-md hover:bg-green-200 transition duration-300">
                                Cybersecurity
                            </li>
                        </ul>
                    </div>
                </div>

                <div className='grid gap-y-2 h-full grid-rows-[1fr_auto]'>
                    {/* Meetings Section */}
                    <div className='flex flex-col rounded-lg shadow bg-white h-full'>
                        <h2 className="text-base font-bold text-gray-800 m-4">Book an Online Meet</h2>

                        {availableSlots.length === 0 ? (
                            <p className="text-gray-500 text-center py-4">
                                No available slots at the moment.
                            </p>
                        ) : (
                            <div className="space-y-3 mx-3">
                                {availableSlots.map((slot) => (
                                    <div 
                                        key={slot._id} 
                                        className="flex flex-col sm:flex-row justify-between items-center p-3 border rounded-lg hover:bg-gray-50"
                                    >
                                        <div className="grid sm:items-center gap-2 mb-2 sm:mb-0">
                                            <div className="font-medium w-full">
                                                {new Date(slot.date).toLocaleDateString('en-US', {
                                                    weekday: 'short',
                                                    month: 'short',
                                                    day: 'numeric'
                                                })}
                                            </div>
                                            <div className="text-gray-600 w-full">
                                                {slot.startTime} - {slot.endTime}
                                            </div>
                                        </div>

                                        <button
                                            onClick={() => bookSlot(slot._id)}
                                            className="w-full sm:w-auto px-4 py-2 text-blue-500 hover:text-white 
                                                    border border-blue-500 rounded-lg hover:bg-blue-500 
                                                    transition duration-300 transform hover:-translate-y-1"
                                        >
                                            Book Slot
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Connect Section */}
                    <div className="flex flex-col rounded-lg shadow bg-white px-6 py-2 h-[100px]">
                        <h2 className="text-base font-bold text-gray-800">Connect</h2>
                        <div className="mt-6">
                            <div className='flex flex-row gap-x-7'>
                                {/* Gmail */}
                                <a
                                    href={mentorData?.email}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-black hover:text-gray-800"
                                >
                                    <FaEnvelope size={30} />
                                </a>
                                {/* Website */}
                                <a
                                    href={mentorData?.website}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-black hover:text-gray-800"
                                >
                                    <FaGlobe size={30} />
                                </a>
                                {/* LinkedIn */}
                                <a
                                    href={mentorData?.linkedin}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-black hover:text-gray-800"
                                >
                                    <FaLinkedin size={30} />
                                </a>
                                {/* Twitter */}
                                <a
                                    href={mentorData?.twitter}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-black hover:text-gray-800"
                                >
                                    <FaTwitter size={30} />
                                </a>
                                {/* GitHub */}
                                <a
                                    href="https://github.com/yourusername"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-black hover:text-gray-800"
                                >
                                    <FaGithub size={30} />
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bio section*/}
            <div className=" h-60 mt-3 p-5 mx-6 gap-3 rounded-lg shadow bg-white">
                About
                <p className='text-sm'>{mentorData?.bio}</p>
            </div>

        </div>
    );
};

export default MentorProfile;