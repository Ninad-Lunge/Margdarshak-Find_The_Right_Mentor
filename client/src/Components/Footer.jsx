import React from 'react';
import { FaLinkedin, FaTwitter, FaFacebook } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-black text-white py-8 px-4 md:px-36 mt-[100px]">
      {/* Contact Us Section */}
      <h2 className="text-2xl mb-2">Contact Us</h2>
      <p className="mb-4">margadarshak@gmail.com</p>

      {/* Social Icons */}
      <div className="flex space-x-6">
        <a href="https://www.linkedin.com" target="_blank" rel="noopener noreferrer">
          <FaLinkedin size={30} />
        </a>
        <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
          <FaTwitter size={30} />
        </a>
        <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer">
          <FaFacebook size={30} />
        </a>
      </div>
    </footer>
  );
};

export default Footer;