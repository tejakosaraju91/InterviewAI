// speech.js — Web Speech API wrapper for InterviewAI

const LANG_VOICE_MAP = {
  en: "en-IN", hi: "hi-IN", te: "te-IN", ta: "ta-IN",
  kn: "kn-IN", ml: "ml-IN", mr: "mr-IN", bn: "bn-IN",
  es: "es-ES", fr: "fr-FR", de: "de-DE"
};

class SpeechManager {
  constructor() {
    this.synth = window.speechSynthesis;
    this.recognition = null;
    this.currentLang = "en";
    this.onSpeakStart = null;
    this.onSpeakEnd = null;
    this.onResult = null;
    this.onListenStart = null;
    this.onListenEnd = null;
    this.onError = null;
    this.isListening = false;
    this.isSpeaking = false;
    this.voiceAvailable = true;
    this.micAvailable = "SpeechRecognition" in window || "webkitSpeechRecognition" in window;
    this._checkVoices();
  }

  _checkVoices() {
    const check = () => {
      const voices = this.synth.getVoices();
      this.voiceAvailable = voices.length > 0;
    };
    check();
    this.synth.onvoiceschanged = check;
  }

  setLang(lang) {
    this.currentLang = lang;
  }

  speak(text, onStart, onEnd) {
    if (!text) return;
    this.synth.cancel();
    const utter = new SpeechSynthesisUtterance(text);
    const langCode = LANG_VOICE_MAP[this.currentLang] || "en-IN";
    utter.lang = langCode;
    utter.rate = 0.92;
    utter.pitch = 1.05;

    // Try to find a matching voice
    const voices = this.synth.getVoices();
    const match = voices.find(v => v.lang.startsWith(langCode.split("-")[0]));
    if (match) utter.voice = match;

    utter.onstart = () => {
      this.isSpeaking = true;
      if (onStart) onStart();
      if (this.onSpeakStart) this.onSpeakStart();
    };
    utter.onend = () => {
      this.isSpeaking = false;
      if (onEnd) onEnd();
      if (this.onSpeakEnd) this.onSpeakEnd();
    };
    utter.onerror = () => {
      this.isSpeaking = false;
      if (onEnd) onEnd();
      if (this.onSpeakEnd) this.onSpeakEnd();
    };

    this.synth.speak(utter);
  }

  stopSpeaking() {
    this.synth.cancel();
    this.isSpeaking = false;
  }

  startListening(onResult, onError) {
    if (!this.micAvailable) {
      if (onError) onError("Speech recognition not supported in this browser.");
      return;
    }
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    this.recognition = new SR();
    this.recognition.lang = LANG_VOICE_MAP[this.currentLang] || "en-IN";
    this.recognition.interimResults = false;
    this.recognition.maxAlternatives = 1;
    this.recognition.continuous = false;

    this.recognition.onstart = () => {
      this.isListening = true;
      if (this.onListenStart) this.onListenStart();
    };
    this.recognition.onresult = (e) => {
      const transcript = e.results[0][0].transcript;
      if (onResult) onResult(transcript);
      if (this.onResult) this.onResult(transcript);
    };
    this.recognition.onend = () => {
      this.isListening = false;
      if (this.onListenEnd) this.onListenEnd();
    };
    this.recognition.onerror = (e) => {
      this.isListening = false;
      const msg = e.error === "not-allowed" ? "Microphone access denied. Please allow mic access." : "Speech recognition error: " + e.error;
      if (onError) onError(msg);
      if (this.onError) this.onError(msg);
      if (this.onListenEnd) this.onListenEnd();
    };

    try { this.recognition.start(); } catch (e) { if (onError) onError(e.message); }
  }

  stopListening() {
    if (this.recognition) {
      try { this.recognition.stop(); } catch (e) {}
      this.isListening = false;
    }
  }
}
