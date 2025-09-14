import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import './ForgotPassword.css'

const Forgot = () => {
  const [forgotEmail, setForgotEmail] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleOtp = (e) => {
    e.preventDefault();
    if (!forgotEmail) {
      setMessage("⚠️ Please enter your email address");
      return;
    }
    axios
      .post("http://localhost:5000/forgotpsw", { forgotEmail })
      .then((res) => {
        if (res.data.otp) {
          alert(res.data.message);
          navigate("/otppage", { state: { email: forgotEmail } });
          setForgotEmail("");
          setMessage("");
        } else {
          setMessage(res.data.message);
        }
      })
      .catch((err) => {
        console.log(err);
        setMessage("⚠️ Something went wrong. Please try again.");
      });
  };

  return (
    <div className="forgot-page">
      <div className="forgot-card">
        <h2 className="forgot-title">🔑 Forgot Password</h2>
        <p className="subtitle">Enter your registered email to get an OTP</p>
        <form onSubmit={handleOtp}>
          <div className="input-group">
            <label>Email Address</label>
            <input
              type="email"
              placeholder="you@example.com"
              onChange={(e) => setForgotEmail(e.target.value)}
              value={forgotEmail}
              required
            />
          </div>
          <button type="submit" className="forgot-btn">Get OTP</button>
        </form>
        {message && <p className="error-msg">{message}</p>}
      </div>
    </div>
  );
};

export default Forgot;