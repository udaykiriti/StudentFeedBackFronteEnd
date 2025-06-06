import React, { useState } from 'react';
import { AlertCircle, CheckCircle } from 'lucide-react';

const HostelDataEntryForm = () => {
  const [notification, setNotification] = useState({ type: '', message: '' });
  const [formData, setFormData] = useState({
    studentId: '',
    department: '',
    year: '',
    roomCondition: '',
    hostelFood: '',
    hostelCleanliness: '',
    hostelStaff: '',
    comments: ''
  });

  const departments = [
    "Computer Science",
    "Electrical Engineering",
    "Mechanical Engineering",
    "Civil Engineering",
    "Business Administration",
    "Other"
  ];

  const years = ["1st Year", "2nd Year", "3rd Year", "4th Year", "Other"];
  const ratings = ["Excellent", "Good", "Average", "Poor", "Very Poor"];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.studentId || !formData.department || !formData.year) {
      setNotification({
        type: 'error',
        message: 'Please fill in all required fields'
      });
      return;
    }

    try {
      const response = await fetch('http://localhost:8081/api/hostel/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          isHosteler: true  // Explicitly set to true
        })
      });
      
      if (!response.ok) {
        throw new Error('Failed to submit hostel data');
      }
  // eslint-disable-next-line
      const result = await response.json();
      setNotification({
        type: 'success',
        message: 'Hostel data submitted successfully!'
      });
      
      // Reset form after successful submission
      setFormData({
        studentId: '',
        department: '',
        year: '',
        roomCondition: '',
        hostelFood: '',
        hostelCleanliness: '',
        hostelStaff: '',
        comments: ''
      });
    } catch (error) {
      console.error('Error:', error);
      setNotification({
        type: 'error',
        message: 'Unable to submit hostel data. Please try again.'
      });
    }
  };

  return (
    <div className="hostel-data-entry-container">
      {notification.message && (
        <div className={`notification ${notification.type}`}>
          {notification.type === 'success' ? (
            <CheckCircle className="notification-icon" />
          ) : (
            <AlertCircle className="notification-icon" />
          )}
          {notification.message}
        </div>
      )}

      <h2>Hostel Data Manual Entry</h2>
      <form onSubmit={handleSubmit} className="hostel-data-form">
        <div className="form-grid">
          <div className="form-group">
            <label>Student ID</label>
            <input
              type="text"
              value={formData.studentId}
              onChange={(e) => handleInputChange('studentId', e.target.value)}
              required
              className="form-input"
              placeholder="Enter student ID"
            />
          </div>

          <div className="form-group">
            <label>Department</label>
            <select
              value={formData.department}
              onChange={(e) => handleInputChange('department', e.target.value)}
              required
              className="form-select"
            >
              <option value="">Select department</option>
              {departments.map((dept) => (
                <option key={dept} value={dept}>{dept}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Year of Study</label>
            <select
              value={formData.year}
              onChange={(e) => handleInputChange('year', e.target.value)}
              required
              className="form-select"
            >
              <option value="">Select year</option>
              {years.map((year) => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="hostel-ratings-section">
          <h3>Hostel Facilities Ratings</h3>
          <div className="rating-grid">
            <div className="form-group">
              <label>Room Condition</label>
              <select
                value={formData.roomCondition}
                onChange={(e) => handleInputChange('roomCondition', e.target.value)}
                required
                className="form-select"
              >
                <option value="">Select rating</option>
                {ratings.map((rating) => (
                  <option key={rating} value={rating}>{rating}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Hostel Food Quality</label>
              <select
                value={formData.hostelFood}
                onChange={(e) => handleInputChange('hostelFood', e.target.value)}
                required
                className="form-select"
              >
                <option value="">Select rating</option>
                {ratings.map((rating) => (
                  <option key={rating} value={rating}>{rating}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Hostel Cleanliness</label>
              <select
                value={formData.hostelCleanliness}
                onChange={(e) => handleInputChange('hostelCleanliness', e.target.value)}
                required
                className="form-select"
              >
                <option value="">Select rating</option>
                {ratings.map((rating) => (
                  <option key={rating} value={rating}>{rating}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Hostel Staff Behavior</label>
              <select
                value={formData.hostelStaff}
                onChange={(e) => handleInputChange('hostelStaff', e.target.value)}
                required
                className="form-select"
              >
                <option value="">Select rating</option>
                {ratings.map((rating) => (
                  <option key={rating} value={rating}>{rating}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="form-group">
          <label>Additional Comments</label>
          <textarea
            value={formData.comments}
            onChange={(e) => handleInputChange('comments', e.target.value)}
            className="form-textarea"
            placeholder="Any additional comments about hostel facilities..."
          />
        </div>

        <button type="submit" className="submit-button">
          Submit Hostel Data
        </button>
      </form>
    </div>
  );
};

export default HostelDataEntryForm;
