import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import "./NewPassword.css";

const NewPassword = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [newPass, setNewPass] = useState("");
  const [confirmPass, setConfirmPass] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const userEmail = location.state?.email || "";

  const handleSave = () => {
    setMessage("");
    if (!newPass || !confirmPass) {
      setMessage("⚠️ Please fill both fields");
      return;
    }
    if (newPass !== confirmPass) {
      setMessage("❌ Passwords do not match");
      return;
    }
    axios
      .post("http://localhost:5000/newpassword", {
        email: userEmail,
        password: newPass,
      })
      .then((res) => {
        if (res.data.message === "✅ Password updated successfully") {
          alert(res.data.message);
          navigate("/");
        } else {
          setMessage(res.data.message);
        }
      })
      .catch((err) => {
        console.log(err);
        setMessage("❌ Error updating password");
      });
  };

  return (
    <div className="newpass-page">
      <div className="newpass-card">
        <h2 className="newpass-title">Set New Password</h2>
        <p className="newpass-subtitle">Enter your new password below</p>
        <form onSubmit={(e) => { e.preventDefault(); handleSave(); }}>
          <div className="input-group">
            <label>New Password</label>
            <div className="password-wrapper">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={newPass}
                onChange={(e) => setNewPass(e.target.value)}
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
                type={showConfirm ? "text" : "password"}
                placeholder="••••••••"
                value={confirmPass}
                onChange={(e) => setConfirmPass(e.target.value)}
              />
              <span
                className="password-toggle"
                onClick={() => setShowConfirm(!showConfirm)}
              >
                <i className={showConfirm ? "fas fa-eye-slash" : "fas fa-eye"}></i>
              </span>
            </div>
          </div>
          <button type="submit" className="save-btn">
            Save Password
          </button>
        </form>
        {message && (
          <p
            className={
              message.includes("⚠️") || message.includes("❌")
                ? "error-msg"
                : "success-msg"
            }
          >
            {message}
          </p>
        )}
      </div>
    </div>
  );
};

export default NewPassword;