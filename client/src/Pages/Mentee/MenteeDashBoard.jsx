import Navbar from "../../Components/Mentee/MenteeNavbar"
import { useState, useEffect } from "react";
import axios from 'axios';
import { toast } from 'react-toastify';

const MenteeDashboard = () => {
    const [upcomingSlots, setUpcomingSlots] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchMenteeConfirmedSlots();
    }, []);

    const fetchMenteeConfirmedSlots = async () => {
        setError(null);
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                setError('No authentication token found. Please log in.');
                return;
            }

            const response = await axios.get('/api/availability/mentee/confirmed', {
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
            const errorMessage = error.response?.data?.error || error.message || 'Failed to load confirmed slots';
            setError(errorMessage);
            toast.error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="menteeDashoard bg-gray-50">
            <Navbar />

            <div className="grid grid-cols-3 mx-1 md:mx-4 gap-4 mt-4">
                <div className="flex flex-col col-span-2 gap-y-4">
                    <div className="upcoming-meetings shadow rounded-md bg-white h-auto pb-2">
                        <h3 className="mt-4 ms-4 text-gray-800 font-medium mb-2">Upcoming Meetings</h3>

                        {loading && (
                            <div className="flex justify-center items-center h-32">
                                <p className="text-gray-500">Loading...</p>
                            </div>
                        )}

                        {error && (
                            <div className="m-4">
                                <p className="text-red-500">{error}</p>
                            </div>
                        )}

                        <div className="grid grid-cols-3 gap-2 mx-2">
                            {!loading && upcomingSlots.length === 0 && (
                                <p className="text-gray-500 text-center">No upcoming meetings scheduled</p>
                            )}
                            
                            {upcomingSlots.map((slot) => (
                                <div
                                    key={slot._id}
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
                                                <span>{slot.formattedDate}</span>
                                            </div>
                                            <div className="flex items-center space-x-1 text-sm">
                                                <span className="font-medium">Time:</span>
                                                <span>{slot.startTime} - {slot.endTime}</span>
                                            </div>
                                        </div>
                                        <div className="flex justify-end">
                                            {slot.meetLink ? (
                                                <a
                                                    href={slot.meetLink}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-blue-500 text-sm p-1 border border-blue-500 rounded-md my-auto hover:bg-blue-500 hover:text-white"
                                                >
                                                    Join Meet
                                                </a>
                                            ) : (
                                                <span className="text-gray-400 text-sm">No meeting link yet</span>
                                            )}
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

export default MenteeDashboard;