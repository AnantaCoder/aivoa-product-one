# Aivoa.ai Interview Preparation Guide: GrievAI

Congratulations on being selected for the interview! Based on your **GrievAI** project, you have an excellent foundation for both the Technical and QMS Domain rounds. This guide maps your project directly to what the interviewers at Aivoa.ai are looking for.

---

## 1. Technical Round Preparation

The interviewers want to see that you deeply understand the code you've written, the architectural choices, and the flow of data.

### End-to-End Code Flow
When asked to explain the end-to-end flow of GrievAI, you should confidently describe the following sequence:
1. **Frontend Submission (React/Vite):** A user submits a complaint via a web form or uploads a document (e.g., PDF) through the modern React UI.
2. **API Ingestion (FastAPI):** The request hits your FastAPI backend (`app/main.py`), specifically the `extract_complaint` endpoint in `app/api/complaints.py`. 
3. **Document Parsing:** If a file is uploaded, it is parsed by your `parse_document` function to extract raw text.
4. **AI Orchestration (LangChain/LangGraph):** The raw text is passed to your `run_extraction_agent`. This triggers a state graph (`ComplaintState`) that flows through specific AI nodes (`app/agent/nodes.py`):
    *   **`extract_fields_node`**: Uses an LLM prompt to pull out structured data (customer name, batch number, description).
    *   **`validate_completeness_node`**: The LLM evaluates if any crucial fields are missing and assigns a completeness score.
    *   **`classify_risk_node`**: The LLM assesses the complaint's severity, priority, risk category, and suggests a CAPA (Corrective and Preventive Action).
5. **Database Storage (SQLAlchemy):** The structured data is validated via Pydantic schemas and saved to a relational database (SQLite via `app/db/models.py`) using CRUD services.
6. **Response Generation:** The API returns the structured JSON response back to the React frontend to display to the user.

### Key Functions, Classes, and Modules
Be prepared to talk in-depth about these specific components from your codebase:
*   **The `Complaint` Model (`db/models.py`):** Explain how you designed the database schema to capture pharmaceutical-specific data like `product_strength`, `batch_number`, `manufacturing_date`, and `expiry_date`, alongside AI outputs like `ai_summary` and `suggested_capa`.
*   **LangGraph Nodes (`agent/nodes.py`):** Explain how you separated the AI logic into discrete nodes (`extract_fields_node`, `validate_completeness_node`, `classify_risk_node`). This shows you understand modular AI design and state management (passing `ComplaintState` between nodes).
*   **JSON Parsing Helper (`parse_json_from_llm_response`):** A great technical detail to mention is how you handled LLM hallucinations or formatting issues by writing a helper function that strips markdown (e.g., ```json) to safely parse the LLM's string output into a Python dictionary.

### Implementation Logic and Design
*   **Why FastAPI + LangGraph?** FastAPI provides high performance and async capabilities (crucial for waiting on LLM API calls). LangGraph provides a predictable, stateful workflow for the LLM agents, ensuring the extraction, validation, and risk assessment happen in a reliable order.
*   **Why React + Tailwind?** Mention the need for a dynamic, responsive UI for customer interactions and internal dashboards.

---

## 2. QMS Domain Round (Non-Technical)

Aivoa.ai builds products for the Life Sciences industry. Your GrievAI project is essentially a **Product Complaints and CAPA Management System**. Here is how to map your project to their domain:

### The QMS Modules You Already Built
*   **Product Complaints:** GrievAI directly handles the ingestion and parsing of customer complaints. Explain how your system automates the manual triage process.
*   **CAPA (Corrective and Preventive Action):** In your `classify_risk_node`, your AI suggests a CAPA (`suggested_capa`). Explain that CAPA is the process of investigating the root cause of the complaint and taking action to prevent it from happening again.
*   **Deviation & Adverse Event Management:** Your system extracts `initial_severity` and `risk_category`. You can explain that if the AI flags a complaint as "Critical Severity" (e.g., a patient got sick), it would trigger a Deviation or an Adverse Event workflow in a broader QMS.
*   **Recall Management:** If multiple complaints share the same `batch_number` (a field your DB tracks), you can explain how a QMS uses this data to initiate a product recall.

### API vs. FDF Manufacturing
You must know the difference between these two:
*   **API (Active Pharmaceutical Ingredient):** This is the raw chemical or biological substance that actually cures the disease (e.g., the raw Ibuprofen powder). Complaints here usually come from B2B buyers (other pharma companies).
*   **FDF (Finished Dosage Form):** This is the final product the patient takes (e.g., the Ibuprofen tablet in a blister pack). Complaints here come from patients or pharmacies (e.g., "broken tablet", "missing label").
*   *Your angle:* Mention that GrievAI's extraction models can be tuned to handle technical B2B API complaints or consumer-facing FDF complaints.

### Basic Life Sciences & GMP Concepts
*   **GMP (Good Manufacturing Practices):** The strict regulatory standards (set by FDA, EMA) that pharma companies must follow. Everything must be documented. GrievAI helps with GMP by ensuring complaints are logged accurately and consistently, reducing human error.
*   **Product Workflows:** From an end-user perspective, a Quality Assurance (QA) manager logs into a QMS daily. Instead of reading 100 messy emails, GrievAI parses them, scores their completeness, and flags the critical ones (Risk Assessment) so the QA manager knows exactly what to work on first.

---

## 💡 Final Interview Tips
*   **Show Curiosity:** Ask them questions! "I built GrievAI to automate complaints, how does Aivoa currently handle the handoff between a Product Complaint and a CAPA module?"
*   **Acknowledge Limitations:** If they ask how you handle hallucinations, be honest. Say, "I use prompt engineering and the `validate_completeness_node`, but for a real GMP environment, we'd need human-in-the-loop review before taking regulatory action."
*   **Connect Tech to Business:** Don't just say "I used LangGraph." Say, "I used LangGraph because it allows us to reliably extract the `batch_number`, which the business needs for compliance and recall management."
