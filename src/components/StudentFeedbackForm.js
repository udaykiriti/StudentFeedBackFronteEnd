import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './StudentFeedbackForm.css';

const StudentFeedbackForm = () => {
    const [notifications, setNotifications] = useState([]);
    const [selectedForm, setSelectedForm] = useState(null);
    const [feedbackSubmission, setFeedbackSubmission] = useState({
        rating: 0,
        comment: '',
        formId: null
    });
    useEffect(() => {
      const fetchNotifications = async () => {
          try {
              console.log('Fetching notifications...');
              const response = await axios.get('/api/student/feedback/notifications');
              console.log('Received notifications:', response.data);
              setNotifications(response.data);
          } catch (error) {
              console.error('Error fetching notifications:', error.response ? error.response.data : error.message);
          }
      };
  
      fetchNotifications();
  }, []);

    // Handle selecting a feedback form
    const handleSelectForm = (form) => {
        setSelectedForm(form);
        setFeedbackSubmission({
            rating: 0,
            comment: '',
            formId: form.id
        });
    };

    // Submit feedback
    const handleSubmitFeedback = async (e) => {
        e.preventDefault();
        try {
            await axios.post(`/api/feedback/submit/${selectedForm.id}`, feedbackSubmission);
            alert('Feedback submitted successfully!');
            setSelectedForm(null);
            setFeedbackSubmission({
                rating: 0,
                comment: '',
                formId: null
            });
        } catch (error) {
            console.error('Error submitting feedback:', error);
            alert('Failed to submit feedback');
        }
    };

    // Calculate remaining time for a notification
    const calculateRemainingTime = (closingDate) => {
        const now = new Date();
        const closing = new Date(closingDate);
        const diffHours = Math.ceil((closing - now) / (1000 * 60 * 60));
        return diffHours > 0 ? `${diffHours} hours remaining` : 'Closed';
    };

    return (
        <div className="student-feedback-container">
            <h1 className="page-title">Student Feedback Dashboard</h1>

            {/* Notifications Section */}
            <section className="notifications-section">
                <h2 className="section-title">Active Notifications</h2>
                {notifications.length === 0 ? (
                    <div className="no-notifications-alert">
                        <i className="alert-icon">⚠️</i>
                        <div className="alert-content">
                            <h3>No Active Notifications</h3>
                            <p>There are currently no active feedback forms.</p>
                        </div>
                    </div>
                ) : (
                    <div className="notifications-grid">
                        {notifications.map(notification => (
                            <div 
                                key={notification.id} 
                                className={`notification-card ${notification.urgent ? 'urgent-notification' : ''}`}
                                onClick={() => handleSelectForm(notification)}
                            >
                                <div className="notification-header">
                                    <h3 className="notification-title">{notification.title}</h3>
                                    {notification.urgent && (
                                        <span className="urgent-badge">URGENT</span>
                                    )}
                                </div>
                                <div className="notification-body">
                                    <p className="notification-description">{notification.description}</p>
                                    <div className="notification-time">
                                        <i className="time-icon">⏰</i>
                                        {calculateRemainingTime(notification.closingDate)}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </section>

            {/* Feedback Submission Modal */}
            {selectedForm && (
                <div className="feedback-modal-overlay">
                    <div className="feedback-modal">
                        <div className="modal-header">
                            <h2>Submit Feedback: {selectedForm.title}</h2>
                            <button 
                                className="modal-close-btn" 
                                onClick={() => setSelectedForm(null)}
                            >
                                ✕
                            </button>
                        </div>
                        <div className="modal-content">
                            <form onSubmit={handleSubmitFeedback}>
                                <div className="form-group">
                                    <label>Rating</label>
                                    <div className="rating-buttons">
                                        {[1, 2, 3, 4, 5].map(rating => (
                                            <button
                                                key={rating}
                                                type="button"
                                                className={`rating-btn ${feedbackSubmission.rating === rating ? 'selected' : ''}`}
                                                onClick={() => setFeedbackSubmission(prev => ({
                                                    ...prev, 
                                                    rating
                                                }))}
                                            >
                                                {rating}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label>Comments</label>
                                    <textarea
                                        className="feedback-textarea"
                                        rows="4"
                                        value={feedbackSubmission.comment}
                                        onChange={(e) => setFeedbackSubmission(prev => ({
                                            ...prev, 
                                            comment: e.target.value
                                        }))}
                                        placeholder="Share your detailed feedback..."
                                    />
                                </div>
                                <div className="modal-actions">
                                    <button 
                                        type="button" 
                                        className="btn btn-cancel"
                                        onClick={() => setSelectedForm(null)}
                                    >
                                        Cancel
                                    </button>
                                    <button 
                                        type="submit" 
                                        className="btn btn-submit"
                                        disabled={!feedbackSubmission.rating}
                                    >
                                        Submit Feedback
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default StudentFeedbackForm;