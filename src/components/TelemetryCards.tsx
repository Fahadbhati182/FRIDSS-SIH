'use client';

import React from 'react';
import { useSimulation } from '@/context/SimulationContext';
import { 
  AlertOctagon, 
  ShieldCheck, 
  AlertTriangle,
  Radio, 
  Activity,
  Zap
} from 'lucide-react';
import { soundFx } from '@/utils/audio';

export const TelemetryCards: React.FC = () => {
  const { vehicles, selectedVehicleId, setSelectedVehicleId, triggerEmergencyBrake, releaseEmergencyBrake, isLiveHardware } = useSimulation();

  const activeVehicle = vehicles.find((v) => v.id === selectedVehicleId) || vehicles[0];

  const isSafe = activeVehicle?.status === 'safe';
  const isWarning = activeVehicle?.status === 'warning';
  const isCritical = activeVehicle?.status === 'critical';

  return (
    <div className="flex-1 flex flex-col p-4 bg-[#070e17] overflow-y-auto space-y-4 select-none">
      {/* Vehicle Tab Selector */}
      <div className="space-y-1.5">
        <div className="text-[11px] font-mono font-semibold uppercase tracking-wider text-slate-400 flex items-center justify-between">
          <span>Active Dumpers</span>
          <span className="text-[10px] text-cyan-400 font-normal">Select to inspect</span>
        </div>

        <div className="grid grid-cols-3 gap-2">
          {vehicles.map((v) => {
            const isSelected = selectedVehicleId === v.id;
            const isCrit = v.status === 'critical';
            const isWarn = v.status === 'warning';

            return (
              <button
                key={v.id}
                onClick={() => {
                  setSelectedVehicleId(v.id);
                  soundFx.playClick();
                }}
                className={`py-2 px-2 rounded-lg border text-left transition-all ${
                  isSelected
                    ? 'bg-cyan-950/40 border-cyan-400 shadow-[0_0_12px_rgba(0,240,255,0.2)]'
                    : 'bg-[#0b1622] border-[#162a3c] hover:bg-[#0f1d2c]'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className={`text-xs font-mono font-bold ${isSelected ? 'text-cyan-300' : 'text-slate-200'}`}>
                    {v.id}
                  </span>
                  <span
                    className={`w-2 h-2 rounded-full ${
                      isCrit ? 'bg-red-500 animate-ping' : isWarn ? 'bg-amber-400' : 'bg-emerald-400'
                    }`}
                  />
                </div>
                <div className="text-[10px] font-mono text-slate-400 truncate mt-0.5">
                  {v.id === 'D-03' && isLiveHardware ? 'ESP32 LIVE' : v.operator.split(' ')[0]}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Active Vehicle Status Banner */}
      {activeVehicle && (
        <div
          className={`p-3.5 rounded-xl border flex items-center justify-between transition-all ${
            isCritical
              ? 'bg-red-950/40 border-red-500/70 shadow-[0_0_15px_rgba(239,68,68,0.25)]'
              : isWarning
              ? 'bg-amber-950/30 border-amber-500/50'
              : 'bg-emerald-950/25 border-emerald-500/40'
          }`}
        >
          <div className="flex items-center gap-3">
            {isCritical ? (
              <AlertOctagon className="w-7 h-7 text-red-400 animate-pulse shrink-0" />
            ) : isWarning ? (
              <AlertTriangle className="w-7 h-7 text-amber-400 shrink-0" />
            ) : (
              <ShieldCheck className="w-7 h-7 text-emerald-400 shrink-0" />
            )}
            <div>
              <div className="text-sm font-bold font-mono text-slate-100 flex items-center gap-2">
                {activeVehicle.name}
                <span
                  className={`text-[10px] px-2 py-0.5 rounded font-bold uppercase ${
                    isCritical
                      ? 'bg-red-500 text-white'
                      : isWarning
                      ? 'bg-amber-500 text-black'
                      : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                  }`}
                >
                  {activeVehicle.status}
                </span>
              </div>
              <div className="text-xs text-slate-400 font-mono mt-0.5">
                Operator: <span className="text-slate-200">{activeVehicle.operator}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Core Telemetry Grid (4 Prominent Cards) */}
      {activeVehicle && (
        <div className="grid grid-cols-2 gap-2.5">
          {/* Distance to Obstacle */}
          <div className="bg-[#0b1622] border border-[#172e42] rounded-xl p-3 flex flex-col">
            <span className="text-[11px] font-mono text-slate-400">Distance to Obstacle</span>
            <div className="flex items-baseline gap-1 mt-1">
              <span className={`text-2xl font-black font-mono ${activeVehicle.distanceToObstacle < 5 ? 'text-red-400' : 'text-slate-100'}`}>
                {activeVehicle.distanceToObstacle.toFixed(1)}
              </span>
              <span className="text-xs font-mono text-cyan-400">meters</span>
            </div>
          </div>

          {/* Time To Collision (TTC) */}
          <div
            className={`border rounded-xl p-3 flex flex-col transition-all ${
              isCritical
                ? 'bg-red-950/40 border-red-500/70'
                : isWarning
                ? 'bg-amber-950/30 border-amber-500/50'
                : 'bg-[#0b1622] border-[#172e42]'
            }`}
          >
            <span className="text-[11px] font-mono text-slate-400">Time-To-Collision (TTC)</span>
            <div className="flex items-baseline gap-1 mt-1">
              <span
                className={`text-2xl font-black font-mono ${
                  isCritical ? 'text-red-400' : isWarning ? 'text-amber-400' : 'text-emerald-400'
                }`}
              >
                {activeVehicle.ttc.toFixed(1)}
              </span>
              <span className="text-xs font-mono text-slate-400">seconds</span>
            </div>
          </div>

          {/* Current Speed */}
          <div className="bg-[#0b1622] border border-[#172e42] rounded-xl p-3 flex flex-col">
            <span className="text-[11px] font-mono text-slate-400">Vehicle Speed</span>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="text-2xl font-black font-mono text-slate-100">
                {Math.round(activeVehicle.speed)}
              </span>
              <span className="text-xs font-mono text-cyan-400">km/h</span>
            </div>
          </div>

          {/* Slope / Gradient */}
          <div className="bg-[#0b1622] border border-[#172e42] rounded-xl p-3 flex flex-col">
            <span className="text-[11px] font-mono text-slate-400">Road Grade / Slope</span>
            <div className="flex items-baseline gap-1 mt-1">
              <span className={`text-2xl font-black font-mono ${activeVehicle.slope > 7 ? 'text-amber-400' : 'text-slate-100'}`}>
                {activeVehicle.slope.toFixed(1)}
              </span>
              <span className="text-xs font-mono text-slate-400">%</span>
            </div>
          </div>
        </div>
      )}

      {/* Emergency Intervention / Release Brake Button */}
      {activeVehicle && (
        <div className="pt-1">
          {activeVehicle.engineBrake || activeVehicle.speed === 0 ? (
            <button
              onClick={() => {
                releaseEmergencyBrake(activeVehicle.id);
                soundFx.playClick();
              }}
              className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white font-mono font-bold text-xs rounded-xl shadow-[0_0_15px_rgba(16,185,129,0.4)] flex items-center justify-center gap-2 transition-all"
            >
              <ShieldCheck className="w-4 h-4" />
              RELEASE BRAKE &amp; RESUME TRANSIT ({activeVehicle.id})
            </button>
          ) : (
            <button
              onClick={() => {
                triggerEmergencyBrake(activeVehicle.id);
                soundFx.playCriticalAlert();
              }}
              className="w-full py-3 bg-red-600 hover:bg-red-500 active:bg-red-700 text-white font-mono font-bold text-xs rounded-xl shadow-[0_0_15px_rgba(239,68,68,0.4)] flex items-center justify-center gap-2 transition-all"
            >
              <AlertOctagon className="w-4 h-4" />
              TRIGGER EMERGENCY BRAKE ({activeVehicle.id})
            </button>
          )}
        </div>
      )}

      {/* Active Sensor Status List */}
      <div className="bg-[#09131d] border border-[#152737] rounded-xl p-3 text-[11px] font-mono space-y-2">
        <div className="text-slate-400 font-semibold flex items-center justify-between">
          <span className="flex items-center gap-1.5">
            <Activity className="w-3.5 h-3.5 text-cyan-400" />
            Sensor Telemetry Status
          </span>
          <span className="text-emerald-400 text-[10px]">ALL ACTIVE</span>
        </div>

        <div className="grid grid-cols-3 gap-2 pt-1">
          <div className="bg-[#0b1723] p-1.5 rounded border border-[#162f46] text-center">
            <div className="text-[10px] text-slate-400">ULTRASONIC</div>
            <div className="text-emerald-400 font-bold">ONLINE</div>
          </div>
          <div className="bg-[#0b1723] p-1.5 rounded border border-[#162f46] text-center">
            <div className="text-[10px] text-slate-400">IMU GYRO</div>
            <div className="text-emerald-400 font-bold">ONLINE</div>
          </div>
          <div className="bg-[#0b1723] p-1.5 rounded border border-[#162f46] text-center">
            <div className="text-[10px] text-slate-400">C-V2X RADIO</div>
            <div className="text-cyan-400 font-bold">5.9 GHz</div>
          </div>
        </div>
      </div>
    </div>
  );
};
