# GrievAI Backend

AI-Powered Customer Complaint Management System Backend using **FastAPI**, **LangGraph**, **Gemini API**, and **SQLite**.

## Prerequisites
- Python 3.9+
- A Google Gemini API Key

## Setup & Installation

1. **Activate Virtual Environment**:
   ```bash
   # Windows
   .\.venv\Scripts\activate
   # Mac/Linux
   source .venv/bin/activate
   ```

2. **Configure Environment Variables**:
   Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```
   Add your `GEMINI_API_KEY` to `.env`.

3. **Run the Application**:
   ```bash
   uvicorn app.main:app --reload --port 5000
   ```
   The backend will run on `http://localhost:5000`.

## Features
- **Document Parsing**: Support for `.pdf`, `.docx`, `.eml`, and `.txt` via robust Python standard libraries and modules (`pypdf`, `python-docx`, `email`).
- **LangGraph AI Workflow**:
  - Node 1: Structured field extraction (FDA 21 CFR Part 211 / ICH Q9 alignment).
  - Node 2: Document Completeness Validation.
  - Node 3: Patient Risk Assessment, Prioritization, and CAPA recommendations.
- **Relational Database**: Fully functional local SQLite database using SQLAlchemy ORM.

## Endpoints
- `POST /api/analyze` or `POST /api/complaints/extract`: Submit `multipart/form-data` with `file` to run the LangGraph extraction pipeline.
- `POST /api/complaints`: Save a complaint to the database.
- `GET /api/complaints`: List all saved complaints.
- `GET /api/complaints/{id}`: Get complaint by ID.
- `POST /api/complaints/chat`: Converse with the AI Copilot regarding a complaint.
