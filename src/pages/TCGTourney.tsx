import React from 'react';
import { Link } from 'react-router-dom';

const TCGTourney = () => (
  <div className="placeholder-page">
    <div className="placeholder-content">
      <h1>TCGTourney</h1>
      <div className="placeholder-description">
        <h2>Tournament Management System</h2>
        <div className="feature-list">
          <h3>Planned Features:</h3>
          <ul>
            <li>Swiss-style tournament organization</li>
            <li>Player registration and deck management</li>
            <li>Real-time match results and standings</li>
            <li>Tournament history and statistics</li>
          </ul>
        </div>
        <div className="development-status">
          <p>🎮 In planning phase</p>
          <div className="progress-bar">
            <div className="progress" style={{ width: '20%' }}></div>
          </div>
        </div>
      </div>
      <Link to="/" className="back-button">← Back to Hub</Link>
    </div>
  </div>
);

export default TCGTourney; 