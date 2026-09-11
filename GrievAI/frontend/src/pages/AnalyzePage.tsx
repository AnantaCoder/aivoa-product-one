import React, { useState } from 'react';
import { ComplaintForm } from '../components/ComplaintForm';
import { AIAssistantPanel } from '../components/AIAssistantPanel';
import { Toast } from '../components/Toast';

export const AnalyzePage: React.FC = () => {
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const handleSavedToast = () => {
    setToastMessage('Complaint logged successfully and added to QA triage queue! Check /history to view all records.');
    setTimeout(() => setToastMessage(null), 4000);
  };

  return (
    <>
      <main className="main-wrapper">
        <ComplaintForm onSavedToast={handleSavedToast} />
        <AIAssistantPanel />
      </main>

      {toastMessage && (
        <Toast message={toastMessage} onClose={() => setToastMessage(null)} />
      )}
    </>
  );
};

export default AnalyzePage;
