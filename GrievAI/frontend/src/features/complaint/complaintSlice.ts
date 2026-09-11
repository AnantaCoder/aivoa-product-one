import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

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
}

export interface ComplaintRecord extends ComplaintFormData {
  id: string;
  ticketNumber: string;
  status: 'Pending Triage' | 'Under Investigation' | 'CAPA Initiated' | 'Resolved';
  createdAt: string;
}

export interface ChatMessage {
  id: string;
  sender: 'ai' | 'user';
  text: string;
  timestamp: string;
}

export interface ComplaintState {
  form: ComplaintFormData;
  status: 'idle' | 'analyzing' | 'success' | 'error';
  progress: number;
  statusMessage: string;
  fileName: string | null;
  fileSize: string | null;
  pastedText: string;
  isPasteModalOpen: boolean;
  theme: 'dark' | 'light';
  savedComplaintsCount: number;
  chatMessages: ChatMessage[];
  lastSavedAt: string | null;
  pastComplaints: ComplaintRecord[];
}

const initialFormData: ComplaintFormData = {
  complaintSource: '',
  customerName: '',
  productName: '',
  productStrength: '',
  batchNumber: '',
  manufacturingDate: '',
  expiryDate: '',
  quantityAffected: '',
  complaintType: '',
  complaintDate: '',
  description: '',
  initialSeverity: '',
  priority: '',
};

const initialChatMessages: ChatMessage[] = [
  {
    id: 'welcome',
    sender: 'ai',
    text: 'Upload a complaint document or paste text above. I will automatically extract the details and populate the form for you.',
    timestamp: 'Just now',
  },
];

const initialPastComplaints: ComplaintRecord[] = [
  {
    id: 'CMP-8812',
    ticketNumber: 'QA-2024-101',
    complaintSource: 'Global Pharmacovigilance & Hospital Distribution',
    customerName: 'St. Jude Memorial Hospital / Dr. Elena Rostova',
    productName: 'Ceftriaxone Sodium for Injection USP',
    productStrength: '1g / Vial (Lyophilized Powder, Sterile)',
    batchNumber: 'CTX-2024-09B',
    manufacturingDate: '2024-02-18',
    expiryDate: '2026-02-17',
    quantityAffected: '1250',
    complaintType: 'Particulate Matter & Reconstitution Turbidity',
    complaintDate: '2024-09-11',
    description:
      'Turbidity upon reconstitution exceeding USP <788> standards. Micro-fractures detected on rubber crimp seal in two vials.',
    initialSeverity: 'Major',
    priority: 'High',
    status: 'Pending Triage',
    createdAt: '2024-09-11 09:30',
  },
  {
    id: 'CMP-8809',
    ticketNumber: 'QA-2024-098',
    complaintSource: 'Apex Pharma Distributors',
    customerName: 'Metro Health Care Pharmacy',
    productName: 'Amoxicillin Trihydrate Capsules IP',
    productStrength: '500 mg',
    batchNumber: 'AMX-2024-44A',
    manufacturingDate: '2024-01-10',
    expiryDate: '2026-01-09',
    quantityAffected: '450',
    complaintType: 'Packaging & Seal Integrity',
    complaintDate: '2024-09-08',
    description:
      'Blister foil delamination observed in outer packaging cartons during routine inventory inspection.',
    initialSeverity: 'Minor',
    priority: 'Medium',
    status: 'Under Investigation',
    createdAt: '2024-09-08 14:15',
  },
  {
    id: 'CMP-8794',
    ticketNumber: 'QA-2024-092',
    complaintSource: 'Internal Quality Assurance / Stability Lab',
    customerName: 'Novartis Supply Chain',
    productName: 'Metformin Hydrochloride API',
    productStrength: 'EP Grade Powder (Micronized)',
    batchNumber: 'MET-2023-712',
    manufacturingDate: '2023-11-05',
    expiryDate: '2027-11-04',
    quantityAffected: '2500',
    complaintType: 'Assay Variance & Moisture Content',
    complaintDate: '2024-08-28',
    description:
      'Slight assay fluctuation detected in 9-month accelerated stability test chamber #4.',
    initialSeverity: 'Critical',
    priority: 'Critical',
    status: 'CAPA Initiated',
    createdAt: '2024-08-28 11:00',
  },
  {
    id: 'CMP-8750',
    ticketNumber: 'QA-2024-085',
    complaintSource: 'Direct Clinic Reporting',
    customerName: 'Apollo Hospitals Clinical Pharmacy',
    productName: 'Paracetamol Infusion 10mg/mL',
    productStrength: '100 mL IV Bottle',
    batchNumber: 'PCM-2024-11C',
    manufacturingDate: '2024-03-01',
    expiryDate: '2026-02-28',
    quantityAffected: '80',
    complaintType: 'Label Printing Smudge',
    complaintDate: '2024-08-15',
    description:
      'Barcode smudged on secondary carton outer box; tertiary lot label remained fully legible.',
    initialSeverity: 'Minor',
    priority: 'Low',
    status: 'Resolved',
    createdAt: '2024-08-15 16:45',
  },
];

const initialState: ComplaintState = {
  form: initialFormData,
  status: 'idle',
  progress: 0,
  statusMessage: 'Ready for document upload or text intake.',
  fileName: null,
  fileSize: null,
  pastedText: '',
  isPasteModalOpen: false,
  theme: 'dark',
  savedComplaintsCount: initialPastComplaints.length,
  chatMessages: initialChatMessages,
  lastSavedAt: null,
  pastComplaints: initialPastComplaints,
};

export const complaintSlice = createSlice({
  name: 'complaint',
  initialState,
  reducers: {
    updateFormField: <K extends keyof ComplaintFormData>(
      state: ComplaintState,
      action: PayloadAction<{ field: K; value: ComplaintFormData[K] }>
    ) => {
      state.form[action.payload.field] = action.payload.value;
    },
    populateForm: (state, action: PayloadAction<Partial<ComplaintFormData>>) => {
      state.form = { ...state.form, ...action.payload };
    },
    resetForm: (state) => {
      state.form = { ...initialFormData };
      state.status = 'idle';
      state.progress = 0;
      state.statusMessage = 'Form reset. Ready for document upload or text intake.';
      state.fileName = null;
      state.fileSize = null;
      state.pastedText = '';
    },
    setAnalyzing: (state, action: PayloadAction<{ fileName?: string; fileSize?: string }>) => {
      state.status = 'analyzing';
      state.progress = 15;
      state.statusMessage = 'Analyzing document content and extracting key details... Please wait, this may take a few moments.';
      if (action.payload.fileName) state.fileName = action.payload.fileName;
      if (action.payload.fileSize) state.fileSize = action.payload.fileSize;
    },
    setProgress: (state, action: PayloadAction<number>) => {
      state.progress = action.payload;
    },
    setAnalysisSuccess: (state, action: PayloadAction<{ data: Partial<ComplaintFormData>; summary?: string }>) => {
      state.status = 'success';
      state.progress = 100;
      state.statusMessage = 'Analysis complete! Key complaint parameters successfully extracted.';
      state.form = { ...state.form, ...action.payload.data };

      const summaryText =
        action.payload.summary ||
        `Extracted details for Product "${action.payload.data.productName || 'Batch Item'}" (Batch: ${action.payload.data.batchNumber || 'N/A'}). Form fields populated.`;

      state.chatMessages.push({
        id: Date.now().toString(),
        sender: 'ai',
        text: summaryText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      });
    },
    setAnalysisError: (state, action: PayloadAction<string>) => {
      state.status = 'error';
      state.progress = 0;
      state.statusMessage = action.payload;
      state.chatMessages.push({
        id: Date.now().toString(),
        sender: 'ai',
        text: `Extraction note: ${action.payload}`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      });
    },
    togglePasteModal: (state, action: PayloadAction<boolean | undefined>) => {
      state.isPasteModalOpen = action.payload !== undefined ? action.payload : !state.isPasteModalOpen;
    },
    setPastedText: (state, action: PayloadAction<string>) => {
      state.pastedText = action.payload;
    },
    toggleTheme: (state) => {
      state.theme = state.theme === 'dark' ? 'light' : 'dark';
    },
    setTheme: (state, action: PayloadAction<'dark' | 'light'>) => {
      state.theme = action.payload;
    },
    addChatMessage: (state, action: PayloadAction<{ sender: 'ai' | 'user'; text: string }>) => {
      state.chatMessages.push({
        id: Date.now().toString(),
        sender: action.payload.sender,
        text: action.payload.text,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      });
    },
    saveComplaint: (state) => {
      const newId = `CMP-${Math.floor(1000 + Math.random() * 9000)}`;
      const newTicketNumber = `QA-2024-${state.pastComplaints.length + 101}`;
      const now = new Date();
      const createdAtStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(
        now.getDate()
      ).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

      const newRecord: ComplaintRecord = {
        ...state.form,
        id: newId,
        ticketNumber: newTicketNumber,
        status: 'Pending Triage',
        createdAt: createdAtStr,
      };

      state.pastComplaints.unshift(newRecord);
      state.savedComplaintsCount = state.pastComplaints.length;
      state.lastSavedAt = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    },
    deleteComplaint: (state, action: PayloadAction<string>) => {
      state.pastComplaints = state.pastComplaints.filter((c) => c.id !== action.payload);
      state.savedComplaintsCount = state.pastComplaints.length;
    },
  },
});

export const {
  updateFormField,
  populateForm,
  resetForm,
  setAnalyzing,
  setProgress,
  setAnalysisSuccess,
  setAnalysisError,
  togglePasteModal,
  setPastedText,
  toggleTheme,
  setTheme,
  addChatMessage,
  saveComplaint,
  deleteComplaint,
} = complaintSlice.actions;

export default complaintSlice.reducer;
