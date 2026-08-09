import React, { useState } from 'react';
import { ArrowLeftRight, ChevronDown, Search, X, Check } from 'lucide-react';
import { LANGUAGES, POPULAR_LANGUAGES } from '../services/translationService';

export default function LanguageSelector({
  sourceLang,
  targetLang,
  onSourceChange,
  onTargetChange,
  onSwap
}) {
  const [activeModal, setActiveModal] = useState(null); // 'source' | 'target' | null
  const [searchQuery, setSearchQuery] = useState('');

  const currentSourceObj = LANGUAGES.find((l) => l.code === sourceLang) || LANGUAGES[0];
  const currentTargetObj = LANGUAGES.find((l) => l.code === targetLang) || LANGUAGES[1];

  const filteredLanguages = LANGUAGES.filter((l) => {
    if (activeModal === 'target' && l.code === 'auto') return false;
    return (
      l.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.code.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  const handleSelectLanguage = (code) => {
    if (activeModal === 'source') {
      onSourceChange(code);
    } else if (activeModal === 'target') {
      onTargetChange(code);
    }
    setActiveModal(null);
    setSearchQuery('');
  };

  return (
    <div className="language-bar-container glass-panel">
      <div className="language-bar-inner">
        {/* Source Language Column */}
        <div className="lang-col">
          <button
            className="lang-select-trigger"
            onClick={() => setActiveModal('source')}
          >
            <span className="lang-trigger-info">
              <span className="lang-flag">{currentSourceObj.flag}</span>
              <span className="lang-name">{currentSourceObj.name}</span>
            </span>
            <ChevronDown size={15} className="chevron-icon" />
          </button>

          {/* Quick Pills */}
          <div className="quick-pills">
            <button
              className={`pill-btn ${sourceLang === 'auto' ? 'active' : ''}`}
              onClick={() => onSourceChange('auto')}
            >
              Auto
            </button>
            {POPULAR_LANGUAGES.map((code) => {
              const item = LANGUAGES.find((l) => l.code === code);
              if (!item) return null;
              return (
                <button
                  key={`src-pill-${code}`}
                  className={`pill-btn ${sourceLang === code ? 'active' : ''}`}
                  onClick={() => onSourceChange(code)}
                >
                  <span className="pill-flag">{item.flag}</span> {item.name.split(' ')[0]}
                </button>
              );
            })}
          </div>
        </div>

        {/* Swap Button */}
        <div className="swap-wrapper">
          <button
            className="swap-btn"
            onClick={onSwap}
            disabled={sourceLang === 'auto'}
            title={sourceLang === 'auto' ? 'Cannot swap when source is Auto Detect' : 'Swap languages'}
          >
            <ArrowLeftRight size={16} />
          </button>
        </div>

        {/* Target Language Column */}
        <div className="lang-col">
          <button
            className="lang-select-trigger"
            onClick={() => setActiveModal('target')}
          >
            <span className="lang-trigger-info">
              <span className="lang-flag">{currentTargetObj.flag}</span>
              <span className="lang-name">{currentTargetObj.name}</span>
            </span>
            <ChevronDown size={15} className="chevron-icon" />
          </button>

          {/* Quick Pills */}
          <div className="quick-pills">
            {POPULAR_LANGUAGES.map((code) => {
              const item = LANGUAGES.find((l) => l.code === code);
              if (!item) return null;
              return (
                <button
                  key={`tgt-pill-${code}`}
                  className={`pill-btn ${targetLang === code ? 'active' : ''}`}
                  onClick={() => onTargetChange(code)}
                >
                  <span className="pill-flag">{item.flag}</span> {item.name.split(' ')[0]}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Language Selector Modal */}
      {activeModal && (
        <div className="modal-overlay" onClick={() => setActiveModal(null)}>
          <div
            className="modal-card"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-header">
              <h3>Select {activeModal === 'source' ? 'Source' : 'Target'} Language</h3>
              <button
                className="btn-icon-sm"
                onClick={() => setActiveModal(null)}
              >
                <X size={16} />
              </button>
            </div>

            {/* Search Bar */}
            <div className="search-bar">
              <Search size={15} className="search-icon" />
              <input
                type="text"
                placeholder="Search language or code..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                autoFocus
              />
              {searchQuery && (
                <button className="clear-search-btn" onClick={() => setSearchQuery('')}>
                  <X size={13} />
                </button>
              )}
            </div>

            {/* Languages Grid */}
            <div className="languages-grid">
              {filteredLanguages.map((l) => {
                const isSelected =
                  activeModal === 'source' ? sourceLang === l.code : targetLang === l.code;
                return (
                  <button
                    key={l.code}
                    className={`lang-option-card ${isSelected ? 'selected' : ''}`}
                    onClick={() => handleSelectLanguage(l.code)}
                  >
                    <span className="lang-option-flag">{l.flag}</span>
                    <span className="lang-option-name">{l.name}</span>
                    {isSelected && <Check size={14} />}
                  </button>
                );
              })}

              {filteredLanguages.length === 0 && (
                <div className="no-results-box">
                  No languages found matching "{searchQuery}"
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
