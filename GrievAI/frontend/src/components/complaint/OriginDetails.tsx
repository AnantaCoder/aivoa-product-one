import React from 'react';
import type { ComplaintFormData } from '../../types/complaint';

interface OriginDetailsProps {
  form: Partial<ComplaintFormData>;
  handleChange: (field: keyof ComplaintFormData, value: string) => void;
}

export const OriginDetails: React.FC<OriginDetailsProps> = ({ form, handleChange }) => {
  return (
    <section className="form-section">
      <div className="section-label">1. ORIGIN &amp; CUSTOMER DETAILS</div>
      <div className="form-grid-2">
        <div className="form-group">
          <label htmlFor="complaintSource">Complaint Source</label>
          <input
            id="complaintSource"
            type="text"
            className="form-input"
            placeholder="Awaiting AI extraction..."
            value={form.complaintSource || ''}
            onChange={(e) => handleChange('complaintSource', e.target.value)}
          />
        </div>

        <div className="form-group">
          <label htmlFor="customerName">Customer Name</label>
          <input
            id="customerName"
            type="text"
            className="form-input"
            placeholder="Awaiting AI extraction..."
            value={form.customerName || ''}
            onChange={(e) => handleChange('customerName', e.target.value)}
          />
        </div>
      </div>
    </section>
  );
};
