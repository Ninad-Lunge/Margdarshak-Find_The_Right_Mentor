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

    const handleToggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const handleLogout = () => {
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('token');
        localStorage.removeItem('role'); 
        setIsLoggedIn(false);
        navigate('/');
    };

    const isActive = (path) =>
        location.pathname === path ? 'text-[#3B50D5]' : 'text-black';

    return (
        <nav className="navbar flex justify-between items-center px-4 md:px-10 h-16 bg-white">
            {/* Logo */}
            <div className="flex items-center">
                <img src={logo} alt="Logo" className="w-28 md:w-auto h-auto cursor-pointer" />
            </div>

            {/* Mobile Menu Button */}
            <button
                className="md:hidden block focus:outline-none"
                onClick={handleToggleMenu}
            >
                <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M4 6h16M4 12h16M4 18h16"
                    ></path>
                </svg>
            </button>

            {/* Menu Items */}
            <div
                className={`absolute md:relative top-16 md:top-0 left-0 md:left-auto w-full md:w-auto bg-white md:bg-transparent shadow-md md:shadow-none ${
                    isMenuOpen ? 'block' : 'hidden'
                } md:flex flex-col md:flex-row items-center md:items-center gap-y-4 md:gap-y-0 md:gap-x-12 py-4 md:py-0`}
            >
                <Link
                    to="/mentee-dashboard"
                    className={`px-4 py-2 md:p-0 ${isActive('/mentee-dashboard')}`}
                >
                    Dashboard
                </Link>
                <Link
                    to="/find-mentors"
                    className={`px-4 py-2 md:p-0 ${isActive('/find-mentors')}`}
                >
                    Find Mentors
                </Link>
                <Link
                    to="/resume-builder"
                    className={`px-4 py-2 md:p-0 ${isActive('/resume-builder')}`}
                >
                    Build Resume
                </Link>
                <Link
                    to="/profile"
                    className={`px-4 py-2 md:p-0 ${isActive('/profile')}`}
                >
                    Profile
                </Link>
                <Link
                    to="/join-community"
                    className={`px-4 py-2 md:p-0 ${isActive('/join-community')}`}
                >
                    Community
                </Link>
                
                {isLoggedIn && (
                    <button
                        onClick={handleLogout}
                        className={`px-4 py-2 md:p-0 ${isActive('')}`}
                    >
                        Log Out
                    </button>
                )}
            </div>
        </nav>
    );
};

export default Navbar;