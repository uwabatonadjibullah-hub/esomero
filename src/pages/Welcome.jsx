import React from "react";
import { useNavigate } from "react-router-dom";
import "./Welcome.css";

const Welcome = () => {
  const navigate = useNavigate();

  return (
    <div className="welcome-container">
      {/* Background Layers */}
      <div
        className="background-layer parallax"
        style={{ backgroundImage: `url('/BG1.jpg')` }}
      ></div>
      <div
        className="background-slideshow"
        style={{ backgroundImage: `url('/BG1.jpg')` }}
      ></div>
      <div className="background-collage">
        <img src="/BG1.jpg" alt="BG1" className="bg-img img1" />
        <img src="/BG2.jpg" alt="BG2" className="bg-img img2" />
        <img src="/BG3.jpg" alt="BG3" className="bg-img img3" />
      </div>

      {/* Foreground Content */}
      <img src="/Logo.png" alt="KSP Logo" className="logo" />
      <h1>Welcome to Esomero Learning Portal</h1>
      <p>Empowering Trainers and Trainees Across All Faculties</p>

      <div className="button-group">
        <button onClick={() => navigate("/login")}>Login</button>
        <button onClick={() => navigate("/signup")}>Sign Up</button>
      </div>
    </div>
  );
};

export default Welcome;