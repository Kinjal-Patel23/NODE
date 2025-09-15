import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
// import ReCAPTCHA from "react-google-recaptcha";
import "./Login.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState("");
  // const [captchaToken, setCaptchaToken] = useState("");
  // const siteKey = import.meta.env.VITE_SITE_KEY;
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    if (!email || !password) {
      setMessage("⚠️ Please enter both email and password");
      return;
    }
    // if (!captchaToken) {
    //   setMessage("⚠️ Please verify captcha first");
    //   return;
    // }
    axios
      .post("http://localhost:5000/login", {
        email,
        password,
        // token: captchaToken,
      })
      .then((res) => {
        if (res.data.jwtToken) {
          alert(res.data.message);
          localStorage.setItem("token", res.data.jwtToken);
          setEmail("");
          setPassword("");
          // setCaptchaToken("");
          if(res.data.userRole === "admin") {
            navigate("/admin");
          }
          else if (res.data.userRole === "superadmin") {
            navigate("/superadmin");
          }
          else {
            navigate("/home");
          }
        } else {
          setMessage(res.data.message);
        }
      })
      .catch((err) => {
        setMessage("Something went wrong. Please try again.");
        console.log(err);
      });
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <h2 className="login-title">Welcome Back</h2>
        <form onSubmit={handleLogin}>
          <div className="input-group">
            <label>Email Address</label>
            <input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="input-group">
            <label>Password</label>
            <div className="password-wrapper">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <span
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <i className="fas fa-eye-slash"></i>
                ) : (
                  <i className="fas fa-eye"></i>
                )}
              </span>
            </div>
          </div>
          <div className="forgot-password">
            <Link to="/forgotpsw">Forgot Password?</Link>
          </div>
          {/* {siteKey ? (
            <div className="captcha-wrapper">
              <ReCAPTCHA
                sitekey={siteKey}
                onChange={(token) => setCaptchaToken(token)}
                theme="dark"
              />
            </div>
          ) : (
            <p className="error">⚠️ Captcha site key not loaded!</p>
          )} */}
          <button type="submit" className="login-btn">
            Login
          </button>
        </form>
        <div className="divider">
          <span>OR</span>
        </div>
        <div className="social-login">
          <div className="social-icon google">
            <i className="fab fa-google"></i>
          </div>
          <div className="social-icon facebook">
            <i className="fab fa-facebook-f"></i>
          </div>
          <div className="social-icon github">
            <i className="fab fa-github"></i>
          </div>
        </div>
        <p className="signup-link">
          Don’t have an account? <Link to="/signup">Signup</Link>
        </p>
        {message && <p className="error-msg">{message}</p>}
      </div>
    </div>
  );
};

export default Login;