import React, { useState } from 'react';
import styles from './EquationForm.module.css';
import Button from '../UI/Button/Button';
import Card from '../UI/Card/Card';

const EquationForm = ({ onSolveEquation = () => {} }) => {
  const [equation, setEquation] = useState('');
  const [error, setError] = useState('');
  const [showExamples, setShowExamples] = useState(false);

  const exampleEquations = [
    { name: 'Combustion of Methane', equation: 'CH4 + O2 -> CO2 + H2O' },
    { name: 'Photosynthesis', equation: 'CO2 + H2O -> C6H12O6 + O2' },
    { name: 'Neutralization', equation: 'HCl + NaOH -> NaCl + H2O' },
    { name: 'Iron Oxidation', equation: 'Fe + O2 -> Fe2O3' },
    { name: 'Fermentation', equation: 'C6H12O6 -> C2H5OH + CO2' }
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!equation.trim()) {
      setError('Please enter an equation');
      return;
    }
    
    if (!equation.includes('->') && !equation.includes('=>') && !equation.includes('=')) {
      setError('Please include a reaction arrow (-> or => or =) in your equation');
      return;
    }
    
    setError('');
    onSolveEquation(equation);
  };

  const selectExample = (exampleEquation) => {
    setEquation(exampleEquation);
    setShowExamples(false);
  };

  return (
    <div className={styles.equationFormContainer}>
      <Card className={styles.formCard}>
        <h2 className={styles.formTitle}>Chemical Equation Solver</h2>
        <p className={styles.formDescription}>
          Enter a chemical equation to balance and solve. Use the arrow symbol (-) to separate reactants and products.
        </p>
        
        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.inputGroup}>
            <label htmlFor="equation" className={styles.label}>
              Chemical Equation
            </label>
            <div className={styles.inputWrapper}>
              <input
                id="equation"
                type="text"
                className={styles.input}
                value={equation}
                onChange={(e) => setEquation(e.target.value)}
                placeholder="e.g., H2 + O2 -> H2O"
                autoComplete="off"
              />
              <button 
                type="button"
                className={styles.exampleButton} 
                onClick={() => setShowExamples(!showExamples)}
              >
                <i className="fas fa-lightbulb"></i>
                <span>Examples</span>
              </button>
            </div>
            {error && <p className={styles.errorMessage}>{error}</p>}
            
            {showExamples && (
              <div className={styles.examplesDropdown}>
                <h4>Common Chemical Equations</h4>
                <ul className={styles.examplesList}>
                  {exampleEquations.map((ex, index) => (
                    <li key={index} onClick={() => selectExample(ex.equation)}>
                      <span className={styles.exampleName}>{ex.name}:</span> 
                      <span className={styles.exampleEquation}>{ex.equation}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
          
          <div className={styles.buttonGroup}>
            <Button type="submit" className={styles.solveButton}>
              <span>Solve Equation</span>
              <i className="fas fa-flask"></i>
            </Button>
          </div>
        </form>
      </Card>
      
      <div className={styles.formTips}>
        <h3>Tips for Writing Chemical Equations</h3>
        <ul>
          <li>Use correct chemical formulas (H2O, not H20)</li>
          <li>Separate compounds with + signs</li>
          <li>Use - to separate reactants and products</li>
          <li>For complex molecules, use correct notation (e.g., CH3COOH for acetic acid)</li>
          <li>States can be indicated as (g), (l), (s), or (aq) if needed</li>
        </ul>
      </div>
    </div>
  );
};

export default EquationForm;