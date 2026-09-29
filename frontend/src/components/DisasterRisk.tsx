import React from 'react';
import { CycloneTelemetry } from '../types';

interface DisasterRiskProps {
  telemetry: CycloneTelemetry;
}

export const DisasterRisk: React.FC<DisasterRiskProps> = ({ telemetry }) => {
  const risk = telemetry.disaster_risk;

  return (
    <div className="ruled-box">
      <div className="ruled-box-header">
        <span className="ruled-box-title">DISASTER INTELLIGENCE & EARLY WARNING DISPATCH</span>
        <span className="mono" style={{ color: 'var(--accent)', fontWeight: 700 }}>
          RISK SCORE: {risk.score} / 100 ({risk.level})
        </span>
      </div>
      <div style={{ padding: '16px' }}>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', fontWeight: 600, marginBottom: '8px' }}>
          PRIMARY RISK FACTORS (AI RISK ENGINE EVALUATION):
        </div>
        <ul style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', paddingLeft: '20px', color: 'var(--text-primary)', lineHeight: 1.6 }}>
          <li>Rapid intensification threshold (+20 kt/24h) triggered by DeepIntense regression</li>
          <li>Track steering vector aligned with high Sea Surface Temperature (SST &gt; 30.5°C)</li>
          <li>Coastal proximity decreasing: Landfall ETA {risk.coastal_landfall_eta}</li>
          <li>Estimated Storm Surge Height: <b>{risk.estimated_surge_m}</b> (Gopalpur-Puri-Paradip coastal swath)</li>
        </ul>
      </div>
    </div>
  );
};
