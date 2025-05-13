import React from 'react';
import { Link } from 'react-router-dom';
import styles from './Footer.module.css';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <div className={`container ${styles.footerContent}`}>
        <div className={styles.footerTop}>
          <div className={styles.footerBrand}>
            <Link to="/" className={styles.footerLogo}>
              <span className={styles.logoText}>Chem<span className={styles.highlight}>Solve</span></span>
            </Link>
            <p className={styles.footerDescription}>
              Interactive Chemistry Equation Solver - Balance equations, visualize molecules, and understand reactions in 3D.
            </p>
          </div>

          <div className={styles.footerLinks}>
            <div className={styles.footerLinkGroup}>
              <h4>Navigation</h4>
              <ul>
                <li><Link to="/">Home</Link></li>
                <li><Link to="/solver">Equation Solver</Link></li>
              </ul>
            </div>

            <div className={styles.footerLinkGroup}>
              <h4>Account</h4>
              <ul>
                <li><Link to="/login">Login</Link></li>
                <li><Link to="/register">Sign Up</Link></li>
              </ul>
            </div>

            <div className={styles.footerLinkGroup}>
              <h4>Resources</h4>
              <ul>
                <li><a href="#">Documentation</a></li>
                <li><a href="#">API</a></li>
                <li><a href="#">Help Center</a></li>
              </ul>
            </div>
          </div>
        </div>
        
        <div className={styles.footerBottom}>
          <p>&copy; {currentYear} ChemSolve. All rights reserved.</p>
          <div className={styles.footerBottomLinks}>
            <a href="#">Privacy Policy</a>
            <a href="#">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;