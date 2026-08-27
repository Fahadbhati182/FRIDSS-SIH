'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useSimulation } from '@/context/SimulationContext';
import { 
  Radio, 
  ZoomIn, 
  ZoomOut, 
  RotateCcw, 
  CloudRain, 
  Eye, 
  Layers,
  Flame,
  AlertTriangle
} from 'lucide-react';
import { soundFx } from '@/utils/audio';

// Path calculation helper (smooth cubic Bezier spline approximation of the Haul Road)
export const getPointOnHaulRoad = (t: number): { x: number; y: number; angle: number } => {
  // t is 0.0 to 1.0
  // Control points roughly matching Image 1:
  // P0 (Mine Pit): (180, 520)
  // P1 (Ascent): (260, 480)
  // P2 (BT-A approach): (340, 320)
  // P3 (Apex Fog entrance): (430, 190)
  // P4 (Fog Zone Loop Top): (540, 190)
  // P5 (Hilltop Bend Apex): (590, 290)
  // P6 (BT-B): (550, 410)
  // P7 (Waste Dump Approach): (530, 430)

  // Spline segments
  let x = 0;
  let y = 0;
  let nextX = 0;
  let nextY = 0;

  const clamp = (val: number, min: number, max: number) => Math.max(min, Math.min(max, val));
  const normT = clamp(t, 0, 1);

  if (normT < 0.35) {
    // Segment 1: Mine Pit to BT-A
    const localT = normT / 0.35;
    // Cubic bezier: (180, 520) -> (240, 490) -> (310, 390) -> (360, 300)
    const p0 = { x: 185, y: 535 };
    const p1 = { x: 245, y: 505 };
    const p2 = { x: 310, y: 395 };
    const p3 = { x: 360, y: 300 };

    const u = 1 - localT;
    const tt = localT * localT;
    const uu = u * u;
    const uuu = uu * u;
    const ttt = tt * localT;

    x = uuu * p0.x + 3 * uu * localT * p1.x + 3 * u * tt * p2.x + ttt * p3.x;
    y = uuu * p0.y + 3 * uu * localT * p1.y + 3 * u * tt * p2.y + ttt * p3.y;

    const dt = Math.min(1, localT + 0.02);
    const u_next = 1 - dt;
    nextX = u_next * u_next * u_next * p0.x + 3 * u_next * u_next * dt * p1.x + 3 * u_next * dt * dt * p2.x + dt * dt * dt * p3.x;
    nextY = u_next * u_next * u_next * p0.y + 3 * u_next * u_next * dt * p1.y + 3 * u_next * dt * dt * p2.y + dt * dt * dt * p3.y;
  } else if (normT < 0.75) {
    // Segment 2: BT-A through Fog Zone S-Bend
    const localT = (normT - 0.35) / 0.40;
    // Cubic bezier: (360, 300) -> (420, 180) -> (580, 180) -> (590, 320)
    const p0 = { x: 360, y: 300 };
    const p1 = { x: 410, y: 195 };
    const p2 = { x: 570, y: 195 };
    const p3 = { x: 585, y: 320 };

    const u = 1 - localT;
    const tt = localT * localT;
    const uu = u * u;
    const uuu = uu * u;
    const ttt = tt * localT;

    x = uuu * p0.x + 3 * uu * localT * p1.x + 3 * u * tt * p2.x + ttt * p3.x;
    y = uuu * p0.y + 3 * uu * localT * p1.y + 3 * u * tt * p2.y + ttt * p3.y;

    const dt = Math.min(1, localT + 0.02);
    const u_next = 1 - dt;
    nextX = u_next * u_next * u_next * p0.x + 3 * u_next * u_next * dt * p1.x + 3 * u_next * dt * dt * p2.x + dt * dt * dt * p3.x;
    nextY = u_next * u_next * u_next * p0.y + 3 * u_next * u_next * dt * p1.y + 3 * u_next * dt * dt * p2.y + dt * dt * dt * p3.y;
  } else {
    // Segment 3: Fog bend to BT-B and Waste dump terminal
    const localT = (normT - 0.75) / 0.25;
    // Cubic bezier: (585, 320) -> (590, 390) -> (560, 440) -> (515, 440)
    const p0 = { x: 585, y: 320 };
    const p1 = { x: 585, y: 390 };
    const p2 = { x: 560, y: 440 };
    const p3 = { x: 515, y: 440 };

    const u = 1 - localT;
    const tt = localT * localT;
    const uu = u * u;
    const uuu = uu * u;
    const ttt = tt * localT;

    x = uuu * p0.x + 3 * uu * localT * p1.x + 3 * u * tt * p2.x + ttt * p3.x;
    y = uuu * p0.y + 3 * uu * localT * p1.y + 3 * u * tt * p2.y + ttt * p3.y;

    const dt = Math.min(1, localT + 0.02);
    const u_next = 1 - dt;
    nextX = u_next * u_next * u_next * p0.x + 3 * u_next * u_next * dt * p1.x + 3 * u_next * dt * dt * p2.x + dt * dt * dt * p3.x;
    nextY = u_next * u_next * u_next * p0.y + 3 * u_next * u_next * dt * p1.y + 3 * u_next * dt * dt * p2.y + dt * dt * dt * p3.y;
  }

  const angle = Math.atan2(nextY - y, nextX - x) * (180 / Math.PI);
  return { x, y, angle };
};

export const LiveMap: React.FC = () => {
  const { vehicles, selectedVehicleId, setSelectedVehicleId, weather } = useSimulation();
  const [zoom, setZoom] = useState<number>(1);
  const [showBeacons, setShowBeacons] = useState<boolean>(true);
  const [showV2VLinks, setShowV2VLinks] = useState<boolean>(true);
  const [showFogParticles, setShowFogParticles] = useState<boolean>(true);
  const fogCanvasRef = useRef<HTMLCanvasElement | null>(null);

  // Animate floating fog particles over the Fog Zone area
  useEffect(() => {
    if (!showFogParticles) return;
    const canvas = fogCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    canvas.width = 900;
    canvas.height = 650;

    // Generate fog particles concentrated around the Hilltop S-bend (x: 480-620, y: 160-320)
    const particleCount = weather.condition === 'MONSOON_FOG' ? 45 : 20;
    const particles = Array.from({ length: particleCount }).map(() => ({
      x: 440 + Math.random() * 200,
      y: 150 + Math.random() * 200,
      radius: 35 + Math.random() * 55,
      vx: (Math.random() - 0.4) * 0.4,
      vy: (Math.random() - 0.5) * 0.3,
      alpha: 0.08 + Math.random() * 0.14,
    }));

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;

        // Boundary wrap around Fog Zone
        if (p.x < 420) p.x = 640;
        if (p.x > 650) p.x = 430;
        if (p.y < 120) p.y = 350;
        if (p.y > 360) p.y = 130;

        const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.radius);
        grad.addColorStop(0, `rgba(234, 179, 8, ${p.alpha * 1.5})`);
        grad.addColorStop(0.5, `rgba(202, 138, 4, ${p.alpha * 0.8})`);
        grad.addColorStop(1, 'rgba(202, 138, 4, 0)');

        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fill();
      });

      animId = requestAnimationFrame(render);
    };

    render();

    return () => cancelAnimationFrame(animId);
  }, [showFogParticles, weather.condition]);

  // Coordinates of dynamic dumpers
  const vehiclePosMap = vehicles.reduce<Record<string, { x: number; y: number; angle: number }>>((acc, v) => {
    acc[v.id] = getPointOnHaulRoad(v.pathProgress);
    return acc;
  }, {});

  const dumper2 = vehicles.find((v) => v.id === 'D-02');
  const dumper3 = vehicles.find((v) => v.id === 'D-03');
  const posD2 = dumper2 ? vehiclePosMap['D-02'] : null;
  const posD3 = dumper3 ? vehiclePosMap['D-03'] : null;

  return (
    <div className="flex-1 flex flex-col bg-[#050b11] relative overflow-hidden select-none border-r border-[#142330]">
      {/* Top Map HUD Bar with Legend */}
      <div className="h-10 bg-[#070e16]/90 border-b border-[#142636] px-4 flex items-center justify-between z-10">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-hud-cyan animate-ping" />
          <span className="text-xs font-mono font-bold tracking-widest text-slate-300">
            LIVE MAP
          </span>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-5 text-[11px] font-mono">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-[0_0_8px_#10b981]" />
            <span className="text-slate-300 font-medium">Safe</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500 shadow-[0_0_8px_#f59e0b]" />
            <span className="text-slate-300 font-medium">Warning</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500 shadow-[0_0_8px_#ef4444]" />
            <span className="text-slate-300 font-medium">Critical</span>
          </div>
          {showV2VLinks && (
            <div className="flex items-center gap-1.5">
              <span className="w-4 border-b-2 border-dashed border-hud-cyan" />
              <span className="text-hud-cyan font-bold">V2V Link</span>
            </div>
          )}
        </div>

        {/* Map View Controls */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setShowBeacons(!showBeacons)}
            className={`p-1 rounded text-xs border ${
              showBeacons
                ? 'bg-hud-cyan/10 border-hud-cyan/30 text-hud-cyan'
                : 'bg-[#0a1520] border-[#152a3a] text-slate-500'
            }`}
            title="Toggle Beacon Radars"
          >
            <Radio className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setShowFogParticles(!showFogParticles)}
            className={`p-1 rounded text-xs border ${
              showFogParticles
                ? 'bg-amber-500/10 border-amber-500/30 text-amber-400'
                : 'bg-[#0a1520] border-[#152a3a] text-slate-500'
            }`}
            title="Toggle Fog Particle Field"
          >
            <CloudRain className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setZoom((z) => Math.min(1.4, z + 0.1))}
            className="p-1 rounded bg-[#0a1520] border border-[#152a3a] text-slate-300 hover:text-hud-cyan"
            title="Zoom In"
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setZoom((z) => Math.max(0.7, z - 0.1))}
            className="p-1 rounded bg-[#0a1520] border border-[#152a3a] text-slate-300 hover:text-hud-cyan"
            title="Zoom Out"
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setZoom(1)}
            className="p-1 rounded bg-[#0a1520] border border-[#152a3a] text-slate-300 hover:text-hud-cyan"
            title="Reset View"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Main Interactive SVG & Canvas Viewport */}
      <div className="flex-1 relative w-full h-full flex items-center justify-center tactical-grid overflow-hidden">
        {/* Particle Canvas overlay */}
        <canvas
          ref={fogCanvasRef}
          className="absolute inset-0 w-full h-full pointer-events-none z-10"
          style={{ transform: `scale(${zoom})`, transformOrigin: 'center' }}
        />

        {/* SVG Tactical Map Layer */}
        <svg
          viewBox="0 0 800 600"
          className="w-full h-full max-w-[900px] max-h-[620px] transition-transform duration-300 ease-out"
          style={{ transform: `scale(${zoom})`, transformOrigin: 'center center' }}
        >
          <defs>
            {/* Fog Zone Radial Gradient */}
            <radialGradient id="fogGlow" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
              <stop offset="0%" stopColor="#eab308" stopOpacity="0.25" />
              <stop offset="60%" stopColor="#ca8a04" stopOpacity="0.12" />
              <stop offset="100%" stopColor="#050b11" stopOpacity="0" />
            </radialGradient>

            {/* Radar Wave Glow */}
            <radialGradient id="radarWave" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#00f0ff" stopOpacity="0" />
              <stop offset="90%" stopColor="#00f0ff" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#00f0ff" stopOpacity="0.6" />
            </radialGradient>

            {/* Proximity Cone Gradient */}
            <radialGradient id="proxCone" cx="0%" cy="50%" r="100%">
              <stop offset="0%" stopColor="#ef4444" stopOpacity="0.5" />
              <stop offset="100%" stopColor="#ef4444" stopOpacity="0" />
            </radialGradient>

            {/* Road Drop Shadow */}
            <filter id="roadShadow" x="-10%" y="-10%" width="120%" height="120%">
              <feDropShadow dx="0" dy="4" stdDeviation="6" floodColor="#000000" floodOpacity="0.8" />
            </filter>
          </defs>

          {/* Background Grid Accent Lines */}
          <g stroke="rgba(0, 240, 255, 0.05)" strokeWidth="1">
            <line x1="100" y1="0" x2="100" y2="600" />
            <line x1="300" y1="0" x2="300" y2="600" />
            <line x1="500" y1="0" x2="500" y2="600" />
            <line x1="700" y1="0" x2="700" y2="600" />
            <line x1="0" y1="150" x2="800" y2="150" />
            <line x1="0" y1="300" x2="800" y2="300" />
            <line x1="0" y1="450" x2="800" y2="450" />
          </g>

          {/* Compass / Range Rings */}
          <circle cx="210" cy="510" r="140" fill="none" stroke="rgba(0, 240, 255, 0.04)" strokeDasharray="4 6" />
          <circle cx="530" cy="260" r="160" fill="none" stroke="rgba(234, 179, 8, 0.08)" strokeDasharray="6 8" />

          {/* Fog Zone Ambient Circle */}
          <circle cx="530" cy="260" r="140" fill="url(#fogGlow)" />
          <text
            x="530"
            y="170"
            fill="#eab308"
            fontSize="11"
            fontFamily="monospace"
            fontWeight="bold"
            letterSpacing="2"
            textAnchor="middle"
          >
            FOG ZONE
          </text>
          <text
            x="485"
            y="230"
            fill="#a16207"
            fontSize="10"
            fontFamily="monospace"
            fontWeight="600"
          >
            Zone 3
          </text>

          {/* Haul Road Outer Glow / Bed */}
          <path
            d="M 185 535 C 245 505, 310 395, 360 300 C 410 195, 570 195, 585 320 C 585 390, 560 440, 515 440"
            fill="none"
            stroke="#111d27"
            strokeWidth="38"
            strokeLinecap="round"
            filter="url(#roadShadow)"
          />

          {/* Haul Road Main Asphalt */}
          <path
            d="M 185 535 C 245 505, 310 395, 360 300 C 410 195, 570 195, 585 320 C 585 390, 560 440, 515 440"
            fill="none"
            stroke="#203342"
            strokeWidth="28"
            strokeLinecap="round"
          />

          {/* Haul Road Center Dashed Marking */}
          <path
            d="M 185 535 C 245 505, 310 395, 360 300 C 410 195, 570 195, 585 320 C 585 390, 560 440, 515 440"
            fill="none"
            stroke="#3a5870"
            strokeWidth="2"
            strokeDasharray="8 12"
            strokeLinecap="round"
          />

          {/* Dynamic V2V Telemetry Communication Stream between D-02 and D-03 */}
          {showV2VLinks && posD2 && posD3 && (
            <g>
              <line
                x1={posD3.x}
                y1={posD3.y}
                x2={posD2.x}
                y2={posD2.y}
                stroke="#00f0ff"
                strokeWidth="2"
                strokeDasharray="4 4"
                className="animate-pulse"
              />
              {/* Proximity Distance Tag */}
              <rect
                x={(posD3.x + posD2.x) / 2 - 18}
                y={(posD3.y + posD2.y) / 2 - 9}
                width="36"
                height="16"
                fill="#ef4444"
                rx="2"
                opacity="0.9"
              />
              <text
                x={(posD3.x + posD2.x) / 2}
                y={(posD3.y + posD2.y) / 2 + 3}
                fill="#ffffff"
                fontSize="9"
                fontFamily="monospace"
                fontWeight="bold"
                textAnchor="middle"
              >
                9.6m
              </text>
            </g>
          )}

          {/* Mine Pit Terminal Area (Bottom Left) */}
          <g>
            <circle cx="180" cy="540" r="32" fill="#08141e" stroke="#163248" strokeWidth="1.5" />
            <text x="180" y="544" fill="#00f0ff" fontSize="10" fontFamily="monospace" fontWeight="bold" textAnchor="middle">
              MINE PIT
            </text>
          </g>

          {/* Waste Dump Terminal Area (Right) */}
          <g>
            <rect x="680" y="190" width="70" height="46" rx="4" fill="#0b1722" stroke="#1c374d" strokeWidth="1.5" />
            <text x="715" y="210" fill="#64748b" fontSize="9" fontFamily="monospace" fontWeight="bold" textAnchor="middle">
              WASTE
            </text>
            <text x="715" y="222" fill="#64748b" fontSize="9" fontFamily="monospace" fontWeight="bold" textAnchor="middle">
              DUMP
            </text>
          </g>

          {/* Beacon Tower BT-A */}
          <g transform="translate(370, 270)">
            {showBeacons && (
              <>
                <circle cx="0" cy="0" r="28" fill="none" stroke="rgba(234, 179, 8, 0.2)" strokeDasharray="3 3" />
                <circle cx="0" cy="0" r="48" fill="none" stroke="rgba(234, 179, 8, 0.1)" strokeDasharray="4 4" />
              </>
            )}
            <polygon points="0,-10 10,7 -10,7" fill="#eab308" stroke="#ca8a04" strokeWidth="1" />
            <text x="0" y="4" fill="#000000" fontSize="8" fontWeight="bold" textAnchor="middle">!</text>
            <text x="0" y="18" fill="#eab308" fontSize="8" fontFamily="monospace" fontWeight="bold" textAnchor="middle">
              BT-A
            </text>
          </g>

          {/* Beacon Tower BT-B */}
          <g transform="translate(545, 415)">
            {showBeacons && (
              <>
                <circle cx="0" cy="0" r="28" fill="none" stroke="rgba(234, 179, 8, 0.2)" strokeDasharray="3 3" />
                <circle cx="0" cy="0" r="48" fill="none" stroke="rgba(234, 179, 8, 0.1)" strokeDasharray="4 4" />
              </>
            )}
            <polygon points="0,-10 10,7 -10,7" fill="#eab308" stroke="#ca8a04" strokeWidth="1" />
            <text x="0" y="4" fill="#000000" fontSize="8" fontWeight="bold" textAnchor="middle">!</text>
            <text x="0" y="18" fill="#eab308" fontSize="8" fontFamily="monospace" fontWeight="bold" textAnchor="middle">
              BT-B
            </text>
          </g>

          {/* Vehicles (Dumpers D-01, D-02, D-03) */}
          {vehicles.map((v) => {
            const pos = vehiclePosMap[v.id];
            if (!pos) return null;
            const isSelected = selectedVehicleId === v.id;

            // Color scheme based on status
            let primaryColor = '#10b981'; // Green Safe
            let ringColor = 'rgba(16, 185, 129, 0.4)';
            let labelBg = '#065f46';

            if (v.status === 'warning') {
              primaryColor = '#f59e0b'; // Yellow Warning
              ringColor = 'rgba(245, 158, 11, 0.4)';
              labelBg = '#92400e';
            } else if (v.status === 'critical') {
              primaryColor = '#ef4444'; // Red Critical
              ringColor = 'rgba(239, 68, 68, 0.4)';
              labelBg = '#991b1b';
            }

            return (
              <g
                key={v.id}
                transform={`translate(${pos.x}, ${pos.y})`}
                className="cursor-pointer transition-transform duration-100"
                onClick={() => {
                  setSelectedVehicleId(v.id);
                  soundFx.playClick();
                }}
              >
                {/* Proximity / Radar Alert Ring */}
                <circle
                  cx="0"
                  cy="0"
                  r={v.status === 'critical' ? 24 : 18}
                  fill="none"
                  stroke={primaryColor}
                  strokeWidth="1.5"
                  strokeOpacity="0.8"
                  className={v.status === 'critical' ? 'animate-ping' : ''}
                />
                <circle cx="0" cy="0" r="14" fill={ringColor} />

                {/* Dumper Box Body */}
                <rect
                  x="-9"
                  y="-9"
                  width="18"
                  height="18"
                  rx="3"
                  fill="#0b1722"
                  stroke={primaryColor}
                  strokeWidth={isSelected ? '2.5' : '1.8'}
                  className={isSelected ? 'filter drop-shadow-[0_0_8px_#00f0ff]' : ''}
                />

                {/* Truck icon glyph inside */}
                <rect x="-5" y="-5" width="10" height="7" rx="1" fill={primaryColor} opacity="0.9" />
                <circle cx="-3" cy="4" r="1.5" fill="#ffffff" />
                <circle cx="3" cy="4" r="1.5" fill="#ffffff" />

                {/* Callsign Label Tag Pill */}
                <g transform="translate(0, 19)">
                  <rect
                    x="-18"
                    y="-6"
                    width="36"
                    height="13"
                    rx="2"
                    fill={labelBg}
                    stroke={primaryColor}
                    strokeWidth="0.8"
                  />
                  <text
                    x="0"
                    y="4"
                    fill="#ffffff"
                    fontSize="8"
                    fontFamily="monospace"
                    fontWeight="bold"
                    textAnchor="middle"
                  >
                    {v.callsign}
                  </text>
                </g>
              </g>
            );
          })}
        </svg>

        {/* Bottom Coordinates & Scale HUD */}
        <div className="absolute bottom-3 left-4 text-[10px] font-mono text-slate-400 tracking-wider flex items-center gap-3 bg-[#070d13]/80 px-3 py-1 rounded border border-[#142330]">
          <span className="text-hud-cyan font-semibold">26°44&apos;S 121°37&apos;E</span>
          <span className="text-slate-500">|</span>
          <span>ELEVATION: 640m</span>
        </div>

        <div className="absolute bottom-3 right-4 text-[10px] font-mono text-slate-400 tracking-widest bg-[#070d13]/80 px-3 py-1 rounded border border-[#142330]">
          SCALE 1:2500
        </div>
      </div>
    </div>
  );
};
