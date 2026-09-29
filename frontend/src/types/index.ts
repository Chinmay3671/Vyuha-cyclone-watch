export interface CycloneTelemetry {
  storm_id: string;
  storm_name: string;
  basin: string;
  bulletin_no: string;
  issued_utc: string;
  stage: string;
  dvorak_t_number: string;
  center_lat: number;
  center_lng: number;
  center_formatted: string;
  vmax_knots: number;
  vmax_kmph: number;
  estimated_next_24h_knots: number;
  estimated_next_24h_kmph: number;
  central_pressure_hpa: number;
  pressure_drop_hpa: number;
  trend: string;
  movement_heading: string;
  forward_speed_kmph: number;
  eye_diameter_km: number;
  radius_max_wind_km: number;
  radius_outer_gale_km: number;
  detection_confidence_pct: number;
  intensity_confidence_pct: number;
  uncertainty_spread_margin_kt: number;
  disaster_risk: {
    score: number;
    level: string;
    coastal_landfall_eta: string;
    estimated_surge_m: string;
  };
}

export interface ModelInfo {
  id: string;
  name: string;
  version: string;
  framework: string;
  task: string;
  accuracy: string;
  latency: string;
  status: string;
}

export interface SatelliteFeed {
  id: string;
  name: string;
  agency: string;
  type: string;
  channels: string;
  resolution: string;
  latency: string;
  status: string;
  sync_pct: number;
}

export interface CoastalStation {
  id: string;
  name: string;
  state: string;
  lat: number;
  lng: number;
  dist_km: number;
  surge_risk: string;
  warning_level: string;
}

export interface ForecastWaypoint {
  step: string;
  offset_hours: number;
  valid_time_utc: string;
  latitude: number;
  longitude: number;
  vmax_knots: number;
  vmax_kmph: number;
  mslp_hpa: number;
  confidence_pct: number;
  dispersion_radius_km: number;
  best_track_ref: {
    lat: number;
    lng: number;
    vmax_kt: number;
  };
  status: string;
}

export interface ExplainabilityFeature {
  feature: string;
  contribution_pct: number;
  value: string;
  impact: string;
  description: string;
}

export interface PatternClass {
  code: string;
  name: string;
  description: string;
  probability_pct: number;
  is_detected: boolean;
}

export interface TimelineFrame {
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
  yoloBox: number[];
  notes: string;
}
