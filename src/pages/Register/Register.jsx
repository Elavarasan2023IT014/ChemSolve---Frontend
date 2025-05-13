import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import AuthForm from '../../components/AuthForm/AuthForm';
import Card from '../../components/UI/Card/Card';
import styles from './Register.module.css';

const Register = () => {
  const [formData, setFormData] = useState({
    username: '', // Changed from 'name' to match backend
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Basic validation
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    
    setLoading(true);
    setError('');

    try {
      await axios.post('https://chemsolve-backend.onrender.com/api/auth/register', {
        username: formData.username,
        email: formData.email,
        password: formData.password,
      });
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to register. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.registerPage}>
      <div className={styles.container}>
        <Card className={styles.registerCard}>
          <div className={styles.logoSection}>
            <div className={styles.logoContainer}>
              <div className={styles.logo}>⚗️</div>
              <h2>ChemSolver</h2>
            </div>
            <p className={styles.tagline}>Your smart chemistry equation partner</p>
          </div>
          
          <h1 className={styles.title}>Create Account</h1>
          <p className={styles.subtitle}>Join our community of chemistry enthusiasts</p>
          
          {error && <div className={styles.errorAlert}>{error}</div>}
          
          <AuthForm 
            formData={formData}
            onChange={handleChange}
            onSubmit={handleSubmit}
            isLogin={false}
            loading={loading}
          />
          
          <div className={styles.formFooter}>
            <p>Already have an account? <Link to="/login" className={styles.link}>Sign in</Link></p>
          </div>
          
          <div className={styles.featuresList}>
            <h3>What you'll get:</h3>
            <ul>
              <li>Save your solved equations</li>
              <li>Access to equation history</li>
              <li>Export solution results</li>
              <li>Molecular 3D visualizations</li>
            </ul>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Register;