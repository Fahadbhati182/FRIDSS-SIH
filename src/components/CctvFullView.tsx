'use client';

import React, { useState } from 'react';
import { Camera, Eye, Zap, RefreshCw, Layers, ShieldCheck } from 'lucide-react';
import { soundFx } from '@/utils/audio';

export const CctvFullView: React.FC = () => {
  const [thermalMode, setThermalMode] = useState(false);
  const [aiBboxActive, setAiBboxActive] = useState(true);

  const cameras = [
    { id: 'CAM-01', title: 'MINE PIT ENTRANCE - WEST SLOPE', preset: '1080p 60FPS LiDAR-Fusion', vehicles: 'DUMPER-01 (D-441)', status: 'CLEAR', conf: '98%' },
    { id: 'CAM-02', title: 'HAUL ROAD MILEPOST 2.4 - BT-A TOWER', preset: '1080p 60FPS mmWave-Fusion', vehicles: 'IN TRANSIT', status: 'HAZY', conf: '94%' },
    { id: 'CAM-03', title: 'HILLTOP S-BEND APEX - ZONE 3 (DENSE FOG)', preset: '1080p 60FPS Thermal/YOLO', vehicles: 'DUMPER-02, DUMPER-03', status: 'CRITICAL FOG', conf: '89%' },
    { id: 'CAM-04', title: 'WASTE DUMP ACCESS RAMP - BT-B', preset: '1080p 60FPS AI-Tracking', vehicles: 'NONE', status: 'NOMINAL', conf: '99%' },
  ];

  return (
    <div className="flex-1 bg-[#060b10] p-6 overflow-y-auto font-sans select-none">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 border-b border-[#142330] pb-4">
        <div>
          <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
            <Camera className="w-5 h-5 text-hud-cyan" />
            CCTV &amp; Multi-Spectral AI Vision Matrix
          </h2>
          <p className="text-xs text-slate-400 font-mono mt-1">
            Real-time Edge YOLOv9 Target Tracking, Optical Fog De-scattering &amp; Thermal Infrared Feeds
          </p>
        </div>

        <div className="flex items-center gap-2 font-mono text-xs">
          <button
            onClick={() => {
              setThermalMode(!thermalMode);
              soundFx.playClick();
            }}
            className={`px-3 py-1.5 rounded border transition-all ${
              thermalMode
                ? 'bg-purple-600/30 border-purple-400 text-purple-300'
                : 'bg-[#0c1822] border-[#162f44] text-slate-300'
            }`}
          >
            {thermalMode ? 'THERMAL IR: ON' : 'THERMAL IR: OFF'}
          </button>
          <button
            onClick={() => {
              setAiBboxActive(!aiBboxActive);
              soundFx.playClick();
            }}
            className={`px-3 py-1.5 rounded border transition-all ${
              aiBboxActive
                ? 'bg-hud-cyan/20 border-hud-cyan text-hud-cyan'
                : 'bg-[#0c1822] border-[#162f44] text-slate-300'
            }`}
          >
            {aiBboxActive ? 'AI BOUNDING BOXES: ACTIVE' : 'AI BOUNDING BOXES: OFF'}
          </button>
        </div>
      </div>

      {/* 2x2 Camera Matrix */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {cameras.map((cam) => (
          <div key={cam.id} className="bg-[#0a1520] border border-[#172e42] rounded-xl overflow-hidden">
            {/* Cam Header */}
            <div className="bg-[#070e16] px-3 py-2 border-b border-[#142636] flex items-center justify-between font-mono text-xs">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
                <span className="font-bold text-slate-200">{cam.id}</span>
                <span className="text-slate-400 text-[10px]">&bull; {cam.title}</span>
              </div>
              <span className="text-[10px] text-hud-cyan font-semibold">{cam.preset}</span>
            </div>

            {/* Video Canvas Simulation */}
            <div className="relative h-64 bg-[#03070b] overflow-hidden flex items-center justify-center">
              {/* Filter mode */}
              <div
                className={`absolute inset-0 transition-all ${
                  thermalMode ? 'bg-gradient-to-tr from-purple-950 via-red-950 to-amber-950' : 'bg-[#0a1520]'
                }`}
              >
                {/* Synthetic road wireframe */}
                <svg className="w-full h-full opacity-40">
                  <line x1="20%" y1="100%" x2="50%" y2="50%" stroke="#00f0ff" strokeWidth="2" />
                  <line x1="80%" y1="100%" x2="50%" y2="50%" stroke="#00f0ff" strokeWidth="2" />
                  <line x1="50%" y1="100%" x2="50%" y2="50%" stroke="#f59e0b" strokeWidth="2" strokeDasharray="6 6" />
                </svg>
              </div>

              {/* Fog overlay for Cam 3 */}
              {cam.id === 'CAM-03' && (
                <div className="absolute inset-0 bg-amber-500/20 backdrop-blur-[2px] pointer-events-none" />
              )}

              {/* Scanlines */}
              <div className="absolute inset-0 hud-scanlines opacity-40 pointer-events-none" />

              {/* Bounding box simulation */}
              {aiBboxActive && cam.id === 'CAM-03' && (
                <div className="absolute top-[35%] left-[30%] w-[38%] h-[35%] border-2 border-red-500 bg-red-500/10 p-1">
                  <div className="bg-red-500 text-white font-mono font-bold text-[9px] px-1 inline-block">
                    DUMPER-03 (TTC: 2.0s) 89%
                  </div>
                </div>
              )}

              {aiBboxActive && cam.id === 'CAM-01' && (
                <div className="absolute top-[40%] left-[45%] w-[25%] h-[30%] border-2 border-emerald-400 bg-emerald-500/10 p-1">
                  <div className="bg-emerald-500 text-black font-mono font-bold text-[9px] px-1 inline-block">
                    DUMPER-01 (SAFE) 98%
                  </div>
                </div>
              )}

              {/* Live HUD telemetry bottom bar */}
              <div className="absolute bottom-2 left-3 right-3 flex items-center justify-between text-[10px] font-mono text-slate-300 bg-black/60 px-2.5 py-1 rounded">
                <span>DETECTED: {cam.vehicles}</span>
                <span className="text-hud-cyan">AI CONFIDENCE: {cam.conf}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
