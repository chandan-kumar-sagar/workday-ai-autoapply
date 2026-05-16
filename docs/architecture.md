# Architecture Overview

The Workday AI Auto-Apply system consists of three main parts:

1.  **Frontend (React Dashboard)**:
    *   Manages user profiles and resumes.
    *   Displays application history and status.
    *   Configures automation settings.

2.  **Backend (Node.js/Express API)**:
    *   Handles authentication and data persistence (MongoDB).
    *   Integrates with OpenAI for parsing resumes and mapping job descriptions to resume points.
    *   Provides endpoints for the extension to fetch data.

3.  **Chrome Extension**:
    *   Injects scripts into Workday job pages.
    *   Extracts form fields.
    *   Communicates with the backend to get field values and auto-fills the form.

## Data Flow

1.  User uploads resume via Dashboard.
2.  Backend parses resume using OpenAI.
3.  User navigates to a Workday job page.
4.  Extension detects the page and asks the backend for appropriate field values.
5.  Extension fills the form.
