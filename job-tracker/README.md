# JobPulse — Job Tracking & Recruitment Application

[![Live Demo](https://img.shields.io/badge/Live%20App-Run%20JobPulse%20Job%20Tracker-0EA5E9?style=for-the-badge&logo=google-chrome&logoColor=white)](https://hashimu2.github.io/Ibrahim224/job-tracker/)

A modern, responsive web application for posting job openings, tracking applications, and managing candidate pipelines. Built with a fresh **Light Blue** design theme and zero external dependencies.

🔗 **Live Web Application (GitHub Pages):** [https://hashimu2.github.io/Ibrahim224/job-tracker/](https://hashimu2.github.io/Ibrahim224/job-tracker/)

---

## 🌟 Key Features

### 1. 💼 Candidate / Normal User Portal
- **Browse Active Openings:** Filter jobs by Department, Work Mode (Remote, Hybrid, On-site), Employment Type (Full-Time, Part-Time, Contract), and Experience Level.
- **Search:** Search across job titles, requirements, locations, and descriptions.
- **Detailed Job Overview:** Full breakdown of job overview, key responsibilities, required qualifications, salary ranges, benefits, and deadlines.
- **Online Job Application Form:**
  - Candidate profile information (Name, Email, Phone, Location, Current Title, Years of Experience).
  - Portfolio & LinkedIn links.
  - Expected Compensation & Earliest Start Date.
  - Resume / CV file upload with drag-and-drop support.
  - Cover letter / Personal statement.
  - Instant application submission with a unique tracking code (e.g., `TRK-849201`).
- **My Applications Tracker:**
  - Real-time step progress indicator for every application:
    `Applied` ➔ `Reviewing` ➔ `Shortlisted` ➔ `Interview Scheduled` ➔ `Offer / Hired` (or `Rejected`).
  - View interview status, notes, and attached documents.

### 2. 🛡️ Admin / Recruiter Portal
- **KPI Metrics Dashboard:**
  - Live count of Active Openings, Total Applicants, Candidates in Interview, and Offers/Hires.
- **Post & Edit Job Openings:**
  - Create new job postings with custom departments, locations, work modes, salary ranges, and deadlines.
  - Rich lists for responsibilities, qualifications, and perks.
  - Mark jobs as "Featured".
- **Job Management:**
  - Activate, pause/close, edit, or delete job postings.
  - One-click applicant count linking directly to candidate reviews.
- **Candidate Pipeline & ATS (Applicant Tracking System):**
  - **Kanban Board View:** Visual stage-by-stage columns (`New Applied`, `Under Review`, `Shortlisted`, `Interview`, `Offer / Hired`, `Rejected`).
  - **Table View:** Searchable candidate roster with status badges and star ratings.
  - **Candidate Evaluation Modal:**
    - Complete applicant profile, resume document viewer, and cover letter.
    - 5-Star candidate rating system.
    - One-click stage advancement buttons.
    - Internal recruiter notes log with author names and timestamps.

### 3. 🎨 Design & Aesthetic
- **Primary Color:** Light Blue (`#38bdf8`, `#0ea5e9`, `#0284c7`, `#e0f2fe`).
- Modern typography, sleek card shadows, glassmorphism header, and responsive layout.
- Persistent local storage: updates stay saved across page refreshes.
- Data export to JSON and instant demo reset.

---

## 🚀 How to Run the Application

### Option 1: Double-Click (Recommended)
Double-click `start.bat` in the project root folder. It starts a lightweight local server and automatically opens the application in your browser at `http://localhost:5050`.

### Option 2: Open Directly in Any Web Browser
Simply double-click `index.html` or open it with Google Chrome, Microsoft Edge, or Mozilla Firefox.

### Option 3: PowerShell
Run the following in PowerShell:
```powershell
powershell -ExecutionPolicy Bypass -File .\start-server.ps1
```

---

## 📁 File Structure
```
DSFP 6.0/
├── index.html              # Main HTML markup & modal dialogs
├── start.bat               # One-click Windows runner
├── start-server.ps1        # Pure PowerShell zero-dependency HTTP server
├── README.md               # Application documentation
├── css/
│   ├── style.css           # Core Light Blue theme variables, layout & cards
│   └── components.css      # Modals, Kanban board, tables, badges, toasts
└── js/
    ├── seedData.js         # Realistic initial job openings & candidate applications
    ├── store.js            # Reactive state management with localStorage persistence
    ├── user.js             # Candidate portal search, details modal & application form
    ├── admin.js            # Admin recruitment pipeline, ATS Kanban, job manager & ratings
    └── app.js              # Application coordinator, role switching & toast system
```

