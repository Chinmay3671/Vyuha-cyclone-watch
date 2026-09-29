/**
 * PURE LOCAL DATA SERVICE (ZERO EXTERNAL FETCH / OFFLINE READY)
 */

import {
  MOCK_STORM_META,
  MOCK_PIPELINE_NODES,
  MOCK_MODELS,
  MOCK_FEEDS,
  MOCK_PATTERNS,
  MOCK_EXPLAINABILITY_FEATURES,
  MOCK_FORECAST_TRACK,
  MOCK_TIMELINE_FRAMES,
  MOCK_COASTAL_STATIONS,
  TimelineFrameItem
} from '../mocks/mockData';

export interface AppState {
  activeTab: string;
  currentFrameIndex: number;
  activeVisionLayer: 'raw' | 'heatmap' | 'seg' | 'edge';
  activeBand: 'ir' | 'vis';
  selectedForecastStep: string;
  audioMuted: boolean;
}

class LocalVyuhaDataService {
  private _state: AppState = {
    activeTab: 'dashboard',
    currentFrameIndex: 3, // T0 LIVE
    activeVisionLayer: 'heatmap',
    activeBand: 'ir',
    selectedForecastStep: 'T0 (Current)',
    audioMuted: false
  };

  private _listeners: Set<(state: AppState) => void> = new Set();

  public subscribe(listener: (state: AppState) => void): () => void {
    this._listeners.add(listener);
    listener(this.getState());
    return () => this._listeners.delete(listener);
  }

  private _notify(): void {
    const copy = this.getState();
    this._listeners.forEach(fn => fn(copy));
  }

  public getState(): AppState {
    return { ...this._state };
  }

  public setTab(tab: string): void {
    this._state.activeTab = tab;
    this._notify();
  }

  public setFrame(index: number): void {
    this._state.currentFrameIndex = Math.max(0, Math.min(MOCK_TIMELINE_FRAMES.length - 1, index));
    this._notify();
  }

  public nextFrame(): void {
    this._state.currentFrameIndex = (this._state.currentFrameIndex + 1) % MOCK_TIMELINE_FRAMES.length;
    this._notify();
  }

  public prevFrame(): void {
    this._state.currentFrameIndex = this._state.currentFrameIndex > 0 ? this._state.currentFrameIndex - 1 : MOCK_TIMELINE_FRAMES.length - 1;
    this._notify();
  }

  public setLayer(layer: 'raw' | 'heatmap' | 'seg' | 'edge'): void {
    this._state.activeVisionLayer = layer;
    this._notify();
  }

  public setBand(band: 'ir' | 'vis'): void {
    this._state.activeBand = band;
    this._notify();
  }

  public setForecastStep(step: string): void {
    this._state.selectedForecastStep = step;
    this._notify();
  }

  public toggleAudio(): void {
    this._state.audioMuted = !this._state.audioMuted;
    this._notify();
  }

  /* Entity Accessors */
  public getMeta() { return MOCK_STORM_META; }
  public getPipelineNodes() { return MOCK_PIPELINE_NODES; }
  public getModels() { return MOCK_MODELS; }
  public getFeeds() { return MOCK_FEEDS; }
  public getForecastTrack() { return MOCK_FORECAST_TRACK; }
  public getTimelineFrames() { return MOCK_TIMELINE_FRAMES; }
  public getCoastalStations() { return MOCK_COASTAL_STATIONS; }
  public getExplainability() { return MOCK_EXPLAINABILITY_FEATURES; }

  public getCurrentFrame(): TimelineFrameItem {
    return MOCK_TIMELINE_FRAMES[this._state.currentFrameIndex] || MOCK_TIMELINE_FRAMES[3];
  }

  public getPatterns() {
    const frame = this.getCurrentFrame();
    return [
      { name: "Central Dense Overcast (CDO)", code: "CDO", prob: frame.cdoProb, isDetected: frame.cdoProb >= 80, desc: "Dense, symmetric core cloud mass with embedded micro-eye" },
      { name: "Curved Band Pattern", code: "CB", prob: frame.curvedProb, isDetected: frame.curvedProb >= 80, desc: "Spiral convective feeder bands wrapping > 0.8 turns around the center" },
      { name: "Eye Pattern (Pin-hole)", code: "EYE", prob: frame.eyeProb, isDetected: frame.eyeProb >= 80, desc: "Distinct thermal contrast between warm calm eye and cold eyewall" },
      { name: "Shear Pattern", code: "SHR", prob: Math.max(2, Math.round(100 - frame.detectionConf)), isDetected: false, desc: "Displaced deep convection due to vertical wind shear > 25kt" }
    ];
  }
}

export const localDataService = new LocalVyuhaDataService();
