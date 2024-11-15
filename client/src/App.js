import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

import Home from './Pages/Home.jsx';
import LoginPage from './Pages/LoginPage.jsx';
import MenteeRegister from './Pages/MenteeRegister.jsx';
import MentorRegister from './Pages/MentorRegister.jsx';
import ScheduleMeeting from './Pages/Mentee/ScheduleMeetingWithMentor.jsx';
import MentorDashborad from './Pages/Mentor/MentorDashboard.jsx';
import MenteeDashboard from './Pages/Mentee/MenteeDashBoard.jsx';
import ResumeBuilder from './Pages/Mentee/ResumeBuilder.jsx';

function App() {
  return (
    <>
    <BrowserRouter>
     
       <Routes> 
        <Route exact path='/' element={<Home />} />
        <Route exact path='/Home' element={<Home />} />
        <Route exact path='/Login' element={<LoginPage />} />
        <Route exact path='/mentor-register' element={<MentorRegister />} />
        <Route exact path='/mentee-register' element={<MenteeRegister />} />
        <Route exact path='/schedule-meeting' element={<ScheduleMeeting />} />
        <Route exact path='/mentor-dashboard' element={<MentorDashborad />} />
        <Route exact path='/resume-builder' element={<ResumeBuilder />} />
       </Routes>
    </BrowserRouter>
    </>
  );
}

export default App;
