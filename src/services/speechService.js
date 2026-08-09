/**
 * Text-to-Speech (TTS) Engine wrapping browser SpeechSynthesis API
 */
export function speakText(text, langCode = 'en', onEnd = () => {}, onError = () => {}) {
  if (!('speechSynthesis' in window)) {
    console.warn('Text-to-Speech is not supported in this browser.');
    onError('Text-to-Speech is not supported by your browser.');
    return;
  }

  // Cancel any ongoing speech
  window.speechSynthesis.cancel();

  if (!text || !text.trim()) return;

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = langCode === 'auto' ? 'en-US' : getBCP47LanguageCode(langCode);
  utterance.rate = 0.95; // Slightly natural pace
  utterance.pitch = 1.0;

  utterance.onend = () => onEnd();
  utterance.onerror = (evt) => {
    console.error('Speech synthesis error:', evt);
    onError('Failed to speak text.');
  };

  window.speechSynthesis.speak(utterance);
}

export function stopSpeaking() {
  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
}

/**
 * Speech Recognition (Speech-to-Text / Voice Dictation)
 */
export function createSpeechRecognizer(langCode = 'en-US', onResult = () => {}, onError = () => {}, onEnd = () => {}) {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

  if (!SpeechRecognition) {
    return {
      supported: false,
      start: () => onError('Speech recognition is not supported in this browser.'),
      stop: () => {}
    };
  }

  const recognition = new SpeechRecognition();
  recognition.continuous = false;
  recognition.interimResults = true;
  recognition.lang = getBCP47LanguageCode(langCode);

  recognition.onresult = (event) => {
    let transcript = '';
    for (let i = event.resultIndex; i < event.results.length; i++) {
      transcript += event.results[i][0].transcript;
    }
    onResult(transcript);
  };

  recognition.onerror = (event) => {
    console.error('Speech recognition error:', event.error);
    onError(event.error || 'Speech recognition error.');
  };

  recognition.onend = () => {
    onEnd();
  };

  return {
    supported: true,
    start: () => recognition.start(),
    stop: () => recognition.stop()
  };
}

/**
 * Map ISO 639-1 language codes to full BCP-47 locale tags for TTS & STT
 */
function getBCP47LanguageCode(code) {
  const localeMap = {
    en: 'en-US',
    es: 'es-ES',
    fr: 'fr-FR',
    de: 'de-DE',
    it: 'it-IT',
    pt: 'pt-PT',
    ru: 'ru-RU',
    zh: 'zh-CN',
    ja: 'ja-JP',
    ko: 'ko-KR',
    hi: 'hi-IN',
    ar: 'ar-SA',
    bn: 'bn-IN',
    tr: 'tr-TR',
    nl: 'nl-NL',
    pl: 'pl-PL',
    sv: 'sv-SE',
    uk: 'uk-UA',
    vi: 'vi-VN',
    th: 'th-TH',
    id: 'id-ID',
    el: 'el-GR',
    he: 'he-IL',
    ur: 'ur-PK'
  };

  return localeMap[code] || 'en-US';
}
