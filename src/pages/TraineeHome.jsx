import React from 'react';
import '../styles/TraineeHome.css';

const TraineeHome = () => {
  const backgrounds = [
    '/assets/trainee1.jpg',
    '/assets/trainee2.jpg',
    '/assets/trainee3.jpg',
  ];

  const randomBg = backgrounds[Math.floor(Math.random() * backgrounds.length)];

  return (
    <div className="trainee-home" style={{ backgroundImage: `url(${randomBg})` }}>
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