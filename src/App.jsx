import React, { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import Header from './components/Header';
import LanguageSelector from './components/LanguageSelector';
import TranslationCard from './components/TranslationCard';
import HistoryDrawer from './components/HistoryDrawer';
import ApiSettingsModal from './components/ApiSettingsModal';
import Toast from './components/Toast';

import { translateText } from './services/translationService';
import { speakText, stopSpeaking, createSpeechRecognizer } from './services/speechService';

export default function App() {
  // Theme state
  const [theme, setTheme] = useState(() => localStorage.getItem('polyglot_theme') || 'dark');

  // Translation State
  const [sourceText, setSourceText] = useState('');
  const [targetText, setTargetText] = useState('');
  const [sourceLang, setSourceLang] = useState('auto');
  const [targetLang, setTargetLang] = useState('es');
  const [isLoading, setIsLoading] = useState(false);
  const [detectedSource, setDetectedSource] = useState(null);
  const [provider, setProvider] = useState('');

  // Audio / Speech State
  const [isListening, setIsListening] = useState(false);
  const [isSpeakingSource, setIsSpeakingSource] = useState(false);
  const [isSpeakingTarget, setIsSpeakingTarget] = useState(false);
  const recognizerRef = useRef(null);

  // History & Favorites State
  const [history, setHistory] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('polyglot_history') || '[]');
    } catch {
      return [];
    }
  });

  const [apiKey, setApiKey] = useState(() => localStorage.getItem('polyglot_apikey') || '');

  // UI Modals
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [copiedTarget, setCopiedTarget] = useState(false);
  const [toasts, setToasts] = useState([]);

  // Sync theme attribute to HTML document root
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('polyglot_theme', theme);
  }, [theme]);

  // Sync history to localStorage
  useEffect(() => {
    localStorage.setItem('polyglot_history', JSON.stringify(history));
  }, [history]);

  // Toast Helper
  const addToast = (message, type = 'info') => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3500);
  };

  // Perform Translation
  const handleTranslate = async () => {
    if (!sourceText || !sourceText.trim()) return;

    setIsLoading(true);
    try {
      const result = await translateText(sourceText, sourceLang, targetLang, { customApiKey: apiKey });
      setTargetText(result.translatedText);
      setDetectedSource(result.detectedSource);
      setProvider(result.provider);

      // Save to history list
      const newItem = {
        id: Date.now().toString(),
        sourceText: sourceText.trim(),
        targetText: result.translatedText,
        sourceLang: sourceLang === 'auto' && result.detectedSource ? result.detectedSource : sourceLang,
        targetLang,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isFavorite: false
      };

      setHistory((prev) => [newItem, ...prev.filter((h) => h.sourceText !== newItem.sourceText || h.targetLang !== targetLang).slice(0, 49)]);
    } catch (error) {
      console.error('Translation error:', error);
      addToast(error.message || 'Translation failed.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  // Language Swap
  const handleSwap = () => {
    if (sourceLang === 'auto') return;
    const prevSrc = sourceLang;
    const prevTgt = targetLang;
    const prevSrcText = sourceText;
    const prevTgtText = targetText;

    setSourceLang(prevTgt);
    setTargetLang(prevSrc);
    setSourceText(prevTgtText);
    setTargetText(prevSrcText);
  };

  // Copy to Clipboard
  const handleCopy = (text) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopiedTarget(true);
    addToast('Copied to clipboard!', 'success');
    setTimeout(() => setCopiedTarget(false), 2000);
  };

  // Speech Dictation (Voice Input)
  const toggleListening = () => {
    if (isListening) {
      if (recognizerRef.current) recognizerRef.current.stop();
      setIsListening(false);
      return;
    }

    const rec = createSpeechRecognizer(
      sourceLang === 'auto' ? 'en-US' : sourceLang,
      (transcript) => {
        setSourceText(transcript);
      },
      (errMessage) => {
        addToast(`Voice Input: ${errMessage}`, 'error');
        setIsListening(false);
      },
      () => {
        setIsListening(false);
      }
    );

    recognizerRef.current = rec;
    if (rec.supported) {
      rec.start();
      setIsListening(true);
      addToast('Listening... Speak now!', 'info');
    } else {
      addToast('Speech recognition not supported in this browser.', 'error');
    }
  };

  // Speech Synthesis (TTS Read Aloud)
  const handleSpeak = (text, langCode, mode) => {
    if (!text) return;
    stopSpeaking();

    if (mode === 'source') setIsSpeakingSource(true);
    if (mode === 'target') setIsSpeakingTarget(true);

    speakText(
      text,
      langCode,
      () => {
        setIsSpeakingSource(false);
        setIsSpeakingTarget(false);
      },
      (err) => {
        setIsSpeakingSource(false);
        setIsSpeakingTarget(false);
        addToast(err, 'error');
      }
    );
  };

  // Toggle Favorite Item
  const handleToggleFavorite = (item) => {
    setHistory((prev) =>
      prev.map((h) => {
        if (h.id === item.id) {
          const nextState = !h.isFavorite;
          if (nextState) {
            confetti({ particleCount: 40, spread: 60, origin: { y: 0.7 } });
            addToast('Saved to favorites!', 'success');
          }
          return { ...h, isFavorite: nextState };
        }
        return h;
      })
    );
  };

  // Restore history item to editor
  const handleRestore = (item) => {
    setSourceText(item.sourceText);
    setTargetText(item.targetText);
    setSourceLang(item.sourceLang);
    setTargetLang(item.targetLang);
    addToast('Restored translation to editor', 'info');
  };

  // Check if current item is favorited
  const currentFavorite = history.find(
    (h) => h.sourceText === sourceText.trim() && h.targetText === targetText
  );

  return (
    <div className="app-container">
      <Header
        theme={theme}
        onToggleTheme={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
        onOpenHistory={() => setIsHistoryOpen(true)}
        onOpenSettings={() => setIsSettingsOpen(true)}
        historyCount={history.length}
      />

      <main className="main-content">
        <LanguageSelector
          sourceLang={sourceLang}
          targetLang={targetLang}
          onSourceChange={(code) => setSourceLang(code)}
          onTargetChange={(code) => setTargetLang(code)}
          onSwap={handleSwap}
        />

        <TranslationCard
          sourceText={sourceText}
          targetText={targetText}
          onSourceChange={setSourceText}
          onTranslate={handleTranslate}
          isLoading={isLoading}
          sourceLang={sourceLang}
          targetLang={targetLang}
          detectedSource={detectedSource}
          provider={provider}
          isListening={isListening}
          onToggleListening={toggleListening}
          onSpeak={handleSpeak}
          isSpeakingSource={isSpeakingSource}
          isSpeakingTarget={isSpeakingTarget}
          onCopy={handleCopy}
          copiedTarget={copiedTarget}
          onSaveFavorite={() => {
            if (currentFavorite) {
              handleToggleFavorite(currentFavorite);
            } else if (sourceText && targetText) {
              const newFav = {
                id: Date.now().toString(),
                sourceText: sourceText.trim(),
                targetText,
                sourceLang,
                targetLang,
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                isFavorite: true
              };
              setHistory((prev) => [newFav, ...prev]);
              confetti({ particleCount: 40, spread: 60, origin: { y: 0.7 } });
              addToast('Saved to favorites!', 'success');
            }
          }}
          isFavorite={currentFavorite?.isFavorite || false}
          onClear={() => {
            setSourceText('');
            setTargetText('');
            setDetectedSource(null);
          }}
        />
      </main>

      <HistoryDrawer
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        history={history}
        favorites={history.filter((h) => h.isFavorite)}
        onRestore={handleRestore}
        onCopy={handleCopy}
        onToggleFavorite={handleToggleFavorite}
        onClearHistory={() => {
          setHistory([]);
          addToast('History cleared', 'info');
        }}
      />

      <ApiSettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        apiKey={apiKey}
        onSaveApiKey={(key) => {
          setApiKey(key);
          localStorage.setItem('polyglot_apikey', key);
        }}
        onAddToast={addToast}
      />

      <Toast toasts={toasts} />
    </div>
  );
}
