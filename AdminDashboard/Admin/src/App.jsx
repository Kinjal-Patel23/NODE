import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Auth/Login";
import Signup from "./pages/Auth/Signup";
import Forgot from "./pages/Auth/ForgotPassword";
import OtpPage from "./pages/Auth/OtpPage";
import NewPassword from "./pages/Auth/NewPassword";
import Home from "./pages/Home";
import SuperAdmin from "./pages/Dashboard/SuperAdmin";
import Admin from "./pages/Dashboard/AdminDashboard";
import ProtectedRoute from "./pages/ProtectedRoute";

const App = () => {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/forgotpsw" element={<Forgot />} />
          <Route path="/otppage" element={<OtpPage />} />
          <Route path="/newpassword" element={<NewPassword />} />
          <Route path="/signup" element={<Signup />} />
          <Route
            path="/superadmin"
            element={
              <ProtectedRoute>
                <SuperAdmin />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <Admin />
              </ProtectedRoute>
            }
          />
          <Route
            path="/home"
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </>
  );
};

export default App;
