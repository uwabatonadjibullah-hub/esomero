import React from "react";
import { useNavigate } from "react-router-dom";
import "./Welcome.css";
import Logo from "../assets/Logo.png";
import BG1 from "../assets/BG1.jpg";
import BG2 from "../assets/BG2.jpg";
import BG3 from "../assets/BG3.jpg";

const Welcome = () => {
  const navigate = useNavigate();

  return (
    <div className="welcome-container">
      {/* Background Layers */}
      <div
        className="background-layer parallax"
        style={{ backgroundImage: `url(${BG1})` }}
      ></div>
      <div
        className="background-slideshow"
        style={{ backgroundImage: `url(${BG1})` }}
      ></div>
      <div className="background-collage">
        <img src={BG1} alt="BG1" className="bg-img img1" />
        <img src={BG2} alt="BG2" className="bg-img img2" />
        <img src={BG3} alt="BG3" className="bg-img img3" />
      </div>

      {/* Foreground Content */}
      <img src={Logo} alt="KSP Logo" className="logo" />
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