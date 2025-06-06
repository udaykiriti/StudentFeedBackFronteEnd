import React, { useState } from 'react';
import axios from 'axios';
import "./AdminFeedbackForm.css";

const AdminNotificationForm = () => {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        closingDate: '',
        isUrgent: false
    });
    const feedbackFormTypes = [
        'COURSE_FEEDBACK',
        'EVENT_FEEDBACK',
        'INSTRUCTOR_FEEDBACK',
        'CAMPUS_SERVICES',
        'CUSTOM'
    ];
    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: type === 'checkbox' ? checked : value
        }));
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const feedbackForm = {
                title: formData.title,
                customTitle: formData.title === 'CUSTOM' ? formData.customTitle : null,
                description: formData.description,
                closingDate: new Date(formData.closingDate),
                urgent: formData.isUrgent
            };
            await axios.post('/api/admin/feedback/forms', feedbackForm);
            alert('Notification created successfully!');
            setFormData({
                title: '',
                description: '',
                closingDate: '',
                isUrgent: false
            });
        } catch (error) {
            console.error('Error creating notification:', error);
            alert('Failed to create notification');
        }
    };
    return (
        <div className="af-admin-notification-form">
            <h2>Create New Feedback Form Notification</h2>
            <form onSubmit={handleSubmit}>
                <div className="af-form-group">
                    <label>Form Title:</label>
                    <select 
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        required
                    >
                        <option value="">Select Form Type</option>
                        {feedbackFormTypes.map(type => (
                            <option key={type} value={type}>{type.replace('_', ' ')}</option>
                        ))}
                    </select>
                </div>

                {formData.title === 'CUSTOM' && (
                    <div className="af-form-group">
                        <label>Custom Title:</label>
                        <input
                            type="text"
                            name="customTitle"
                            value={formData.customTitle || ''}
                            onChange={handleChange}
                            required
                        />
                    </div>
                )}
                <div className="af-form-group">
                    <label>Description:</label>
                    <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="af-form-group">
                    <label>Closing Date:</label>
                    <input
                        type="datetime-local"
                        name="closingDate"
                        value={formData.closingDate}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="af-form-group af-checkbox-group">
                    <label>
                        <input
                            type="checkbox"
                            name="isUrgent"
                            checked={formData.isUrgent}
                            onChange={handleChange}
                        />
                        Mark as Urgent
                    </label>
                </div>
                <button className="af-submit-button" type="submit">Create Notification</button>
            </form>
        </div>
    );
};

export default AdminNotificationForm;
