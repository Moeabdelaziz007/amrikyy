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
        <div className="header-left">
          <div className="personal-brand">
            <div className="avatar-container">
              <img src="/avatar.jpg" alt="Mohamed H. Abdelaziz (Amrikyy)" className="header-avatar" />
              <div className="avatar-quantum-ring"></div>
            </div>
            <div className="brand-info">
              <h1 className="brand-name">Mohamed H. Abdelaziz</h1>
              <span className="brand-alias">AMRIKYY</span>
              <p className="brand-title">Quantum AI Architect & Consciousness Engineer</p>
            </div>
          </div>
        </div>
        
        <div className="header-center">
          <div className="quantum-logo">
            <div className="logo-core"></div>
            <div className="logo-ring"></div>
            <div className="logo-ring"></div>
          </div>
          <span className="logo-text">Quantum AI Nexus</span>
        </div>
        
        <nav className="app-nav">
          <button 
            className={`nav-btn ${activeTab === 'dashboard' ? 'active' : ''}`}
            onClick={() => setActiveTab('dashboard')}
          >
            <svg className="nav-icon" viewBox="0 0 24 24" fill="currentColor">
              <path d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z"/>
            </svg>
            Dashboard
          </button>
          <button 
            className={`nav-btn ${activeTab === 'social' ? 'active' : ''}`}
            onClick={() => setActiveTab('social')}
          >
            <svg className="nav-icon" viewBox="0 0 24 24" fill="currentColor">
              <path d="M16 4c0-1.11.89-2 2-2s2 .89 2 2-.89 2-2 2-2-.89-2-2zm4 18v-6h2.5l-2.54-7.63A1.5 1.5 0 0 0 18.54 7h-.79l-.82-.82C16.42 5.66 15.74 5.5 15 5.5s-1.42.16-1.93.68L12.25 7h-.79c-.78 0-1.43.61-1.52 1.37L7.5 16H10v6h6zM12.5 11.5c.83 0 1.5.67 1.5 1.5s-.67 1.5-1.5 1.5-1.5-.67-1.5-1.5.67-1.5 1.5-1.5z"/>
            </svg>
            Social Analytics
          </button>
          <button 
            className={`nav-btn ${activeTab === 'quantum' ? 'active' : ''}`}
            onClick={() => setActiveTab('quantum')}
          >
            <svg className="nav-icon" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
            </svg>
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
      
      <footer className="app-footer">
        <div className="footer-content">
          <div className="footer-left">
            <div className="footer-brand">
              <div className="quantum-logo-small">
                <div className="logo-core-small"></div>
                <div className="logo-ring-small"></div>
              </div>
              <div className="footer-brand-info">
                <h3>Mohamed H. Abdelaziz</h3>
                <span className="footer-alias">AMRIKYY</span>
                <p>Quantum AI Architect & Consciousness Engineer</p>
              </div>
            </div>
          </div>
          
          <div className="footer-center">
            <div className="footer-links">
              <div className="footer-section">
                <h4>Connect</h4>
                <div className="social-links">
                  <a href="https://linkedin.com/in/amrikyy" target="_blank" rel="noopener noreferrer" className="social-link">
                    <svg viewBox="0 0 24 24" fill="currentColor">
                      <path d="M20.5 2h-17A1.5 1.5 0 002 3.5v17A1.5 1.5 0 003.5 22h17a1.5 1.5 0 001.5-1.5v-17A1.5 1.5 0 0020.5 2zM8 19H5v-9h3zM6.5 8.25A1.75 1.75 0 118.3 6.5a1.78 1.78 0 01-1.8 1.75zM19 19h-3v-4.74c0-1.42-.6-1.93-1.38-1.93A1.74 1.74 0 0013 14.19a.66.66 0 000 .14V19h-3v-9h2.9v1.3a3.11 3.11 0 012.7-1.4c1.55 0 3.36.86 3.36 3.66z"/>
                    </svg>
                    LinkedIn
                  </a>
                  <a href="https://github.com/amrikyy" target="_blank" rel="noopener noreferrer" className="social-link">
                    <svg viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                    </svg>
                    GitHub
                  </a>
                  <a href="https://twitter.com/amrikyy" target="_blank" rel="noopener noreferrer" className="social-link">
                    <svg viewBox="0 0 24 24" fill="currentColor">
                      <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                    </svg>
                    Twitter
                  </a>
                  <a href="mailto:contact@amrikyy.dev" className="social-link">
                    <svg viewBox="0 0 24 24" fill="currentColor">
                      <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
                    </svg>
                    Email
                  </a>
                </div>
              </div>
              
              <div className="footer-section">
                <h4>Projects</h4>
                <ul>
                  <li><a href="#quantum-ai">Quantum AI Research</a></li>
                  <li><a href="#blockchain">Blockchain Solutions</a></li>
                  <li><a href="#neural-networks">Neural Networks</a></li>
                  <li><a href="#consciousness">AI Consciousness</a></li>
                </ul>
              </div>
              
              <div className="footer-section">
                <h4>Expertise</h4>
                <ul>
                  <li><a href="#ai-ml">AI & Machine Learning</a></li>
                  <li><a href="#quantum">Quantum Computing</a></li>
                  <li><a href="#fullstack">Full-Stack Development</a></li>
                  <li><a href="#crypto">Cryptocurrency</a></li>
                </ul>
              </div>
            </div>
          </div>
          
          <div className="footer-right">
            <div className="footer-contact">
              <h4>Get In Touch</h4>
              <p>Ready to explore the quantum realm of AI? Let's build the future together.</p>
              <div className="contact-info">
                <div className="contact-item">
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                  </svg>
                  <span>Global Remote</span>
                </div>
                <div className="contact-item">
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10h5v-2h-5c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8v1.5c0 .83-.67 1.5-1.5 1.5s-1.5-.67-1.5-1.5V12c0-2.76-2.24-5-5-5s-5 2.24-5 5 2.24 5 5 5c1.38 0 2.63-.56 3.54-1.47.65.89 1.77 1.47 2.96 1.47 1.93 0 3.5-1.57 3.5-3.5V12c0-5.52-4.48-10-10-10zm0 13c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3z"/>
                  </svg>
                  <span>contact@amrikyy.dev</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="footer-bottom">
          <div className="footer-bottom-content">
            <p>&copy; 2024 Mohamed H. Abdelaziz (Amrikyy). All rights reserved.</p>
            <div className="footer-quantum-indicator">
              <span className="quantum-status-dot"></span>
              <span>Quantum Field: Active</span>
            </div>
          </div>
        </div>
      </footer>
      
      <QuantumChatbot />
    </div>
  );
}

export default App;