# Workday AI Auto Apply

An AI-powered Chrome Extension and Full-Stack Application designed to automate the process of filling out job applications on Workday and other recruitment platforms. 

The system uses **Google Gemini AI** for intelligent resume parsing and generates professional, contextual answers for complex application questions.

---

## 🚀 Key Features

- **One-Click Autofill**: Automatically detects and populates form fields on any job application site.
- **Intelligent Resume Parsing**: Uses `gemini-2.5-flash` to extract structured data from PDF and DOCX resumes.
- **Smart Mapping Architecture**:
  1. **Resume Data First**: Prioritizes your real personal and professional information.
  2. **Static Mapping Fallback**: Handles universal fields like Gender, Work Authorization, and Source.
  3. **AI Fallback**: Calls Gemini AI to generate creative answers for complex "essay" questions (e.g., "Why are you a fit for this role?").
- **Cost-Efficient**: Optimized to minimize AI API calls by leveraging local matching whenever possible.
- **Robust Error Handling**: Built-in fallback system ensures the extension works even if API limits are reached.

---

## 🛠️ Tech Stack

### Backend
- **Core**: Node.js, Express.js
- **Database**: MongoDB (Mongoose ODM)
- **AI Integration**: Google Generative AI (`@google/generative-ai`)
- **File Processing**: Multer, PDF-Parse, Mammoth (for DOCX)
- **Security**: JWT Authentication, BcryptJS

### Frontend (Dashboard)
- **Framework**: React 19 (Vite)
- **Styling**: Tailwind CSS 4, Framer Motion (for animations)
- **State Management**: Redux Toolkit
- **Networking**: Axios, React Hook Form

### Chrome Extension
- **Manifest Version**: 3
- **Languages**: Javascript (Vanilla), CSS, HTML
- **Injection**: Content Scripts for real-time form detection and manipulation.

---

## 📡 API Endpoints

### Auth
- `POST /api/auth/register`: Register a new account.
- `POST /api/auth/login`: Authenticate and receive a JWT.

### Resume
- `POST /api/resume/upload`: Upload PDF/DOCX and trigger AI parsing.
- `GET /api/resume/latest`: Retrieve the most recently parsed resume data.

### Automation
- `POST /api/automation/map-field`: Request a value for a specific form field label.

---

## ⚙️ Installation & Setup

1. **Clone the repository**
2. **Setup Backend**:
   - Navigate to `backend/`
   - Create a `.env` file with:
     ```env
     PORT=5000
     MONGO_URI=your_mongodb_uri
     GEMINI_API_KEY=your_google_gemini_key
     JWT_SECRET=your_secret_key
     ```
   - Run `npm install` and `npm run dev`
3. **Setup Frontend**:
   - Navigate to `frontend/`
   - Run `npm install` and `npm run dev`
4. **Setup Extension**:
   - Open Chrome and go to `chrome://extensions/`
   - Enable "Developer mode"
   - Click "Load unpacked" and select the `extension/` folder.

---

## 📝 License
MIT License. Created by Chandan Kumar.
