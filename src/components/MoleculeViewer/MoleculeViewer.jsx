import React, { useEffect, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Text } from '@react-three/drei';
import * as THREE from 'three';
import styles from './MoleculeViewer.module.css';

// Define atomic colors and radii
const ATOM_COLORS = {
  H: 0xFFFFFF,  // White
  O: 0xFF0000,  // Red
  C: 0x808080,  // Grey
  N: 0x0000FF,  // Blue
  Cl: 0x00FF00, // Green
  F: 0xFFFF00,  // Yellow
  Br: 0xA52A2A, // Brown
  I: 0x800080,  // Purple
  S: 0xFFFF00,  // Yellow
  P: 0xFFA500,  // Orange
  Na: 0x0000FF, // Blue
  K: 0x0000FF,  // Blue
  Ca: 0x808080, // Grey
  Mg: 0x808080, // Grey
  Fe: 0xFFA500, // Orange
  default: 0xCCCCCC // Default light grey
};

const ATOM_RADII = {
  H: 0.31,
  O: 0.66,
  C: 0.76,
  N: 0.71,
  Cl: 1.00,
  F: 0.57,
  Br: 1.20,
  I: 1.39,
  S: 1.05,
  P: 1.07,
  Na: 1.86,
  K: 2.75,
  Ca: 2.31,
  Mg: 1.73,
  Fe: 1.26,
  default: 0.70
};

const MoleculeViewer = ({ moleculeData, formula, type = 'reactant' }) => {
  const [error, setError] = useState(null);

  if (!moleculeData || !moleculeData.atoms || !moleculeData.bonds) {
    return (
      <div className={styles.errorState}>
        <i className="fas fa-exclamation-triangle"></i>
        <p>No valid molecule data provided</p>
      </div>
    );
  }

  const Atom = ({ position, element }) => {
    const color = ATOM_COLORS[element] || ATOM_COLORS.default;
    const radius = ATOM_RADII[element] || ATOM_RADII.default;

    return (
      <mesh position={[position.x, position.y, position.z]} castShadow>
        <sphereGeometry args={[radius, 32, 32]} />
        <meshStandardMaterial 
          color={color} 
          metalness={0.3} // Add slight shininess
          roughness={0.5} 
          transparent={true} 
          opacity={0.95} // Slight transparency for better visuals
        />
        <Text
          position={[0, radius + 0.3, 0]}
          fontSize={0.5}
          color="white"
          anchorX="center"
          anchorY="middle"
        >
          {element}
        </Text>
      </mesh>
    );
  };

  const Bond = ({ start, end }) => {
    const distance = start.distanceTo(end);
    const position = start.clone().add(end).multiplyScalar(0.5);
    const direction = new THREE.Vector3().subVectors(end, start);
    const orientation = new THREE.Vector3(0, 1, 0);
    const quaternion = new THREE.Quaternion().setFromUnitVectors(orientation, direction.clone().normalize());

    return (
      <mesh position={position} quaternion={quaternion} castShadow>
        <cylinderGeometry args={[0.08, 0.08, distance, 16]} /> {/* Slightly thinner bonds for aesthetics */}
        <meshStandardMaterial 
          color={0xFFFFFF} 
          metalness={0.2} 
          roughness={0.6} 
        />
      </mesh>
    );
  };

  const Molecule = () => {
    const scaleFactor = 3.0;

    const adjustedPositions = moleculeData.atoms.map((atom) => {
      const radius = ATOM_RADII[atom.element] || ATOM_RADII.default;
      return {
        ...atom,
        position: {
          x: atom.position.x * scaleFactor * (1 + radius * 0.5),
          y: atom.position.y * scaleFactor * (1 + radius * 0.5),
          z: atom.position.z * scaleFactor * (1 + radius * 0.5),
        },
      };
    });

    const atoms = adjustedPositions.map((atom, index) => (
      <Atom
        key={`atom-${index}`}
        position={new THREE.Vector3(atom.position.x, atom.position.y, atom.position.z)}
        element={atom.element}
      />
    ));

    const bonds = moleculeData.bonds.map((bond, index) => {
      const startAtom = adjustedPositions[bond.from];
      const endAtom = adjustedPositions[bond.to];
      return (
        <Bond
          key={`bond-${index}`}
          start={new THREE.Vector3(startAtom.position.x, startAtom.position.y, startAtom.position.z)}
          end={new THREE.Vector3(endAtom.position.x, endAtom.position.y, endAtom.position.z)}
        />
      );
    });

    return (
      <group>
        {atoms}
        {bonds}
      </group>
    );
  };

  return (
    <div className={styles.viewerCard}>
      <div className={styles.viewerHeader}>
        <h3 className={type === 'reactant' ? styles.reactantTitle : styles.productTitle}>
          {formula}
          <span className={styles.typeLabel}>
            {type === 'reactant' ? 'Reactant' : 'Product'}
          </span>
        </h3>
      </div>
      <div className={styles.viewerContainer}>
        <Canvas
          style={{ width: '100%', height: '400px' }} // Increased height for better visibility
          camera={{ position: [0, 5, 20], fov: 60 }} // Adjusted camera for better initial view
          shadows // Enable shadows
        >
          {/* Add a gradient background */}
          <color attach="background" args={['#1e2a44', '#2a4066']} /> {/* Dark gradient background */}
          
          {/* Enhanced lighting */}
          <ambientLight intensity={0.5} />
          <directionalLight 
            position={[5, 5, 5]} 
            intensity={1.2} 
            castShadow 
            shadow-mapSize-width={1024} 
            shadow-mapSize-height={1024} 
          />
          <pointLight position={[-5, -5, -5]} intensity={0.8} />

          {/* Add a plane to receive shadows */}
          <mesh receiveShadow position={[0, -5, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[50, 50]} />
            <shadowMaterial opacity={0.2} />
          </mesh>

          <Molecule />
          <OrbitControls 
            enablePan={true} 
            enableZoom={true} 
            enableRotate={true} 
            enableDamping={true} // Smoother controls
            dampingFactor={0.05} 
            minDistance={5} // Prevent zooming in too close
            maxDistance={50} // Limit zooming out
          />
        </Canvas>
      </div>
      {error && (
        <div className={styles.errorState}>
          <i className="fas fa-exclamation-triangle"></i>
          <p>{error}</p>
        </div>
      )}
    </div>
  );
};

export default MoleculeViewer;