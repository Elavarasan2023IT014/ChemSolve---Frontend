import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Button from '../../components/UI/Button/Button';
import styles from './PreviousEquations.module.css';

const PreviousEquations = () => {
  const [equations, setEquations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedEquation, setSelectedEquation] = useState(null);
  const [compoundNames, setCompoundNames] = useState({}); // Store fetched compound names
  const navigate = useNavigate();

  useEffect(() => {
    fetchEquations();
  }, []);

  useEffect(() => {
    if (equations.length > 0) {
      fetchAllCompoundNames();
    }
  }, [equations]);

  const fetchEquations = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Authentication token not found');
      }

      const response = await fetch('https://chemsolve-backend.onrender.com/api/equations/history', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.status === 401 || response.status === 403) {
        localStorage.removeItem('token');
        navigate('/login');
        throw new Error('Session expired. Please log in again.');
      }

      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        const text = await response.text();
        console.error('Non-JSON response:', text);
        throw new Error('Server returned non-JSON response');
      }

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch equations');
      }

      const data = await response.json();
      setEquations(data);
    } catch (err) {
      setError(err.message || 'An error occurred while fetching equations');
      console.error('Error fetching equations:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchCompoundName = async (formula) => {
    try {
      // Use PubChem PUG REST API to fetch compound name
      const response = await fetch(`https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/name/${encodeURIComponent(formula)}/property/IUPACName,Title/JSON`);
      if (!response.ok) {
        throw new Error(`Failed to fetch name for ${formula}`);
      }
      const data = await response.json();
      const compound = data.PropertyTable.Properties[0];
      // Prefer the common name (Title) if available, otherwise use IUPAC name
      return compound.Title || compound.IUPACName || 'Unknown Compound';
    } catch (err) {
      console.error(`Error fetching name for ${formula}:`, err);
      return 'Unknown Compound';
    }
  };

  const fetchAllCompoundNames = async () => {
    const names = {};
    for (const equation of equations) {
      if (equation.molecules && equation.molecules.length > 0) {
        for (const molecule of equation.molecules) {
          if (!names[molecule]) {
            // Add delay to respect PubChem API rate limits (5 requests/sec)
            await new Promise(resolve => setTimeout(resolve, 200)); // 200ms delay
            const name = await fetchCompoundName(molecule);
            names[molecule] = name;
          }
        }
      }
    }
    setCompoundNames(names);
  };

  const handleEquationClick = (equation) => {
    setSelectedEquation(equation);
  };

  const formatDate = (dateString) => {
    const options = { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const handleDeleteEquation = async (id) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Authentication token not found');
      }

      const response = await fetch(`https://chemsolve-backend.onrender.com/api/equations/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.status === 401 || response.status === 403) {
        localStorage.removeItem('token');
        navigate('/login');
        throw new Error('Session expired. Please log in again.');
      }

      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        const text = await response.text();
        console.error('Non-JSON response:', text);
        throw new Error('Server returned non-JSON response');
      }

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to delete equation');
      }

      setEquations(equations.filter(eq => eq._id !== id));
      if (selectedEquation && selectedEquation._id === id) {
        setSelectedEquation(null);
      }
    } catch (err) {
      setError(err.message || 'An error occurred while deleting the equation');
      console.error('Error deleting equation:', err);
    }
  };

  const handleViewMolecule = (formula, moleculeData) => {
    navigate('/moleculeViewer', { state: { formula, moleculeData } });
  };

  if (isLoading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.spinner}></div>
        <p>Loading your equations...</p>
      </div>
    );
  }

  return (
    <div className={styles.previousEquationsContainer}>
      <h1>Previous Equations</h1>
      
      {error && <p className={styles.errorMessage}>{error}</p>}
      
      {equations.length === 0 ? (
        <div className={styles.noEquationsMessage}>
          <p>You haven't solved any equations yet.</p>
          <Link to="/solver">
            <Button variant="primary">Go to Equation Solver</Button>
          </Link>
        </div>
      ) : (
        <div className={styles.contentContainer}>
          <div className={styles.equationsList}>
            {equations.map(equation => (
              <div 
                key={equation._id} 
                className={`${styles.equationItem} ${selectedEquation && selectedEquation._id === equation._id ? styles.selected : ''}`}
                onClick={() => handleEquationClick(equation)}
              >
                <div className={styles.equationPreview}>
                  <p className={styles.equationText}>{equation.balancedEquation}</p>
                  {equation.molecules && equation.molecules.length > 0 && (
                    <div className={styles.moleculesPreview}>
                      {equation.molecules.map((molecule, index) => (
                        <span key={index}>
                          {molecule} - {compoundNames[molecule] || 'Fetching...'}
                          {index < equation.molecules.length - 1 ? ', ' : ''}
                        </span>
                      ))}
                    </div>
                  )}
                  <p className={styles.equationDate}>{formatDate(equation.createdAt)}</p>
                </div>
              </div>
            ))}
          </div>
          
          {selectedEquation && (
            <div className={styles.equationDetails}>
              <div className={styles.detailsHeader}>
                <h2>Equation Details</h2>
                <div className={styles.actionButtons}>
                  <Button 
                    variant="outline" 
                    size="small"
                    onClick={() => handleDeleteEquation(selectedEquation._id)}
                    className={styles.deleteButton}
                  >
                    Delete
                  </Button>
                </div>
              </div>
              
              <div className={styles.detailsContent}>
                <div className={styles.detailsSection}>
                  <h3>Original Equation:</h3>
                  <p className={styles.equationText}>{selectedEquation.inputEquation}</p>
                </div>
                
                <div className={styles.detailsSection}>
                  <h3>Balanced Equation:</h3>
                  <p className={styles.equationText}>{selectedEquation.balancedEquation}</p>
                </div>
                
                {selectedEquation.molecules && selectedEquation.molecules.length > 0 && (
                  <div className={styles.detailsSection}>
                    <h3>Molecules:</h3>
                    <div className={styles.moleculesList}>
                      {selectedEquation.molecules.map((molecule, index) => (
                        <div key={index} className={styles.moleculeItem}>
                          <span>{molecule} - {compoundNames[molecule] || 'Fetching...'}</span>
                          <Button 
                            variant="outline" 
                            size="small"
                            onClick={() => handleViewMolecule(molecule, selectedEquation.moleculeData[molecule])}
                          >
                            View 3D Structure
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}
      
      <div className={styles.returnButtonContainer}>
        <Link to="/solver">
          <Button variant="primary">Back to Equation Solver</Button>
        </Link>
      </div>
    </div>
  );
};

export default PreviousEquations;