import React from 'react';
import type { ComplaintFormData } from '../../types/complaint';
import { ShieldAlert } from 'lucide-react';

interface ComplaintDetailsProps {
  form: Partial<ComplaintFormData>;
  handleChange: (field: keyof ComplaintFormData, value: string) => void;
}

export const ComplaintDetails: React.FC<ComplaintDetailsProps> = ({ form, handleChange }) => {
  return (
    <>
      <section className="form-section">
        <div className="section-label">3. COMPLAINT DETAILS</div>

        <div className="form-grid-2">
          <div className="form-group">
            <label htmlFor="complaintType">Complaint Type</label>
            <input
              id="complaintType"
              type="text"
              className="form-input"
              placeholder="Awaiting AI extraction..."
              value={form.complaintType || ''}
              onChange={(e) => handleChange('complaintType', e.target.value)}
            />
          </div>

          <div className="form-group">
            <label htmlFor="complaintDate">Complaint Date</label>
            <div className="input-wrapper">
              <input
                id="complaintDate"
                type="date"
                className="form-input"
                placeholder="Awaiting AI extraction..."
                value={form.complaintDate || ''}
                onChange={(e) => handleChange('complaintDate', e.target.value)}
              />
            </div>
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="description">Detailed Complaint Description</label>
          <textarea
            id="description"
            className="form-textarea"
            rows={4}
            placeholder="Awaiting AI extraction..."
            value={form.description || ''}
            onChange={(e) => handleChange('description', e.target.value)}
          />
        </div>
      </section>

      <section className="form-section">
        <div className="section-label">4. INITIAL ASSESSMENT &amp; PRIORITY</div>

        <div className="form-grid-2">
          <div className="form-group">
            <label htmlFor="initialSeverity">Initial Severity</label>
            <select
              id="initialSeverity"
              className="form-select"
              value={form.initialSeverity || ''}
              onChange={(e) => handleChange('initialSeverity', e.target.value)}
            >
              <option value="">Awaiting AI extraction...</option>
              <option value="Minor">Minor</option>
              <option value="Major">Major</option>
              <option value="Critical">Critical</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="priority">Priority</label>
            <select
              id="priority"
              className="form-select"
              value={form.priority || ''}
              onChange={(e) => handleChange('priority', e.target.value)}
            >
              <option value="">Awaiting AI extraction...</option>
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
              <option value="Critical">Critical</option>
            </select>
          </div>
        </div>

        {(form.riskCategory || form.riskRationale || form.suggestedCapa) && (
          <div style={{ 
            marginTop: '20px', 
            padding: '18px', 
            background: 'linear-gradient(to right, rgba(99, 102, 241, 0.1), rgba(168, 85, 247, 0.05))', 
            borderRadius: '8px', 
            border: '1px solid rgba(99, 102, 241, 0.2)',
            borderLeft: '4px solid #6366f1',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
              <ShieldAlert size={18} color="#6366f1" />
              <strong style={{ fontSize: '15px', color: '#6366f1', letterSpacing: '0.3px' }}>AI Risk Assessment Results</strong>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {form.riskCategory && (
                <div style={{ fontSize: '13.5px', lineHeight: '1.5' }}>
                  <strong style={{ color: 'var(--text-primary)' }}>Risk Category:</strong> <span style={{ color: 'var(--text-secondary)' }}>{form.riskCategory}</span>
                </div>
              )}
              {form.riskRationale && (
                <div style={{ fontSize: '13.5px', lineHeight: '1.5' }}>
                  <strong style={{ color: 'var(--text-primary)' }}>Risk Rationale:</strong> <span style={{ color: 'var(--text-secondary)' }}>{form.riskRationale}</span>
                </div>
              )}
              {form.suggestedCapa && (
                <div style={{ fontSize: '13.5px', lineHeight: '1.5' }}>
                  <strong style={{ color: 'var(--text-primary)' }}>Suggested Next Action (CAPA):</strong> <span style={{ color: 'var(--text-secondary)' }}>{form.suggestedCapa}</span>
                </div>
              )}
            </div>
          </div>
        )}
      </section>
    </>
  );
};
