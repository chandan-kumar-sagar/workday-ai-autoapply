# API Data Flow

## 1. Resume Processing
- **Upload**: User uploads a file (.pdf, .docx) through the frontend dashboard.
- **Storage**: `uploadMiddleware` (Multer) saves the file to `backend/src/uploads/`.
- **Parsing**: `resumeController` triggers `pdfParser` or `docxParser` to extract raw text.
- **AI Analysis**: `openaiService` uses a structured prompt (`resumePrompt.js`) to extract entities (name, skills, experience) in JSON format.
- **Persistence**: Parsed data is stored in the `Resume` model linked to the `User`.

## 2. Automation Flow
- **Detection**: Chrome extension content script detects a Workday job application page.
- **Mapping Request**: Extension sends the page fields to the backend `aiController`.
- **Field Mapping**: Backend uses `aiMappingService` and OpenAI to match page fields to the user's stored resume data using `fieldMappingPrompt.js`.
- **Auto-Fill**: Extension receives the mapping and injects values into the Workday form fields.

## 3. Application Tracking
- **Status Update**: Once the user submits the form, the extension notifies the backend.
- **Log**: A new `JobApplication` entry is created/updated with the status (e.g., "applied").
