import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../firebase/config';
import '../styles/TraineeHome.css';

const backgrounds = [
  '/assets/trainee1.jpg',
  '/assets/trainee2.jpg',
  '/assets/trainee3.jpg',
];

const quotes = [
  "Every step forward is a victory.",
  "You are the author of your own success.",
  "Learning is your superpower.",
  "Grow through what you go through.",
  "Your journey is just beginning."
];

const TraineeHome = () => {
  const [bgImage, setBgImage] = useState(backgrounds[0]);
  const [fadeIn, setFadeIn] = useState(true);
  const [currentQuote, setCurrentQuote] = useState(quotes[0]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // 🔐 Auth check
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        navigate('/login');
        return;
      }

      try {
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        const role = userDoc.exists() ? userDoc.data().role : null;

        if (role !== 'trainee') {
          navigate('/unauthorized');
        } else {
          setLoading(false);
        }
      } catch (error) {
        console.error('Error verifying role:', error);
        navigate('/login');
      }
    });

    // 🎨 Background transition
    const bgInterval = setInterval(() => {
      const nextBg = backgrounds[Math.floor(Math.random() * backgrounds.length)];
      setFadeIn(false);
      setTimeout(() => {
        setBgImage(nextBg);
        setFadeIn(true);
      }, 300);
    }, 7000);

    // 💬 Quote rotation
    const quoteInterval = setInterval(() => {
      const nextQuote = quotes[Math.floor(Math.random() * quotes.length)];
      setCurrentQuote(nextQuote);
    }, 5000);

    return () => {
      unsubscribe();
      clearInterval(bgInterval);
      clearInterval(quoteInterval);
    };
  }, [navigate]);

  if (loading) {
    return (
      <div className="trainee-home loading-screen">
        <h2>Verifying access...</h2>
      </div>
    );
  }

  return (
    <div className="trainee-home-wrapper">
      {/* Left Side: Text & Buttons */}
      <div className="trainee-left">
        <h1>Welcome, Trainee 🌟</h1>
        <p>Your journey starts here. Learn, grow, and shine.</p>
        <blockquote className="quote">{currentQuote}</blockquote>
        <div className="buttons">
          <button onClick={() => alert('Launching your modules...')}>📚 Start Training</button>
          <button onClick={() => alert('Viewing your progress...')}>📈 My Progress</button>
          <button onClick={() => alert('Logging out...')}>🚪 Logout</button>
        </div>
      </div>

      {/* Right Side: Fading Background */}
      <div
        className={`trainee-right ${fadeIn ? 'fade-in' : 'fade-out'}`}
        style={{ backgroundImage: `url(${bgImage})` }}
      />
    </div>
  );
};

export default TraineeHome;