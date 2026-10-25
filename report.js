// report.js — Final report renderer for InterviewAI

function renderReport(report, candidateName, role, containerId) {
  const el = document.getElementById(containerId);
  if (!el) return;

  const decisionColors = { selected: "#10B981", onhold: "#F59E0B", rejected: "#EF4444" };
  const decisionIcons = { selected: "✅", onhold: "⏳", rejected: "❌" };
  const color = decisionColors[report.decisionClass] || "#6B7280";
  const icon = decisionIcons[report.decisionClass] || "📋";

  el.innerHTML = `
    <div class="report-header">
      <h2>Interview Report</h2>
      <p class="report-meta">${candidateName || "Candidate"} &nbsp;|&nbsp; ${role || "General"} &nbsp;|&nbsp; ${new Date().toLocaleDateString()}</p>
    </div>

    <div class="report-score-row">
      <div class="score-circle" style="--score-color:${color}">
        <span class="score-num">${report.overallScore}</span>
        <span class="score-label">/ 100</span>
      </div>
      <div class="decision-badge" style="background:${color}20;border:2px solid ${color};color:${color}">
        ${icon} ${report.decision}
      </div>
    </div>

    <div class="report-explanation">${report.explanation}</div>

    <div class="report-charts-row">
      <div class="chart-card">
        <canvas id="radarChart" width="260" height="260"></canvas>
      </div>
      <div class="chart-card">
        <canvas id="barChart" width="260" height="260"></canvas>
      </div>
    </div>

    <div class="report-strengths-row">
      <div class="sw-card strengths-card">
        <h4>💪 Strengths</h4>
        <ul>${report.strengths.map(s => `<li>${s}</li>`).join("")}</ul>
      </div>
      <div class="sw-card weaknesses-card">
        <h4>⚠️ Areas to Improve</h4>
        <ul>${report.weaknesses.map(w => `<li>${w}</li>`).join("")}</ul>
      </div>
      <div class="sw-card suggestions-card">
        <h4>💡 Suggestions</h4>
        <ul>${report.suggestions.map(s => `<li>${s}</li>`).join("")}</ul>
      </div>
    </div>

    <div class="report-table-wrap">
      <h4>Per-Question Breakdown</h4>
      <table class="report-table">
        <thead>
          <tr><th>#</th><th>Question</th><th>Answer</th><th>Rel</th><th>Tech</th><th>Clarity</th><th>Comm</th><th>Score</th><th>Feedback</th></tr>
        </thead>
        <tbody>
          ${report.perQuestion.map((pq, i) => `
            <tr>
              <td>${i + 1}</td>
              <td class="q-cell">${pq.question}</td>
              <td class="a-cell">${pq.answer || "<em>No answer</em>"}</td>
              <td><span class="score-pill" style="background:${scoreColor(pq.relevance)}">${pq.relevance}</span></td>
              <td><span class="score-pill" style="background:${scoreColor(pq.technical)}">${pq.technical}</span></td>
              <td><span class="score-pill" style="background:${scoreColor(pq.clarity)}">${pq.clarity}</span></td>
              <td><span class="score-pill" style="background:${scoreColor(pq.communication)}">${pq.communication}</span></td>
              <td><strong>${pq.total}</strong></td>
              <td class="fb-cell">${pq.feedback}</td>
            </tr>
          `).join("")}
        </tbody>
      </table>
    </div>

    <div class="report-actions">
      <button class="btn-primary" onclick="downloadReportPDF()">⬇️ Download PDF</button>
      <button class="btn-secondary" onclick="exportTranscript('json')">📄 Export JSON</button>
      <button class="btn-secondary" onclick="exportTranscript('md')">📝 Export Markdown</button>
      <button class="btn-outline" onclick="restartInterview(false)">🔄 Fresh Interview</button>
      <button class="btn-outline" onclick="restartInterview(true)">🔁 Repeat Same Questions</button>
    </div>
  `;

  // Render charts after DOM is ready
  setTimeout(() => renderCharts(report), 100);
}

function scoreColor(score) {
  if (score >= 8) return "#D1FAE5";
  if (score >= 5) return "#FEF3C7";
  return "#FEE2E2";
}

function renderCharts(report) {
  const labels = ["Relevance", "Technical", "Clarity", "Communication"];
  const data = [report.avgRelevance, report.avgTechnical, report.avgClarity, report.avgComm];
  const colors = ["#4F46E5", "#06B6D4", "#10B981", "#F59E0B"];

  // Radar chart
  const radarCtx = document.getElementById("radarChart");
  if (radarCtx && window.Chart) {
    new Chart(radarCtx, {
      type: "radar",
      data: {
        labels,
        datasets: [{
          label: "Score",
          data,
          backgroundColor: "rgba(79,70,229,0.15)",
          borderColor: "#4F46E5",
          borderWidth: 2,
          pointBackgroundColor: "#4F46E5"
        }]
      },
      options: {
        scales: { r: { min: 0, max: 10, ticks: { stepSize: 2 } } },
        plugins: { legend: { display: false } }
      }
    });
  }

  // Bar chart
  const barCtx = document.getElementById("barChart");
  if (barCtx && window.Chart) {
    new Chart(barCtx, {
      type: "bar",
      data: {
        labels,
        datasets: [{
          label: "Score (out of 10)",
          data,
          backgroundColor: colors,
          borderRadius: 8
        }]
      },
      options: {
        scales: { y: { min: 0, max: 10, ticks: { stepSize: 2 } } },
        plugins: { legend: { display: false } }
      }
    });
  }
}

function downloadReportPDF() {
  // Ensure all screens except report are hidden for print
  document.querySelectorAll(".screen").forEach(s => {
    s.dataset.wasActive = s.classList.contains("active") ? "1" : "0";
    s.classList.remove("active");
  });
  document.getElementById("screen-report").classList.add("active");
  window.print();
  // Restore
  document.querySelectorAll(".screen").forEach(s => {
    if (s.dataset.wasActive === "1") s.classList.add("active");
  });
}

function exportTranscript(format) {
  const data = JSON.parse(localStorage.getItem("interviewAI_lastReport") || "{}");
  if (!data.perQuestion) { showToast("No report data found.", "error"); return; }

  let content, filename, type;
  if (format === "json") {
    content = JSON.stringify(data, null, 2);
    filename = "interview_transcript.json";
    type = "application/json";
  } else {
    content = `# InterviewAI Transcript\n\n**Overall Score:** ${data.overallScore}/100\n**Decision:** ${data.decision}\n\n## Per-Question\n\n`;
    data.perQuestion.forEach((pq, i) => {
      content += `### Q${i + 1}: ${pq.question}\n**Answer:** ${pq.answer || "No answer"}\n**Score:** ${pq.total}/100\n**Feedback:** ${pq.feedback}\n\n`;
    });
    filename = "interview_transcript.md";
    type = "text/markdown";
  }

  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url; a.download = filename; a.click();
  URL.revokeObjectURL(url);
}
