import React, { useState, useRef } from 'react';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import {
  setAnalyzing,
  setProgress,
  setAnalysisSuccess,
  setAnalysisError,
  addChatMessage,
  togglePasteModal,
  setPastedText,
  populateForm,
} from '../features/complaint/complaintSlice';
import {
  useAnalyzeComplaintMutation,
  useChatWithCopilotMutation,
  normalizeAnalysisResponse,
} from '../services/complaintApi';

import {
  Sparkles,
  UploadCloud,
  FileText,
  Info,
  Send,
  Bot,
  User,
  X,
  FileCheck,
  Loader2,
  Paperclip,
} from 'lucide-react';

export const AIAssistantPanel: React.FC = () => {
  const dispatch = useAppDispatch();
  const {
    status,
    progress,
    statusMessage,
    chatMessages,
    isPasteModalOpen,
    pastedText,
    form,
  } = useAppSelector((state) => state.complaint);

  const [analyzeComplaintMutation] = useAnalyzeComplaintMutation();
  const [chatWithCopilot] = useChatWithCopilotMutation();

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [userQuery, setUserQuery] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const chatFileInputRef = useRef<HTMLInputElement>(null);
  const chatBottomRef = useRef<HTMLDivElement>(null);

  // Auto-scroll chat
  React.useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  const handleFileChange = (file: File) => {
    setSelectedFile(file);
    startAnalysisWithFile(file);
  };

  const startAnalysisWithFile = async (file: File) => {
    const formattedSize = (file.size / (1024 * 1024)).toFixed(2) + ' MB';
    dispatch(setAnalyzing({ fileName: file.name, fileSize: formattedSize }));

    // Prepare FormData for POST /analyze
    const formData = new FormData();
    formData.append('file', file);
    formData.append('filename', file.name);

    // Progress simulation
    let currentProg = 20;
    dispatch(setProgress(currentProg));
    const interval = setInterval(() => {
      if (currentProg < 85) {
        currentProg += 15;
        dispatch(setProgress(currentProg));
      }
    }, 300);

    try {
      const response = await analyzeComplaintMutation(formData).unwrap();
      clearInterval(interval);

      const { form: extractedForm, summary } = normalizeAnalysisResponse(response);
      dispatch(
        setAnalysisSuccess({
          data: extractedForm,
          summary: summary || `Analyzed "${file.name}" via /analyze endpoint. Extracted details successfully.`,
        })
      );
    } catch (err) {
      clearInterval(interval);
      console.error('Backend /analyze call failed:', err);
      dispatch(setAnalysisError('Failed to extract data from the document. Please ensure the backend is running.'));
    }
  };

  const handlePasteSubmit = async () => {
    if (!pastedText.trim()) return;

    dispatch(setAnalyzing({ fileName: 'Pasted_Complaint_Text.txt', fileSize: `${pastedText.length} chars` }));
    dispatch(togglePasteModal(false));

    let currentProg = 25;
    dispatch(setProgress(currentProg));
    const interval = setInterval(() => {
      if (currentProg < 80) {
        currentProg += 20;
        dispatch(setProgress(currentProg));
      }
    }, 250);

    try {
      const response = await analyzeComplaintMutation({
        text: pastedText,
        filename: 'pasted_text.txt',
      }).unwrap();
      clearInterval(interval);

      const { form: extractedForm, summary } = normalizeAnalysisResponse(response);
      dispatch(
        setAnalysisSuccess({
          data: extractedForm,
          summary: summary || 'Pasted text analyzed via /analyze. Form fields populated.',
        })
      );
    } catch (err) {
      clearInterval(interval);
      console.error('Backend /analyze call failed:', err);
      dispatch(setAnalysisError('Failed to extract data from the text. Please ensure the backend is running.'));
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileChange(e.dataTransfer.files[0]);
    }
  };

  const handleChatSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userQuery.trim()) return;

    const query = userQuery.trim();
    dispatch(addChatMessage({ sender: 'user', text: query }));
    setUserQuery('');

    try {
      const response = await chatWithCopilot({
        message: query,
        complaint_data: form,
        history: chatMessages.slice(-5) // Send last 5 messages for context
      }).unwrap();

      dispatch(addChatMessage({ sender: 'ai', text: response.reply }));

      if (response.form_updates && Object.keys(response.form_updates).length > 0) {
        dispatch(populateForm(response.form_updates));
      }
    } catch (error) {
      console.error('Chat error:', error);
      dispatch(addChatMessage({ sender: 'ai', text: 'Sorry, I encountered an error while processing your request.' }));
    }
  };


  return (
    <div className="panel-card">
      {/* Header */}
      <div className="panel-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Sparkles size={20} color="#3b82f6" />
          <h2 className="panel-title" style={{ fontSize: '18px' }}>
            AI Complaint Intake Assistant
          </h2>
        </div>
        <div className="status-badge-beta">BETA</div>
      </div>

      <div className="assistant-content">
        {/* Drag & Drop Box */}
        <div
          className={`dropzone-container ${isDragging ? 'is-dragging' : ''}`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.docx,.txt,.eml"
            style={{ display: 'none' }}
            onChange={(e) => {
              if (e.target.files && e.target.files.length > 0) {
                handleFileChange(e.target.files[0]);
              }
            }}
          />
          <div className="dropzone-icon-wrap">
            <UploadCloud size={24} />
          </div>
          <div>
            <p className="dropzone-text">Drag &amp; drop complaint document here</p>
            <p className="dropzone-subtext">or click to browse</p>
          </div>
        </div>

        {/* Selected file preview */}
        {selectedFile && (
          <div className="file-selected-card">
            <div className="file-info">
              <FileCheck size={18} color="#10b981" />
              <div>
                <strong style={{ fontSize: '13px' }}>{selectedFile.name}</strong>
                <span style={{ fontSize: '11.5px', color: 'var(--text-muted)', marginLeft: '8px' }}>
                  ({(selectedFile.size / 1024).toFixed(1)} KB)
                </span>
              </div>
            </div>
            <button
              className="action-btn-sm"
              style={{ padding: '3px 8px' }}
              onClick={(e) => {
                e.stopPropagation();
                setSelectedFile(null);
              }}
              title="Remove file"
            >
              <X size={14} />
            </button>
          </div>
        )}

        {/* OR Divider */}
        <div className="or-divider">OR</div>

        {/* Paste Complaint Text / Email Button */}
        <button
          type="button"
          className="btn-paste"
          onClick={() => dispatch(togglePasteModal())}
        >
          <FileText size={16} />
          <span>Paste Complaint Text / Email</span>
        </button>

        {/* Collapsible Paste Area */}
        {isPasteModalOpen && (
          <div className="paste-drawer">
            <div className="paste-actions-row">
              <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)' }}>
                Paste Raw Email or Report:
              </span>
            </div>
            <textarea
              className="form-textarea"
              rows={5}
              placeholder="Paste email headers, customer complaint body, or hospital memo here..."
              value={pastedText}
              onChange={(e) => dispatch(setPastedText(e.target.value))}
            />
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
              <button
                type="button"
                className="btn-secondary"
                style={{ padding: '6px 12px', fontSize: '12px' }}
                onClick={() => dispatch(togglePasteModal(false))}
              >
                Cancel
              </button>
              <button
                type="button"
                className="btn-primary"
                style={{ padding: '6px 14px', fontSize: '12px' }}
                onClick={handlePasteSubmit}
                disabled={!pastedText.trim() || status === 'analyzing'}
              >
                {status === 'analyzing' ? (
                  <>
                    <Loader2 size={13} className="spin" />
                    <span>Analyzing...</span>
                  </>
                ) : (
                  <span>Extract with AI</span>
                )}
              </button>
            </div>
          </div>
        )}

        {/* Supported Formats Notification Banner */}
        <div className="format-banner">
          <Info size={16} style={{ flexShrink: 0 }} />
          <span>
            <strong>Supported formats:</strong> PDF, DOCX, TXT, EML &nbsp;|&nbsp; Max file size: 10MB
          </span>
        </div>

        {/* EXTRACTION PROGRESS Section */}
        <div className="progress-card">
          <div className="progress-header">
            <span className="progress-label">EXTRACTION PROGRESS</span>
            <span className="progress-percentage">{progress}%</span>
          </div>
          <div className="progress-track">
            <div
              className="progress-bar-fill"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="progress-desc">{statusMessage}</p>
        </div>

        {/* AI ASSISTANT Section */}
        <div className="ai-section">
          <span className="progress-label">AI ASSISTANT</span>

          {/* Chat Messages */}
          <div className="chat-container">
            {chatMessages.map((msg) => (
              <div
                key={msg.id}
                className={
                  msg.sender === 'ai' ? 'ai-message-card' : 'user-message-card'
                }
              >
                {msg.sender === 'ai' && (
                  <div className="bot-icon-wrap">
                    <Bot size={17} />
                  </div>
                )}
                <div>{msg.text}</div>
                {msg.sender === 'user' && (
                  <User size={16} color="var(--text-muted)" style={{ marginLeft: '4px' }} />
                )}
              </div>
            ))}
            <div ref={chatBottomRef} />
          </div>

          {/* Quick Prompt Suggestions */}
          <div className="prompt-chips">
            <button
              type="button"
              className="chip-btn"
              onClick={() => setUserQuery('Summarize this customer complaint')}
            >
              ✨ Summarize
            </button>
            <button
              type="button"
              className="chip-btn"
              onClick={() => setUserQuery('What is the recommended Root Cause?')}
            >
              🔍 Root Cause
            </button>
            <button
              type="button"
              className="chip-btn"
              onClick={() => setUserQuery('Suggest immediate CAPA recommendation')}
            >
              🛡️ CAPA Action
            </button>
            <button
              type="button"
              className="chip-btn"
              onClick={() => setUserQuery('What is the batch expiry date and quantity affected?')}
            >
              📋 Batch Info
            </button>
          </div>

          {/* Chat Input Bar */}
          <form onSubmit={handleChatSend} className="chat-input-row" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <button
              type="button"
              className="btn-icon"
              title="Upload document"
              onClick={() => chatFileInputRef.current?.click()}
              style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px', color: 'var(--text-muted)' }}
            >
              <Paperclip size={18} />
            </button>
            <input
              ref={chatFileInputRef}
              type="file"
              accept=".pdf,.docx,.txt,.eml"
              style={{ display: 'none' }}
              onChange={(e) => {
                if (e.target.files && e.target.files.length > 0) {
                  handleFileChange(e.target.files[0]);
                }
              }}
            />
            <input
              type="text"
              className="chat-input"
              style={{ flex: 1 }}
              placeholder="Ask me anything about this complaint..."
              value={userQuery}
              onChange={(e) => setUserQuery(e.target.value)}
            />
            <button
              type="submit"
              className="btn-send"
              disabled={!userQuery.trim()}
              title="Send query to AI Assistant"
            >
              <Send size={14} />
            </button>
          </form>

          <p className="ai-disclaimer">
            AI responses may contain errors. Please verify information.
          </p>
        </div>
      </div>
    </div>
  );
};
