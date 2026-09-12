import React from 'react';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { setTheme } from '../features/complaint/complaintSlice';
import { Moon, Sun } from 'lucide-react';
import { Link, NavLink } from 'react-router-dom';
import { useGetComplaintsQuery } from '../services/complaintApi';

export const Header: React.FC = () => {
  const dispatch = useAppDispatch();
  const theme = useAppSelector((state) => state.complaint.theme);
  
  // We use limit: 1 just to get the total count efficiently without fetching all data.
  // Note: Since RTK Query caches, it might use the existing cache if another component requested it.
  const { data } = useGetComplaintsQuery({ skip: 0, limit: 1 });
  const pastComplaintsCount = data?.total || 0;

  const handleToggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    dispatch(setTheme(newTheme));
    document.documentElement.setAttribute('data-theme', newTheme);
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
            Complaint Bot
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
