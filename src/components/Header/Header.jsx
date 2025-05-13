import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import styles from './Header.module.css';
import Button from '../UI/Button/Button';

const Header = ({ isAuthenticated = false, onLogout }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const closeMenu = () => {
    setMenuOpen(false);
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  const handleLogout = () => {
    if (onLogout) {
      onLogout();
    }
    navigate('/');
    closeMenu();
  };

  return (
    <header className={`${styles.header} ${isScrolled ? styles.scrolled : ''}`}>
      <div className={`${styles.headerContent} container`}>
        <Link to="/" className={styles.logo}>
          <span className={styles.logoText}>Chem<span className={styles.highlight}>Solve</span></span>
        </Link>

        <div className={styles.mobileMenuToggle} onClick={toggleMenu}>
          <div className={`${styles.hamburger} ${menuOpen ? styles.active : ''}`}>
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>

        {isAuthenticated ? (
          // After login header navigation
          <nav className={`${styles.nav} ${menuOpen ? styles.active : ''}`}>
            <ul className={styles.navList}>
              <li className={styles.navItem}>
                <Link 
                  to="/solver" 
                  className={`${styles.navLink} ${isActive('/solver') ? styles.active : ''}`}
                  onClick={closeMenu}
                >
                  Equation Solver
                </Link>
              </li>
              <li className={styles.navItem}>
                <Link 
                  to="/previousEquations" 
                  className={`${styles.navLink} ${isActive('/previousEquations') ? styles.active : ''}`}
                  onClick={closeMenu}
                >
                  Previous Equations
                </Link>
              </li>
            </ul>

            <div className={styles.authButtons}>
              <Button variant="outline" size="small" onClick={handleLogout}>Logout</Button>
            </div>
          </nav>
        ) : (
          // Before login header navigation
          <nav className={`${styles.nav} ${menuOpen ? styles.active : ''}`}>
            <ul className={styles.navList}>
              <li className={styles.navItem}>
                <Link 
                  to="/" 
                  className={`${styles.navLink} ${isActive('/') ? styles.active : ''}`}
                  onClick={closeMenu}
                >
                  Home
                </Link>
              </li>
              <li className={styles.navItem}>
                <Link 
                  to="/demosolver" 
                  className={`${styles.navLink} ${isActive('/demosolver') ? styles.active : ''}`}
                  onClick={closeMenu}
                >
                  Demo Solver
                </Link>
              </li>
            </ul>

            <div className={styles.authButtons}>
              <Link to="/login" onClick={closeMenu}>
                <Button variant="outline" size="small">Login</Button>
              </Link>
              <Link to="/register" onClick={closeMenu}>
                <Button variant="primary" size="small">Sign Up</Button>
              </Link>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;