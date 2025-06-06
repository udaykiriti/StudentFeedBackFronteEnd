import React from 'react';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import AdminDashboard from './admincomponents/AdminDashboard.js';
import './App.css';
import ForgotPassword from "./components/ForgotPassword";
import LoginPage from './components/LoginPage';
import ResetPassword from "./components/ResetPassword";
import SignupPage from './components/SignupPage';
import StudentDashboard from './components/StudentDashboard';
import AdminFeedbackForm from './admincomponents/AdminFeedbackForm.js';
import StudentFeedbackForm from './components/StudentFeedbackForm.js';
import StudentCourseFeedback from "./components/StudentCourseFeedback";
import AdminCourseFeedback from "./admincomponents/AdminCourseFeedback";
import SettingsPage from "./components/SettingsPage";
import AdminSettingsPage from "./admincomponents/AdminSettingsPage";
import AdminFacultyFeedback from './admincomponents/AdminFacultyFeedback.js';
import StudentFacultyFeedback from './components/StudentFacultyFeedback.js';
import GeneralFeedbackForm from "./components/GeneralFeedbackForm";
import GeneralFeedbackAdmin from "./admincomponents/GeneralFeedbackAdmin.js";
import HomePage from "./components/HomePage.js";
import AdminHomePage from "./admincomponents/AdminHomePage.js";
import AdminFacultyFeedbackAnalytics from './admincomponents/AdminFacultyFeedbackAnalytics.js';
import CourseFeedbackAnalytics from "./admincomponents/CourseFeedbackAnalytics.js";
import HostelDataEntry from "./components/HostelDataEntry.js";


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/" element={<LoginPage />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        
        <Route path="/student-dashboard" element={<StudentDashboard />}>
          <Route path="faculty-feedback" element={<StudentFacultyFeedback/>} />
          <Route path="student-feedback-form" element={<StudentFeedbackForm />} />
          <Route path="coursefeedback" element={<StudentCourseFeedback />} />
          <Route path="general-feedback-form" element={<GeneralFeedbackForm/>} />
          <Route path="student-settings" element={<SettingsPage/>} />
          <Route path="home" element={<HomePage/>} />
          <Route path="hostel" element={<HostelDataEntry/>} />
          <Route path="services" element={<div>Student Services Page</div>} />
          
        </Route>

        <Route path="/admin-dashboard" element={<AdminDashboard />}>
          <Route path="faculty-feedback-form" element={<AdminFacultyFeedback/>} />
          <Route path="admin-feedback-form" element={<AdminFeedbackForm />} />
          <Route path="course-feedback" element={<AdminCourseFeedback />} />
          <Route path="general-feedback" element={<GeneralFeedbackAdmin/>} />
          <Route path="admin-settings" element={<AdminSettingsPage/>} />
          <Route path="admin-home" element={<AdminHomePage/>} />
          <Route path="faculty-feedback-analytics" element={<AdminFacultyFeedbackAnalytics/>} />
          <Route path="course-feedback-analytics" element={<CourseFeedbackAnalytics/>} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;