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

const TraineeHome = () => {
  const [bgImage, setBgImage] = useState(backgrounds[0]);
  const [fadeIn, setFadeIn] = useState(true);
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
          navigate('/unauthorized'); // Optional fallback page
        } else {
          setLoading(false);
        }
      } catch (error) {
        console.error('Error verifying role:', error);
        navigate('/login');
      }
    });

    // 🎨 Background transition
    const interval = setInterval(() => {
      const nextBg = backgrounds[Math.floor(Math.random() * backgrounds.length)];
      setFadeIn(false); // Trigger fade-out
      setTimeout(() => {
        setBgImage(nextBg);
        setFadeIn(true); // Trigger fade-in
      }, 300); // Match CSS transition duration
    }, 7000);

    return () => {
      unsubscribe();
      clearInterval(interval);
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
    <div
      className={`trainee-home ${fadeIn ? 'fade-in' : 'fade-out'}`}
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      <div className="overlay">
        <h1>Welcome, Trainee 🌟</h1>
        <p>Your journey starts here. Learn, grow, and shine.</p>
        <div className="buttons">
          <button onClick={() => alert('Launching your modules...')}>📚 Start Training</button>
          <button onClick={() => alert('Viewing your progress...')}>📈 My Progress</button>
          <button onClick={() => alert('Logging out...')}>🚪 Logout</button>
        </div>
      </div>
    </div>
  );
};

export default TraineeHome;