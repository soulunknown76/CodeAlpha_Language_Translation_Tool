import React from 'react';
import {
  Copy,
  Check,
  Volume2,
  Mic,
  MicOff,
  Trash2,
  Star,
  Sparkles,
  Loader2,
  CornerDownLeft
} from 'lucide-react';

export default function TranslationCard({
  sourceText,
  targetText,
  onSourceChange,
  onTranslate,
  isLoading,
  sourceLang,
  targetLang,
  detectedSource,
  provider,
  isListening,
  onToggleListening,
  onSpeak,
  isSpeakingSource,
  isSpeakingTarget,
  onCopy,
  copiedTarget,
  onSaveFavorite,
  isFavorite,
  onClear
}) {
  const maxChars = 1000;
  const charCount = sourceText.length;

  const handleKeyDown = (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault();
      onTranslate();
    }
  };

  return (
    <div className="translator-container">
      <div className="translation-grid">
        {/* Source Text Box */}
        <div className="translation-card glass-panel">
          <div className="card-header">
            <div className="header-left">
              <span className="card-tag">Input Text</span>
              {detectedSource && (
                <span className="badge-detected">
                  Detected: {detectedSource}
                </span>
              )}
            </div>

            {sourceText && (
              <button
                className="action-btn-sm"
                onClick={onClear}
                title="Clear input text"
              >
                <Trash2 size={15} />
              </button>
            )}
          </div>

          <div className="textarea-wrapper">
            <textarea
              className="translation-textarea"
              placeholder="Type or paste text here to translate... (Ctrl + Enter to trigger)"
              value={sourceText}
              onChange={(e) => onSourceChange(e.target.value.slice(0, maxChars))}
              onKeyDown={handleKeyDown}
            />
          </div>

          <div className="card-footer">
            <div className="footer-actions">
              {/* Mic Voice Dictation Button */}
              <button
                className={`icon-action-btn ${isListening ? 'listening-active' : ''}`}
                onClick={onToggleListening}
                title={isListening ? 'Stop listening' : 'Speak to input text'}
              >
                {isListening ? <MicOff size={16} /> : <Mic size={16} />}
              </button>

              {/* Speak Input Text */}
              <button
                className={`icon-action-btn ${isSpeakingSource ? 'speaking-active' : ''}`}
                onClick={() => onSpeak(sourceText, sourceLang, 'source')}
                disabled={!sourceText.trim() || isSpeakingSource}
                title="Listen to input text"
              >
                <Volume2 size={16} />
              </button>
            </div>

            <div className={`char-counter ${charCount > maxChars * 0.9 ? 'limit-warning' : ''}`}>
              {charCount} / {maxChars}
            </div>
          </div>
        </div>

        {/* Target Translation Box */}
        <div className="translation-card glass-panel" style={{ background: 'var(--bg-card-hover)' }}>
          <div className="card-header">
            <div className="header-left">
              <span className="card-tag">Translation</span>
              {provider && (
                <span className="badge-provider">
                  via {provider}
                </span>
              )}
            </div>

            {targetText && (
              <button
                className={`action-btn-sm ${isFavorite ? 'favorite-active' : ''}`}
                onClick={onSaveFavorite}
                title={isFavorite ? 'Remove from favorites' : 'Save to favorites'}
              >
                <Star size={16} fill={isFavorite ? '#f59e0b' : 'none'} />
              </button>
            )}
          </div>

          <div className="textarea-wrapper">
            {isLoading ? (
              <div className="skeleton-container">
                <div className="skeleton-line w-90" />
                <div className="skeleton-line w-75" />
                <div className="skeleton-line w-60" />
              </div>
            ) : targetText ? (
              <div className="target-result-text">{targetText}</div>
            ) : (
              <div className="empty-placeholder">
                Translation will appear here instantly...
              </div>
            )}
          </div>

          <div className="card-footer">
            <div className="footer-actions">
              {/* Speak Target Translation */}
              <button
                className={`icon-action-btn ${isSpeakingTarget ? 'speaking-active' : ''}`}
                onClick={() => onSpeak(targetText, targetLang, 'target')}
                disabled={!targetText || isSpeakingTarget}
                title="Listen to translation"
              >
                <Volume2 size={16} />
              </button>

              {/* Copy Translation Button */}
              <button
                className={`icon-action-btn ${copiedTarget ? 'copied-success' : ''}`}
                onClick={() => onCopy(targetText)}
                disabled={!targetText}
                title="Copy translation"
              >
                {copiedTarget ? <Check size={16} /> : <Copy size={16} />}
              </button>
            </div>

            {targetText && (
              <div className="status-badge-ready">
                <Sparkles size={12} /> Ready
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Translate Button */}
      <div className="translate-cta-wrapper">
        <button
          className="btn-translate-primary"
          onClick={onTranslate}
          disabled={isLoading || !sourceText.trim()}
        >
          {isLoading ? (
            <>
              <Loader2 size={16} className="spin-loader" />
              <span>Translating...</span>
            </>
          ) : (
            <>
              <span>Translate Text</span>
              <CornerDownLeft size={15} />
            </>
          )}
        </button>
      </div>
    </div>
  );
}
