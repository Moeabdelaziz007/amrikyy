import React, { useState, useEffect } from 'react';
import { 
  Dashboard, 
  QuantumChatbot, 
  SocialMediaAnalytics, 
  QuantumFeatures,
  SpaceCryptoBackground
} from './components';
import { generateQuantumInsights, fetchSocialData } from './services/aiServices';
import { useQuantumAnimations } from './hooks/useQuantumAnimations';
import './styles/App.css';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [quantumData, setQuantumData] = useState(null);
  const [socialData, setSocialData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const { quantumField, initQuantumField } = useQuantumAnimations();

  useEffect(() => {
    const initializeApp = async () => {
      try {
        setIsLoading(true);
        
        // Initialize quantum field animations
        initQuantumField();
        
        // Fetch quantum insights
        const qData = await generateQuantumInsights();
        setQuantumData(qData);
        
        // Fetch social media data
        const sData = await fetchSocialData();
        setSocialData(sData);
        
      } catch (error) {
        console.error('Error initializing app:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeApp();
  }, [initQuantumField]);

  if (isLoading) {
    return (
      <div className="quantum-loader">
        <SpaceCryptoBackground />
        <div className="loader-content">
          <div className="quantum-orb">
            <div className="orb-core"></div>
            <div className="orb-ring"></div>
            <div className="orb-ring"></div>
          </div>
          <h2>Initializing Quantum AI Systems...</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="app-container">
      <SpaceCryptoBackground />
      
      <div className="app-header">
        <div className="logo-container">
          <div className="quantum-logo">
            <div className="logo-core"></div>
            <div className="logo-ring"></div>
            <div className="logo-ring"></div>
          </div>
          <h1>Quantum AI Nexus</h1>
        </div>
        
        <nav className="app-nav">
          <button 
            className={`nav-btn ${activeTab === 'dashboard' ? 'active' : ''}`}
            onClick={() => setActiveTab('dashboard')}
          >
            Dashboard
          </button>
          <button 
            className={`nav-btn ${activeTab === 'social' ? 'active' : ''}`}
            onClick={() => setActiveTab('social')}
          >
            Social Analytics
          </button>
          <button 
            className={`nav-btn ${activeTab === 'quantum' ? 'active' : ''}`}
            onClick={() => setActiveTab('quantum')}
          >
            Quantum Features
          </button>
        </nav>
      </div>
      
      <main className="app-main">
        {activeTab === 'dashboard' && (
          <Dashboard quantumData={quantumData} />
        )}
        {activeTab === 'social' && (
          <SocialMediaAnalytics socialData={socialData} />
        )}
        {activeTab === 'quantum' && (
          <QuantumFeatures quantumData={quantumData} />
        )}
      </main>
      
      <QuantumChatbot />
    </div>
  );
}

export default App;