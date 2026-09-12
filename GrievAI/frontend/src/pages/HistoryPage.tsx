import React, { useState } from 'react';
import { useAppDispatch } from '../app/hooks';
import { populateForm } from '../features/complaint/complaintSlice';
import type { ComplaintRecord } from '../types/complaint';
import { useNavigate } from 'react-router-dom';
import { useGetComplaintsQuery } from '../services/complaintApi';
import {
  Search,
  Filter,
  PlusCircle,
  Eye,
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { HistoryStats } from '../components/history/HistoryStats';
import { InspectModal } from '../components/history/InspectModal';

export const HistoryPage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  
  const [page, setPage] = useState(1);
  const limit = 20;

  const { data: fetchedComplaints } = useGetComplaintsQuery({ skip: (page - 1) * limit, limit });
  const pastComplaints = fetchedComplaints?.items || [];
  const totalBackendCount = fetchedComplaints?.total || 0;

  const [searchTerm, setSearchTerm] = useState('');
  const [severityFilter, setSeverityFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [selectedRecord, setSelectedRecord] = useState<ComplaintRecord | null>(null);

  // Filter complaints
  const filtered = pastComplaints.filter((c) => {
    const searchLower = searchTerm.toLowerCase();
    const matchesSearch =
      (c.ticketNumber || '').toLowerCase().includes(searchLower) ||
      (c.productName || '').toLowerCase().includes(searchLower) ||
      (c.batchNumber || '').toLowerCase().includes(searchLower) ||
      (c.customerName || '').toLowerCase().includes(searchLower) ||
      (c.complaintType || '').toLowerCase().includes(searchLower);

    const matchesSeverity =
      severityFilter === 'ALL' || (c.initialSeverity || '').toUpperCase() === severityFilter.toUpperCase();

    const matchesStatus =
      statusFilter === 'ALL' || (c.status || '').toUpperCase() === statusFilter.toUpperCase();

    return matchesSearch && matchesSeverity && matchesStatus;
  });

  const totalCount = totalBackendCount;
  const pendingCount = pastComplaints.filter((c) => c.status === 'Pending Triage').length;
  const criticalCount = pastComplaints.filter(
    (c) => c.initialSeverity === 'Critical' || c.initialSeverity === 'Major'
  ).length;
  const resolvedCount = pastComplaints.filter((c) => c.status === 'Resolved').length;

  const handleInspectAndEdit = (record: ComplaintRecord) => {
    dispatch(populateForm(record));
    navigate('/analyze');
  };

  const getSeverityBadgeClass = (sev?: string) => {
    if (!sev) return 'badge-severity-default';
    switch (sev.toLowerCase()) {
      case 'critical':
        return 'badge-severity-critical';
      case 'major':
        return 'badge-severity-major';
      case 'minor':
        return 'badge-severity-minor';
      default:
        return 'badge-severity-default';
    }
  };

  const getStatusBadgeClass = (st?: string) => {
    if (!st) return 'badge-status-default';
    switch (st.toLowerCase()) {
      case 'pending triage':
        return 'badge-status-triage';
      case 'under investigation':
        return 'badge-status-investigation';
      case 'capa initiated':
        return 'badge-status-capa';
      case 'resolved':
        return 'badge-status-resolved';
      default:
        return 'badge-status-default';
    }
  };

  return (
    <div className="history-page-container">
      {/* Header bar */}
      <div className="history-header">
        <div>
          <h1 className="panel-title" style={{ fontSize: '26px' }}>
            Customer Complaint History
          </h1>
          <p className="panel-subtitle">
            Pharmaceutical Quality Management System (QMS) • API &amp; FDF Audit Register
          </p>
        </div>
        <button className="btn-primary" onClick={() => navigate('/analyze')}>
          <PlusCircle size={16} />
          <span>Log New Complaint</span>
        </button>
      </div>

      {/* KPI Stats Cards */}
      <HistoryStats
        totalCount={totalCount}
        pendingCount={pendingCount}
        criticalCount={criticalCount}
        resolvedCount={resolvedCount}
      />

      {/* Filter and Search Bar */}
      <div className="history-toolbar">
        <div className="search-box-wrap">
          <Search size={16} className="search-icon" />
          <input
            type="text"
            className="search-input"
            placeholder="Search by product, batch, ticket #, customer..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="filter-group">
          <div className="filter-item">
            <Filter size={14} color="var(--text-primary)" />
            <select
              className="table-filter-select"
              value={severityFilter}
              onChange={(e) => setSeverityFilter(e.target.value)}
            >
              <option value="ALL">All Severities</option>
              <option value="CRITICAL">Critical</option>
              <option value="MAJOR">Major</option>
              <option value="MINOR">Minor</option>
            </select>
          </div>

          <div className="filter-item">
            <select
              className="table-filter-select"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="ALL">All Statuses</option>
              <option value="PENDING TRIAGE">Pending Triage</option>
              <option value="UNDER INVESTIGATION">Under Investigation</option>
              <option value="CAPA INITIATED">CAPA Initiated</option>
              <option value="RESOLVED">Resolved</option>
            </select>
          </div>
        </div>
      </div>

      {/* Data Table Schema */}
      <div className="table-responsive-card">
        <table className="complaint-table">
          <thead>
            <tr>
              <th>
                <div className="th-content">
                  <span>Ticket ID</span>
                  <ArrowUpDown size={12} />
                </div>
              </th>
              <th>Product &amp; Strength</th>
              <th>Batch / Lot</th>
              <th>Customer &amp; Source</th>
              <th>Complaint Type</th>
              <th>Severity</th>
              <th>Risk Category</th>
              <th>Status</th>
              <th>Logged At</th>
              <th style={{ textAlign: 'right' }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={10} style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--text-muted)' }}>
                  No complaints found matching your search criteria.
                </td>
              </tr>
            ) : (
              filtered.map((c) => (
                <tr key={c.id} className="table-row-hover">
                  <td>
                    <span className="ticket-badge">{c.ticketNumber}</span>
                  </td>
                  <td>
                    <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>
                      {c.productName || 'Unnamed Product'}
                    </div>
                    <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                      {c.productStrength || 'N/A'}
                    </div>
                  </td>
                  <td>
                    <code className="batch-code">{c.batchNumber || 'N/A'}</code>
                  </td>
                  <td>
                    <div style={{ fontSize: '13px', fontWeight: 500 }}>{c.customerName || 'N/A'}</div>
                    <div style={{ fontSize: '11.5px', color: 'var(--text-muted)' }}>{c.complaintSource || ''}</div>
                  </td>
                  <td>
                    <span style={{ fontSize: '13px' }}>{c.complaintType || 'Unspecified'}</span>
                  </td>
                  <td>
                    <span className={`badge-pill ${getSeverityBadgeClass(c.initialSeverity)}`}>
                      {c.initialSeverity || 'Pending'}
                    </span>
                  </td>
                  <td>
                    <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{c.riskCategory || 'N/A'}</span>
                  </td>
                  <td>
                    <span className={`badge-pill ${getStatusBadgeClass(c.status)}`}>
                      ● {c.status}
                    </span>
                  </td>
                  <td>
                    <div style={{ fontSize: '12px', fontFamily: 'var(--font-mono)' }}>
                      {c.createdAt || c.complaintDate || 'Recently'}
                    </div>
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <button
                      type="button"
                      className="action-btn-sm"
                      onClick={() => setSelectedRecord(c)}
                      title="Inspect full complaint details"
                    >
                      <Eye size={13} />
                      <span>Inspect</span>
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
        
        {/* Pagination Controls */}
        <div className="pagination-bar" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 20px', borderTop: '1px solid var(--border-color)' }}>
          <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
            Showing {filtered.length > 0 ? (page - 1) * limit + 1 : 0} to {Math.min(page * limit, totalCount)} of {totalCount} entries
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              className="btn-secondary"
              style={{ padding: '6px 10px', fontSize: '13px' }}
              disabled={page === 1}
              onClick={() => setPage(p => Math.max(1, p - 1))}
            >
              <ChevronLeft size={16} />
              Prev
            </button>
            <button
              className="btn-secondary"
              style={{ padding: '6px 10px', fontSize: '13px' }}
              disabled={page * limit >= totalCount}
              onClick={() => setPage(p => p + 1)}
            >
              Next
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Inspect Modal Drawer */}
      {selectedRecord && (
        <InspectModal
          selectedRecord={selectedRecord}
          onClose={() => setSelectedRecord(null)}
          onInspectAndEdit={handleInspectAndEdit}
          getSeverityBadgeClass={getSeverityBadgeClass}
          getStatusBadgeClass={getStatusBadgeClass}
        />
      )}
    </div>
  );
};

export default HistoryPage;
