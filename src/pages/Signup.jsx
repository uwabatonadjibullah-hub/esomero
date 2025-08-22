import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createUserWithEmailAndPassword, sendEmailVerification } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '../firebase/config';
import '../styles/Signup.css';

const Signup = () => {
  const [formData, setFormData] = useState({
    name: '',
    username: '',
    gender: '',
    password: '',
    faculty: '',
    program: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      const email = `${formData.username}@gmail.com`;

      // Create user in Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(auth, email, formData.password);
      const uid = userCredential.user.uid;

      // Save trainee info in Firestore
      await setDoc(doc(db, 'users', uid), {
        uid,
        name: formData.name,
        email,
        gender: formData.gender,
        faculty: formData.faculty,
        program: formData.program,
        role: 'trainee',
        username: formData.username
      });

      // Optional: Send email verification
      await sendEmailVerification(userCredential.user);

      setSuccess('Signup successful! Please check your email for verification.');
      setTimeout(() => navigate('/login'), 3000);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="signup-container">
      <h2>Join KSP Rwanda 🎓</h2>
      <form onSubmit={handleSignup}>
        <input
          name="name"
          type="text"
          placeholder="Full Name"
          value={formData.name}
          onChange={handleChange}
          required
        />
        <input
          name="username"
          type="text"
          placeholder="Username"
          value={formData.username}
          onChange={handleChange}
          required
        />
        {formData.username && (
          <p className="email-preview">
            Your KSP email will be: <strong>{formData.username}@gmail.com</strong>
          </p>
        )}
        <select name="gender" value={formData.gender} onChange={handleChange} required>
          <option value="">Select Gender</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
          <option value="Other">Other</option>
        </select>
        <input
          name="password"
          type="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          required
        />
        <input
          name="faculty"
          type="text"
          placeholder="Faculty"
          value={formData.faculty}
          onChange={handleChange}
          required
        />
        <select name="program" value={formData.program} onChange={handleChange} required>
          <option value="">Select Program</option>
          <option value="Day">Day</option>
          <option value="Night">Night</option>
          <option value="Weekend">Weekend</option>
        </select>
        <button type="submit">Sign Up</button>
        {error && <p className="error">{error}</p>}
        {success && <p className="success">{success}</p>}
      </form>
    </div>
  );
};

export default Signup;