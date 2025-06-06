import React, { useState, useEffect } from 'react';
import { useNavigate, Outlet, useLocation } from 'react-router-dom';
import axios from 'axios';
import { 
  Home,
  Users,
  BookOpen,
  FileText,
  UserCheck,
  Settings,
  LogOut,
  ChevronRight,
  Menu,
  Shield
} from 'lucide-react';
import './AdminDashboard.css';
import defaultProfileIcon from './profile-icon.jpg';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [username, setUsername] = useState('');
  const [profilePicture, setProfilePicture] = useState(defaultProfileIcon);

  useEffect(() => {
    const storedUsername = localStorage.getItem('username');
    if (!storedUsername) {
      navigate('/login');
    } else {
      setUsername(storedUsername);
      fetchProfilePicture(storedUsername);
    }
  }, [navigate]);

  const fetchProfilePicture = async (username) => {
    try {
      const response = await axios.get('/api/settings/profile-picture', {
        params: { username: username },
        responseType: 'blob'
      });
      
      // Check if response data is not empty
      if (response.data.size > 0) {
        const imageUrl = URL.createObjectURL(response.data);
        setProfilePicture(imageUrl);
      } else {
        // Fallback to default if no image
        setProfilePicture(defaultProfileIcon);
      }
    } catch (error) {
      console.error('Error fetching profile picture:', error);
      setProfilePicture(defaultProfileIcon);
    }
  };

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
    { icon: <Home size={20} />, text: 'Home', path: 'admin-home' },
    { icon: <FileText size={20} />, text: 'Feedback Notification', path: 'admin-feedback-form' },
    { icon: <BookOpen size={20} />, text: 'Course Feedback', path: 'course-feedback' },
    { icon: <Users size={20} />, text: 'Course Feedback Analytics', path: 'course-feedback-analytics' },
    { icon: <UserCheck size={20} />, text: 'Faculty Feedback Analytics', path: 'faculty-feedback-analytics' },
    { icon: <FileText size={20} />, text: 'General Feedback', path: 'general-feedback' },
    { icon: <Settings size={20} />, text: 'Settings', path: 'admin-settings' },
  ];

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const handleNavigation = (path) => {
    navigate(`/admin-dashboard/${path}`);
  };

  return (
    <div className="admin-layout">
      {/* Sidebar */}
      <div 
        className={`admin-sidebar ${isOpen ? 'admin-sidebar--expanded' : ''}`}
        onMouseEnter={() => setIsOpen(true)}
        onMouseLeave={() => setIsOpen(false)}
      >
        <div className="admin-sidebar__header">
          <div className="admin-sidebar__logo">
            <Shield size={28} className="admin-sidebar__logo-icon" />
            <span className="admin-sidebar__logo-text">Admin Portal</span>
          </div>
          
          <nav className="admin-sidebar__nav">
            {menuItems.map((item, index) => (
              <button
                key={index}
                onClick={() => handleNavigation(item.path)}
                className={`admin-sidebar__nav-item ${
                  location.pathname === `/admin-dashboard/${item.path}` ? 'active' : ''
                }`}
              >
                <span className="admin-sidebar__nav-icon">{item.icon}</span>
                <span className="admin-sidebar__nav-text">{item.text}</span>
                <ChevronRight size={16} className="admin-sidebar__chevron" />
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className={`admin-main ${isOpen ? 'admin-main--shifted' : ''}`}>
        {/* Header */}
        <div className="admin-header">
          <div className="admin-header__container">
            <button className="admin-header__menu-toggle" onClick={toggleSidebar}>
              <Menu size={24} />
            </button>
            <div className="admin-header__welcome">
              <h2 className="admin-header__title">Welcome, {username}</h2>
              <span className="admin-header__date">{formattedDate}</span>
            </div>
            
            <div className="admin-header__profile">
              <div className="admin-header__user-info">
                <div className="admin-header__avatar-container">
                  <img 
                    src={profilePicture || defaultProfileIcon} 
                    alt="Profile" 
                    className="admin-header__avatar"
                  />
                </div>
                <div className="admin-header__user-details">
                  <span className="admin-header__user-name">{username}</span>
                  <span className="admin-header__user-role">Administrator</span>
                </div>
              </div>
              <button 
                onClick={handleLogout}
                className="admin-header__logout"
              >
                <LogOut size={16} />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="admin-content">
          <div className="admin-content__container">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;