import React from "react";
import { FaStar } from 'react-icons/fa';
import { FaLinkedin, FaTwitter, FaGithub, FaYoutube, FaEnvelope, FaInstagram } from 'react-icons/fa';


const MentorProfile = () => {
  return (
    <div>
      <div className="flex flex-row justify-between rounded-[2px] ml-[120px] mr-[200px] mb-[50px] ">

        <div className="item-center border border-black rounded-[3px] w-[190px] mt-[10px] mb-[50px]">
          {" "}
          {/*Image and Name */}
          <div className="w-[100px] h-[100px] bg-gray-300 border border-black rounded-[3px] ml-[45px] mr-[40px] mt-[20px]">
            {" "}
            {/*Image */}
          </div>
          <h1 className="text-center m-[10px]">Prof. Sheetal Kale</h1>
          <h3 className="text-center text-sm m-[10px]">HOD, BIT Wardha</h3>
          <div className="flex justify-center m-[10px]">
            {Array(5).fill().map((_, index) => (
                <FaStar key={index} className="text-yellow-500" />
            ))}
        </div>  
          <button className="m-[10px] ml-[47px] bg-[#4257d7] text-white border border-black rounded-[3px] py-1.5 px-5">
            Follow
          </button>
        </div> {/*Image and name completed here */}
        
        <div className="item-center border border-black w-[480px] rounded-[3px] mt-[10px] mb-[50px]">
        
        <div className='flex flex-row justify-between ml-[30px] mr-[170px] mt-[20px]'>
          <div className=''>
            <h1 className='text-2xl'>20k+</h1>
            <h3 className='text-xs'>Followers</h3>
          </div>
          <div className='ml-[100px]'>
            <h1 className='text-2xl'>50k+</h1>
            <h3 className='text-xs'>Mentees</h3>
          </div>
          <div className='ml-[100px]'>
            <h1 className='text-2xl '>24</h1>
            <h3 className='text-xs'>Articles</h3>
          </div>
        </div>

        <h1 className="mt-[50px] ml-[30px]">Area of Expertise : </h1>
        </div>

        <div className="item-center mt-[10px] mb-[50px]"> {/* Bahar wala dabba with border black */}
        <div className="flex flex-col justify-between border border-black rounded-[2px] mb-[10px] ">
            <h1 className="m-[10px] w-[430px]">Schedule an Online meet : </h1>
            <h1 className="m-[10px]">Available on - Sunday 4th Aug 2024</h1>
            <button className="m-[10px] ml-[10px] bg-[#4257d7] text-white border border-black rounded-[3px] py-1.5 px-5">
            Schedule
          </button>
        </div>

        <div className="flex flex-col justify-between border border-black rounded-[2px]">
            <h1 className="m-[10px] w-[430px] mb-[25px]">Connect</h1>
            <div className="flex justify-around mb-[30px]">
        <a href="https://www.linkedin.com" target="_blank" rel="noopener noreferrer">
          <FaLinkedin className="text-blue-600" size={30} />
        </a>
        <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
          <FaTwitter className="text-blue-400" size={30} />
        </a>
        <a href="https://github.com" target="_blank" rel="noopener noreferrer">
          <FaGithub className="text-gray-800" size={30} />
        </a>
        <a href="https://www.youtube.com" target="_blank" rel="noopener noreferrer">
          <FaYoutube className="text-red-600" size={30} />
        </a>
        <a href="mailto:example@example.com" target="_blank" rel="noopener noreferrer">
          <FaEnvelope className="text-gray-700" size={30} />
        </a>
        <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer">
          <FaInstagram className="text-pink-600" size={30} />
        </a>
      </div>
        </div>
        </div>


      </div>
    </div>
  );
};

export default MentorProfile;