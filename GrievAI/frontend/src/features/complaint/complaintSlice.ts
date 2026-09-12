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
  riskCategory?: string;
  riskRationale?: string;
  suggestedCapa?: string;
  aiSummary?: string;
  status?: string;
  ticketNumber?: string;
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
  riskCategory: '',
  riskRationale: '',
  suggestedCapa: '',
  aiSummary: '',
};

const initialChatMessages: ChatMessage[] = [
  {
    id: 'welcome',
    sender: 'ai',
    text: 'Upload a complaint document or paste text above. I will automatically extract the details and populate the form for you.',
    timestamp: 'Just now',
  },
];

const initialPastComplaints: ComplaintRecord[] = [];

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
} = complaintSlice.actions;

export default complaintSlice.reducer;
