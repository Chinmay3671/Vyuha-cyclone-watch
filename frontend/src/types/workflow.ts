/**
 * WORKFLOW DATA TYPES & INTERFACES (FRONTEND-ONLY VYUHA SUITE)
 * Smart India Hackathon 2026 - Problem Statement PS 26070
 */

export type StageId = 1 | 2 | 3 | 4 | 5 | 6;
export type StageStatus = 'pending' | 'running' | 'done';

export interface StageDefinition {
  id: StageId;
  name: string;
  shortName: string;
  tag: string;
  description: string;
}

export interface SatelliteSource {
  id: string;
  agency: 'INSAT' | 'NOAA' | 'NASA';
  name: string;
  satellite: string;
  status: 'ACTIVE' | 'SYNCHRONIZED' | 'STANDBY';
  lastReceivedUTC: string;
  spectralBands: string[];
  spatialResolution: string;
  coverageArea: string;
  enabled: boolean;
  signalQualityPct: number;
}

export interface PreprocessingSubStep {
  id: 'clean' | 'align' | 'fuse';
  title: string;
  method: string;
  status: 'pending' | 'processing' | 'completed';
  progressPct: number;
  details: string;
  parameters: Record<string, string | number>;
}

export interface PreprocessingMetrics {
  missingPixelsPct: number;
  alignmentOffsetPixelsRms: number;
  signalToNoiseRatioDb: number;
  radiometricCalibratedTempRange: string;
  fusedTensorDimension: string;
}

export interface AIModelOutput {
  id: 'cnn' | 'lstm' | 'transformer';
  name: string;
  type: string;
  role: string;
  confidencePct: number;
  architecture: string;
  parametersCount: string;
  latencyMs: number;
  keyOutputs: Array<{ label: string; value: string | number; unit?: string }>;
  featureMapDescription: string;
}

export interface DetectedCycloneSystem {
  id: string;
  name: string;
  code: string;
  latitude: number;
  longitude: number;
  confidencePct: number;
  patternType: string;
  subPatterns: string[];
  yoloBoundingBox: [number, number, number, number]; // [x, y, w, h] normalized
  eyeDiameterKm: number;
  eyeDetected: boolean;
  eyeTempCelsius: number;
  r34GaleRadiusKm: number;
}

export interface CategoryProbability {
  category: string;
  shortCode: string;
  windSpeedRangeKnots: string;
  windSpeedRangeKmph: string;
  probabilityPct: number;
  isActive: boolean;
  description: string;
}

export interface ForecastPoint {
  step: string;
  offsetHours: number;
  validTimeUTC: string;
  latitude: number;
  longitude: number;
  vmaxKnots: number;
  vmaxKmph: number;
  mslpHpa: number;
  confidencePct: number;
  dispersionRadiusKm: number;
  stageName: string;
}

export interface WorkflowState {
  currentStage: StageId;
  stageStatuses: Record<StageId, StageStatus>;
  isPipelineRunning: boolean;
  selectedCycloneId: string;
  activeLayer: 'raw' | 'heatmap' | 'seg' | 'edge';
  activeBand: 'ir' | 'vis' | 'wv';
  mapTheme: 'light' | 'carto';
  sources: SatelliteSource[];
  preprocessing: {
    subSteps: PreprocessingSubStep[];
    metrics: PreprocessingMetrics;
    beforeImage: string;
    afterImage: string;
  };
  models: AIModelOutput[];
  detections: DetectedCycloneSystem[];
  classification: {
    activeCategory: string;
    vmaxKnots: number;
    vmaxKmph: number;
    mslpHpa: number;
    dvorakNumber: string;
    probabilities: CategoryProbability[];
    forecastTrack: ForecastPoint[];
  };
}
