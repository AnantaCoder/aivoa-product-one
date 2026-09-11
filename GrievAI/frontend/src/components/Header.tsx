import React from 'react';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import {
  populateForm,
  setTheme,
  addChatMessage,
  setProgress,
} from '../features/complaint/complaintSlice';
import { samplePharmaComplaint } from '../utils/sampleData';
import { Moon, Sun, Zap, CheckCircle } from 'lucide-react';
import { Link, NavLink } from 'react-router-dom';

export const Header: React.FC = () => {
  const dispatch = useAppDispatch();
  const theme = useAppSelector((state) => state.complaint.theme);
  const pastComplaintsCount = useAppSelector(
    (state) => state.complaint.pastComplaints.length
  );
  const [copiedNotification, setCopiedNotification] = React.useState(false);

  const handleToggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    dispatch(setTheme(newTheme));
    document.documentElement.setAttribute('data-theme', newTheme);
  };

  const handleLoadSample = () => {
    dispatch(populateForm(samplePharmaComplaint));
    dispatch(setProgress(100));
    dispatch(
      addChatMessage({
        sender: 'ai',
        text: 'Loaded sample pharmaceutical complaint: Ceftriaxone 1g Injection (Batch CTX-2024-09B). All form fields populated.',
      })
    );
    setCopiedNotification(true);
    setTimeout(() => setCopiedNotification(false), 2500);
  };

  return (
    <header className="top-nav">
      <div className="brand-section">
        <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div className="brand-logo" title="GrievAI - Bun Powered">
            <span>🥟</span>
          </div>
          <div className="brand-info">
            <div className="brand-title">
              <span>GrievAI</span>
              <span className="brand-pill">v1.0.0</span>
              <span className="brand-pill" style={{ color: '#06b6d4' }}>
                Bun + FastAPI
              </span>
            </div>
          </div>
        </Link>

        {/* Navigation Tabs */}
        <nav className="nav-links">
          <NavLink
            to="/"
            end
            className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
          >
            Home
          </NavLink>
          <NavLink
            to="/analyze"
            className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
          >
            Log Complaint (/analyze)
          </NavLink>
          <NavLink
            to="/history"
            className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
          >
            History ({pastComplaintsCount})
          </NavLink>
        </nav>
      </div>

      <div className="nav-actions">
        <div className="endpoint-badge" title="Target AI Extraction Endpoint">
          <span className="dot" />
          <span>Endpoint: POST /analyze</span>
        </div>

        <button
          className="action-btn-sm"
          onClick={handleLoadSample}
          title="Autofill form with realistic pharmaceutical QA complaint data"
        >
          {copiedNotification ? (
            <>
              <CheckCircle size={14} color="#10b981" />
              <span>Loaded Sample!</span>
            </>
          ) : (
            <>
              <Zap size={14} color="#f59e0b" />
              <span>Load Sample Complaint</span>
            </>
          )}
        </button>

        <button
          className="theme-toggle-btn"
          onClick={handleToggleTheme}
          title={`Switch to ${theme === 'dark' ? 'Light (Screenshot)' : 'Bun Dark'} theme`}
          aria-label="Toggle Theme"
        >
          {theme === 'dark' ? <Sun size={17} /> : <Moon size={17} />}
        </button>
      </div>
    </header>
  );
};
