import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import "./OtpPage.css"

const OtpPage = () => {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [message, setMessage] = useState(""); 
  const navigate = useNavigate();
  const location = useLocation();
  const userEmail = location.state?.email || "";

  const handleChange = (index, value) => {
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus to next input
    if (value && index < 5) {
      const nextInput = document.querySelectorAll(`.otp-inputs input`)[index + 1];
      if (nextInput) nextInput.focus();
    }
  };

  const handleReset = () => {
    const enteredOtp = otp.join("");
    if (enteredOtp.length !== 6) {
      setMessage("⚠️ Please enter 6 digit OTP"); 
      return;
    }
    axios
      .post("http://localhost:5000/verifyotp", {
        email: userEmail,
        otp: enteredOtp,
      })
      .then((res) => {
        if (res.data.message.includes("✅")) {
          alert(res.data.message); 
          setMessage(""); 
          navigate("/newpassword", { state: { email: userEmail } });
        } else {
          setMessage(res.data.message); 
          if (res.data.message.includes("Invalid OTP")) {
            setOtp(["", "", "", "", "", ""]);
          }
        }
      })
      .catch(() => {
        setMessage("⚠️ Error verifying OTP");
      });
  };

  const handleResend = () => {
    axios
      .post("http://localhost:5000/resendotp", { email: userEmail })
      .then((res) => {
        if (res.data.message.includes("✅") || res.data.message.includes("🔄")) {
          alert(res.data.message); 
          setOtp(["", "", "", "", "", ""]);
        } else {
          setMessage(res.data.message); 
        }
      })
      .catch(() => {
        setMessage("⚠️ Error resending OTP");
      });
  };

  return (
    <div className="otp-page">
      <div className="otp-card">
        <h2 className="otp-title">Verify OTP</h2>
        <p className="otp-subtitle">Enter the 6-digit OTP sent to your email</p>
        <div className="otp-inputs">
          {otp.map((digit, index) => (
            <input
              key={index}
              type="text"
              maxLength="1"
              className="otp-input"
              value={digit}
              onChange={(e) => handleChange(index, e.target.value)}
            />
          ))}
        </div>
        <button className="verify-btn" onClick={handleReset}>
          Reset Password
        </button>
        <p className="resend-link" onClick={handleResend}>
          Resend OTP
        </p>
        {message && <p className="error-msg">{message}</p>}
      </div>
    </div>
  );
};

export default OtpPage;