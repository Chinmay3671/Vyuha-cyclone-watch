import React, { useState, useEffect, useRef } from 'react';
import { Header } from './components/Header';
import { PipelineStrip } from './components/PipelineStrip';
import { TimelineScrubber } from './components/TimelineScrubber';
import { ModelStackPanel } from './components/ModelStackPanel';
import { SatelliteStudio } from './components/SatelliteStudio';
import { TrackMap } from './components/TrackMap';
import { RightColumn } from './components/RightColumn';
import { TerminalLogs } from './components/TerminalLogs';

// Tab Views
import { SatelliteStudioTab } from './components/tabs/SatelliteStudioTab';
import { ConvLSTMInspectorTab } from './components/tabs/ConvLSTMInspectorTab';
import { SensorFusionTab } from './components/tabs/SensorFusionTab';
import { DisasterRiskTab } from './components/tabs/DisasterRiskTab';
import { RawJsonTab } from './components/tabs/RawJsonTab';

import { localDataService, AppState } from './services/dataService';
import { ModelMetadata } from './mocks/mockData';

export const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>(localDataService.getState());
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [activePipelineStep, setActivePipelineStep] = useState<number>(2);
  const [logs, setLogs] = useState<Array<{ time: string; msg: string }>>([
    { time: "18:00:00 UTC", msg: "VYUHA AI SYSTEM INITIALIZED • Multi-Source Feeds Synced • Model Ensemble Ready" },
    { time: "18:00:02 UTC", msg: "YOLOv8-Cyclone: Detected Eye & Vortex Core at (15.80°N, 87.20°E) • Confidence 94.2%" },
    { time: "18:00:05 UTC", msg: "DeepIntense-v3: Current Intensity 92 kt (170 km/h) • MSLP 948 hPa • Trend: Intensifying" },
    { time: "18:00:08 UTC", msg: "ConvLSTM-v1.8: Spatio-temporal trajectory inference completed (0h-72h forecast track published)" }
  ]);

  const audioCtxRef = useRef<AudioContext | null>(null);

  const playSound = (type = 'click') => {
    if (appState.audioMuted) return;
    try {
      if (!audioCtxRef.current) {
        audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
      if (audioCtxRef.current.state === 'suspended') {
        audioCtxRef.current.resume();
      }
      const osc = audioCtxRef.current.createOscillator();
      const gain = audioCtxRef.current.createGain();
      osc.connect(gain);
      gain.connect(audioCtxRef.current.destination);

      const now = audioCtxRef.current.currentTime;
      if (type === 'scan') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(440, now);
        osc.frequency.exponentialRampToValueAtTime(880, now + 0.3);
        gain.gain.setValueAtTime(0.1, now);
        gain.gain.linearRampToValueAtTime(0.001, now + 0.3);
        osc.start(now);
        osc.stop(now + 0.3);
      } else if (type === 'step') {
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(587, now);
        gain.gain.setValueAtTime(0.05, now);
        gain.gain.linearRampToValueAtTime(0.001, now + 0.08);
        osc.start(now);
        osc.stop(now + 0.08);
      } else {
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(520, now);
        gain.gain.setValueAtTime(0.04, now);
        gain.gain.linearRampToValueAtTime(0.001, now + 0.05);
        osc.start(now);
        osc.stop(now + 0.05);
      }
    } catch {
      // Audio context disabled
    }
  };

  const addLog = (msg: string) => {
    const now = new Date();
    const timeStr = `${now.toISOString().substring(11, 19)} UTC`;
    setLogs(prev => [{ time: timeStr, msg }, ...prev.slice(0, 20)]);
  };

  useEffect(() => {
    const unsub = localDataService.subscribe(newState => {
      setAppState(newState);
    });
    return () => unsub();
  }, []);

  // Auto-replay simulation loop
  useEffect(() => {
    let interval: any = null;
    if (isPlaying) {
      interval = setInterval(() => {
        localDataService.nextFrame();
        playSound('step');
      }, 2500);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isPlaying]);

  const handleSelectTab = (tab: string) => {
    playSound('click');
    localDataService.setTab(tab);
    addLog(`OPERATOR: Switched navigation tab to [${tab.toUpperCase()}]`);
  };

  const handleToggleAudio = () => {
    localDataService.toggleAudio();
  };

  const handleSelectPipelineStep = (stepId: number) => {
    playSound('click');
    setActivePipelineStep(stepId);
    const node = localDataService.getPipelineNodes().find(n => n.id === stepId);
    if (node) {
      addLog(`OPERATOR: Inspected Pipeline Node 0${node.id} - ${node.title} (${node.model})`);
    }
  };

  const handleFrameChange = (index: number) => {
    playSound('step');
    localDataService.setFrame(index);
    const frame = localDataService.getTimelineFrames()[index];
    if (frame) {
      addLog(`TIMELINE SCRUBBER: Loaded frame [${frame.timestamp}] • ${frame.label}`);
    }
  };

  const handleTogglePlay = () => {
    playSound('click');
    setIsPlaying(prev => {
      const next = !prev;
      addLog(`TIMELINE REPLAY: ${next ? 'Auto-playback started (2.5s interval)' : 'Auto-playback paused'}`);
      return next;
    });
  };

  const handleTriggerScan = () => {
    playSound('scan');
    setIsScanning(true);
    addLog("OPERATOR INVOCATION: Triggered deep neural YOLOv8 + Grad-CAM scan pass...");
    setTimeout(() => {
      setIsScanning(false);
      addLog("SCAN COMPLETE: YOLOv8 eye bounding box updated • Confidence 94.2% • Grad-CAM attention focused on eyewall.");
    }, 1800);
  };

  const handleSelectModel = (model: ModelMetadata) => {
    playSound('click');
    addLog(`MODEL INSPECTOR: Selected [${model.name}] (${model.version}) • Task: ${model.task} • Latency: ${model.latency}`);
  };

  const currentFrame = localDataService.getCurrentFrame();
  const pipelineNodes = localDataService.getPipelineNodes();
  const models = localDataService.getModels();
  const feeds = localDataService.getFeeds();
  const forecastTrack = localDataService.getForecastTrack();
  const timelineFrames = localDataService.getTimelineFrames();
  const patterns = localDataService.getPatterns();
  const features = localDataService.getExplainability();

  return (
    <div className="app-container">
      {/* Top Disclaimer & Main Operational Header */}
      <Header
        activeTab={appState.activeTab}
        onSelectTab={handleSelectTab}
        audioMuted={appState.audioMuted}
        onToggleAudio={handleToggleAudio}
      />

      {/* 6-Step Interactive AI Pipeline Strip */}
      <PipelineStrip
        nodes={pipelineNodes}
        activeStep={activePipelineStep}
        onSelectStep={handleSelectPipelineStep}
      />

      {/* Main Tab Routing Area */}
      {appState.activeTab === 'dashboard' && (
        <>
          {/* Historical & Forecast Timeline Scrubber */}
          <TimelineScrubber
            frames={timelineFrames}
            currentFrameIndex={appState.currentFrameIndex}
            onFrameChange={handleFrameChange}
            isPlaying={isPlaying}
            onTogglePlay={handleTogglePlay}
          />

          {/* 3-Column AI Mission Control Grid */}
          <div className="main-dashboard-grid">
            {/* Left Column: AI Model Stack, Multi-Source Feeds & Performance */}
            <ModelStackPanel
              models={models}
              feeds={feeds}
              onSelectModel={handleSelectModel}
            />

            {/* Center Column: Satellite AI Vision Studio & ConvLSTM Track Map */}
            <main className="center-col">
              <SatelliteStudio
                currentFrame={currentFrame}
                activeLayer={appState.activeVisionLayer}
                onSelectLayer={(l) => {
                  playSound('click');
                  localDataService.setLayer(l);
                  addLog(`VISION LAYER: Switched mode to [${l.toUpperCase()}]`);
                }}
                activeBand={appState.activeBand}
                onSelectBand={(b) => {
                  playSound('click');
                  localDataService.setBand(b);
                  addLog(`SPECTRAL BAND: Switched to [${b.toUpperCase()}]`);
                }}
                isScanning={isScanning}
                onTriggerScan={handleTriggerScan}
              />

              <TrackMap
                track={forecastTrack}
                selectedStep={appState.selectedForecastStep}
                onSelectWaypoint={(step) => {
                  playSound('click');
                  localDataService.setForecastStep(step);
                  addLog(`MAP WAYPOINT: Selected trajectory point [${step}]`);
                }}
              />
            </main>

            {/* Right Column: AI Analysis Confidence, Pattern Recognition, Intensity AI, Explainability (XAI) */}
            <RightColumn
              currentFrame={currentFrame}
              patterns={patterns}
              features={features}
            />
          </div>

          {/* Live AI Inference Terminal Log Stream */}
          <TerminalLogs logs={logs} />
        </>
      )}

      {appState.activeTab === 'vision-studio' && <SatelliteStudioTab />}
      {appState.activeTab === 'convlstm' && <ConvLSTMInspectorTab />}
      {appState.activeTab === 'fusion' && <SensorFusionTab feeds={feeds} />}
      {appState.activeTab === 'risk' && <DisasterRiskTab />}
      {appState.activeTab === 'raw-json' && <RawJsonTab />}
    </div>
  );
};
