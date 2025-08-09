import React from 'react';

const Dashboard = ({ quantumData }) => {
  return (
    <div className="portfolio-container">
      {/* Professional Summary Hero */}
      <div className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">Senior AI Engineer & Technology Leader</h1>
          <p className="hero-subtitle">
            Passionate about building scalable AI systems and leading cross-functional teams to deliver 
            innovative solutions. Experienced in machine learning, cloud architecture, and full-stack development.
          </p>
          <div className="hero-stats">
            <div className="stat-item">
              <span className="stat-number">7+</span>
              <span className="stat-label">Years Experience</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">50+</span>
              <span className="stat-label">Projects Delivered</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">15+</span>
              <span className="stat-label">AI Models Deployed</span>
            </div>
          </div>
        </div>
      </div>

      <div className="portfolio-grid">
        
        {/* Technical Skills */}
        <div className="portfolio-card skills-card">
          <div className="card-header">
            <svg className="card-icon" viewBox="0 0 24 24" fill="currentColor">
              <path d="M9.4 16.6L4.8 12l4.6-4.6L8 6l-6 6 6 6 1.4-1.4zm5.2 0L19.2 12l-4.6-4.6L16 6l6 6-6 6-1.4-1.4z"/>
            </svg>
            <h3>Technical Expertise</h3>
          </div>
          <div className="card-content">
            <div className="skill-category">
              <h4>Programming Languages</h4>
              <div className="skill-items">
                <div className="skill-item">
                  <span className="skill-name">Python</span>
                  <div className="skill-bar">
                    <div className="skill-progress" style={{width: '95%'}}></div>
                  </div>
                </div>
                <div className="skill-item">
                  <span className="skill-name">JavaScript/TypeScript</span>
                  <div className="skill-bar">
                    <div className="skill-progress" style={{width: '90%'}}></div>
                  </div>
                </div>
                <div className="skill-item">
                  <span className="skill-name">Go</span>
                  <div className="skill-bar">
                    <div className="skill-progress" style={{width: '80%'}}></div>
                  </div>
                </div>
              </div>
            </div>
            <div className="skill-category">
              <h4>AI/ML Frameworks</h4>
              <div className="tech-tags">
                <span className="tech-tag">TensorFlow</span>
                <span className="tech-tag">PyTorch</span>
                <span className="tech-tag">Scikit-learn</span>
                <span className="tech-tag">OpenAI API</span>
            </div>
            </div>
          </div>
        </div>

        {/* Key Achievements */}
        <div className="portfolio-card achievements-card">
          <div className="card-header">
            <svg className="card-icon" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
            </svg>
            <h3>Key Achievements</h3>
          </div>
          <div className="card-content">
            <div className="achievement-item">
              <div className="achievement-icon">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.94-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>
                </svg>
              </div>
              <div className="achievement-content">
                <h4>AI-Powered Content Generation Platform</h4>
                <p>Built and deployed production-ready AI tool for automated data collection and social media content generation with real-time processing capabilities</p>
              </div>
            </div>
            <div className="achievement-item">
              <div className="achievement-icon">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z"/>
                </svg>
              </div>
              <div className="achievement-content">
                <h4>Data Processing & Analytics</h4>
                <p>Implemented intelligent data mining algorithms with multi-source integration and advanced analytics for content optimization</p>
              </div>
            </div>
            <div className="achievement-item">
              <div className="achievement-icon">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                </svg>
              </div>
              <div className="achievement-content">
                <h4>Web3 Blockchain Development - StayX</h4>
                <p>Built Web3 sustainability platform for Coinbase x GCA Challenge using blockchain tokens to reward eco-actions with real Intel data integration and complete UX design</p>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Projects */}
        <div className="portfolio-card projects-card">
          <div className="card-header">
            <svg className="card-icon" viewBox="0 0 24 24" fill="currentColor">
              <path d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z"/>
            </svg>
            <h3>Featured Projects</h3>
          </div>
          <div className="card-content">
            <div className="project-item">
              <div className="project-header">
                <h4>AI Data Collector & Social Media Content Generator</h4>
                <span className="project-status live">Live Project</span>
              </div>
              <p className="project-description">
                Intelligent data collection platform with AI-powered social media content generation capabilities. 
                Automates content creation workflows and data aggregation for social media management.
              </p>
              <div className="project-tech">
                <span className="tech-badge">Python</span>
                <span className="tech-badge">AI/ML</span>
                <span className="tech-badge">Social APIs</span>
                <span className="tech-badge">Data Processing</span>
              </div>
            </div>
            <div className="project-item">
              <div className="project-header">
                <h4>StayX - Web3 Sustainability Rewards Platform</h4>
                <span className="project-status completed">Completed</span>
              </div>
              <p className="project-description">
                Coinbase x GCA Web3 Challenge project that rewards sustainable actions using blockchain tokens and real Intel data. 
                Features blockchain logic for eco incentives and complete UX design from scratch.
              </p>
              <div className="project-tech">
                <span className="tech-badge">Web3</span>
                <span className="tech-badge">Blockchain</span>
                <span className="tech-badge">Gradio</span>
                <span className="tech-badge">UX Design</span>
              </div>
            </div>
          </div>
        </div>

        {/* Professional Experience Timeline */}
        <div className="portfolio-card timeline-card large">
          <div className="card-header">
            <svg className="card-icon" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
            </svg>
            <h3>Professional Experience & Projects</h3>
          </div>
          <div className="card-content">
            <div className="timeline">
              <div className="timeline-item">
                <div className="timeline-marker"></div>
                <div className="timeline-content">
                  <div className="timeline-header">
                    <h4>Senior AI Engineer & Independent Developer</h4>
                    <span className="timeline-period">2023 - Present</span>
                  </div>
                  <p className="timeline-company">Freelance & Personal Projects</p>
                  <ul className="timeline-achievements">
                    <li>Developed AI Data Collector & Social Media Content Generator - a production-ready tool for automated content creation</li>
                    <li>Built scalable data processing systems with real-time analytics and multi-platform integration</li>
                    <li>Implemented advanced AI algorithms for content optimization and audience targeting</li>
                    <li>Created end-to-end solutions combining machine learning, web development, and cloud deployment</li>
                  </ul>
                </div>
              </div>
              <div className="timeline-item">
                <div className="timeline-marker"></div>
                <div className="timeline-content">
                  <div className="timeline-header">
                    <h4>AI/ML Engineering & Research</h4>
                    <span className="timeline-period">2020 - 2023</span>
                  </div>
                  <p className="timeline-company">Technology Development</p>
                  <ul className="timeline-achievements">
                    <li>Specialized in natural language processing and content generation algorithms</li>
                    <li>Designed and implemented data mining systems for social media analytics</li>
                    <li>Developed automated workflows for content creation and distribution</li>
                    <li>Built expertise in Python, AI/ML frameworks, and cloud-based deployment</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Live Project Showcase */}
        <div className="portfolio-card demo-card large">
          <div className="card-header">
            <svg className="card-icon" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
            </svg>
            <h3>Live AI Project Showcase</h3>
          </div>
          <div className="card-content">
            <div className="demo-grid">
              <div className="demo-item featured">
                <div className="demo-header">
                  <h4>AI Data Collector & Social Media Content Generator</h4>
                  <span className="demo-status live">Live Production</span>
                </div>
                <p className="demo-description">
                  Production-ready AI platform that automates data collection from multiple sources and generates optimized social media content using advanced natural language processing. Built with Python, Flask, and OpenAI API integration for real-time content creation and analytics.
                </p>
                <div className="project-highlights">
                  <div className="highlight-item">
                    <svg className="highlight-icon" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                    </svg>
                    <span>Automated multi-source data aggregation</span>
                  </div>
                  <div className="highlight-item">
                    <svg className="highlight-icon" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                    </svg>
                    <span>AI-powered content generation & optimization</span>
                  </div>
                  <div className="highlight-item">
                    <svg className="highlight-icon" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                    </svg>
                    <span>Real-time analytics dashboard with performance metrics</span>
                  </div>
                  <div className="highlight-item">
                    <svg className="highlight-icon" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                    </svg>
                    <span>Multi-platform social media API integration</span>
                  </div>
                </div>
                <div className="demo-preview">
                  <iframe 
                    src="https://b511554a-46dd-440c-bfae-a4464bd8bd9d-00-1ipa6t3tdk4oo.spock.replit.dev/" 
                    title="AI Data Collector & Social Media Content Generator"
                    className="demo-iframe"
                    loading="lazy"
                  ></iframe>
                  <div className="demo-overlay">
                    <a 
                      href="https://b511554a-46dd-440c-bfae-a4464bd8bd9d-00-1ipa6t3tdk4oo.spock.replit.dev/" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="demo-launch-btn"
                    >
                      <svg viewBox="0 0 24 24" fill="currentColor">
                        <path d="M19 19H5V5h7V3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.11 0 2-.9 2-2v-7h-2v7zM14 3v2h3.59l-9.83 9.83 1.41 1.41L19 6.41V10h2V3h-7z"/>
                      </svg>
                      Launch Live Tool
                    </a>
                  </div>
                </div>
                <div className="demo-tech">
                  <span className="tech-badge">Python</span>
                  <span className="tech-badge">AI/ML</span>
                  <span className="tech-badge">Data Mining</span>
                  <span className="tech-badge">Content Generation</span>
                  <span className="tech-badge">Social APIs</span>
                </div>
              </div>
              
              <div className="demo-item">
                <div className="demo-header">
                  <h4>Technical Architecture</h4>
                  <span className="demo-status live">Production Architecture</span>
                </div>
                <div className="architecture-overview">
                  <div className="architecture-layer">
                    <div className="layer-title">Frontend Layer</div>
                    <div className="layer-tech">
                      <span className="tech-badge">React.js</span>
                      <span className="tech-badge">Material-UI</span>
                      <span className="tech-badge">Chart.js</span>
                    </div>
                  </div>
                  <div className="architecture-layer">
                    <div className="layer-title">Backend Services</div>
                    <div className="layer-tech">
                      <span className="tech-badge">Python/Flask</span>
                      <span className="tech-badge">OpenAI API</span>
                      <span className="tech-badge">RESTful APIs</span>
                    </div>
                  </div>
                  <div className="architecture-layer">
                    <div className="layer-title">Data & Analytics</div>
                    <div className="layer-tech">
                      <span className="tech-badge">PostgreSQL</span>
                      <span className="tech-badge">Redis Cache</span>
                      <span className="tech-badge">Social APIs</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="demo-item">
                <div className="demo-header">
                  <h4>StayX - Web3 Sustainability Platform</h4>
                  <span className="demo-status live">Live on Hugging Face</span>
                </div>
                <p className="demo-description">
                  Web3 blockchain project from Coinbase x GCA Challenge. Rewards sustainable actions with blockchain tokens using real Intel data. Complete with UX design and live Gradio demo.
                </p>
                <div className="demo-actions">
                  <a 
                    href="https://huggingface.co/spaces/cryptojoker/stayx" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="demo-link-btn"
                  >
                    <svg viewBox="0 0 24 24" fill="currentColor">
                      <path d="M19 19H5V5h7V3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.11 0 2-.9 2-2v-7h-2v7zM14 3v2h3.59l-9.83 9.83 1.41 1.41L19 6.41V10h2V3h-7z"/>
                    </svg>
                    View on Hugging Face
                  </a>
                </div>
                <div className="demo-tech">
                  <span className="tech-badge">Web3</span>
                  <span className="tech-badge">Blockchain</span>
                  <span className="tech-badge">Sustainability</span>
              </div>
              </div>
            </div>
          </div>
        </div>

        {/* Contact CTA */}
        <div className="portfolio-card cta-card">
          <div className="card-header">
            <svg className="card-icon" viewBox="0 0 24 24" fill="currentColor">
              <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
            </svg>
            <h3>Let's Connect</h3>
          </div>
          <div className="card-content">
            <p className="cta-text">
              Interested in discussing AI, technology leadership, or potential opportunities? 
              I'm always open to connecting with fellow professionals and exploring new challenges.
            </p>
            <div className="cta-actions">
              <a 
                href="https://linkedin.com/in/mohamed-abdelaziz" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="cta-button primary"
                aria-label="Connect with Mohamed on LinkedIn"
              >
                <svg className="cta-icon" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
                Connect on LinkedIn
                <span className="cta-indicator" aria-hidden="true">→</span>
              </a>
              <a 
                href="mailto:mohamed.abdelaziz.ai@gmail.com" 
                className="cta-button secondary"
                aria-label="Send email to Mohamed"
              >
                <svg className="cta-icon" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M24 5.457v13.909c0 .904-.732 1.636-1.636 1.636h-3.819V11.73L12 16.64l-6.545-4.91v9.273H1.636A1.636 1.636 0 0 1 0 19.366V5.457c0-.904.732-1.636 1.636-1.636h.91L12 10.09l9.454-6.269h.91c.904 0 1.636.732 1.636 1.636z"/>
                </svg>
                Send Email
                <span className="cta-indicator" aria-hidden="true">→</span>
              </a>
              <button 
                className="cta-button tertiary"
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                aria-label="Download CV as PDF"
              >
                <svg className="cta-icon" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6z"/>
                  <path d="M14 2v6h6"/>
                  <path d="M16 13a6 6 0 0 1-6 6c-3 0-6-3-6-6"/>
                  <path d="M10 16l-2-2 2-2"/>
                </svg>
                Download CV
                <span className="cta-indicator" aria-hidden="true">↓</span>
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Dashboard;
