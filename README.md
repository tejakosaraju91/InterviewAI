🤖 InterviewAI
An AI-powered mock interview web app that runs 100% in the browser — no API key, no backend, no paid service needed.

✨ Features
Animated AI Avatar (Nova) — lip-sync, blinking, state-based glow ring
Voice I/O — avatar speaks questions, mic captures your answers (Web Speech API)
Resume Parser — upload PDF, DOCX, or TXT; detects skills, projects, internships, certifications
Personalised Questions — 8 questions tailored to your resume and target role
Live Scoring — 4 criteria: Relevance, Technical, Clarity, Communication
Final Report — radar/bar charts, per-question breakdown, SELECTED / ON HOLD / NOT SELECTED decision
Resume to 20 Q&A — generates 20 interview questions with best answers and tips from your resume
11 Languages — English, Hindi, Telugu, Tamil, Kannada, Malayalam, Marathi, Bengali, Spanish, French, German
Download PDF — print-ready report and Q&A sheet
No API key required — fully rule-based engine with WebLLM fallback
🚀 How to Run
Option 1 — Python (recommended)
cd InterviewAI
python -m http.server 4200
Open: http://localhost:4200

Option 2 — Open directly
Just open index.html in Chrome or Edge (some features need a server for PDF parsing).

📁 Project Structure
InterviewAI/
├── index.html          ← Main app (all 5 screens)
├── css/
│   └── style.css       ← Full styling
└── js/
    ├── questions.js    ← Question bank (HR, behavioral, technical, resume)
    ├── parser.js       ← Resume parser (PDF/DOCX/TXT)
    ├── scorer.js       ← Answer scoring engine
    ├── avatar.js       ← Animated SVG avatar
    ├── speech.js       ← Web Speech API wrapper
    ├── report.js       ← Final report + Chart.js charts
    ├── app.js          ← Main app controller
    └── qa20.js         ← Resume to 20 Q&A generator
🛠 Tech Stack
Vanilla HTML, CSS, JavaScript (no framework)
pdf.js — PDF parsing
mammoth.js — DOCX parsing
Chart.js — Report charts
Web Speech API — TTS + STT
