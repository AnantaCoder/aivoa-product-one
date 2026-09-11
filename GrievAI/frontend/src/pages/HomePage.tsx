import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, History, ArrowRight } from 'lucide-react';

export const HomePage: React.FC = () => {
  return (
    <div style={{ padding: '80px 24px', textAlign: 'center', maxWidth: '700px', margin: '0 auto' }}>
      <h1 style={{ fontSize: '36px', marginBottom: '32px' }}>homepage here</h1>

      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '16px',
          flexWrap: 'wrap',
        }}
      >
        <Link
          to="/analyze"
          className="btn-primary"
          style={{
            textDecoration: 'none',
            fontSize: '15px',
            padding: '12px 24px',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '10px',
          }}
        >
          <Sparkles size={18} />
          <span>Go to /analyze (Complaint Intake)</span>
          <ArrowRight size={16} />
        </Link>

        <Link
          to="/history"
          className="btn-secondary"
          style={{
            textDecoration: 'none',
            fontSize: '15px',
            padding: '12px 24px',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '10px',
          }}
        >
          <History size={18} />
          <span>Go to /history (Past Complaints)</span>
          <ArrowRight size={16} />
        </Link>
      </div>
    </div>
  );
};

export default HomePage;
