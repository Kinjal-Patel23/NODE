import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import "./Signup.css";

const Signup = () => {
  const [username, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPass, setConfirmPass] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);
  const [message, setMessage] = useState("");
  
  const navigate = useNavigate();

  const handleSignup = (e) => {
    e.preventDefault();
    if (password !== confirmPass) {
      setMessage("⚠️ Passwords do not match");
      return;
    }
    axios
      .post("http://localhost:5000/signup", { username, email, password })
      .then((res) => {
        if (res.data.message === "User registered successfully") {
          alert("✅ User created successfully");
          setUserName("");
          setEmail("");
          setPassword("");
          setConfirmPass("");
          navigate("/");
        } else {
          setMessage(res.data.message);
        }
      })
      .catch((err) => {
        console.log(err);
        setMessage("❌ Something went wrong. Please try again.");
      });
  };

  return (
    <div className="signup-page">
      <div className="signup-card">
        <h2 className="signup-title">📝 Create Account</h2>
        <form onSubmit={handleSignup}>
          <div className="input-group">
            <label>Username</label>
            <input
              type="text"
              placeholder="👤 Enter your username"
              value={username}
              onChange={(e) => setUserName(e.target.value)}
              required
            />
          </div>
          <div className="input-group">
            <label>Email Address</label>
            <input
              type="email"
              placeholder="📧 you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="input-group">
            <label>Password</label>
            <div className="password-wrapper">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="🔑 Create a password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <span
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
              >
                <i className={showPassword ? "fas fa-eye-slash" : "fas fa-eye"}></i>
              </span>
            </div>
          </div>
          <div className="input-group">
            <label>Confirm Password</label>
            <div className="password-wrapper">
              <input
                type={showConfirmPass ? "text" : "password"}
                placeholder="🔒 Confirm your password"
                value={confirmPass}
                onChange={(e) => setConfirmPass(e.target.value)}
                required
              />
              <span
                className="password-toggle"
                onClick={() => setShowConfirmPass(!showConfirmPass)}
              >
                <i className={showConfirmPass ? "fas fa-eye-slash" : "fas fa-eye"}></i>
              </span>
            </div>
          </div>
          <button type="submit" className="signup-btn">Signup</button>
        </form>
        <p className="login-link">
          Already have an account? <Link to="/">Login</Link>
        </p>
        {message && <p className="error-msg">{message}</p>}
      </div>
    </div>
  );
};

export default Signup;