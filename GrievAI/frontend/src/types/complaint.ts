export interface ComplaintFormData {
  complaintSource: string;
  customerName: string;
  productName: string;
  productStrength: string;
  batchNumber: string;
  manufacturingDate: string;
  expiryDate: string;
  quantityAffected: string;
  complaintType: string;
  complaintDate: string;
  description: string;
  initialSeverity: string;
  priority: string;
  status?: string;
  ticketNumber?: string;
  riskCategory?: string;
  riskRationale?: string;
  suggestedCapa?: string;
  aiSummary?: string;
}

export interface ComplaintRecord extends ComplaintFormData {
  id: string;
  ticketNumber: string;
  status: 'Pending Triage' | 'Under Investigation' | 'CAPA Initiated' | 'Resolved';
  createdAt: string;
  updatedAt: string;
}

export interface PaginatedComplaintsResponse {
  items: ComplaintRecord[];
  total: number;
}
