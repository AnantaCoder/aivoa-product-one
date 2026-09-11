import React from 'react';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import {
  updateFormField,
  resetForm,
  saveComplaint,
  type ComplaintFormData,
} from '../features/complaint/complaintSlice';
import { RotateCcw, Save } from 'lucide-react';

interface ComplaintFormProps {
  onSavedToast: () => void;
}

export const ComplaintForm: React.FC<ComplaintFormProps> = ({ onSavedToast }) => {
  const dispatch = useAppDispatch();
  const form = useAppSelector((state) => state.complaint.form);

  const handleChange = (
    field: keyof ComplaintFormData,
    value: string
  ) => {
    dispatch(updateFormField({ field, value }));
  };

  const handleReset = () => {
    if (window.confirm('Are you sure you want to reset all form fields?')) {
      dispatch(resetForm());
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(saveComplaint());
    onSavedToast();
  };

  return (
    <div className="panel-card">
      <div className="panel-header">
        <div>
          <h1 className="panel-title">Log Customer Complaint</h1>
          <p className="panel-subtitle">API &amp; FDF Quality Assurance Module</p>
        </div>
        <div className="status-badge-triage">
          <span>●</span>
          <span>Pending Triage</span>
        </div>
      </div>

      <form onSubmit={handleSave} className="form-content">
        {/* Section 1: ORIGIN & CUSTOMER DETAILS */}
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
                value={form.complaintSource}
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
                value={form.customerName}
                onChange={(e) => handleChange('customerName', e.target.value)}
              />
            </div>
          </div>
        </section>

        {/* Section 2: PRODUCT & BATCH IDENTIFICATION */}
        <section className="form-section">
          <div className="section-label">2. PRODUCT &amp; BATCH IDENTIFICATION</div>
          
          <div className="form-grid-2">
            <div className="form-group">
              <label htmlFor="productName">Product Name</label>
              <input
                id="productName"
                type="text"
                className="form-input"
                placeholder="Awaiting AI extraction..."
                value={form.productName}
                onChange={(e) => handleChange('productName', e.target.value)}
              />
            </div>

            <div className="form-group">
              <label htmlFor="productStrength">Product Strength/Grade</label>
              <input
                id="productStrength"
                type="text"
                className="form-input"
                placeholder="Awaiting AI extraction..."
                value={form.productStrength}
                onChange={(e) => handleChange('productStrength', e.target.value)}
              />
            </div>
          </div>

          <div className="form-grid-2">
            <div className="form-group">
              <label htmlFor="batchNumber">Batch/Lot Number</label>
              <input
                id="batchNumber"
                type="text"
                className="form-input"
                placeholder="Awaiting AI extraction..."
                value={form.batchNumber}
                onChange={(e) => handleChange('batchNumber', e.target.value)}
              />
            </div>

            <div className="form-group">
              <label htmlFor="manufacturingDate">Manufacturing Date</label>
              <div className="input-wrapper">
                <input
                  id="manufacturingDate"
                  type="date"
                  className="form-input"
                  placeholder="Awaiting AI extraction..."
                  value={form.manufacturingDate}
                  onChange={(e) => handleChange('manufacturingDate', e.target.value)}
                />
              </div>
            </div>
          </div>

          <div className="form-grid-2">
            <div className="form-group">
              <label htmlFor="expiryDate">Expiry Date</label>
              <div className="input-wrapper">
                <input
                  id="expiryDate"
                  type="date"
                  className="form-input"
                  placeholder="Awaiting AI extraction..."
                  value={form.expiryDate}
                  onChange={(e) => handleChange('expiryDate', e.target.value)}
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="quantityAffected">Quantity Affected</label>
              <div className="input-wrapper">
                <input
                  id="quantityAffected"
                  type="text"
                  className="form-input input-with-suffix"
                  placeholder="Awaiting AI extraction..."
                  value={form.quantityAffected}
                  onChange={(e) => handleChange('quantityAffected', e.target.value)}
                />
                <span className="input-suffix">kg</span>
              </div>
            </div>
          </div>
        </section>

        {/* Section 3: COMPLAINT DETAILS */}
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
                value={form.complaintType}
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
                  value={form.complaintDate}
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
              value={form.description}
              onChange={(e) => handleChange('description', e.target.value)}
            />
          </div>
        </section>

        {/* Section 4: INITIAL ASSESSMENT & PRIORITY */}
        <section className="form-section">
          <div className="section-label">4. INITIAL ASSESSMENT &amp; PRIORITY</div>

          <div className="form-grid-2">
            <div className="form-group">
              <label htmlFor="initialSeverity">Initial Severity</label>
              <select
                id="initialSeverity"
                className="form-select"
                value={form.initialSeverity}
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
                value={form.priority}
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
        </section>

        {/* Bottom Form Actions */}
        <div className="form-bottom-bar">
          <button
            type="button"
            className="btn-secondary"
            onClick={handleReset}
            title="Clear all fields"
          >
            <RotateCcw size={15} />
            <span>Reset Form</span>
          </button>

          <button
            type="submit"
            className="btn-primary"
            title="Save complaint record"
          >
            <Save size={15} />
            <span>Save Complaint</span>
          </button>
        </div>
      </form>
    </div>
  );
};
