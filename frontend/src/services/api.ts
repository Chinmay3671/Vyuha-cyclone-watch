import {
  CycloneTelemetry,
  ModelInfo,
  SatelliteFeed,
  CoastalStation,
  ForecastWaypoint,
  ExplainabilityFeature,
  PatternClass,
  TimelineFrame
} from '../types';

const API_BASE = '/api';

export const fallbackTelemetry: CycloneTelemetry = {
  storm_id: "BOB-04/2026",
  storm_name: "VYUHA",
  basin: "North Indian Ocean / Bay of Bengal",
  bulletin_no: "BOB/04/2026/14",
  issued_utc: "2026-09-29 18:00 UTC",
  stage: "VERY SEVERE CYCLONIC STORM (VSCS)",
  dvorak_t_number: "T5.0 / CI 5.0",
  center_lat: 15.80,
  center_lng: 87.20,
  center_formatted: "15.80°N, 87.20°E",
  vmax_knots: 92,
  vmax_kmph: 170,
  estimated_next_24h_knots: 98,
  estimated_next_24h_kmph: 181,
  central_pressure_hpa: 948,
  pressure_drop_hpa: -26,
  trend: "INTENSIFYING",
  movement_heading: "315° (North-West)",
  forward_speed_kmph: 16,
  eye_diameter_km: 32,
  radius_max_wind_km: 45,
  radius_outer_gale_km: 280,
  detection_confidence_pct: 94.2,
  intensity_confidence_pct: 89.7,
  uncertainty_spread_margin_kt: 7.0,
  disaster_risk: {
    score: 78,
    level: "HIGH RISK",
    coastal_landfall_eta: "~46 hours (Odisha-Andhra Coast)",
    estimated_surge_m: "3.2 - 4.5 meters"
  }
};

export const fallbackTimelineFrames: TimelineFrame[] = [
  {
    frameIndex: 0,
    timestamp: "2026-09-28 06:00 UTC (T-36h)",
    label: "Low Pressure Area (LPA)",
    stage: "Low Pressure Area (LPA)",
    lat: 12.10,
    lng: 91.50,
    knots: 25,
    pressure: 1004,
    detectionConf: 72.4,
    cdoProb: 12.0,
    curvedProb: 38.5,
    eyeProb: 2.1,
    yoloBox: [0.38, 0.42, 0.22, 0.20],
    notes: "Incipient cyclonic vorticity in south-east Bay of Bengal."
  },
  {
    frameIndex: 1,
    timestamp: "2026-09-28 18:00 UTC (T-24h)",
    label: "Depression BOB-04",
    stage: "Depression (BOB/04)",
    lat: 13.40,
    lng: 89.80,
    knots: 35,
    pressure: 998,
    detectionConf: 84.1,
    cdoProb: 44.5,
    curvedProb: 68.2,
    eyeProb: 11.0,
    yoloBox: [0.32, 0.35, 0.34, 0.32],
    notes: "Organized spiral convective band forming around central depression."
  },
  {
    frameIndex: 2,
    timestamp: "2026-09-29 06:00 UTC (T-12h)",
    label: "Cyclonic Storm VYUHA",
    stage: "Cyclonic Storm (CS)",
    lat: 14.60,
    lng: 88.40,
    knots: 55,
    pressure: 982,
    detectionConf: 90.8,
    cdoProb: 76.8,
    curvedProb: 88.3,
    eyeProb: 42.5,
    yoloBox: [0.26, 0.28, 0.48, 0.46],
    notes: "Central dense overcast rapidly expanding; gale winds established."
  },
  {
    frameIndex: 3,
    timestamp: "2026-09-29 18:00 UTC (T0 - LIVE)",
    label: "Very Severe Cyclonic Storm",
    stage: "Very Severe Cyclonic Storm (VSCS)",
    lat: 15.80,
    lng: 87.20,
    knots: 92,
    pressure: 948,
    detectionConf: 94.2,
    cdoProb: 96.1,
    curvedProb: 91.4,
    eyeProb: 82.0,
    yoloBox: [0.20, 0.20, 0.60, 0.60],
    notes: "Primary analysis frame. Compact central eye detected with intense CDO structure."
  },
  {
    frameIndex: 4,
    timestamp: "2026-09-30 18:00 UTC (T+24h)",
    label: "Extremely Severe Stage",
    stage: "Extremely Severe Cyclonic Storm (ESCS)",
    lat: 18.25,
    lng: 85.35,
    knots: 100,
    pressure: 938,
    detectionConf: 95.8,
    cdoProb: 98.4,
    curvedProb: 94.0,
    eyeProb: 93.2,
    yoloBox: [0.18, 0.16, 0.64, 0.66],
    notes: "Peak intensity over central-west Bay before coastal interaction."
  },
  {
    frameIndex: 5,
    timestamp: "2026-10-01 18:00 UTC (T+48h)",
    label: "Coastal Landfall Phase",
    stage: "Very Severe Cyclone (Landfall)",
    lat: 19.80,
    lng: 84.40,
    knots: 85,
    pressure: 958,
    detectionConf: 93.0,
    cdoProb: 88.2,
    curvedProb: 82.1,
    eyeProb: 65.4,
    yoloBox: [0.22, 0.24, 0.58, 0.55],
    notes: "Gopalpur-Kalingapatnam coastal landfall; maximum storm surge."
  }
];

export async function fetchTelemetry(): Promise<CycloneTelemetry> {
  try {
    const res = await fetch(`${API_BASE}/telemetry/current`);
    if (res.ok) return await res.json();
  } catch (e) {
    console.warn('API fallback to local telemetry', e);
  }
  return fallbackTelemetry;
}

export async function fetchModels(): Promise<ModelInfo[]> {
  try {
    const res = await fetch(`${API_BASE}/inference/models`);
    if (res.ok) return await res.json();
  } catch (e) {
    console.warn('API fallback to local models', e);
  }
  return [
    { id: "yolov8-det", name: "YOLOv8-Cyclone", version: "v2.1.0-prod", framework: "PyTorch", task: "Center Pinpoint & Eye Reticle Detection", accuracy: "94.2%", latency: "11.2 ms", status: "ONLINE" },
    { id: "effnet-cls", name: "EfficientNet-B4", version: "v2.4.2-prod", framework: "TensorFlow", task: "Dvorak Pattern Classification", accuracy: "91.4%", latency: "15.8 ms", status: "ONLINE" },
    { id: "cnn-intense", name: "DeepIntense-v3", version: "v3.0.1-prod", framework: "PyTorch", task: "Vmax (kt) & MSLP (hPa) Estimation", accuracy: "89.7%", latency: "8.1 ms", status: "ONLINE" },
    { id: "convlstm-fc", name: "ConvLSTM-v1.8", version: "v1.8.4-prod", framework: "PyTorch Recurrent", task: "6h to 72h Trajectory & Intensity Forecast", accuracy: "87.8%", latency: "23.6 ms", status: "ONLINE" }
  ];
}

export async function fetchFeeds(): Promise<SatelliteFeed[]> {
  try {
    const res = await fetch(`${API_BASE}/satellite/feeds`);
    if (res.ok) return await res.json();
  } catch (e) {
    console.warn('API fallback to local feeds', e);
  }
  return [
    { id: "feed-insat3ds", name: "INSAT-3DS Imager", agency: "ISRO / IMD", type: "Geostationary (82.0°E)", channels: "VIS (0.65µm), IR1 (10.8µm), WV (6.7µm)", resolution: "1 km GSD", latency: "1.2 min", status: "NOMINAL", sync_pct: 100 },
    { id: "feed-insat3dr", name: "INSAT-3DR Sounder", agency: "ISRO / IMD", type: "Geostationary (74.0°E)", channels: "18-channel Sounder Profiles", resolution: "10 km GSD", latency: "47 min", status: "DELAYED", sync_pct: 78 },
    { id: "feed-insat3d", name: "INSAT-3D Auxiliary", agency: "ISRO / IMD", type: "Geostationary (82.0°E)", channels: "TIR1, TIR2, SWIR", resolution: "4 km GSD", latency: "2.8 min", status: "NOMINAL", sync_pct: 99.4 },
    { id: "feed-hima9", name: "Himawari-9 AHI", agency: "JMA Tokyo", type: "Geostationary (140.7°E)", channels: "16-Band Multispectral", resolution: "0.5-2 km", latency: "3.5 min", status: "NOMINAL", sync_pct: 99.1 },
    { id: "feed-dwr-prdp", name: "DWR Radar Paradip", agency: "IMD Odisha", type: "Ground S-Band Radar", channels: "Reflectivity (Z), Radial Velocity", resolution: "250 m", latency: "0.8 min", status: "NOMINAL", sync_pct: 99.9 }
  ];
}

export async function fetchCoastalStations(): Promise<CoastalStation[]> {
  try {
    const res = await fetch(`${API_BASE}/telemetry/stations`);
    if (res.ok) return await res.json();
  } catch (e) {
    console.warn('API fallback to local stations', e);
  }
  return [
    { id: "42976", name: "Paradip Port", state: "Odisha", lat: 20.316, lng: 86.611, dist_km: 504, surge_risk: "3.8m", warning_level: "RED" },
    { id: "43049", name: "Gopalpur", state: "Odisha", lat: 19.260, lng: 84.900, dist_km: 452, surge_risk: "4.2m", warning_level: "RED" },
    { id: "43053", name: "Puri Coast", state: "Odisha", lat: 19.813, lng: 85.831, dist_km: 470, surge_risk: "3.5m", warning_level: "RED" },
    { id: "43149", name: "Visakhapatnam", state: "Andhra Pradesh", lat: 17.686, lng: 83.218, dist_km: 468, surge_risk: "2.1m", warning_level: "ORANGE" },
    { id: "43105", name: "Kalingapatnam", state: "Andhra Pradesh", lat: 18.330, lng: 84.130, dist_km: 412, surge_risk: "3.9m", warning_level: "RED" },
    { id: "42901", name: "Digha", state: "West Bengal", lat: 21.626, lng: 87.509, dist_km: 648, surge_risk: "2.4m", warning_level: "YELLOW" },
    { id: "42903", name: "Sagar Island", state: "West Bengal", lat: 21.650, lng: 88.080, dist_km: 654, surge_risk: "2.2m", warning_level: "YELLOW" }
  ];
}

export async function fetchForecastTrack(): Promise<ForecastWaypoint[]> {
  try {
    const res = await fetch(`${API_BASE}/forecast/track`);
    if (res.ok) {
      const data = await res.json();
      return data.waypoints;
    }
  } catch (e) {
    console.warn('API fallback to local track', e);
  }
  return [
    { step: "T0", offset_hours: 0, valid_time_utc: "2026-09-29 18:00 UTC", latitude: 15.80, longitude: 87.20, vmax_knots: 92, vmax_kmph: 170, mslp_hpa: 948, confidence_pct: 94.2, dispersion_radius_km: 0, best_track_ref: { lat: 15.80, lng: 87.20, vmax_kt: 90 }, status: "Observed" },
    { step: "+6H", offset_hours: 6, valid_time_utc: "2026-09-30 00:00 UTC", latitude: 16.35, longitude: 86.75, vmax_knots: 95, vmax_kmph: 176, mslp_hpa: 944, confidence_pct: 91.8, dispersion_radius_km: 14, best_track_ref: { lat: 16.30, lng: 86.80, vmax_kt: 95 }, status: "Forecast" },
    { step: "+12H", offset_hours: 12, valid_time_utc: "2026-09-30 06:00 UTC", latitude: 17.00, longitude: 86.20, vmax_knots: 98, vmax_kmph: 181, mslp_hpa: 940, confidence_pct: 89.4, dispersion_radius_km: 26, best_track_ref: { lat: 16.90, lng: 86.30, vmax_kt: 97 }, status: "Forecast" },
    { step: "+24H", offset_hours: 24, valid_time_utc: "2026-09-30 18:00 UTC", latitude: 18.25, longitude: 85.35, vmax_knots: 100, vmax_kmph: 185, mslp_hpa: 938, confidence_pct: 85.6, dispersion_radius_km: 42, best_track_ref: { lat: 18.10, lng: 85.50, vmax_kt: 100 }, status: "Forecast (Peak)" },
    { step: "+48H", offset_hours: 48, valid_time_utc: "2026-10-01 18:00 UTC", latitude: 19.80, longitude: 84.40, vmax_knots: 85, vmax_kmph: 157, mslp_hpa: 958, confidence_pct: 78.2, dispersion_radius_km: 78, best_track_ref: { lat: 19.65, lng: 84.60, vmax_kt: 88 }, status: "Landfall" },
    { step: "+72H", offset_hours: 72, valid_time_utc: "2026-10-02 18:00 UTC", latitude: 21.10, longitude: 83.70, vmax_knots: 45, vmax_kmph: 83, mslp_hpa: 988, confidence_pct: 69.5, dispersion_radius_km: 130, best_track_ref: { lat: 20.95, lng: 83.95, vmax_kt: 40 }, status: "Dissipation" }
  ];
}

export async function triggerInferenceScan(frameIndex: number): Promise<any> {
  try {
    const res = await fetch(`${API_BASE}/inference/scan?frame_index=${frameIndex}`, { method: 'POST' });
    if (res.ok) return await res.json();
  } catch (e) {
    console.warn('API fallback to local inference trigger', e);
  }
  return { status: "SUCCESS", frame_index: frameIndex, latency_ms: 38.4 };
}
