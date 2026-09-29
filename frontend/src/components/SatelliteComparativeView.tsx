import React from 'react';

export const SatelliteComparativeView: React.FC = () => {
  return (
    <div className="ruled-box">
      <div className="ruled-box-header">
        <span className="ruled-box-title">MULTI-SPECTRAL SATELLITE RECEPTOR COMPARISON</span>
        <span className="mono">INSAT-3DS • 1KM GSD</span>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', padding: '12px' }}>
        <div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', fontWeight: 600, marginBottom: '6px' }}>
            CHANNEL: IR1 (10.8µm) THERMAL INFRARED
          </div>
          <img src="/assets/cyclone_ir.jpg" style={{ width: '100%', border: '1px solid var(--border-hairline)' }} alt="IR Channel" />
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--text-secondary)', marginTop: '4px' }}>
            Calibrated Temperature Scale: 188.2K (-84.9°C) to 298.6K (+25.4°C)
          </div>
        </div>
        <div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', fontWeight: 600, marginBottom: '6px' }}>
            CHANNEL: VIS (0.65µm) HIGH-RES OPTICAL
          </div>
          <img src="/assets/cyclone_vis.jpg" style={{ width: '100%', border: '1px solid var(--border-hairline)' }} alt="VIS Channel" />
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--text-secondary)', marginTop: '4px' }}>
            Albedo Normalization: Optical Reflectance (0.92) • Clear-sky Eye Contrast: High
          </div>
        </div>
      </div>
    </div>
  );
};
