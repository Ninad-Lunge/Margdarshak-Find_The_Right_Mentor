import React, { useEffect, useState } from 'react';
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';

import Home from './Pages/Home.jsx';
import LoginPage from './Pages/LoginPage.jsx';
import MenteeRegister from './Pages/MenteeRegister.jsx';
import MentorRegister from './Pages/MentorRegister.jsx';
import MentorDashborad from './Pages/Mentor/MentorDashboard.jsx';
import MenteeDashboard from './Pages/Mentee/MenteeDashBoard.jsx';
import ResumeBuilder from './Pages/Mentee/ResumeBuilder.jsx';
import MentorAvailability from './Components/Mentor/Availability.jsx';
import MenteeBooking from './Components/Mentee/FindMentor.jsx';
import MentorRequests from './Components/Mentor/Request.jsx';
import MentorProfile from './Pages/Mentor/MentorProfile.jsx';
import MentorProfileonMentee from './Components/Mentee/MentorProfile.jsx';
import MenteeProfileOverview from './Pages/Mentee/MenteeProfile.jsx';
import MenteeProfile from './Components/Mentee/MenteeProfile.jsx';
import EditMenteeProfile from './Components/Mentee/EditMenteeProfile.jsx';

import Community from './Components/Mentor/Community.jsx';
import JoinCommunity from './Components/Mentee/JoinCommunity.jsx';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
  return isLoggedIn ? children : <Navigate to="/login" />;
};


function App() {
  const [initialPath, setInitialPath] = useState('/');

  useEffect(() => {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    const role = localStorage.getItem('role');

    if (isLoggedIn) {
      if (role === 'Mentor') {
        setInitialPath('/mentor-dashboard');
      } else if (role === 'Mentee') {
        setInitialPath('/mentee-dashboard');
      }
    } else {
      setInitialPath('/home');
    }
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route exact path="/" element={<Navigate to={initialPath} />} />
        <Route path="/home" element={<Home />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/mentor-register" element={<MentorRegister />} />
        <Route path="/mentee-register" element={<MenteeRegister />} />
        <Route path="/resume-builder" element={<ResumeBuilder />}/>
        <Route path="/mentee-profile/:menteeId" element={<MenteeProfileOverview />} />

        {/* Protected Routes */}
        <Route
          path="/mentor-dashboard"
          element={
            <ProtectedRoute>
              <MentorDashborad />
            </ProtectedRoute>
          }
        />
        <Route
          path="/mentee-dashboard"
          element={
            <ProtectedRoute>
              <MenteeDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/add-slots"
          element={
            <ProtectedRoute>
              <MentorAvailability />
            </ProtectedRoute>
          }
        />
        <Route
          path="/find-mentors"
          element={
            <ProtectedRoute>
              <MenteeBooking />
            </ProtectedRoute>
          }
        />
        <Route
          path="/manage-requests"
          element={
            <ProtectedRoute>
              <MentorRequests />
            </ProtectedRoute>
          }
        />
        <Route
          path="/mentor-profile"
          element={
            <ProtectedRoute>
              <MentorProfile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/create-community"
          element={
            <ProtectedRoute>
              <Community />
            </ProtectedRoute>
          }
        />
        <Route
          path="/join-community"
          element={
            <ProtectedRoute>
              <JoinCommunity />
            </ProtectedRoute>
          }
        />
        <Route
          path="/mentee-profile"
          element={
            <ProtectedRoute>
              <MenteeProfile />
            </ProtectedRoute>
          }
        />
        <Route path="/mentee/:menteeId/edit" element={<ProtectedRoute><EditMenteeProfile /></ProtectedRoute>} />
        <Route path='/mentorProfile/:mentorId' element={<MentorProfileonMentee />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;