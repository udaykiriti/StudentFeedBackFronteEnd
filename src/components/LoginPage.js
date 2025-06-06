import axios from "axios";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import kluLogo from './images/sfespic.png';
import "./LoginPage.css";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [captchaText, setCaptchaText] = useState("");
  const [userCaptcha, setUserCaptcha] = useState("");
  const [captchaError, setCaptchaError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const generateCaptcha = () => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < 6; i++) {
      result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    setCaptchaText(result);
  };

  useEffect(() => {
    generateCaptcha();
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();

    if (userCaptcha !== captchaText) {
      setCaptchaError("Invalid captcha. Please try again.");
      generateCaptcha();
      setUserCaptcha("");
      return;
    }
    try {
      const response = await axios.post(
        "http://localhost:8081/api/auth/login",{username,password,}
      );
      if (response.status === 200) {
        const { role } = response.data;

        localStorage.setItem("username", username);
        localStorage.setItem("role", role);

        if (role === "admin") {
          navigate("/admin-dashboard/admin-home");
        } else if (role === "faculty") {
          navigate("/faculty-dashboard");
        } else {
          navigate("/student-dashboard/home");
        }
      }
    } catch (error) {
      console.error("There was an error logging in!", error);
      setErrorMessage("Login failed: Invalid credentials");
      generateCaptcha();
      setUserCaptcha("");
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const CaptchaImage = React.memo(({ text }) => {
    const canvasRef = React.useRef(null);
    useEffect(() => {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      ctx.fillStyle = '#f0f0f0';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      for (let i = 0; i < 50; i++) {
        ctx.strokeStyle = `rgb(${Math.random() * 255},${Math.random() * 255},${Math.random() * 255})`;
        ctx.beginPath();
        ctx.moveTo(Math.random() * canvas.width, Math.random() * canvas.height);
        ctx.lineTo(Math.random() * canvas.width, Math.random() * canvas.height);
        ctx.stroke();
      }
      ctx.font = '24px Arial';
      ctx.fillStyle = '#000';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(text, canvas.width / 2, canvas.height / 2);
    }, [text]);
    return (
      <canvas
        ref={canvasRef}
        width={150}
        height={50}
        onClick={generateCaptcha}
        style={{ cursor: 'pointer' }}
      />
    );
  });

  return (
    <div className="login-container">
      <div className="login-box">
        <div className="image-section" />
        <div className="login-section">
          <div className="login-header">
            <img src={kluLogo} alt="K L University Logo" className="klu-logo" />
            <h1>Student Feedback</h1>
          </div>
          <p className="subtitle">The key to happiness is to sign in.</p>
          <form className="login-form" onSubmit={handleLogin}>
            <div className="input-group">
              <span className="input-label">Username</span>
              <input
                type="text"
                id="username"
                placeholder="Enter your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="input-field"
              />
            </div>

            <div className="input-group">
              <span className="input-label">Password</span>
              <div className="password-wrapper">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="input-field"
                />
                <span className="password-toggle" onClick={togglePasswordVisibility}>
                  {showPassword ? (
                    <span className="eye-icon">👁️</span>
                  ) : (
                    <span className="eye-icon">👁️‍🗨️</span>
                  )}
                </span>
              </div>
            </div>

            <div className="input-group">
              <span className="input-label">Captcha</span>
              <div className="captcha-container">
                <CaptchaImage text={captchaText} />
              </div>
              <input
                type="text"
                placeholder="Enter the captcha text"
                value={userCaptcha}
                onChange={(e) => setUserCaptcha(e.target.value)}
                required
                className="input-field"
              />
              {captchaError && (
                <p className="captcha-error">{captchaError}</p>
              )}
            </div>
            <a href="/forgot-password" className="forgot-password">
              Forgot Password?
            </a>
            <button type="submit" className="next-button">
              Login
            </button>
          </form>
          {errorMessage && <p className="error-message">{errorMessage}</p>}
          <div className="registration-link">
            <a href="/signup"> Signup</a>
          </div>
        </div>
      </div>
    </div>
  );
}
export default Login;