import React from 'react';
import { Link } from 'react-router-dom';

export const HomePage: React.FC = () => {
  return (
    <div className="homepage-wrapper">
      <div className="home-left">
        <div className="home-badges">
          <span className="home-badge-brand">GrievAI</span>
          <span className="home-badge-version">v1.0.0</span>
          <span className="home-badge-tech"><span className="dot-green"></span>React + FastAPI</span>
        </div>
        
        <h1 className="home-headline">
          AI-Powered Complaint Management. <span className="home-headline-highlight">For Pharma QMS.</span>
        </h1>
        
        <p className="home-subheadline">
          Automated customer complaint intake for API and FDF pharmaceutical manufacturing. Extract data, assess risks, and file directly into your Quality Management System (QMS).
        </p>
        
        <div className="home-actions">
          <Link to="/analyze" className="home-btn-primary">
            <span className="plus-icon">+</span> Complaint Intake <span className="btn-path">/analyze</span>
          </Link>
          <Link to="/history" className="home-btn-secondary">
            Past Complaints <span className="btn-path">/history</span>
          </Link>
        </div>
        
        <div className="home-bottom-badge">
          <span className="badge-method">POST</span>
          <span className="badge-path">/analyze</span>
          <span className="badge-status">· 201 accepted</span>
        </div>
      </div>
      
      <div className="home-right">
        <div className="mock-card">
          <div className="mock-card-header">
            <div className="mock-card-title-group">
              <span className="mock-card-label">COMPLAINT REGISTER</span>
              <h3 className="mock-card-id">Intake • #CMP-2024-0847</h3>
            </div>
            <div className="mock-card-sealed">
              <span className="dot-green"></span> Sealed
            </div>
          </div>
          
          <div className="mock-card-subject">
            <span className="mock-card-label">SUBJECT</span>
            <p className="mock-card-desc">Black particles observed in Paracetamol 500mg tablets (Batch: B-789)</p>
          </div>
          
          <div className="mock-card-grid">
            <div className="mock-box">
              <span className="mock-card-label">DEPT</span>
              <p className="mock-box-val">Quality Assurance</p>
            </div>
            <div className="mock-box">
              <span className="mock-card-label">SEVERITY</span>
              <p className="mock-box-val text-high">High</p>
            </div>
          </div>
          
          <div className="mock-bars">
            <div className="mock-bar-group">
              <div className="mock-bar-labels">
                <span>Classified</span>
                <span>Foreign Matter</span>
              </div>
              <div className="mock-bar-track"><div className="mock-bar-fill" style={{width: '90%'}}></div></div>
            </div>
            
            <div className="mock-bar-group">
              <div className="mock-bar-labels">
                <span>Confidence</span>
                <span>0.94</span>
              </div>
              <div className="mock-bar-track"><div className="mock-bar-fill-light" style={{width: '94%'}}></div></div>
            </div>
            
            <div className="mock-bar-group">
              <div className="mock-bar-labels">
                <span>Mandate</span>
                <span>48h</span>
              </div>
              <div className="mock-bar-track"><div className="mock-bar-fill-light" style={{width: '10%'}}></div></div>
            </div>
          </div>
          
          <div className="mock-status-badges">
            <span className="m-badge m-badge-active">Filed</span>
            <span className="m-badge m-badge-active-white">Classified</span>
            <span className="m-badge m-badge-inactive">In review</span>
            <span className="m-badge m-badge-inactive">Assigned</span>
          </div>
          
          <div className="mock-card-footer">
            <span>POST /analyze → 201</span>
            <span>logged 09:42</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
