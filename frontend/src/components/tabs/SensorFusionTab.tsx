import React from 'react';
import { SatelliteFeedItem } from '../../mocks/mockData';

interface SensorFusionTabProps {
  feeds: SatelliteFeedItem[];
}

export const SensorFusionTab: React.FC<SensorFusionTabProps> = ({ feeds }) => {
  return (
    <div className="ai-panel">
      <div className="panel-header">
        <div className="panel-title">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="12 2 2 7 12 12 22 7 12 2"></polygon><polyline points="2 17 12 22 22 17"></polyline><polyline points="2 12 12 17 22 12"></polyline></svg>
          MULTI-SOURCE SATELLITE & NUMERICAL RECEPTORS MATRIX
        </div>
        <span className="panel-badge" style={{ color: 'var(--status-green)' }}>7 FEEDS SYNCHRONIZED</span>
      </div>

      <div style={{ marginTop: '12px' }}>
        <table className="dense-table" style={{ width: '100%', marginBottom: '14px' }}>
          <thead>
            <tr>
              <th>PLATFORM / SENSOR</th>
              <th>OPERATING AGENCY</th>
              <th>CHANNELS / DATA TYPE</th>
              <th>SPATIAL RESOLUTION</th>
              <th>SYNC LATENCY</th>
              <th>FEED HEALTH</th>
              <th>SYSTEM STATUS</th>
            </tr>
          </thead>
          <tbody>
            {feeds.map(f => (
              <tr key={f.id}>
                <td className="mono" style={{ color: 'var(--ai-cyan)', fontWeight: 700 }}>{f.name}</td>
                <td>{f.agency}</td>
                <td>{f.band}</td>
                <td className="mono">{f.resolution}</td>
                <td className="mono" style={{ color: 'var(--ai-cyan)' }}>{f.latency}</td>
                <td className="mono">{f.healthPct}%</td>
                <td>
                  <span style={{ color: f.status === 'Active' ? 'var(--status-green)' : 'var(--status-amber)', fontWeight: 600 }}>
                    ● {f.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
          <div style={{ background: 'var(--panel-secondary)', padding: '10px', borderRadius: 'var(--radius-sm)' }}>
            <div style={{ fontSize: '11px', color: 'var(--text-dim)', marginBottom: '4px' }}>Ingestion Bandwidth</div>
            <div style={{ fontFamily: 'var(--font-heading)', fontSize: '16px', fontWeight: 700, color: 'var(--ai-cyan)' }}>148.6 MB/s</div>
            <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>Real-time HDF5/NetCDF4 decoders</div>
          </div>
          <div style={{ background: 'var(--panel-secondary)', padding: '10px', borderRadius: 'var(--radius-sm)' }}>
            <div style={{ fontSize: '11px', color: 'var(--text-dim)', marginBottom: '4px' }}>Spatial Alignment Loss</div>
            <div style={{ fontFamily: 'var(--font-heading)', fontSize: '16px', fontWeight: 700, color: 'var(--status-green)' }}>0.012 px</div>
            <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>Homography warp correction matrix</div>
          </div>
          <div style={{ background: 'var(--panel-secondary)', padding: '10px', borderRadius: 'var(--radius-sm)' }}>
            <div style={{ fontSize: '11px', color: 'var(--text-dim)', marginBottom: '4px' }}>Historical Coverage</div>
            <div style={{ fontFamily: 'var(--font-heading)', fontSize: '16px', fontWeight: 700, color: 'var(--ai-purple)' }}>1880 - 2026</div>
            <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>IBTrACS North Indian Ocean ground truth</div>
          </div>
        </div>
      </div>
    </div>
  );
};
