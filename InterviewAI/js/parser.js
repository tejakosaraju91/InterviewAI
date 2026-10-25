// parser.js — Resume parser for InterviewAI

const SKILLS_DICT = [
  "Python","Java","C++","C","C#","JavaScript","TypeScript","Go","Rust","Swift","Kotlin","PHP","Ruby","Scala","R",
  "HTML","CSS","React","ReactJS","Angular","Vue","VueJS","Node","NodeJS","Express","Django","Flask","FastAPI","Spring","SpringBoot",
  "SQL","MySQL","PostgreSQL","SQLite","MongoDB","Redis","Firebase","DynamoDB","Cassandra","Oracle",
  "Machine Learning","Deep Learning","NLP","Computer Vision","TensorFlow","PyTorch","Keras","Scikit-learn","OpenCV","Pandas","NumPy","Matplotlib","Seaborn",
  "AWS","Azure","GCP","Docker","Kubernetes","Terraform","Jenkins","CI/CD","Git","GitHub","GitLab","Linux","Bash","Shell",
  "Excel","Power BI","Tableau","MATLAB","Hadoop","Spark","Kafka","Airflow",
  "REST","GraphQL","API","Microservices","Agile","Scrum","JIRA","Figma","Photoshop",
  "IoT","Raspberry Pi","Arduino","Embedded","VHDL","Verilog",
  "Blockchain","Solidity","Web3","Unity","Unreal","OpenGL","Selenium","Cypress","Jest","JUnit","Pytest"
];

const EDUCATION_KEYWORDS = [
  "B.Tech","B.E","B.Sc","M.Tech","M.Sc","MBA","BCA","MCA","B.Com","M.Com","PhD","Bachelor","Master","Diploma",
  "Computer Science","Information Technology","Electronics","Electrical","Mechanical","Civil","Chemical","Biotechnology",
  "Data Science","Artificial Intelligence","Software Engineering","Mathematics","Physics","Statistics"
];

const CERT_KEYWORDS = [
  "AWS Certified","Google Cloud","Azure","Coursera","Udemy","edX","NPTEL","HackerRank","LeetCode","Certified","Certification",
  "Oracle Certified","Microsoft Certified","Cisco","CompTIA","PMP","Scrum Master","TensorFlow Developer","Deep Learning Specialization"
];

const INTERNSHIP_KEYWORDS = ["intern","internship","trainee","apprentice","summer project","industrial training"];

const PROJECT_STOP_WORDS = new Set(["the","a","an","and","or","in","on","at","to","for","of","with","using","based","project","system","application","app","platform","tool","website","web"]);

function parseResume(text) {
  const lines = text.split(/\n/).map(l => l.trim()).filter(Boolean);
  const fullText = text.toLowerCase();

  const name = extractName(lines);
  const skills = extractSkills(text);
  const education = extractEducation(text);
  const projects = extractProjects(lines);
  const internships = extractInternships(lines);
  const certifications = extractCertifications(text);

  return { name, skills, education, projects, internships, certifications, rawText: text };
}

function extractName(lines) {
  // First non-empty line that looks like a name (2-4 words, no special chars, not a keyword)
  const skipWords = /^(resume|curriculum|vitae|cv|profile|contact|email|phone|address|objective|summary)/i;
  for (const line of lines.slice(0, 5)) {
    const words = line.split(/\s+/);
    if (words.length >= 2 && words.length <= 4 && !skipWords.test(line) && /^[A-Za-z\s.]+$/.test(line)) {
      return line;
    }
  }
  return "";
}

function extractSkills(text) {
  const found = [];
  const lower = text.toLowerCase();
  for (const skill of SKILLS_DICT) {
    const pattern = new RegExp("\\b" + skill.replace(/[+.]/g, "\\$&").toLowerCase() + "\\b");
    if (pattern.test(lower) && !found.includes(skill)) {
      found.push(skill);
    }
  }
  return found;
}

function extractEducation(text) {
  const found = [];
  const lower = text.toLowerCase();
  for (const kw of EDUCATION_KEYWORDS) {
    if (lower.includes(kw.toLowerCase()) && !found.includes(kw)) {
      found.push(kw);
    }
  }
  return found;
}

function extractProjects(lines) {
  const projects = [];
  let inProjects = false;
  const projectHeaderRe = /^(projects?|personal projects?|academic projects?|key projects?)\s*:?\s*$/i;
  const stopHeaderRe = /^(experience|education|skills|certifications?|internship|work|employment|contact|summary|objective|achievements?)\s*:?\s*$/i;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (projectHeaderRe.test(line)) { inProjects = true; continue; }
    if (stopHeaderRe.test(line) && inProjects) { inProjects = false; continue; }
    if (inProjects && line.length > 5 && line.length < 80) {
      const cleaned = line.replace(/^[-•*▪►]\s*/, "").replace(/\s*[:\-|].*$/, "").trim();
      if (cleaned.length > 3 && !PROJECT_STOP_WORDS.has(cleaned.toLowerCase())) {
        projects.push(cleaned);
      }
    }
  }

  // Fallback: look for "Project:" or "Project Name:" patterns
  if (projects.length === 0) {
    const re = /(?:project\s*(?:name|title)?\s*[:\-]\s*)([^\n]{3,60})/gi;
    let m;
    while ((m = re.exec(lines.join("\n"))) !== null) {
      const p = m[1].trim();
      if (!projects.includes(p)) projects.push(p);
    }
  }
  return projects.slice(0, 5);
}

function extractInternships(lines) {
  const internships = [];
  for (const line of lines) {
    const lower = line.toLowerCase();
    if (INTERNSHIP_KEYWORDS.some(kw => lower.includes(kw))) {
      // Try to extract company name
      const companyMatch = line.match(/(?:at|@|with|in)\s+([A-Z][A-Za-z\s&.]{2,30})/);
      if (companyMatch) {
        internships.push(companyMatch[1].trim());
      } else {
        // Use the line itself, cleaned
        const cleaned = line.replace(/intern(ship)?/i, "").replace(/[:\-|]/g, "").trim();
        if (cleaned.length > 2) internships.push(cleaned.slice(0, 40));
      }
    }
  }
  return [...new Set(internships)].slice(0, 3);
}

function extractCertifications(text) {
  const found = [];
  const lower = text.toLowerCase();
  for (const kw of CERT_KEYWORDS) {
    if (lower.includes(kw.toLowerCase()) && !found.includes(kw)) {
      found.push(kw);
    }
  }
  return found.slice(0, 5);
}

// PDF parsing via pdf.js
async function parsePDF(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const typedArray = new Uint8Array(e.target.result);
        const pdf = await pdfjsLib.getDocument({ data: typedArray }).promise;
        let text = "";
        for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i);
          const content = await page.getTextContent();
          text += content.items.map(item => item.str).join(" ") + "\n";
        }
        resolve(parseResume(text));
      } catch (err) { reject(err); }
    };
    reader.readAsArrayBuffer(file);
  });
}

// DOCX parsing via mammoth.js
async function parseDOCX(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const result = await mammoth.extractRawText({ arrayBuffer: e.target.result });
        resolve(parseResume(result.value));
      } catch (err) { reject(err); }
    };
    reader.readAsArrayBuffer(file);
  });
}

// Plain text
async function parseTXT(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => resolve(parseResume(e.target.result));
    reader.onerror = reject;
    reader.readAsText(file);
  });
}

async function parseResumeFile(file) {
  const ext = file.name.split(".").pop().toLowerCase();
  if (ext === "pdf") return parsePDF(file);
  if (ext === "docx") return parseDOCX(file);
  if (ext === "txt") return parseTXT(file);
  throw new Error("Unsupported file type. Please upload PDF, DOCX, or TXT.");
}
