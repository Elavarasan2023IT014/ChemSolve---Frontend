import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import styles from './Solver.module.css';
import EquationForm from '../../components/EquationForm/EquationForm';
import EquationResult from '../../components/EquationResult/EquationResult';
import MoleculeViewer from '../../components/MoleculeViewer/MoleculeViewer';

// Utility function to parse reactants and products from the balanced equation
const parseEquation = (balancedEquation, molecules) => {
  const [reactantsSide, productsSide] = balancedEquation.split(' -> ').map(side => side.trim());
  
  const parseMolecules = (side) => {
    if (!side) return [];
    const terms = side.split(' + ').map(term => term.trim());
    const result = [];
    terms.forEach(term => {
      const match = term.match(/^(\d*)([A-Za-z0-9]+)/);
      if (match) {
        const coefficient = parseInt(match[1] || '1');
        const molecule = match[2];
        if (molecules.includes(molecule)) {
          result.push(molecule);
        }
      }
    });
    return result;
  };

  return {
    reactants: parseMolecules(reactantsSide),
    products: parseMolecules(productsSide)
  };
};

const Solver = () => {
  const [equationData, setEquationData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedMolecule, setSelectedMolecule] = useState(null);
  const [moleculeType, setMoleculeType] = useState('reactant');
  const navigate = useNavigate();

  // Check authentication on mount
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
    }
  }, [navigate]);

  const handleSolveEquation = async (equation) => {
    setLoading(true);
    setError('');
    setSelectedMolecule(null);
    setEquationData(null); // Reset equationData to prevent stale data

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Authentication token not found. Please log in.');
      }

      const response = await axios.post(
        'https://chemsolve-backend.onrender.com/api/equations/solve',
        { equation },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      console.log('API Response:', response.data); // Log the API response for debugging

      const result = response.data;

      // Validate the response structure
      if (!result || !result.balancedEquation || !result.moleculeData || !result.molecules) {
        throw new Error('Invalid API response: Missing required fields (balancedEquation, moleculeData, or molecules)');
      }

      // Parse reactants and products from the balanced equation
      const { reactants, products } = parseEquation(result.balancedEquation, result.molecules);

      // Update the result to include reactants and products
      const updatedResult = {
        ...result,
        reactants,
        products
      };

      setEquationData(updatedResult);
      if (reactants && reactants.length > 0) {
        setSelectedMolecule(reactants[0]);
        setMoleculeType('reactant');
      }
      setLoading(false);
    } catch (err) {
      console.error('Error solving equation:', err);
      if (err.response?.status === 401 || err.response?.status === 403) {
        localStorage.removeItem('token');
        navigate('/login');
        setError('Session expired. Please log in again.');
      } else {
        setError(err.response?.data?.message || err.message || 'Error solving equation. Please check the format and try again.');
      }
      setLoading(false);
    }
  };

  const handleViewMolecule = (formula, type) => {
    setSelectedMolecule(formula);
    setMoleculeType(type);

    setTimeout(() => {
      const viewerElement = document.getElementById('molecule-viewer-section');
      if (viewerElement) {
        viewerElement.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  };

  return (
    <div className={styles.solverPage}>
      <div className={styles.solverContainer}>
        <div className={styles.solverHeader}>
          <h1>Chemistry Equation Solver</h1>
          <p className={styles.solverDescription}>
            Balance chemical equations, analyze reactants and products, and visualize 3D molecular structures.
          </p>
        </div>

        <EquationForm onSolveEquation={handleSolveEquation} />

        {loading && (
          <div className={styles.loadingContainer}>
            <div className={styles.spinner}></div>
            <p>Balancing equation...</p>
          </div>
        )}

        {error && <div className={styles.errorMessage}>{error}</div>}

        {equationData && !loading && !error && (
          <>
            <EquationResult data={equationData} onViewMolecule={handleViewMolecule} />

            <div id="molecule-viewer-section" className={styles.moleculeViewerSection}>
              <h2 className={styles.sectionTitle}>Molecule Viewer</h2>
              <p className={styles.sectionDescription}>
                Interactive 3D view of molecular structures
              </p>

              {selectedMolecule ? (
                <MoleculeViewer
                  moleculeData={equationData.moleculeData && equationData.moleculeData[selectedMolecule]}
                  formula={selectedMolecule}
                  type={moleculeType}
                />
              ) : (
                <div className={styles.selectMoleculePrompt}>
                  <div className={styles.promptIcon}>
                    <i className="fas fa-hand-pointer"></i>
                  </div>
                  <p>Select a molecule from the reactants or products to view its 3D structure</p>
                </div>
              )}

              <div className={styles.moleculeSelectors}>
                <h3>View Molecules:</h3>
                <div className={styles.moleculeButtons}>
                  <div className={styles.reactantsGroup}>
                    <h4>Reactants</h4>
                    <div className={styles.buttonGroup}>
                      {equationData.reactants && Array.isArray(equationData.reactants) && equationData.reactants.length > 0 ? (
                        equationData.reactants.map((reactant, index) => (
                          <button
                            key={`reactant-${index}`}
                            className={`${styles.moleculeButton} ${selectedMolecule === reactant && moleculeType === 'reactant' ? styles.activeMolecule : ''}`}
                            onClick={() => handleViewMolecule(reactant, 'reactant')}
                          >
                            {reactant}
                          </button>
                        ))
                      ) : (
                        <p>No reactants available</p>
                      )}
                    </div>
                  </div>

                  <div className={styles.productsGroup}>
                    <h4>Products</h4>
                    <div className={styles.buttonGroup}>
                      {equationData.products && Array.isArray(equationData.products) && equationData.products.length > 0 ? (
                        equationData.products.map((product, index) => (
                          <button
                            key={`product-${index}`}
                            className={`${styles.moleculeButton} ${selectedMolecule === product && moleculeType === 'product' ? styles.activeMolecule : ''}`}
                            onClick={() => handleViewMolecule(product, 'product')}
                          >
                            {product}
                          </button>
                        ))
                      ) : (
                        <p>No products available</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Solver;