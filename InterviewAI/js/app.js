// app.js — Main controller for InterviewAI

// ── State ──────────────────────────────────────────────────────────────────
const STATE = {
  screen: "welcome",       // welcome | upload | interview | report
  candidate: { name: "", role: "", experience: "", lang: "en", difficulty: "medium" },
  resume: null,            // parsed resume data
  questions: [],           // current question set
  currentQ: 0,
  answers: [],
  scores: [],
  paused: false,
  timerInterval: null,
  timerSeconds: 0,
  repeatMode: false,
  avatar: null,
  speech: null
};

const LANGS = {
  en: { name: "English", greet: "Hello", welcome: "Welcome to InterviewAI!", readyMsg: (n) => `Hello ${n}! I'm Nova, your AI interviewer. Let's begin. I'll ask you 10 questions. Take your time and answer clearly.` },
  hi: { name: "हिंदी", greet: "नमस्ते", welcome: "InterviewAI में आपका स्वागत है!", readyMsg: (n) => `नमस्ते ${n}! मैं Nova हूँ, आपकी AI इंटरव्यूअर। चलिए शुरू करते हैं। मैं आपसे 10 प्रश्न पूछूँगी।` },
  te: { name: "తెలుగు", greet: "నమస్కారం", welcome: "InterviewAI కి స్వాగతం!", readyMsg: (n) => `నమస్కారం ${n}! నేను Nova, మీ AI ఇంటర్వ్యూయర్. మనం ప్రారంభిద్దాం. నేను మీకు 10 ప్రశ్నలు అడుగుతాను.` },
  ta: { name: "தமிழ்", greet: "வணக்கம்", welcome: "InterviewAI-க்கு வரவேற்கிறோம்!", readyMsg: (n) => `Hello ${n}! I'm Nova, your AI interviewer. Let's begin with 10 questions.` },
  kn: { name: "ಕನ್ನಡ", greet: "ನಮಸ್ಕಾರ", welcome: "InterviewAI ಗೆ ಸ್ವಾಗತ!", readyMsg: (n) => `Hello ${n}! I'm Nova. Let's start your interview with 10 questions.` },
  ml: { name: "മലയാളം", greet: "നമസ്കാരം", welcome: "InterviewAI-ലേക്ക് സ്വാഗതം!", readyMsg: (n) => `Hello ${n}! I'm Nova. Let's begin your interview with 10 questions.` },
  mr: { name: "मराठी", greet: "नमस्कार", welcome: "InterviewAI मध्ये आपले स्वागत आहे!", readyMsg: (n) => `नमस्कार ${n}! मी Nova आहे. चला सुरुवात करूया. मी तुम्हाला 10 प्रश्न विचारेन.` },
  bn: { name: "বাংলা", greet: "নমস্কার", welcome: "InterviewAI-তে স্বাগতম!", readyMsg: (n) => `Hello ${n}! I'm Nova. Let's start your interview with 10 questions.` },
  es: { name: "Español", greet: "Hola", welcome: "¡Bienvenido a InterviewAI!", readyMsg: (n) => `Hola ${n}! Soy Nova, tu entrevistadora de IA. Empecemos con 10 preguntas.` },
  fr: { name: "Français", greet: "Bonjour", welcome: "Bienvenue sur InterviewAI!", readyMsg: (n) => `Bonjour ${n}! Je suis Nova, votre intervieweuse IA. Commençons avec 10 questions.` },
  de: { name: "Deutsch", greet: "Hallo", welcome: "Willkommen bei InterviewAI!", readyMsg: (n) => `Hallo ${n}! Ich bin Nova, Ihre KI-Interviewerin. Beginnen wir mit 10 Fragen.` }
};

// ── Init ───────────────────────────────────────────────────────────────────
document.addEventListener("DOMContentLoaded", () => {
  STATE.speech = new SpeechManager();
  populateLangSelectors();
  showScreen("welcome");
  setupWelcomeForm();
  setupUploadZone();
  setupInterviewControlsNow();
  initQA20Screen();
});

function populateLangSelectors() {
  document.querySelectorAll(".lang-select").forEach(sel => {
    sel.innerHTML = Object.entries(LANGS).map(([k, v]) => `<option value="${k}">${v.name}</option>`).join("");
    sel.value = "en";
    sel.addEventListener("change", (e) => {
      STATE.candidate.lang = e.target.value;
      document.querySelectorAll(".lang-select").forEach(s => s.value = e.target.value);
      STATE.speech.setLang(e.target.value);
    });
  });
}

// ── Navigation ─────────────────────────────────────────────────────────────
function navTo(dest) {
  document.getElementById("navInterview")?.classList.remove("active");
  document.getElementById("navQA20")?.classList.remove("active");
  if (dest === "qa20") {
    showScreen("qa20");
    document.getElementById("navQA20")?.classList.add("active");
  } else {
    showScreen("welcome");
    document.getElementById("navInterview")?.classList.add("active");
  }
}

// ── Screen management ──────────────────────────────────────────────────────
function showScreen(name) {
  document.querySelectorAll(".screen").forEach(s => s.classList.remove("active"));
  const el = document.getElementById("screen-" + name);
  if (el) el.classList.add("active");
  STATE.screen = name;
}

// ── Welcome screen ─────────────────────────────────────────────────────────
function setupWelcomeForm() {
  const form = document.getElementById("welcomeForm");
  if (!form) return;
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const name = document.getElementById("inp-name").value.trim();
    const role = document.getElementById("inp-role").value.trim();
    const exp = document.getElementById("inp-exp").value;
    const diff = document.getElementById("inp-diff").value;
    const lang = document.getElementById("inp-lang").value;

    if (!name || !role) { showToast("Please enter your name and target role.", "error"); return; }

    STATE.candidate = { name, role, experience: exp, lang, difficulty: diff };
    STATE.speech.setLang(lang);
    document.querySelectorAll(".lang-select").forEach(s => s.value = lang);
    showScreen("upload");
  });
}

// ── Upload screen ──────────────────────────────────────────────────────────
function setupUploadZone() {
  const zone = document.getElementById("dropZone");
  const fileInput = document.getElementById("resumeFile");
  if (!zone) return;

  zone.addEventListener("click", () => fileInput.click());
  zone.addEventListener("dragover", (e) => { e.preventDefault(); zone.classList.add("drag-over"); });
  zone.addEventListener("dragleave", () => zone.classList.remove("drag-over"));
  zone.addEventListener("drop", (e) => {
    e.preventDefault();
    zone.classList.remove("drag-over");
    const file = e.dataTransfer.files[0];
    if (file) handleResumeFile(file);
  });
  fileInput.addEventListener("change", (e) => {
    if (e.target.files[0]) handleResumeFile(e.target.files[0]);
  });

  document.getElementById("btnSkipUpload")?.addEventListener("click", () => {
    STATE.resume = { name: STATE.candidate.name, skills: [], education: [], projects: [], internships: [], certifications: [], rawText: "" };
    startInterview(false);
  });
}

async function handleResumeFile(file) {
  const allowed = ["pdf","docx","txt"];
  const ext = file.name.split(".").pop().toLowerCase();
  if (!allowed.includes(ext)) { showToast("Unsupported file. Please upload PDF, DOCX, or TXT.", "error"); return; }

  showToast("Parsing resume...", "info");
  document.getElementById("parseLoader").style.display = "flex";

  try {
    const parsed = await parseResumeFile(file);
    STATE.resume = parsed;
    if (!parsed.name && STATE.candidate.name) parsed.name = STATE.candidate.name;
    renderResumeSummary(parsed);
    document.getElementById("parseLoader").style.display = "none";
    document.getElementById("resumeSummary").style.display = "block";
    document.getElementById("btnStartInterview").style.display = "inline-flex";
    showToast("Resume parsed successfully!", "success");
  } catch (err) {
    document.getElementById("parseLoader").style.display = "none";
    showToast("Failed to parse resume: " + err.message, "error");
  }
}

function renderResumeSummary(parsed) {
  const el = document.getElementById("resumeSummary");
  el.innerHTML = `
    <div class="summary-card">
      <h3>📄 Resume Summary</h3>
      <div class="summary-grid">
        <div class="summary-item"><span class="summary-label">Name</span><span>${parsed.name || STATE.candidate.name || "—"}</span></div>
        <div class="summary-item"><span class="summary-label">Skills (${parsed.skills.length})</span><span class="tags">${parsed.skills.slice(0,12).map(s=>`<span class="tag">${s}</span>`).join("") || "None detected"}</span></div>
        <div class="summary-item"><span class="summary-label">Education</span><span class="tags">${parsed.education.slice(0,4).map(e=>`<span class="tag tag-blue">${e}</span>`).join("") || "—"}</span></div>
        <div class="summary-item"><span class="summary-label">Projects</span><span class="tags">${parsed.projects.slice(0,4).map(p=>`<span class="tag tag-green">${p}</span>`).join("") || "—"}</span></div>
        <div class="summary-item"><span class="summary-label">Internships</span><span class="tags">${parsed.internships.slice(0,3).map(i=>`<span class="tag tag-purple">${i}</span>`).join("") || "—"}</span></div>
        <div class="summary-item"><span class="summary-label">Certifications</span><span class="tags">${parsed.certifications.slice(0,4).map(c=>`<span class="tag tag-orange">${c}</span>`).join("") || "—"}</span></div>
      </div>
    </div>`;
}

// btnStartInterview wired in setupUploadZone

// ── Interview screen ───────────────────────────────────────────────────────
function startInterview(repeat) {
  const resume = STATE.resume || { skills: [], education: [], projects: [], internships: [], certifications: [] };

  if (repeat) {
    const saved = JSON.parse(localStorage.getItem("interviewAI_questions") || "null");
    if (saved && saved.length) { STATE.questions = saved; }
    else { buildFreshQuestions(resume); }
  } else {
    buildFreshQuestions(resume);
  }

  STATE.currentQ = 0;
  STATE.answers = new Array(STATE.questions.length).fill("");
  STATE.scores = [];
  STATE.paused = false;

  showScreen("interview");

  // Init avatar
  if (!STATE.avatar) STATE.avatar = new Avatar("avatarContainer");
  else STATE.avatar.setState("idle");

  renderQuestion();
  startTimer();

  // Greet
  const lang = STATE.candidate.lang;
  const greetMsg = LANGS[lang]?.readyMsg(STATE.candidate.name) || LANGS.en.readyMsg(STATE.candidate.name);
  setTimeout(() => {
    STATE.avatar.setState("speaking");
    STATE.speech.speak(greetMsg, null, () => {
      STATE.avatar.setState("idle");
      setTimeout(() => askCurrentQuestion(), 800);
    });
  }, 600);
}

function buildFreshQuestions(resume) {
  STATE.questions = buildQuestionSet(
    STATE.candidate.role,
    resume.skills || [],
    resume.projects || [],
    resume.education || [],
    resume.internships || [],
    resume.certifications || [],
    STATE.candidate.difficulty,
    STATE.candidate.lang
  );
  localStorage.setItem("interviewAI_questions", JSON.stringify(STATE.questions));
  STATE.repeatMode = true;
}

function setupInterviewControlsNow() {
  document.getElementById("btnSend")?.addEventListener("click", submitAnswer);
  document.getElementById("btnMic")?.addEventListener("click", toggleMic);
  document.getElementById("btnRepeat")?.addEventListener("click", repeatQuestion);
  document.getElementById("btnSkipQ")?.addEventListener("click", skipQuestion);
  document.getElementById("btnPause")?.addEventListener("click", togglePause);
  document.getElementById("btnStartInterview")?.addEventListener("click", () => startInterview(false));
  document.getElementById("answerInput")?.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); submitAnswer(); }
  });
}

function renderQuestion() {
  const q = STATE.questions[STATE.currentQ];
  if (!q) return;

  const total = STATE.questions.length;
  const current = STATE.currentQ + 1;

  document.getElementById("questionText").textContent = q.displayText || q.text;
  document.getElementById("questionType").textContent = (q.type || "").toUpperCase();
  document.getElementById("progressText").textContent = `Question ${current} of ${total}`;
  document.getElementById("progressBar").style.width = `${(current / total) * 100}%`;
  document.getElementById("answerInput").value = "";
  document.getElementById("answerInput").disabled = false;
  document.getElementById("liveBadge").style.display = "none";
  // Update avatar state back to idle between questions
  if (STATE.avatar) STATE.avatar.setState("idle");
}

function askCurrentQuestion() {
  const q = STATE.questions[STATE.currentQ];
  if (!q || STATE.paused) return;
  STATE.avatar.setState("speaking");
  STATE.speech.speak(q.displayText || q.text, null, () => {
    STATE.avatar.setState("listening");
  });
}

function repeatQuestion() {
  STATE.speech.stopSpeaking();
  askCurrentQuestion();
}

function skipQuestion() {
  STATE.answers[STATE.currentQ] = "";
  nextQuestion();
}

function togglePause() {
  STATE.paused = !STATE.paused;
  const btn = document.getElementById("btnPause");
  if (STATE.paused) {
    STATE.speech.stopSpeaking();
    STATE.avatar.setState("idle");
    clearInterval(STATE.timerInterval);
    btn.textContent = "▶ Resume";
    btn.classList.add("paused");
  } else {
    startTimer();
    btn.textContent = "⏸ Pause";
    btn.classList.remove("paused");
    askCurrentQuestion();
  }
}

function toggleMic() {
  if (STATE.speech.isListening) {
    STATE.speech.stopListening();
    STATE.avatar.setState("idle");
    document.getElementById("btnMic").classList.remove("mic-active");
    return;
  }
  STATE.speech.stopSpeaking();
  STATE.avatar.setState("listening");
  document.getElementById("btnMic").classList.add("mic-active");
  showToast("Listening... speak your answer.", "info");

  STATE.speech.startListening(
    (transcript) => {
      document.getElementById("answerInput").value = transcript;
      document.getElementById("btnMic").classList.remove("mic-active");
      STATE.avatar.setState("idle");
    },
    (err) => {
      showToast(err, "error");
      document.getElementById("btnMic").classList.remove("mic-active");
      STATE.avatar.setState("idle");
    }
  );
}

function submitAnswer() {
  const answer = document.getElementById("answerInput").value.trim();
  if (!answer) { showToast("Please type or speak your answer first.", "error"); return; }

  STATE.answers[STATE.currentQ] = answer;
  document.getElementById("answerInput").disabled = true;

  // Score live
  STATE.avatar.setState("thinking");
  const q = STATE.questions[STATE.currentQ];
  const scored = scoreAnswer(answer, q, STATE.resume);
  STATE.scores[STATE.currentQ] = scored;

  // Show live badge
  const badge = document.getElementById("liveBadge");
  badge.textContent = `Score: ${scored.total}/100`;
  badge.style.background = scored.total >= 70 ? "#D1FAE5" : scored.total >= 50 ? "#FEF3C7" : "#FEE2E2";
  badge.style.color = scored.total >= 70 ? "#065F46" : scored.total >= 50 ? "#92400E" : "#991B1B";
  badge.style.display = "inline-block";

  // Brief feedback spoken
  const shortFeedback = scored.total >= 70 ? "Great answer!" : scored.total >= 50 ? "Good effort." : "Let's move on.";
  STATE.avatar.setState("speaking");
  STATE.speech.speak(shortFeedback, null, () => {
    STATE.avatar.setState("idle");
    setTimeout(() => nextQuestion(), 600);
  });
}

function nextQuestion() {
  STATE.currentQ++;
  if (STATE.currentQ >= STATE.questions.length) {
    finishInterview();
  } else {
    renderQuestion();
    setTimeout(() => askCurrentQuestion(), 500);
  }
}

function finishInterview() {
  clearInterval(STATE.timerInterval);
  STATE.avatar.setState("speaking");

  const report = computeFinalReport(STATE.answers, STATE.questions, STATE.resume);
  localStorage.setItem("interviewAI_lastReport", JSON.stringify({ ...report, candidateName: STATE.candidate.name, role: STATE.candidate.role }));

  const verdict = report.decision === "SELECTED"
    ? `Congratulations ${STATE.candidate.name}! You performed excellently. You are selected!`
    : report.decision === "ON HOLD / SECOND ROUND"
    ? `Thank you ${STATE.candidate.name}. You showed good potential. We'll be in touch for a second round.`
    : `Thank you ${STATE.candidate.name} for your time. Keep practicing and apply again soon.`;

  STATE.speech.speak(verdict, null, () => {
    STATE.avatar.setState("idle");
  });

  showScreen("report");
  renderReport(report, STATE.candidate.name, STATE.candidate.role, "reportContainer");
}

// ── Timer ──────────────────────────────────────────────────────────────────
function startTimer() {
  clearInterval(STATE.timerInterval);
  STATE.timerInterval = setInterval(() => {
    STATE.timerSeconds++;
    const m = String(Math.floor(STATE.timerSeconds / 60)).padStart(2, "0");
    const s = String(STATE.timerSeconds % 60).padStart(2, "0");
    const el = document.getElementById("timerDisplay");
    if (el) el.textContent = `${m}:${s}`;
  }, 1000);
}

// ── Restart ────────────────────────────────────────────────────────────────
function restartInterview(repeat) {
  STATE.timerSeconds = 0;
  STATE.currentQ = 0;
  STATE.answers = [];
  STATE.scores = [];
  startInterview(repeat);
}

// ── Toast notifications ────────────────────────────────────────────────────
function showToast(msg, type = "info") {
  const container = document.getElementById("toastContainer");
  if (!container) return;
  const toast = document.createElement("div");
  toast.className = `toast toast-${type}`;
  toast.textContent = msg;
  container.appendChild(toast);
  setTimeout(() => toast.classList.add("show"), 10);
  setTimeout(() => { toast.classList.remove("show"); setTimeout(() => toast.remove(), 300); }, 3500);
}
