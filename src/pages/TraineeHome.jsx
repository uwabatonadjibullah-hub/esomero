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
  const navigate = useNavigate();

  useEffect(() => {
    // 🔐 Auth check
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        navigate('/login');
        return;
      }

      const userDoc = await getDoc(doc(db, 'users', user.uid));
      if (!userDoc.exists() || userDoc.data().role !== 'trainee') {
        navigate('/login');
      }
    });

    // 🎨 Random background
    const randomBg = backgrounds[Math.floor(Math.random() * backgrounds.length)];
    setBgImage(randomBg);

    return () => unsubscribe();
  }, [navigate]);

  return (
    <div className="trainee-home" style={{ backgroundImage: `url(${bgImage})` }}>
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