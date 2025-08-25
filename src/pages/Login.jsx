import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword, sendEmailVerification } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../firebase/config';
import '../styles/Login.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [userToVerify, setUserToVerify] = useState(null);
  const [resendMessage, setResendMessage] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setResendMessage('');

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      if (!user.emailVerified) {
        setUserToVerify(user);
        setError('📩 Please verify your email before logging in.');
        return;
      }

      const userDoc = await getDoc(doc(db, 'users', user.uid));
      if (userDoc.exists()) {
        const role = userDoc.data().role;

        if (role === 'admin') {
          navigate('/admin');
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
      setError('Login failed. Please check your email and password.');
    }
  };

  const handleResendVerification = async () => {
    if (userToVerify) {
      try {
        await sendEmailVerification(userToVerify);
        setResendMessage('✅ Verification email resent. Check your inbox!');
      } catch (err) {
        console.error('Resend error:', err);
        setResendMessage('⚠️ Failed to resend email. Try again later.');
      }
    }
  };

  return (
    <div className="login-container">
      <h2>Welcome Back 🎬</h2>
      <form onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
        />
        <button type="submit">Login</button>
        {error && <p className="error">{error}</p>}
        {userToVerify && (
          <div className="resend-container">
            <button type="button" onClick={handleResendVerification}>
              Resend Verification Email
            </button>
            {resendMessage && <p className="info">{resendMessage}</p>}
          </div>
        )}
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