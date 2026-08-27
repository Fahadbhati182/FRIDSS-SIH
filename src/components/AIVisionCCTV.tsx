'use client';

import React, { useState } from 'react';
import { useSimulation } from '@/context/SimulationContext';
import { Camera, Eye, Zap, RefreshCw, Maximize2 } from 'lucide-react';
import { soundFx } from '@/utils/audio';

export const AIVisionCCTV: React.FC = () => {
  const { aiFogFilterActive, setAiFogFilterActive, cctvPreset, setCctvPreset, weather } = useSimulation();
  const [fullscreen, setFullscreen] = useState(false);

  const detections = [
    { id: 'det-1', label: 'FOG PATCH', conf: 80, time: '17:31:05', color: '#f59e0b', top: '22%', left: '42%', w: '18%', h: '24%' },
    { id: 'det-2', label: 'FOG PATCH', conf: 83, time: '17:31:08', color: '#f59e0b', top: '15%', left: '20%', w: '26%', h: '32%' },
    { id: 'det-3', label: 'DUMPER-02', conf: 95, time: '17:31:12', color: '#00f0ff', top: '34%', left: '55%', w: '20%', h: '28%' },
    { id: 'det-4', label: 'FOG PATCH', conf: 81, time: '17:31:14', color: '#f59e0b', top: '28%', left: '10%', w: '22%', h: '22%' },
    { id: 'det-5', label: 'DUMPER-03', conf: 89, time: '17:31:20', color: '#ef4444', top: '38%', left: '30%', w: '24%', h: '30%' },
    { id: 'det-6', label: 'FOG PATCH', conf: 84, time: '17:31:25', color: '#f59e0b', top: '18%', left: '68%', w: '20%', h: '25%' },
  ];

  return (
    <div className="bg-[#070e16] border-b border-[#142330] p-3 select-none">
      {/* CCTV Header */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <Camera className="w-4 h-4 text-hud-cyan" />
          <span className="text-xs font-mono font-bold tracking-wider text-slate-200">
            CCTV - AI VISION
          </span>
        </div>

        <div className="flex items-center gap-2 text-[10px] font-mono">
          {/* Preset selector */}
          <select
            value={cctvPreset}
            onChange={(e) => {
              setCctvPreset(e.target.value as any);
              soundFx.playClick();
            }}
            className="bg-[#0b1824] border border-[#1a3348] text-slate-300 rounded px-1.5 py-0.5 text-[10px] outline-none"
          >
            <option value="CAM-03 HILLTOP">CAM-03 • HILLTOP</option>
            <option value="CAM-01 PIT ENTRY">CAM-01 • PIT ENTRY</option>
            <option value="CAM-05 BEND APEX">CAM-05 • BEND APEX</option>
          </select>

          {/* REC dot */}
          <div className="flex items-center gap-1 bg-red-950/60 border border-red-500/40 px-1.5 py-0.5 rounded text-red-400 font-bold">
            <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-ping" />
            <span>REC</span>
          </div>
        </div>
      </div>

      {/* Camera Video HUD Screen */}
      <div className="relative w-full h-44 bg-[#03070b] rounded border border-[#162a3c] overflow-hidden group">
        {/* Synthetic Road Background */}
        <div
          className={`absolute inset-0 transition-all duration-700 ${
            aiFogFilterActive ? 'brightness-125 contrast-125 saturate-150' : 'brightness-75'
          }`}
          style={{
            background: 'radial-gradient(ellipse at 50% 65%, #182836 0%, #0c1620 50%, #03080e 100%)',
          }}
        >
          {/* Vanishing point haul road perspective lines */}
          <svg className="w-full h-full opacity-60">
            {/* Horizon line */}
            <line x1="0" y1="55%" x2="100%" y2="55%" stroke="#203d54" strokeWidth="1" strokeDasharray="3 3" />
            
            {/* Road borders converging */}
            <line x1="20%" y1="100%" x2="48%" y2="55%" stroke="#00f0ff" strokeWidth="2" opacity="0.8" />
            <line x1="80%" y1="100%" x2="52%" y2="55%" stroke="#00f0ff" strokeWidth="2" opacity="0.8" />
            
            {/* Road center dashes */}
            <line x1="50%" y1="100%" x2="50%" y2="55%" stroke="#f59e0b" strokeWidth="2" strokeDasharray="6 8" opacity="0.7" />

            {/* Hill gradient silhouettes */}
            <path d="M 0 55% Q 30% 45%, 60% 55% T 100% 50% L 100% 55% L 0 55% Z" fill="#08141f" opacity="0.9" />
          </svg>
        </div>

        {/* Dynamic Fog Veil Overlay */}
        <div
          className={`absolute inset-0 pointer-events-none transition-opacity duration-500 ${
            aiFogFilterActive ? 'opacity-30' : 'opacity-85'
          }`}
          style={{
            background: 'radial-gradient(circle at 50% 45%, rgba(202, 138, 4, 0.45) 0%, rgba(234, 179, 8, 0.25) 45%, rgba(10, 20, 30, 0.7) 100%)',
            backdropFilter: aiFogFilterActive ? 'none' : 'blur(2px)',
          }}
        />

        {/* Optical Scanlines */}
        <div className="absolute inset-0 hud-scanlines pointer-events-none opacity-40" />

        {/* Crosshair / Optical Center HUD */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-12 h-12 border border-hud-cyan/20 rounded-full flex items-center justify-center">
            <div className="w-2 h-0.5 bg-hud-cyan/40" />
            <div className="h-2 w-0.5 bg-hud-cyan/40" />
          </div>
        </div>

        {/* YOLO AI Bounding Boxes */}
        {detections.map((det) => (
          <div
            key={det.id}
            className="absolute transition-all duration-300 cursor-pointer"
            style={{
              top: det.top,
              left: det.left,
              width: det.w,
              height: det.h,
              border: `1.5px solid ${det.color}`,
              backgroundColor: `${det.color}15`,
            }}
          >
            {/* Corner brackets */}
            <div className="absolute -top-1 -left-1 w-1.5 h-1.5 border-t border-l border-white" />
            <div className="absolute -bottom-1 -right-1 w-1.5 h-1.5 border-b border-r border-white" />

            {/* Label tag */}
            <div
              className="absolute -top-3.5 left-0 px-1 text-[8px] font-mono font-bold whitespace-nowrap text-white"
              style={{ backgroundColor: det.color }}
            >
              {det.label} {det.conf}%
            </div>
          </div>
        ))}

        {/* Live HUD Diagnostics Overlay in Video */}
        <div className="absolute top-1.5 left-2 text-[9px] font-mono text-hud-cyan flex items-center gap-2">
          <span className="bg-black/60 px-1 rounded">YOLOv9-MINE-HD</span>
          <span className="text-slate-400">FPS: 59.8</span>
          <span className="text-slate-400">LATENCY: 14ms</span>
        </div>

        <div className="absolute bottom-1.5 right-2 flex items-center gap-1.5">
          {/* AI Fog Penetration Toggle */}
          <button
            onClick={() => {
              setAiFogFilterActive(!aiFogFilterActive);
              soundFx.playClick();
            }}
            className={`px-2 py-0.5 text-[9px] font-mono font-bold rounded flex items-center gap-1 transition-all ${
              aiFogFilterActive
                ? 'bg-hud-cyan text-black shadow-[0_0_8px_#00f0ff]'
                : 'bg-black/70 text-slate-300 border border-slate-700'
            }`}
          >
            <Zap className="w-2.5 h-2.5" />
            {aiFogFilterActive ? 'AI DE-FOG: ON' : 'AI DE-FOG: OFF'}
          </button>
        </div>
      </div>

      {/* Detection Feed Micro-List */}
      <div className="mt-2 grid grid-cols-3 gap-1 text-[9px] font-mono text-slate-400">
        <div className="bg-[#0a1520] border border-[#162b3d] p-1 rounded">
          <div className="text-amber-400 font-bold">FOG OCCLUSION</div>
          <div className="text-slate-300 font-semibold">{weather.condition === 'MONSOON_FOG' ? '83% DENSE' : '22% LIGHT'}</div>
        </div>
        <div className="bg-[#0a1520] border border-[#162b3d] p-1 rounded">
          <div className="text-hud-cyan font-bold">AI TARGETS</div>
          <div className="text-slate-300 font-semibold">2 DUMPERS (D2, D3)</div>
        </div>
        <div className="bg-[#0a1520] border border-[#162b3d] p-1 rounded">
          <div className="text-red-400 font-bold">COLLISION CONE</div>
          <div className="text-red-300 font-semibold">ACTIVE (TTC 2.0s)</div>
        </div>
      </div>
    </div>
  );
};
