import React, { useState } from 'react';
import { X, Trash2, Copy, Star, RotateCcw, Clock, Sparkles, Bookmark } from 'lucide-react';
import { LANGUAGES } from '../services/translationService';

export default function HistoryDrawer({
  isOpen,
  onClose,
  history,
  favorites,
  onRestore,
  onCopy,
  onToggleFavorite,
  onClearHistory
}) {
  const [activeTab, setActiveTab] = useState('history');

  if (!isOpen) return null;

  const currentList = activeTab === 'history' ? history : favorites;

  const getLangFlag = (code) => {
    const found = LANGUAGES.find((l) => l.code === code);
    return found ? found.flag : '🌐';
  };

  return (
    <div className="modal-overlay animate-fade-in" onClick={onClose}>
      <div
        className="drawer-card animate-slide-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="drawer-header">
          <div className="drawer-title-group">
            <div className="drawer-icon-box">
              <Clock size={18} />
            </div>
            <div>
              <h3>Saved Translations</h3>
              <p className="drawer-subtitle">Access your past translations & favorites</p>
            </div>
          </div>
          <button className="btn-icon-sm" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        {/* Tabs */}
        <div className="drawer-tabs-bar">
          <button
            className={`tab-btn ${activeTab === 'history' ? 'active' : ''}`}
            onClick={() => setActiveTab('history')}
          >
            <Clock size={14} /> History ({history.length})
          </button>
          <button
            className={`tab-btn ${activeTab === 'favorites' ? 'active' : ''}`}
            onClick={() => setActiveTab('favorites')}
          >
            <Bookmark size={14} /> Favorites ({favorites.length})
          </button>

          {history.length > 0 && activeTab === 'history' && (
            <button className="clear-all-btn" onClick={onClearHistory}>
              <Trash2 size={13} /> Clear All
            </button>
          )}
        </div>

        {/* List Content */}
        <div className="drawer-list">
          {currentList.length === 0 ? (
            <div className="empty-history-box">
              <Sparkles size={28} className="empty-sparkle" />
              <p>
                {activeTab === 'history'
                  ? 'No translation history yet. Try translating some text!'
                  : 'No favorite translations saved yet.'}
              </p>
            </div>
          ) : (
            currentList.map((item) => (
              <div key={item.id} className="history-card-item">
                <div className="history-card-body">
                  <div className="history-meta-row">
                    <span className="history-badge-lang">
                      {getLangFlag(item.sourceLang)} {item.sourceLang.toUpperCase()} → {getLangFlag(item.targetLang)} {item.targetLang.toUpperCase()}
                    </span>
                    <span className="history-time">{item.timestamp}</span>
                  </div>
                  <div className="history-text-source">{item.sourceText}</div>
                  <div className="history-text-target">{item.targetText}</div>
                </div>

                <div className="history-card-actions">
                  <button
                    className="action-btn-mini"
                    onClick={() => {
                      onRestore(item);
                      onClose();
                    }}
                    title="Load into translator"
                  >
                    <RotateCcw size={15} />
                  </button>

                  <button
                    className="action-btn-mini"
                    onClick={() => onCopy(item.targetText)}
                    title="Copy translation"
                  >
                    <Copy size={15} />
                  </button>

                  <button
                    className={`action-btn-mini ${item.isFavorite ? 'active-fav' : ''}`}
                    onClick={() => onToggleFavorite(item)}
                    title="Toggle Favorite"
                  >
                    <Star size={15} fill={item.isFavorite ? '#f59e0b' : 'none'} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
