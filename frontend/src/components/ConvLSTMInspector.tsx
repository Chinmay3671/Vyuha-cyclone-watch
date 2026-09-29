import React from 'react';

export const ConvLSTMInspector: React.FC = () => {
  return (
    <div className="ruled-box">
      <div className="ruled-box-header">
        <span className="ruled-box-title">ConvLSTM SPATIO-TEMPORAL ARCHITECTURE PIPELINE</span>
        <span className="mono">INPUT: [B, 12, 4, 512, 512] ➔ OUTPUT: [B, 6, 4]</span>
      </div>
      <div style={{ padding: '16px' }}>
        <table className="dense-table" style={{ marginBottom: '12px' }}>
          <thead>
            <tr>
              <th>LAYER / BLOCK</th>
              <th>OPERATIONS</th>
              <th>TENSOR DIMENSIONS</th>
              <th>PARAMETERS</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="mono"><b>01. Input Sequence</b></td>
              <td>12 Historical Frames (T-12h to T0) Multi-Spectral</td>
              <td className="mono">[B, 12, 4, 512, 512]</td>
              <td className="mono">Raw Satellite Grid</td>
            </tr>
            <tr>
              <td className="mono"><b>02. Feature Extractor</b></td>
              <td>ResNet-50 Convolutional Spatial Backbone</td>
              <td className="mono">[B, 12, 128, 64, 64]</td>
              <td className="mono">23.5M</td>
            </tr>
            <tr>
              <td className="mono"><b>03. Temporal Encoder</b></td>
              <td>Bi-Directional GRU Spatial-Temporal Block</td>
              <td className="mono">[B, 256, 32, 32]</td>
              <td className="mono">14.2M</td>
            </tr>
            <tr className="selected-row">
              <td className="mono"><b>04. ConvLSTM Recurrent</b></td>
              <td>4-Layer Convolutional LSTM Cell (Kernel 3×3)</td>
              <td className="mono">[B, 512, 32, 32]</td>
              <td className="mono">48.2M</td>
            </tr>
            <tr>
              <td className="mono"><b>05. Dual Attention</b></td>
              <td>Spatial & Atmospheric Steering Vector Attention</td>
              <td className="mono">[B, 512, 32, 32]</td>
              <td className="mono">8.4M</td>
            </tr>
            <tr>
              <td className="mono"><b>06. Dense Trajectory Head</b></td>
              <td>Multi-Head MLP Output (Lat, Lng, Vmax, MSLP)</td>
              <td className="mono">[B, 6, 4]</td>
              <td className="mono">2.1M</td>
            </tr>
          </tbody>
        </table>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
          ConvLSTM replaces internal linear matrix multiplications with convolution filters at input, forget, and output gates. This preserves the 2D spatial vortex morphology while propagating temporal kinematics across 12-hour multi-spectral time steps.
        </div>
      </div>
    </div>
  );
};
