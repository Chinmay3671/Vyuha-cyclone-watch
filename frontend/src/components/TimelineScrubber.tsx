import React from 'react';
import { TimelineFrameItem } from '../mocks/mockData';

interface TimelineScrubberProps {
  frames: TimelineFrameItem[];
  currentFrameIndex: number;
  onFrameChange: (index: number) => void;
  isPlaying: boolean;
  onTogglePlay: () => void;
}

export const TimelineScrubber: React.FC<TimelineScrubberProps> = ({
  frames,
  currentFrameIndex,
  onFrameChange,
  isPlaying,
  onTogglePlay
}) => {
  const current = frames[currentFrameIndex] || frames[0];

  return (
    <div className="timeline-replay-bar">
      <div className="timeline-controls">
        <button
          className="ctrl-btn"
          onClick={() => onFrameChange(currentFrameIndex > 0 ? currentFrameIndex - 1 : frames.length - 1)}
          title="Previous Frame"
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="19 20 9 12 19 4 19 20"></polygon><line x1="5" y1="19" x2="5" y2="5"></line></svg>
        </button>
        <button
          className="ctrl-btn"
          onClick={onTogglePlay}
          title={isPlaying ? "Pause Simulation" : "Auto Replay"}
        >
          {isPlaying ? (
            <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4" width="4" height="16"></rect><rect x="14" y="4" width="4" height="16"></rect></svg>
          ) : (
            <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
          )}
        </button>
        <button
          className="ctrl-btn"
          onClick={() => onFrameChange((currentFrameIndex + 1) % frames.length)}
          title="Next Frame"
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="5 4 15 12 5 20 5 4"></polygon><line x1="19" y1="5" x2="19" y2="19"></line></svg>
        </button>
      </div>

      <div className="timeline-slider-wrap">
        <div className="slider-labels">
          <span>T-36h (LPA)</span>
          <span>T-24h (Depression)</span>
          <span>T-12h (CS)</span>
          <span style={{ color: 'var(--ai-cyan)', fontWeight: 700 }}>T0 (LIVE VSCS)</span>
          <span>T+24h (Peak Ocean)</span>
          <span>T+48h (Landfall)</span>
        </div>
        <input
          type="range"
          className="timeline-range-input"
          min={0}
          max={frames.length - 1}
          value={currentFrameIndex}
          onChange={(e) => onFrameChange(parseInt(e.target.value, 10))}
        />
      </div>

      <div className="active-frame-label">
        {current.timestamp} • {current.stage}
      </div>
    </div>
  );
};
