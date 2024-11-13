import React, { useState, useEffect } from 'react';
import logo from '../../Assets/logo.png';
import { AiOutlineMenu } from "react-icons/ai";
import { IoCloseSharp } from "react-icons/io5";
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
  const [menu, setMenu] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if the user is logged in by checking local storage or any authentication token
    const loggedInStatus = localStorage.getItem('isLoggedIn');
    setIsLoggedIn(loggedInStatus === 'true');
  }, []);

  const handleNavigation = (text) => {
    if (text === "Log In") {
      navigate('/Login');
    } else if (text === "Profile") {
      // Add logic to navigate to profile page
      navigate('/profile');
    }
  };

  const handleLogout = () => {
    // Log out logic, such as clearing tokens or local storage
    localStorage.removeItem('isLoggedIn');
    setIsLoggedIn(false);
    navigate('/'); // Redirect to home or login page
  };

  const navItems = [
    { id: 1, text: "Home" },
    { id: 2, text: "About" },
    { id: 3, text: "How it works" },
    { id: 4, text: "Build Resume" },
    { id: 5, text: isLoggedIn ? "Profile" : "Log In" }
  ];

  return (
    <div className="max-w-screen-2xl container mx-auto px-4 md:px-20 h-16 shadow-md fixed top-0 left-0 right-0 bg-white">
      <div className='flex justify-between items-center h-16'>
        <div>
          <img src={logo} alt='Logo' className='w-25' />
        </div>
        <div>
          <ul className='hidden md:flex space-x-8 text-sm'>
            {navItems.map(({ id, text }) => (
              <li
                className='hover:scale-105 duration-200 cursor-pointer'
                key={id}
                onClick={() => handleNavigation(text)}
              >
                {text}
              </li>
            ))}
            {isLoggedIn && (
              <li
                className='hover:scale-105 duration-200 cursor-pointer text-red-500'
                onClick={handleLogout}
              >
                Log Out
              </li>
            )}
          </ul>
          <div onClick={() => setMenu(!menu)} className='md:hidden'>
            {menu ? <IoCloseSharp size={24} /> : <AiOutlineMenu size={24} />}
          </div>
        </div>
      </div>

      {menu && (
        <div>
          <ul className='md:hidden flex flex-col h-screen items-center justify-center space-y-3 text-sm'>
            {navItems.map(({ id, text }) => (
              <li
                className='hover:scale-105 duration-200 cursor-pointer'
                key={id}
                onClick={() => handleNavigation(text)}
              >
                {text}
              </li>
            ))}
            {isLoggedIn && (
              <li
                className='hover:scale-105 duration-200 cursor-pointer text-red-500'
                onClick={handleLogout}
              >
                Log Out
              </li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
}

export default Navbar;