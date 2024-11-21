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
import ManageSlots from './Components/Mentor/ManageSlots.jsx';
import MentorProfile from './Pages/Mentor/MentorProfile.jsx';
import MentorProfileonMentee from './Components/Mentee/MentorProfile.jsx';
import Community from './Components/Mentor/Community.jsx';

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
        <Route path="/" element={<Navigate to={initialPath} />} />
        <Route path="/home" element={<Home />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/mentor-register" element={<MentorRegister />} />
        <Route path="/mentee-register" element={<MenteeRegister />} />
        <Route path="/resume-builder" element={<ResumeBuilder />} />
        

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
          path="/manage-slots"
          element={
            <ProtectedRoute>
              <ManageSlots />
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
        {/* <Route
          path="/resume-builder"
          element={
            <ProtectedRoute>
              <ResumeBuilder />
            </ProtectedRoute>
          }
        /> */}
        <Route path='/mentorprofilebymentee' element={<MentorProfileonMentee />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;