import React from 'react';
import { Link } from 'react-router-dom';
import styles from './Hero.module.css';
import Button from '../UI/Button/Button';

const Hero = () => {
  return (
    <section className={styles.hero}>
      <div className={styles.particles}>
        {[...Array(15)].map((_, index) => (
          <div 
            key={index} 
            className={styles.particle}
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animationDuration: `${Math.random() * 20 + 10}s`,
              animationDelay: `${Math.random() * 5}s`,
              width: `${Math.random() * 30 + 5}px`,
              height: `${Math.random() * 30 + 5}px`,
              opacity: Math.random() * 0.5 + 0.1
            }}
          ></div>
        ))}
      </div>
      <div className="container">
        <div className={styles.heroContent}>
          <h1 className={styles.heroTitle}>
            <span className={styles.heroTitleMain}>Interactive Chemistry</span>
            <span className={styles.heroTitleSub}>Equation Solver</span>
          </h1>
          <p className={styles.heroDescription}>
            Solve, balance, and visualize chemical reactions in 3D with our
            powerful, intuitive platform. Understand chemistry like never before.
          </p>
          <div className={styles.heroButtons}>
            <Link to="/solver">
              <Button variant="primary" size="large">Try Equation Solver</Button>
            </Link>
            <Link to="/register">
              <Button variant="outline" size="large">Create Free Account</Button>
            </Link>
          </div>
        </div>
        <div className={styles.heroImageContainer}>
          <div className={styles.heroImage}>
            <div className={styles.molecule}>
              <div className={styles.atom} style={{ backgroundColor: '#FF4757' }}></div>
              <div className={styles.atom} style={{ backgroundColor: '#2ED573', left: '60%', top: '30%' }}></div>
              <div className={styles.atom} style={{ backgroundColor: '#00BFFF', left: '20%', top: '70%' }}></div>
              <div className={styles.bond}></div>
              <div className={styles.bond} style={{ transform: 'rotate(120deg)' }}></div>
              <div className={styles.bond} style={{ transform: 'rotate(240deg)' }}></div>
            </div>
          </div>
        </div>
      </div>
      <div className={styles.heroShape}></div>
    </section>
  );
};

export default Hero;