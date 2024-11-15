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
import MentorEditProfile from './Pages/Mentor/MentorProfile.jsx';

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route exact path='/' element={<Home />} />
          <Route path='/home' element={<Home />} />
          <Route path='/login' element={<LoginPage />} />
          <Route path='/mentor-register' element={<MentorRegister />} />
          <Route path='/mentee-register' element={<MenteeRegister />} />
          <Route path='/schedule-meeting' element={<ScheduleMeeting />} />
          <Route path='/mentor-dashboard' element={<MentorDashborad />} />
          <Route path='/mentee-dashboard' element={<MenteeDashboard />} />
          <Route path='/add-slots' element={<MentorAvailability />} />
          <Route path='/find-mentors' element={<MenteeBooking />} />
          <Route path='/manage-requests' element={<MentorRequests />} />
          <Route path='/manage-slots' element={<ManageSlots />} />
          <Route path='/mentor-profile' element={<MentorEditProfile />} />
          <Route exact path='/resume-builder' element={<ResumeBuilder />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
