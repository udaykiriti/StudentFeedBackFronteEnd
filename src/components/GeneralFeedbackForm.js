import React, { useState, useEffect } from 'react';
import { AlertCircle, CheckCircle } from 'lucide-react';
import './GeneralFeedbackForm.css';

const GeneralFeedbackForm = () => {
  const [isHosteler, setIsHosteler] = useState(false);
  const [activeTab, setActiveTab] = useState('facilities');
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState({ type: '', message: '' });
  const [formData, setFormData] = useState({
    studentId: '',
    department: '',
    year: '',
    isHosteler: false, // Explicitly set to false by default
    buildingCleanliness: '',
    classroomCondition: '',
    washroomCleanliness: '',
    waterFacilities: '',
    lighting: '',
    ventilation: '',
    canteenCleanliness: '',
    foodQuality: '',
    canteenPricing: '',
    canteenVariety: '',
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

  useEffect(() => {
    if (notification.message) {
      const timer = setTimeout(() => {
        setNotification({ type: '', message: '' });
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const toggleHostelerStatus = (status) => {
    setIsHosteler(status);
    setFormData(prev => ({
      ...prev,
      isHosteler: status,
      ...(status ? {} : {
        roomCondition: '',
        hostelFood: '',
        hostelCleanliness: '',
        hostelStaff: ''
      })
    }));

    setActiveTab(status ? 'hostel' : 'facilities');
  };
  const validateForm = () => {
    if (!formData.studentId.trim()) {
      setNotification({ 
        type: 'error', 
        message: 'Please enter your Student ID' 
      });
      return false;
    }
    if (!formData.department) {
      setNotification({ 
        type: 'error', 
        message: 'Please select your Department' 
      });
      return false;
    }
    if (!formData.year) {
      setNotification({ 
        type: 'error', 
        message: 'Please select your Year of Study' 
      });
      return false;
    }
    
    if (activeTab === 'facilities') {
      const facilityFields = ['buildingCleanliness', 'classroomCondition', 'washroomCleanliness', 
                            'waterFacilities', 'lighting', 'ventilation'];
      for (const field of facilityFields) {
        if (!formData[field]) {
          setNotification({ 
            type: 'error', 
            message: 'Please complete all ratings in General Facilities section' 
          });
          return false;
        }
      }
    }

    if (activeTab === 'canteen') {
      const canteenFields = ['canteenCleanliness', 'foodQuality', 'canteenPricing', 'canteenVariety'];
      for (const field of canteenFields) {
        if (!formData[field]) {
          setNotification({ 
            type: 'error', 
            message: 'Please complete all ratings in Canteen section' 
          });
          return false;
        }
      }
    }

    if (isHosteler && activeTab === 'hostel') {
      const hostelFields = ['roomCondition', 'hostelFood', 'hostelCleanliness', 'hostelStaff'];
      for (const field of hostelFields) {
        if (!formData[field]) {
          setNotification({ 
            type: 'error', 
            message: 'Please complete all ratings in Hostel section' 
          });
          return false;
        }
      }
    }

    return true;
  };

  const resetForm = () => {
    setFormData({
      studentId: '',
      department: '',
      year: '',
      isHosteler: false,
      buildingCleanliness: '',
      classroomCondition: '',
      washroomCleanliness: '',
      waterFacilities: '',
      lighting: '',
      ventilation: '',
      canteenCleanliness: '',
      foodQuality: '',
      canteenPricing: '',
      canteenVariety: '',
      roomCondition: '',
      hostelFood: '',
      hostelCleanliness: '',
      hostelStaff: '',
      comments: ''
    });
    setIsHosteler(false);
    setActiveTab('facilities');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
  
    setLoading(true);
    
    try {
      const response = await fetch('http://localhost:8081/api/feedback/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          // Explicitly set isHosteler to the current state
          isHosteler: isHosteler
        })
      });
      
      if (!response.ok) {
        throw new Error('Failed to submit feedback');
      }
  
      await response.json();
      setNotification({
        type: 'success',
        message: 'Thank you! Your feedback has been submitted successfully.'
      });
      resetForm();
      
    } catch (error) {
      console.error('Error:', error);
      setNotification({
        type: 'error',
        message: 'Unable to submit feedback. Please try again later.'
      });
    } finally {
      setLoading(false);
    }
  };

  const renderRatingSelect = (field, label) => (
    <div className="form-group">
      <label>{label}</label>
      <select
        value={formData[field]}
        onChange={(e) => handleInputChange(field, e.target.value)}
        required
        className="form-select"
      >
        <option value="">Select rating</option>
        {ratings.map((rating) => (
          <option key={rating} value={rating}>{rating}</option>
        ))}
      </select>
    </div>
  );


  return (
    <div className="feedback-container">
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

      <div className="form-header">
        <h1>University Facilities Feedback Form</h1>
        <p>Help us improve your campus experience</p>
      </div>

      <form onSubmit={handleSubmit} className="feedback-form">
        <div className="form-grid">
          <div className="form-group">
            <label>Student ID</label>
            <input
              type="text"
              value={formData.studentId}
              onChange={(e) => handleInputChange('studentId', e.target.value)}
              required
              className="form-input"
              placeholder="Enter your student ID"
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

        <div className="hosteler-toggle">
  <label>Are you a hosteler?</label>
  <div className="toggle-container">
    <label className="toggle-switch">
      <input
        type="checkbox"
        checked={isHosteler}
        onChange={() => toggleHostelerStatus(!isHosteler)}
        className="toggle-input"
      />
      <span className="toggle-slider"></span>
    </label>
    <span className="toggle-label">
      {isHosteler ? 'Hosteler (Residing in Campus Hostel)' : 'Day Scholar (Non-Hosteler)'}
    </span>
  </div>
  {isHosteler && (
    <p className="toggle-hint">
      * Additional hostel-related feedback sections will be available
    </p>
  )}
</div>
        <div className="tabs">
          <button
            type="button"
            className={`tab ${activeTab === 'facilities' ? 'active' : ''}`}
            onClick={() => setActiveTab('facilities')}
          >
            General Facilities
          </button>
          <button
            type="button"
            className={`tab ${activeTab === 'canteen' ? 'active' : ''}`}
            onClick={() => setActiveTab('canteen')}
          >
            Canteen
          </button>
          {isHosteler && (
            <button
              type="button"
              className={`tab ${activeTab === 'hostel' ? 'active' : ''}`}
              onClick={() => setActiveTab('hostel')}
            >
              Hostel
            </button>
          )}
        </div>


        <div className="tab-content">
          {activeTab === 'facilities' && (
            <div className="facilities-section">
              <h2>General Facilities Feedback</h2>
              <div className="rating-grid">
                {renderRatingSelect('buildingCleanliness', 'Building Cleanliness')}
                {renderRatingSelect('classroomCondition', 'Classroom Condition')}
                {renderRatingSelect('washroomCleanliness', 'Washroom Cleanliness')}
                {renderRatingSelect('waterFacilities', 'Water Facilities')}
                {renderRatingSelect('lighting', 'Lighting')}
                {renderRatingSelect('ventilation', 'Ventilation')}
              </div>
            </div>
          )}

          {activeTab === 'canteen' && (
            <div className="canteen-section">
              <h2>Canteen Feedback</h2>
              <div className="rating-grid">
                {renderRatingSelect('canteenCleanliness', 'Canteen Cleanliness')}
                {renderRatingSelect('foodQuality', 'Food Quality')}
                {renderRatingSelect('canteenPricing', 'Food Pricing')}
                {renderRatingSelect('canteenVariety', 'Menu Variety')}
              </div>
            </div>
          )}

          {activeTab === 'hostel' && isHosteler && (
            <div className="hostel-section">
              <h2>Hostel Feedback</h2>
              <div className="rating-grid">
                {renderRatingSelect('roomCondition', 'Room Condition')}
                {renderRatingSelect('hostelFood', 'Hostel Food Quality')}
                {renderRatingSelect('hostelCleanliness', 'Hostel Cleanliness')}
                {renderRatingSelect('hostelStaff', 'Hostel Staff Behavior')}
              </div>
            </div>
          )}
        </div>

        <div className="form-group">
          <label>Additional Comments</label>
          <textarea
            value={formData.comments}
            onChange={(e) => handleInputChange('comments', e.target.value)}
            className="form-textarea"
            placeholder="Please provide any additional comments or suggestions..."
          />
        </div>

        <button 
          type="submit" 
          className={`submit-button ${loading ? 'loading' : ''}`}
          disabled={loading}
        >
          {loading ? 'Submitting...' : 'Submit Feedback'}
        </button>
      </form>
    </div>
  );
};

export default GeneralFeedbackForm;