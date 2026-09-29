/**
 * VYUHA AI CYCLONE WATCH - LOCAL MOCK REPOSITORY
 * Pure offline data layer for Smart India Hackathon 2026 - PS 26070
 */

export interface ModelMetadata {
  id: string;
  name: string;
  version: string;
  task: string;
  status: string;
  accuracy: string;
  latency: string;
  weights: string;
  inputDim: string;
  backbone: string;
}

export interface SatelliteFeedItem {
  id: string;
  name: string;
  agency: string;
  band: string;
  resolution: string;
  latency: string;
  status: string;
  healthPct: number;
}

export interface PipelineNodeItem {
  id: number;
  title: string;
  sub: string;
  model: string;
  metricName: string;
  metricVal: string;
  status: string;
  statusClass: 'live' | 'running' | 'complete';
}

export interface ForecastTrackPoint {
  step: string;
  offsetHours: number;
  validTimeUTC: string;
  lat: number;
  lng: number;
  aiKnots: number;
  aiKmph: number;
  pressureHpa: number;
  confidencePct: number;
  errorRadiusKm: number;
  bestTrackLat: number;
  bestTrackLng: number;
  bestTrackKnots: number;
  status: string;
}

export interface TimelineFrameItem {
  frameIndex: number;
  timestamp: string;
  label: string;
  stage: string;
  lat: number;
  lng: number;
  knots: number;
  pressure: number;
  detectionConf: number;
  cdoProb: number;
  curvedProb: number;
  eyeProb: number;
  yoloBox: [number, number, number, number]; // [x, y, w, h] normalized
  notes: string;
}

export const MOCK_STORM_META = {
  systemName: "VYUHA AI CYCLONE WATCH",
  stormId: "BOB-04/2026",
  stormName: "CYCLONE VYUHA",
  basin: "North Indian Ocean / Bay of Bengal",
  bulletinNo: "BOB/04/2026/14",
  psCode: "SIH 2026 - PS 26070",
  psTitle: "AI/ML based system for identification, classification and prediction of different tropical cyclone patterns using multi-source satellite data",
  issuedUTC: "2026-09-29 18:00 UTC",
  engineStatus: "ONLINE",
  satelliteIngestion: "LIVE",
  modelInference: "READY",
  gpuStatus: "NVIDIA A100 Tensor Core 80GB (Active / 42ms)",
  disclaimer: "DEMO DATA | SIMULATED AI OUTPUT | NOT AN OFFICIAL WEATHER WARNING"
};

export const MOCK_PIPELINE_NODES: PipelineNodeItem[] = [
  { id: 1, title: "SATELLITE DATA", sub: "INSAT-3D / 3DS / HIMAWARI", model: "Multi-Source Ingestion", metricName: "INGESTION", metricVal: "100%", status: "STREAMING", statusClass: "live" },
  { id: 2, title: "COMPUTER VISION", sub: "YOLOv8 Object Detection", model: "YOLOv8n-det", metricName: "DETECTION", metricVal: "94.2%", status: "RUNNING", statusClass: "running" },
  { id: 3, title: "PATTERN AI", sub: "Deep CNN Classifier", model: "CNN-v2.4", metricName: "CLASSIFICATION", metricVal: "91.4%", status: "COMPLETE", statusClass: "complete" },
  { id: 4, title: "INTENSITY AI", sub: "CNN + Morphological Features", model: "DeepIntense-v3", metricName: "ESTIMATION", metricVal: "89.7%", status: "COMPLETE", statusClass: "complete" },
  { id: 5, title: "TEMPORAL AI", sub: "ConvLSTM Spatio-Temporal", model: "ConvLSTM-v1.8", metricName: "ENCODER", metricVal: "87.8%", status: "COMPLETE", statusClass: "complete" },
  { id: 6, title: "FORECAST ENGINE", sub: "6H / 12H / 24H / 48H / 72H", model: "Track & Cone Generator", metricName: "HORIZON", metricVal: "72 Hours", status: "PUBLISHED", statusClass: "complete" }
];

export const MOCK_MODELS: ModelMetadata[] = [
  { id: "det-yolo", name: "YOLOv8-Cyclone", version: "YOLOv8n-det-v2.1", task: "Cyclone Center & Eye Detection", status: "Active", accuracy: "94.2%", latency: "12ms", weights: "3.2M", inputDim: "640x640x3", backbone: "CSPDarknet" },
  { id: "cls-cnn", name: "CNN / EfficientNet-B4", version: "CNN-v2.4", task: "Pattern Recognition & Dvorak T-No", status: "Active", accuracy: "91.4%", latency: "16ms", weights: "19.3M", inputDim: "512x512x4", backbone: "EfficientNet-B4" },
  { id: "int-reg", name: "CNN Multi-Head Regression", version: "DeepIntense-v3.0", task: "Intensity (VMax) & Pressure (MSLP)", status: "Active", accuracy: "89.7%", latency: "8ms", weights: "14.7M", inputDim: "Profile Matrix", backbone: "ResNet-50" },
  { id: "fc-convlstm", name: "ConvLSTM Spatio-Temporal", version: "ConvLSTM-v1.8", task: "6h to 72h Track & Intensity Forecast", status: "Active", accuracy: "87.8%", latency: "24ms", weights: "48.2M", inputDim: "12 Frames", backbone: "ConvLSTM+Attention" },
  { id: "unc-mc", name: "Monte Carlo Ensemble", version: "MC-Ensemble-v1.2", task: "Epistemic & Aleatoric Uncertainty", status: "Active", accuracy: "±7 kt / ±42 km", latency: "14ms", weights: "Shared", inputDim: "Latent Encodings", backbone: "Bayesian Dropout" }
];

export const MOCK_FEEDS: SatelliteFeedItem[] = [
  { id: "insat-3ds", name: "INSAT-3DS", agency: "ISRO", band: "IR1 (10.8µm), VIS (0.65µm), WV (6.7µm)", resolution: "1 km GSD", latency: "0.9 min", status: "Active", healthPct: 100 },
  { id: "insat-3d", name: "INSAT-3D", agency: "ISRO / IMD", band: "TIR1, TIR2, SWIR", resolution: "4 km GSD", latency: "1.8 min", status: "Active", healthPct: 99.8 },
  { id: "insat-3dr", name: "INSAT-3DR", agency: "ISRO / IMD", band: "Atmospheric Sounder & Imager", resolution: "10 km GSD", latency: "2.1 min", status: "Active", healthPct: 99.4 },
  { id: "himawari-9", name: "HIMAWARI-9", agency: "JMA", band: "AHI 16-Band Optical/Thermal", resolution: "0.5 - 2.0 km", latency: "3.2 min", status: "Active", healthPct: 99.1 },
  { id: "goes-16", name: "GOES-16", agency: "NOAA", band: "ABI Synoptic Hemispheric", resolution: "1 km GSD", latency: "4.5 min", status: "Active", healthPct: 98.7 },
  { id: "imd-dwr", name: "IMD Doppler Radar", agency: "IMD Odisha", band: "S-Band Radar Reflectivity (Z)", resolution: "250 m", latency: "0.5 min", status: "Active", healthPct: 99.9 },
  { id: "ibtracs", name: "IBTrACS Archive", agency: "NOAA NCEI", band: "1880-2025 NIO Ground Truth Tracks", resolution: "3-hourly", latency: "Sync OK", status: "Active", healthPct: 100 }
];

export const MOCK_PATTERNS = [
  { name: "Central Dense Overcast (CDO)", code: "CDO", prob: 96.1, isDetected: true, color: "#22D3EE", desc: "Dense, symmetric core cloud mass with embedded micro-eye" },
  { name: "Curved Band Pattern", code: "CB", prob: 91.4, isDetected: false, color: "#3B82F6", desc: "Spiral convective feeder bands wrapping > 0.8 turns around the center" },
  { name: "Eye Pattern (Pin-hole)", code: "EYE", prob: 82.0, isDetected: false, color: "#8B5CF6", desc: "Distinct thermal contrast between warm calm eye and cold eyewall" },
  { name: "Shear Pattern", code: "SHR", prob: 8.4, isDetected: false, color: "#64748B", desc: "Displaced deep convection due to vertical wind shear > 25kt" }
];

export const MOCK_EXPLAINABILITY_FEATURES = [
  { feature: "Central Convection Intensity", contribution: 32, val: "-82.6°C IR brightness temp", desc: "Deep convective cloud top temperature below -80°C fuels high latent heat release." },
  { feature: "Cloud Symmetry Index", contribution: 24, val: "0.89 / 1.00 Circularity", desc: "Uniform radial gradient detected by YOLOv8 circularity kernel confirms vortex maturity." },
  { feature: "Curved Spiral Bands", contribution: 19, val: "1.12 Logarithmic Spiral Turn", desc: "Persistent spiral feeder bands channeling high moisture from equatorial Bay of Bengal." },
  { feature: "Temperature Signature (Eye-to-Wall Gradient)", contribution: 15, val: "ΔT = +14.2°C contrast", desc: "Pronounced thermal contrast between warm eye sinking air and freezing convective eyewall." },
  { feature: "Historical Intensity Trend & Ocean Heat", contribution: 10, val: "OHC > 95 kJ/cm²", desc: "High Tropical Cyclone Heat Potential (TCHP) in central Bay supports continued strengthening." }
];

export const MOCK_FORECAST_TRACK: ForecastTrackPoint[] = [
  { step: "T0 (Current)", offsetHours: 0, validTimeUTC: "29-Sep 18:00 UTC", lat: 15.80, lng: 87.20, aiKnots: 92, aiKmph: 170, pressureHpa: 948, confidencePct: 94.2, errorRadiusKm: 0, bestTrackLat: 15.80, bestTrackLng: 87.20, bestTrackKnots: 90, status: "Observed" },
  { step: "+6H", offsetHours: 6, validTimeUTC: "30-Sep 00:00 UTC", lat: 16.35, lng: 86.75, aiKnots: 95, aiKmph: 176, pressureHpa: 944, confidencePct: 91.8, errorRadiusKm: 14, bestTrackLat: 16.30, bestTrackLng: 86.80, bestTrackKnots: 95, status: "ConvLSTM Forecast" },
  { step: "+12H", offsetHours: 12, validTimeUTC: "30-Sep 06:00 UTC", lat: 17.00, lng: 86.20, aiKnots: 98, aiKmph: 181, pressureHpa: 940, confidencePct: 89.4, errorRadiusKm: 26, bestTrackLat: 16.90, bestTrackLng: 86.30, bestTrackKnots: 97, status: "ConvLSTM Forecast" },
  { step: "+24H", offsetHours: 24, validTimeUTC: "30-Sep 18:00 UTC", lat: 18.25, lng: 85.35, aiKnots: 100, aiKmph: 185, pressureHpa: 938, confidencePct: 85.6, errorRadiusKm: 42, bestTrackLat: 18.10, bestTrackLng: 85.50, bestTrackKnots: 100, status: "ConvLSTM Peak Stage" },
  { step: "+48H", offsetHours: 48, validTimeUTC: "01-Oct 18:00 UTC", lat: 19.80, lng: 84.40, aiKnots: 85, aiKmph: 157, pressureHpa: 958, confidencePct: 78.2, errorRadiusKm: 78, bestTrackLat: 19.65, bestTrackLng: 84.60, bestTrackKnots: 88, status: "Coastal Landfall" },
  { step: "+72H", offsetHours: 72, validTimeUTC: "02-Oct 18:00 UTC", lat: 21.10, lng: 83.70, aiKnots: 45, aiKmph: 83, pressureHpa: 988, confidencePct: 69.5, errorRadiusKm: 130, bestTrackLat: 20.95, bestTrackLng: 83.95, bestTrackKnots: 40, status: "Inland Dissipation" }
];

export const MOCK_TIMELINE_FRAMES: TimelineFrameItem[] = [
  { frameIndex: 0, timestamp: "28-Sep 06:00 UTC (T-36h)", label: "Low Pressure Area (LPA)", stage: "Low Pressure (LPA)", lat: 12.10, lng: 91.50, knots: 25, pressure: 1004, detectionConf: 72.4, cdoProb: 12.0, curvedProb: 38.5, eyeProb: 2.1, yoloBox: [0.38, 0.42, 0.22, 0.20], notes: "Incipient cyclonic vorticity in south-east Bay of Bengal." },
  { frameIndex: 1, timestamp: "28-Sep 18:00 UTC (T-24h)", label: "Depression BOB-04", stage: "Depression (BOB/04)", lat: 13.40, lng: 89.80, knots: 35, pressure: 998, detectionConf: 84.1, cdoProb: 44.5, curvedProb: 68.2, eyeProb: 11.0, yoloBox: [0.32, 0.35, 0.34, 0.32], notes: "Organized spiral convective band forming around central depression." },
  { frameIndex: 2, timestamp: "29-Sep 06:00 UTC (T-12h)", label: "Cyclonic Storm VYUHA", stage: "Cyclonic Storm (CS)", lat: 14.60, lng: 88.40, knots: 55, pressure: 982, detectionConf: 90.8, cdoProb: 76.8, curvedProb: 88.3, eyeProb: 42.5, yoloBox: [0.26, 0.28, 0.48, 0.46], notes: "Central dense overcast rapidly expanding; gale winds established." },
  { frameIndex: 3, timestamp: "29-Sep 18:00 UTC (T0 - LIVE)", label: "Very Severe Cyclonic Storm", stage: "Very Severe Cyclonic Storm (VSCS)", lat: 15.80, lng: 87.20, knots: 92, pressure: 948, detectionConf: 94.2, cdoProb: 96.1, curvedProb: 91.4, eyeProb: 82.0, yoloBox: [0.20, 0.20, 0.60, 0.60], notes: "Primary analysis frame. Compact central eye detected with intense CDO structure." },
  { frameIndex: 4, timestamp: "30-Sep 18:00 UTC (T+24h)", label: "Extremely Severe Stage", stage: "Extremely Severe Cyclonic Storm (ESCS)", lat: 18.25, lng: 85.35, knots: 100, pressure: 938, detectionConf: 95.8, cdoProb: 98.4, curvedProb: 94.0, eyeProb: 93.2, yoloBox: [0.18, 0.16, 0.64, 0.66], notes: "Peak intensity over central-west Bay before coastal interaction." },
  { frameIndex: 5, timestamp: "01-Oct 18:00 UTC (T+48h)", label: "Coastal Landfall Phase", stage: "Very Severe Cyclone (Landfall)", lat: 19.80, lng: 84.40, knots: 85, pressure: 958, detectionConf: 93.0, cdoProb: 88.2, curvedProb: 82.1, eyeProb: 65.4, yoloBox: [0.22, 0.24, 0.58, 0.55], notes: "Gopalpur-Kalingapatnam coastal landfall; maximum storm surge." }
];

export const MOCK_COASTAL_STATIONS = [
  { id: "42976", name: "Paradip Port", state: "Odisha", lat: 20.316, lng: 86.611, distKm: 504, surgeRisk: "3.8m", warning: "RED" },
  { id: "43049", name: "Gopalpur", state: "Odisha", lat: 19.260, lng: 84.900, distKm: 452, surgeRisk: "4.2m", warning: "RED" },
  { id: "43053", name: "Puri Coast", state: "Odisha", lat: 19.813, lng: 85.831, distKm: 470, surgeRisk: "3.5m", warning: "RED" },
  { id: "43149", name: "Visakhapatnam", state: "Andhra Pradesh", lat: 17.686, lng: 83.218, distKm: 468, surgeRisk: "2.1m", warning: "ORANGE" },
  { id: "43105", name: "Kalingapatnam", state: "Andhra Pradesh", lat: 18.330, lng: 84.130, distKm: 412, surgeRisk: "3.9m", warning: "RED" }
];
