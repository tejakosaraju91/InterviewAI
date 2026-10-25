// avatar.js — Animated SVG avatar for InterviewAI

const AvatarSVG = `
<svg id="avatarSvg" viewBox="0 0 200 260" xmlns="http://www.w3.org/2000/svg" style="width:100%;height:100%;">
  <!-- Glow ring -->
  <circle id="glowRing" cx="100" cy="110" r="88" fill="none" stroke="#4F46E5" stroke-width="3" opacity="0.5"/>

  <!-- Shoulders / body -->
  <ellipse cx="100" cy="230" rx="60" ry="35" fill="#E0E7FF"/>
  <rect x="55" y="195" width="90" height="50" rx="20" fill="#E0E7FF"/>

  <!-- Neck -->
  <rect x="88" y="170" width="24" height="28" rx="8" fill="#FDDCB5"/>

  <!-- Head -->
  <ellipse id="avatarHead" cx="100" cy="130" rx="52" ry="58" fill="#FDDCB5"/>

  <!-- Hair -->
  <ellipse cx="100" cy="82" rx="52" ry="22" fill="#4A2C0A"/>
  <ellipse cx="52" cy="110" rx="12" ry="30" fill="#4A2C0A"/>
  <ellipse cx="148" cy="110" rx="12" ry="30" fill="#4A2C0A"/>
  <ellipse cx="100" cy="78" rx="48" ry="18" fill="#5C3510"/>

  <!-- Left eyebrow -->
  <path id="leftBrow" d="M68 103 Q78 98 88 103" stroke="#4A2C0A" stroke-width="2.5" fill="none" stroke-linecap="round"/>
  <!-- Right eyebrow -->
  <path id="rightBrow" d="M112 103 Q122 98 132 103" stroke="#4A2C0A" stroke-width="2.5" fill="none" stroke-linecap="round"/>

  <!-- Left eye white -->
  <ellipse cx="78" cy="118" rx="11" ry="9" fill="white"/>
  <!-- Right eye white -->
  <ellipse cx="122" cy="118" rx="11" ry="9" fill="white"/>

  <!-- Left iris -->
  <ellipse id="leftIris" cx="78" cy="118" rx="6" ry="7" fill="#3B2A1A"/>
  <!-- Right iris -->
  <ellipse id="rightIris" cx="122" cy="118" rx="6" ry="7" fill="#3B2A1A"/>

  <!-- Left pupil -->
  <ellipse cx="78" cy="118" rx="3" ry="3.5" fill="#111"/>
  <!-- Right pupil -->
  <ellipse cx="122" cy="118" rx="3" ry="3.5" fill="#111"/>

  <!-- Left eye shine -->
  <ellipse cx="80" cy="115" rx="1.5" ry="1.5" fill="white"/>
  <!-- Right eye shine -->
  <ellipse cx="124" cy="115" rx="1.5" ry="1.5" fill="white"/>

  <!-- Left eyelid (for blinking) -->
  <ellipse id="leftLid" cx="78" cy="118" rx="11" ry="0" fill="#FDDCB5"/>
  <!-- Right eyelid (for blinking) -->
  <ellipse id="rightLid" cx="122" cy="118" rx="11" ry="0" fill="#FDDCB5"/>

  <!-- Nose -->
  <ellipse cx="100" cy="138" rx="4" ry="3" fill="#E8B98A" opacity="0.7"/>
  <path d="M96 135 Q100 142 104 135" stroke="#C8956A" stroke-width="1.2" fill="none"/>

  <!-- Mouth -->
  <g id="mouthGroup">
    <!-- Lips closed (smile) -->
    <path id="mouthClosed" d="M86 152 Q100 162 114 152" stroke="#C0706A" stroke-width="2" fill="none" stroke-linecap="round"/>
    <!-- Upper lip -->
    <path id="mouthOpen" d="M88 150 Q100 145 112 150 Q106 155 100 156 Q94 155 88 150Z" fill="#C0706A" opacity="0"/>
    <!-- Lower lip / open mouth -->
    <ellipse id="mouthInner" cx="100" cy="158" rx="10" ry="0" fill="#8B3A3A"/>
  </g>

  <!-- Cheeks blush -->
  <ellipse cx="65" cy="135" rx="10" ry="6" fill="#F4A0A0" opacity="0.35"/>
  <ellipse cx="135" cy="135" rx="10" ry="6" fill="#F4A0A0" opacity="0.35"/>

  <!-- Earrings -->
  <circle cx="48" cy="130" r="3" fill="#F59E0B"/>
  <circle cx="152" cy="130" r="3" fill="#F59E0B"/>
</svg>`;

class Avatar {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    this.container.innerHTML = AvatarSVG;
    this.state = "idle";
    this.blinkTimer = null;
    this.swayTimer = null;
    this.lipTimer = null;
    this.headY = 0;
    this.init();
  }

  init() {
    this.scheduleBlink();
    this.startIdleSway();
  }

  scheduleBlink() {
    const delay = 3000 + Math.random() * 2000;
    this.blinkTimer = setTimeout(() => {
      this.blink();
      this.scheduleBlink();
    }, delay);
  }

  blink() {
    const leftLid = document.getElementById("leftLid");
    const rightLid = document.getElementById("rightLid");
    if (!leftLid) return;
    // Close
    leftLid.setAttribute("ry", "9");
    rightLid.setAttribute("ry", "9");
    setTimeout(() => {
      leftLid.setAttribute("ry", "0");
      rightLid.setAttribute("ry", "0");
    }, 120);
  }

  startIdleSway() {
    let t = 0;
    this.swayTimer = setInterval(() => {
      t += 0.04;
      const head = document.getElementById("avatarHead");
      if (!head) return;
      const sway = Math.sin(t) * 2;
      const breathe = Math.sin(t * 0.7) * 1;
      head.setAttribute("cy", 130 + breathe);
      document.getElementById("avatarSvg").style.transform = `rotate(${sway * 0.3}deg)`;
    }, 50);
  }

  setState(state) {
    this.state = state;
    const ring = document.getElementById("glowRing");
    const leftBrow = document.getElementById("leftBrow");
    const rightBrow = document.getElementById("rightBrow");

    // Reset
    if (ring) { ring.style.animation = ""; ring.setAttribute("stroke", "#4F46E5"); ring.setAttribute("opacity", "0.5"); }
    if (leftBrow) leftBrow.setAttribute("d", "M68 103 Q78 98 88 103");
    if (rightBrow) rightBrow.setAttribute("d", "M112 103 Q122 98 132 103");

    switch (state) {
      case "speaking":
        if (ring) { ring.setAttribute("stroke", "#06B6D4"); ring.setAttribute("opacity", "0.8"); ring.style.animation = "ringPulse 1s ease-in-out infinite"; }
        this.startLipSync();
        break;
      case "listening":
        if (ring) { ring.setAttribute("stroke", "#10B981"); ring.setAttribute("opacity", "0.9"); ring.style.animation = "ringPulse 0.6s ease-in-out infinite"; }
        // Raised eyebrows
        if (leftBrow) leftBrow.setAttribute("d", "M68 99 Q78 94 88 99");
        if (rightBrow) rightBrow.setAttribute("d", "M112 99 Q122 94 132 99");
        this.stopLipSync();
        break;
      case "thinking":
        if (ring) { ring.setAttribute("stroke", "#F59E0B"); ring.setAttribute("opacity", "0.7"); ring.style.animation = "ringPulse 1.5s ease-in-out infinite"; }
        // Furrowed brows
        if (leftBrow) leftBrow.setAttribute("d", "M68 105 Q78 101 88 105");
        if (rightBrow) rightBrow.setAttribute("d", "M112 105 Q122 101 132 105");
        this.stopLipSync();
        break;
      default: // idle
        this.stopLipSync();
        break;
    }
  }

  startLipSync() {
    this.stopLipSync();
    let open = false;
    this.lipTimer = setInterval(() => {
      open = !open;
      const mouthClosed = document.getElementById("mouthClosed");
      const mouthOpen = document.getElementById("mouthOpen");
      const mouthInner = document.getElementById("mouthInner");
      if (!mouthClosed) return;
      if (open) {
        mouthClosed.setAttribute("opacity", "0");
        mouthOpen.setAttribute("opacity", "1");
        mouthInner.setAttribute("ry", String(3 + Math.random() * 4));
      } else {
        mouthClosed.setAttribute("opacity", "1");
        mouthOpen.setAttribute("opacity", "0");
        mouthInner.setAttribute("ry", "0");
      }
    }, 120 + Math.random() * 80);
  }

  stopLipSync() {
    if (this.lipTimer) { clearInterval(this.lipTimer); this.lipTimer = null; }
    const mouthClosed = document.getElementById("mouthClosed");
    const mouthOpen = document.getElementById("mouthOpen");
    const mouthInner = document.getElementById("mouthInner");
    if (mouthClosed) mouthClosed.setAttribute("opacity", "1");
    if (mouthOpen) mouthOpen.setAttribute("opacity", "0");
    if (mouthInner) mouthInner.setAttribute("ry", "0");
  }

  destroy() {
    clearTimeout(this.blinkTimer);
    clearInterval(this.swayTimer);
    this.stopLipSync();
  }
}
