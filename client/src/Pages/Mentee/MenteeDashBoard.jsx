import Navbar from "../../Components/Mentee/MenteeNavbar"
import { useNavigate } from 'react-router-dom';

const MenteeDashboard = () =>{

    const navigate = useNavigate();

    const handleNavigation = () => {
        navigate('/mentor-booking');
        // navigate('/');
    }

    return(
        <div className="menteeDashoard bg-gray-50">
            <Navbar />

            <div className="grid grid-cols-3 px-10 gap-4 mt-4">
                <div className="flex flex-col col-span-2 gap-y-4">
                    <div className="upcoming-meetings h-64 shadow rounded-md bg-white">
                        <h3 className="mt-4 ms-4 text-gray-800 font-medium mb-2">Upcoming Meetings</h3>
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