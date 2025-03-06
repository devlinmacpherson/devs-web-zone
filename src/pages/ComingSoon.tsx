import React from 'react';
import { Link } from 'react-router-dom';

const ComingSoon = () => (
  <div className="placeholder-page">
    <div className="placeholder-content">
      <h1>More Experiments Coming Soon</h1>
      <div className="placeholder-description">
        <h2>Future Projects Hub</h2>
        <div className="feature-list">
          <h3>Potential Future Projects:</h3>
          <ul>
            <li>Interactive Data Visualizations</li>
            <li>AI-powered Web Tools</li>
            <li>Creative Coding Experiments</li>
            <li>Web-based Game Prototypes</li>
          </ul>
        </div>
        <div className="idea-submission">
          <p>💡 Have an idea? Stay tuned for updates!</p>
        </div>
      </div>
      <Link to="/" className="back-button">← Back to Hub</Link>
    </div>
  </div>
);

export default ComingSoon; 