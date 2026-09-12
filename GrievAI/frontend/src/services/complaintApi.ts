import { baseApi } from './api';
import type { ComplaintFormData, PaginatedComplaintsResponse } from '../types/complaint';

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
    getComplaints: builder.query<PaginatedComplaintsResponse, { skip: number; limit: number }>({
      query: ({ skip, limit }) => `/complaints?skip=${skip}&limit=${limit}`,
      transformResponse: (response: any) => {
        const toCamel = (str: string) => str.replace(/_([a-z])/g, (g) => g[1].toUpperCase());
        const convertKeys = (obj: any): any => {
          if (Array.isArray(obj)) return obj.map(convertKeys);
          if (obj !== null && typeof obj === 'object') {
            return Object.keys(obj).reduce((acc, key) => {
              acc[toCamel(key)] = convertKeys(obj[key]);
              return acc;
            }, {} as any);
          }
          return obj;
        };
        return convertKeys(response);
      },
    }),
    createComplaint: builder.mutation<any, Partial<ComplaintFormData>>({
      query: (body) => ({
        url: '/complaints',
        method: 'POST',
        body,
      }),
    }),
    chatWithCopilot: builder.mutation<
      { reply: string; form_updates?: Partial<ComplaintFormData> },
      { message: string; complaint_data?: Partial<ComplaintFormData>; history?: any[] }
    >({
      query: (body) => ({
        url: '/complaints/chat',
        method: 'POST',
        body,
      }),
    }),
    assessRisk: builder.mutation<
      {
        initialSeverity: string;
        priority: string;
        riskCategory: string;
        riskRationale: string;
        suggestedCapa: string;
        aiSummary: string;
      },
      { productName: string; batchNumber: string; description: string }
    >({
      query: (body) => ({
        url: '/complaints/risk-assessment',
        method: 'POST',
        body,
      }),
    }),
  }),
});

export const { 
  useAnalyzeComplaintMutation, 
  useGetComplaintsQuery, 
  useCreateComplaintMutation,
  useChatWithCopilotMutation,
  useAssessRiskMutation
} = complaintApi;

function formatDateForInput(dateStr?: string): string {
  if (!dateStr) return '';
  const str = String(dateStr).trim();
  // If already YYYY-MM-DD, just return it
  const isoMatch = str.match(/^(\d{4}-\d{2}-\d{2})/);
  if (isoMatch) return isoMatch[1];

  const d = new Date(str);
  if (!isNaN(d.getTime())) {
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
  
  // Fallback for DD/MM/YYYY or DD-MM-YYYY
  const ukMatch = str.match(/^(\d{1,2})[\/\-\.](\d{1,2})[\/\-\.](\d{4})$/);
  if (ukMatch) {
    const d2 = new Date(`${ukMatch[3]}/${ukMatch[2]}/${ukMatch[1]}`);
    if (!isNaN(d2.getTime())) {
      const year = d2.getFullYear();
      const month = String(d2.getMonth() + 1).padStart(2, '0');
      const day = String(d2.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    }
  }
  
  return '';
}

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
      manufacturingDate: formatDateForInput(res.manufacturing_date || res.manufacturingDate),
      expiryDate: formatDateForInput(res.expiry_date || res.expiryDate),
      quantityAffected: res.quantity_affected?.toString() || res.quantityAffected?.toString() || '',
      complaintType: res.complaint_type || res.complaintType || '',
      complaintDate: formatDateForInput(res.complaint_date || res.complaintDate),
      description: res.description || res.detailed_complaint_description || '',
      initialSeverity: res.initial_severity || res.initialSeverity || '',
      priority: res.priority || '',
    },
    summary: res.ai_summary || res.summary || undefined,
  };
}
