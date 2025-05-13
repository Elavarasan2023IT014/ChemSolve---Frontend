import React from 'react';
import styles from './Button.module.css';

const Button = ({ 
  children, 
  type = 'button', 
  onClick, 
  variant = 'primary', 
  size = 'medium',
  fullWidth = false,
  disabled = false,
  className = ''
}) => {
  return (
    <button
      type={type}
      onClick={onClick}
      className={`${styles.button} ${styles[variant]} ${styles[size]} ${fullWidth ? styles.fullWidth : ''} ${className}`}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

export default Button;