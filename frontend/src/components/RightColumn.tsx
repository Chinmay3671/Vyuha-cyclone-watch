import React from 'react';
import { TimelineFrameItem } from '../mocks/mockData';

interface RightColumnProps {
  currentFrame: TimelineFrameItem;
  patterns: Array<{ name: string; code: string; prob: number; isDetected: boolean; desc: string }>;
  features: Array<{ feature: string; contribution: number; val: string; desc: string }>;
}

export const RightColumn: React.FC<RightColumnProps> = ({
  currentFrame,
  patterns,
  features
}) => {
  const rings = [
    { label: 'Detection', val: currentFrame.detectionConf },
    { label: 'Pattern', val: currentFrame.cdoProb },
    { label: 'Intensity', val: 89.7 },
    { label: 'Track 48h', val: 87.8 }
  ];

  const circumference = 2 * Math.PI * 16; // r=16

  return (
    <aside className="right-col">
      {/* Circular Confidence Indicators */}
      <div className="ai-panel">
        <div className="panel-header">
          <div className="panel-title">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"></circle><path d="m9 12 2 2 4-4"></path></svg>
            AI ANALYSIS CONFIDENCE
          </div>
          <span className="panel-badge">ENSEMBLE</span>
        </div>

        <div className="confidence-rings-grid">
          {rings.map((r, i) => {
            const offset = circumference - (r.val / 100) * circumference;
            return (
              <div key={i} className="ring-card" title={`${r.label}: ${r.val}%`}>
                <div className="ring-svg-wrap">
                  <svg width="40" height="40">
                    <circle className="ring-bg" cx="20" cy="20" r="16" />
                    <circle
                      className="ring-progress"
                      cx="20"
                      cy="20"
                      r="16"
                      style={{ strokeDasharray: circumference, strokeDashoffset: offset }}
                    />
                  </svg>
                  <span className="ring-val">{Math.round(r.val)}%</span>
                </div>
                <span className="ring-label">{r.label}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Pattern Recognition (CNN) */}
      <div className="ai-panel">
        <div className="panel-header">
          <div className="panel-title">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>
            CYCLONE PATTERN RECOGNITION
          </div>
          <span className="panel-badge" style={{ color: 'var(--ai-cyan)' }}>CNN-v2.4</span>
        </div>

        <div style={{ marginBottom: '8px', fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--text-muted)' }}>
          DETECTED: <b style={{ color: 'var(--ai-cyan)' }}>CENTRAL DENSE OVERCAST ({currentFrame.cdoProb}%)</b>
        </div>

        <div>
          {patterns.map((p) => (
            <div key={p.code} className={`pattern-row ${p.isDetected ? 'detected-pattern' : ''}`}>
              <div className="pattern-row-header">
                <span>{p.isDetected ? '✓ ' : ''}{p.name}</span>
                <span className="mono" style={{ color: p.isDetected ? 'var(--ai-cyan)' : 'var(--text-muted)', fontWeight: 700 }}>
                  {p.prob}%
                </span>
              </div>
              <div className="pattern-prob-bar">
                <div className="pattern-prob-fill" style={{ width: `${p.prob}%` }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Intensity AI */}
      <div className="ai-panel">
        <div className="panel-header">
          <div className="panel-title">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline></svg>
            AI INTENSITY ESTIMATION
          </div>
          <span className="panel-badge" style={{ color: 'var(--ai-cyan)' }}>DeepIntense-v3</span>
        </div>

        <div className="intensity-display-grid">
          <div className="intensity-stat-box">
            <div className="intensity-stat-label">CURRENT SPEED</div>
            <div className="intensity-stat-value">
              {currentFrame.knots} <span className="unit">kt ({Math.round(currentFrame.knots * 1.852)} km/h)</span>
            </div>
          </div>
          <div className="intensity-stat-box">
            <div className="intensity-stat-label">NEXT 24H FORECAST</div>
            <div className="intensity-stat-value" style={{ color: 'var(--status-red)' }}>
              98 <span className="unit">kt (181 km/h)</span>
            </div>
          </div>
          <div className="intensity-stat-box">
            <div className="intensity-stat-label">CENTRAL PRESSURE</div>
            <div className="intensity-stat-value">
              {currentFrame.pressure} <span className="unit">hPa</span>
            </div>
          </div>
          <div className="intensity-stat-box">
            <div className="intensity-stat-label">AI TREND</div>
            <div style={{ marginTop: '2px' }}>
              <span style={{ background: 'rgba(239, 68, 68, 0.2)', color: 'var(--status-red)', border: '1px solid rgba(239, 68, 68, 0.4)', padding: '1px 5px', borderRadius: '3px', fontSize: '9px', fontWeight: 700 }}>
                ↑ INTENSIFYING
              </span>
            </div>
          </div>
        </div>

        <div className="uncertainty-box">
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
            <span>PREDICTION: <b>98 kt</b></span>
            <span>UNCERTAINTY: <b style={{ color: 'var(--ai-purple)' }}>±7 kt</b></span>
            <span>CONFIDENCE: <b style={{ color: 'var(--status-green)' }}>82%</b></span>
          </div>
          <div style={{ fontSize: '9px', color: 'var(--text-muted)' }}>
            Higher uncertainty indicates lower model confidence in outer peripheral convection.
          </div>
        </div>
      </div>

      {/* Explainability (XAI) */}
      <div className="ai-panel">
        <div className="panel-header">
          <div className="panel-title">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>
            WHY DID THE AI PREDICT THIS?
          </div>
          <span className="panel-badge">FEATURE CONTRIBUTION – DEMO</span>
        </div>

        <div>
          {features.map((f, i) => (
            <div key={i} className="xai-item">
              <div className="xai-item-top">
                <span>{f.feature}</span>
                <span className="xai-contribution-tag">+{f.contribution}%</span>
              </div>
              <div className="xai-bar">
                <div className="xai-bar-fill" style={{ width: `${f.contribution * 2.8}%` }} />
              </div>
              <div className="xai-desc">{f.desc} ({f.val})</div>
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
};
