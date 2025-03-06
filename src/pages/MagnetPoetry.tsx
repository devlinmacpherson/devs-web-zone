import React from 'react';
import { Link } from 'react-router-dom';

const MagnetPoetry = () => (
  <div className="placeholder-page">
    <div className="placeholder-content">
      <h1>Magnet Poetry</h1>
      <div className="placeholder-description">
        <h2>Digital Magnetic Poetry Experience</h2>
        <div className="feature-list">
          <h3>Planned Features:</h3>
          <ul>
            <li>Draggable word magnets</li>
            <li>Multiple word sets and themes</li>
            <li>Save and share your creations</li>
            <li>Collaborative poetry rooms</li>
          </ul>
        </div>
        <div className="development-status">
          <p>✨ Design phase</p>
          <div className="progress-bar">
            <div className="progress" style={{ width: '30%' }}></div>
          </div>
        </div>
      </div>
      <Link to="/" className="back-button">← Back to Hub</Link>
    </div>
  </div>
);

export default MagnetPoetry; 