import React from 'react';
import { ModelMetadata, SatelliteFeedItem } from '../mocks/mockData';

interface ModelStackPanelProps {
  models: ModelMetadata[];
  feeds: SatelliteFeedItem[];
  onSelectModel: (m: ModelMetadata) => void;
}

export const ModelStackPanel: React.FC<ModelStackPanelProps> = ({
  models,
  feeds,
  onSelectModel
}) => {
  return (
    <aside className="left-col">
      {/* AI Model Stack */}
      <div className="ai-panel">
        <div className="panel-header">
          <div className="panel-title">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="2" width="20" height="8" rx="2" ry="2"></rect><rect x="2" y="14" width="20" height="8" rx="2" ry="2"></rect><line x1="6" y1="6" x2="6.01" y2="6"></line><line x1="6" y1="18" x2="6.01" y2="18"></line></svg>
            AI MODEL STACK
          </div>
          <span className="panel-badge">{models.length} ACTIVE</span>
        </div>

        <div>
          {models.map(m => (
            <div
              key={m.id}
              className="model-card"
              onClick={() => onSelectModel(m)}
              style={{ cursor: 'pointer' }}
            >
              <div className="model-card-header">
                <span className="model-name">{m.name}</span>
                <span className="model-version-tag">{m.version}</span>
              </div>
              <div className="model-task">{m.task}</div>
              <div className="model-metrics-row">
                <span>Status: <span style={{ color: 'var(--status-green)', fontWeight: 600 }}>● {m.status}</span></span>
                <span>Acc: <span style={{ color: 'var(--ai-cyan)', fontWeight: 600 }}>{m.accuracy}</span></span>
                <span>Lat: <span style={{ color: 'var(--ai-cyan)' }}>{m.latency}</span></span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Multi-Source Satellite Feeds */}
      <div className="ai-panel">
        <div className="panel-header">
          <div className="panel-title">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="12 2 2 7 12 12 22 7 12 2"></polygon><polyline points="2 17 12 22 22 17"></polyline><polyline points="2 12 12 17 22 12"></polyline></svg>
            MULTI-SOURCE FUSION
          </div>
          <span className="panel-badge" style={{ color: 'var(--status-green)' }}>7 FEEDS SYNCED</span>
        </div>

        <div>
          {feeds.map(f => (
            <div key={f.id} className="feed-item">
              <div>
                <span className="feed-dot" />
                <span style={{ color: '#fff', fontWeight: 600 }}>{f.name}</span>
                <div style={{ fontSize: '8px', color: 'var(--text-dim)', marginLeft: '11px' }}>{f.agency} • {f.band}</div>
              </div>
              <span style={{ color: 'var(--ai-cyan)', fontWeight: 600 }}>{f.latency}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Model Performance */}
      <div className="ai-panel">
        <div className="panel-header">
          <div className="panel-title">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 20V10M12 20V4M6 20v-6"></path></svg>
            AI MODEL PERFORMANCE
          </div>
          <span className="panel-badge">DEMO METRICS</span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px' }}>
          <div style={{ background: 'var(--panel-secondary)', padding: '6px', borderRadius: 'var(--radius-sm)', textAlign: 'center' }}>
            <div style={{ fontFamily: 'var(--font-heading)', fontSize: '15px', fontWeight: 700, color: 'var(--ai-cyan)' }}>94.2%</div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '8px', color: 'var(--text-dim)' }}>Detection Acc</div>
          </div>
          <div style={{ background: 'var(--panel-secondary)', padding: '6px', borderRadius: 'var(--radius-sm)', textAlign: 'center' }}>
            <div style={{ fontFamily: 'var(--font-heading)', fontSize: '15px', fontWeight: 700, color: 'var(--ai-cyan)' }}>91.4%</div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '8px', color: 'var(--text-dim)' }}>Pattern Acc</div>
          </div>
          <div style={{ background: 'var(--panel-secondary)', padding: '6px', borderRadius: 'var(--radius-sm)', textAlign: 'center' }}>
            <div style={{ fontFamily: 'var(--font-heading)', fontSize: '15px', fontWeight: 700, color: 'var(--ai-cyan)' }}>6.8 kt</div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '8px', color: 'var(--text-dim)' }}>Intensity MAE</div>
          </div>
          <div style={{ background: 'var(--panel-secondary)', padding: '6px', borderRadius: 'var(--radius-sm)', textAlign: 'center' }}>
            <div style={{ fontFamily: 'var(--font-heading)', fontSize: '15px', fontWeight: 700, color: 'var(--ai-cyan)' }}>42 km</div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '8px', color: 'var(--text-dim)' }}>24h Track Error</div>
          </div>
        </div>
      </div>
    </aside>
  );
};
