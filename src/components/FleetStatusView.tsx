'use client';

import React from 'react';
import { useSimulation } from '@/context/SimulationContext';
import { Truck, ShieldCheck, AlertTriangle, AlertOctagon, Gauge, BatteryCharging, Fuel, ShieldAlert } from 'lucide-react';
import { soundFx } from '@/utils/audio';

export const FleetStatusView: React.FC = () => {
  const { vehicles, setSelectedVehicleId, triggerEmergencyBrake, setActiveTab } = useSimulation();

  return (
    <div className="flex-1 bg-[#060b10] p-6 overflow-y-auto font-sans select-none">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 border-b border-[#142330] pb-4">
        <div>
          <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
            <Truck className="w-5 h-5 text-hud-cyan" />
            Active Heavy Hauler Fleet Diagnostics &amp; Telemetry
          </h2>
          <p className="text-xs text-slate-400 font-mono mt-1">
            Real-time CAT 785C / Komatsu 930E Telemetry, CAN-bus health, Sensor Fusion Status &amp; Speed Caps
          </p>
        </div>
      </div>

      {/* Fleet Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {vehicles.map((v) => {
          const isCrit = v.status === 'critical';
          const isWarn = v.status === 'warning';

          return (
            <div
              key={v.id}
              onClick={() => {
                setSelectedVehicleId(v.id);
                setActiveTab('live-map');
                soundFx.playClick();
              }}
              className={`bg-[#0a1520] border rounded-xl p-4 cursor-pointer transition-all hover:scale-[1.01] ${
                isCrit
                  ? 'border-red-500/60 shadow-[0_0_15px_rgba(239,68,68,0.2)]'
                  : isWarn
                  ? 'border-amber-500/50'
                  : 'border-[#172e42]'
              }`}
            >
              <div className="flex items-center justify-between mb-3 border-b border-[#142636] pb-2">
                <div>
                  <h3 className="text-base font-bold text-slate-100 font-mono">{v.name}</h3>
                  <span className="text-xs text-slate-400 font-mono">Code: {v.operatorCode}</span>
                </div>
                <span
                  className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border uppercase ${
                    isCrit
                      ? 'bg-red-500/20 text-red-400 border-red-500/50'
                      : isWarn
                      ? 'bg-amber-500/20 text-amber-400 border-amber-500/50'
                      : 'bg-emerald-500/20 text-emerald-400 border-emerald-500/50'
                  }`}
                >
                  {v.status}
                </span>
              </div>

              <div className="space-y-2 text-xs font-mono">
                <div className="flex items-center justify-between text-slate-300">
                  <span className="text-slate-400">Operator:</span>
                  <span className="font-bold text-slate-200">{v.operator}</span>
                </div>
                <div className="flex items-center justify-between text-slate-300">
                  <span className="text-slate-400">Current Speed:</span>
                  <span className="font-bold text-hud-cyan">{Math.round(v.speed)} km/h (Cap: {v.maxSpeed})</span>
                </div>
                <div className="flex items-center justify-between text-slate-300">
                  <span className="text-slate-400">Inclination (Slope):</span>
                  <span className={`font-bold ${v.slope > 7 ? 'text-amber-400' : 'text-slate-200'}`}>{v.slope}% grade</span>
                </div>
                <div className="flex items-center justify-between text-slate-300">
                  <span className="text-slate-400">Active Zone:</span>
                  <span className="font-bold text-hud-cyan">{v.activeZoneName}</span>
                </div>
                <div className="flex items-center justify-between text-slate-300">
                  <span className="text-slate-400">Payload:</span>
                  <span className="font-bold text-slate-200">{v.payload} Tons</span>
                </div>
                <div className="flex items-center justify-between text-slate-300">
                  <span className="text-slate-400">Fuel Tank:</span>
                  <span className="font-bold text-emerald-400">{v.fuelLevel}%</span>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-[#142636] flex items-center justify-between">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    triggerEmergencyBrake(v.id);
                  }}
                  className="w-full py-1.5 bg-red-600/80 hover:bg-red-600 text-white font-mono font-bold text-xs rounded transition-colors"
                >
                  TRIGGER RETARDER BRAKE
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
