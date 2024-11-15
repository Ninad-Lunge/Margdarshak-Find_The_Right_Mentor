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
import MentorAvailability from './Components/Mentor/Availability.jsx';
import MenteeBooking from './Components/Mentee/FindMentor.jsx';
import MentorRequests from './Components/Mentor/Request.jsx';
import ManageSlots from './Components/Mentor/ManageSlots.jsx';

function App() {
  return (
    <>
    <BrowserRouter>
       <Routes>
        <Route exact path='/' element={<Home />} />
        <Route exact path='/home' element={<Home />} />
        <Route exact path='/login' element={<LoginPage />} />
        <Route exact path='/mentor-register' element={<MentorRegister />} />
        <Route exact path='/mentee-register' element={<MenteeRegister />} />
        <Route exact path='/schedule-meeting' element={<ScheduleMeeting />} />
        <Route exact path='/mentor-dashboard' element={<MentorDashborad />} />
        <Route exact path='/resume-builder' element={<ResumeBuilder />} />
        <Route exact path='/mentee-dashboard' element={<MenteeDashboard />} />
        <Route exact path='/add-slots' element={<MentorAvailability />} />
        <Route exact path='/mentor-booking' element={<MenteeBooking />} />
        <Route path='/manage-requests' element={<MentorRequests />} />
        <Route path='/manage-slots' element={<ManageSlots />} />
       </Routes>
    </BrowserRouter>
    </>
  );
}

export default App;
