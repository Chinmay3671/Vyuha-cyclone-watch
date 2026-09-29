/**
 * VYUHA METEOROLOGICAL INTELLIGENCE DATA REPOSITORY
 * Smart India Hackathon 2026 - Problem Statement PS 26070
 * 
 * Multi-Source Satellite Tropical Cyclone Identification, Pattern Classification,
 * Intensity Estimation and Recurrent Trajectory Prediction.
 */

window.VYUHA_DATA = {
  meta: {
    systemName: "VYUHA CYCLONE INTELLIGENCE",
    bulletinNo: "BOB/04/2026/14",
    psCode: "SIH 2026 - PS 26070",
    psTitle: "AI/ML based system for identification, classification and prediction of different tropical cyclone patterns using multi-source satellite data",
    stormId: "BOB-04/2026",
    stormName: "VYUHA",
    basin: "North Indian Ocean / Bay of Bengal",
    classification: "Very Severe Cyclonic Storm (VSCS)",
    dvorakTNo: "T5.0 / CI 5.0",
    disclaimer: "OPERATIONAL DEMONSTRATION SUITE • SYNTHETIC RESEARCH TELEMETRY • NOT AN OFFICIAL RSMC / IMD STATUTORY WARNING",
    issuedUTC: "2026-09-29 18:00 UTC",
    nextBulletinUTC: "2026-09-29 21:00 UTC",
    serverNode: "compute-node-04.imd.gov.in (NVIDIA A100-SXM4-80GB)",
    inferenceLatencyMs: 38.4
  },

  staleFeedNotice: {
    feed: "INSAT-3DR Atmospheric Sounder",
    status: "STALE",
    delayMinutes: 47,
    expectedUTC: "2026-09-29 17:15 UTC",
    lastReceivedUTC: "2026-09-29 16:28 UTC",
    impact: "L2 moisture sounding profile fallback active (using ECMWF 0.125° synoptic assimilation grid)."
  },

  models: [
    {
      id: "yolov8-det",
      name: "YOLOv8-Cyclone",
      version: "v2.1.0-prod",
      type: "Convolutional Object Detector",
      task: "Center Pinpoint & Eye Reticle Detection",
      status: "ONLINE",
      accuracy: "94.2%",
      latency: "11.2 ms",
      inputDim: "640×640×3 (IR1, VIS, TIR2)",
      weightsSize: "14.8 MB",
      backbone: "Modified CSPDarknet",
      metrics: { f1: 0.938, map50: 0.961, centerRmsErrorKm: 14.2 }
    },
    {
      id: "effnet-cls",
      name: "EfficientNet-B4 Pattern Classifier",
      version: "v2.4.2-prod",
      type: "Multi-Class CNN Classifier",
      task: "Dvorak Pattern & Cloud Morphology Classification",
      status: "ONLINE",
      accuracy: "91.4%",
      latency: "15.8 ms",
      inputDim: "512×512×4 (Multi-Spectral)",
      weightsSize: "77.2 MB",
      backbone: "EfficientNet-B4 + Spatial Attention",
      metrics: { top1Acc: "91.4%", top2Acc: "98.1%", crossEntropyLoss: 0.214 }
    },
    {
      id: "cnn-intense",
      name: "DeepIntense Multi-Head Regressor",
      version: "v3.0.1-prod",
      type: "Convolutional Regression Network",
      task: "Vmax (kt) & Central MSLP (hPa) Estimation",
      status: "ONLINE",
      accuracy: "89.7%",
      latency: "8.1 ms",
      inputDim: "Feature Matrix + IR Radius Temp Vector",
      weightsSize: "32.4 MB",
      backbone: "ResNet-50 + Dense Regression Heads",
      metrics: { vmaxMaeKt: 6.8, mslpRmseHpa: 5.2, rSquared: 0.912 }
    },
    {
      id: "convlstm-fc",
      name: "ConvLSTM Spatio-Temporal Forecaster",
      version: "v1.8.4-prod",
      type: "Recurrent Convolutional Network",
      task: "6h to 72h Track, Radius & Intensity Forecast",
      status: "ONLINE",
      accuracy: "87.8%",
      latency: "23.6 ms",
      inputDim: "Sequence: 12 Historical Frames (T-12h to T0)",
      weightsSize: "192.5 MB",
      backbone: "4-Layer ConvLSTM + Dual Self-Attention",
      metrics: { track24hErrorKm: 42.1, track48hErrorKm: 78.4, track72hErrorKm: 130.2 }
    },
    {
      id: "mc-ensemble",
      name: "Monte Carlo Bayesian Ensemble",
      version: "v1.2.0-prod",
      type: "Bayesian Epistemic Estimator",
      task: "Uncertainty Envelope & Track Spread Calculation",
      status: "ONLINE",
      accuracy: "95% CI",
      latency: "14.0 ms",
      inputDim: "Latent Bottleneck Activations (100 passes)",
      weightsSize: "Shared",
      backbone: "DropConnect Monte Carlo Engine",
      metrics: { intensitySpreadKt: "±7.2 kt", spatialCone24hKm: "±42 km" }
    }
  ],

  multiSourceFeeds: [
    { id: "feed-insat3ds", name: "INSAT-3DS Imager", agency: "ISRO / IMD", type: "Geostationary (82.0°E)", channels: "VIS (0.65µm), IR1 (10.8µm), WV (6.7µm)", resolution: "1 km GSD", latency: "1.2 min", status: "NOMINAL", syncPct: 100 },
    { id: "feed-insat3dr", name: "INSAT-3DR Sounder", agency: "ISRO / IMD", type: "Geostationary (74.0°E)", channels: "18-channel Sounder Profiles", resolution: "10 km GSD", latency: "47 min", status: "DELAYED", syncPct: 78 },
    { id: "feed-insat3d", name: "INSAT-3D Auxiliary", agency: "ISRO / IMD", type: "Geostationary (82.0°E)", channels: "TIR1, TIR2, SWIR", resolution: "4 km GSD", latency: "2.8 min", status: "NOMINAL", syncPct: 99.4 },
    { id: "feed-hima9", name: "Himawari-9 AHI", agency: "JMA Tokyo", type: "Geostationary (140.7°E)", channels: "16-Band Multispectral", resolution: "0.5-2 km", latency: "3.5 min", status: "NOMINAL", syncPct: 99.1 },
    { id: "feed-goes16", name: "GOES-16 ABI", agency: "NOAA / NESDIS", type: "Geostationary (75.2°W)", channels: "Synoptic Hemispheric", resolution: "1 km GSD", latency: "4.8 min", status: "NOMINAL", syncPct: 98.6 },
    { id: "feed-dwr-prdp", name: "DWR Doppler Radar Paradip", agency: "IMD Odisha", type: "Ground S-Band Radar", channels: "Reflectivity (Z), Radial Velocity (V)", resolution: "250 m Radial", latency: "0.8 min", status: "NOMINAL", syncPct: 99.9 },
    { id: "feed-ibtracs", name: "IBTrACS Cyclone Archive", agency: "NOAA NCEI", type: "Reanalysis Truth Archive", channels: "1880-2025 NIO Best Track Climatology", resolution: "Tabular 3-hourly", latency: "Synchronized", status: "NOMINAL", syncPct: 100 }
  ],

  coastalStations: [
    { id: "42976", name: "Paradip Port", state: "Odisha", lat: 20.316, lng: 86.611, distKm: 504, surgeRisk: "3.8m", warning: "RED" },
    { id: "43049", name: "Gopalpur", state: "Odisha", lat: 19.260, lng: 84.900, distKm: 452, surgeRisk: "4.2m", warning: "RED" },
    { id: "43053", name: "Puri Coast", state: "Odisha", lat: 19.813, lng: 85.831, distKm: 470, surgeRisk: "3.5m", warning: "RED" },
    { id: "43149", name: "Visakhapatnam", state: "Andhra Pradesh", lat: 17.686, lng: 83.218, distKm: 468, surgeRisk: "2.1m", warning: "ORANGE" },
    { id: "43105", name: "Kalingapatnam", state: "Andhra Pradesh", lat: 18.330, lng: 84.130, distKm: 412, surgeRisk: "3.9m", warning: "RED" },
    { id: "42901", name: "Digha", state: "West Bengal", lat: 21.626, lng: 87.509, distKm: 648, surgeRisk: "2.4m", warning: "YELLOW" },
    { id: "42903", name: "Sagar Island", state: "West Bengal", lat: 21.650, lng: 88.080, distKm: 654, surgeRisk: "2.2m", warning: "YELLOW" }
  ],

  pipelineNodes: [
    {
      id: 1,
      title: "SATELLITE DATA",
      sub: "INSAT-3DS / Himawari-9 / DWR",
      model: "Multi-Source Ingestion Engine",
      metricName: "CHANNELS",
      metricVal: "6 Active",
      status: "STREAMING",
      statusClass: "live"
    },
    {
      id: 2,
      title: "COMPUTER VISION",
      sub: "YOLOv8 BBox & Eye Reticle",
      model: "YOLOv8n-det-v2.1",
      metricName: "DETECTION",
      metricVal: "94.2%",
      status: "ONLINE",
      statusClass: "running"
    },
    {
      id: 3,
      title: "PATTERN AI",
      sub: "EfficientNet-B4 Morphology",
      model: "CNN-v2.4",
      metricName: "CLASSIFICATION",
      metricVal: "91.4%",
      status: "ONLINE",
      statusClass: "complete"
    },
    {
      id: 4,
      title: "INTENSITY AI",
      sub: "DeepIntense Multi-Head",
      model: "CNN Regression",
      metricName: "ESTIMATION",
      metricVal: "92 kt / 948 hPa",
      status: "ONLINE",
      statusClass: "complete"
    },
    {
      id: 5,
      title: "TEMPORAL AI",
      sub: "ConvLSTM 12-Frame Sequence",
      model: "ConvLSTM-v1.8",
      metricName: "ENCODER",
      metricVal: "87.8%",
      status: "ONLINE",
      statusClass: "complete"
    },
    {
      id: 6,
      title: "FORECAST ENGINE",
      sub: "6h / 12h / 24h / 48h / 72h",
      model: "Trajectory & Dispersion Cone",
      metricName: "HORIZON",
      metricVal: "72 Hours",
      status: "ISSUED",
      statusClass: "complete"
    }
  ],

  currentTelemetry: {
    stormId: "BOB-04/2026",
    stormName: "VYUHA",
    stage: "VERY SEVERE CYCLONIC STORM (VSCS)",
    dvorakTNo: "T5.0 / CI 5.0",
    centerLat: 15.80,
    centerLng: 87.20,
    centerFormatted: "15.80°N, 87.20°E",
    speedKnots: 92,
    speedKmph: 170,
    estimatedNext24hKnots: 98,
    estimatedNext24hKmph: 181,
    centralPressureHpa: 948,
    pressureDropHpa: -26,
    trend: "INTENSIFYING",
    movementHeading: "315° (North-West)",
    forwardSpeedKmph: 16,
    eyeDiameterKm: 32,
    eyeCloudTopTempC: -78.4,
    eyewallTempC: -82.6,
    radiusMaxWindKm: 45,
    radiusOuterGaleKm: 280,
    primaryPattern: "CENTRAL DENSE OVERCAST (CDO)",
    subPattern: "Curved Band with Embedded Eye",
    patternConfidence: 96.1,
    aiDetectionConfidence: 94.2,
    intensityConfidence: 89.7,
    trackConfidence: 87.8,
    uncertainty: {
      intensityMarginKt: 7,
      trackErrorRangeKm: 42,
      confidenceScorePct: 82,
      explanation: "Higher uncertainty indicates lower model confidence due to limited or conflicting observations in peripheral band convection."
    },
    riskEngine: {
      score: 78,
      level: "HIGH RISK",
      color: "#D9541E",
      factors: [
        "Rapid intensification threshold (+20 kt/24h) triggered by CNN Regression",
        "Track steering vector aligned with high Sea Surface Temperature (SST > 30.5°C)",
        "Coastal proximity decreasing: Landfall ETA ~46 hours (Odisha-Andhra coast)",
        "Eye-wall symmetry index elevated (>0.88), indicating compact destructive core"
      ]
    }
  },

  explainabilityFeatures: [
    {
      feature: "Central Convection Intensity",
      contribution: 32,
      val: "-82.6°C IR brightness temp",
      impact: "positive",
      desc: "Deep convective cloud top temperature below -80°C fuels high latent heat release."
    },
    {
      feature: "Cloud Symmetry Index",
      contribution: 24,
      val: "0.89 / 1.00 Circularity",
      impact: "positive",
      desc: "Uniform radial gradient detected by YOLOv8 circularity kernel confirms vortex maturity."
    },
    {
      feature: "Curved Spiral Bands",
      contribution: 19,
      val: "1.12 Logarithmic Spiral Turn",
      impact: "positive",
      desc: "Persistent spiral feeder bands channeling high moisture from equatorial Bay of Bengal."
    },
    {
      feature: "Temperature Signature (Eye-to-Wall Gradient)",
      contribution: 15,
      val: "ΔT = +14.2°C contrast",
      impact: "positive",
      desc: "Pronounced thermal contrast between warm eye sinking air and freezing convective eyewall."
    },
    {
      feature: "Historical Intensity Trend & Ocean Heat",
      contribution: 10,
      val: "OHC > 95 kJ/cm²",
      impact: "positive",
      desc: "High Tropical Cyclone Heat Potential (TCHP) in central Bay supports continued strengthening."
    }
  ],

  forecastTrack: [
    {
      step: "T0",
      timeOffset: "0h",
      validTime: "29-Sep 18:00 UTC",
      lat: 15.80,
      lng: 87.20,
      aiKnots: 92,
      aiKmph: 170,
      pressureHpa: 948,
      confidencePct: 94.2,
      errorRadiusKm: 0,
      bestTrackLat: 15.80,
      bestTrackLng: 87.20,
      bestTrackKnots: 90,
      status: "Observed"
    },
    {
      step: "+6H",
      timeOffset: "6h",
      validTime: "30-Sep 00:00 UTC",
      lat: 16.35,
      lng: 86.75,
      aiKnots: 95,
      aiKmph: 176,
      pressureHpa: 944,
      confidencePct: 91.8,
      errorRadiusKm: 14,
      bestTrackLat: 16.30,
      bestTrackLng: 86.80,
      bestTrackKnots: 95,
      status: "Forecast"
    },
    {
      step: "+12H",
      timeOffset: "12h",
      validTime: "30-Sep 06:00 UTC",
      lat: 17.00,
      lng: 86.20,
      aiKnots: 98,
      aiKmph: 181,
      pressureHpa: 940,
      confidencePct: 89.4,
      errorRadiusKm: 26,
      bestTrackLat: 16.90,
      bestTrackLng: 86.30,
      bestTrackKnots: 97,
      status: "Forecast"
    },
    {
      step: "+24H",
      timeOffset: "24h",
      validTime: "30-Sep 18:00 UTC",
      lat: 18.25,
      lng: 85.35,
      aiKnots: 100,
      aiKmph: 185,
      pressureHpa: 938,
      confidencePct: 85.6,
      errorRadiusKm: 42,
      bestTrackLat: 18.10,
      bestTrackLng: 85.50,
      bestTrackKnots: 100,
      status: "Forecast (Peak)"
    },
    {
      step: "+48H",
      timeOffset: "48h",
      validTime: "01-Oct 18:00 UTC",
      lat: 19.80,
      lng: 84.40,
      aiKnots: 85,
      aiKmph: 157,
      pressureHpa: 958,
      confidencePct: 78.2,
      errorRadiusKm: 78,
      bestTrackLat: 19.65,
      bestTrackLng: 84.60,
      bestTrackKnots: 88,
      status: "Coastal Landfall"
    },
    {
      step: "+72H",
      timeOffset: "72h",
      validTime: "02-Oct 18:00 UTC",
      lat: 21.10,
      lng: 83.70,
      aiKnots: 45,
      aiKmph: 83,
      pressureHpa: 988,
      confidencePct: 69.5,
      errorRadiusKm: 130,
      bestTrackLat: 20.95,
      bestTrackLng: 83.95,
      bestTrackKnots: 40,
      status: "Inland Dissipation"
    }
  ],

  timelineFrames: [
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
      notes: "Peak intensity over central-west Bay before coastal boundary interaction."
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
  ],

  inferenceLogStream: [
    { time: "17:58:02 UTC", msg: "INSAT-3DS High-Rate multi-spectral packet ingested [Band: IR1 10.8µm]" },
    { time: "17:58:04 UTC", msg: "Radiometric calibration complete [TBB Range: 188.2K - 298.6K]" },
    { time: "17:58:05 UTC", msg: "YOLOv8-Cyclone inference completed [Center: 15.80°N 87.20°E, Conf: 94.2%]" },
    { time: "17:58:06 UTC", msg: "Eye extraction kernel located pinhole eye [Radius: 16 km, Temp: -78.4°C]" },
    { time: "17:58:07 UTC", msg: "EfficientNet-B4 classification: CDO 96.1%, Curved Band 91.4%" },
    { time: "17:58:08 UTC", msg: "DeepIntense-v3 regression: Vmax 92 kt (170 km/h), MSLP 948 hPa" },
    { time: "17:58:09 UTC", msg: "ConvLSTM 12-frame spatio-temporal sequence generated [72h Track Horizon]" },
    { time: "17:58:10 UTC", msg: "Monte Carlo 100-sample uncertainty cone computed [24h error: ±42 km]" },
    { time: "17:58:11 UTC", msg: "Operational bulletin BOB/04/2026/14 broadcasted to NDRF & State EOCs" }
  ]
};
