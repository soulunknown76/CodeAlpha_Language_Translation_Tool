// Supported Languages Registry with Flags and Code mappings
export const LANGUAGES = [
  { code: 'auto', name: 'Auto Detect', flag: '✨' },
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'es', name: 'Spanish (Español)', flag: '🇪🇸' },
  { code: 'fr', name: 'French (Français)', flag: '🇫🇷' },
  { code: 'de', name: 'German (Deutsch)', flag: '🇩🇪' },
  { code: 'it', name: 'Italian (Italiano)', flag: '🇮🇹' },
  { code: 'pt', name: 'Portuguese (Português)', flag: '🇵🇹' },
  { code: 'ru', name: 'Russian (Русский)', flag: '🇷🇺' },
  { code: 'zh', name: 'Chinese (Simplified)', flag: '🇨🇳' },
  { code: 'ja', name: 'Japanese (日本語)', flag: '🇯🇵' },
  { code: 'ko', name: 'Korean (한국어)', flag: '🇰🇷' },
  { code: 'hi', name: 'Hindi (हिन्दी)', flag: '🇮🇳' },
  { code: 'ar', name: 'Arabic (العربية)', flag: '🇸🇦' },
  { code: 'bn', name: 'Bengali (বাংলা)', flag: '🇧🇩' },
  { code: 'tr', name: 'Turkish (Türkçe)', flag: '🇹🇷' },
  { code: 'nl', name: 'Dutch (Nederlands)', flag: '🇳🇱' },
  { code: 'pl', name: 'Polish (Polski)', flag: '🇵🇱' },
  { code: 'sv', name: 'Swedish (Svenska)', flag: '🇸🇪' },
  { code: 'uk', name: 'Ukrainian (Українська)', flag: '🇺🇦' },
  { code: 'vi', name: 'Vietnamese (Tiếng Việt)', flag: '🇻🇳' },
  { code: 'th', name: 'Thai (ไทย)', flag: '🇹🇭' },
  { code: 'id', name: 'Indonesian (Bahasa Indonesia)', flag: '🇮🇩' },
  { code: 'el', name: 'Greek (Ελληνικά)', flag: '🇬🇷' },
  { code: 'he', name: 'Hebrew (עברית)', flag: '🇮🇱' },
  { code: 'ur', name: 'Urdu (اردو)', flag: '🇵🇰' }
];

// Popular Language Shortcuts for Quick Select Pills
export const POPULAR_LANGUAGES = ['en', 'es', 'fr', 'de', 'zh', 'ja', 'hi', 'ar'];

/**
 * Translates text using free MyMemory API with automatic fallback.
 * @param {string} text - Input text to translate
 * @param {string} sourceLang - Source language code ('auto' or ISO 639-1)
 * @param {string} targetLang - Target language code
 * @param {Object} options - Custom configuration (customApiKey, etc.)
 */
export async function translateText(text, sourceLang = 'auto', targetLang = 'es', options = {}) {
  if (!text || !text.trim()) {
    return { translatedText: '', detectedSource: null, provider: 'None' };
  }

  const cleanText = text.trim();
  const src = sourceLang === 'auto' ? 'Autodetect' : sourceLang;
  const langPair = `${src}|${targetLang}`;

  try {
    // 1. MyMemory API Primary Call
    const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(cleanText)}&langpair=${encodeURIComponent(langPair)}`;
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    if (data.responseData && data.responseData.translatedText) {
      let translatedText = data.responseData.translatedText;
      let detectedSource = null;

      // Handle HTML entities encoded by MyMemory API (e.g. &#39; -> ')
      const parser = new DOMParser();
      const decodedDoc = parser.parseFromString(translatedText, 'text/html');
      translatedText = decodedDoc.body.textContent || translatedText;

      // Check if source was auto detected
      if (sourceLang === 'auto' && data.matches && data.matches.length > 0) {
        detectedSource = data.matches[0].created_by || data.matches[0].segment;
      }

      return {
        translatedText,
        detectedSource,
        matchQuality: data.responseData.match || 1,
        provider: 'MyMemory API'
      };
    } else {
      throw new Error(data.responseDetails || 'Translation failed');
    }
  } catch (error) {
    console.warn('Primary translation API failed, trying fallback Lingva instance...', error);

    // Fallback: Lingva Translate Public API Instance
    try {
      const lingvaSrc = sourceLang === 'auto' ? 'auto' : sourceLang;
      const fallbackUrl = `https://lingva.ml/api/v1/${lingvaSrc}/${targetLang}/${encodeURIComponent(cleanText)}`;
      const fbResponse = await fetch(fallbackUrl);
      
      if (fbResponse.ok) {
        const fbData = await fbResponse.json();
        if (fbData.translation) {
          return {
            translatedText: fbData.translation,
            detectedSource: fbData.info?.detectedSource || null,
            provider: 'Lingva API (Fallback)'
          };
        }
      }
    } catch (fbError) {
      console.error('Fallback API also failed:', fbError);
    }

    throw new Error('Unable to connect to translation server. Please check your network connection.');
  }
}
