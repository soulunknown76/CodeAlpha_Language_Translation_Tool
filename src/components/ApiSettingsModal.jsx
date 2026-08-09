import React, { useState } from 'react';
import { X, ShieldCheck, Key, Zap, Check } from 'lucide-react';

export default function ApiSettingsModal({ isOpen, onClose, apiKey, onSaveApiKey, onAddToast }) {
  const [keyInput, setKeyInput] = useState(apiKey || '');

  if (!isOpen) return null;

  const handleSave = (e) => {
    e.preventDefault();
    onSaveApiKey(keyInput.trim());
    onAddToast('API Settings updated successfully!', 'success');
    onClose();
  };

  return (
    <div className="modal-overlay animate-fade-in" onClick={onClose}>
      <div className="modal-card animate-scale-up" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title-group">
            <div className="modal-title-icon-box">
              <Zap size={18} />
            </div>
            <div>
              <h3>API & Engine Settings</h3>
              <p className="modal-subtitle">Configure translation provider & API keys</p>
            </div>
          </div>
          <button className="btn-icon-sm" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        {/* Free Engine Banner */}
        <div className="free-engine-banner">
          <div className="banner-title">
            <ShieldCheck size={18} />
            <span>Free Public Engine Active</span>
          </div>
          <p className="banner-text">
            By default, PolyGlot AI uses the <strong>MyMemory API</strong> and public translation nodes. No paid API key is required!
          </p>
        </div>

        {/* Optional Custom Key */}
        <form onSubmit={handleSave} className="api-form">
          <label className="form-label">
            Optional Custom MyMemory / Google Translate API Key
          </label>
          <div className="input-group-custom">
            <Key size={16} className="input-icon" />
            <input
              type="password"
              placeholder="Paste custom API key (Optional)..."
              value={keyInput}
              onChange={(e) => setKeyInput(e.target.value)}
            />
          </div>

          <div className="modal-footer-btns">
            <button
              type="button"
              className="btn-secondary"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-primary-sm"
            >
              <Check size={16} /> Save Settings
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
