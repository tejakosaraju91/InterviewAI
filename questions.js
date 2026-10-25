// questions.js — Question bank for InterviewAI

const QUESTION_BANK = {
  intro: [
    { id: "intro_1", text: "Tell me about yourself and your background.", hi: "अपने बारे में और अपनी पृष्ठभूमि के बारे में बताएं।", te: "మీ గురించి మరియు మీ నేపథ్యం గురించి చెప్పండి.", type: "intro", expectedKeywords: ["experience","background","skills","worked","studied","project","role"] },
    { id: "intro_2", text: "Walk me through your resume briefly.", hi: "अपने रेज्यूमे को संक्षेप में बताएं।", te: "మీ రెజ్యూమేను క్లుప్తంగా వివరించండి.", type: "intro", expectedKeywords: ["experience","project","skill","education","internship","worked"] }
  ],
  hr: [
    { id: "hr_1", text: "Why do you want to work with us?", hi: "आप हमारे साथ काम क्यों करना चाहते हैं?", te: "మీరు మాతో ఎందుకు పని చేయాలనుకుంటున్నారు?", type: "hr", expectedKeywords: ["growth","opportunity","culture","learn","contribute","team","mission","values"] },
    { id: "hr_2", text: "Where do you see yourself in 5 years?", hi: "आप खुद को 5 साल में कहाँ देखते हैं?", te: "5 సంవత్సరాల్లో మీరు మిమ్మల్ని ఎక్కడ చూస్తున్నారు?", type: "hr", expectedKeywords: ["lead","grow","senior","skill","contribute","team","goal","achieve"] },
    { id: "hr_3", text: "What are your greatest strengths and weaknesses?", hi: "आपकी सबसे बड़ी ताकत और कमजोरियां क्या हैं?", te: "మీ అతిపెద్ద బలాలు మరియు బలహీనతలు ఏమిటి?", type: "hr", expectedKeywords: ["strength","weakness","improve","learn","work","team","problem","solve"] },
    { id: "hr_4", text: "Why are you leaving your current job?", hi: "आप अपनी वर्तमान नौकरी क्यों छोड़ रहे हैं?", te: "మీరు మీ ప్రస్తుత ఉద్యోగాన్ని ఎందుకు వదిలిపెడుతున్నారు?", type: "hr", expectedKeywords: ["growth","opportunity","challenge","learn","new","role","career"] }
  ],
  behavioral: [
    { id: "beh_1", text: "Tell me about a time you faced a difficult challenge at work or in a project. How did you handle it?", hi: "एक ऐसे समय के बारे में बताएं जब आपने काम या किसी प्रोजेक्ट में कठिन चुनौती का सामना किया।", te: "మీరు పని లేదా ప్రాజెక్ట్‌లో కష్టమైన సవాలును ఎదుర్కొన్న సమయం గురించి చెప్పండి.", type: "behavioral", expectedKeywords: ["situation","task","action","result","challenge","solved","team","deadline","learned"] },
    { id: "beh_2", text: "Describe a situation where you had to work under pressure to meet a deadline.", hi: "एक ऐसी स्थिति का वर्णन करें जहाँ आपको समय सीमा पूरी करने के लिए दबाव में काम करना पड़ा।", te: "గడువు తీర్చడానికి ఒత్తిడిలో పని చేయవలసి వచ్చిన పరిస్థితిని వివరించండి.", type: "behavioral", expectedKeywords: ["deadline","pressure","managed","prioritize","delivered","team","result","time"] },
    { id: "beh_3", text: "Give an example of when you showed leadership or took initiative.", hi: "एक उदाहरण दें जब आपने नेतृत्व दिखाया या पहल की।", te: "మీరు నాయకత్వం చూపించిన లేదా చొరవ తీసుకున్న ఉదాహరణ ఇవ్వండి.", type: "behavioral", expectedKeywords: ["led","initiative","team","organized","result","improved","decision","responsibility"] }
  ],
  situational: [
    { id: "sit_1", text: "If you were given a project with unclear requirements, how would you proceed?", hi: "यदि आपको अस्पष्ट आवश्यकताओं वाला प्रोजेक्ट दिया जाए, तो आप कैसे आगे बढ़ेंगे?", te: "అస్పష్టమైన అవసరాలతో ప్రాజెక్ట్ ఇవ్వబడితే, మీరు ఎలా కొనసాగుతారు?", type: "situational", expectedKeywords: ["clarify","ask","stakeholder","requirement","plan","document","communicate","scope"] },
    { id: "sit_2", text: "How would you handle a disagreement with a team member about a technical decision?", hi: "तकनीकी निर्णय के बारे में टीम के सदस्य के साथ असहमति को आप कैसे संभालेंगे?", te: "సాంకేతిక నిర్ణయం గురించి జట్టు సభ్యుడితో విభేదాన్ని మీరు ఎలా నిర్వహిస్తారు?", type: "situational", expectedKeywords: ["discuss","listen","compromise","data","evidence","team","respect","solution","agree"] },
    { id: "sit_3", text: "If you discovered a critical bug just before a product release, what would you do?", hi: "यदि उत्पाद रिलीज से ठीक पहले आपको एक गंभीर बग मिले, तो आप क्या करेंगे?", te: "ఉత్పత్తి విడుదలకు ముందే క్రిటికల్ బగ్ కనుగొంటే, మీరు ఏమి చేస్తారు?", type: "situational", expectedKeywords: ["report","fix","test","communicate","stakeholder","priority","rollback","document"] }
  ],
  technical: {
    general: [
      { id: "tech_gen_1", text: "Explain the difference between object-oriented and functional programming.", hi: "ऑब्जेक्ट-ओरिएंटेड और फंक्शनल प्रोग्रामिंग के बीच अंतर समझाएं।", te: "ఆబ్జెక్ట్-ఓరియెంటెడ్ మరియు ఫంక్షనల్ ప్రోగ్రామింగ్ మధ్య తేడాను వివరించండి.", type: "technical", expectedKeywords: ["class","object","inheritance","encapsulation","function","immutable","pure","state","side effect"] },
      { id: "tech_gen_2", text: "What is version control and why is it important?", hi: "वर्जन कंट्रोल क्या है और यह क्यों महत्वपूर्ण है?", te: "వెర్షన్ కంట్రోల్ అంటే ఏమిటి మరియు అది ఎందుకు ముఖ్యమైనది?", type: "technical", expectedKeywords: ["git","track","changes","collaborate","branch","merge","history","rollback","team"] },
      { id: "tech_gen_3", text: "What is the difference between SQL and NoSQL databases?", hi: "SQL और NoSQL डेटाबेस के बीच क्या अंतर है?", te: "SQL మరియు NoSQL డేటాబేస్‌ల మధ్య తేడా ఏమిటి?", type: "technical", expectedKeywords: ["relational","schema","table","document","flexible","scale","mongodb","mysql","query"] }
    ],
    python: [
      { id: "tech_py_1", text: "What are Python decorators and how do you use them?", hi: "Python डेकोरेटर क्या हैं और आप उनका उपयोग कैसे करते हैं?", te: "Python డెకొరేటర్లు అంటే ఏమిటి మరియు వాటిని ఎలా ఉపయోగిస్తారు?", type: "technical", expectedKeywords: ["function","wrap","@","modify","behavior","closure","higher order"] },
      { id: "tech_py_2", text: "Explain list comprehensions and generators in Python.", hi: "Python में लिस्ट कॉम्प्रिहेंशन और जेनरेटर समझाएं।", te: "Python లో లిస్ట్ కాంప్రిహెన్షన్స్ మరియు జెనరేటర్లను వివరించండి.", type: "technical", expectedKeywords: ["list","comprehension","generator","yield","memory","efficient","iterate","lazy"] },
      { id: "tech_py_3", text: "What is the difference between deep copy and shallow copy in Python?", hi: "Python में डीप कॉपी और शैलो कॉपी में क्या अंतर है?", te: "Python లో డీప్ కాపీ మరియు షాలో కాపీ మధ్య తేడా ఏమిటి?", type: "technical", expectedKeywords: ["reference","object","nested","copy","memory","independent","linked"] }
    ],
    javascript: [
      { id: "tech_js_1", text: "Explain event loop, call stack, and asynchronous JavaScript.", hi: "इवेंट लूप, कॉल स्टैक और असिंक्रोनस JavaScript समझाएं।", te: "ఈవెంట్ లూప్, కాల్ స్టాక్ మరియు అసింక్రోనస్ JavaScript వివరించండి.", type: "technical", expectedKeywords: ["event loop","call stack","promise","async","await","callback","non-blocking","queue"] },
      { id: "tech_js_2", text: "What is the difference between var, let, and const?", hi: "var, let और const के बीच क्या अंतर है?", te: "var, let మరియు const మధ్య తేడా ఏమిటి?", type: "technical", expectedKeywords: ["scope","block","function","hoisting","reassign","const","let","var"] },
      { id: "tech_js_3", text: "Explain closures in JavaScript with an example.", hi: "JavaScript में क्लोजर को एक उदाहरण के साथ समझाएं।", te: "JavaScript లో క్లోజర్లను ఉదాహరణతో వివరించండి.", type: "technical", expectedKeywords: ["closure","scope","inner function","outer","variable","access","encapsulate"] }
    ],
    react: [
      { id: "tech_react_1", text: "What is the virtual DOM and how does React use it?", hi: "वर्चुअल DOM क्या है और React इसका उपयोग कैसे करता है?", te: "వర్చువల్ DOM అంటే ఏమిటి మరియు React దాన్ని ఎలా ఉపయోగిస్తుంది?", type: "technical", expectedKeywords: ["virtual","dom","reconciliation","diff","render","update","performance","component"] },
      { id: "tech_react_2", text: "Explain React hooks — useState, useEffect, and useContext.", hi: "React hooks — useState, useEffect और useContext समझाएं।", te: "React hooks — useState, useEffect మరియు useContext వివరించండి.", type: "technical", expectedKeywords: ["useState","useEffect","useContext","hook","state","side effect","functional","component"] }
    ],
    java: [
      { id: "tech_java_1", text: "Explain OOP concepts in Java: inheritance, polymorphism, encapsulation, abstraction.", hi: "Java में OOP अवधारणाएं समझाएं: इनहेरिटेंस, पॉलीमॉर्फिज्म, एनकैप्सुलेशन, एब्स्ट्रैक्शन।", te: "Java లో OOP భావనలు వివరించండి: ఇన్హెరిటెన్స్, పాలిమార్ఫిజం, ఎన్‌క్యాప్సులేషన్, అబ్‌స్ట్రాక్షన్.", type: "technical", expectedKeywords: ["class","inherit","override","interface","abstract","encapsulate","private","public","extends"] },
      { id: "tech_java_2", text: "What is the difference between ArrayList and LinkedList in Java?", hi: "Java में ArrayList और LinkedList में क्या अंतर है?", te: "Java లో ArrayList మరియు LinkedList మధ్య తేడా ఏమిటి?", type: "technical", expectedKeywords: ["array","linked","node","index","insert","delete","memory","performance","random access"] }
    ],
    sql: [
      { id: "tech_sql_1", text: "Explain the difference between INNER JOIN, LEFT JOIN, and RIGHT JOIN.", hi: "INNER JOIN, LEFT JOIN और RIGHT JOIN के बीच अंतर समझाएं।", te: "INNER JOIN, LEFT JOIN మరియు RIGHT JOIN మధ్య తేడాను వివరించండి.", type: "technical", expectedKeywords: ["join","table","match","null","left","right","inner","rows","combine"] },
      { id: "tech_sql_2", text: "What are indexes in SQL and when should you use them?", hi: "SQL में इंडेक्स क्या हैं और आपको उनका उपयोग कब करना चाहिए?", te: "SQL లో ఇండెక్స్‌లు అంటే ఏమిటి మరియు వాటిని ఎప్పుడు ఉపయోగించాలి?", type: "technical", expectedKeywords: ["index","performance","query","search","slow","column","primary","unique","btree"] }
    ],
    ml: [
      { id: "tech_ml_1", text: "Explain overfitting and underfitting in machine learning. How do you prevent them?", hi: "मशीन लर्निंग में ओवरफिटिंग और अंडरफिटिंग समझाएं। आप उन्हें कैसे रोकते हैं?", te: "మెషిన్ లెర్నింగ్‌లో ఓవర్‌ఫిట్టింగ్ మరియు అండర్‌ఫిట్టింగ్ వివరించండి.", type: "technical", expectedKeywords: ["overfit","underfit","regularization","dropout","cross validation","train","test","bias","variance"] },
      { id: "tech_ml_2", text: "What is the difference between supervised and unsupervised learning?", hi: "सुपरवाइज्ड और अनसुपरवाइज्ड लर्निंग में क्या अंतर है?", te: "సూపర్‌వైజ్డ్ మరియు అన్‌సూపర్‌వైజ్డ్ లెర్నింగ్ మధ్య తేడా ఏమిటి?", type: "technical", expectedKeywords: ["label","supervised","unsupervised","cluster","classify","regression","training","predict"] }
    ],
    webdev: [
      { id: "tech_web_1", text: "What is the difference between HTTP and HTTPS? Why does it matter?", hi: "HTTP और HTTPS में क्या अंतर है? यह क्यों महत्वपूर्ण है?", te: "HTTP మరియు HTTPS మధ్య తేడా ఏమిటి? అది ఎందుకు ముఖ్యమైనది?", type: "technical", expectedKeywords: ["secure","ssl","tls","encrypt","certificate","protocol","data","safe","port"] },
      { id: "tech_web_2", text: "Explain REST API principles and HTTP methods.", hi: "REST API सिद्धांत और HTTP मेथड समझाएं।", te: "REST API సూత్రాలు మరియు HTTP మెథడ్‌లను వివరించండి.", type: "technical", expectedKeywords: ["get","post","put","delete","stateless","endpoint","resource","json","status code"] }
    ]
  },
  resumeTemplates: [
    { id: "res_skill", text: "I see you have experience with {skill}. Can you describe a specific project or task where you used it?", hi: "मैं देख रहा हूँ कि आपके पास {skill} का अनुभव है। क्या आप एक विशिष्ट प्रोजेक्ट या कार्य का वर्णन कर सकते हैं?", te: "మీకు {skill} తో అనుభవం ఉందని చూస్తున్నాను. దాన్ని ఉపయోగించిన నిర్దిష్ట ప్రాజెక్ట్ లేదా పని వివరించగలరా?", type: "resume", expectedKeywords: ["used","built","implemented","developed","project","result","challenge","learned"] },
    { id: "res_project", text: "Tell me about your project '{project}'. What was your role and what challenges did you face?", hi: "अपने प्रोजेक्ट '{project}' के बारे में बताएं। आपकी भूमिका क्या थी और आपने किन चुनौतियों का सामना किया?", te: "మీ ప్రాజెక్ట్ '{project}' గురించి చెప్పండి. మీ పాత్ర ఏమిటి మరియు మీరు ఏ సవాళ్లను ఎదుర్కొన్నారు?", type: "resume", expectedKeywords: ["role","built","challenge","solved","team","result","technology","learned","impact"] },
    { id: "res_edu", text: "How has your education in {field} prepared you for this role?", hi: "आपकी {field} में शिक्षा ने आपको इस भूमिका के लिए कैसे तैयार किया है?", te: "{field} లో మీ విద్య మీకు ఈ పాత్రకు ఎలా సిద్ధం చేసింది?", type: "resume", expectedKeywords: ["course","project","learned","applied","theory","practical","skill","knowledge"] },
    { id: "res_intern", text: "What did you learn during your internship at {company}? How will that help here?", hi: "{company} में अपनी इंटर्नशिप के दौरान आपने क्या सीखा?", te: "{company} లో మీ ఇంటర్న్‌షిప్ సమయంలో మీరు ఏమి నేర్చుకున్నారు?", type: "resume", expectedKeywords: ["learned","worked","team","project","skill","real world","applied","contributed"] },
    { id: "res_cert", text: "You have a certification in {cert}. How have you applied that knowledge practically?", hi: "आपके पास {cert} में सर्टिफिकेशन है। आपने उस ज्ञान को व्यावहारिक रूप से कैसे लागू किया है?", te: "మీకు {cert} లో సర్టిఫికేషన్ ఉంది. ఆ జ్ఞానాన్ని ఆచరణాత్మకంగా ఎలా వర్తింపజేశారు?", type: "resume", expectedKeywords: ["applied","project","used","built","learned","practical","real","implemented"] }
  ],
  followUp: [
    { id: "fu_1", text: "Could you elaborate on that? Please give a specific example.", hi: "क्या आप इसे विस्तार से बता सकते हैं? कृपया एक विशिष्ट उदाहरण दें।", te: "దాన్ని మరింత వివరించగలరా? దయచేసి నిర్దిష్ట ఉదాహరణ ఇవ్వండి.", type: "followup" },
    { id: "fu_2", text: "Interesting! What was the outcome or result of that?", hi: "दिलचस्प! उसका परिणाम या नतीजा क्या था?", te: "ఆసక్తికరంగా ఉంది! దాని ఫలితం ఏమిటి?", type: "followup" },
    { id: "fu_3", text: "Can you be more specific about the technical details?", hi: "क्या आप तकनीकी विवरण के बारे में अधिक विशिष्ट हो सकते हैं?", te: "సాంకేతిక వివరాల గురించి మరింత నిర్దిష్టంగా చెప్పగలరా?", type: "followup" }
  ]
};

// Role-to-technical-topic mapping
const ROLE_TECH_MAP = {
  "Software Engineer": ["general","python","javascript","java","sql"],
  "Frontend Developer": ["javascript","react","webdev","general"],
  "Backend Developer": ["python","java","sql","general","webdev"],
  "Full Stack Developer": ["javascript","react","python","sql","webdev"],
  "Data Scientist": ["python","ml","sql","general"],
  "Machine Learning Engineer": ["python","ml","general"],
  "Data Analyst": ["sql","python","general"],
  "Web Developer": ["javascript","webdev","react","general"],
  "Java Developer": ["java","sql","general"],
  "Python Developer": ["python","sql","general"],
  "DevOps Engineer": ["general","sql"],
  "Mobile Developer": ["javascript","general"],
  "default": ["general","python","javascript"]
};

// Build a question set for a session
function buildQuestionSet(role, skills, projects, education, internships, certifications, difficulty, lang) {
  const questions = [];
  const techTopics = ROLE_TECH_MAP[role] || ROLE_TECH_MAP["default"];

  // 1. Intro
  questions.push({ ...QUESTION_BANK.intro[0], displayText: getQ(QUESTION_BANK.intro[0], lang) });

  // 2-4. Resume-based (up to 3)
  const resumeQs = buildResumeQuestions(skills, projects, education, internships, certifications, lang);
  resumeQs.slice(0, 3).forEach(q => questions.push(q));

  // 5-6. Technical (2 questions based on role)
  const techQs = getTechQuestions(techTopics, skills, difficulty, lang);
  techQs.slice(0, 2).forEach(q => questions.push(q));

  // 7. Behavioral
  const beh = QUESTION_BANK.behavioral[Math.floor(Math.random() * QUESTION_BANK.behavioral.length)];
  questions.push({ ...beh, displayText: getQ(beh, lang) });

  // 8. Situational
  const sit = QUESTION_BANK.situational[Math.floor(Math.random() * QUESTION_BANK.situational.length)];
  questions.push({ ...sit, displayText: getQ(sit, lang) });

  // Pad to 8 if needed
  while (questions.length < 8) {
    const hr = QUESTION_BANK.hr[questions.length % QUESTION_BANK.hr.length];
    questions.push({ ...hr, displayText: getQ(hr, lang) });
  }

  return questions.slice(0, 8);
}

function getQ(q, lang) {
  if (lang === "hi" && q.hi) return q.hi;
  if (lang === "te" && q.te) return q.te;
  return q.text;
}

function buildResumeQuestions(skills, projects, education, internships, certifications, lang) {
  const qs = [];
  const tmpl = QUESTION_BANK.resumeTemplates;

  if (skills.length > 0) {
    const skill = skills[0];
    const t = { ...tmpl[0], id: "res_skill_" + skill, displayText: getQ(tmpl[0], lang).replace("{skill}", skill), expectedKeywords: tmpl[0].expectedKeywords };
    qs.push(t);
  }
  if (projects.length > 0) {
    const proj = projects[0];
    const t = { ...tmpl[1], id: "res_proj_" + proj, displayText: getQ(tmpl[1], lang).replace("{project}", proj), expectedKeywords: tmpl[1].expectedKeywords };
    qs.push(t);
  }
  if (internships.length > 0) {
    const intern = internships[0];
    const t = { ...tmpl[3], id: "res_intern_" + intern, displayText: getQ(tmpl[3], lang).replace("{company}", intern), expectedKeywords: tmpl[3].expectedKeywords };
    qs.push(t);
  } else if (certifications.length > 0) {
    const cert = certifications[0];
    const t = { ...tmpl[4], id: "res_cert_" + cert, displayText: getQ(tmpl[4], lang).replace("{cert}", cert), expectedKeywords: tmpl[4].expectedKeywords };
    qs.push(t);
  } else if (education.length > 0) {
    const edu = education[0];
    const t = { ...tmpl[2], id: "res_edu_" + edu, displayText: getQ(tmpl[2], lang).replace("{field}", edu), expectedKeywords: tmpl[2].expectedKeywords };
    qs.push(t);
  }
  if (skills.length > 1) {
    const skill = skills[1];
    const t = { ...tmpl[0], id: "res_skill2_" + skill, displayText: getQ(tmpl[0], lang).replace("{skill}", skill), expectedKeywords: tmpl[0].expectedKeywords };
    qs.push(t);
  }
  return qs;
}

function getTechQuestions(topics, skills, difficulty, lang) {
  const qs = [];
  const skillLower = skills.map(s => s.toLowerCase());
  const prioritized = [];

  // Match skills to topics
  if (skillLower.some(s => ["python","django","flask","fastapi"].includes(s))) prioritized.push("python");
  if (skillLower.some(s => ["javascript","js","node","nodejs"].includes(s))) prioritized.push("javascript");
  if (skillLower.some(s => ["react","reactjs","redux"].includes(s))) prioritized.push("react");
  if (skillLower.some(s => ["java","spring","springboot"].includes(s))) prioritized.push("java");
  if (skillLower.some(s => ["sql","mysql","postgresql","sqlite"].includes(s))) prioritized.push("sql");
  if (skillLower.some(s => ["machine learning","ml","deep learning","tensorflow","pytorch"].includes(s))) prioritized.push("ml");
  if (skillLower.some(s => ["html","css","web"].includes(s))) prioritized.push("webdev");

  const finalTopics = [...new Set([...prioritized, ...topics])];

  for (const topic of finalTopics) {
    const pool = QUESTION_BANK.technical[topic];
    if (!pool) continue;
    const filtered = difficulty === "hard" ? pool : pool.slice(0, 2);
    const q = filtered[Math.floor(Math.random() * filtered.length)];
    if (q && !qs.find(x => x.id === q.id)) {
      qs.push({ ...q, displayText: getQ(q, lang) });
    }
    if (qs.length >= 2) break;
  }

  // Fallback
  if (qs.length < 2) {
    QUESTION_BANK.technical.general.forEach(q => {
      if (qs.length < 2 && !qs.find(x => x.id === q.id)) {
        qs.push({ ...q, displayText: getQ(q, lang) });
      }
    });
  }
  return qs;
}
