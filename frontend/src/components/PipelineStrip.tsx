import React from 'react';
import { PipelineNodeItem } from '../mocks/mockData';

interface PipelineStripProps {
  nodes: PipelineNodeItem[];
  activeStep: number;
  onSelectStep: (id: number) => void;
}

export const PipelineStrip: React.FC<PipelineStripProps> = ({ nodes, activeStep, onSelectStep }) => {
  return (
    <section className="pipeline-section">
      <div className="pipeline-card">
        <div className="pipeline-header">
          <h2>END-TO-END AI INFERENCE PIPELINE (PS 26070 WORKFLOW)</h2>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--text-dim)' }}>
            PIPELINE LATENCY: <b>42 ms</b> • ACTIVE PIPELINE: <b>YOLOv8 ➔ CNN ➔ DeepIntense ➔ ConvLSTM</b>
          </div>
        </div>

        <div className="pipeline-nodes-container">
          {nodes.map((n, idx) => (
            <React.Fragment key={n.id}>
              <div
                className={`pipeline-node ${activeStep === n.id ? 'active-stage' : ''}`}
                onClick={() => onSelectStep(n.id)}
              >
                <div className="node-top">
                  <span className="mono" style={{ fontSize: '10px', fontWeight: 700, color: 'var(--ai-cyan)' }}>
                    0{n.id}
                  </span>
                  <span className={`node-status-badge ${n.statusClass}`}>
                    <span className={`pulse-dot ${n.statusClass === 'live' ? '' : 'cyan'}`}></span>
                    {n.status}
                  </span>
                </div>
                <div className="node-title">{n.title}</div>
                <div className="node-model">{n.model}</div>
                <div className="node-metric">
                  <span style={{ color: 'var(--text-dim)', fontSize: '9px' }}>{n.metricName}</span>
                  <span style={{ color: '#fff', fontWeight: 700 }}>{n.metricVal}</span>
                </div>
              </div>

              {idx < nodes.length - 1 && (
                <div className="pipeline-arrow">➔</div>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
    </section>
  );
};
