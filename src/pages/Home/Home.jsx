import React from 'react';
import { Link } from 'react-router-dom';
import styles from './Home.module.css';
import Button from '../../components/UI/Button/Button';
import Hero from '../../components/Hero/Hero';
import Features from '../../components/Features/Features';

const Home = () => {
  return (
    <div className={styles.home}>
      <Hero />
      
      <section className={`${styles.intro} section`}>
        <div className="container">
          <div className={styles.introContent}>
            <h2 className={styles.sectionTitle}>
              Transform <span className="text-primary">Chemistry Learning</span>
            </h2>
            <p className={styles.sectionDescription}>
              ChemSolve is an advanced interactive platform designed to help students, educators,
              and chemistry enthusiasts understand chemical reactions at a deeper level. Visualize
              molecules in 3D, balance equations automatically, and explore the fascinating world
              of chemistry with our cutting-edge tools.
            </p>
            <div className={styles.introButtons}>
              <Link to="/solver">
                <Button variant="primary" size="large">Try Equation Solver</Button>
              </Link>
              <a href="#features">
                <Button variant="outline" size="large">Explore Features</Button>
              </a>
            </div>
          </div>
        </div>
      </section>
      
      <Features />
      
      <section id="how-it-works" className={`${styles.howItWorks} section`}>
        <div className="container">
          <h2 className={`${styles.sectionTitle} text-center`}>
            How It <span className="text-primary">Works</span>
          </h2>
          <p className={`${styles.sectionDescription} text-center`}>
            Using ChemSolve is simple and intuitive. Follow these steps to get started:
          </p>
          
          <div className={styles.steps}>
            <div className={styles.step}>
              <div className={styles.stepNumber}>1</div>
              <h3>Enter Your Equation</h3>
              <p>
                Type in your chemical equation in the input field. You can use the formula
                notation like H2O, NaCl, C6H12O6, etc.
              </p>
            </div>
            
            <div className={styles.step}>
              <div className={styles.stepNumber}>2</div>
              <h3>Click "Solve"</h3>
              <p>
                Hit the solve button and let our advanced algorithm balance the equation and
                analyze the reaction properties.
              </p>
            </div>
            
            <div className={styles.step}>
              <div className={styles.stepNumber}>3</div>
              <h3>Explore Results</h3>
              <p>
                View the balanced equation, explore 3D molecular structures, and understand
                reaction mechanics through our visual interface.
              </p>
            </div>
            
            <div className={styles.step}>
              <div className={styles.stepNumber}>4</div>
              <h3>Save & Share</h3>
              <p>
                Create an account to save your work, build a collection of solved equations,
                and share your insights with others.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      <section className={`${styles.cta} section`}>
        <div className="container">
          <div className={styles.ctaContent}>
            <h2>Ready to master chemical equations?</h2>
            <p>
              Join thousands of students and educators who are enhancing their chemistry
              understanding with ChemSolve's interactive tools.
            </p>
            <Link to="/register">
              <Button variant="primary" size="large">Get Started For Free</Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;