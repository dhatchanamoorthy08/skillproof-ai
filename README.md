# SkillProof AI — Evidence-Based Skill Passport & Job Readiness Platform

SkillProof AI is a full-stack, enterprise-grade web application designed to help:
1. **Students** demonstrate genuine, verifiable technical skills through multi-state Skill Passports, proctored assessments, and transparent Job Readiness Indexing.
2. **HR Recruiters** discover accredited candidates with explainable job matching and audited code repositories.
3. **College Placement Officers** monitor student progression in real time, receive early alerts on skill gaps, orchestrate hiring drives, and export certified PDF and CSV reports.

---

## 🚀 Key Platform Features

### 1. Evidence-Based Skill Passport (4 Verification States)
- **Claimed**: Self-reported candidate skills (preliminary weight: `0.30`).
- **Assessed**: Validated through online secure tests (weight: `0.95`).
- **Demonstrated**: Substantiated by real GitHub repositories or delivered projects (weight: `0.85`).
- **Verified**: Formally checked and audited by placement faculty or corporate evaluators (weight: `1.00`).

### 2. Explainable Hybrid Matching Engine
- Does not rely on a single opaque percentage.
- Deconstructs candidate-job fit into:
  - Required skills covered vs. missing mandatory requirements.
  - Preferred skills bonus.
  - Average assessment quality score.
  - Code evidence strength and CGPA eligibility validation.

### 3. Online Secure Proctored Assessment Engine
- **Fullscreen Enforcement**: Detects exit events, prompts warnings, and logs audit violations.
- **Page Visibility Tracking**: Records browser blur and tab-switching timestamps.
- **Clipboard Suppression**: Disables unauthorized copy, cut, and paste shortcuts (Ctrl+C, Ctrl+V).
- **Context Menu Suppression**: Blocks right-click inspection during exam sessions.
- **Server-Side Scoring**: Evaluates answers on the backend with time expiration validation.

### 4. Automated ATS Resume Diagnostic
- Parses PDF resumes via `pdf-parse`.
- Extracts normalized skills, academic history, and projects.
- Computes ATS completeness score and missing keyword recommendations.
- 1-click **"Sync to Passport"** imports extracted skills directly into the Skill Passport.

### 5. Institutional Command Center (Placement Cell)
- Aggregated college metrics: Enrolled students, placement rates, readiness tier distribution.
- **Early Alerts Engine**: Proactively flags students with $<50\%$ JRI, missing assessments, or unverified evidence.
- **Recruiter Accreditation**: 2-step review to approve, reject, or request information on corporate recruiters.
- **Certified PDF & CSV Reporting**: Instant export for institutional audits and accreditation boards.

---

## 🛠️ Technology Stack

- **Frontend**: React 18, Vite, React Router v6, Lucide Icons, Recharts, Custom Vanilla CSS Design System with CSS Tokens.
- **Backend**: Node.js, Express.js, Mongoose ODM, JWT, bcryptjs, Multer, PDFKit, CSV-Writer, pdf-parse, Helmet, CORS.
- **Database**: MongoDB (Atlas or local instance, with zero-config resiliency).

---

## 🔑 Pre-Configured Demo Credentials

The platform includes seed data with pre-configured accounts across all roles:

| Role | Email | Password | Highlights |
| :--- | :--- | :--- | :--- |
| **Student** | `student@skillproof.ai` | `Password@123` | Placement Ready (JRI: 88%), 6 skills, AWS cert, verified project |
| **At-Risk Student** | `atrisk@skillproof.ai` | `Password@123` | Needs Support (JRI: 38%), flagged in Placement Early Alerts |
| **HR Recruiter** | `recruiter@skillproof.ai` | `Password@123` | Approved corporate recruiter (Nexis Cloud Labs), active jobs |
| **Pending Recruiter** | `pending@skillproof.ai` | `Password@123` | Verification pending (for testing placement officer approval) |
| **Placement Officer**| `officer@skillproof.ai` | `Password@123` | Full college command center & report export privileges |

---

## 📦 Installation & Getting Started

### 1. Prerequisites
- Node.js (v18 or higher)
- npm (v9 or higher)

### 2. Setup Server
```bash
cd server
npm install
node seeds/demoDataSeeder.js
npm run dev
```

### 3. Setup Client
```bash
cd client
npm install
npm run dev
```

### 4. Access Application
Open [http://localhost:5173](http://localhost:5173) in your browser.
Use the 1-click demo buttons on the Sign In page for immediate testing.
