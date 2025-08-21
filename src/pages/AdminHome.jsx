import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../firebase/config';
import '../styles/AdminHome.css';

const quotes = [
  "Empower one, uplift many.",
  "Teaching is the art of awakening possibility.",
  "Every module is a doorway to transformation.",
  "Lead with vision, teach with heart.",
  "Knowledge shared is power multiplied."
];

const backgrounds = [
  '/assets/bg1.jpg',
  '/assets/bg2.jpg',
  '/assets/bg3.jpg'
];

export default function AdminHome() {
  const [currentQuote, setCurrentQuote] = useState(quotes[0]);
  const [bgIndex, setBgIndex] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    // 🔐 Auth check
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        navigate('/login');
        return;
      }

      const userDoc = await getDoc(doc(db, 'users', user.uid));
      if (!userDoc.exists() || userDoc.data().role !== 'admin') {
        navigate('/login');
      }
    });

    // 🎬 Cinematic effects
    const quoteInterval = setInterval(() => {
      setCurrentQuote(quotes[Math.floor(Math.random() * quotes.length)]);
    }, 5000);

    const bgInterval = setInterval(() => {
      setBgIndex((prev) => (prev + 1) % backgrounds.length);
    }, 7000);

    return () => {
      clearInterval(quoteInterval);
      clearInterval(bgInterval);
      unsubscribe();
    };
  }, [navigate]);

  return (
    <div className="admin-home" style={{ backgroundImage: `url(${backgrounds[bgIndex]})` }}>
      <header className="admin-header">
        <button>Module Manager</button>
        <button>Dashboard</button>
        <button>Attendance</button>
      </header>
      <div className="quote-overlay">
        <h1>{currentQuote}</h1>
      </div>
    </div>
  );
}