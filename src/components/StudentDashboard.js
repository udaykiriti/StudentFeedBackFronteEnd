import React, { useState, useEffect } from 'react';
import { useNavigate, Outlet } from 'react-router-dom';
import { 
  Home,
  BookOpen,
  MessageSquare,
  GraduationCap,
  Library,
  Settings,
  LogOut,
  ChevronRight,
  Menu
} from 'lucide-react';
import './StudentDashboard.css';
import profileIcon from './images/profile-icon.jpg';

const StudentDashboard = () => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [username, setUsername] = useState('');

  useEffect(() => {
    // Retrieve username from localStorage
    const storedUsername = localStorage.getItem('username');
    if (!storedUsername) {
      // If no username is found, redirect to login
      navigate('/login');
    } else {
      setUsername(storedUsername);
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    navigate('/login');
  };

  const formattedDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
  const menuItems = [
    { icon: <Home size={20} />, text: 'Home', path: 'home' },
    { icon: <BookOpen size={20} />, text: 'Faculty Feedback', path: 'faculty-feedback' },
    { icon: <MessageSquare size={20} />, text: 'Course Feedback', path: 'coursefeedback' },
    { icon: <Library size={20} />, text: 'General Feedback', path: 'general-feedback-form' }, 
    { icon: <Settings size={20} />, text: 'Settings', path: 'student-settings' },
    { icon: <Settings size={20} />, text: 'Hostel', path: 'hostel' },
  ];

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="student-layout">
      {/* Sidebar */}
      <div 
        className={`student-sidebar ${isOpen ? 'student-sidebar--expanded' : ''}`}
        onMouseEnter={() => setIsOpen(true)}
        onMouseLeave={() => setIsOpen(false)}
      >
        <div className="student-sidebar__header">
          <div className="student-sidebar__logo">
            <GraduationCap size={28} className="student-sidebar__logo-icon" />
            <span className="student-sidebar__logo-text">Student Portal</span>
          </div>
          
          <nav className="student-sidebar__nav">
            {menuItems.map((item, index) => (
              <button
                key={index}
                onClick={() => navigate(item.path)}
                className="student-sidebar__nav-item"
              >
                <span className="student-sidebar__nav-icon">{item.icon}</span>
                <span className="student-sidebar__nav-text">{item.text}</span>
                <ChevronRight size={16} className="student-sidebar__chevron" />
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className={`student-main ${isOpen ? 'student-main--shifted' : ''}`}>
        {/* Header */}
        <div className="student-header">
          <div className="student-header__container">
            <button className="student-header__menu-toggle" onClick={toggleSidebar}>
              <Menu size={24} />
            </button>
            <div className="student-header__welcome">
              <h2 className="student-header__title">Welcome Back, {username}</h2>
              <span className="student-header__date">{formattedDate}</span>
            </div>
            
            <div className="student-header__profile">
              <div className="student-header__user-info">
                <div className="student-header__avatar-container">
                <img 
                  src={`/api/settings/profile-picture?username=${username}`} 
                  alt="Profile" 
                  className="student-header__avatar"
                  onError={(e) => {
                    // Fallback to default profile icon if image fails to load
                    e.target.src = profileIcon;
                  }}
                />
                </div>
                <div className="student-header__user-details">
                  <span className="student-header__user-name">{username}</span>
                  <span className="student-header__user-role">Student</span>
                </div>
              </div>
              <button 
                onClick={handleLogout}
                className="student-header__logout"
              >
                <LogOut size={16} />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="student-content">
          <div className="student-content__container">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;