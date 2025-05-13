import React from 'react';
import styles from './EquationResult.module.css';
import Card from '../UI/Card/Card';

const EquationResult = ({ data, onViewMolecule }) => {
  const { inputEquation, balancedEquation, reactants, products } = data;

  return (
    <div className={styles.resultContainer}>
      <h2 className={styles.resultTitle}>Equation Result</h2>
      
      <Card className={styles.resultCard}>
        <div className={styles.equationSummary}>
          <h3>Balanced Equation</h3>
          <div className={styles.equationDisplay}>
            <div className={styles.originalEquation}>
              <h4>Original:</h4>
              <p>{inputEquation}</p>
            </div>
            <div className={styles.balancedEquation}>
              <h4>Balanced:</h4>
              <p>{balancedEquation}</p>
            </div>
          </div>
        </div>
        
        <div className={styles.detailsGrid}>
          <div className={styles.detailsCard}>
            <h3>Reactants</h3>
            <ul>
              {reactants.map((reactant, index) => (
                <li key={`reactant-${index}`}>
                  {reactant}{' '}
                  <button
                    className={styles.viewButton}
                    onClick={() => onViewMolecule(reactant, 'reactant')}
                  >
                    View 3D
                  </button>
                </li>
              ))}
            </ul>
          </div>
          
          <div className={styles.detailsCard}>
            <h3>Products</h3>
            <ul>
              {products.map((product, index) => (
                <li key={`product-${index}`}>
                  {product}{' '}
                  <button
                    className={styles.viewButton}
                    onClick={() => onViewMolecule(product, 'product')}
                  >
                    View 3D
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default EquationResult;