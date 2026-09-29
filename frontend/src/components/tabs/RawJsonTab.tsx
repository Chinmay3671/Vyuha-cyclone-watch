import React, { useState } from 'react';
import { localDataService } from '../../services/dataService';

export const RawJsonTab: React.FC = () => {
  const [copied, setCopied] = useState(false);

  const payload = {
    meta: localDataService.getMeta(),
    current_frame: localDataService.getCurrentFrame(),
    pipeline: localDataService.getPipelineNodes(),
    models: localDataService.getModels(),
    feeds: localDataService.getFeeds(),
    patterns: localDataService.getPatterns(),
    features: localDataService.getExplainability(),
    forecast_track: localDataService.getForecastTrack(),
    coastal_stations: localDataService.getCoastalStations()
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(JSON.stringify(payload, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="ai-panel">
      <div className="panel-header">
        <div className="panel-title">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
          COMPLETE METEOROLOGICAL & AI INFERENCE TELEMETRY (JSON)
        </div>
        <button
          className="scan-ai-btn"
          onClick={handleCopy}
          style={{ padding: '3px 10px', fontSize: '10px' }}
        >
          {copied ? '✓ COPIED TO CLIPBOARD' : 'COPY JSON PAYLOAD'}
        </button>
      </div>

      <div style={{ marginTop: '12px' }}>
        <pre className="terminal-panel" style={{ maxHeight: '520px', overflowY: 'auto', fontSize: '11px', color: 'var(--ai-cyan)', background: '#02060E' }}>
          {JSON.stringify(payload, null, 2)}
        </pre>
      </div>
    </div>
  );
};
