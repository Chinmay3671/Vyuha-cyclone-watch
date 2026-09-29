/**
 * VYUHA METEOROLOGICAL INTELLIGENCE API LAYER
 * Smart India Hackathon 2026 - PS 26070
 * 
 * Provides unified, typed data access, state management, and event subscriptions
 * across all dashboard modules, maps, and satellite views.
 */

(function(window) {
  'use strict';

  class VyuhaDataService {
    constructor() {
      this._data = window.VYUHA_DATA;
      this._state = {
        activeTab: 'dashboard',
        activeFrameIndex: 3, // T0 LIVE
        activeSpectralBand: 'ir', // 'ir' | 'vis'
        activeVisionLayer: 'heatmap', // 'raw' | 'heatmap' | 'seg' | 'edge'
        selectedForecastStep: 'T0',
        activeFilterPattern: 'ALL',
        staleDataWarningDismissed: false,
        audioMuted: false,
        activeSearchQuery: '',
        activeStationFilter: 'ALL'
      };
      this._listeners = new Set();
    }

    /**
     * Subscribe to state changes
     * @param {Function} callback 
     * @returns {Function} unsubscribe function
     */
    subscribe(callback) {
      this._listeners.add(callback);
      return () => this._listeners.delete(callback);
    }

    /**
     * Notify all subscribers of state modification
     */
    _notify(changedKeys = []) {
      const snapshot = this.getState();
      this._listeners.forEach(fn => {
        try {
          fn(snapshot, changedKeys);
        } catch (err) {
          console.error('[VyuhaDataService] Listener error:', err);
        }
      });
    }

    /**
     * Get current immutable state snapshot
     */
    getState() {
      return Object.assign({}, this._state);
    }

    /**
     * Update state properties
     */
    setState(updates) {
      const keys = Object.keys(updates);
      let changed = false;
      keys.forEach(k => {
        if (this._state[k] !== updates[k]) {
          this._state[k] = updates[k];
          changed = true;
        }
      });
      if (changed) {
        this._notify(keys);
      }
    }

    /* ================= GETTERS FOR DATA ENTITIES ================= */

    getMetadata() {
      return this._data.meta;
    }

    getPipelineNodes() {
      return this._data.pipelineNodes;
    }

    getModels() {
      return this._data.models;
    }

    getModelById(id) {
      return this._data.models.find(m => m.id === id) || null;
    }

    getFeeds() {
      return this._data.multiSourceFeeds;
    }

    getCoastalStations() {
      return this._data.coastalStations;
    }

    getTelemetry() {
      // Dynamic telemetry adjusted for current timeline frame
      const frame = this.getCurrentTimelineFrame();
      const base = this._data.currentTelemetry;
      return Object.assign({}, base, {
        currentSpeedKnots: frame.knots,
        currentSpeedKmph: Math.round(frame.knots * 1.852),
        centralPressureHpa: frame.pressure,
        stage: frame.stage,
        centerLat: frame.lat,
        centerLng: frame.lng,
        centerFormatted: `${frame.lat.toFixed(2)}°N, ${frame.lng.toFixed(2)}°E`,
        detectionConfidence: frame.detectionConf,
        timestampUTC: frame.timestamp
      });
    }

    getPatternProbabilities() {
      const frame = this.getCurrentTimelineFrame();
      return [
        { name: 'Central Dense Overcast (CDO)', code: 'CDO', prob: frame.cdoProb, isDetected: frame.cdoProb >= 80, desc: 'Compact symmetric core overcast' },
        { name: 'Curved Band Pattern', code: 'CB', prob: frame.curvedProb, isDetected: frame.curvedProb >= 80, desc: 'Convective feeder bands > 0.8 turns' },
        { name: 'Eye Pattern (Pin-hole)', code: 'EYE', prob: frame.eyeProb, isDetected: frame.eyeProb >= 80, desc: 'Warm core thermal signature contrast' },
        { name: 'Shear Pattern', code: 'SHR', prob: Math.max(2, Math.round(100 - frame.detectionConf)), isDetected: false, desc: 'Displaced deep convection' }
      ];
    }

    getExplainabilityFeatures() {
      return this._data.explainabilityFeatures;
    }

    getForecastTrack() {
      return this._data.forecastTrack;
    }

    getForecastPoint(stepId) {
      return this._data.forecastTrack.find(p => p.step === stepId || p.timeOffset === stepId) || this._data.forecastTrack[0];
    }

    getTimelineFrames() {
      return this._data.timelineFrames;
    }

    getCurrentTimelineFrame() {
      const idx = this._state.activeFrameIndex;
      return this._data.timelineFrames[idx] || this._data.timelineFrames[0];
    }

    getInferenceLogs() {
      return this._data.inferenceLogStream;
    }

    getDisasterRisk() {
      return this._data.currentTelemetry.riskEngine;
    }

    /* ================= ACTIONS ================= */

    setActiveFrame(index) {
      const bounded = Math.max(0, Math.min(this._data.timelineFrames.length - 1, index));
      this.setState({ activeFrameIndex: bounded });
    }

    nextFrame() {
      const next = (this._state.activeFrameIndex + 1) % this._data.timelineFrames.length;
      this.setActiveFrame(next);
    }

    prevFrame() {
      const prev = this._state.activeFrameIndex > 0 ? this._state.activeFrameIndex - 1 : this._data.timelineFrames.length - 1;
      this.setActiveFrame(prev);
    }

    setVisionLayer(layer) {
      if (['raw', 'heatmap', 'seg', 'edge'].includes(layer)) {
        this.setState({ activeVisionLayer: layer });
      }
    }

    setSpectralBand(band) {
      if (['ir', 'vis'].includes(band)) {
        this.setState({ activeSpectralBand: band });
      }
    }

    setSelectedForecast(step) {
      this.setState({ selectedForecastStep: step });
    }

    dismissStaleWarning() {
      this.setState({ staleDataWarningDismissed: true });
    }

    toggleAudio() {
      this.setState({ audioMuted: !this._state.audioMuted });
    }

    setRoute(tabName) {
      this.setState({ activeTab: tabName });
    }
  }

  // Export singleton to global scope
  window.VyuhaAPI = new VyuhaDataService();

})(window);
