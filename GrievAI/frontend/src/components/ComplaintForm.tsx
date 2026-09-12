import React from 'react';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import {
  updateFormField,
  resetForm,
  populateForm,
  type ComplaintFormData,
} from '../features/complaint/complaintSlice';
import { useCreateComplaintMutation, useAssessRiskMutation } from '../services/complaintApi';
import { RotateCcw, Save, ShieldAlert, Loader2 } from 'lucide-react';

interface ComplaintFormProps {
  onSavedToast: () => void;
}

export const ComplaintForm: React.FC<ComplaintFormProps> = ({ onSavedToast }) => {
  const dispatch = useAppDispatch();
  const form = useAppSelector((state) => state.complaint.form);
  const [createComplaint, { isLoading }] = useCreateComplaintMutation();
  const [assessRisk, { isLoading: isAssessingRisk }] = useAssessRiskMutation();

  const handleChange = (
    field: keyof ComplaintFormData,
    value: string
  ) => {
    dispatch(updateFormField({ field, value }));
  };

  const handleRiskAssessment = async () => {
    try {
      const response = await assessRisk({
        productName: form.productName,
        batchNumber: form.batchNumber,
        description: form.description
      }).unwrap();
      
      dispatch(populateForm({
        initialSeverity: response.initialSeverity,
        priority: response.priority,
        riskCategory: response.riskCategory,
        riskRationale: response.riskRationale,
        suggestedCapa: response.suggestedCapa,
        aiSummary: response.aiSummary
      }));
    } catch (err) {
      console.error('Failed to run risk assessment: ', err);
      alert('Failed to run risk assessment.');
    }
  };

  const handleReset = () => {
    if (window.confirm('Are you sure you want to reset all form fields?')) {
      dispatch(resetForm());
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createComplaint(form).unwrap();
      onSavedToast();
      dispatch(resetForm());
    } catch (err) {
      console.error('Failed to save complaint: ', err);
      alert('Failed to save complaint.');
    }
  };

  const getStatusBadgeClass = (st?: string) => {
    if (!st) return 'badge-status-triage';
    switch (st.toLowerCase()) {
      case 'pending triage': return 'badge-status-triage';
      case 'under investigation': return 'badge-status-investigation';
      case 'capa initiated': return 'badge-status-capa';
      case 'resolved': return 'badge-status-resolved';
      default: return 'badge-status-default';
    }
  };

  const currentStatus = form.status || 'Pending Triage';

  return (
    <div className="panel-card">
      <div className="panel-header">
        <div>
          <h1 className="panel-title">{form.ticketNumber ? `Complaint: ${form.ticketNumber}` : 'Log Customer Complaint'}</h1>
          <p className="panel-subtitle">API &amp; FDF Quality Assurance Module</p>
        </div>
        <div className={`badge-pill ${getStatusBadgeClass(form.status)}`} style={{ padding: '6px 14px', fontSize: '12px' }}>
          <span>●</span>
          <span style={{ marginLeft: '4px' }}>{currentStatus}</span>
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

          {(form.riskCategory || form.riskRationale || form.suggestedCapa) && (
            <div style={{ marginTop: '16px', padding: '12px', backgroundColor: 'var(--bg-secondary)', borderRadius: '6px', border: '1px solid var(--border-color)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
                <ShieldAlert size={16} color="var(--error-color)" />
                <strong style={{ fontSize: '13px' }}>AI Risk Assessment Results</strong>
              </div>
              
              {form.riskCategory && (
                <div style={{ marginBottom: '8px', fontSize: '13px' }}>
                  <strong>Risk Category:</strong> {form.riskCategory}
                </div>
              )}
              {form.riskRationale && (
                <div style={{ marginBottom: '8px', fontSize: '13px' }}>
                  <strong>Risk Rationale:</strong> {form.riskRationale}
                </div>
              )}
              {form.suggestedCapa && (
                <div style={{ fontSize: '13px' }}>
                  <strong>Suggested Next Action (CAPA):</strong> {form.suggestedCapa}
                </div>
              )}
            </div>
          )}
        </section>

        {/* Bottom Form Actions */}
        <div className="form-bottom-bar" style={{ display: 'flex', justifyContent: 'space-between' }}>
          <div>
            <button
              type="button"
              className="btn-secondary"
              onClick={handleReset}
              title="Clear all fields"
              disabled={isLoading || isAssessingRisk}
            >
              <RotateCcw size={15} />
              <span>Reset Form</span>
            </button>
          </div>
          
          <div style={{ display: 'flex', gap: '12px' }}>
            <button
              type="button"
              className="btn-secondary"
              onClick={handleRiskAssessment}
              title="Run AI Risk Assessment"
              disabled={isAssessingRisk || (!form.productName && !form.description)}
              style={{ backgroundColor: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6', borderColor: '#3b82f6' }}
            >
              {isAssessingRisk ? (
                <Loader2 size={15} className="spin" />
              ) : (
                <ShieldAlert size={15} />
              )}
              <span>Risk Assessment</span>
            </button>

            <button
              type="submit"
              className="btn-primary"
              title="Save complaint record"
              disabled={isLoading || isAssessingRisk}
            >
              {isLoading ? (
                <Loader2 size={15} className="spin" />
              ) : (
                <Save size={15} />
              )}
              <span>Save Complaint</span>
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};
