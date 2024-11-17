import React, { useState } from 'react';
import logo from '../../Assets/logo.png';
import { AiOutlineMenu } from "react-icons/ai";
import { IoCloseSharp } from "react-icons/io5";
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
  const [menu, setMenu] = useState(false);
  const navigate = useNavigate();

  const handleNavigation = (text) => {
    if (text === "Log In") {
      navigate('/Login');
    } else if (text === "Build Resume") {
      navigate('/resume-builder');
    }
  };

  const navItems = [
    { id: 1, text: "Home" },
    { id: 2, text: "About" },
    { id: 3, text: "How it works" },
    { id: 4, text: "Build Resume" },
    { id: 5, text: "Log In" }
  ];

  return (
    <div className="max-w-screen-2xl container mx-auto px-4 md:px-20 h-16 fixed top-0 left-0 right-0 bg-white z-50">
      <div className='flex justify-between items-center h-16'>
        <div>
          <img src={logo} alt='Logo' className='w-25' />
        </div>
        <div>
          <ul className='hidden md:flex space-x-8 text-sm'>
            {navItems.map(({ id, text }) => (
              <li
                className='hover:text-blue-600 duration-200 cursor-pointer'
                key={id}
                onClick={() => handleNavigation(text)}
              >
                {text}
              </li>
            ))}
          </ul>
          <div onClick={() => setMenu(!menu)} className='md:hidden'>
            {menu ? <IoCloseSharp size={24} /> : <AiOutlineMenu size={24} />}
          </div>
        </div>
      </div>

      {menu && (
        <div className="md:hidden absolute top-16 left-0 w-full bg-white shadow-md">
          <ul className='flex flex-col items-center space-y-3 py-4 text-sm'>
            {navItems.map(({ id, text }) => (
              <li
                className='hover:scale-105 duration-200 cursor-pointer'
                key={id}
                onClick={() => handleNavigation(text)}
              >
                {text}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Navbar;