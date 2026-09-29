import React from 'react';

interface TerminalLogsProps {
  logs: Array<{ time: string; msg: string }>;
}

export const TerminalLogs: React.FC<TerminalLogsProps> = ({ logs }) => {
  return (
    <div className="ai-panel" style={{ marginTop: '12px' }}>
      <div className="panel-header">
        <div className="panel-title">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="4 17 10 11 4 5"></polyline><line x1="12" y1="19" x2="20" y2="19"></line></svg>
          LIVE AI INFERENCE LOG & PIPELINE STREAM
        </div>
        <span className="panel-badge" style={{ color: 'var(--status-green)' }}>CUDA:0 ACTIVE • 42ms LATENCY</span>
      </div>

      <div className="terminal-panel">
        {logs.map((l, idx) => (
          <div key={idx} className="terminal-line">
            <span className="terminal-time">[{l.time}]</span>
            <span className={`terminal-msg ${l.msg.includes('completed') || l.msg.includes('published') || l.msg.includes('INFERENCE') ? 'highlight' : ''}`}>
              {l.msg}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
