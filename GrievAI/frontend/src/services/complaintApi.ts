import { baseApi } from './api';
import type { ComplaintFormData } from '../features/complaint/complaintSlice';

export interface RawAnalyzeResponse {
  complaint_source?: string;
  complaintSource?: string;
  customer_name?: string;
  customerName?: string;
  product_name?: string;
  productName?: string;
  product_strength?: string;
  productStrength?: string;
  batch_number?: string;
  batchNumber?: string;
  manufacturing_date?: string;
  manufacturingDate?: string;
  expiry_date?: string;
  expiryDate?: string;
  quantity_affected?: string | number;
  quantityAffected?: string | number;
  complaint_type?: string;
  complaintType?: string;
  complaint_date?: string;
  complaintDate?: string;
  description?: string;
  detailed_complaint_description?: string;
  initial_severity?: string;
  initialSeverity?: string;
  priority?: string;
  ai_summary?: string;
  summary?: string;
  confidence?: number;
  confidence_score?: number;
  [key: string]: unknown;
}

export const complaintApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    analyzeComplaint: builder.mutation<
      RawAnalyzeResponse,
      FormData | { text: string; [key: string]: unknown }
    >({
      query: (body) => ({
        url: '/analyze',
        method: 'POST',
        body,
      }),
    }),
  }),
});

export const { useAnalyzeComplaintMutation } = complaintApi;

export function normalizeAnalysisResponse(res: RawAnalyzeResponse): {
  form: Partial<ComplaintFormData>;
  summary?: string;
} {
  return {
    form: {
      complaintSource: res.complaint_source || res.complaintSource || '',
      customerName: res.customer_name || res.customerName || '',
      productName: res.product_name || res.productName || '',
      productStrength: res.product_strength || res.productStrength || '',
      batchNumber: res.batch_number || res.batchNumber || '',
      manufacturingDate: res.manufacturing_date || res.manufacturingDate || '',
      expiryDate: res.expiry_date || res.expiryDate || '',
      quantityAffected: res.quantity_affected?.toString() || res.quantityAffected?.toString() || '',
      complaintType: res.complaint_type || res.complaintType || '',
      complaintDate: res.complaint_date || res.complaintDate || '',
      description: res.description || res.detailed_complaint_description || '',
      initialSeverity: res.initial_severity || res.initialSeverity || '',
      priority: res.priority || '',
    },
    summary: res.ai_summary || res.summary || undefined,
  };
}
