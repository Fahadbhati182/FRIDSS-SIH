'use client';

import React from 'react';
import { useSimulation } from '@/context/SimulationContext';
import {
  Droplets,
  Thermometer,
  Eye,
  AlertTriangle,
  Truck,
  Bell,
  Volume2,
  VolumeX,
  Play,
  Pause,
  Zap,
  Radio,
  Cpu
} from 'lucide-react';
import { soundFx } from '@/utils/audio';

export const Header: React.FC = () => {
  const {
    vehicles,
    weather,
    systemTime,
    systemDate,
    isPlaying,
    setIsPlaying,
    simSpeed,
    setSimSpeed,
    isMuted,
    setIsMuted,
    applyScenario,
    isLiveHardware
  } = useSimulation();

  const criticalCount = vehicles.filter((v) => v.status === 'critical').length;
  const warningCount = vehicles.filter((v) => v.status === 'warning').length;
  const totalAlerts = criticalCount + warningCount;

  return (
    <header className="h-16 bg-[#081018] border-b border-[#162738] px-5 flex items-center justify-between select-none z-30">
      {/* Brand & Connection Badge */}
      <div className="flex items-center gap-5">
        <div className="flex items-center gap-3" onClick={() => soundFx.playClick()}>
          <div className="w-9 h-9 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center shadow-[0_0_12px_rgba(0,240,255,0.15)]">
            <Radio className="w-5 h-5 text-cyan-400 animate-pulse" />
          </div>
          <div>
            <div className="text-base font-bold tracking-wider text-slate-100 font-mono flex items-center gap-2">
              MINE LANDER
              <span className="text-[10px] font-normal px-2 py-0.5 rounded bg-[#102232] text-cyan-400 border border-cyan-500/30">
                SIH 26088
              </span>
            </div>
            <div className="text-[11px] text-slate-400 font-medium">
              Bailadila Haul Road Safety &amp; Collision Avoidance
            </div>
          </div>
        </div>

        {/* Live HW / Sim Mode Badge */}
        {isLiveHardware ? (
          <div className="flex items-center gap-2 bg-emerald-950/70 border border-emerald-500/60 px-3 py-1 rounded-md text-xs font-mono text-emerald-400 shadow-[0_0_10px_rgba(16,185,129,0.2)] animate-pulse">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span className="font-bold tracking-wide">ESP32 LIVE STREAM</span>
          </div>
        ) : (
          <div className="flex items-center gap-2 bg-[#0c1a27] border border-[#1b3449] px-2.5 py-1 rounded-md text-xs font-mono text-amber-300">
            <Cpu className="w-3.5 h-3.5 text-amber-400" />
            <span className="font-semibold text-[11px]">SIMULATION MODE</span>
          </div>
        )}
      </div>

      {/* Environmental & Weather Telemetry (Live from Bailadila Mining Region) */}
      <div className="hidden lg:flex items-center gap-2.5">
        {/* Location Indicator */}
        <div className="flex items-center gap-1.5 bg-[#091522] border border-[#162e44] px-2.5 py-1 rounded-md text-[11px] font-mono text-slate-300">
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
          <span className="text-cyan-300 font-semibold">Bailadila Mine</span>
          <span className="text-slate-400 text-[10px]">(648m)</span>
        </div>

        {/* Humidity */}
        <div className="flex items-center gap-1.5 bg-[#0b1622] border border-[#182f44] px-2.5 py-1 rounded-md text-xs font-mono">
          <Droplets className="w-3.5 h-3.5 text-cyan-400" />
          <span className="text-slate-400 text-[10px]">RH:</span>
          <span className="text-cyan-300 font-bold text-xs">{weather.humidity}%</span>
        </div>

        {/* Temperature */}
        <div className="flex items-center gap-1.5 bg-[#0b1622] border border-[#182f44] px-2.5 py-1 rounded-md text-xs font-mono">
          <Thermometer className="w-3.5 h-3.5 text-pink-400" />
          <span className="text-slate-400 text-[10px]">Temp:</span>
          <span className="text-pink-300 font-bold text-xs">{weather.temperature.toFixed(1)}°C</span>
        </div>

        {/* Visibility */}
        <div className="flex items-center gap-1.5 bg-[#0b1622] border border-[#182f44] px-2.5 py-1 rounded-md text-xs font-mono">
          <Eye className="w-3.5 h-3.5 text-amber-400" />
          <span className="text-slate-400 text-[10px]">Vis:</span>
          <span className={`font-bold text-xs ${weather.visibility < 10 ? 'text-amber-400 animate-pulse' : 'text-slate-200'}`}>
            {weather.visibility.toFixed(1)} m
          </span>
        </div>
      </div>

      {/* Quick Scenario & Controls */}
      <div className="flex items-center gap-3">
        {/* Scenario preset buttons */}
        <div className="hidden xl:flex items-center gap-1.5 bg-[#0b1723] border border-[#193247] p-1 rounded-md">
          <span className="text-[10px] text-slate-400 font-mono px-1.5 flex items-center gap-1 font-semibold">
            <Zap className="w-3 h-3 text-cyan-400" /> SCENARIO:
          </span>
          <button
            onClick={() => { applyScenario('nominal'); soundFx.playClick(); }}
            className="text-xs font-mono px-2.5 py-1 rounded bg-[#102233] hover:bg-[#162d42] text-slate-300 transition-colors"
          >
            Clear
          </button>
          <button
            onClick={() => { applyScenario('fog_surge'); soundFx.playWarning(); }}
            className="text-xs font-mono px-2.5 py-1 rounded bg-amber-500/10 text-amber-400 border border-amber-500/30 hover:bg-amber-500/20 transition-colors font-semibold"
          >
            Fog Surge
          </button>
          <button
            onClick={() => { applyScenario('collision_risk'); soundFx.playCriticalAlert(); }}
            className="text-xs font-mono px-2.5 py-1 rounded bg-red-500/10 text-red-400 border border-red-500/30 hover:bg-red-500/20 transition-colors font-semibold"
          >
            Collision Risk
          </button>
        </div>

        {/* Audio Mute/Unmute */}
        <button
          onClick={() => {
            setIsMuted(!isMuted);
            soundFx.playClick();
          }}
          className={`p-2 rounded-md border transition-colors ${isMuted
              ? 'bg-red-500/10 border-red-500/30 text-red-400'
              : 'bg-[#0c1824] border-[#1b344a] text-slate-300 hover:text-cyan-400'
            }`}
          title={isMuted ? 'Unmute tactical audio' : 'Mute tactical audio'}
        >
          {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
        </button>

        {/* Alerts Pill */}
        <div
          className={`flex items-center gap-2 text-xs font-mono px-3 py-1.5 rounded-md border transition-all ${totalAlerts > 0
              ? 'bg-red-950/50 border-red-500/70 text-red-400 shadow-[0_0_12px_rgba(239,68,68,0.25)] animate-pulse'
              : 'bg-[#0a1824] border-[#143247] text-emerald-400'
            }`}
        >
          <Bell className="w-3.5 h-3.5" />
          <span className="font-semibold text-slate-300">{totalAlerts} ALERTS</span>
        </div>

        {/* System Time */}
        <div className="flex flex-col text-right pl-3 border-l border-[#193248]">
          <span className="font-mono text-sm font-bold text-slate-100">
            {systemTime}
          </span>
          <span className="text-[10px] font-mono text-slate-400">
            {systemDate}
          </span>
        </div>
      </div>
    </header>
  );
};


