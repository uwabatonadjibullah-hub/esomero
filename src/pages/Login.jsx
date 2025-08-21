import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../firebase/config';
import '../styles/Login.css';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const email = `${username}@ksp.com`;

      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Optional: Check if email is verified
      if (!user.emailVerified) {
        setError('Please verify your email before logging in.');
        return;
      }

      const userDoc = await getDoc(doc(db, 'users', user.uid));
      if (userDoc.exists()) {
        const role = userDoc.data().role;

        if (role === 'admin') {
          navigate('/admin'); // Admin = Trainer
        } else if (role === 'trainee') {
          navigate('/trainee');
        } else {
          setError('Unknown role. Please contact support.');
        }
      } else {
        setError('User profile not found. Please sign up first.');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('Login failed. Please check your username and password.');
    }
  };

  return (
    <div className="login-container">
      <h2>Welcome Back 🎬</h2>
      <form onSubmit={handleLogin}>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={e => setUsername(e.target.value)}
          required
        />
        <p className="email-preview">
          Logging in as: <strong>{username}@ksp.com</strong>
        </p>
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
        />
        <button type="submit">Login</button>
        {error && <p className="error">{error}</p>}
      </form>

      <div className="signup-prompt">
        <p>If you are a trainee and have not yet created an account, please sign up!</p>
        <button onClick={() => navigate('/signup')} className="signup-button">
          Sign Up
        </button>
      </div>
    </div>
  );
};

export default Login;