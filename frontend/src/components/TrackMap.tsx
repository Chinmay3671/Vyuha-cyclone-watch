import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import { ForecastTrackPoint } from '../mocks/mockData';

interface TrackMapProps {
  track: ForecastTrackPoint[];
  selectedStep: string;
  onSelectWaypoint: (step: string) => void;
}

export const TrackMap: React.FC<TrackMapProps> = ({
  track,
  selectedStep,
  onSelectWaypoint
}) => {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const layerGroupRef = useRef<L.LayerGroup | null>(null);

  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return;

    // Initialize Leaflet Map using free keyless OpenStreetMap tiles
    const map = L.map(mapContainerRef.current, {
      center: [17.5, 86.5],
      zoom: 6,
      zoomControl: false,
      attributionControl: true
    });

    // Keyless standard OpenStreetMap tile layer (no CARTO / no watermark API errors)
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 18,
      attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map);

    L.control.zoom({ position: 'topright' }).addTo(map);

    mapInstanceRef.current = map;
    layerGroupRef.current = L.layerGroup().addTo(map);

    // Invalidate size after mount to guarantee full fill
    setTimeout(() => {
      map.invalidateSize();
    }, 200);
  }, []);

  useEffect(() => {
    const map = mapInstanceRef.current;
    const group = layerGroupRef.current;
    if (!map || !group) return;

    group.clearLayers();

    // 1. Uncertainty Cone Polygon (Shaded purple with dashed border)
    const coneCoords: [number, number][] = [];
    track.forEach(pt => {
      const offsetLat = pt.lat + (pt.errorRadiusKm / 111) * 0.7;
      const offsetLng = pt.lng - (pt.errorRadiusKm / 111) * 0.7;
      coneCoords.push([offsetLat, offsetLng]);
    });
    for (let i = track.length - 1; i >= 0; i--) {
      const pt = track[i];
      const offsetLat = pt.lat - (pt.errorRadiusKm / 111) * 0.7;
      const offsetLng = pt.lng + (pt.errorRadiusKm / 111) * 0.7;
      coneCoords.push([offsetLat, offsetLng]);
    }

    const uncertaintyCone = L.polygon(coneCoords, {
      color: '#8B5CF6',
      weight: 1.5,
      dashArray: '4, 4',
      fillColor: '#8B5CF6',
      fillOpacity: 0.18
    });
    group.addLayer(uncertaintyCone);

    // 2. Best Track Reference (White dashed line)
    const bestTrackPoints: [number, number][] = track.map(pt => [pt.bestTrackLat, pt.bestTrackLng]);
    const bestPoly = L.polyline(bestTrackPoints, {
      color: '#FFFFFF',
      weight: 2,
      dashArray: '5, 5',
      opacity: 0.8
    });
    group.addLayer(bestPoly);

    // 3. AI ConvLSTM Predicted Track (Cyan Glowing line)
    const aiTrackPoints: [number, number][] = track.map(pt => [pt.lat, pt.lng]);
    const aiPoly = L.polyline(aiTrackPoints, {
      color: '#22D3EE',
      weight: 3.5,
      opacity: 0.95
    });
    group.addLayer(aiPoly);

    // 4. Track Point Markers (labels on hover tooltip, clean tooltips)
    track.forEach((pt, idx) => {
      const isCurrent = idx === 0;
      const isSelected = pt.step === selectedStep;
      
      const markerHtml = isCurrent
        ? `<div style="position:relative; width:18px; height:18px;">
            <div style="position:absolute; width:18px; height:18px; border-radius:50%; background:rgba(34,211,238,0.4); animation:pulseDot 1.5s infinite;"></div>
            <div style="position:absolute; top:3px; left:3px; width:12px; height:12px; border-radius:50%; background:#22D3EE; border:2px solid #050B14;"></div>
           </div>`
        : `<div style="width:10px; height:10px; border-radius:50%; background:${isSelected ? '#22D3EE' : '#8B5CF6'}; border:2px solid ${isSelected ? '#FFFFFF' : '#22D3EE'}; box-shadow:0 0 6px #22D3EE;"></div>`;

      const customIcon = L.divIcon({
        html: markerHtml,
        className: 'ai-map-marker',
        iconSize: [18, 18],
        iconAnchor: [9, 9]
      });

      const marker = L.marker([pt.lat, pt.lng], { icon: customIcon });

      // Clean tooltip shown only on hover
      marker.bindTooltip(
        `<b>${pt.step}</b> • ${pt.aiKnots} kt (${pt.pressureHpa} hPa)`,
        { direction: 'top', offset: [0, -8], className: 'custom-map-tooltip' }
      );

      // Popup on click
      marker.bindPopup(`
        <div style="font-family:'JetBrains Mono', monospace; font-size:11px; color:#050B14; padding:2px;">
          <b style="color:#0284C7; font-size:12px;">${pt.step} (${pt.validTimeUTC})</b><br/>
          <b>AI Wind:</b> ${pt.aiKnots} kt (${pt.aiKmph} km/h)<br/>
          <b>MSLP:</b> ${pt.pressureHpa} hPa<br/>
          <b>Confidence:</b> ${pt.confidencePct}%<br/>
          <b>Dispersion Radius:</b> ±${pt.errorRadiusKm} km<br/>
          <b>Best Track:</b> ${pt.bestTrackKnots} kt (Δ ${pt.aiKnots - pt.bestTrackKnots} kt)
        </div>
      `);

      marker.on('click', () => onSelectWaypoint(pt.step));
      group.addLayer(marker);
    });

  }, [track, selectedStep]);

  return (
    <div className="ai-panel" style={{ marginTop: '12px', padding: '10px' }}>
      <div className="panel-header" style={{ marginBottom: '6px' }}>
        <div className="panel-title">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="3 11 22 2 13 21 11 13 3 11"></polygon></svg>
          TEMPORAL AI FORECAST & UNCERTAINTY CONE (ConvLSTM)
        </div>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--text-dim)' }}>
          HORIZON: <b>6H ➔ 72H</b> • MONTE CARLO PASSES: <b>100</b>
        </div>
      </div>

      <div className="track-map-container">
        <div ref={mapContainerRef} id="leafletTrackMap" />
        <div className="map-legend">
          <div className="legend-item">
            <div className="legend-line ai-track" />
            <span>AI ConvLSTM Predicted Track</span>
          </div>
          <div className="legend-item">
            <div className="legend-line best-track" />
            <span>IMD / IBTrACS Best Track (Ref)</span>
          </div>
          <div className="legend-item">
            <div style={{ width: '12px', height: '6px', background: 'rgba(139,92,246,0.3)', border: '1px dashed #8B5CF6' }} />
            <span>AI Uncertainty Cone (±42km 24h)</span>
          </div>
        </div>
      </div>
    </div>
  );
};
