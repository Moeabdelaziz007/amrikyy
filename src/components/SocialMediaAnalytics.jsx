import React from 'react';

const SocialMediaAnalytics = ({ socialData }) => {
  return (
    <div className="cv-container">
      <div className="cv-header">
        <div className="cv-title-section">
          <h1 className="cv-name">Mohamed Abdelaziz</h1>
          <h2 className="cv-title">Senior AI Engineer & Technology Leader</h2>
          <p className="cv-tagline">Transforming ideas into intelligent solutions through cutting-edge AI/ML engineering</p>
        </div>
        <div className="cv-contact-info">
          <div className="contact-item">
            <svg className="contact-icon" viewBox="0 0 24 24" fill="currentColor">
              <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
            </svg>
            <span>mohamed.abdelaziz.ai@gmail.com</span>
          </div>
          <div className="contact-item">
            <svg className="contact-icon" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm-1-7.9c-.7 0-1.2-.5-1.2-1.2 0-.7.5-1.2 1.2-1.2s1.2.5 1.2 1.2c0 .7-.5 1.2-1.2 1.2zM17 17h-2v-3.4c0-.8 0-1.8-1.1-1.8-1.1 0-1.3.9-1.3 1.8V17h-2v-7h1.9v1h.1c.3-.5.9-1 1.9-1 2 0 2.4 1.3 2.4 3v4z"/>
            </svg>
            <span>linkedin.com/in/mohamed-abdelaziz</span>
          </div>
          <div className="contact-item">
            <svg className="contact-icon" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
            </svg>
            <span>Available for Remote Work Worldwide</span>
          </div>
        </div>
      </div>

      <div className="cv-grid">
        
        {/* Professional Summary */}
        <div className="cv-card summary-card">
          <div className="card-header">
            <svg className="card-icon" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
            </svg>
            <h3>Professional Summary</h3>
          </div>
          <div className="card-content">
            <p className="summary-text">
              Seasoned AI Engineer with 7+ years of experience designing and implementing scalable AI/ML solutions. 
              Expertise in full-stack development, natural language processing, and automated content generation systems. 
              Proven track record of delivering production-ready AI tools that process millions of data points and generate 
              optimized content for social media platforms.
            </p>
            <div className="key-stats">
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

        {/* Core Competencies */}
        <div className="cv-card skills-card">
          <div className="card-header">
            <svg className="card-icon" viewBox="0 0 24 24" fill="currentColor">
              <path d="M9.4 16.6L4.8 12l4.6-4.6L8 6l-6 6 6 6 1.4-1.4zm5.2 0L19.2 12l-4.6-4.6L16 6l6 6-6 6-1.4-1.4z"/>
            </svg>
            <h3>Core Competencies</h3>
          </div>
          <div className="card-content">
            <div className="skills-section">
              <div className="skill-category">
                <h4>Programming & Frameworks</h4>
                <div className="skill-list">
                  <div className="skill-item">
                    <span className="skill-name">Python</span>
                    <div className="skill-bar">
                      <div className="skill-progress" style={{'--width': '95%'}}></div>
                    </div>
                  </div>
                  <div className="skill-item">
                    <span className="skill-name">JavaScript/TypeScript</span>
                    <div className="skill-bar">
                      <div className="skill-progress" style={{'--width': '90%'}}></div>
                    </div>
                  </div>
                  <div className="skill-item">
                    <span className="skill-name">React.js</span>
                    <div className="skill-bar">
                      <div className="skill-progress" style={{'--width': '88%'}}></div>
                    </div>
                  </div>
                  <div className="skill-item">
                    <span className="skill-name">Flask/FastAPI</span>
                    <div className="skill-bar">
                      <div className="skill-progress" style={{'--width': '92%'}}></div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="skill-category">
                <h4>AI/ML Technologies</h4>
                <div className="tech-grid">
                  <span className="tech-badge">TensorFlow</span>
                  <span className="tech-badge">PyTorch</span>
                  <span className="tech-badge">OpenAI API</span>
                  <span className="tech-badge">Scikit-learn</span>
                  <span className="tech-badge">NLP Libraries</span>
                  <span className="tech-badge">Computer Vision</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Education & Certifications */}
        <div className="cv-card education-card">
          <div className="card-header">
            <svg className="card-icon" viewBox="0 0 24 24" fill="currentColor">
              <path d="M5 13.18v4L12 21l7-3.82v-4L12 17l-7-3.82zM12 3L1 9l11 6 9-4.91V17h2V9L12 3z"/>
            </svg>
            <h3>Education & Certifications</h3>
          </div>
          <div className="card-content">
            <div className="education-list">
              <div className="education-item">
                <div className="education-degree">
                  <h4>Master of Science in Computer Science</h4>
                  <span className="education-focus">Specialization: Artificial Intelligence & Machine Learning</span>
                </div>
                <div className="education-details">
                  <span className="education-school">Cairo University</span>
                  <span className="education-year">2020</span>
                </div>
              </div>
              <div className="education-item">
                <div className="education-degree">
                  <h4>Bachelor of Engineering in Software Engineering</h4>
                  <span className="education-focus">Magna Cum Laude</span>
                </div>
                <div className="education-details">
                  <span className="education-school">Cairo University</span>
                  <span className="education-year">2018</span>
                </div>
              </div>
            </div>
            <div className="certifications">
              <h4>Professional Certifications</h4>
              <div className="cert-list">
                <div className="cert-item">
                  <span className="cert-name">AWS Certified Solutions Architect</span>
                  <span className="cert-year">2023</span>
                </div>
                <div className="cert-item">
                  <span className="cert-name">Google Cloud Professional ML Engineer</span>
                  <span className="cert-year">2022</span>
                </div>
                <div className="cert-item">
                  <span className="cert-name">TensorFlow Developer Certificate</span>
                  <span className="cert-year">2021</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Professional Experience */}
        <div className="cv-card experience-card large">
          <div className="card-header">
            <svg className="card-icon" viewBox="0 0 24 24" fill="currentColor">
              <path d="M14 6V4h-4v2h4zM4 8v11h16V8H4zm16-2c1.11 0 2 .89 2 2v11c0 1.11-.89 2-2 2H4c-1.11 0-2-.89-2-2V8c0-1.11.89-2 2-2h16z"/>
            </svg>
            <h3>Professional Experience</h3>
          </div>
          <div className="card-content">
            <div className="experience-timeline">
              <div className="experience-item">
                <div className="experience-period">
                  <span className="period-dates">2023 - Present</span>
                  <div className="period-line"></div>
                </div>
                <div className="experience-details">
                  <h4>Senior AI Engineer & Independent Developer</h4>
                  <span className="company-name">Freelance & Personal Projects</span>
                  <ul className="achievements-list">
                    <li>Architected and deployed AI Data Collector & Social Media Content Generator - a production-ready platform processing 10M+ data points monthly</li>
                    <li>Built scalable data processing pipelines using Python, Flask, and PostgreSQL with 99.9% uptime</li>
                    <li>Implemented advanced NLP algorithms for content optimization, achieving 40% improvement in engagement rates</li>
                    <li>Developed real-time analytics dashboard with custom visualization components using React.js and D3.js</li>
                    <li>Created automated social media API integrations supporting Twitter, LinkedIn, Instagram, and Facebook</li>
                  </ul>
                  <div className="tech-stack">
                    <span className="tech-tag">Python</span>
                    <span className="tech-tag">Flask</span>
                    <span className="tech-tag">OpenAI API</span>
                    <span className="tech-tag">PostgreSQL</span>
                    <span className="tech-tag">React.js</span>
                    <span className="tech-tag">AWS</span>
                  </div>
                </div>
              </div>
              
              <div className="experience-item">
                <div className="experience-period">
                  <span className="period-dates">2020 - 2023</span>
                  <div className="period-line"></div>
                </div>
                <div className="experience-details">
                  <h4>AI/ML Engineering & Research</h4>
                  <span className="company-name">Technology Development & Research</span>
                  <ul className="achievements-list">
                    <li>Specialized in natural language processing and automated content generation systems</li>
                    <li>Designed intelligent data mining algorithms for multi-source social media analytics</li>
                    <li>Built automated content workflows reducing manual effort by 85% for content creation teams</li>
                    <li>Researched and implemented cutting-edge ML models for sentiment analysis and trend prediction</li>
                    <li>Developed APIs and microservices architecture for scalable AI model deployment</li>
                  </ul>
                  <div className="tech-stack">
                    <span className="tech-tag">TensorFlow</span>
                    <span className="tech-tag">PyTorch</span>
                    <span className="tech-tag">Scikit-learn</span>
                    <span className="tech-tag">Docker</span>
                    <span className="tech-tag">Kubernetes</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Key Projects */}
        <div className="cv-card projects-showcase">
          <div className="card-header">
            <svg className="card-icon" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
            </svg>
            <h3>Featured Projects & Achievements</h3>
          </div>
          <div className="card-content">
            <div className="projects-list">
              <div className="project-highlight">
                <div className="project-header">
                  <h4>AI Data Collector & Social Media Content Generator</h4>
                  <span className="project-status live">Production System</span>
                </div>
                <p className="project-description">
                  Full-stack AI platform automating data collection and content generation for social media. 
                  Processes millions of data points and generates optimized content using advanced NLP techniques.
                </p>
                <div className="project-metrics">
                  <div className="metric-item">
                    <span className="metric-value">10M+</span>
                    <span className="metric-label">Data Points Processed</span>
                  </div>
                  <div className="metric-item">
                    <span className="metric-value">99.9%</span>
                    <span className="metric-label">System Uptime</span>
                  </div>
                  <div className="metric-item">
                    <span className="metric-value">40%</span>
                    <span className="metric-label">Engagement Improvement</span>
                  </div>
                </div>
                <a href="https://b511554a-46dd-440c-bfae-a4464bd8bd9d-00-1ipa6t3tdk4oo.spock.replit.dev/" target="_blank" rel="noopener noreferrer" className="project-link">
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M19 19H5V5h7V3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.11 0 2-.9 2-2v-7h-2v7zM14 3v2h3.59l-9.83 9.83 1.41 1.41L19 6.41V10h2V3h-7z"/>
                  </svg>
                  View Live Project
                </a>
              </div>
              
              <div className="project-highlight">
                <div className="project-header">
                  <h4>StayX - Web3 Sustainability Rewards Platform</h4>
                  <span className="project-status completed">Coinbase x GCA Challenge</span>
                </div>
                <p className="project-description">
                  Web3 blockchain platform incentivizing sustainable actions through token rewards. 
                  Built complete UX design and live demo using real Intel environmental data integration.
                </p>
                <div className="project-tech">
                  <span className="tech-badge">Web3</span>
                  <span className="tech-badge">Blockchain</span>
                  <span className="tech-badge">Gradio</span>
                  <span className="tech-badge">UX Design</span>
                  <span className="tech-badge">Intel APIs</span>
                </div>
                <a href="https://huggingface.co/spaces/cryptojoker/stayx" target="_blank" rel="noopener noreferrer" className="project-link">
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M19 19H5V5h7V3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.11 0 2-.9 2-2v-7h-2v7zM14 3v2h3.59l-9.83 9.83 1.41 1.41L19 6.41V10h2V3h-7z"/>
                  </svg>
                  View on Hugging Face
                </a>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default SocialMediaAnalytics;
