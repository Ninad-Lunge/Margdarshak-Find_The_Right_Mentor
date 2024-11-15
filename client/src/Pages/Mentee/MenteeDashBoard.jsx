import Navbar from "../../Components/Mentee/MenteeNavbar"
import { useNavigate } from 'react-router-dom';

const MenteeDashboard = () =>{

    const navigate = useNavigate();

    const handleNavigation = () => {
        navigate('/mentor-booking');
        // navigate('/');
    }

    return(
        <div className="menteeDashoard">
            <Navbar />

            <div className="flex flex-col px-10 gap-4">
                <div className="upcoming-meetings h-64 border border-black rounded-md">
                    Upcomming Meetings
                </div>
                <div className="grid grid-cols-4 gap-x-4">
                    <div className="recommendations col-span-3 h-96 border border-black rounded-md">
                        Recommendations
                    </div>
                    <div className="notifications col-span-1 h-96 border border-black rounded-md">
                        Notifications
                    </div>
                </div>
            </div>
        </div>
    );
}

export default MenteeDashboard;