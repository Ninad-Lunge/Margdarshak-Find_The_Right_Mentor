import Navbar from "../../Components/Mentee/MenteeNavbar"
import { useState, useEffect } from "react";
import axios from 'axios';
import { toast } from 'react-toastify';

const MenteeDashBoard = () => {
    const [upcomingSlots, setUpcomingSlots] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchUpcomingSlots();
    }, []);

    const fetchUpcomingSlots = async () => {
        setError(null);
        try {
            const token = localStorage.getItem('token');
            const menteeId = localStorage.getItem('menteeId');

            if (!token) {
                setError('No authentication token found. Please log in.');
                return;
            }


            const response = await axios.get('/api/availability/confirmed', {
                headers: { Authorization: `Bearer ${token}` },
            });

            if (Array.isArray(response.data)) {
                setUpcomingSlots(response.data);
            } else {
                console.error('Unexpected response format:', response.data);
                setError('Invalid data format received from server');
            }
        } catch (error) {
            console.error('Error details:', error.response || error);
            const errorMessage = error.response?.data?.error || error.message || 'Failed to load available slots';
            setError(errorMessage);
            toast.error(errorMessage);
        }
    };

    return (
        <div className="menteeDashoard bg-gray-50">
            <Navbar />

            <div className="grid grid-cols-3 mx-1 md:mx-4 gap-4 mt-4">
                <div className="flex flex-col col-span-2 gap-y-4">
                    <div className="upcoming-meetings h-64 shadow rounded-md bg-white">
                        <h3 className="mt-4 ms-4 text-gray-800 font-medium mb-2">Upcoming Meetings</h3>

                        {error && <p className="text-red-500">{error}</p>}

                        <div className="flex space-y-2 m-4">
                            {upcomingSlots.map((slot, index) => (
                                <div
                                    key={index}
                                    className="bg-white p-4 rounded-lg shadow hover:shadow-lg transition-shadow border border-gray-200"
                                >
                                    <div className="mb-2">
                                        <h3 className="text-md font-medium">
                                            Mentor: {slot.mentorId?.firstName || 'Not specified'}
                                            {slot.mentorId?.lastName ? ` ${slot.mentorId.lastName}` : ''}
                                        </h3>
                                    </div>

                                    <div className="grid grid-cols-3">
                                        <div className="space-y-1 text-gray-600 col-span-2">
                                            <div className="flex items-center space-x-1 text-sm">
                                                <span className="font-medium">Date:</span>
                                                <span>{new Date(slot.date).toLocaleDateString()}</span>
                                            </div>
                                            <div className="flex items-center space-x-1 text-sm">
                                                <span className="font-medium">Time:</span>
                                                <span>{slot.startTime} - {slot.endTime}</span>
                                            </div>
                                        </div>
                                        <div className="flex">
                                            <a
                                                href={slot.meetLink}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-blue-500 text-sm p-1 border border-blue-500 rounded-md my-auto hover:bg-blue-500 hover:text-white"
                                            >
                                                Join Meet
                                            </a>
                                        </div>
                                    </div>

                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="recommendations col-span-3 h-72 shadow rounded-md bg-white">
                        <h3 className="mt-4 ms-4 text-gray-800 font-medium mb-2">Recommendations</h3>
                    </div>
                </div>
                <div className="notifications col-span-1 h-full shadow rounded-md bg-white">
                    <h3 className="mt-4 ms-4 text-gray-800 font-medium mb-2">Notifications</h3>
                </div>
            </div>
        </div>
    );
}

export default MenteeDashBoard;