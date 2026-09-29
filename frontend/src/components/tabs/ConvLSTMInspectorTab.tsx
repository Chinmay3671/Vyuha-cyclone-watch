import React from 'react';

export const ConvLSTMInspectorTab: React.FC = () => {
  return (
    <div className="ai-panel">
      <div className="panel-header">
        <div className="panel-title">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="12 2 2 7 12 12 22 7 12 2"></polygon><polyline points="2 17 12 22 22 17"></polyline><polyline points="2 12 12 17 22 12"></polyline></svg>
          ConvLSTM SPATIO-TEMPORAL ARCHITECTURE PIPELINE
        </div>
        <span className="panel-badge">TENSOR FLOW: [B, 12, 4, 512, 512] ➔ [B, 6, 4]</span>
      </div>

      <div style={{ marginTop: '12px' }}>
        <table className="dense-table" style={{ marginBottom: '14px', width: '100%' }}>
          <thead>
            <tr>
              <th>STAGE / BLOCK</th>
              <th>OPERATIONS</th>
              <th>TENSOR DIMENSIONS</th>
              <th>PARAMETERS</th>
              <th>ROLE IN FORECAST</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="mono" style={{ color: 'var(--ai-cyan)' }}><b>01. Input Sequence</b></td>
              <td>12 Historical Multi-Spectral Frames (T-12h to T0)</td>
              <td className="mono">[B, 12, 4, 512, 512]</td>
              <td className="mono">Raw Satellite Grid</td>
              <td>Spatiotemporal satellite history tensor</td>
            </tr>
            <tr>
              <td className="mono" style={{ color: 'var(--ai-cyan)' }}><b>02. Feature Extractor</b></td>
              <td>ResNet-50 Convolutional Spatial Backbone</td>
              <td className="mono">[B, 12, 128, 64, 64]</td>
              <td className="mono">23.5M</td>
              <td>Vortex cloud-top gradient & boundary features</td>
            </tr>
            <tr>
              <td className="mono" style={{ color: 'var(--ai-cyan)' }}><b>03. Temporal Encoder</b></td>
              <td>Bi-Directional GRU Spatial-Temporal Block</td>
              <td className="mono">[B, 256, 32, 32]</td>
              <td className="mono">14.2M</td>
              <td>Kinematic translation speed & direction vector</td>
            </tr>
            <tr style={{ background: 'rgba(34, 211, 238, 0.08)' }}>
              <td className="mono" style={{ color: 'var(--ai-cyan)' }}><b>04. ConvLSTM Recurrent</b></td>
              <td>4-Layer Convolutional LSTM Cell (Kernel 3×3)</td>
              <td className="mono">[B, 512, 32, 32]</td>
              <td className="mono">48.2M</td>
              <td>Preserves 2D morphology while learning temporal evolution</td>
            </tr>
            <tr>
              <td className="mono" style={{ color: 'var(--ai-cyan)' }}><b>05. Dual Attention</b></td>
              <td>Spatial & Atmospheric Steering Vector Attention</td>
              <td className="mono">[B, 512, 32, 32]</td>
              <td className="mono">8.4M</td>
              <td>Focuses on eyewall contraction & subtropical ridge steering</td>
            </tr>
            <tr>
              <td className="mono" style={{ color: 'var(--ai-cyan)' }}><b>06. Dense Trajectory Head</b></td>
              <td>Multi-Head MLP Output (Lat, Lng, Vmax, MSLP)</td>
              <td className="mono">[B, 6, 4]</td>
              <td className="mono">2.1M</td>
              <td>Generates 6h, 12h, 24h, 48h, 72h waypoint predictions</td>
            </tr>
          </tbody>
        </table>

        <div style={{ background: 'var(--panel-secondary)', padding: '12px', borderRadius: 'var(--radius-sm)', borderLeft: '3px solid var(--ai-cyan)', fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
          <b>Mathematical Formulation:</b> ConvLSTM replaces standard fully connected matrix multiplications with convolution filters inside recurrent gates ($i_t, f_t, o_t, c_t$). This retains spatial structure during multi-step temporal rollout, yielding significantly lower track displacement errors (&plusmn;42km at 24h) compared to classic NWP guidance.
        </div>
      </div>
    </div>
  );
};
