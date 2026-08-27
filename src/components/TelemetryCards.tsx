'use client';

import React from 'react';
import { useSimulation } from '@/context/SimulationContext';
import { 
  ShieldCheck, 
  AlertTriangle, 
  AlertOctagon, 
  ChevronRight, 
  Gauge, 
  Compass, 
  TrendingUp, 
  Radio, 
  ShieldAlert
} from 'lucide-react';
import { soundFx } from '@/utils/audio';

export const TelemetryCards: React.FC = () => {
  const { vehicles, selectedVehicleId, setSelectedVehicleId, triggerEmergencyBrake } = useSimulation();

  return (
    <div className="flex-1 overflow-y-auto p-3 space-y-3 bg-[#070e16]">
      {vehicles.map((v) => {
        const isSelected = selectedVehicleId === v.id;
        const isSafe = v.status === 'safe';
        const isWarning = v.status === 'warning';
        const isCritical = v.status === 'critical';

        let badgeBg = 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
        let statusLabel = 'SAFE';
        let ttcBoxStyle = 'border-emerald-500/50 bg-emerald-950/20 text-emerald-400';

        if (isWarning) {
          badgeBg = 'bg-amber-500/15 text-amber-400 border-amber-500/40';
          statusLabel = 'WARNING';
          ttcBoxStyle = 'border-amber-500/60 bg-amber-950/30 text-amber-400';
        } else if (isCritical) {
          badgeBg = 'bg-red-500/20 text-red-400 border-red-500/50 animate-pulse';
          statusLabel = 'CRITICAL';
          ttcBoxStyle = 'border-red-500 bg-red-950/40 text-red-400 shadow-[0_0_10px_rgba(239,68,68,0.4)] animate-pulse';
        }

        return (
          <div
            key={v.id}
            onClick={() => {
              setSelectedVehicleId(v.id);
              soundFx.playClick();
            }}
            className={`rounded-lg border p-3 cursor-pointer transition-all duration-200 ${
              isSelected
                ? 'bg-[#0a1824] border-hud-cyan shadow-[0_0_12px_rgba(0,240,255,0.2)]'
                : 'bg-[#09131d] border-[#152737] hover:border-[#1e3b54] hover:bg-[#0c1722]'
            }`}
          >
            {/* Top Row: Callsign, Status, Operator */}
            <div className="flex items-center justify-between pb-2 border-b border-[#142636]">
              <div className="flex items-center gap-2">
                <span className="font-mono text-sm font-black text-slate-100 tracking-wider">
                  {v.name}
                </span>
                <span
                  className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border ${badgeBg}`}
                >
                  {statusLabel}
                </span>
              </div>

              <div className="text-[11px] font-mono text-slate-400 flex items-center gap-1">
                <span>{v.operator}</span>
              </div>
            </div>

            {/* Metrics Row 1: Speed, Heading, Slope */}
            <div className="grid grid-cols-3 gap-2 my-2.5 text-center">
              {/* Speed */}
              <div className="bg-[#070e16] border border-[#162a3c] rounded p-1.5 flex flex-col items-center justify-center">
                <span className="text-[9px] font-mono text-slate-400 tracking-wider">SPEED</span>
                <div className="flex items-baseline gap-0.5">
                  <span className="font-mono text-base font-bold text-slate-100">
                    {Math.round(v.speed)}
                  </span>
                  <span className="text-[9px] font-mono text-hud-cyan">km/h</span>
                </div>
              </div>

              {/* Heading */}
              <div className="bg-[#070e16] border border-[#162a3c] rounded p-1.5 flex flex-col items-center justify-center">
                <span className="text-[9px] font-mono text-slate-400 tracking-wider">HEADING</span>
                <div className="flex items-baseline gap-0.5">
                  <span className="font-mono text-base font-bold text-slate-100">
                    {String(v.heading).padStart(3, '0')}
                  </span>
                  <span className="text-[9px] font-mono text-slate-400">°</span>
                </div>
              </div>

              {/* Slope */}
              <div className="bg-[#070e16] border border-[#162a3c] rounded p-1.5 flex flex-col items-center justify-center">
                <span className="text-[9px] font-mono text-slate-400 tracking-wider">SLOPE</span>
                <div className="flex items-baseline gap-0.5">
                  <span
                    className={`font-mono text-base font-bold ${
                      v.slope > 7 ? 'text-amber-400' : 'text-slate-100'
                    }`}
                  >
                    {v.slope.toFixed(1)}
                  </span>
                  <span className="text-[9px] font-mono text-slate-400">%</span>
                </div>
              </div>
            </div>

            {/* Metrics Row 2: Obstacle Distance, Relative Velocity, TTC (Time To Collision) */}
            <div className="grid grid-cols-3 gap-2 my-2 text-center items-center">
              {/* Distance to Obstacle */}
              <div className="bg-[#070e16] border border-[#162a3c] rounded p-1.5 flex flex-col items-center">
                <span className="text-[9px] font-mono text-slate-400 tracking-wider">DIST OBS</span>
                <div className="flex items-baseline gap-0.5">
                  <span className="font-mono text-sm font-bold text-slate-200">
                    {v.distanceToObstacle.toFixed(1)}
                  </span>
                  <span className="text-[9px] font-mono text-hud-cyan">m</span>
                </div>
              </div>

              {/* Rel Velocity */}
              <div className="bg-[#070e16] border border-[#162a3c] rounded p-1.5 flex flex-col items-center">
                <span className="text-[9px] font-mono text-slate-400 tracking-wider">REL VEL</span>
                <div className="flex items-baseline gap-0.5">
                  <span className="font-mono text-sm font-bold text-slate-200">
                    {v.relativeVelocity.toFixed(1)}
                  </span>
                  <span className="text-[9px] font-mono text-slate-400">m/s</span>
                </div>
              </div>

              {/* TTC (Time To Collision) Box matching Image 1 */}
              <div className={`rounded p-1.5 border flex flex-col items-center ${ttcBoxStyle}`}>
                <span className="text-[9px] font-mono tracking-wider font-bold">TTC</span>
                <div className="flex items-baseline gap-0.5">
                  <span className="font-mono text-sm font-extrabold">
                    {v.ttc.toFixed(1)}
                  </span>
                  <span className="text-[9px] font-mono">s</span>
                </div>
              </div>
            </div>

            {/* Row 3: Sensor Indicators (VIS, IR, GPS, IMU, RFID) & Zone */}
            <div className="flex items-center justify-between pt-2 border-t border-[#142636] text-[10px] font-mono">
              <div className="flex items-center gap-1.5 text-slate-400">
                <span className="text-[9px] text-slate-500 font-bold uppercase mr-1">SENSORS</span>
                <span className="flex items-center gap-0.5 text-emerald-400 font-semibold">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" /> VIS
                </span>
                <span className="flex items-center gap-0.5 text-emerald-400 font-semibold">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" /> IR
                </span>
                <span className="flex items-center gap-0.5 text-emerald-400 font-semibold">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" /> GPS
                </span>
                <span className="flex items-center gap-0.5 text-emerald-400 font-semibold">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" /> IMU
                </span>
                <span className="flex items-center gap-0.5 text-emerald-400 font-semibold">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" /> RFID
                </span>
              </div>

              <div className="flex items-center gap-1 text-hud-cyan hover:underline cursor-pointer">
                <span>{v.activeZoneName.split(' ')[0]}</span>
                <ChevronRight className="w-3 h-3" />
              </div>
            </div>

            {/* Critical Emergency Intervention Button */}
            {isCritical && (
              <div className="mt-2 pt-2 border-t border-red-900/50 flex items-center justify-between">
                <span className="text-[10px] font-mono text-red-400 font-bold flex items-center gap-1">
                  <AlertOctagon className="w-3.5 h-3.5" /> COLLISION RISK DETECTED
                </span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    triggerEmergencyBrake(v.id);
                  }}
                  className="px-2 py-1 bg-red-600 hover:bg-red-500 text-white font-mono font-bold text-[10px] rounded shadow-[0_0_8px_#ef4444] transition-all"
                >
                  AUTONOMOUS BRAKE
                </button>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};
