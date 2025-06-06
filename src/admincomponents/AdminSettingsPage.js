import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Edit2, Lock, Mail, Phone, User, Camera } from 'lucide-react';
import "./AdminSettingsPage.css";

const AdminSettingsPage = () => {
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
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const username = localStorage.getItem('username');
        if (username) {
            fetchUserDetails(username);
        } else {
            setError('No username found. Please log in again.');
            setIsLoading(false);
        }
    }, []);

    const fetchUserDetails = async (username) => {
        try {
            setIsLoading(true);
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
            
            setIsLoading(false);
        } catch (error) {
            console.error('Error fetching user details:', error);
            setError(error.response?.data || 'Failed to fetch user details');
            setIsLoading(false);
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
        formData.append('currentPassword', ''); // Add this line
    
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

    // Loading and Error States
    if (isLoading) return <div className="admin-settings-loading">Loading...</div>;
    if (error) return <div className="admin-settings-error">{error}</div>;
    if (!userData) return null;

    return (
        <div className="admin-settings-container">
            <div className="admin-settings__profile-section">
                <div className="admin-settings__profile-picture-container">
                    <input 
                        type="file" 
                        id="profilePicture"
                        accept="image/*"
                        onChange={handleProfilePictureChange}
                        style={{display: 'none'}} 
                    />
                    <label htmlFor="profilePicture" className="admin-settings__profile-picture-label">
                        <img 
                            src={previewImage || '/default-avatar.png'} 
                            alt="Profile" 
                            className="admin-settings__profile-picture" 
                        />
                        <div className="admin-settings__profile-picture-overlay">
                            <Camera className="admin-settings__camera-icon" />
                            <span>Change Picture</span>
                        </div>
                    </label>
                </div>
            </div>

            <div className="admin-settings__list">
                <div className="admin-settings__item">
                    <div className="admin-settings__item-content">
                        <User className="admin-settings__icon" />
                        <span>{userData.username}</span>
                    </div>
                </div>

                <div className="admin-settings__item">
                    <div className="admin-settings__item-content">
                        <Mail className="admin-settings__icon" />
                        {editMode.email ? (
                            <div className="admin-settings__edit-input-container">
                                <input
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => handleInputChange(e, 'email')}
                                    className="admin-settings__edit-input"
                                />
                                <div className="admin-settings__edit-buttons">
                                    <button onClick={() => updateField('email')} className="admin-settings__confirm-btn">✔️</button>
                                    <button onClick={() => toggleEditMode('email')} className="admin-settings__cancel-btn">❌</button>
                                </div>
                            </div>
                        ) : (
                            <>
                                <span>{userData.email || 'Not set'}</span>
                                <button 
                                    onClick={() => toggleEditMode('email')} 
                                    className="admin-settings__edit-btn"
                                >
                                    <Edit2 size={18} />
                                </button>
                            </>
                        )}
                    </div>
                </div>

                <div className="admin-settings__item">
                    <div className="admin-settings__item-content">
                        <Phone className="admin-settings__icon" />
                        {editMode.phoneNumber ? (
                            <div className="admin-settings__edit-input-container">
                                <input
                                    type="tel"
                                    value={formData.phoneNumber}
                                    onChange={(e) => handleInputChange(e, 'phoneNumber')}
                                    className="admin-settings__edit-input"
                                />
                                <div className="admin-settings__edit-buttons">
                                    <button onClick={() => updateField('phoneNumber')} className="admin-settings__confirm-btn">✔️</button>
                                    <button onClick={() => toggleEditMode('phoneNumber')} className="admin-settings__cancel-btn">❌</button>
                                </div>
                            </div>
                        ) : (
                            <>
                                <span>{userData.phoneNumber || 'Not set'}</span>
                                <button 
                                    onClick={() => toggleEditMode('phoneNumber')} 
                                    className="admin-settings__edit-btn"
                                >
                                    <Edit2 size={18} />
                                </button>
                            </>
                        )}
                    </div>
                </div>

                <div className="admin-settings__item">
                    <div className="admin-settings__item-content">
                        <Lock className="admin-settings__icon" />
                        <span>Password</span>
                        <button 
                            onClick={() => setPasswordModal(true)} 
                            className="admin-settings__change-password-btn"
                        >
                            Change
                        </button>
                    </div> 
                </div>
            </div>

            {passwordModal && (
                <div className="admin-settings__modal">
                    <div className="admin-settings__modal-content">
                        <h2>Change Password</h2>
                        <form onSubmit={handlePasswordChange}>
                            <input
                                type="password"
                                placeholder="Current Password"
                                value={passwordData.currentPassword}
                                onChange={(e) => setPasswordData(prev => ({
                                    ...prev, 
                                    currentPassword: e.target.value
                                }))}
                                className="admin-settings__modal-input"
                                required
                            />
                            <input
                                type="password"
                                placeholder="New Password"
                                value={passwordData.newPassword}
                                onChange={(e) => setPasswordData(prev => ({
                                    ...prev, 
                                    newPassword: e.target.value
                                }))}
                                className="admin-settings__modal-input"
                                required
                            />
                            <input
                                type="password"
                                placeholder="Confirm New Password"
                                value={passwordData.confirmPassword}
                                onChange={(e) => setPasswordData(prev => ({
                                    ...prev, 
                                    confirmPassword: e.target.value
                                }))}
                                className="admin-settings__modal-input"
                                required
                            />
                            <div className="admin-settings__modal-buttons">
                                <button 
                                    type="submit" 
                                    className="admin-settings__btn admin-settings__btn-primary"
                                >
                                    Change Password
                                </button>
                                <button 
                                    type="button"
                                    className="admin-settings__btn admin-settings__btn-secondary"
                                    onClick={() => setPasswordModal(false)}
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminSettingsPage;