import React from 'react';
import styles from './Features.module.css';
import Card from '../UI/Card/Card';

const Features = () => {
  const features = [
    {
      icon: '⚗️',
      title: 'Equation Balancing',
      description: 'Automatically balance any chemical equation with our advanced algorithm that handles even the most complex reactions.'
    },
    {
      icon: '🔬',
      title: '3D Molecule Visualization',
      description: 'Explore chemical compounds in three dimensions. Rotate, zoom, and examine molecular structures for better understanding.'
    },
    {
      icon: '📊',
      title: 'Reaction Analysis',
      description: 'Get detailed insights about reaction types, enthalpy changes, and stoichiometric calculations for any equation.'
    },
    {
      icon: '📱',
      title: 'Cross-Platform Access',
      description: 'Use ChemSolve on any device. Our responsive design works seamlessly on desktops, tablets, and smartphones.'
    },
    {
      icon: '💾',
      title: 'Save & Export',
      description: 'Save your work to your account and export results in various formats for reports, presentations, or further study.'
    },
    {
      icon: '🧪',
      title: 'Element Database',
      description: 'Access comprehensive information about all chemical elements, including properties, electron configurations, and more.'
    }
  ];

  return (
    <section id="features" className={`${styles.features} section`}>
      <div className="container">
        <h2 className={`${styles.featuresTitle} text-center`}>
          Powerful <span className="text-primary">Features</span>
        </h2>
        <p className={`${styles.featuresDescription} text-center`}>
          Discover the tools that make ChemSolve the perfect companion for chemistry students and professionals alike.
        </p>
        
        <div className={styles.featureGrid}>
          {features.map((feature, index) => (
            <Card key={index} className={styles.featureCard} hover={true}>
              <div className={styles.featureIcon}>{feature.icon}</div>
              <h3 className={styles.featureTitle}>{feature.title}</h3>
              <p className={styles.featureDescription}>{feature.description}</p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;