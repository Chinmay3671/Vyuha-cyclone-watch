import React from 'react';
import { MOCK_COASTAL_STATIONS } from '../../mocks/mockData';

export const DisasterRiskTab: React.FC = () => {
  return (
    <div className="ai-panel">
      <div className="panel-header">
        <div className="panel-title">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
          DISASTER INTELLIGENCE & COASTAL IMPACT EARLY WARNING
        </div>
        <span className="panel-badge" style={{ color: 'var(--status-red)' }}>RISK LEVEL: SEVERE (78/100)</span>
      </div>

      <div style={{ marginTop: '12px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '14px', marginBottom: '14px' }}>
          <div style={{ background: 'var(--panel-secondary)', padding: '14px', borderRadius: 'var(--radius-sm)', borderLeft: '3px solid var(--status-red)' }}>
            <div style={{ fontFamily: 'var(--font-heading)', fontSize: '13px', color: 'var(--status-red)', fontWeight: 700, marginBottom: '8px' }}>
              PRIMARY COASTAL IMPACT EVALUATION
            </div>
            <ul style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--text-primary)', lineHeight: 1.7, paddingLeft: '16px' }}>
              <li><b>Rapid Intensification:</b> DeepIntense neural net detected +20 kt/24h surge rate.</li>
              <li><b>Projected Landfall Window:</b> 01-Oct 18:00 UTC &plusmn; 4 hours (Gopalpur - Kalingapatnam corridor).</li>
              <li><b>Maximum Storm Surge:</b> <span style={{ color: 'var(--status-red)', fontWeight: 700 }}>3.8m to 4.2m</span> above astronomical tide.</li>
              <li><b>Extreme Precipitation:</b> 250-350 mm in 24h over Ganjam, Puri, and Srikakulam districts.</li>
              <li><b>Wind Field Extent:</b> 50 kt gale winds extending up to 180 km radius from center.</li>
            </ul>
          </div>

          <div style={{ background: 'var(--panel-secondary)', padding: '14px', borderRadius: 'var(--radius-sm)', borderLeft: '3px solid var(--ai-cyan)' }}>
            <div style={{ fontFamily: 'var(--font-heading)', fontSize: '13px', color: 'var(--ai-cyan)', fontWeight: 700, marginBottom: '8px' }}>
              NDRF EVACUATION & ACTION DIRECTIVES
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '11px', fontFamily: 'var(--font-mono)' }}>
              <div style={{ background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.3)', padding: '6px 8px', borderRadius: '4px' }}>
                <b style={{ color: 'var(--status-red)' }}>PRIORITY 1:</b> Immediate evacuation of low-lying coastal tracts in Ganjam & Srikakulam.
              </div>
              <div style={{ background: 'rgba(245,158,11,0.15)', border: '1px solid rgba(245,158,11,0.3)', padding: '6px 8px', borderRadius: '4px' }}>
                <b style={{ color: 'var(--status-amber)' }}>PRIORITY 2:</b> Suspend all maritime operations at Paradip and Gopalpur ports.
              </div>
              <div style={{ background: 'rgba(34,211,238,0.15)', border: '1px solid rgba(34,211,238,0.3)', padding: '6px 8px', borderRadius: '4px' }}>
                <b style={{ color: 'var(--ai-cyan)' }}>PRIORITY 3:</b> Pre-position emergency telecom towers and flood relief battalions.
              </div>
            </div>
          </div>
        </div>

        <div style={{ fontFamily: 'var(--font-heading)', fontSize: '12px', fontWeight: 700, color: 'var(--ai-cyan)', marginBottom: '6px' }}>
          COASTAL VULNERABILITY MONITORING STATIONS
        </div>
        <table className="dense-table" style={{ width: '100%' }}>
          <thead>
            <tr>
              <th>STATION ID</th>
              <th>STATION NAME</th>
              <th>STATE</th>
              <th>COORDINATES</th>
              <th>DISTANCE TO EYE</th>
              <th>ESTIMATED SURGE</th>
              <th>ALERT LEVEL</th>
            </tr>
          </thead>
          <tbody>
            {MOCK_COASTAL_STATIONS.map(s => (
              <tr key={s.id}>
                <td className="mono" style={{ color: 'var(--ai-cyan)' }}>{s.id}</td>
                <td style={{ fontWeight: 600 }}>{s.name}</td>
                <td>{s.state}</td>
                <td className="mono">{s.lat.toFixed(3)}°N, {s.lng.toFixed(3)}°E</td>
                <td className="mono">{s.distKm} km</td>
                <td className="mono" style={{ color: 'var(--status-red)', fontWeight: 700 }}>{s.surgeRisk}</td>
                <td>
                  <span style={{
                    padding: '2px 6px',
                    borderRadius: '3px',
                    fontSize: '9px',
                    fontWeight: 700,
                    background: s.warning === 'RED' ? 'rgba(239,68,68,0.2)' : 'rgba(245,158,11,0.2)',
                    color: s.warning === 'RED' ? 'var(--status-red)' : 'var(--status-amber)',
                    border: `1px solid ${s.warning === 'RED' ? 'rgba(239,68,68,0.4)' : 'rgba(245,158,11,0.4)'}`
                  }}>
                    ● {s.warning} ALERT
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
