import React from 'react';
import { X } from 'lucide-react';
import type { ComplaintRecord } from '../../types/complaint';

interface InspectModalProps {
  selectedRecord: ComplaintRecord;
  onClose: () => void;
  onInspectAndEdit: (record: ComplaintRecord) => void;
  getSeverityBadgeClass: (sev?: string) => string;
  getStatusBadgeClass: (st?: string) => string;
}

export const InspectModal: React.FC<InspectModalProps> = ({
  selectedRecord,
  onClose,
  onInspectAndEdit,
  getSeverityBadgeClass,
  getStatusBadgeClass
}) => {
  return (
    <div className="modal-backdrop" onClick={onClose}>
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
            onClick={onClose}
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

          {(selectedRecord.riskCategory || selectedRecord.aiSummary || selectedRecord.suggestedCapa) && (
            <div style={{ marginTop: '16px', padding: '12px', backgroundColor: 'var(--bg-subtle)', borderRadius: '6px', wordBreak: 'break-word', whiteSpace: 'pre-wrap' }}>
              <h4 style={{ fontSize: '14px', marginBottom: '8px', color: 'var(--text-primary)' }}>AI Risk Assessment</h4>
              {selectedRecord.riskCategory && (
                <div style={{ marginBottom: '4px', fontSize: '13px' }}><strong>Category:</strong> {selectedRecord.riskCategory}</div>
              )}
              {selectedRecord.riskRationale && (
                <div style={{ marginBottom: '4px', fontSize: '13px' }}><strong>Rationale:</strong> {selectedRecord.riskRationale}</div>
              )}
              {selectedRecord.suggestedCapa && (
                <div style={{ marginBottom: '4px', fontSize: '13px' }}><strong>Suggested CAPA:</strong> {selectedRecord.suggestedCapa}</div>
              )}
              {selectedRecord.aiSummary && (
                <div style={{ marginTop: '8px', fontSize: '13px' }}><strong>Summary:</strong> {selectedRecord.aiSummary}</div>
              )}
            </div>
          )}
        </div>

        <div className="modal-footer">
          <button
            type="button"
            className="btn-secondary"
            onClick={onClose}
          >
            Close
          </button>
          <button
            type="button"
            className="btn-primary"
            onClick={() => onInspectAndEdit(selectedRecord)}
          >
            Load into /analyze Form
          </button>
        </div>
      </div>
    </div>
  );
};
