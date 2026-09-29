# VYUHA CYCLONE WATCH — AI/ML Workflow Suite

**Smart India Hackathon 2026 — Problem Statement PS 26070**  
*“AI/ML based system for identification, classification and prediction of different tropical cyclone patterns using multi-source satellite data.”*

---

## 1. System Overview
**VYUHA Cyclone Watch** is a frontend-only operational meteorological workflow application that visualizes the end-to-end AI/ML cyclone intelligence pipeline for the North Indian Ocean basin (Bay of Bengal and Arabian Sea).

All data is served locally from a single typed mock data layer (`src/mocks/mockData.ts` via `src/services/dataService.ts`) with zero external network dependencies.

---

## 2. Six-Stage Workflow Architecture

```
┌─────────────────┐       ┌─────────────────┐       ┌─────────────────┐
│ 01. START       │ ───►  │ 02. COLLECT     │ ───►  │ 03. PREPROCESS  │
│ Initialize run  │       │ INSAT+NOAA+NASA │       │ Clean+Align+Fuse│
└─────────────────┘       └─────────────────┘       └─────────────────┘
         │
         ▼
┌─────────────────┐       ┌─────────────────┐       ┌─────────────────┐
│ 04. AI ANALYSIS │ ───►  │ 05. DETECTION   │ ───►  │ 06. CLASSIFY    │
│ CNN+LSTM+Transf │       │ Pattern + Eye   │       │ Category & 72h  │
└─────────────────┘       └─────────────────┘       └─────────────────┘
```

1. **STAGE 01: START SYSTEM**
   - Booting and system diagnostics for multi-source satellite ingestion, preprocessing workers, neural inference models, and GIS mapping engines.
   - Primary **Run Pipeline (Auto 1 ➔ 6)** trigger and reset controls.

2. **STAGE 02: COLLECT SATELLITE DATA**
   - Multi-source ingestion matrix (**INSAT-3DS**, **NOAA GOES-16**, **NASA GPM**).
   - Real-time receptor telemetry: Status, last-received UTC timestamp, spectral channels (IR1 $10.8\,\mu\text{m}$, VIS $0.65\,\mu\text{m}$, WV $6.7\,\mu\text{m}$), resolution, coverage extent, and interactive source enable/disable toggles.

3. **STAGE 03: DATA PREPROCESSING**
   - Three structured sub-steps:
     1. **Clean**: Median noise removal and radiometric calibration ($188.2\,\text{K} - 298.6\,\text{K}$).
     2. **Align**: Geo-spatial ephemeris alignment and Mercator WGS84 $0.01^\circ$ resampling.
     3. **Fuse**: Multi-spectral tensor stacking $[1, 4, 512, 512]$.
   - Before & after visual preview comparing uncalibrated raw optical imagery to the calibrated multi-spectral tensor.
   - Quality metrics: Missing pixels ($0.04\%$), RMS alignment offset ($0.12\,\text{pixels}$), Signal-to-Noise Ratio ($42.8\,\text{dB}$).

4. **STAGE 04: AI/ML ANALYSIS**
   - Multi-model complementary neural ensemble:
     - **CNN (Spatial Features / Intensity)**: Extracting vortex symmetry ($0.89$), eyewall temperature gradient ($\Delta T = 14.2^\circ\text{C}$), and spatial $V_{\max}$ ($92\,\text{kt}$).
     - **LSTM (Temporal Sequence / Track)**: Processing $12$-hour kinematic sequence, forward speed ($16\,\text{km/h}$), and heading vector ($315^\circ$ NW).
     - **Transformer (Fused Attention)**: Cross-attention fusion evaluating environmental shear and ocean heat ($98\,\text{kJ/cm}^2$) for rapid intensification likelihood ($78\%$).

5. **STAGE 05: CYCLONE DETECTION**
   - Automated identification of cyclone patterns (CDO, Spiral Curved Band, Pinhole Eye).
   - Interactive GIS map showing detected cyclonic systems (Primary Cyclone VYUHA and Secondary Disturbance BOB-05), bounding boxes, center coordinates ($15.80^\circ\text{N}, 87.20^\circ\text{E}$), and gale radii ($R34 = 280\,\text{km}$).
   - Satellite overlay controls (`RAW`, `HEATMAP`, `SEGMENTATION`, `SOBEL EDGE`).

6. **STAGE 06: INTENSITY CLASSIFICATION & FORECAST**
   - IMD/RSMC cyclone intensity scale probability distribution (Depression, Deep Depression, Cyclonic Storm, Severe, **Very Severe Cyclonic Storm (VSCS)**, Extremely Severe, Super Cyclone).
   - Operational parameters: $V_{\max} = 92\,\text{kt}$ ($170\,\text{km/h}$), Central $\text{MSLP} = 948\,\text{hPa}$, Dvorak $T5.0$.
   - ConvLSTM 72-hour trajectory table ($T_0$ to $+72\text{h}$) with Monte Carlo epistemic uncertainty envelope ($\pm 42\,\text{km}$ at 24h, $\pm 78\,\text{km}$ at 48h).

---

## 3. Visual Styling Standards
- **Background**: Warm off-white (`#F4F2EC`)
- **Surfaces**: Flat white (`#FFFFFF`) and light gray-beige (`#EAE6DC`)
- **Borders**: 1px hairline (`#D6D2C8`)
- **Ink Text**: Deep charcoal (`#1A1D21`)
- **Accent**: International Orange (`#D9541E`), strictly for active nodes, selected table rows, and track lines.
- **Typography**: IBM Plex Sans (UI) & IBM Plex Mono (numbers, coordinates, timestamps).
- **Corner Radius**: Sharp $\le 2\text{px}$ (No rounded pill buttons, no glow, no glassmorphism).

---

## 4. How to Run Locally

```bash
# Navigate to the frontend directory
cd frontend

# Install dependencies
npm install

# Start Vite React dev server
npm run dev

# Production build
npm run build
```

The application runs at **`http://localhost:3000`**.
