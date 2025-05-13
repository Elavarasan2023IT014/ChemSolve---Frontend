import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Button from '../../components/UI/Button/Button';
import styles from './DemoSolver.module.css';

const DemoSolver = () => {
  const [equation, setEquation] = useState('');
  const [result, setResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // List of demo equations users can try
  const exampleEquations = [
    'C6H12O6 + O2 -> CO2 + H2O',
    'NaOH + HCl -> NaCl + H2O',
    'CH4 + O2 -> CO2 + H2O'
  ];

  const handleInputChange = (e) => {
    setEquation(e.target.value);
    setError('');
  };

  const handleExampleClick = (example) => {
    setEquation(example);
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!equation.trim()) {
      setError('Please enter a chemical equation');
      return;
    }

    setIsLoading(true);
    setError('');
    
    try {
      // In a real implementation, this would be an API call
      // Here we're using a mock response for demo purposes
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Demo logic to generate a result
      let demoResult;
      
      if (equation.includes('C6H12O6')) {
        demoResult = {
          balancedEquation: 'C6H12O6 + 6O2 -> 6CO2 + 6H2O',
          steps: [
            'Identify all elements: C, H, O',
            'Balance Carbon: 6 on both sides',
            'Balance Hydrogen: 12 on both sides',
            'Balance Oxygen: 18 on both sides'
          ]
        };
      } else if (equation.includes('NaOH') && equation.includes('HCl')) {
        demoResult = {
          balancedEquation: 'NaOH + HCl -> NaCl + H2O',
          steps: [
            'Identify all elements: Na, O, H, Cl',
            'Elements are already balanced',
            'Na: 1 on both sides',
            'O: 1 on both sides',
            'H: 2 on both sides',
            'Cl: 1 on both sides'
          ]
        };
      } else if (equation.includes('CH4') && equation.includes('O2')) {
        demoResult = {
          balancedEquation: 'CH4 + 2O2 -> CO2 + 2H2O',
          steps: [
            'Identify all elements: C, H, O',
            'Balance Carbon: 1 on both sides',
            'Balance Hydrogen: 4 on both sides',
            'Balance Oxygen: 4 on both sides'
          ]
        };
      } else {
        demoResult = {
          balancedEquation: 'Demo mode: Limited to example equations',
          steps: [
            'Please try one of the example equations',
            'Or sign up for full access to our equation solver'
          ]
        };
      }
      
      setResult(demoResult);
    } catch (err) {
      setError('An error occurred while solving the equation. Please try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.demoSolverContainer}>
      <div className={styles.infoSection}>
        <h1>Chemical Equation Solver Demo</h1>
        <p>Try our equation solver with these example equations or input your own. Sign up for full access!</p>
      </div>

      <div className={styles.examplesSection}>
        <h3>Example Equations:</h3>
        <div className={styles.examplesList}>
          {exampleEquations.map((ex, index) => (
            <Button 
              key={index} 
              variant="outline" 
              size="small"
              onClick={() => handleExampleClick(ex)}
              className={styles.exampleButton}
            >
              {ex}
            </Button>
          ))}
        </div>
      </div>

      <form onSubmit={handleSubmit} className={styles.equationForm}>
        <div className={styles.inputGroup}>
          <label htmlFor="equation">Enter a chemical equation:</label>
          <input
            type="text"
            id="equation"
            placeholder="e.g. C6H12O6 + O2 -> CO2 + H2O"
            value={equation}
            onChange={handleInputChange}
            className={styles.equationInput}
          />
        </div>
        
        {error && <p className={styles.errorMessage}>{error}</p>}
        
        <div className={styles.buttonGroup}>
          <Button 
            type="submit" 
            variant="primary" 
            disabled={isLoading}
            className={styles.solveButton}
          >
            {isLoading ? 'Solving...' : 'Solve Equation'}
          </Button>
        </div>
      </form>

      {result && (
        <div className={styles.resultSection}>
          <h3>Balanced Equation:</h3>
          <div className={styles.balancedEquation}>{result.balancedEquation}</div>
          
          <h3>Steps:</h3>
          <ol className={styles.stepsList}>
            {result.steps.map((step, index) => (
              <li key={index}>{step}</li>
            ))}
          </ol>
          
          <div className={styles.signupPrompt}>
            <p>Like what you see? Get full access to our solver, save your equations, and view 3D molecular structures!</p>
            <div className={styles.signupButtons}>
              <Link to="/register">
                <Button variant="primary">Sign Up Now</Button>
              </Link>
              <Link to="/login">
                <Button variant="outline">Login</Button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DemoSolver;