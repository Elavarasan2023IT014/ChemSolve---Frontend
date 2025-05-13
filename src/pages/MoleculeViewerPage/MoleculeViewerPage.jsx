import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import MoleculeViewer from '../../components/MoleculeViewer/MoleculeViewer';
import styles from './MoleculeViewerPage.module.css';
import Button from '../../components/UI/Button/Button';

const MoleculeViewerPage = () => {
  const location = useLocation();
  const { formula, moleculeData } = location.state || {};

  if (!formula || !moleculeData) {
    return (
      <div className={styles.errorContainer}>
        <h1>Error</h1>
        <p>No molecule data provided. Please select a molecule from the previous equations page.</p>
        <Link to="/previousEquations">
          <Button variant="primary">Back to Previous Equations</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className={styles.moleculeViewerPage}>
      <h1>3D Molecule Viewer</h1>
      <div className={styles.moleculeContainer}>
        <MoleculeViewer moleculeData={moleculeData} formula={formula} />
      </div>
      <div className={styles.backButtonContainer}>
        <Link to="/previousEquations">
          <Button variant="primary">Back to Previous Equations</Button>
        </Link>
      </div>
    </div>
  );
};

export default MoleculeViewerPage;