import React, { useState, useEffect } from 'react';
import './AdminHomePage.css';
import { 
  Users, 
  BookOpen, 
  MessageCircle, 
  Star, 
  TrendingUp, 
  Activity 
} from 'lucide-react';

const AdminDashboardHome = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await fetch('http://localhost:8081/api/admin/dashboard');
        const data = await response.json();
        setDashboardData(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return <div className="dashboard-loading">Loading Dashboard...</div>;
  }

  return (
    <div className="admin-dashboard-home">
      <header className="dashboard-header">
        <h1>Admin Home</h1>
        <div className="header-stats">
          <div className="header-stat">
            <Users size={24} />
            <span>{dashboardData.totalResponses} Total Responses</span>
          </div>
          <div className="header-stat">
            <BookOpen size={24} />
            <span>{dashboardData.departmentCount} Departments</span>
          </div>
        </div>
      </header>

      <div className="dashboard-grid">
        <div className="dashboard-card overview-card">
          <div className="card-header">
            <h2>Response Overview</h2>
            <TrendingUp size={24} />
          </div>
          <div className="card-content">
            <div className="overview-stat">
              <span className="stat-label">Hostelers</span>
              <span className="stat-value">{dashboardData.hostelerCount}</span>
            </div>
            <div className="overview-stat">
              <span className="stat-label">Day Scholars</span>
              <span className="stat-value">{dashboardData.dayScholarCount}</span>
            </div>
          </div>
        </div>

        <div className="dashboard-card departments-card">
          <div className="card-header">
            <h2>Department Breakdown</h2>
            <Activity size={24} />
          </div>
          <div className="card-content department-list">
            {Object.entries(dashboardData.departmentStats).map(([dept, count]) => (
              <div key={dept} className="department-item">
                <span>{dept}</span>
                <span>{count} Responses</span>
              </div>
            ))}
          </div>
        </div>

        <div className="dashboard-card recent-feedback-card">
          <div className="card-header">
            <h2>Recent Feedback</h2>
            <MessageCircle size={24} />
          </div>
          <div className="card-content feedback-list">
            {dashboardData.recentFeedback.map((feedback, index) => (
              <div key={index} className="feedback-item">
                <div className="feedback-info">
                  <span className="feedback-student">Student ID: {feedback.studentId}</span>
                  <span className="feedback-department">{feedback.department}</span>
                </div>
                <span className="feedback-date">
                  {new Date(feedback.submissionDate).toLocaleDateString()}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="dashboard-card feedback-quality-card">
          <div className="card-header">
            <h2>Feedback Quality</h2>
            <Star size={24} />
          </div>
          <div className="card-content quality-stats">
            <div className="quality-stat">
              <span>Average Satisfaction</span>
              <span className="stat-value">
                {dashboardData.averageSatisfaction ? dashboardData.averageSatisfaction.toFixed(1) : 'N/A'}
                <small>/5</small>
              </span>
            </div>
            <div className="quality-progress">
              <div 
                className="progress-bar" 
                style={{
                  width: `${(dashboardData.averageSatisfaction / 5) * 100}%`
                }}
              ></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardHome;