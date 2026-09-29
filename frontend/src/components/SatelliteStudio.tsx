import React, { useRef, useEffect } from 'react';
import { TimelineFrameItem } from '../mocks/mockData';

interface SatelliteStudioProps {
  currentFrame: TimelineFrameItem;
  activeLayer: 'raw' | 'heatmap' | 'seg' | 'edge';
  onSelectLayer: (l: 'raw' | 'heatmap' | 'seg' | 'edge') => void;
  activeBand: 'ir' | 'vis';
  onSelectBand: (b: 'ir' | 'vis') => void;
  isScanning: boolean;
  onTriggerScan: () => void;
}

export const SatelliteStudio: React.FC<SatelliteStudioProps> = ({
  currentFrame,
  activeLayer,
  onSelectLayer,
  activeBand,
  onSelectBand,
  isScanning,
  onTriggerScan
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const renderOverlays = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const w = canvas.width;
    const h = canvas.height;
    ctx.clearRect(0, 0, w, h);

    const box = currentFrame.yoloBox || [0.2, 0.2, 0.6, 0.6];
    const bx = box[0] * w;
    const by = box[1] * h;
    const bw = box[2] * w;
    const bh = box[3] * h;
    const cx = bx + bw / 2;
    const cy = by + bh / 2;

    // 1. AI Heatmap (Grad-CAM Attention Map)
    if (activeLayer === 'heatmap') {
      const grad = ctx.createRadialGradient(cx, cy, 10, cx, cy, bw * 0.65);
      grad.addColorStop(0, 'rgba(239, 68, 68, 0.75)');
      grad.addColorStop(0.2, 'rgba(245, 158, 11, 0.65)');
      grad.addColorStop(0.5, 'rgba(34, 211, 238, 0.45)');
      grad.addColorStop(0.8, 'rgba(59, 130, 246, 0.25)');
      grad.addColorStop(1, 'rgba(0, 0, 0, 0)');

      ctx.save();
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, w, h);
      ctx.restore();
    }

    // 2. Segmentation Mask
    if (activeLayer === 'seg') {
      ctx.save();
      ctx.beginPath();
      ctx.arc(cx, cy, 16, 0, 2 * Math.PI);
      ctx.fillStyle = 'rgba(139, 92, 246, 0.7)';
      ctx.fill();
      ctx.strokeStyle = '#8B5CF6';
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(cx, cy, bw * 0.25, 0, 2 * Math.PI);
      ctx.strokeStyle = 'rgba(239, 68, 68, 0.8)';
      ctx.lineWidth = 10;
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(cx, cy, bw * 0.48, 0, 2 * Math.PI);
      ctx.strokeStyle = 'rgba(34, 211, 238, 0.6)';
      ctx.lineWidth = 6;
      ctx.stroke();
      ctx.restore();
    }

    // 3. Edge Features (Sobel filter approximation)
    if (activeLayer === 'edge') {
      ctx.save();
      ctx.strokeStyle = '#22D3EE';
      ctx.lineWidth = 1.5;
      for (let r = 25; r < bw * 0.6; r += 20) {
        ctx.beginPath();
        ctx.arc(cx, cy, r, -0.4, Math.PI * 1.6);
        ctx.stroke();
      }
      ctx.restore();
    }

    // 4. Technical YOLOv8 BBox & HUD Corner Reticles
    ctx.save();
    ctx.strokeStyle = '#22D3EE';
    ctx.lineWidth = 2;
    ctx.setLineDash([6, 4]);
    ctx.strokeRect(bx, by, bw, bh);
    ctx.setLineDash([]);

    const cornerLen = 14;
    ctx.lineWidth = 2.5;

    // TL
    ctx.beginPath();
    ctx.moveTo(bx, by + cornerLen);
    ctx.lineTo(bx, by);
    ctx.lineTo(bx + cornerLen, by);
    ctx.stroke();

    // TR
    ctx.beginPath();
    ctx.moveTo(bx + bw - cornerLen, by);
    ctx.lineTo(bx + bw, by);
    ctx.lineTo(bx + bw, by + cornerLen);
    ctx.stroke();

    // BL
    ctx.beginPath();
    ctx.moveTo(bx, by + bh - cornerLen);
    ctx.lineTo(bx, by + bh);
    ctx.lineTo(bx + cornerLen, by + bh);
    ctx.stroke();

    // BR
    ctx.beginPath();
    ctx.moveTo(bx + bw - cornerLen, by + bh);
    ctx.lineTo(bx + bw, by + bh);
    ctx.lineTo(bx + bw, by + bh - cornerLen);
    ctx.stroke();

    // Crosshair
    ctx.strokeStyle = '#EF4444';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(cx, cy, 8, 0, 2 * Math.PI);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(cx - 14, cy); ctx.lineTo(cx + 14, cy);
    ctx.moveTo(cx, cy - 14); ctx.lineTo(cx, cy + 14);
    ctx.stroke();

    // Tag
    ctx.fillStyle = 'rgba(11, 19, 34, 0.9)';
    ctx.fillRect(bx, by - 20, 180, 18);
    ctx.strokeStyle = '#22D3EE';
    ctx.lineWidth = 1;
    ctx.strokeRect(bx, by - 20, 180, 18);

    ctx.fillStyle = '#22D3EE';
    ctx.font = 'bold 10px "JetBrains Mono", monospace';
    ctx.fillText(`YOLOv8: CYCLONE (${currentFrame.detectionConf}%)`, bx + 4, by - 6);
    ctx.restore();
  };

  useEffect(() => {
    const handleResize = () => {
      const canvas = canvasRef.current;
      if (canvas && canvas.parentElement) {
        const rect = canvas.parentElement.getBoundingClientRect();
        canvas.width = rect.width;
        canvas.height = rect.height;
        renderOverlays();
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [currentFrame, activeLayer, activeBand]);

  useEffect(() => {
    renderOverlays();
  }, [currentFrame, activeLayer, activeBand]);

  return (
    <div className="satellite-vision-container">
      <div className="vision-toolbar">
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span className="pulse-dot cyan"></span>
          <span style={{ fontFamily: 'var(--font-heading)', fontSize: '12px', fontWeight: 700, color: '#fff' }}>
            AI SATELLITE VISION
          </span>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', color: 'var(--text-muted)' }}>
            INSAT-3DS • {activeBand === 'ir' ? 'IR1 (10.8µm)' : 'VIS (0.65µm)'}
          </span>
        </div>

        {/* Layer selector */}
        <div className="vision-layers-toggle">
          <button className={`layer-btn ${activeLayer === 'raw' ? 'active' : ''}`} onClick={() => onSelectLayer('raw')}>RAW SATELLITE</button>
          <button className={`layer-btn ${activeLayer === 'heatmap' ? 'active' : ''}`} onClick={() => onSelectLayer('heatmap')}>AI HEATMAP</button>
          <button className={`layer-btn ${activeLayer === 'seg' ? 'active' : ''}`} onClick={() => onSelectLayer('seg')}>SEGMENTATION</button>
          <button className={`layer-btn ${activeLayer === 'edge' ? 'active' : ''}`} onClick={() => onSelectLayer('edge')}>EDGE FEATURES</button>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <div className="vision-layers-toggle">
            <button className={`layer-btn ${activeBand === 'ir' ? 'active' : ''}`} onClick={() => onSelectBand('ir')}>IR1</button>
            <button className={`layer-btn ${activeBand === 'vis' ? 'active' : ''}`} onClick={() => onSelectBand('vis')}>VIS</button>
          </div>
          <button className="scan-ai-btn" onClick={onTriggerScan}>RUN AI SCAN</button>
        </div>
      </div>

      <div className="satellite-viewport">
        <img
          src={activeBand === 'ir' ? '/assets/cyclone_ir.jpg' : '/assets/cyclone_vis.jpg'}
          alt="Satellite Imager"
          className="satellite-image-layer"
        />
        <canvas ref={canvasRef} className="ai-canvas-overlay" />
        <div className={`laser-scanline ${isScanning ? 'scanning' : ''}`} />

        <div className="hud-corner-tl">
          <div style={{ color: 'var(--ai-cyan)', fontWeight: 700 }}>
            CYCLONE DETECTED: <span style={{ color: 'var(--status-green)' }}>{currentFrame.detectionConf}%</span>
          </div>
          <div style={{ marginTop: '2px', color: 'var(--text-muted)', fontSize: '9px' }}>
            CENTER: <b style={{ color: '#fff' }}>{currentFrame.lat.toFixed(2)}°N, {currentFrame.lng.toFixed(2)}°E</b><br />
            PATTERN: <b style={{ color: 'var(--ai-cyan)' }}>CURVED BAND + CDO</b>
          </div>
        </div>

        <div className="hud-corner-tr">
          <div>CNN ATTENTION MAP (Grad-CAM)</div>
          <div style={{ color: 'var(--ai-cyan)' }}>KERNEL: EfficientNet-B4</div>
          <div style={{ color: 'var(--status-green)' }}>LOSS: 0.014 | LATENCY: 12ms</div>
        </div>
      </div>
    </div>
  );
};
