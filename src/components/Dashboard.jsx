import React from 'react';

const Dashboard = ({ quantumData }) => {
  return (
    <div className="dashboard-container">
      <div className="dashboard-grid">
        
        {/* Quantum Status Card */}
        <div className="quantum-card">
          <div className="card-header">
            <div className="quantum-icon">
              <div className="quantum-core"></div>
              <div className="quantum-ring"></div>
            </div>
            <h3>Quantum Status</h3>
          </div>
          <div className="card-content">
            <div className="status-indicator active">
              <span className="status-dot"></span>
              Quantum Field Active
            </div>
            <div className="metric">
              <span className="metric-label">Coherence Level</span>
              <span className="metric-value">98.7%</span>
            </div>
            <div className="metric">
              <span className="metric-label">Entanglement Rate</span>
              <span className="metric-value">1,247 qps</span>
            </div>
          </div>
        </div>

        {/* AI Insights Card */}
        <div className="quantum-card">
          <div className="card-header">
            <div className="ai-icon">🧠</div>
            <h3>AI Insights</h3>
          </div>
          <div className="card-content">
            <div className="insight-item">
              <span className="insight-label">Neural Networks</span>
              <div className="progress-bar">
                <div className="progress-fill" style={{width: '85%'}}></div>
              </div>
              <span className="insight-value">85%</span>
            </div>
            <div className="insight-item">
              <span className="insight-label">Pattern Recognition</span>
              <div className="progress-bar">
                <div className="progress-fill" style={{width: '92%'}}></div>
              </div>
              <span className="insight-value">92%</span>
            </div>
            <div className="insight-item">
              <span className="insight-label">Quantum Learning</span>
              <div className="progress-bar">
                <div className="progress-fill" style={{width: '76%'}}></div>
              </div>
              <span className="insight-value">76%</span>
            </div>
          </div>
        </div>

        {/* Performance Metrics */}
        <div className="quantum-card">
          <div className="card-header">
            <div className="metrics-icon">⚡</div>
            <h3>Performance Metrics</h3>
          </div>
          <div className="card-content">
            <div className="metrics-grid">
              <div className="metric-box">
                <span className="metric-number">2.4M</span>
                <span className="metric-name">Quantum Operations</span>
              </div>
              <div className="metric-box">
                <span className="metric-number">847ms</span>
                <span className="metric-name">Response Time</span>
              </div>
              <div className="metric-box">
                <span className="metric-number">99.9%</span>
                <span className="metric-name">Uptime</span>
              </div>
              <div className="metric-box">
                <span className="metric-number">128</span>
                <span className="metric-name">Active Qubits</span>
              </div>
            </div>
          </div>
        </div>

        {/* Quantum Data Visualization */}
        <div className="quantum-card large">
          <div className="card-header">
            <div className="viz-icon">📊</div>
            <h3>Quantum Data Streams</h3>
          </div>
          <div className="card-content">
            <div className="quantum-visualization">
              <div className="data-stream">
                <div className="stream-line" style={{'--delay': '0s'}}></div>
                <div className="stream-line" style={{'--delay': '0.5s'}}></div>
                <div className="stream-line" style={{'--delay': '1s'}}></div>
                <div className="stream-line" style={{'--delay': '1.5s'}}></div>
                <div className="stream-line" style={{'--delay': '2s'}}></div>
              </div>
              <div className="data-points">
                <div className="data-point" style={{'--x': '20%', '--y': '30%'}}></div>
                <div className="data-point" style={{'--x': '45%', '--y': '60%'}}></div>
                <div className="data-point" style={{'--x': '70%', '--y': '25%'}}></div>
                <div className="data-point" style={{'--x': '85%', '--y': '75%'}}></div>
              </div>
            </div>
          </div>
        </div>

        {/* System Logs */}
        <div className="quantum-card">
          <div className="card-header">
            <div className="logs-icon">📝</div>
            <h3>System Logs</h3>
          </div>
          <div className="card-content">
            <div className="log-container">
              <div className="log-entry">
                <span className="log-time">14:32:15</span>
                <span className="log-message">Quantum field calibration complete</span>
                <span className="log-status success">✓</span>
              </div>
              <div className="log-entry">
                <span className="log-time">14:31:48</span>
                <span className="log-message">AI model synchronization started</span>
                <span className="log-status info">ℹ</span>
              </div>
              <div className="log-entry">
                <span className="log-time">14:30:22</span>
                <span className="log-message">Neural network optimization complete</span>
                <span className="log-status success">✓</span>
              </div>
              <div className="log-entry">
                <span className="log-time">14:29:03</span>
                <span className="log-message">Quantum entanglement established</span>
                <span className="log-status success">✓</span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Dashboard;
