import React from 'react';
import Button from '../UI/Button/Button';
import styles from './AuthForm.module.css';

const AuthForm = ({ formData, onChange, onSubmit, isLogin, loading }) => {
  return (
    <form className={styles.form} onSubmit={onSubmit}>
      {!isLogin && (
        <div className={styles.formGroup}>
          <label htmlFor="username">Username</label>
          <div className={styles.inputWrapper}>
            <span className={styles.inputIcon}>👤</span>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username || ''}
              onChange={onChange}
              placeholder="Enter your username"
              required={!isLogin}
            />
          </div>
        </div>
      )}
      
      <div className={styles.formGroup}>
        <label htmlFor="email">Email Address</label>
        <div className={styles.inputWrapper}>
          <span className={styles.inputIcon}>✉️</span>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={onChange}
            placeholder="Enter your email address"
            required
          />
        </div>
      </div>
      
      <div className={styles.formGroup}>
        <label htmlFor="password">Password</label>
        <div className={styles.inputWrapper}>
          <span className={styles.inputIcon}>🔒</span>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={onChange}
            placeholder={isLogin ? "Enter your password" : "Create a strong password"}
            required
          />
        </div>
      </div>
      
      {!isLogin && (
        <div className={styles.formGroup}>
          <label htmlFor="confirmPassword">Confirm Password</label>
          <div className={styles.inputWrapper}>
            <span className={styles.inputIcon}>🔒</span>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword || ''}
              onChange={onChange}
              placeholder="Confirm your password"
              required={!isLogin}
            />
          </div>
        </div>
      )}
      
      {isLogin && (
        <div className={styles.forgotPassword}>
          <a href="#reset-password">Forgot password?</a>
        </div>
      )}
      
      <Button
        type="submit"
        variant="primary"
        className={styles.submitButton}
        disabled={loading}
      >
        {loading ? (
          <span className={styles.loadingSpinner}></span>
        ) : isLogin ? (
          'Sign In'
        ) : (
          'Create Account'
        )}
      </Button>
      
      {isLogin && (
        <div className={styles.divider}>
          <span>Or continue with</span>
        </div>
      )}
      
      {isLogin && (
        <div className={styles.socialButtons}>
          <button type="button" className={`${styles.socialButton} ${styles.google}`}>
            <span>G</span>
          </button>
          <button type="button" className={`${styles.socialButton} ${styles.github}`}>
            <span>GH</span>
          </button>
        </div>
      )}
    </form>
  );
};

export default AuthForm;