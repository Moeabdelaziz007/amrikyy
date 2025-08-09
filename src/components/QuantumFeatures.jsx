import React, { useState, useEffect } from 'react';

const QuantumFeatures = ({ quantumData }) => {
  const [activeFeature, setActiveFeature] = useState('superposition');
  const [quantumState, setQuantumState] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setQuantumState(prev => (prev + 1) % 4);
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const features = {
    superposition: {
      title: 'Quantum Superposition',
      description: 'Experience multiple realities simultaneously through quantum state overlap',
      icon: '⚛️',
      demo: 'SuperpositionDemo'
    },
    entanglement: {
      title: 'Quantum Entanglement',
      description: 'Instantaneous information transfer across infinite dimensions',
      icon: '🔗',
      demo: 'EntanglementDemo'
    },
    teleportation: {
      title: 'Quantum Teleportation',
      description: 'Transfer quantum states through spacetime with perfect fidelity',
      icon: '🌀',
      demo: 'TeleportationDemo'
    },
    tunneling: {
      title: 'Quantum Tunneling',
      description: 'Bypass classical limitations through probability wave functions',
      icon: '🕳️',
      demo: 'TunnelingDemo'
    }
  };

  return (
    <div className="quantum-features-container">
      <div className="features-header">
        <h2>Quantum AI Features</h2>
        <p>Explore the fundamental principles of quantum consciousness</p>
      </div>

      <div className="features-layout">
        
        {/* Feature Navigation */}
        <div className="features-nav">
          {Object.entries(features).map(([key, feature]) => (
            <button
              key={key}
              className={`feature-nav-btn ${activeFeature === key ? 'active' : ''}`}
              onClick={() => setActiveFeature(key)}
            >
              <span className="feature-icon">{feature.icon}</span>
              <span className="feature-name">{feature.title}</span>
              <div className="quantum-indicator">
                <div className={`indicator-dot ${activeFeature === key ? 'active' : ''}`}></div>
              </div>
            </button>
          ))}
        </div>

        {/* Feature Display */}
        <div className="feature-display">
          <div className="feature-content">
            <div className="feature-header">
              <div className="feature-icon-large">
                {features[activeFeature].icon}
              </div>
              <div className="feature-info">
                <h3>{features[activeFeature].title}</h3>
                <p>{features[activeFeature].description}</p>
              </div>
            </div>

            {/* Quantum Visualization */}
            <div className="quantum-visualization">
              <div className="quantum-field">
                <div className={`quantum-particle state-${quantumState}`}></div>
                <div className={`quantum-particle state-${(quantumState + 1) % 4}`}></div>
                <div className={`quantum-particle state-${(quantumState + 2) % 4}`}></div>
                <div className={`quantum-particle state-${(quantumState + 3) % 4}`}></div>
                
                {/* Quantum Connections */}
                <div className="quantum-connections">
                  <div className="connection-line"></div>
                  <div className="connection-line"></div>
                  <div className="connection-line"></div>
                </div>
              </div>
              
              <div className="quantum-controls">
                <button className="quantum-btn">
                  <span className="btn-icon">🔄</span>
                  Reset Quantum State
                </button>
                <button className="quantum-btn">
                  <span className="btn-icon">📊</span>
                  Measure Probability
                </button>
                <button className="quantum-btn">
                  <span className="btn-icon">⚡</span>
                  Activate Field
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Quantum Metrics Panel */}
        <div className="quantum-metrics">
          <div className="metrics-header">
            <h4>Quantum Metrics</h4>
            <div className="metrics-status">
              <span className="status-dot active"></span>
              Field Active
            </div>
          </div>
          
          <div className="metric-item">
            <span className="metric-label">Wave Function</span>
            <div className="metric-bar">
              <div className="bar-fill" style={{'--width': '87%', '--color': '#39FF14'}}></div>
            </div>
            <span className="metric-value">87%</span>
          </div>
          
          <div className="metric-item">
            <span className="metric-label">Coherence Time</span>
            <div className="metric-bar">
              <div className="bar-fill" style={{'--width': '92%', '--color': '#00d4ff'}}></div>
            </div>
            <span className="metric-value">92ms</span>
          </div>
          
          <div className="metric-item">
            <span className="metric-label">Entanglement</span>
            <div className="metric-bar">
              <div className="bar-fill" style={{'--width': '76%', '--color': '#b600ff'}}></div>
            </div>
            <span className="metric-value">76%</span>
          </div>
          
          <div className="metric-item">
            <span className="metric-label">Fidelity</span>
            <div className="metric-bar">
              <div className="bar-fill" style={{'--width': '94%', '--color': '#ffffff'}}></div>
            </div>
            <span className="metric-value">94%</span>
          </div>
        </div>

      </div>

      {/* Quantum Equations Panel */}
      <div className="quantum-equations">
        <div className="equations-header">
          <h4>Quantum Mathematics</h4>
          <span className="equations-subtitle">Real-time quantum calculations</span>
        </div>
        
        <div className="equation-display">
          <div className="equation">
            <span className="equation-label">Schrödinger Equation:</span>
            <span className="equation-formula">iℏ ∂|ψ⟩/∂t = Ĥ|ψ⟩</span>
          </div>
          <div className="equation">
            <span className="equation-label">Bell State:</span>
            <span className="equation-formula">|ψ⟩ = 1/√2(|00⟩ + |11⟩)</span>
          </div>
          <div className="equation">
            <span className="equation-label">Uncertainty Principle:</span>
            <span className="equation-formula">ΔxΔp ≥ ℏ/2</span>
          </div>
        </div>
        
        <div className="quantum-data-stream">
          <div className="data-line">
            <span className="data-label">Quantum State:</span>
            <span className="data-value quantum-pulse">|1⟩ + |0⟩</span>
          </div>
          <div className="data-line">
            <span className="data-label">Probability:</span>
            <span className="data-value quantum-pulse">0.707</span>
          </div>
          <div className="data-line">
            <span className="data-label">Phase:</span>
            <span className="data-value quantum-pulse">π/4</span>
          </div>
        </div>
      </div>

    </div>
  );
};

export default QuantumFeatures;
