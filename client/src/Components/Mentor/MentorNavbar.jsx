import { useState, useEffect } from 'react';
import logo from '../../Assets/logo.png';
import { Link, useNavigate, useLocation } from 'react-router-dom';

const Navbar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        // Check if the user is logged in by checking local storage or any authentication token
        const loggedInStatus = localStorage.getItem('isLoggedIn');
        setIsLoggedIn(loggedInStatus === 'true');
      }, []);

    function handleToggleMenu() {
        setIsMenuOpen(!isMenuOpen);
    }

    const handleLogout = () => {
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('token');
        localStorage.removeItem('role'); 
        setIsLoggedIn(false);
        navigate('/');
      };

    const isActive = (path) => location.pathname === path ? 'text-[#3B50D5]' : 'text-black';

    return (
        <nav className="navbar flex flex-col md:flex-row justify-between px-10 h-14 items-center sticky top-0 left-0 right-0 bg-white mx-2 mt-2 rounded-md shadow-sm" >
            <button 
                className="md:hidden block focus:outline-none" 
                onClick={handleToggleMenu}
            >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
                </svg>
            </button>
            <div>
                <img src={logo} alt='Logo' className='w-auto' />
            </div>

            <div className={`links ${isMenuOpen ? 'block' : 'hidden'} md:flex flex-col md:flex-row gap-y-4 md:gap-1 gap-x-6 md:gap-x-12 mb-4 md:mb-0 text-sm font-medium`}>
                <Link to="/mentor-dashboard" className={isActive('/mentor-dashboard')}>Dashboard</Link>
                <Link to="/add-slots" className={isActive('/add-slots')}>Manage Slots</Link>
                <Link to="/manage-requests" className={isActive('/manage-requests')}>Manage Requests</Link>
                <Link to="/create-community" className={isActive('/create-community')}>Community</Link>
                <Link to="/mentor-profile" className={isActive('/mentor-profile')}>Profile</Link>
                <button onClick={handleLogout} className={isActive('')}>Log Out</button>
            </div>
        </nav>
    );
};

export default Navbar;