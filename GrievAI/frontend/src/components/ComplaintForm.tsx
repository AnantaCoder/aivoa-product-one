import React from 'react';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import {
  updateFormField,
  resetForm,
  populateForm,
} from '../features/complaint/complaintSlice';
import type { ComplaintFormData } from '../types/complaint';
import { useCreateComplaintMutation, useAssessRiskMutation } from '../services/complaintApi';
import { RotateCcw, Save, ShieldAlert, Loader2 } from 'lucide-react';
import { OriginDetails } from './complaint/OriginDetails';
import { ProductIdentification } from './complaint/ProductIdentification';
import { ComplaintDetails } from './complaint/ComplaintDetails';

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
        {/* Form Sections broken out into Sub-Components */}
        <OriginDetails form={form} handleChange={handleChange} />
        <ProductIdentification form={form} handleChange={handleChange} />
        <ComplaintDetails form={form} handleChange={handleChange} />

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
