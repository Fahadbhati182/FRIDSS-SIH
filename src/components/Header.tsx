'use client';

import React from 'react';
import { useSimulation } from '@/context/SimulationContext';
import { 
  Triangle, 
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
  ShieldAlert
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
    applyScenario
  } = useSimulation();

  const criticalCount = vehicles.filter((v) => v.status === 'critical').length;
  const warningCount = vehicles.filter((v) => v.status === 'warning').length;
  const totalAlerts = criticalCount + warningCount;

  return (
    <header className="h-16 bg-[#070d13] border-b border-[#142330] px-4 flex items-center justify-between select-none relative z-30 shadow-md">
      {/* Brand & Logo */}
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => soundFx.playClick()}>
          <div className="relative flex items-center justify-center">
            <Triangle className="w-6 h-6 text-hud-cyan fill-hud-cyan/20 animate-pulse" />
            <div className="absolute w-1.5 h-1.5 bg-hud-cyan rounded-full shadow-[0_0_8px_#00f0ff]" />
          </div>
          <div>
            <div className="text-[17px] font-black tracking-widest text-hud-cyan leading-none font-mono">
              MINE LANDER
            </div>
            <div className="text-[9px] font-semibold tracking-wider text-slate-400 uppercase">
              Control Center
            </div>
          </div>
        </div>

        {/* Digital Clock */}
        <div className="flex flex-col border-l border-[#1b3144] pl-5">
          <span className="font-mono text-lg font-bold text-slate-100 tracking-wider">
            {systemTime}
          </span>
          <span className="text-[10px] font-mono text-slate-400 tracking-wider">
            {systemDate}
          </span>
        </div>
      </div>

      {/* Atmospheric / Environmental Telemetry Pills */}
      <div className="hidden lg:flex items-center gap-3">
        {/* Humidity */}
        <div className="flex items-center gap-1.5 bg-[#0b1722] border border-[#1a3348] px-3 py-1.5 rounded text-xs font-mono">
          <Droplets className="w-3.5 h-3.5 text-[#00f0ff]" />
          <span className="text-[#00f0ff] font-bold">{weather.humidity}%</span>
          <span className="text-slate-400 text-[10px]">RH</span>
        </div>

        {/* Temperature */}
        <div className="flex items-center gap-1.5 bg-[#0b1722] border border-[#1a3348] px-3 py-1.5 rounded text-xs font-mono">
          <Thermometer className="w-3.5 h-3.5 text-[#ec4899]" />
          <span className="text-[#ec4899] font-bold">{weather.temperature.toFixed(1)} °C</span>
        </div>

        {/* Visibility Distance */}
        <div className="flex items-center gap-1.5 bg-[#0b1722] border border-[#1a3348] px-3 py-1.5 rounded text-xs font-mono">
          <Eye className="w-3.5 h-3.5 text-[#a855f7]" />
          <span className={`font-bold ${weather.visibility < 10 ? 'text-hud-warning animate-pulse' : 'text-[#a855f7]'}`}>
            {weather.visibility.toFixed(1)}m
          </span>
          <span className="text-slate-400 text-[10px]">VIS</span>
        </div>

        {/* VHI Radial Meter */}
        <div className="flex items-center gap-2 bg-[#0b1722] border border-[#1a3348] px-3 py-1.5 rounded text-xs font-mono">
          <div className="relative w-5 h-5 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
              <path
                className="text-slate-700 stroke-current"
                strokeWidth="4"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              <path
                className="text-amber-400 stroke-current transition-all duration-500"
                strokeDasharray={`${weather.vhi}, 100`}
                strokeWidth="4"
                strokeLinecap="round"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
            </svg>
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-1">
              <span className="text-amber-400 font-bold">{weather.vhi}%</span>
              <AlertTriangle className="w-3 h-3 text-amber-400" />
            </div>
            <span className="text-slate-400 text-[9px] leading-none">VHI</span>
          </div>
        </div>
      </div>

      {/* Simulation Controls & Scenarios */}
      <div className="flex items-center gap-2">
        {/* Scenario dropdown trigger */}
        <div className="hidden xl:flex items-center gap-1 bg-[#0a1520] border border-[#193246] p-1 rounded">
          <span className="text-[10px] text-slate-400 font-mono px-1 flex items-center gap-1">
            <Zap className="w-3 h-3 text-hud-cyan" /> SCENARIO:
          </span>
          <button
            onClick={() => { applyScenario('nominal'); soundFx.playClick(); }}
            className="text-[11px] font-mono px-2 py-0.5 rounded hover:bg-[#152a3b] text-slate-300 transition-colors"
          >
            Clear
          </button>
          <button
            onClick={() => { applyScenario('fog_surge'); soundFx.playWarning(); }}
            className="text-[11px] font-mono px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/30 hover:bg-amber-500/20 transition-colors"
          >
            Monsoon Fog
          </button>
          <button
            onClick={() => { applyScenario('collision_risk'); soundFx.playCriticalAlert(); }}
            className="text-[11px] font-mono px-2 py-0.5 rounded bg-red-500/10 text-red-400 border border-red-500/30 hover:bg-red-500/20 transition-colors flex items-center gap-1"
          >
            <ShieldAlert className="w-3 h-3" /> Collision Alert
          </button>
        </div>

        {/* Sim Play/Pause */}
        <button
          onClick={() => {
            setIsPlaying(!isPlaying);
            soundFx.playClick();
          }}
          className={`p-1.5 rounded border transition-colors ${
            isPlaying
              ? 'bg-hud-cyan/10 border-hud-cyan/40 text-hud-cyan hover:bg-hud-cyan/20'
              : 'bg-amber-500/20 border-amber-500/50 text-amber-300'
          }`}
          title={isPlaying ? 'Pause Simulation' : 'Resume Simulation'}
        >
          {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
        </button>

        {/* Speed button */}
        <button
          onClick={() => {
            setSimSpeed(simSpeed === 1 ? 2 : simSpeed === 2 ? 4 : 1);
            soundFx.playClick();
          }}
          className="text-xs font-mono font-bold px-2 py-1 bg-[#0c1822] border border-[#1b3447] text-slate-300 rounded hover:text-hud-cyan transition-colors"
        >
          {simSpeed}x
        </button>

        {/* Audio Mute/Unmute */}
        <button
          onClick={() => {
            setIsMuted(!isMuted);
            soundFx.playClick();
          }}
          className={`p-1.5 rounded border transition-colors ${
            isMuted
              ? 'bg-red-500/10 border-red-500/30 text-red-400'
              : 'bg-[#0c1822] border-[#1b3447] text-slate-300 hover:text-hud-cyan'
          }`}
          title={isMuted ? 'Unmute tactical audio' : 'Mute tactical audio'}
        >
          {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
        </button>
      </div>

      {/* Fleet Stats & Operator Profile */}
      <div className="flex items-center gap-4">
        {/* Vehicles pill */}
        <div className="flex items-center gap-1.5 text-xs font-mono text-hud-cyan bg-[#0a1824] border border-[#143247] px-2.5 py-1.5 rounded">
          <Truck className="w-4 h-4 text-hud-cyan" />
          <span className="font-bold">{vehicles.length}</span>
          <span className="text-[11px] text-slate-400">VEHICLES</span>
        </div>

        {/* Alerts Pill */}
        <div
          className={`flex items-center gap-1.5 text-xs font-mono px-2.5 py-1.5 rounded border transition-all ${
            totalAlerts > 0
              ? 'bg-red-950/40 border-red-500/60 text-red-400 shadow-[0_0_10px_rgba(239,68,68,0.3)] animate-pulse'
              : 'bg-[#0a1824] border-[#143247] text-emerald-400'
          }`}
        >
          <Bell className="w-3.5 h-3.5" />
          <span className="text-[11px] font-medium text-slate-300">ALERTS</span>
          <span className="px-1.5 py-0.2 bg-red-600 text-white font-bold rounded-sm text-[11px]">
            {totalAlerts}
          </span>
        </div>

        {/* Operator Profile */}
        <div className="flex items-center gap-2 pl-2 border-l border-[#193246]">
          <div className="w-8 h-8 rounded bg-cyan-950 border border-hud-cyan/50 text-hud-cyan font-mono font-bold flex items-center justify-center text-xs shadow-inner">
            AK
          </div>
          <div className="hidden sm:flex flex-col text-left">
            <span className="text-xs font-bold text-slate-200 leading-tight">
              A. Kowalski
            </span>
            <span className="text-[9px] font-mono text-hud-cyan tracking-wider font-semibold uppercase">
              OPERATOR
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};
