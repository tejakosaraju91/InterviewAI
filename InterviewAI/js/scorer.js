// scorer.js — Answer scoring engine for InterviewAI

const FILLER_WORDS = ["um","uh","like","you know","basically","literally","actually","so","well","kind of","sort of","i mean","right","okay","hmm"];
const STAR_WORDS = ["situation","task","action","result","challenge","solved","implemented","achieved","led","improved","delivered","outcome","impact","learned"];
const NEGATIVE_WORDS = ["don't know","no idea","never","not sure","cannot","can't","idk","nothing","none","skip","pass"];

// Deterministic scoring — same answer always gives same score
function scoreAnswer(answer, question, resumeData) {
  if (!answer || answer.trim().length === 0) {
    return { relevance: 0, technical: 0, clarity: 0, communication: 0, total: 0, feedback: "No answer provided." };
  }

  const ans = answer.trim().toLowerCase();
  const words = ans.split(/\s+/).filter(Boolean);
  const wordCount = words.length;

  // Heavy penalty for negative/skip responses
  if (NEGATIVE_WORDS.some(w => ans.includes(w)) && wordCount < 15) {
    return { relevance: 1, technical: 0, clarity: 1, communication: 1, total: 8, feedback: "Answer was too vague or indicated lack of knowledge." };
  }

  // 1. RELEVANCE (0-10): keyword overlap with expected + resume
  const relevance = scoreRelevance(ans, question, resumeData);

  // 2. TECHNICAL ACCURACY (0-10): presence of technical terms
  const technical = scoreTechnical(ans, question);

  // 3. CLARITY (0-10): length, structure, filler words
  const clarity = scoreClarity(ans, words, wordCount);

  // 4. COMMUNICATION (0-10): STAR structure, examples, fluency
  const communication = scoreCommunication(ans, words);

  // Weighted total: relevance 35%, technical 25%, clarity 20%, communication 20%
  const total = Math.round(relevance * 3.5 + technical * 2.5 + clarity * 2.0 + communication * 2.0);

  const feedback = generateFeedback(relevance, technical, clarity, communication, wordCount, question.type);

  return { relevance, technical, clarity, communication, total, feedback };
}

function scoreRelevance(ans, question, resumeData) {
  const expected = question.expectedKeywords || [];
  const resumeSkills = (resumeData?.skills || []).map(s => s.toLowerCase());
  const allKeywords = [...expected, ...resumeSkills];

  if (allKeywords.length === 0) return 5;

  let hits = 0;
  for (const kw of allKeywords) {
    if (ans.includes(kw.toLowerCase())) hits++;
  }

  const ratio = hits / Math.min(allKeywords.length, 8);
  let score = Math.round(ratio * 10);

  // Bonus for mentioning question topic words
  const qWords = (question.displayText || question.text || "").toLowerCase().split(/\s+/);
  const qHits = qWords.filter(w => w.length > 4 && ans.includes(w)).length;
  score = Math.min(10, score + Math.floor(qHits / 2));

  return Math.max(1, Math.min(10, score));
}

function scoreTechnical(ans, question) {
  if (question.type === "hr" || question.type === "behavioral" || question.type === "situational" || question.type === "intro") {
    return 7; // Not strictly technical, give neutral score
  }

  const techTerms = [
    "algorithm","complexity","function","class","object","method","variable","loop","array","list","dictionary",
    "database","query","index","join","api","request","response","server","client","framework","library",
    "model","train","test","accuracy","loss","gradient","layer","node","edge","graph","tree","stack","queue",
    "async","promise","callback","event","state","component","render","hook","props","context",
    "inheritance","polymorphism","encapsulation","abstraction","interface","abstract","override",
    "memory","pointer","reference","scope","closure","recursion","iteration","sorting","searching",
    "http","https","ssl","tls","rest","json","xml","endpoint","authentication","authorization",
    "docker","container","image","deploy","pipeline","ci","cd","git","branch","merge","commit"
  ];

  const hits = techTerms.filter(t => ans.includes(t)).length;
  const score = Math.min(10, 3 + hits * 1.5);
  return Math.round(Math.max(1, score));
}

function scoreClarity(ans, words, wordCount) {
  let score = 5;

  // Ideal length: 30-120 words
  if (wordCount < 5) score = 1;
  else if (wordCount < 15) score = 3;
  else if (wordCount >= 30 && wordCount <= 120) score = 9;
  else if (wordCount > 120 && wordCount <= 200) score = 7;
  else if (wordCount > 200) score = 6;
  else score = 5;

  // Penalize filler words
  const fillerCount = FILLER_WORDS.filter(f => ans.includes(f)).length;
  score = Math.max(1, score - fillerCount);

  // Bonus for sentence structure (multiple sentences)
  const sentences = ans.split(/[.!?]+/).filter(s => s.trim().length > 5);
  if (sentences.length >= 3) score = Math.min(10, score + 1);

  return Math.round(Math.max(1, Math.min(10, score)));
}

function scoreCommunication(ans, words) {
  let score = 5;

  // STAR keywords
  const starHits = STAR_WORDS.filter(w => ans.includes(w)).length;
  score += Math.min(3, starHits);

  // Examples/specifics
  if (ans.includes("for example") || ans.includes("for instance") || ans.includes("such as") || ans.includes("specifically")) score += 1;
  if (ans.includes("i ") || ans.includes("we ") || ans.includes("my ") || ans.includes("our ")) score += 1;

  // Penalize very short or repetitive
  const uniqueWords = new Set(words);
  const uniqueRatio = uniqueWords.size / Math.max(words.length, 1);
  if (uniqueRatio < 0.4) score -= 2;

  return Math.round(Math.max(1, Math.min(10, score)));
}

function generateFeedback(relevance, technical, clarity, communication, wordCount, type) {
  const parts = [];

  if (relevance >= 8) parts.push("Excellent relevance to the question.");
  else if (relevance >= 5) parts.push("Moderately relevant answer.");
  else parts.push("Answer lacked relevance to the question.");

  if (type === "technical") {
    if (technical >= 8) parts.push("Strong technical depth demonstrated.");
    else if (technical >= 5) parts.push("Some technical terms used.");
    else parts.push("More technical detail needed.");
  }

  if (clarity >= 8) parts.push("Very clear and well-structured.");
  else if (clarity >= 5) parts.push("Reasonably clear.");
  else if (wordCount < 20) parts.push("Answer was too brief — aim for 30-120 words.");
  else parts.push("Could be clearer and more concise.");

  if (communication >= 8) parts.push("Excellent communication with good examples.");
  else if (communication >= 5) parts.push("Good communication style.");
  else parts.push("Try using the STAR method (Situation, Task, Action, Result).");

  return parts.join(" ");
}

// Compute final report from all scored answers
function computeFinalReport(answers, questions, resumeData) {
  let totalScore = 0;
  let totalRelevance = 0, totalTechnical = 0, totalClarity = 0, totalComm = 0;
  const perQuestion = [];

  for (let i = 0; i < questions.length; i++) {
    const q = questions[i];
    const ans = answers[i] || "";
    const scored = scoreAnswer(ans, q, resumeData);
    totalScore += scored.total;
    totalRelevance += scored.relevance;
    totalTechnical += scored.technical;
    totalClarity += scored.clarity;
    totalComm += scored.communication;
    perQuestion.push({ question: q.displayText || q.text, answer: ans, ...scored });
  }

  const n = questions.length || 1;
  const avgRelevance = Math.round(totalRelevance / n);
  const avgTechnical = Math.round(totalTechnical / n);
  const avgClarity = Math.round(totalClarity / n);
  const avgComm = Math.round(totalComm / n);
  const overallScore = Math.round(totalScore / n);

  // Decision
  let decision, decisionClass, explanation;
  if (overallScore >= 70) {
    decision = "SELECTED";
    decisionClass = "selected";
    explanation = generateExplanation("selected", overallScore, avgRelevance, avgTechnical, avgClarity, avgComm, perQuestion, resumeData);
  } else if (overallScore >= 50) {
    decision = "ON HOLD / SECOND ROUND";
    decisionClass = "onhold";
    explanation = generateExplanation("onhold", overallScore, avgRelevance, avgTechnical, avgClarity, avgComm, perQuestion, resumeData);
  } else {
    decision = "NOT SELECTED";
    decisionClass = "rejected";
    explanation = generateExplanation("rejected", overallScore, avgRelevance, avgTechnical, avgClarity, avgComm, perQuestion, resumeData);
  }

  const strengths = getStrengths(avgRelevance, avgTechnical, avgClarity, avgComm);
  const weaknesses = getWeaknesses(avgRelevance, avgTechnical, avgClarity, avgComm);
  const suggestions = getSuggestions(weaknesses);

  return {
    overallScore, avgRelevance, avgTechnical, avgClarity, avgComm,
    decision, decisionClass, explanation, perQuestion, strengths, weaknesses, suggestions
  };
}

function generateExplanation(type, score, rel, tech, clar, comm, perQ, resumeData) {
  const best = perQ.reduce((a, b) => a.total > b.total ? a : b);
  const worst = perQ.reduce((a, b) => a.total < b.total ? a : b);
  const skillCount = resumeData?.skills?.length || 0;

  const templates = {
    selected: [
      `The candidate scored ${score}/100, demonstrating strong overall performance.`,
      `Relevance was rated ${rel}/10, showing good alignment with the role requirements.`,
      `Technical accuracy scored ${tech}/10, reflecting solid domain knowledge.`,
      `The strongest answer was on: "${best.question.slice(0, 60)}..." (${best.total}/100).`,
      `Communication scored ${comm}/10 with clear, structured responses.`,
      `The resume showed ${skillCount} relevant skills, which were well-reflected in the answers.`,
      `The candidate is recommended for the next stage of the hiring process.`
    ],
    onhold: [
      `The candidate scored ${score}/100, showing potential but with areas needing improvement.`,
      `Relevance scored ${rel}/10 — some answers drifted from the core question.`,
      `Technical depth scored ${tech}/10 — more specific examples would strengthen responses.`,
      `The weakest area was: "${worst.question.slice(0, 60)}..." (${worst.total}/100).`,
      `Clarity scored ${clar}/10 — answers could be more concise and structured.`,
      `A second round interview is recommended to assess the candidate further.`,
      `Focused preparation on technical topics and STAR-method answers is advised.`
    ],
    rejected: [
      `The candidate scored ${score}/100, which is below the selection threshold.`,
      `Relevance scored ${rel}/10 — answers frequently missed the core question.`,
      `Technical accuracy scored ${tech}/10 — insufficient domain knowledge demonstrated.`,
      `The weakest answer was on: "${worst.question.slice(0, 60)}..." (${worst.total}/100).`,
      `Communication scored ${comm}/10 — responses lacked structure and specific examples.`,
      `The candidate is encouraged to strengthen technical skills and practice structured answers.`,
      `Re-application after further preparation is welcome.`
    ]
  };
  return templates[type].join(" ");
}

function getStrengths(rel, tech, clar, comm) {
  const s = [];
  if (rel >= 7) s.push("Strong answer relevance");
  if (tech >= 7) s.push("Good technical knowledge");
  if (clar >= 7) s.push("Clear and concise communication");
  if (comm >= 7) s.push("Structured responses with examples");
  return s.length ? s : ["Showed willingness to engage with all questions"];
}

function getWeaknesses(rel, tech, clar, comm) {
  const w = [];
  if (rel < 6) w.push("Answers lacked relevance to questions");
  if (tech < 6) w.push("Insufficient technical depth");
  if (clar < 6) w.push("Answers were too brief or unclear");
  if (comm < 6) w.push("Lacked structured examples (STAR method)");
  return w.length ? w : ["Minor improvements needed in answer depth"];
}

function getSuggestions(weaknesses) {
  const map = {
    "Answers lacked relevance to questions": "Practice answering questions by first identifying the core topic, then structuring your response around it.",
    "Insufficient technical depth": "Review core technical concepts for your target role and practice explaining them with examples.",
    "Answers were too brief or unclear": "Aim for 60-100 word answers. Use the STAR method: Situation, Task, Action, Result.",
    "Lacked structured examples (STAR method)": "Use the STAR framework: describe the Situation, your Task, the Action you took, and the Result achieved.",
    "Minor improvements needed in answer depth": "Continue practicing with mock interviews and focus on providing specific, quantifiable examples."
  };
  return weaknesses.map(w => map[w] || w);
}
