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
  const [pan, setPan] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const dragStartRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  const [showBeacons, setShowBeacons] = useState<boolean>(true);
  const [showV2VLinks, setShowV2VLinks] = useState<boolean>(true);
  const [showFogParticles, setShowFogParticles] = useState<boolean>(true);
  const fogCanvasRef = useRef<HTMLCanvasElement | null>(null);

  // Drag & Pan handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button !== 0) return;
    setIsDragging(true);
    dragStartRef.current = { x: e.clientX - pan.x, y: e.clientY - pan.y };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setPan({
      x: Math.round(e.clientX - dragStartRef.current.x),
      y: Math.round(e.clientY - dragStartRef.current.y),
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleWheel = (e: React.WheelEvent) => {
    e.stopPropagation();
    const delta = e.deltaY > 0 ? -0.1 : 0.1;
    setZoom((z) => Math.min(2.5, Math.max(0.6, Number((z + delta).toFixed(2)))));
  };

  const handleReset = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
    soundFx.playClick();
  };

  // Center view on active selected dumper
  const centerOnVehicle = (vehId: string) => {
    const pos = vehiclePosMap[vehId];
    if (!pos) return;
    // Map center is roughly (400, 300)
    setPan({
      x: Math.round((400 - pos.x) * 0.8),
      y: Math.round((300 - pos.y) * 0.8),
    });
    setZoom(1.2);
    soundFx.playClick();
  };

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

  const dumper3 = vehicles.find((v) => v.id === 'D-03');

  return (
    <div className="flex-1 flex flex-col bg-[#050b11] relative overflow-hidden select-none border-r border-[#142330]">
      {/* Top Map HUD Bar with Legend */}
      <div className="h-10 bg-[#070e16]/90 border-b border-[#142636] px-4 flex items-center justify-between z-20">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-hud-cyan animate-ping" />
          <span className="text-xs font-mono font-bold tracking-widest text-slate-300">
            BAILADILA HAUL ROUTE • DEP-14
          </span>
        </div>

        {/* Legend */}
        <div className="hidden sm:flex items-center gap-4 text-[11px] font-mono">
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

        {/* Map View Controls & Quick Focus */}
        <div className="flex items-center gap-1.5 font-mono">
          <button
            onClick={() => centerOnVehicle(selectedVehicleId)}
            className="px-2 py-0.5 rounded text-[10px] font-bold bg-cyan-950/80 border border-cyan-500/40 text-cyan-300 hover:bg-cyan-900 transition-colors"
            title="Focus Camera on Active Truck"
          >
            FOCUS {selectedVehicleId}
          </button>

          <button
            onClick={() => setShowBeacons(!showBeacons)}
            className={`p-1 rounded text-xs border ${showBeacons
              ? 'bg-hud-cyan/10 border-hud-cyan/30 text-hud-cyan'
              : 'bg-[#0a1520] border-[#152a3a] text-slate-500'
              }`}
            title="Toggle Beacon Radars"
          >
            <Radio className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setShowFogParticles(!showFogParticles)}
            className={`p-1 rounded text-xs border ${showFogParticles
              ? 'bg-amber-500/10 border-amber-500/30 text-amber-400'
              : 'bg-[#0a1520] border-[#152a3a] text-slate-500'
              }`}
            title="Toggle Fog Particle Field"
          >
            <CloudRain className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setZoom((z) => Math.min(2.5, Number((z + 0.15).toFixed(2))))}
            className="p-1 rounded bg-[#0a1520] border border-[#152a3a] text-slate-300 hover:text-hud-cyan"
            title="Zoom In (+)"
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setZoom((z) => Math.max(0.6, Number((z - 0.15).toFixed(2))))}
            className="p-1 rounded bg-[#0a1520] border border-[#152a3a] text-slate-300 hover:text-hud-cyan"
            title="Zoom Out (-)"
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={handleReset}
            className="p-1 rounded bg-[#0a1520] border border-[#152a3a] text-slate-300 hover:text-hud-cyan"
            title="Reset Map View & Position"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Main Draggable Map Viewport */}
      <div
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onWheel={handleWheel}
        className={`flex-1 relative w-full h-full flex items-center justify-center tactical-grid overflow-hidden select-none ${isDragging ? 'cursor-grabbing' : 'cursor-grab'
          }`}
      >
        {/* Transform Wrapper for Panning and Zooming */}
        <div
          className="relative w-full h-full max-w-[950px] max-h-[660px] flex items-center justify-center pointer-events-none"
          style={{
            transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
            transformOrigin: 'center center',
            transition: isDragging ? 'none' : 'transform 0.2s ease-out',
          }}
        >
          {/* Particle Canvas overlay */}
          <canvas
            ref={fogCanvasRef}
            className="absolute inset-0 w-full h-full pointer-events-none z-10"
          />

          {/* SVG Tactical Map Layer */}
          <svg
            viewBox="0 0 800 600"
            className="w-full h-full pointer-events-auto"
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
              fontSize="10"
              fontFamily="monospace"
              fontWeight="bold"
              letterSpacing="2"
              textAnchor="middle"
            >
              MONSOON CLOUD APEX
            </text>
            <text
              x="530"
              y="185"
              fill="#ca8a04"
              fontSize="9"
              fontFamily="monospace"
              fontWeight="600"
              textAnchor="middle"
            >
              ZONE 3 • 1,210m RIDGE
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

            {/* Road Segment Annotations (Slope & Elevation Grade) */}
            <g transform="translate(250, 445) rotate(-35)">
              <rect x="-4" y="-8" width="120" height="15" rx="3" fill="#09141f" stroke="#163147" strokeWidth="1" />
              <text x="56" y="3" fill="#38bdf8" fontSize="7.5" fontFamily="monospace" fontWeight="bold" textAnchor="middle">
                ▲ ASCENT SPINE (6.8% GRADE)
              </text>
            </g>

            {/* Dynamic V2V Telemetry Communication Stream (Hugs the exact Haul Road curve) */}
            {showV2VLinks && (() => {
              const sorted = [...vehicles].sort((a, b) => a.pathProgress - b.pathProgress);
              const links = [];

              // Helper to generate an SVG path string following the road curve between two progress values
              const getRoadSegmentPath = (t1: number, t2: number): string => {
                const startT = Math.min(t1, t2);
                const endT = Math.max(t1, t2);
                const steps = 24;
                let pathStr = '';
                for (let i = 0; i <= steps; i++) {
                  const t = startT + (endT - startT) * (i / steps);
                  const pt = getPointOnHaulRoad(t);
                  pathStr += (i === 0 ? `M ${pt.x.toFixed(1)} ${pt.y.toFixed(1)}` : ` L ${pt.x.toFixed(1)} ${pt.y.toFixed(1)}`);
                }
                return pathStr;
              };

              for (let i = 0; i < sorted.length - 1; i++) {
                const vA = sorted[i];
                const vB = sorted[i + 1];
                const posA = vehiclePosMap[vA.id];
                const posB = vehiclePosMap[vB.id];
                if (!posA || !posB) continue;

                // Calculate distance between these two consecutive vehicles
                let dist = Math.abs(vB.pathProgress - vA.pathProgress) * 300;
                if (vB.id === 'D-03' || vA.id === 'D-03') {
                  dist = dumper3?.distanceToObstacle ?? dist;
                }
                const formattedDist = Math.max(4.0, dist).toFixed(1);
                const tagBg = dist < 10.0 ? '#ef4444' : dist < 25.0 ? '#f59e0b' : '#0284c7';

                // Curve path along the road spline & midpoint on the road
                const roadPath = getRoadSegmentPath(vA.pathProgress, vB.pathProgress);
                const midPoint = getPointOnHaulRoad((vA.pathProgress + vB.pathProgress) / 2);

                links.push(
                  <g key={`v2v-${vA.id}-${vB.id}`}>
                    {/* Glowing under-track along the road */}
                    <path
                      d={roadPath}
                      fill="none"
                      stroke="#00f0ff"
                      strokeWidth="3.5"
                      strokeDasharray="6 6"
                      strokeLinecap="round"
                      opacity="0.9"
                      className="animate-pulse"
                    />
                    {/* Proximity Distance Tag positioned directly on the road curve */}
                    <g transform={`translate(${midPoint.x}, ${midPoint.y})`}>
                      <rect
                        x="-22"
                        y="-9"
                        width="44"
                        height="17"
                        fill={tagBg}
                        rx="3"
                        stroke="#ffffff"
                        strokeWidth="0.8"
                        filter="url(#roadShadow)"
                        opacity="0.95"
                      />
                      <text
                        x="0"
                        y="3"
                        fill="#ffffff"
                        fontSize="8.5"
                        fontFamily="monospace"
                        fontWeight="bold"
                        textAnchor="middle"
                      >
                        {formattedDist}m
                      </text>
                    </g>
                  </g>
                );
              }
              return links;
            })()}

            {/* Deposit 14 Pit Terminal Area (Bottom Left) */}
            <g>
              <circle cx="180" cy="540" r="34" fill="#08141e" stroke="#163248" strokeWidth="1.5" />
              <text x="180" y="536" fill="#00f0ff" fontSize="9" fontFamily="monospace" fontWeight="bold" textAnchor="middle">
                DEP-14 PIT
              </text>
              <text x="180" y="547" fill="#64748b" fontSize="7" fontFamily="monospace" textAnchor="middle">
                BENCH 12 (640m)
              </text>
            </g>

            {/* Primary Crusher / Stockpile Terminal Area (Right) */}
            <g>
              <rect x="670" y="190" width="85" height="46" rx="4" fill="#0b1722" stroke="#1c374d" strokeWidth="1.5" />
              <text x="712" y="209" fill="#38bdf8" fontSize="9" fontFamily="monospace" fontWeight="bold" textAnchor="middle">
                PRIMARY CRUSHER
              </text>
              <text x="712" y="222" fill="#64748b" fontSize="8" fontFamily="monospace" fontWeight="bold" textAnchor="middle">
                STOCKPILE 02
              </text>
            </g>

            {/* Beacon Tower BT-14A (Spine Ascent) */}
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
                BT-14A
              </text>
              <text x="0" y="27" fill="#94a3b8" fontSize="6.5" fontFamily="monospace" textAnchor="middle">
                BEACON TOWER (980m)
              </text>
            </g>

            {/* Beacon Tower BT-14B (S-Bend Apex) */}
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
                BT-14B
              </text>
              <text x="0" y="27" fill="#94a3b8" fontSize="6.5" fontFamily="monospace" textAnchor="middle">
                BEACON TOWER (1,210m)
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

                  {/* Callsign Label Tag Pill (Offset to the right side of the truck) */}
                  <g transform="translate(18, -4)">
                    <rect
                      x="0"
                      y="-7"
                      width="34"
                      height="14"
                      rx="3"
                      fill={labelBg}
                      stroke={primaryColor}
                      strokeWidth="1"
                      filter="url(#roadShadow)"
                    />
                    <text
                      x="17"
                      y="3.5"
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
        </div>

        {/* Bottom Coordinates & Elevation HUD (Fixed) */}
        <div className="absolute bottom-3 left-4 text-[10px] font-mono text-slate-400 tracking-wider flex items-center gap-3 bg-[#070d13]/85 px-3 py-1 rounded border border-[#142330] z-20 pointer-events-none">
          <span className="text-hud-cyan font-semibold">18°41&apos;N 81°14&apos;E (BAILADILA)</span>
          <span className="text-slate-500">|</span>
          <span>RIDGE ELEVATION: 1,210m</span>
        </div>

        {/* Bottom Right UI Navigation Hint & Sector Name */}
        <div className="absolute bottom-3 right-4 flex items-center gap-2 z-20 pointer-events-none">
          <div className="text-[10px] font-mono text-cyan-400/80 bg-[#070d13]/90 px-2.5 py-1 rounded border border-cyan-500/30">
            🖱️ Drag to Pan &bull; Scroll to Zoom
          </div>
          <div className="text-[10px] font-mono text-slate-400 tracking-widest bg-[#070d13]/85 px-3 py-1 rounded border border-[#142330]">
            NMDC BIOM DEP-14
          </div>
        </div>
      </div>
    </div>
  );
};
