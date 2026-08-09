import React from 'react';
import { Languages, Moon, Sun, History, Settings } from 'lucide-react';

export default function Header({ theme, onToggleTheme, onOpenHistory, onOpenSettings, historyCount }) {
  return (
    <header className="app-header">
      <div className="brand">
        <div className="brand-icon">
          <Languages size={18} />
        </div>
        <div className="brand-text-container">
          <div className="brand-title-row">
            <span className="brand-title">Translate</span>
            <span className="brand-badge">MINIMAL</span>
          </div>
          <p className="brand-subtitle">
            Instant Multi-Language Translation
          </p>
        </div>
      </div>

      <div className="header-actions">
        <button
          className="btn-icon"
          onClick={onOpenHistory}
          title="Translation History"
        >
          <History size={17} />
          {historyCount > 0 && (
            <span className="badge-counter">
              {historyCount > 9 ? '9+' : historyCount}
            </span>
          )}
        </button>

        <button
          className="btn-icon"
          onClick={onOpenSettings}
          title="API Settings"
        >
          <Settings size={17} />
        </button>

        <button
          className="btn-icon"
          onClick={onToggleTheme}
          title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
        >
          {theme === 'dark' ? <Sun size={17} /> : <Moon size={17} />}
        </button>
      </div>
    </header>
  );
}
