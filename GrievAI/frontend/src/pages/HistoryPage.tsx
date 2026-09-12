import React, { useState } from 'react';
import { useAppDispatch } from '../app/hooks';
import { populateForm, type ComplaintRecord } from '../features/complaint/complaintSlice';
import { useNavigate } from 'react-router-dom';
import { useGetComplaintsQuery } from '../services/complaintApi';
import {
  Search,
  Filter,
  PlusCircle,
  Eye,
  Package,
  AlertTriangle,
  FileCheck,
  X,
  ArrowUpDown,
} from 'lucide-react';

export const HistoryPage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  
  const { data: fetchedComplaints, isLoading, isError } = useGetComplaintsQuery();
  const pastComplaints = fetchedComplaints || [];

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

  const totalCount = pastComplaints.length;
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
            <Filter size={14} color="var(--text-muted)" />
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
              <th>Priority</th>
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
                    <span className="priority-pill">{c.priority || 'Normal'}</span>
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
      </div>

      {/* Inspect Modal Drawer */}
      {selectedRecord && (
        <div className="modal-backdrop" onClick={() => setSelectedRecord(null)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span className="ticket-badge">{selectedRecord.ticketNumber}</span>
                  <span className={`badge-pill ${getStatusBadgeClass(selectedRecord.status)}`}>
                    ● {selectedRecord.status}
                  </span>
                </div>
                <h3 style={{ fontSize: '18px', marginTop: '6px', color: 'var(--text-primary)' }}>
                  {selectedRecord.productName}
                </h3>
              </div>
              <button
                className="action-btn-sm"
                style={{ padding: '6px' }}
                onClick={() => setSelectedRecord(null)}
              >
                <X size={16} />
              </button>
            </div>

            <div className="modal-body">
              <div className="inspect-grid">
                <div className="inspect-item">
                  <span className="inspect-label">Customer Name</span>
                  <span className="inspect-value">{selectedRecord.customerName || 'N/A'}</span>
                </div>
                <div className="inspect-item">
                  <span className="inspect-label">Complaint Source</span>
                  <span className="inspect-value">{selectedRecord.complaintSource || 'N/A'}</span>
                </div>
                <div className="inspect-item">
                  <span className="inspect-label">Product Strength / Grade</span>
                  <span className="inspect-value">{selectedRecord.productStrength || 'N/A'}</span>
                </div>
                <div className="inspect-item">
                  <span className="inspect-label">Batch / Lot Number</span>
                  <span className="inspect-value font-mono">{selectedRecord.batchNumber || 'N/A'}</span>
                </div>
                <div className="inspect-item">
                  <span className="inspect-label">Manufacturing Date</span>
                  <span className="inspect-value">{selectedRecord.manufacturingDate || 'N/A'}</span>
                </div>
                <div className="inspect-item">
                  <span className="inspect-label">Expiry Date</span>
                  <span className="inspect-value">{selectedRecord.expiryDate || 'N/A'}</span>
                </div>
                <div className="inspect-item">
                  <span className="inspect-label">Quantity Affected</span>
                  <span className="inspect-value">{selectedRecord.quantityAffected ? `${selectedRecord.quantityAffected} kg` : 'N/A'}</span>
                </div>
                <div className="inspect-item">
                  <span className="inspect-label">Complaint Type</span>
                  <span className="inspect-value">{selectedRecord.complaintType || 'N/A'}</span>
                </div>
                <div className="inspect-item">
                  <span className="inspect-label">Initial Severity</span>
                  <span className={`badge-pill ${getSeverityBadgeClass(selectedRecord.initialSeverity)}`}>
                    {selectedRecord.initialSeverity || 'N/A'}
                  </span>
                </div>
                <div className="inspect-item">
                  <span className="inspect-label">Priority</span>
                  <span className="priority-pill">{selectedRecord.priority || 'N/A'}</span>
                </div>
              </div>

              <div style={{ marginTop: '16px' }}>
                <span className="inspect-label">Detailed Complaint Description</span>
                <p className="inspect-description">
                  {selectedRecord.description || 'No detailed description provided.'}
                </p>
              </div>
            </div>

            <div className="modal-footer">
              <button
                type="button"
                className="btn-secondary"
                onClick={() => setSelectedRecord(null)}
              >
                Close
              </button>
              <button
                type="button"
                className="btn-primary"
                onClick={() => handleInspectAndEdit(selectedRecord)}
              >
                Load into /analyze Form
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HistoryPage;
