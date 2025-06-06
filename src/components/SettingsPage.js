import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Edit2, Lock, Mail, Phone, User, Camera } from 'lucide-react';
import './SettingsPage.css';

const StudentSettingsPage = () => {
    const [userData, setUserData] = useState(null);
    const [editMode, setEditMode] = useState({
        email: false,
        phoneNumber: false
    });
    const [formData, setFormData] = useState({
        email: '',
        phoneNumber: ''
    });
    const [previewImage, setPreviewImage] = useState(null);
    const [passwordModal, setPasswordModal] = useState(false);
    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });

    useEffect(() => {
        const username = localStorage.getItem('username');
        if (username) {
            fetchUserDetails(username);
        } else {
            console.error('No username found in localStorage');
            alert('Please log in again');
        }
    }, []);

    const fetchUserDetails = async (username) => {
        try {
            const response = await axios.get('/api/user/details', {
                params: { username: username }
            });
            
            setUserData(response.data);
            setFormData({
                email: response.data.email || '',
                phoneNumber: response.data.phoneNumber || ''
            });

            try {
                const pictureResponse = await axios.get('/api/settings/profile-picture', {
                    params: { username: username },
                    responseType: 'blob'
                });
                setPreviewImage(URL.createObjectURL(pictureResponse.data));
            } catch (pictureError) {
                console.error('Error fetching profile picture:', pictureError);
                setPreviewImage('/default-avatar.png');
            }
        } catch (error) {
            console.error('Error fetching user details:', error.response || error);
            
            if (error.response) {
                alert(`Error: ${error.response.data || 'User not found'}`);
            } else if (error.request) {
                alert('No response received from server. Please check your connection.');
            } else {
                alert('Error setting up the request');
            }
        }
    };

    const handleProfilePictureChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewImage(reader.result);
            };
            reader.readAsDataURL(file);

            uploadProfilePicture(file);
        }
    };

    const uploadProfilePicture = async (file) => {
        const username = localStorage.getItem('username');
        
        const formData = new FormData();
        formData.append('username', username);
        formData.append('profilePicture', file);
        formData.append('email', userData.email);
        formData.append('phoneNumber', userData.phoneNumber);
        formData.append('currentPassword', '');

        try {
            await axios.post('/api/settings/update-profile', formData, {
                headers: { 
                    'Content-Type': 'multipart/form-data' 
                }
            });
            alert('Profile picture updated successfully');
            fetchUserDetails(username);
        } catch (error) {
            console.error('Profile picture upload error:', error.response || error);
            
            if (error.response) {
                alert(`Upload Error: ${error.response.data}`);
            } else if (error.request) {
                alert('No response received from server');
            } else {
                alert('Error setting up the upload request');
            }
        }
    };

    const toggleEditMode = (field) => {
        setEditMode(prev => ({
            ...prev,
            [field]: !prev[field]
        }));
    };

    const handleInputChange = (e, field) => {
        setFormData(prev => ({
            ...prev,
            [field]: e.target.value
        }));
    };

    const updateField = async (field) => {
        try {
            await axios.post('/api/settings/update-field', null, {
                params: {
                    username: userData.username,
                    field: field,
                    value: formData[field]
                }
            });
            toggleEditMode(field);
            await fetchUserDetails(userData.username);
            alert(`${field} updated successfully`);
        } catch (error) {
            console.error('Update field error:', error);
            alert(error.response?.data || `Error updating ${field}`);
        }
    };

    const handlePasswordChange = async (e) => {
        e.preventDefault();
        
        if (passwordData.newPassword !== passwordData.confirmPassword) {
            alert('New passwords do not match');
            return;
        }

        try {
            await axios.post('/api/settings/change-password', null, {
                params: {
                    username: userData.username,
                    currentPassword: passwordData.currentPassword,
                    newPassword: passwordData.newPassword
                }
            });
            alert('Password changed successfully');
            setPasswordModal(false);
            setPasswordData({
                currentPassword: '',
                newPassword: '',
                confirmPassword: ''
            });
        } catch (error) {
            alert(error.response?.data || 'Error changing password');
        }
    };

    if (!userData) return <div>Loading...</div>;

    return (
        <div className="student-settings-container">
            <div className="student-settings__profile-section">
                <div className="student-settings__profile-picture-container">
                    <input 
                        type="file" 
                        id="profilePicture"
                        accept="image/*"
                        onChange={handleProfilePictureChange}
                        style={{ display: 'none' }} 
                    />
                    <label htmlFor="profilePicture" className="student-settings__profile-picture-label">
                        <img 
                            src={previewImage || '/default-avatar.png'} 
                            alt="Profile" 
                            className="student-settings__profile-picture" 
                        />
                        <div className="student-settings__profile-picture-overlay">
                            <Camera className="student-settings__camera-icon" />
                            <span>Change Picture</span>
                        </div>
                    </label>
                </div>
            </div>

            <div className="student-settings__list">
                <div className="student-settings__item">
                    <div className="student-settings__item-content">
                        <User className="student-settings__icon" />
                        <span>{userData.username}</span>
                    </div>
                </div>

                <div className="student-settings__item">
                    <div className="student-settings__item-content">
                        <Mail className="student-settings__icon" />
                        {editMode.email ? (
                            <div className="student-settings__edit-input-container">
                                <input
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => handleInputChange(e, 'email')}
                                    className="student-settings__edit-input"
                                />
                                <div className="student-settings__edit-buttons">
                                    <button onClick={() => updateField('email')} className="student-settings__confirm-btn">✔️</button>
                                    <button onClick={() => toggleEditMode('email')} className="student-settings__cancel-btn">❌</button>
                                </div>
                            </div>
                        ) : (
                            <>
                                <span>{userData.email || 'Not set'}</span>
                                <button 
                                    onClick={() => toggleEditMode('email')} 
                                    className="student-settings__edit-btn"
                                >
                                    <Edit2 size={18} />
                                </button>
                            </>
                        )}
                    </div>
                </div>

                <div className="student-settings__item">
                    <div className="student-settings__item-content">
                        <Phone className="student-settings__icon" />
                        {editMode.phoneNumber ? (
                            <div className="student-settings__edit-input-container">
                                <input
                                    type="tel"
                                    value={formData.phoneNumber}
                                    onChange={(e) => handleInputChange(e, 'phoneNumber')}
                                    className="student-settings__edit-input"
                                />
                                <div className="student-settings__edit-buttons">
                                    <button onClick={() => updateField('phoneNumber')} className="student-settings__confirm-btn">✔️</button>
                                    <button onClick={() => toggleEditMode('phoneNumber')} className="student-settings__cancel-btn">❌</button>
                                </div>
                            </div>
                        ) : (
                            <>
                                <span>{userData.phoneNumber || 'Not set'}</span>
                                <button 
                                    onClick={() => toggleEditMode('phoneNumber')} 
                                    className="student-settings__edit-btn"
                                >
                                    <Edit2 size={18} />
                                </button>
                            </>
                        )}
                    </div>
                </div>

                <div className="student-settings__item">
                    <div className="student-settings__item-content">
                        <Lock className="student-settings__icon" />
                        <span>Password</span>
                        <button 
                            onClick={() => setPasswordModal(true)} 
                            className="student-settings__change-password-btn"
                        >
                            Change
                        </button>
                    </div>
                </div>
            </div>

            {passwordModal && (
                <div className="student-settings__modal">
                    <div className="student-settings__modal-content">
                        <h2>Change Password</h2>
                        <form onSubmit={handlePasswordChange}>
                            <input
                                type="password"
                                placeholder="Current Password"
                                value={passwordData.currentPassword}
                                onChange={(e) => setPasswordData(prev => ({ ...prev, currentPassword: e.target.value }))}
                                required
                            />
                            <input
                                type="password"
                                placeholder="New Password"
                                value={passwordData.newPassword}
                                onChange={(e) => setPasswordData(prev => ({ ...prev, newPassword: e.target.value }))}
                                required
                            />
                            <input
                                type="password"
                                placeholder="Confirm Password"
                                value={passwordData.confirmPassword}
                                onChange={(e) => setPasswordData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                                required
                            />
                            <button type="submit" className="student-settings__save-btn">Save</button>
                            <button 
                                type="button" 
                                onClick={() => setPasswordModal(false)} 
                                className="student-settings__cancel-btn"
                            >
                                Cancel
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default StudentSettingsPage;
