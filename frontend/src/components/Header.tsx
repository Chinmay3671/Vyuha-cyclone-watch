import React from 'react';

interface HeaderProps {
  activeTab: string;
  onSelectTab: (tab: string) => void;
  audioMuted: boolean;
  onToggleAudio: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  onSelectTab,
  audioMuted,
  onToggleAudio
}) => {
  return (
    <header className="main-header">
        <div className="brand-wrapper">
          <div className="brand-icon">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--ai-cyan)" strokeWidth="2">
              <circle cx="12" cy="12" r="9"></circle>
              <path d="M12 3a9 9 0 0 1 9 9c0 4.97-4.03 9-9 9"></path>
              <path d="M12 7a5 5 0 0 1 5 5"></path>
              <circle cx="12" cy="12" r="2" fill="var(--ai-cyan)"></circle>
            </svg>
          </div>
          <div className="brand-text">
            <h1>VYUHA <span className="ai-tag">AI CYCLONE WATCH</span></h1>
            <div className="sub-title">
              TROPICAL CYCLONE INTELLIGENCE & TRAJECTORY PREDICTION ENGINE • BOB-04/2026
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="nav-tabs">
          <button className={`nav-tab-btn ${activeTab === 'dashboard' ? 'active' : ''}`} onClick={() => onSelectTab('dashboard')}>
            AI Dashboard
          </button>
          <button className={`nav-tab-btn ${activeTab === 'vision-studio' ? 'active' : ''}`} onClick={() => onSelectTab('vision-studio')}>
            Satellite AI Studio
          </button>
          <button className={`nav-tab-btn ${activeTab === 'convlstm' ? 'active' : ''}`} onClick={() => onSelectTab('convlstm')}>
            ConvLSTM Inspector
          </button>
          <button className={`nav-tab-btn ${activeTab === 'fusion' ? 'active' : ''}`} onClick={() => onSelectTab('fusion')}>
            Multi-Source Fusion
          </button>
          <button className={`nav-tab-btn ${activeTab === 'risk' ? 'active' : ''}`} onClick={() => onSelectTab('risk')}>
            Disaster AI Risk
          </button>
          <button className={`nav-tab-btn ${activeTab === 'raw-json' ? 'active' : ''}`} onClick={() => onSelectTab('raw-json')}>
            Raw AI JSON
          </button>
        </div>

        {/* Telemetry Chips */}
        <div className="header-telemetry">
          <div className="status-chip primary">
            <div className="pulse-dot cyan"></div>
            <span>AI ENGINE ONLINE</span>
          </div>
          <div className="status-chip success">
            <div className="pulse-dot"></div>
            <span>SATELLITE INGESTION: LIVE</span>
          </div>
          <div className="status-chip">
            <span>MODEL: <b>READY</b></span>
          </div>
          <div className="status-chip">
            <span>GPU: <b style={{ color: 'var(--status-green)' }}>A100 (42ms)</b></span>
          </div>
          <button className="sound-toggle-btn" onClick={onToggleAudio} title="Toggle Audio Feedback">
            {audioMuted ? (
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><line x1="23" y1="9" x2="17" y2="15"></line><line x1="17" y1="9" x2="23" y2="15"></line></svg>
            ) : (
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path></svg>
            )}
          </button>
        </div>
      </header>
  );
};
