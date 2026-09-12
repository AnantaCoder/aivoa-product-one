import React from 'react';
import { FileCheck, AlertTriangle, Package } from 'lucide-react';

interface HistoryStatsProps {
  totalCount: number;
  pendingCount: number;
  criticalCount: number;
  resolvedCount: number;
}

export const HistoryStats: React.FC<HistoryStatsProps> = ({
  totalCount,
  pendingCount,
  criticalCount,
  resolvedCount
}) => {
  return (
    <div className="stats-grid">
      <div className="stat-card">
        <div className="stat-icon-wrap" style={{ background: 'rgba(59, 130, 246, 0.15)', color: '#3b82f6' }}>
          <FileCheck size={20} />
        </div>
        <div>
          <div className="stat-value">{totalCount}</div>
          <div className="stat-label">Total Logged</div>
        </div>
      </div>

      <div className="stat-card">
        <div className="stat-icon-wrap" style={{ background: 'rgba(245, 158, 11, 0.15)', color: '#f59e0b' }}>
          <AlertTriangle size={20} />
        </div>
        <div>
          <div className="stat-value">{pendingCount}</div>
          <div className="stat-label">Pending Triage</div>
        </div>
      </div>

      <div className="stat-card">
        <div className="stat-icon-wrap" style={{ background: 'rgba(239, 68, 68, 0.15)', color: '#ef4444' }}>
          <AlertTriangle size={20} />
        </div>
        <div>
          <div className="stat-value">{criticalCount}</div>
          <div className="stat-label">Critical / Major</div>
        </div>
      </div>

      <div className="stat-card">
        <div className="stat-icon-wrap" style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#10b981' }}>
          <Package size={20} />
        </div>
        <div>
          <div className="stat-value">{resolvedCount}</div>
          <div className="stat-label">Resolved Records</div>
        </div>
      </div>
    </div>
  );
};
