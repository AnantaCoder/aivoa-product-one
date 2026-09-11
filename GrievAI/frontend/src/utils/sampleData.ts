import type { ComplaintFormData } from '../features/complaint/complaintSlice';

export const samplePharmaComplaint: ComplaintFormData = {
  complaintSource: 'Global Pharmacovigilance & Hospital Distribution Network',
  customerName: 'St. Jude Memorial Hospital / Dr. Elena Rostova',
  productName: 'Ceftriaxone Sodium for Injection USP',
  productStrength: '1g / Vial (Lyophilized Powder, Sterile API Grade)',
  batchNumber: 'CTX-2024-09B',
  manufacturingDate: '2024-02-18',
  expiryDate: '2026-02-17',
  quantityAffected: '1250',
  complaintType: 'Particulate Matter & Reconstitution Turbidity',
  complaintDate: '2024-09-11',
  description:
    'Upon reconstitution with 9.6 mL sterile water for injection, clinical staff noted visible particulate haze and incomplete dissolution within 3 minutes across multiple vials from batch CTX-2024-09B. Two vials also exhibited micro-fractures along the aluminum crimp seal. Immediate quarantine of remaining 1,250 vials initiated pending QA investigation.',
  initialSeverity: 'Major',
  priority: 'High',
};

export const sampleComplaintEmailText = `From: e.rostova@stjude-hospital.org
To: complaints.qa@pharmaglobal.com
Date: September 11, 2024, 09:14 AM
Subject: URGENT: Quality Issue with Ceftriaxone 1g Injection Batch CTX-2024-09B

Dear QA Team,

We are reporting an urgent quality defect regarding Ceftriaxone Sodium for Injection USP (1g / Vial, Lyophilized Powder).
Customer: St. Jude Memorial Hospital, Dr. Elena Rostova (Chief Pharmacist).

Batch details:
- Batch / Lot: CTX-2024-09B
- Mfg Date: 2024-02-18
- Exp Date: 2026-02-17
- Units affected: 1,250 vials

Issue Description:
During morning preparation, reconstituting vials with 9.6 mL sterile water resulted in noticeable cloudiness and particulate haze exceeding USP <788> standards. Furthermore, micro-cracks were observed along the rubber stopper seal in at least two inspected vials.

Please log this as a Major severity complaint and initiate priority recall triage.

Best regards,
Dr. Elena Rostova
Pharmacy Quality Liaison`;
