import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import AuthForm from '../../components/AuthForm/AuthForm';
import Card from '../../components/UI/Card/Card';
import Button from '../../components/UI/Button/Button';
import styles from './Login.module.css';

const Login = ({ setIsAuthenticated, validateToken }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
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
    setLoading(true);
    setError('');

    try {
      const response = await axios.post('https://chemsolve-backend.onrender.com/api/auth/login', formData);
      const { token } = response.data;
      
      // Store token in localStorage
      localStorage.setItem('token', token);
      
      // Create session marker in sessionStorage (will be cleared when browser closes)
      sessionStorage.setItem('app_session', 'active');
      
      // Validate the token immediately after login
      if (validateToken) {
        await validateToken();
      } else {
        // Fallback if validateToken isn't provided
        setIsAuthenticated(true);
      }
      
      navigate('/solver');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to login. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.loginPage}>
      <div className={styles.container}>
        <Card className={styles.loginCard}>
          <div className={styles.logoSection}>
            <div className={styles.logoContainer}>
              <div className={styles.logo}>⚗️</div>
              <h2>ChemSolver</h2>
            </div>
            <p className={styles.tagline}>Your smart chemistry equation partner</p>
          </div>
          
          <h1 className={styles.title}>Welcome Back</h1>
          <p className={styles.subtitle}>Login to access your saved equations and continue exploring chemistry</p>
          
          {error && <div className={styles.errorAlert}>{error}</div>}
          
          <AuthForm 
            formData={formData}
            onChange={handleChange}
            onSubmit={handleSubmit}
            isLogin={true}
            loading={loading}
          />
          
          <div className={styles.formFooter}>
            <p>Don't have an account? <Link to="/register" className={styles.link}>Sign up</Link></p>
          </div>
          
          <div className={styles.demoAccess}>
            <p>Want to try without an account?</p>
            <Button 
              type="button" 
              onClick={() => navigate('/demosolver')} 
              variant="secondary"
              className={styles.demoButton}
            >
              Access Demo
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Login;