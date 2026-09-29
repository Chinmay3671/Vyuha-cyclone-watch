/**
 * VYUHA CYCLONE INTELLIGENCE - OPERATIONAL CONTROLLER
 * Smart India Hackathon 2026 - Problem Statement PS 26070
 */

(function(window, document, L) {
  'use strict';

  class VyuhaAppController {
    constructor() {
      this.api = window.VyuhaAPI;
      this.map = null;
      this.mapLayers = {};
      this.isReplaying = false;
      this.replayTimer = null;
      this.audioCtx = null;
      this.canvas = null;
      this.ctx = null;
    }

    init() {
      this.initDomReferences();
      this.initRouting();
      this.initPipeline();
      this.initModelTable();
      this.initFeedsTable();
      this.initStationsTable();
      this.initForecastTable();
      this.initPatternList();
      this.initExplainability();
      this.initSatelliteCanvas();
      this.initTerminalLog();
      this.initLeafletMap();
      this.initTimelineScrubber();
      this.initAudio();
      this.initJsonViewer();
      this.initRiskEngine();
      this.bindActions();

      // Subscribe to central API state changes
      this.api.subscribe((state, changedKeys) => this.onStateChange(state, changedKeys));

      // Initial state sync
      this.onStateChange(this.api.getState(), Object.keys(this.api.getState()));
    }

    initDomReferences() {
      this.el = {
        staleNoticeBar: document.getElementById('staleNoticeBar'),
        btnDismissStale: document.getElementById('btnDismissStale'),
        audioToggleBtn: document.getElementById('audioToggleBtn'),
        pipelineGrid: document.getElementById('pipelineGrid'),
        modelTableBody: document.getElementById('modelTableBody'),
        feedsTableBody: document.getElementById('feedsTableBody'),
        stationsTableBody: document.getElementById('stationsTableBody'),
        forecastTableBody: document.getElementById('forecastTableBody'),
        patternTableBody: document.getElementById('patternTableBody'),
        xaiFeatureList: document.getElementById('xaiFeatureList'),
        satelliteDisplayImg: document.getElementById('satelliteDisplayImg'),
        satelliteAiCanvas: document.getElementById('satelliteAiCanvas'),
        laserScanline: document.getElementById('laserScanline'),
        btnTriggerScan: document.getElementById('btnTriggerScan'),
        hudDetectionConf: document.getElementById('hudDetectionConf'),
        hudCenterCoords: document.getElementById('hudCenterCoords'),
        hudPatternLabel: document.getElementById('hudPatternLabel'),
        statVmaxKnots: document.getElementById('statVmaxKnots'),
        statVmaxKmph: document.getElementById('statVmaxKmph'),
        statMslpHpa: document.getElementById('statMslpHpa'),
        statStageName: document.getElementById('statStageName'),
        terminalLogsContainer: document.getElementById('terminalLogsContainer'),
        timelineRangeInput: document.getElementById('timelineRangeInput'),
        activeFrameReadout: document.getElementById('activeFrameReadout'),
        btnScrubPrev: document.getElementById('btnScrubPrev'),
        btnScrubPlay: document.getElementById('btnScrubPlay'),
        btnScrubNext: document.getElementById('btnScrubNext'),
        rawJsonViewer: document.getElementById('rawJsonViewer'),
        btnCopyJson: document.getElementById('btnCopyJson'),
        riskFactorList: document.getElementById('riskFactorList'),
        riskScoreBadge: document.getElementById('riskScoreBadge')
      };
    }

    /* ================= Web Audio Synthesizer ================= */
    initAudio() {
      if (this.el.audioToggleBtn) {
        this.el.audioToggleBtn.addEventListener('click', () => {
          this.api.toggleAudio();
        });
      }
    }

    playSound(type = 'beep') {
      const state = this.api.getState();
      if (state.audioMuted) return;

      try {
        if (!this.audioCtx) {
          this.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        }
        if (this.audioCtx.state === 'suspended') {
          this.audioCtx.resume();
        }

        const osc = this.audioCtx.createOscillator();
        const gain = this.audioCtx.createGain();
        osc.connect(gain);
        gain.connect(this.audioCtx.destination);

        const now = this.audioCtx.currentTime;
        if (type === 'scan') {
          osc.type = 'sine';
          osc.frequency.setValueAtTime(520, now);
          osc.frequency.exponentialRampToValueAtTime(1040, now + 0.2);
          gain.gain.setValueAtTime(0.08, now);
          gain.gain.linearRampToValueAtTime(0.001, now + 0.2);
          osc.start(now);
          osc.stop(now + 0.2);
        } else if (type === 'click') {
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(480, now);
          gain.gain.setValueAtTime(0.04, now);
          gain.gain.linearRampToValueAtTime(0.001, now + 0.05);
          osc.start(now);
          osc.stop(now + 0.05);
        }
      } catch (err) {
        console.warn('Audio synthesis disabled', err);
      }
    }

    /* ================= Routing & Tabs ================= */
    initRouting() {
      const navButtons = document.querySelectorAll('.nav-tab-item');
      const views = document.querySelectorAll('.workstation-view');

      const applyRoute = (tabName) => {
        navButtons.forEach(b => {
          if (b.dataset.tab === tabName) {
            b.classList.add('active');
          } else {
            b.classList.remove('active');
          }
        });

        views.forEach(v => {
          if (v.id === `view-${tabName}`) {
            v.classList.add('active-view');
          } else {
            v.classList.remove('active-view');
          }
        });

        if (this.map && (tabName === 'dashboard' || tabName === 'vision-studio')) {
          setTimeout(() => this.map.invalidateSize(), 150);
        }
      };

      navButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
          e.preventDefault();
          const targetTab = btn.dataset.tab;
          this.playSound('click');
          this.api.setRoute(targetTab);
          window.location.hash = `#/${targetTab}`;
        });
      });

      // Handle direct hash navigation or reload
      const hash = window.location.hash.replace('#/', '');
      if (hash && ['dashboard', 'vision-studio', 'convlstm', 'fusion', 'risk', 'raw-json'].includes(hash)) {
        this.api.setRoute(hash);
      }
    }

    /* ================= Top 6-Step Pipeline Grid ================= */
    initPipeline() {
      if (!this.el.pipelineGrid) return;
      const nodes = this.api.getPipelineNodes();

      this.el.pipelineGrid.innerHTML = nodes.map(n => `
        <div class="pipeline-step ${n.id === 2 ? 'active' : ''}" data-step-id="${n.id}">
          <div class="pipeline-step-header">
            <span class="step-num mono">STEP 0${n.id}</span>
            <span class="step-status-tag mono">${n.status}</span>
          </div>
          <div class="step-name">${n.title}</div>
          <div class="step-model mono">${n.sub}</div>
          <div class="step-metric mono">${n.metricName}: ${n.metricVal}</div>
        </div>
      `).join('');

      this.el.pipelineGrid.querySelectorAll('.pipeline-step').forEach(elem => {
        elem.addEventListener('click', () => {
          this.playSound('click');
          this.el.pipelineGrid.querySelectorAll('.pipeline-step').forEach(s => s.classList.remove('active'));
          elem.classList.add('active');
          const stepId = parseInt(elem.dataset.stepId, 10);
          this.addTerminalLog(`OPERATOR: Pipeline focus switched to Step 0${stepId}`);
        });
      });
    }

    /* ================= Left Column Tables ================= */
    initModelTable() {
      if (!this.el.modelTableBody) return;
      const models = this.api.getModels();

      this.el.modelTableBody.innerHTML = models.map(m => `
        <tr data-model-id="${m.id}">
          <td class="mono"><b>${m.name}</b><br/><span style="color:var(--text-secondary);">${m.version}</span></td>
          <td class="mono">${m.task}</td>
          <td class="mono" style="text-align:right;"><b>${m.accuracy}</b><br/><span style="color:var(--text-secondary);">${m.latency}</span></td>
        </tr>
      `).join('');

      this.el.modelTableBody.querySelectorAll('tr').forEach(row => {
        row.addEventListener('click', () => {
          this.playSound('click');
          this.el.modelTableBody.querySelectorAll('tr').forEach(r => r.classList.remove('selected-row'));
          row.classList.add('selected-row');
          const m = this.api.getModelById(row.dataset.modelId);
          if (m) {
            this.addTerminalLog(`INSPECTOR: Model ${m.name} (${m.version}) weights ${m.weightsSize} [${m.backbone}]`);
          }
        });
      });
    }

    initFeedsTable() {
      if (!this.el.feedsTableBody) return;
      const feeds = this.api.getFeeds();

      this.el.feedsTableBody.innerHTML = feeds.map(f => `
        <tr>
          <td class="mono">
            <span class="status-dot-solid ${f.status === 'DELAYED' ? 'delayed' : ''}"></span>
            <b>${f.name}</b>
          </td>
          <td class="mono">${f.type}</td>
          <td class="mono" style="text-align:right; color:${f.status === 'DELAYED' ? 'var(--status-amber)' : 'inherit'};">
            ${f.latency}
          </td>
        </tr>
      `).join('');
    }

    initStationsTable() {
      if (!this.el.stationsTableBody) return;
      const stations = this.api.getCoastalStations();

      this.el.stationsTableBody.innerHTML = stations.map(s => `
        <tr data-station-id="${s.id}">
          <td class="mono"><b>${s.name}</b> (${s.state})</td>
          <td class="mono">${s.distKm} km</td>
          <td class="mono" style="text-align:right; font-weight:600; color:${s.warning === 'RED' ? 'var(--status-red)' : 'var(--status-amber)'};">
            ${s.surgeRisk} (${s.warning})
          </td>
        </tr>
      `).join('');

      this.el.stationsTableBody.querySelectorAll('tr').forEach(row => {
        row.addEventListener('click', () => {
          this.playSound('click');
          const stationId = row.dataset.stationId;
          const st = stations.find(x => x.id === stationId);
          if (st && this.map) {
            this.map.flyTo([st.lat, st.lng], 8);
            this.addTerminalLog(`STATION FOCUS: ${st.name} [Lat ${st.lat}°N, Lng ${st.lng}°E, Storm Surge: ${st.surgeRisk}]`);
          }
        });
      });
    }

    initForecastTable() {
      if (!this.el.forecastTableBody) return;
      const track = this.api.getForecastTrack();

      this.el.forecastTableBody.innerHTML = track.map(p => `
        <tr data-step="${p.step}" class="${p.step === 'T0' ? 'selected-row' : ''}">
          <td class="mono"><b>${p.step}</b><br/>${p.validTime}</td>
          <td class="mono">${p.lat.toFixed(2)}°N<br/>${p.lng.toFixed(2)}°E</td>
          <td class="mono" style="text-align:right;">
            <b>${p.aiKnots} kt</b> (${p.pressureHpa} hPa)<br/>
            <span style="color:var(--text-secondary); font-size:10px;">Ref: ${p.bestTrackKnots} kt</span>
          </td>
        </tr>
      `).join('');

      this.el.forecastTableBody.querySelectorAll('tr').forEach(row => {
        row.addEventListener('click', () => {
          this.playSound('click');
          const step = row.dataset.step;
          this.api.setSelectedForecast(step);
          this.el.forecastTableBody.querySelectorAll('tr').forEach(r => r.classList.remove('selected-row'));
          row.classList.add('selected-row');

          const pt = this.api.getForecastPoint(step);
          if (pt && this.map) {
            this.map.panTo([pt.lat, pt.lng]);
          }
        });
      });
    }

    /* ================= Right Column Pattern & XAI ================= */
    initPatternList() {
      if (!this.el.patternTableBody) return;
      const patterns = this.api.getPatternProbabilities();

      this.el.patternTableBody.innerHTML = patterns.map(p => `
        <tr class="${p.isDetected ? 'selected-row' : ''}">
          <td><b>${p.name}</b><br/><span style="color:var(--text-secondary); font-size:10px;">${p.desc}</span></td>
          <td class="mono" style="text-align:right; font-weight:700;">${p.prob}%</td>
        </tr>
      `).join('');
    }

    initExplainability() {
      if (!this.el.xaiFeatureList) return;
      const features = this.api.getExplainabilityFeatures();

      this.el.xaiFeatureList.innerHTML = features.map(f => `
        <div class="feature-row">
          <div class="feature-header">
            <span class="feature-name">${f.feature}</span>
            <span class="feature-percent mono">+${f.contribution}%</span>
          </div>
          <div class="feature-track-bar">
            <div class="feature-track-fill" style="width: ${f.contribution * 2.8}%;"></div>
          </div>
          <div class="feature-desc">${f.desc} <span class="mono" style="color:var(--text-primary);">(${f.val})</span></div>
        </div>
      `).join('');
    }

    /* ================= Satellite Vision Canvas & Overlays ================= */
    initSatelliteCanvas() {
      if (!this.el.satelliteAiCanvas) return;
      this.canvas = this.el.satelliteAiCanvas;
      this.ctx = this.canvas.getContext('2d');

      this.resizeCanvas();
      window.addEventListener('resize', () => this.resizeCanvas());
      this.renderSatelliteOverlays();
    }

    resizeCanvas() {
      if (!this.canvas) return;
      const rect = this.canvas.parentElement.getBoundingClientRect();
      this.canvas.width = rect.width;
      this.canvas.height = rect.height;
      this.renderSatelliteOverlays();
    }

    renderSatelliteOverlays() {
      if (!this.ctx || !this.canvas) return;
      const w = this.canvas.width;
      const h = this.canvas.height;
      this.ctx.clearRect(0, 0, w, h);

      const state = this.api.getState();
      const frame = this.api.getCurrentTimelineFrame();
      const box = frame.yoloBox || [0.2, 0.2, 0.6, 0.6];

      const bx = box[0] * w;
      const by = box[1] * h;
      const bw = box[2] * w;
      const bh = box[3] * h;
      const cx = bx + bw / 2;
      const cy = by + bh / 2;

      // 1. Heatmap layer (Grad-CAM)
      if (state.activeVisionLayer === 'heatmap') {
        const grad = this.ctx.createRadialGradient(cx, cy, 10, cx, cy, bw * 0.6);
        grad.addColorStop(0, 'rgba(217, 84, 30, 0.7)');
        grad.addColorStop(0.3, 'rgba(230, 140, 50, 0.5)');
        grad.addColorStop(0.6, 'rgba(90, 96, 105, 0.3)');
        grad.addColorStop(1, 'rgba(0, 0, 0, 0)');

        this.ctx.save();
        this.ctx.fillStyle = grad;
        this.ctx.fillRect(0, 0, w, h);
        this.ctx.restore();
      }

      // 2. Segmentation mask
      if (state.activeVisionLayer === 'seg') {
        this.ctx.save();
        this.ctx.beginPath();
        this.ctx.arc(cx, cy, 14, 0, 2 * Math.PI);
        this.ctx.strokeStyle = '#D9541E';
        this.ctx.lineWidth = 2;
        this.ctx.stroke();

        this.ctx.beginPath();
        this.ctx.arc(cx, cy, bw * 0.28, 0, 2 * Math.PI);
        this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.8)';
        this.ctx.lineWidth = 2;
        this.ctx.stroke();
        this.ctx.restore();
      }

      // 3. Edge features
      if (state.activeVisionLayer === 'edge') {
        this.ctx.save();
        this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.7)';
        this.ctx.lineWidth = 1;
        for (let r = 20; r < bw * 0.55; r += 24) {
          this.ctx.beginPath();
          this.ctx.arc(cx, cy, r, -0.2, Math.PI * 1.5);
          this.ctx.stroke();
        }
        this.ctx.restore();
      }

      // 4. Clean monochrome technical YOLO Bounding Box
      this.ctx.save();
      this.ctx.strokeStyle = '#D9541E';
      this.ctx.lineWidth = 1.5;
      this.ctx.strokeRect(bx, by, bw, bh);

      // Center crosshair
      this.ctx.beginPath();
      this.ctx.moveTo(cx - 10, cy);
      this.ctx.lineTo(cx + 10, cy);
      this.ctx.moveTo(cx, cy - 10);
      this.ctx.lineTo(cx, cy + 10);
      this.ctx.stroke();

      // Label tag
      this.ctx.fillStyle = '#000000';
      this.ctx.fillRect(bx, by - 16, 170, 16);
      this.ctx.fillStyle = '#FFFFFF';
      this.ctx.font = '10px "IBM Plex Mono", monospace';
      this.ctx.fillText(`YOLOv8: CENTER (${frame.detectionConf}%)`, bx + 4, by - 4);

      this.ctx.restore();
    }

    triggerAiScan() {
      this.playSound('scan');
      if (this.el.laserScanline) {
        this.el.laserScanline.classList.add('active-scan');
        setTimeout(() => {
          this.el.laserScanline.classList.remove('active-scan');
          this.addTerminalLog(`INFERENCE: Vortex center re-anchored at Lat ${this.api.getTelemetry().centerFormatted}`);
          this.renderSatelliteOverlays();
        }, 1800);
      }
    }

    /* ================= Cartographic Leaflet Map ================= */
    initLeafletMap() {
      const mapContainer = document.getElementById('leafletMapContainer');
      if (!mapContainer || !L) return;

      this.map = L.map('leafletMapContainer', {
        center: [17.5, 86.5],
        zoom: 6,
        zoomControl: false,
        attributionControl: false
      });

      // CartoDB Positron clean grayscale cartographic layer
      L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
        maxZoom: 18,
        subdomains: 'abcd'
      }).addTo(this.map);

      L.control.zoom({ position: 'topright' }).addTo(this.map);

      this.renderMapVectors();
    }

    renderMapVectors() {
      if (!this.map || !L) return;

      if (this.mapLayers.group) {
        this.map.removeLayer(this.mapLayers.group);
      }

      const group = L.layerGroup();
      const track = this.api.getForecastTrack();
      const stations = this.api.getCoastalStations();

      // 1. Uncertainty Cone Polygon (Hairline border, light fill)
      const coneCoords = [];
      track.forEach(pt => {
        const offsetLat = pt.lat + (pt.errorRadiusKm / 111) * 0.65;
        const offsetLng = pt.lng - (pt.errorRadiusKm / 111) * 0.65;
        coneCoords.push([offsetLat, offsetLng]);
      });
      for (let i = track.length - 1; i >= 0; i--) {
        const pt = track[i];
        const offsetLat = pt.lat - (pt.errorRadiusKm / 111) * 0.65;
        const offsetLng = pt.lng + (pt.errorRadiusKm / 111) * 0.65;
        coneCoords.push([offsetLat, offsetLng]);
      }

      const conePoly = L.polygon(coneCoords, {
        color: '#D6D2C8',
        weight: 1,
        dashArray: '3, 3',
        fillColor: '#D9541E',
        fillOpacity: 0.08
      });
      group.addLayer(conePoly);

      // 2. Best Track Reference (Dashed gray line)
      const bestTrackPoints = track.map(pt => [pt.bestTrackLat, pt.bestTrackLng]);
      const bestPoly = L.polyline(bestTrackPoints, {
        color: '#878E99',
        weight: 1.5,
        dashArray: '4, 4'
      });
      group.addLayer(bestPoly);

      // 3. AI Predicted Track (Clean solid international orange)
      const aiTrackPoints = track.map(pt => [pt.lat, pt.lng]);
      const aiPoly = L.polyline(aiTrackPoints, {
        color: '#D9541E',
        weight: 2.5,
        opacity: 1
      });
      group.addLayer(aiPoly);

      // 4. Plotted Forecast Waypoints
      track.forEach((pt, idx) => {
        const isCurrent = idx === 0;
        const markerHtml = isCurrent 
          ? `<div style="width:12px; height:12px; border-radius:50%; background:#D9541E; border:2px solid #FFFFFF; box-shadow:0 0 0 1px #1A1D21;"></div>`
          : `<div style="width:8px; height:8px; border-radius:50%; background:#1A1D21; border:1px solid #FFFFFF;"></div>`;

        const icon = L.divIcon({
          html: markerHtml,
          className: 'carto-map-node',
          iconSize: [12, 12],
          iconAnchor: [6, 6]
        });

        const marker = L.marker([pt.lat, pt.lng], { icon });
        marker.bindPopup(`
          <div style="font-family:'IBM Plex Mono', monospace; font-size:11px; color:#1A1D21; padding:2px;">
            <b>${pt.step} • ${pt.validTime}</b><br/>
            Vmax: <b>${pt.aiKnots} kt</b> (${pt.aiKmph} km/h)<br/>
            MSLP: <b>${pt.pressureHpa} hPa</b><br/>
            Dispersion: <b>±${pt.errorRadiusKm} km</b><br/>
            Reference: ${pt.bestTrackKnots} kt
          </div>
        `);
        group.addLayer(marker);
      });

      // 5. Coastal Station Waypoints
      stations.forEach(s => {
        const stIcon = L.divIcon({
          html: `<div style="font-family:'IBM Plex Mono', monospace; font-size:9px; background:#FFFFFF; border:1px solid #D6D2C8; padding:1px 3px; white-space:nowrap;">▲ ${s.name}</div>`,
          className: 'station-pin',
          iconSize: [60, 16],
          iconAnchor: [30, 8]
        });
        const stMarker = L.marker([s.lat, s.lng], { icon: stIcon });
        stMarker.bindPopup(`
          <div style="font-family:'IBM Plex Mono', monospace; font-size:11px; color:#1A1D21;">
            <b>${s.name} (${s.state})</b><br/>
            Storm Distance: ${s.distKm} km<br/>
            Surge Risk: ${s.surgeRisk}<br/>
            Warning Level: <b>${s.warning}</b>
          </div>
        `);
        group.addLayer(stMarker);
      });

      group.addTo(this.map);
      this.mapLayers.group = group;
    }

    /* ================= Terminal Inference Log ================= */
    initTerminalLog() {
      if (!this.el.terminalLogsContainer) return;
      const logs = this.api.getInferenceLogs();

      this.el.terminalLogsContainer.innerHTML = logs.map(l => `
        <div class="log-entry">
          <span class="log-timestamp">[${l.time}]</span>
          <span class="log-content">${l.msg}</span>
        </div>
      `).join('');
    }

    addTerminalLog(msg) {
      if (!this.el.terminalLogsContainer) return;
      const now = new Date();
      const timeStr = `${now.toISOString().substring(11, 19)} UTC`;
      const div = document.createElement('div');
      div.className = 'log-entry';
      div.innerHTML = `
        <span class="log-timestamp">[${timeStr}]</span>
        <span class="log-content accent">${msg}</span>
      `;
      this.el.terminalLogsContainer.prepend(div);
    }

    /* ================= Timeline Replay Scrubber ================= */
    initTimelineScrubber() {
      if (!this.el.timelineRangeInput) return;

      this.el.timelineRangeInput.addEventListener('input', (e) => {
        const idx = parseInt(e.target.value, 10);
        this.api.setActiveFrame(idx);
      });

      if (this.el.btnScrubPrev) {
        this.el.btnScrubPrev.addEventListener('click', () => {
          this.playSound('click');
          this.api.prevFrame();
        });
      }

      if (this.el.btnScrubNext) {
        this.el.btnScrubNext.addEventListener('click', () => {
          this.playSound('click');
          this.api.nextFrame();
        });
      }

      if (this.el.btnScrubPlay) {
        this.el.btnScrubPlay.addEventListener('click', () => {
          this.isReplaying = !this.isReplaying;
          this.el.btnScrubPlay.textContent = this.isReplaying ? 'PAUSE' : 'PLAY';
          this.playSound('click');

          if (this.isReplaying) {
            this.replayTimer = setInterval(() => {
              this.api.nextFrame();
            }, 2000);
          } else {
            clearInterval(this.replayTimer);
          }
        });
      }
    }

    /* ================= Raw JSON Viewer ================= */
    initJsonViewer() {
      if (!this.el.rawJsonViewer) return;

      const payload = {
        bulletin_meta: this.api.getMetadata(),
        telemetry: this.api.getTelemetry(),
        models: this.api.getModels(),
        stations: this.api.getCoastalStations(),
        convlstm_forecast: this.api.getForecastTrack(),
        xai_shap: this.api.getExplainabilityFeatures()
      };

      this.el.rawJsonViewer.textContent = JSON.stringify(payload, null, 2);

      if (this.el.btnCopyJson) {
        this.el.btnCopyJson.addEventListener('click', () => {
          navigator.clipboard.writeText(JSON.stringify(payload, null, 2));
          this.playSound('click');
          this.el.btnCopyJson.textContent = 'COPIED TO CLIPBOARD';
          setTimeout(() => { this.el.btnCopyJson.textContent = 'COPY JSON PAYLOAD'; }, 2000);
        });
      }
    }

    /* ================= Risk Engine ================= */
    initRiskEngine() {
      if (!this.el.riskFactorList) return;
      const risk = this.api.getDisasterRisk();

      this.el.riskFactorList.innerHTML = risk.factors.map(f => `
        <li style="margin-bottom:4px;">${f}</li>
      `).join('');

      if (this.el.riskScoreBadge) {
        this.el.riskScoreBadge.textContent = `RISK SCORE: ${risk.score} / 100 (${risk.level})`;
      }
    }

    /* ================= Bind Layer Toggles & Buttons ================= */
    bindActions() {
      // Dismiss stale notice
      if (this.el.btnDismissStale) {
        this.el.btnDismissStale.addEventListener('click', () => {
          this.api.dismissStaleWarning();
          this.playSound('click');
        });
      }

      // Run scan button
      if (this.el.btnTriggerScan) {
        this.el.btnTriggerScan.addEventListener('click', () => {
          this.triggerAiScan();
        });
      }

      // Layer toggles
      document.querySelectorAll('.layer-select-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          document.querySelectorAll('.layer-select-btn').forEach(b => b.classList.remove('active'));
          btn.classList.add('active');
          this.playSound('click');
          this.api.setVisionLayer(btn.dataset.layer);
        });
      });

      // Spectral band toggles
      document.querySelectorAll('.band-select-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          document.querySelectorAll('.band-select-btn').forEach(b => b.classList.remove('active'));
          btn.classList.add('active');
          this.playSound('click');
          this.api.setSpectralBand(btn.dataset.band);
        });
      });
    }

    /* ================= Central State Change Handler ================= */
    onStateChange(state, changedKeys) {
      // 1. Stale notice
      if (changedKeys.includes('staleDataWarningDismissed') && this.el.staleNoticeBar) {
        if (state.staleDataWarningDismissed) {
          this.el.staleNoticeBar.classList.add('hidden');
        }
      }

      // 2. Audio button label
      if (changedKeys.includes('audioMuted') && this.el.audioToggleBtn) {
        this.el.audioToggleBtn.textContent = state.audioMuted ? 'AUDIO: MUTED' : 'AUDIO: ON';
      }

      // 3. Tab Route
      if (changedKeys.includes('activeTab')) {
        document.querySelectorAll('.nav-tab-item').forEach(b => {
          b.classList.toggle('active', b.dataset.tab === state.activeTab);
        });
        document.querySelectorAll('.workstation-view').forEach(v => {
          v.classList.toggle('active-view', v.id === `view-${state.activeTab}`);
        });
      }

      // 4. Active Frame Timeline Update
      if (changedKeys.includes('activeFrameIndex')) {
        const frame = this.api.getCurrentTimelineFrame();
        const telemetry = this.api.getTelemetry();

        if (this.el.timelineRangeInput) {
          this.el.timelineRangeInput.value = state.activeFrameIndex;
        }
        if (this.el.activeFrameReadout) {
          this.el.activeFrameReadout.textContent = `${frame.timestamp} • ${frame.label}`;
        }
        if (this.el.statVmaxKnots) {
          this.el.statVmaxKnots.textContent = telemetry.currentSpeedKnots;
        }
        if (this.el.statVmaxKmph) {
          this.el.statVmaxKmph.textContent = telemetry.currentSpeedKmph;
        }
        if (this.el.statMslpHpa) {
          this.el.statMslpHpa.textContent = telemetry.centralPressureHpa;
        }
        if (this.el.statStageName) {
          this.el.statStageName.textContent = telemetry.stage;
        }
        if (this.el.hudDetectionConf) {
          this.el.hudDetectionConf.textContent = `${telemetry.detectionConfidence}%`;
        }
        if (this.el.hudCenterCoords) {
          this.el.hudCenterCoords.textContent = telemetry.centerFormatted;
        }

        this.initPatternList();
        this.renderSatelliteOverlays();
      }

      // 5. Spectral Band & Layer Changes
      if (changedKeys.includes('activeSpectralBand') && this.el.satelliteDisplayImg) {
        this.el.satelliteDisplayImg.src = state.activeSpectralBand === 'ir' 
          ? 'assets/cyclone_ir.jpg' 
          : 'assets/cyclone_vis.jpg';
      }

      if (changedKeys.includes('activeVisionLayer')) {
        this.renderSatelliteOverlays();
      }
    }
  }

  // Instantiate application when DOM is ready
  document.addEventListener('DOMContentLoaded', () => {
    window.vyuhaApp = new VyuhaAppController();
    window.vyuhaApp.init();
  });

})(window, document, window.L);
