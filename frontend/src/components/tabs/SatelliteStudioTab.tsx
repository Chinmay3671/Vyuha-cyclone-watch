import React from 'react';

export const SatelliteStudioTab: React.FC = () => {
  return (
    <div className="ai-panel">
      <div className="panel-header">
        <div className="panel-title">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="3"></circle><path d="M3 7V5a2 2 0 0 1 2-2h2"></path><path d="M17 3h2a2 2 0 0 1 2 2v2"></path><path d="M21 17v2a2 2 0 0 1-2 2h-2"></path><path d="M7 21H5a2 2 0 0 1-2-2v-2"></path></svg>
          ADVANCED AI COMPUTER VISION & FEATURE EXTRACTOR STUDIO
        </div>
        <span className="panel-badge">YOLOv8 + Grad-CAM + Morphological Kernel</span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginTop: '12px' }}>
        <div>
          <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '13px', marginBottom: '8px', color: 'var(--ai-cyan)' }}>
            INSAT-3DS High-Resolution Thermal Infrared (IR1 10.8µm)
          </h3>
          <img
            src="/assets/cyclone_ir.jpg"
            style={{ width: '100%', borderRadius: 'var(--radius-md)', border: '1px solid rgba(34,211,238,0.3)' }}
            alt="IR Channel"
          />
          <div style={{ marginTop: '8px', fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--text-dim)' }}>
            Calibrated Brightness Temp: <b>188K (-85°C) to 298K (+25°C)</b> • Sensor: INSAT-3DS Meteorological Imager
          </div>
        </div>

        <div>
          <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '13px', marginBottom: '8px', color: 'var(--ai-blue)' }}>
            Natural Color High-Resolution Visible Channel (VIS 0.65µm)
          </h3>
          <img
            src="/assets/cyclone_vis.jpg"
            style={{ width: '100%', borderRadius: 'var(--radius-md)', border: '1px solid rgba(59,130,246,0.3)' }}
            alt="VIS Channel"
          />
          <div style={{ marginTop: '8px', fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--text-dim)' }}>
            Optical Albedo: <b>0.92</b> • Pin-hole Eye Cloud Clearance: <b>98.4%</b> • Resolution: <b>1km GSD</b>
          </div>
        </div>
      </div>
    </div>
  );
};
