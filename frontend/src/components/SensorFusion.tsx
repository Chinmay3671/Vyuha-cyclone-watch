import React from 'react';
import { SatelliteFeed } from '../types';

interface SensorFusionProps {
  feeds: SatelliteFeed[];
}

export const SensorFusion: React.FC<SensorFusionProps> = ({ feeds }) => {
  return (
    <div className="ruled-box">
      <div className="ruled-box-header">
        <span className="ruled-box-title">MULTI-SOURCE SATELLITE & NUMERICAL RECEPTORS</span>
        <span className="mono">SYNCHRONIZATION MATRIX</span>
      </div>
      <div style={{ padding: '12px' }}>
        <table className="dense-table">
          <thead>
            <tr>
              <th>SENSOR / PLATFORM</th>
              <th>AGENCY</th>
              <th>CHANNELS / DATA TYPE</th>
              <th>RESOLUTION</th>
              <th>STATUS</th>
            </tr>
          </thead>
          <tbody>
            {feeds.map(f => (
              <tr key={f.id}>
                <td className="mono"><b>{f.name}</b></td>
                <td>{f.agency}</td>
                <td>{f.channels}</td>
                <td className="mono">{f.resolution}</td>
                <td className="mono" style={{ color: f.status === 'DELAYED' ? 'var(--status-amber)' : 'var(--status-green)' }}>
                  {f.status} ({f.sync_pct}%)
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
