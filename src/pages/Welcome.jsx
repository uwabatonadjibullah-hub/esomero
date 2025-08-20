import React from "react";
import { useNavigate } from "react-router-dom";
import "./Welcome.css";
import Logo from "../assets/Logo.png";

const Welcome = () => {
  const navigate = useNavigate();

  return (
    <div className="welcome-container">
      <img src={Logo} alt="KSP Logo" className="logo" />
      <h1>Welcome to KSP Rwanda Learning Portal</h1>
      <p>Empowering Trainers and Trainees Across All Faculties</p>
      <button onClick={() => navigate("/login")}>Login</button>
    </div>
  );
};

export default Welcome;