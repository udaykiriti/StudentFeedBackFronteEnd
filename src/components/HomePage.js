// HomePage.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './HomePage.css';

// Import icons
import { Star, BookOpen, User } from 'lucide-react';

function HomePage() {
  const [courses, setCourses] = useState([]);
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const fetchHomePageData = async () => {
      try {
        // Fetch courses
        const coursesResponse = await axios.get('http://localhost:8081/api/courses');
        setCourses(coursesResponse.data);

        setUserData({ email: 'user@example.com', phoneNumber: '1234567890', profilePicture: true });
      } catch (error) {
        console.error('Error fetching homepage data:', error);
      }
    };

    fetchHomePageData();
  }, []);

  const calculateProfileCompleteness = (userData) => {
    let completeness = 0;
    if (userData.email) completeness += 25;
    if (userData.phoneNumber) completeness += 25;
    if (userData.profilePicture) completeness += 25;
    completeness += 25;  // Base completeness
    return Math.min(completeness, 100);
  };

  if (!userData) return <div className="loading">Loading...</div>;

  return (
    <div className="homepage-container">
      <div className="main-content">
        <div className="grid-container">
          {/* Quick Stats */}
          <div className="quick-stats">
            <QuickStatCard 
              icon={<Star className="star-icon" />} 
              title="Total Courses" 
              value={courses.length} 
            />
            <QuickStatCard 
              icon={<User className="user-icon" />} 
              title="Profile Completeness" 
              value={`${calculateProfileCompleteness(userData)}%`} 
            />
            <QuickStatCard 
              icon={<BookOpen className="book-icon" />} 
              title="Active Semesters" 
              value={2} 
            />
          </div>


          {/* Courses Overview */}
          <div className="courses-overview">
            <h3>Your Courses</h3>
            {courses.slice(0, 3).map(course => (
              <div key={course.id} className="course-item">
                <div className="course-details">
                  <h4>{course.courseName}</h4>
                  <p>{course.courseCode}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function QuickStatCard({ icon, title, value }) {
  return (
    <div className="quick-stat-card">
      <div className="quick-stat-icon">{icon}</div>
      <div className="quick-stat-content">
        <p className="quick-stat-title">{title}</p>
        <h4 className="quick-stat-value">{value}</h4>
      </div>
    </div>
  );
}

export default HomePage;