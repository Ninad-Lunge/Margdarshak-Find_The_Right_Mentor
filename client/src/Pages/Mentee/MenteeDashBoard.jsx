import Navbar from "../../Components/Navbar/Navbar"
import { useNavigate } from 'react-router-dom';

const MenteeDashboard = () =>{

    const navigate = useNavigate();

    const handleNavigation = () => {
        // navigate('/schedule-meeting');
        navigate('/');
    }

    return(
        <div className="menteeDashoard">
            <Navbar />
            <button className="m-20 schedule-btn border border-black bg-green-400 rounded-md p-2" onClick={handleNavigation}>Schedule Meet with Mentor</button>
        </div>
    );
}

export default MenteeDashboard;