import React from 'react';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { setTheme } from '../features/complaint/complaintSlice';
import { Link, NavLink } from 'react-router-dom';
import { useGetComplaintsQuery } from '../services/complaintApi';

export const Header: React.FC = () => {
  const dispatch = useAppDispatch();
  const theme = useAppSelector((state) => state.complaint.theme);
  
  const { data } = useGetComplaintsQuery({ skip: 0, limit: 1 });
  const pastComplaintsCount = data?.total || 0;

  return (
    <header className="top-nav">
      <div className="brand-section">
        <Link to="/" className="brand-link">
          <div className="brand-logo-new" title="GrievAI">
            <img src="/robot-svgrepo-com.svg" alt="Robot Icon" width="20" height="20" style={{ filter: 'brightness(0) invert(1)' }} />
          </div>
          <div className="brand-title-new">
            <span>GrievAI</span>
            <span className="brand-pill-new">v1.0.0</span>
          </div>
        </Link>
      </div>

      <nav className="nav-links-center">
        <NavLink
          to="/"
          end
          className={({ isActive }) => (isActive ? 'nav-link-new active' : 'nav-link-new')}
        >
          Home
        </NavLink>
        <NavLink
          to="/analyze"
          className={({ isActive }) => (isActive ? 'nav-link-new active' : 'nav-link-new')}
        >
          Complaint Bot
        </NavLink>
        <NavLink
          to="/history"
          className={({ isActive }) => (isActive ? 'nav-link-new active' : 'nav-link-new')}
        >
          History <span className="nav-badge">{pastComplaintsCount}</span>
        </NavLink>
      </nav>

      <div className="nav-actions-right">
        <div className="tech-pill">
          <span className="dot" />
          <span>React + FastAPI</span>
        </div>
      </div>
    </header>
  );
};
