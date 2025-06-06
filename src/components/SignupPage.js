import axios from 'axios';
import React, { useState } from 'react'; // Removed unused useEffect
import { useNavigate } from 'react-router-dom';
//import kluLogo from './images/image copy.png';
import './LoginPage.css';

function Signup() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [retypePassword, setRetypePassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [validationErrors, setValidationErrors] = useState({});
  const [touchedFields, setTouchedFields] = useState({});
  const navigate = useNavigate();

  // Dynamic validation functions
  const validateUsername = (value) => {
    if (!value) return "Username cannot be blank";
    if (value.length < 4 || value.length > 20) return "Username must be between 4 and 20 characters";
    if (!/^[a-zA-Z0-9_-]+$/.test(value)) return "Username can only contain letters, numbers, underscores, and hyphens";
    return "";
  };

  const validateEmail = (value) => {
    if (!value) return "Email cannot be blank";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return "Please provide a valid email address";
    if (value.length > 100) return "Email must be less than 100 characters";
    return "";
  };

  const validatePhoneNumber = (value) => {
    if (!value) return "Phone number cannot be blank";
    if (!/^\+?[0-9]{10,14}$/.test(value)) return "Phone number must be 10 digits";
    return "";
  };

  const validatePassword = (value) => {
    if (!value) return "Password cannot be blank";
    
    const errors = [];
    if (value.length < 8 || value.length > 64) errors.push("Must be between 8 and 64 characters");
    if (!/(?=.*[A-Z])/.test(value)) errors.push("Must contain an uppercase letter");
    if (!/(?=.*[a-z])/.test(value)) errors.push("Must contain a lowercase letter");
    if (!/(?=.*\d)/.test(value)) errors.push("Must contain a number");
    // Removed unnecessary escape characters
    if (!/(?=.*[!@#$%^&*()_+\-=[\]{};"':,.<>/?])/.test(value)) errors.push("Must contain a special character");
    
    return errors.length > 0 ? errors : "";
  };

  const validateRetypePassword = (value) => {
    if (value !== password) return "Passwords do not match";
    return "";
  };

  // Handle field touch for dynamic validation
  const handleFieldTouch = (fieldName) => {
    setTouchedFields(prev => ({
      ...prev,
      [fieldName]: true
    }));
  };

  // Dynamic input change handlers with validation
  const handleUsernameChange = (e) => {
    const value = e.target.value;
    setUsername(value);
    
    // Validate and set errors only if field has been touched
    if (touchedFields.username) {
      const error = validateUsername(value);
      setValidationErrors(prev => ({
        ...prev,
        username: error
      }));
    }
  };

  const handleEmailChange = (e) => {
    const value = e.target.value;
    setEmail(value);
    
    if (touchedFields.email) {
      const error = validateEmail(value);
      setValidationErrors(prev => ({
        ...prev,
        email: error
      }));
    }
  };

  const handlePhoneNumberChange = (e) => {
    const value = e.target.value;
    setPhoneNumber(value);
    
    if (touchedFields.phoneNumber) {
      const error = validatePhoneNumber(value);
      setValidationErrors(prev => ({
        ...prev,
        phoneNumber: error
      }));
    }
  };

  const handlePasswordChange = (e) => {
    const value = e.target.value;
    setPassword(value);
    
    if (touchedFields.password) {
      const error = validatePassword(value);
      setValidationErrors(prev => ({
        ...prev,
        password: error
      }));
    }

    // Also validate retype password if it's not empty
    if (retypePassword && touchedFields.retypePassword) {
      const retypeError = validateRetypePassword(retypePassword);
      setValidationErrors(prev => ({
        ...prev,
        retypePassword: retypeError
      }));
    }
  };

  const handleRetypePasswordChange = (e) => {
    const value = e.target.value;
    setRetypePassword(value);
    
    if (touchedFields.retypePassword) {
      const error = validateRetypePassword(value);
      setValidationErrors(prev => ({
        ...prev,
        retypePassword: error
      }));
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    
    // Perform final validation before submission
    const errors = {};
    errors.username = validateUsername(username);
    errors.email = validateEmail(email);
    errors.phoneNumber = validatePhoneNumber(phoneNumber);
    errors.password = validatePassword(password);
    errors.retypePassword = validateRetypePassword(retypePassword);

    // Remove empty error strings
    Object.keys(errors).forEach(key => {
      if (errors[key] === "") delete errors[key];
    });

    // If there are validation errors, set them and prevent submission
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }

    const user = {
      username,
      email,
      phoneNumber,
      password
    };
    try {
      const response = await axios.post('http://localhost:8081/api/auth/signup', user);
      if (response.data.success) {
          console.log('Server response:', response.data);
      }

      setSuccessMessage("Registration successful!");
      setErrorMessage('');
      navigate('/');  
      window.scrollTo(0, 0);
  } catch (error) {
      console.error("Full error object:", error);
      console.error("Error response:", error.response);
      console.error("Error message:", error.message);
      
      if (error.response) {
          // The request was made and the server responded with a status code
          // that falls out of the range of 2xx
          console.error("Data:", error.response.data);
          console.error("Status:", error.response.status);
          console.error("Headers:", error.response.headers);
          
          const backendErrors = error.response.data;
          
          const mappedErrors = {};
          if (typeof backendErrors === 'object') {
              if (backendErrors.username) mappedErrors.username = backendErrors.username;
              if (backendErrors.email) mappedErrors.email = backendErrors.email;
              if (backendErrors.phoneNumber) mappedErrors.phoneNumber = backendErrors.phoneNumber;
              if (backendErrors.password) mappedErrors.password = backendErrors.password;
          } else {
              setErrorMessage(backendErrors || "Registration failed");
          }
          
          if (Object.keys(mappedErrors).length > 0) {
              setValidationErrors(mappedErrors);
          } else {
              setErrorMessage("Registration failed");
          }
      } else if (error.request) {
          // The request was made but no response was received
          console.error("No response received:", error.request);
          setErrorMessage("No response from server");
      } else {
          // Something happened in setting up the request that triggered an Error
          console.error("Error setting up request:", error.message);
          setErrorMessage("Error setting up request");
      }
  }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <div className="image-section" />
        <div className="login-section">
          <div className="login-header">
            
          </div>
          <form className="login-form" onSubmit={handleRegister}>
            {/* Username Input */}
            <label htmlFor="username">Username</label>
            <input 
              type="text" 
              id="username" 
              placeholder="Enter your username" 
              value={username}
              onChange={handleUsernameChange}
              onBlur={() => handleFieldTouch('username')}
              required 
            />
            {touchedFields.username && validationErrors.username && 
              <p style={{ color: 'red', fontSize: '0.8em', marginTop: '-10px' }}>
                {validationErrors.username}
              </p>
            }

            {/* Email Input */}
            <label htmlFor="email">Email</label>
            <input 
              type="email" 
              id="email" 
              placeholder="Enter your email" 
              value={email}
              onChange={handleEmailChange}
              onBlur={() => handleFieldTouch('email')}
              required 
            />
            {touchedFields.email && validationErrors.email && 
              <p style={{ color: 'red', fontSize: '0.8em', marginTop: '-10px' }}>
                {validationErrors.email}
              </p>
            }

            {/* Phone Number Input */}
            <label htmlFor="phoneNumber">Phone Number</label>
            <input 
              type="text" 
              id="phoneNumber" 
              placeholder="Enter your phone number" 
              value={phoneNumber}
              onChange={handlePhoneNumberChange}
              onBlur={() => handleFieldTouch('phoneNumber')}
              required 
            />
            {touchedFields.phoneNumber && validationErrors.phoneNumber && 
              <p style={{ color: 'red', fontSize: '0.8em', marginTop: '-10px' }}>
                {validationErrors.phoneNumber}
              </p>
            }

            {/* Password Input */}
            <label htmlFor="password">Password</label>
            <input 
              type="password" 
              id="password" 
              placeholder="Enter your password" 
              value={password}
              onChange={handlePasswordChange}
              onBlur={() => handleFieldTouch('password')}
              required 
            />
            {touchedFields.password && validationErrors.password && 
              <div style={{ color: 'red', fontSize: '0.8em', marginTop: '-10px' }}>
                {Array.isArray(validationErrors.password) ? (
                  <ul>
                    {validationErrors.password.map((error, index) => (
                      <li key={index}>{error}</li>
                    ))}
                  </ul>
                ) : (
                  validationErrors.password
                )}
              </div>
            }

            {/* Retype Password Input */}
            <label htmlFor="retypePassword">Retype Password</label>
            <input 
              type="password" 
              id="retypePassword" 
              placeholder="Retype your password" 
              value={retypePassword}
              onChange={handleRetypePasswordChange}
              onBlur={() => handleFieldTouch('retypePassword')}
              required 
            />
            {touchedFields.retypePassword && validationErrors.retypePassword && 
              <p style={{ color: 'red', fontSize: '0.8em', marginTop: '-10px' }}>
                {validationErrors.retypePassword}
              </p>
            }

            <button type="submit" className="next-button">Register</button>
          </form>
          {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
          {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}
          <div className="registration-link">
            <a href="/">Back to Login</a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Signup;