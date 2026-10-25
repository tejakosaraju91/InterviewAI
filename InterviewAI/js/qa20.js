// qa20.js — Resume to 20 Questions & Answers generator

const QA20_CATEGORIES = { HR: "HR / Introduction", RESUME: "Resume-Based", TECHNICAL: "Technical", BEHAVIORAL: "Behavioral", SITUATIONAL: "Situational" };

// ── Technical answer templates per topic ──────────────────────────────────
const TECH_QA = {
  python: [
    { q: "What is Python and why do you prefer it for your projects?", a: "Python is a high-level, interpreted programming language known for its clean syntax and vast ecosystem. I prefer it because it lets me build solutions quickly — from data pipelines using Pandas and NumPy to web APIs with Flask or FastAPI. Its readability makes collaboration easier, and the rich library support means I rarely need to build things from scratch. In my projects, Python has been my go-to for both scripting and building production-ready applications.", tips: ["Mention specific libraries you've used", "Connect your answer to a real project outcome"] },
    { q: "Explain the difference between lists and tuples in Python.", a: "Lists are mutable, ordered collections that can be changed after creation, while tuples are immutable. I use lists when I need to modify data — like appending results during iteration — and tuples for fixed data like coordinates or configuration constants. Tuples are slightly faster and can be used as dictionary keys. In my projects, I've used tuples to return multiple values from functions and lists to accumulate processed records in data pipelines.", tips: ["Give a concrete use case for each", "Mention performance implications"] },
    { q: "How have you used Python for data analysis or automation?", a: "I've used Python extensively for data analysis using Pandas for data manipulation and Matplotlib or Seaborn for visualization. For automation, I've written scripts to clean datasets, schedule tasks, and process files in bulk. In one project, I automated a report generation pipeline that reduced manual effort by several hours per week. I also used NumPy for numerical computations and Scikit-learn for building predictive models.", tips: ["Quantify the impact where possible", "Name the specific libraries used"] }
  ],
  javascript: [
    { q: "What is the difference between synchronous and asynchronous JavaScript?", a: "Synchronous JavaScript executes line by line, blocking further execution until each operation completes. Asynchronous JavaScript, using callbacks, Promises, or async/await, allows operations like API calls or file reads to run without blocking the main thread. I've used async/await extensively in my projects to fetch data from REST APIs and handle multiple concurrent operations cleanly. This keeps the UI responsive and the code readable compared to deeply nested callbacks.", tips: ["Use async/await as your preferred example", "Mention a real scenario where async improved your app"] },
    { q: "Explain how you have used JavaScript in your projects.", a: "I've used JavaScript to build interactive front-end features, handle DOM manipulation, and integrate REST APIs. In my projects, I used vanilla JavaScript for dynamic UI updates and event handling, and frameworks like React for component-based architecture. I also used Node.js for building backend services. JavaScript's versatility across both client and server sides made it central to my full-stack development work.", tips: ["Mention both frontend and backend if applicable", "Reference a specific feature you built"] }
  ],
  react: [
    { q: "What are React components and how do you manage state?", a: "React components are reusable UI building blocks — either functional or class-based. I primarily use functional components with hooks. For state management, I use useState for local component state and useContext or Redux for shared global state. In my projects, I built a dashboard with multiple components sharing data through context, which kept the codebase modular and easy to maintain. I also used useEffect to handle side effects like API calls on component mount.", tips: ["Prefer functional components and hooks in your answer", "Mention a real component you built"] }
  ],
  java: [
    { q: "Explain OOP principles you have applied in Java projects.", a: "I've applied all four OOP principles in my Java projects. Encapsulation by keeping class fields private with public getters/setters. Inheritance to extend base classes and reuse logic. Polymorphism through method overriding to handle different object types uniformly. Abstraction using interfaces and abstract classes to define contracts. In a project, I designed a class hierarchy for different user roles, which made adding new roles straightforward without modifying existing code.", tips: ["Give one concrete example per principle", "Mention design patterns if you've used them"] }
  ],
  sql: [
    { q: "How have you used SQL in your projects?", a: "I've used SQL to design relational schemas, write complex queries with JOINs, aggregations, and subqueries, and optimize slow queries using indexes. In one project, I built a reporting module that queried a MySQL database with multi-table JOINs to generate analytics dashboards. I also wrote stored procedures for batch operations and used EXPLAIN to identify and fix performance bottlenecks, reducing query time significantly.", tips: ["Mention query optimization experience", "Reference a specific database system you used"] }
  ],
  ml: [
    { q: "Describe a machine learning project you have worked on.", a: "I built a classification model to predict outcomes using Scikit-learn. I started with exploratory data analysis using Pandas and Seaborn, then preprocessed the data — handling missing values, encoding categoricals, and scaling features. I trained multiple models including Random Forest and Logistic Regression, evaluated them using cross-validation and F1-score, and selected the best performer. I also used feature importance to interpret the model and documented the pipeline for reproducibility.", tips: ["Always mention the full ML pipeline", "Include evaluation metrics you used"] },
    { q: "What is the difference between overfitting and underfitting?", a: "Overfitting occurs when a model learns the training data too well, including noise, and performs poorly on unseen data — high variance. Underfitting happens when the model is too simple to capture the underlying pattern — high bias. I've addressed overfitting using regularization, dropout in neural networks, and cross-validation. For underfitting, I increased model complexity or added more relevant features. Monitoring train vs. validation loss curves helped me detect both issues early in my projects.", tips: ["Mention specific techniques you used to fix each", "Reference the bias-variance tradeoff"] }
  ],
  webdev: [
    { q: "Explain the difference between HTTP and HTTPS and why it matters.", a: "HTTP transfers data in plain text, making it vulnerable to interception. HTTPS encrypts communication using TLS/SSL, ensuring data integrity and confidentiality. In my web projects, I always configured HTTPS using SSL certificates and enforced secure headers. This is critical for protecting user credentials and sensitive data. I also understand how HTTPS affects SEO rankings and browser trust indicators, which reinforces its importance beyond just security.", tips: ["Mention TLS/SSL certificates", "Connect to a real project where you implemented HTTPS"] }
  ],
  general: [
    { q: "What is version control and how do you use Git in your workflow?", a: "Version control tracks changes to code over time, enabling collaboration and rollback. I use Git daily — creating feature branches for new work, committing with descriptive messages, and merging via pull requests after code review. In team projects, I followed GitFlow with main, develop, and feature branches. I've resolved merge conflicts, used git rebase to keep history clean, and set up GitHub Actions for CI/CD pipelines. Git has been essential for maintaining code quality and team coordination.", tips: ["Mention branching strategy you follow", "Reference CI/CD if you've used it"] },
    { q: "How do you approach debugging a complex issue in your code?", a: "I follow a systematic approach: first reproduce the issue consistently, then isolate the failing component using logs or a debugger. I form a hypothesis about the root cause, test it with targeted changes, and verify the fix doesn't break other functionality. I use browser DevTools for frontend issues, print statements or pdb for Python, and logging frameworks for production systems. I also write a regression test after fixing to prevent recurrence.", tips: ["Show structured thinking, not random trial and error", "Mention tools like DevTools, pdb, or logging"] }
  ]
};

// ── HR / Intro answers ────────────────────────────────────────────────────
function buildHRAnswers(resume, role, name) {
  const skillList = resume.skills.slice(0, 5).join(", ") || "various technologies";
  const edu = resume.education[0] || "my academic background";
  const proj = resume.projects[0] || "several projects";
  const intern = resume.internships[0] || null;

  return [
    {
      category: "HR / Introduction",
      question: "Tell me about yourself.",
      bestAnswer: `I'm ${name || "a motivated professional"} with a background in ${edu}. I have hands-on experience with ${skillList}. ${intern ? `I completed an internship at ${intern}, where I gained real-world exposure to industry practices.` : `I've worked on ${proj} which strengthened my practical skills.`} I'm passionate about ${role} and I'm looking for an opportunity to contribute meaningfully while continuing to grow technically and professionally.`,
      tips: ["Keep it under 90 seconds when spoken", "Always end with why you're excited about this role"]
    },
    {
      category: "HR / Introduction",
      question: `Why do you want to work as a ${role}?`,
      bestAnswer: `I've been building skills aligned with ${role} through my projects and ${intern ? `internship at ${intern}` : "academic work"}. I enjoy the problem-solving aspect of this field and have developed proficiency in ${skillList}. This role excites me because it directly matches my technical strengths and gives me the opportunity to work on real-world challenges. I'm eager to bring my experience with ${resume.skills[0] || "technology"} and grow further in a professional environment.`,
      tips: ["Research the company and mention something specific", "Connect your skills directly to the role requirements"]
    }
  ];
}

// ── Resume-based answers ──────────────────────────────────────────────────
function buildResumeAnswers(resume, role) {
  const answers = [];
  const skills = resume.skills;
  const projects = resume.projects;
  const internships = resume.internships;
  const certs = resume.certifications;
  const edu = resume.education;

  // Up to 3 skill questions
  skills.slice(0, 3).forEach(skill => {
    answers.push({
      category: "Resume-Based",
      question: `You have listed ${skill} on your resume. Describe a specific project or task where you used it.`,
      bestAnswer: `I used ${skill} in ${projects[0] ? `my project "${projects[0]}"` : "one of my key projects"} where I applied it to solve a real problem. I started by understanding the requirements, then implemented the solution using ${skill}'s core features. The outcome was a working, tested component that contributed to the overall project goal. This experience deepened my understanding of ${skill} beyond theory and gave me confidence to use it in production scenarios.`,
      tips: [`Be specific — name the project and what you built with ${skill}`, "Mention any challenges you overcame"]
    });
  });

  // Up to 2 project questions
  projects.slice(0, 2).forEach(proj => {
    answers.push({
      category: "Resume-Based",
      question: `Tell me about your project "${proj}". What was your role and what did you achieve?`,
      bestAnswer: `In the "${proj}" project, I was responsible for designing and implementing core features. I used ${skills.slice(0, 3).join(", ") || "relevant technologies"} to build the solution. The main challenge was ensuring the system worked reliably under different conditions, which I addressed through careful testing and iteration. The project resulted in a functional product that demonstrated my ability to take ownership from planning to delivery. It also strengthened my skills in problem-solving and technical documentation.`,
      tips: ["Use numbers or metrics if possible (e.g., reduced load time by 30%)", "Mention your specific contribution, not just the team's work"]
    });
  });

  // Internship question
  if (internships.length > 0) {
    answers.push({
      category: "Resume-Based",
      question: `What did you learn during your internship at ${internships[0]}?`,
      bestAnswer: `During my internship at ${internships[0]}, I worked on real projects alongside experienced professionals. I applied my knowledge of ${skills.slice(0, 2).join(" and ") || "technical skills"} in a production environment for the first time. I learned how to follow professional workflows including code reviews, version control practices, and agile sprints. The experience bridged the gap between academic knowledge and industry expectations, and I returned with both technical skills and a better understanding of workplace collaboration.`,
      tips: ["Mention a specific task or project from the internship", "Show what you learned beyond technical skills"]
    });
  }

  // Certification question
  if (certs.length > 0) {
    answers.push({
      category: "Resume-Based",
      question: `You have a certification in ${certs[0]}. How have you applied that knowledge?`,
      bestAnswer: `After earning my ${certs[0]} certification, I immediately applied the concepts in my projects. The certification gave me a structured understanding of the subject and validated my skills. I used the knowledge to improve how I approached problems — for example, applying best practices I learned to optimize my code and workflows. It also gave me confidence when discussing these topics in technical interviews and team settings.`,
      tips: ["Mention a specific concept from the certification you applied", "Show that you went beyond just passing the exam"]
    });
  }

  // Education question
  if (edu.length > 0 && answers.length < 8) {
    answers.push({
      category: "Resume-Based",
      question: `How has your education in ${edu[0]} prepared you for this role?`,
      bestAnswer: `My education in ${edu[0]} gave me a strong theoretical foundation in core concepts that are directly applicable to this role. Through coursework and academic projects, I developed skills in ${skills.slice(0, 3).join(", ") || "relevant areas"}. I also worked on team projects that simulated real-world scenarios, which taught me how to collaborate, manage deadlines, and deliver results. My academic background has prepared me to learn quickly and apply structured thinking to complex problems.`,
      tips: ["Mention specific courses or projects from your degree", "Connect academic learning to practical application"]
    });
  }

  return answers.slice(0, 8);
}

// ── Behavioral answers (STAR format) ─────────────────────────────────────
function buildBehavioralAnswers(resume, role) {
  const skill = resume.skills[0] || "technology";
  const proj = resume.projects[0] || "a key project";
  const intern = resume.internships[0] || null;

  return [
    {
      category: "Behavioral",
      question: "Tell me about a time you faced a difficult technical challenge. How did you handle it?",
      bestAnswer: `Situation: While working on "${proj}", I encountered a critical issue where the system was not performing as expected under load. Task: I was responsible for diagnosing and fixing the problem before the deadline. Action: I systematically debugged the issue using logs and profiling tools, identified the bottleneck, and refactored the relevant code using ${skill}. I also wrote tests to verify the fix. Result: The system performed correctly, the deadline was met, and I documented the solution to prevent similar issues in the future.`,
      tips: ["Always follow the STAR structure: Situation, Task, Action, Result", "Be specific about what YOU did, not the team"]
    },
    {
      category: "Behavioral",
      question: "Describe a situation where you had to work under pressure to meet a deadline.",
      bestAnswer: `Situation: ${intern ? `During my internship at ${intern}` : `During the "${proj}" project`}, we had a tight deadline with multiple deliverables due simultaneously. Task: I needed to complete my assigned module without compromising quality. Action: I prioritized tasks by impact, broke the work into smaller milestones, and communicated progress regularly. I stayed focused, avoided distractions, and asked for help when blocked. Result: I delivered my module on time, and the overall project was completed successfully. This experience taught me the value of planning and clear communication under pressure.`,
      tips: ["Show that you stayed calm and organized", "Mention what you learned from the experience"]
    },
    {
      category: "Behavioral",
      question: "Give an example of when you took initiative or showed leadership.",
      bestAnswer: `Situation: During a group project, I noticed that our team lacked a clear plan and was duplicating work. Task: Although I wasn't the designated leader, I felt responsible for improving the situation. Action: I organized a brief planning session, proposed a task breakdown using a shared tracker, and volunteered to handle the most complex component involving ${skill}. I also set up a communication channel for daily updates. Result: The team became more coordinated, we finished ahead of schedule, and my teammates appreciated the structure I introduced.`,
      tips: ["Leadership doesn't require a title — show initiative", "Focus on the positive outcome and team impact"]
    }
  ];
}

// ── Situational answers ───────────────────────────────────────────────────
function buildSituationalAnswers(resume, role) {
  const skill = resume.skills[0] || "my technical skills";
  return [
    {
      category: "Situational",
      question: "If you were assigned a project with unclear requirements, how would you proceed?",
      bestAnswer: `I would start by scheduling a meeting with the stakeholders to clarify the goals, constraints, and expected outcomes. I'd prepare specific questions in advance to make the session efficient. Once I have clarity, I'd document the requirements and get sign-off before starting development. I'd also propose a phased approach — delivering a small prototype first to validate understanding. Throughout the project, I'd maintain regular check-ins to catch any scope changes early. This approach minimizes rework and ensures the final product meets actual needs.`,
      tips: ["Show proactive communication skills", "Mention documentation and stakeholder alignment"]
    },
    {
      category: "Situational",
      question: `If you discovered a critical bug just before a product release, what would you do?`,
      bestAnswer: `I would immediately report the bug to the team lead and relevant stakeholders with a clear description of the issue, its severity, and potential impact. I'd assess whether it can be fixed quickly or requires a release delay. If fixable, I'd work on it urgently, write a targeted test, and get a fast code review. If not, I'd recommend a rollback or a hotfix plan post-release. I believe transparency and quick communication are critical in such situations — hiding the issue would only make things worse.`,
      tips: ["Show accountability and calm decision-making", "Emphasize communication with the team, not solo heroics"]
    }
  ];
}

// ── Technical answers based on detected skills ────────────────────────────
function buildTechnicalAnswers(resume, role, count) {
  const skills = resume.skills.map(s => s.toLowerCase());
  const collected = [];
  const topicOrder = [];

  if (skills.some(s => ["python","django","flask","fastapi","pandas","numpy"].includes(s))) topicOrder.push("python");
  if (skills.some(s => ["javascript","js","node","nodejs","typescript"].includes(s))) topicOrder.push("javascript");
  if (skills.some(s => ["react","reactjs","redux","vue","angular"].includes(s))) topicOrder.push("react");
  if (skills.some(s => ["java","spring","springboot"].includes(s))) topicOrder.push("java");
  if (skills.some(s => ["sql","mysql","postgresql","sqlite","oracle"].includes(s))) topicOrder.push("sql");
  if (skills.some(s => ["machine learning","ml","deep learning","tensorflow","pytorch","scikit"].includes(s))) topicOrder.push("ml");
  if (skills.some(s => ["html","css","web","http","rest","api"].includes(s))) topicOrder.push("webdev");
  topicOrder.push("general");

  const seen = new Set();
  for (const topic of topicOrder) {
    const pool = TECH_QA[topic] || [];
    for (const item of pool) {
      if (!seen.has(item.q)) {
        seen.add(item.q);
        collected.push({ category: "Technical", question: item.q, bestAnswer: item.a, tips: item.tips });
        if (collected.length >= count) break;
      }
    }
    if (collected.length >= count) break;
  }

  // Fallback from general
  if (collected.length < count) {
    for (const item of TECH_QA.general) {
      if (!seen.has(item.q)) {
        seen.add(item.q);
        collected.push({ category: "Technical", question: item.q, bestAnswer: item.a, tips: item.tips });
        if (collected.length >= count) break;
      }
    }
  }

  return collected.slice(0, count);
}

// ── Main generator ────────────────────────────────────────────────────────
function generate20QA(resume, role, name) {
  const result = [];

  // 2 HR
  const hr = buildHRAnswers(resume, role, name);
  hr.forEach(q => result.push(q));

  // 8 Resume-based
  const resumeQs = buildResumeAnswers(resume, role);
  resumeQs.forEach(q => result.push(q));

  // Pad resume section to reach 10 total if fewer than 8 resume Qs
  const resumePad = 10 - result.length;
  if (resumePad > 0) {
    const extra = buildTechnicalAnswers(resume, role, resumePad);
    extra.forEach(q => result.push(q));
  }

  // 5 Technical
  const techQs = buildTechnicalAnswers(resume, role, 5);
  techQs.forEach(q => result.push(q));

  // 3 Behavioral
  const behQs = buildBehavioralAnswers(resume, role);
  behQs.forEach(q => result.push(q));

  // 2 Situational
  const sitQs = buildSituationalAnswers(resume, role);
  sitQs.forEach(q => result.push(q));

  // Ensure exactly 20, deduplicate by question text
  const seen = new Set();
  const deduped = [];
  for (const item of result) {
    if (!seen.has(item.question)) {
      seen.add(item.question);
      deduped.push(item);
    }
  }

  // If still under 20, pad with general tech
  if (deduped.length < 20) {
    const extra = buildTechnicalAnswers(resume, role, 20 - deduped.length);
    extra.forEach(q => {
      if (!seen.has(q.question)) { seen.add(q.question); deduped.push(q); }
    });
  }

  return deduped.slice(0, 20).map((item, i) => ({ ...item, number: i + 1 }));
}

// ── Render ────────────────────────────────────────────────────────────────
function renderQA20(items, lang) {
  const container = document.getElementById("qa20Results");
  if (!container) return;

  const categories = [...new Set(items.map(i => i.category))];
  let html = "";

  categories.forEach(cat => {
    const catItems = items.filter(i => i.category === cat);
    const catIcon = { "HR / Introduction": "👋", "Resume-Based": "📄", "Technical": "⚙️", "Behavioral": "🧠", "Situational": "💡" }[cat] || "❓";
    html += `<div class="qa20-category-header">${catIcon} ${cat}</div>`;
    catItems.forEach(item => {
      html += `
        <div class="qa20-card" id="qa20-card-${item.number}">
          <div class="qa20-card-header" onclick="toggleQA20Card(${item.number})">
            <div class="qa20-num-badge">${item.number}</div>
            <div class="qa20-question">${item.question}</div>
            <div class="qa20-chevron" id="qa20-chev-${item.number}">▼</div>
          </div>
          <div class="qa20-card-body" id="qa20-body-${item.number}" style="display:none">
            <div class="qa20-answer-label">💬 Best Answer</div>
            <div class="qa20-answer-text">${item.bestAnswer}</div>
            <div class="qa20-tips-label">💡 Tips</div>
            <ul class="qa20-tips-list">
              ${item.tips.map(t => `<li>${t}</li>`).join("")}
            </ul>
            <div class="qa20-card-actions">
              <button class="btn-qa-listen" onclick="listenQA20(${item.number})" title="Listen">🔊 Listen</button>
              <button class="btn-qa-copy" onclick="copyQA20Item(${item.number})" title="Copy">📋 Copy</button>
            </div>
          </div>
        </div>`;
    });
  });

  container.innerHTML = html;
}

function toggleQA20Card(num) {
  const body = document.getElementById("qa20-body-" + num);
  const chev = document.getElementById("qa20-chev-" + num);
  if (!body) return;
  const open = body.style.display !== "none";
  body.style.display = open ? "none" : "block";
  if (chev) chev.textContent = open ? "▼" : "▲";
}

function copyQA20Item(num) {
  const item = (window._qa20Data || []).find(i => i.number === num);
  if (!item) return;
  const text = `Q${num}: ${item.question}\n\nBest Answer:\n${item.bestAnswer}\n\nTips:\n${item.tips.map((t, i) => `${i + 1}. ${t}`).join("\n")}`;
  navigator.clipboard.writeText(text).then(() => showToast("Copied to clipboard!", "success")).catch(() => showToast("Copy failed.", "error"));
}

function listenQA20(num) {
  const item = (window._qa20Data || []).find(i => i.number === num);
  if (!item || !STATE.speech) return;
  STATE.speech.stopSpeaking();
  STATE.speech.speak(`Question ${num}: ${item.question}. Best Answer: ${item.bestAnswer}`);
}

function copyAllQA20() {
  const data = window._qa20Data || [];
  if (!data.length) return;
  const text = data.map(item =>
    `Q${item.number} [${item.category}]: ${item.question}\n\nBest Answer:\n${item.bestAnswer}\n\nTips:\n${item.tips.map((t, i) => `${i + 1}. ${t}`).join("\n")}\n\n${"─".repeat(60)}`
  ).join("\n\n");
  navigator.clipboard.writeText(text).then(() => showToast("All 20 Q&As copied!", "success")).catch(() => showToast("Copy failed.", "error"));
}

function downloadQA20PDF() {
  // Expand all cards before printing so answers are visible
  const bodies = document.querySelectorAll(".qa20-card-body");
  const chevrons = document.querySelectorAll(".qa20-chevron");
  bodies.forEach(b => b.style.display = "block");
  chevrons.forEach(c => c.textContent = "▲");

  // Show only QA20 screen
  document.querySelectorAll(".screen").forEach(s => {
    s.dataset.wasActive = s.classList.contains("active") ? "1" : "0";
    s.classList.remove("active");
  });
  document.getElementById("screen-qa20").classList.add("active");

  window.print();

  // Restore screens
  document.querySelectorAll(".screen").forEach(s => {
    if (s.dataset.wasActive === "1") s.classList.add("active");
  });
}

function regenerateQA20() {
  const resume = window._qa20Resume;
  const role = document.getElementById("qa20Role")?.value?.trim() || "Software Engineer";
  const name = document.getElementById("qa20Name")?.value?.trim() || "";
  if (!resume) { showToast("Please upload a resume first.", "error"); return; }
  runQA20Generation(resume, role, name);
}

function runQA20Generation(resume, role, name) {
  document.getElementById("qa20GenerateBtn").disabled = true;
  document.getElementById("qa20GenerateBtn").textContent = "Generating…";
  document.getElementById("qa20ResultsSection").style.display = "none";

  setTimeout(() => {
    try {
      const items = generate20QA(resume, role, name);
      window._qa20Data = items;
      document.getElementById("qa20ResultsSection").style.display = "block";
      renderQA20(items, STATE?.candidate?.lang || "en");
      document.getElementById("qa20ResultsSection").scrollIntoView({ behavior: "smooth" });
      showToast("20 Questions & Answers generated!", "success");
    } catch (e) {
      showToast("Generation failed: " + e.message, "error");
    }
    document.getElementById("qa20GenerateBtn").disabled = false;
    document.getElementById("qa20GenerateBtn").textContent = "✨ Generate 20 Questions & Answers";
  }, 600);
}

// ── Init QA20 screen ──────────────────────────────────────────────────────
function initQA20Screen() {
  const zone = document.getElementById("qa20DropZone");
  const fileInput = document.getElementById("qa20FileInput");
  if (!zone || !fileInput) return;

  zone.addEventListener("click", () => fileInput.click());
  zone.addEventListener("dragover", e => { e.preventDefault(); zone.classList.add("drag-over"); });
  zone.addEventListener("dragleave", () => zone.classList.remove("drag-over"));
  zone.addEventListener("drop", e => {
    e.preventDefault();
    zone.classList.remove("drag-over");
    if (e.dataTransfer.files[0]) handleQA20File(e.dataTransfer.files[0]);
  });
  fileInput.addEventListener("change", e => { if (e.target.files[0]) handleQA20File(e.target.files[0]); });

  document.getElementById("qa20GenerateBtn")?.addEventListener("click", () => {
    const resume = window._qa20Resume;
    const role = document.getElementById("qa20Role")?.value?.trim();
    const name = document.getElementById("qa20Name")?.value?.trim() || "";
    if (!resume) { showToast("Please upload a resume first.", "error"); return; }
    if (!role) { showToast("Please enter a target role.", "error"); return; }
    runQA20Generation(resume, role, name);
  });
}

async function handleQA20File(file) {
  const ext = file.name.split(".").pop().toLowerCase();
  if (!["pdf","docx","txt"].includes(ext)) { showToast("Unsupported file. Use PDF, DOCX, or TXT.", "error"); return; }
  showToast("Parsing resume…", "info");
  document.getElementById("qa20ParseLoader").style.display = "flex";
  try {
    const parsed = await parseResumeFile(file);
    window._qa20Resume = parsed;
    if (!document.getElementById("qa20Name").value && parsed.name) {
      document.getElementById("qa20Name").value = parsed.name;
    }
    document.getElementById("qa20ParseLoader").style.display = "none";
    document.getElementById("qa20DropZone").innerHTML = `<div class="drop-icon">✅</div><p><strong>${file.name}</strong> parsed successfully</p><p style="font-size:0.82rem;margin-top:4px">${parsed.skills.length} skills · ${parsed.projects.length} projects · ${parsed.internships.length} internships</p>`;
    showToast("Resume parsed!", "success");
  } catch (e) {
    document.getElementById("qa20ParseLoader").style.display = "none";
    showToast("Parse error: " + e.message, "error");
  }
}
