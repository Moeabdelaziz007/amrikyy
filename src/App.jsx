import React, { useState, useEffect } from 'react';
import { 
  Dashboard, 
  QuantumChatbot, 
  SocialMediaAnalytics, 
  QuantumFeatures,
  SpaceCryptoBackground
} from './components';
import Animated3DBackground from './components/Animated3DBackground';
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
      <div className="professional-loader" role="status" aria-live="polite">
        <SpaceCryptoBackground />
        <div className="loader-content">
          <div className="loader-animation">
            <div className="loader-orb">
              <div className="orb-core"></div>
              <div className="orb-ring"></div>
              <div className="orb-ring"></div>
            </div>
            <div className="loader-progress">
              <div className="progress-bar">
                <div className="progress-fill"></div>
              </div>
              <div className="progress-steps">
                <span className="step active">Loading Portfolio</span>
                <span className="step">Initializing AI</span>
                <span className="step">Ready</span>
              </div>
            </div>
          </div>
          <div className="loader-text">
            <h2>Initializing Professional Portfolio</h2>
            <p>Preparing AI-powered experiences and interactive demos</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="app-container">
      <Animated3DBackground />
      <SpaceCryptoBackground />
      
      <div className="app-header">
        <div className="header-left">
          <div className="professional-identity">
            <div className="professional-avatar">
              <img src="/avatar.jpg" alt="Mohamed Abdelaziz" className="profile-image" />
              <div className="status-indicator online"></div>
            </div>
            <div className="identity-info">
              <h1 className="professional-name">Mohamed Abdelaziz</h1>
              <p className="professional-title">Senior AI Engineer & Technology Leader</p>
              <div className="location-badge">
                <svg className="location-icon" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                </svg>
                <span>Available for Remote Work</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="header-center">
          <div className="tech-logo">
            <svg className="main-logo" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
            </svg>
            <span className="portfolio-text">Professional Portfolio</span>
          </div>
        </div>
        
        <nav className="app-nav" role="navigation" aria-label="Main navigation">
          <div className="nav-progress-indicator">
            <div 
              className="nav-progress-bar" 
              style={{
                transform: `translateX(${activeTab === 'dashboard' ? '0%' : activeTab === 'social' ? '100%' : '200%'})`
              }}
            ></div>
          </div>
          
          <button 
            className={`nav-btn ${activeTab === 'dashboard' ? 'active' : ''}`}
            onClick={() => setActiveTab('dashboard')}
            aria-pressed={activeTab === 'dashboard'}
            aria-describedby="nav-overview-desc"
          >
            <svg className="nav-icon" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M4 4h6v6H4V4zm10 0h6v6h-6V4zM4 14h6v6H4v-6zm10 0h6v6h-6v-6z"/>
            </svg>
            <div className="nav-content">
              <span className="nav-label">Overview</span>
              <span className="nav-description" id="nav-overview-desc">Skills & Projects</span>
            </div>
          </button>
          
          <button 
            className={`nav-btn ${activeTab === 'social' ? 'active' : ''}`}
            onClick={() => setActiveTab('social')}
            aria-pressed={activeTab === 'social'}
            aria-describedby="nav-experience-desc"
          >
            <svg className="nav-icon" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm-1-7.9c-.7 0-1.2-.5-1.2-1.2 0-.7.5-1.2 1.2-1.2s1.2.5 1.2 1.2c0 .7-.5 1.2-1.2 1.2zM17 17h-2v-3.4c0-.8 0-1.8-1.1-1.8-1.1 0-1.3.9-1.3 1.8V17h-2v-7h1.9v1h.1c.3-.5.9-1 1.9-1 2 0 2.4 1.3 2.4 3v4z"/>
            </svg>
            <div className="nav-content">
              <span className="nav-label">Experience</span>
              <span className="nav-description" id="nav-experience-desc">Professional CV</span>
            </div>
          </button>
          
          <button 
            className={`nav-btn ${activeTab === 'quantum' ? 'active' : ''}`}
            onClick={() => setActiveTab('quantum')}
            aria-pressed={activeTab === 'quantum'}
            aria-describedby="nav-projects-desc"
          >
            <svg className="nav-icon" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M9.4 16.6L4.8 12l4.6-4.6L8 6l-6 6 6 6 1.4-1.4zm5.2 0L19.2 12l-4.6-4.6L16 6l6 6-6 6-1.4-1.4z"/>
            </svg>
            <div className="nav-content">
              <span className="nav-label">Projects</span>
              <span className="nav-description" id="nav-projects-desc">Live Demos</span>
            </div>
          </button>
        </nav>
      </div>
      
      {/* Breadcrumb Navigation */}
      <div className="breadcrumb-container">
        <nav className="breadcrumb" aria-label="Breadcrumb">
          <ol className="breadcrumb-list">
            <li className="breadcrumb-item">
              <span className="breadcrumb-home">Portfolio</span>
            </li>
            <li className="breadcrumb-separator" aria-hidden="true">/</li>
            <li className="breadcrumb-item active" aria-current="page">
              <span className="breadcrumb-current">
                {activeTab === 'dashboard' ? 'Overview' : 
                 activeTab === 'social' ? 'Experience' : 'Projects'}
              </span>
            </li>
          </ol>
        </nav>
      </div>

      <main className="app-main" role="main">
        <div className="content-container">
          {activeTab === 'dashboard' && (
            <section aria-label="Professional overview and skills">
              <Dashboard quantumData={quantumData} />
            </section>
          )}
          {activeTab === 'social' && (
            <section aria-label="Professional experience and CV">
              <SocialMediaAnalytics socialData={socialData} />
            </section>
          )}
          {activeTab === 'quantum' && (
            <section aria-label="Project portfolio and live demos">
              <QuantumFeatures quantumData={quantumData} />
            </section>
          )}
        </div>
      </main>
      
      <footer className="app-footer">
        <div className="footer-content">
          <div className="footer-professional">
            <div className="footer-identity">
              <h3>Mohamed Abdelaziz</h3>
              <p>Senior AI Engineer & Technology Leader</p>
            </div>
            
            <div className="footer-contact">
              <div className="social-media-grid">
                <a href="https://linkedin.com/in/mohamed-abdelaziz" target="_blank" rel="noopener noreferrer" className="social-media-item linkedin">
                  <div className="social-icon-container">
                    <svg className="social-icon" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                    </svg>
                    <div className="social-glow"></div>
                  </div>
                  <span className="social-label">LinkedIn</span>
                </a>
                
                <a href="https://github.com/mohamed-abdelaziz" target="_blank" rel="noopener noreferrer" className="social-media-item github">
                  <div className="social-icon-container">
                    <svg className="social-icon" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                    </svg>
                    <div className="social-glow"></div>
                  </div>
                  <span className="social-label">GitHub</span>
                </a>
                
                <a href="https://twitter.com/mohamed_abdelaziz" target="_blank" rel="noopener noreferrer" className="social-media-item twitter">
                  <div className="social-icon-container">
                    <svg className="social-icon" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                    </svg>
                    <div className="social-glow"></div>
                  </div>
                  <span className="social-label">Twitter</span>
                </a>
                
                <a href="mailto:mohamed.abdelaziz.ai@gmail.com" className="social-media-item email">
                  <div className="social-icon-container">
                    <svg className="social-icon" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M24 5.457v13.909c0 .904-.732 1.636-1.636 1.636h-3.819V11.73L12 16.64l-6.545-4.91v9.273H1.636A1.636 1.636 0 0 1 0 19.366V5.457c0-.904.732-1.636 1.636-1.636h.91L12 10.09l9.454-6.269h.91c.904 0 1.636.732 1.636 1.636z"/>
                    </svg>
                    <div className="social-glow"></div>
                  </div>
                  <span className="social-label">Email</span>
                </a>
              </div>
            </div>
            
            <div className="footer-skills">
              <div className="skill-tags">
                <span className="skill-tag">Machine Learning</span>
                <span className="skill-tag">Python</span>
                <span className="skill-tag">TensorFlow</span>
                <span className="skill-tag">React</span>
                <span className="skill-tag">Node.js</span>
                <span className="skill-tag">AWS</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="footer-bottom">
          <div className="footer-bottom-content">
            <p>&copy; 2024 Mohamed Abdelaziz. All rights reserved.</p>
            <div className="availability-status">
              <span className="status-dot available"></span>
              <span>Open to Opportunities</span>
            </div>
          </div>
        </div>
      </footer>
      
      <QuantumChatbot />
    </div>
  );
}

export default App;