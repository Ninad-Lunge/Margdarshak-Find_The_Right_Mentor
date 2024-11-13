import React from "react";
import CountUp from "react-countup";
import HomeImg from "../Assets/Homepage.png";
import Navbar from "../Components/Navbar/Navbar.jsx";
import Footer from "../Components/Footer.jsx";
import {ReactTyped} from 'react-typed';

const HomePage = () => {
  return (
    <div>
      <div>
        <Navbar />
      </div>
      <div className="flex flex-row justify-between w-full">
      <div className="ml-[120px] mt-[170px] text-600 text-7xl font-semibold">
      <ReactTyped
        className="text-[#4257d7]"
        strings={["Skill Development", "Resume Building", "Career Guidance"]}
        typeSpeed={40}
        backSpeed={50}
        loop={true}
      />
      <h1>Mentorship</h1>
    </div>
        <div className="justify-end">
          <img
            className="mr-[220px] mt-[170px] w-[150px] h-auto object-cover"
            src={HomeImg}
            alt='icon'
          />
        </div>
      </div>

      <div className="flex flex-row justify-between mt-[100px]">
        <div className="ml-[120px]">
          <h1 className="text-5xl">
            <CountUp end={75} duration={2.5} />+
          </h1>
          <h3 className="text-2xl">Mentors</h3>
        </div>
        <div className="ml-[120px]">
          <h1 className="text-5xl">
            <CountUp end={100} separator="," duration={3} />
            k+
          </h1>
          <h3 className="text-2xl">Users</h3>
        </div>
        <div className="ml-[120px] mr-[220px]">
          <h1 className="text-5xl">
            <CountUp end={2} separator="," duration={3.5} />
            M+
          </h1>
          <h3 className="text-2xl">Stories</h3>
        </div>
      </div>

      <div className="ml-[120px] mr-[220px]" id="about">
        {/*About Section*/}
        <h1 className="text-xl mt-[100px]">About</h1>
        <h1 className="mt-[30px] mb-[30px]">
          It is a long established fact that a reader will be distracted by the
          readable content of a page when looking at its layout. The point of
          using Lorem Ipsum is that it has a more-or-less normal distribution of
          letters, as opposed to using 'Content here, content here', making it
          look like readable English. Many desktop publishing packages and web
          page editors now use Lorem Ipsum as their default model text, and a
          search for 'lorem ipsum' will uncover many web sites still in their
          infancy. Various versions have evolved over the years, sometimes by
          accident, sometimes on purpose (injected humour and the like).
        </h1>
      </div>

      <div className="ml-[120px] mr-[220px]" id="how">
      <h1 className="text-xl mt-[100px]">How it WORKS?</h1>
        <h1 className="mt-[30px] mb-[30px]">
          It is a long established fact that a reader will be distracted by the
          readable content of a page when looking at its layout. The point of
          using Lorem Ipsum is that it has a more-or-less normal distribution of
          letters, as opposed to using 'Content here, content here', making it
          look like readable English. Many desktop publishing packages and web
          page editors now use Lorem Ipsum as their default model text, and a
          search for 'lorem ipsum' will uncover many web sites still in their
          infancy. Various versions have evolved over the years, sometimes by
          accident, sometimes on purpose (injected humour and the like).
        </h1>
      </div>
      <div>
        <Footer />
      </div>
    </div>
  );
};

export default HomePage;