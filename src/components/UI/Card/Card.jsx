import React from 'react';
import styles from './Card.module.css';

const Card = ({ children, className = '', hover = false }) => {
  return (
    <div className={`${styles.card} ${hover ? styles.hover : ''} ${className}`}>
      {children}
    </div>
  );
};

export default Card;