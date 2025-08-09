import React from 'react';

const SocialMediaAnalytics = ({ socialData }) => {
  return (
    <div className="social-analytics-container">
      <div className="analytics-header">
        <h2>Quantum Social Media Analytics</h2>
        <p>AI-powered insights across quantum social networks</p>
      </div>

      <div className="analytics-grid">
        
        {/* Engagement Metrics */}
        <div className="quantum-card">
          <div className="card-header">
            <div className="engagement-icon">💫</div>
            <h3>Quantum Engagement</h3>
          </div>
          <div className="card-content">
            <div className="metric-row">
              <span className="metric-label">Total Reach</span>
              <span className="metric-value neon-green">847.2K</span>
            </div>
            <div className="metric-row">
              <span className="metric-label">Quantum Interactions</span>
              <span className="metric-value neon-blue">24.7K</span>
            </div>
            <div className="metric-row">
              <span className="metric-label">Entanglement Rate</span>
              <span className="metric-value neon-purple">3.2%</span>
            </div>
            <div className="engagement-chart">
              <div className="chart-bar" style={{'--height': '85%', '--color': '#39FF14'}}></div>
              <div className="chart-bar" style={{'--height': '72%', '--color': '#00d4ff'}}></div>
              <div className="chart-bar" style={{'--height': '93%', '--color': '#b600ff'}}></div>
              <div className="chart-bar" style={{'--height': '67%', '--color': '#39FF14'}}></div>
              <div className="chart-bar" style={{'--height': '89%', '--color': '#00d4ff'}}></div>
            </div>
          </div>
        </div>

        {/* Platform Analytics */}
        <div className="quantum-card">
          <div className="card-header">
            <div className="platform-icon">🌐</div>
            <h3>Platform Distribution</h3>
          </div>
          <div className="card-content">
            <div className="platform-stats">
              <div className="platform-item">
                <div className="platform-info">
                  <span className="platform-name">Quantum Twitter</span>
                  <span className="platform-percentage">42.3%</span>
                </div>
                <div className="platform-bar">
                  <div className="bar-fill" style={{'--width': '42.3%', '--color': '#39FF14'}}></div>
                </div>
              </div>
              <div className="platform-item">
                <div className="platform-info">
                  <span className="platform-name">Neural LinkedIn</span>
                  <span className="platform-percentage">28.7%</span>
                </div>
                <div className="platform-bar">
                  <div className="bar-fill" style={{'--width': '28.7%', '--color': '#00d4ff'}}></div>
                </div>
              </div>
              <div className="platform-item">
                <div className="platform-info">
                  <span className="platform-name">Meta Quantum</span>
                  <span className="platform-percentage">19.2%</span>
                </div>
                <div className="platform-bar">
                  <div className="bar-fill" style={{'--width': '19.2%', '--color': '#b600ff'}}></div>
                </div>
              </div>
              <div className="platform-item">
                <div className="platform-info">
                  <span className="platform-name">Quantum GitHub</span>
                  <span className="platform-percentage">9.8%</span>
                </div>
                <div className="platform-bar">
                  <div className="bar-fill" style={{'--width': '9.8%', '--color': '#ffffff'}}></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sentiment Analysis */}
        <div className="quantum-card">
          <div className="card-header">
            <div className="sentiment-icon">🧠</div>
            <h3>Quantum Sentiment Analysis</h3>
          </div>
          <div className="card-content">
            <div className="sentiment-overview">
              <div className="sentiment-circle">
                <div className="circle-progress" style={{'--percentage': '78%'}}>
                  <span className="sentiment-score">78%</span>
                </div>
                <span className="sentiment-label">Overall Positivity</span>
              </div>
              <div className="sentiment-breakdown">
                <div className="sentiment-item positive">
                  <span className="sentiment-dot"></span>
                  <span>Positive: 78.3%</span>
                </div>
                <div className="sentiment-item neutral">
                  <span className="sentiment-dot"></span>
                  <span>Neutral: 16.8%</span>
                </div>
                <div className="sentiment-item negative">
                  <span className="sentiment-dot"></span>
                  <span>Negative: 4.9%</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Top Performing Content */}
        <div className="quantum-card large">
          <div className="card-header">
            <div className="content-icon">🚀</div>
            <h3>Quantum Content Performance</h3>
          </div>
          <div className="card-content">
            <div className="content-list">
              <div className="content-item">
                <div className="content-info">
                  <h4>Quantum AI breakthrough in consciousness research</h4>
                  <span className="content-meta">2 hours ago • Quantum Twitter</span>
                </div>
                <div className="content-metrics">
                  <span className="metric">👁 12.4K</span>
                  <span className="metric">💫 847</span>
                  <span className="metric">🔗 234</span>
                </div>
              </div>
              <div className="content-item">
                <div className="content-info">
                  <h4>Neural network entanglement theory explained</h4>
                  <span className="content-meta">5 hours ago • Neural LinkedIn</span>
                </div>
                <div className="content-metrics">
                  <span className="metric">👁 8.7K</span>
                  <span className="metric">💫 623</span>
                  <span className="metric">🔗 156</span>
                </div>
              </div>
              <div className="content-item">
                <div className="content-info">
                  <h4>Quantum computing meets cybersecurity</h4>
                  <span className="content-meta">1 day ago • Quantum GitHub</span>
                </div>
                <div className="content-metrics">
                  <span className="metric">👁 6.2K</span>
                  <span className="metric">💫 421</span>
                  <span className="metric">🔗 89</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Real-time Activity */}
        <div className="quantum-card">
          <div className="card-header">
            <div className="activity-icon">⚡</div>
            <h3>Real-time Quantum Activity</h3>
          </div>
          <div className="card-content">
            <div className="activity-feed">
              <div className="activity-item">
                <div className="activity-time">Just now</div>
                <div className="activity-text">New quantum entanglement detected</div>
                <div className="activity-pulse"></div>
              </div>
              <div className="activity-item">
                <div className="activity-time">2 min ago</div>
                <div className="activity-text">AI model synchronization complete</div>
                <div className="activity-pulse"></div>
              </div>
              <div className="activity-item">
                <div className="activity-time">5 min ago</div>
                <div className="activity-text">Quantum coherence threshold reached</div>
                <div className="activity-pulse"></div>
              </div>
              <div className="activity-item">
                <div className="activity-time">8 min ago</div>
                <div className="activity-text">Neural network optimization cycle</div>
                <div className="activity-pulse"></div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default SocialMediaAnalytics;
