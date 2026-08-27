'use client';

import React from 'react';
import { useSimulation } from '@/context/SimulationContext';
import { Radio, Signal, Clock, MapPin, CheckCircle } from 'lucide-react';
import { soundFx } from '@/utils/audio';

export const RfidFullView: React.FC = () => {
  const { zones, setSelectedVehicleId, setActiveTab } = useSimulation();

  return (
    <div className="flex-1 bg-[#060b10] p-6 overflow-y-auto font-sans select-none">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 border-b border-[#142330] pb-4">
        <div>
          <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
            <Radio className="w-5 h-5 text-hud-cyan" />
            Active Ultra-High-Frequency (UHF) RFID Zone Tracking
          </h2>
          <p className="text-xs text-slate-400 font-mono mt-1">
            Haul Road Gateways, Dwell-Time Compliance, In-Pit Geofencing &amp; V2X Beacons
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {zones.map((zone) => (
          <div key={zone.id} className="bg-[#0a1520] border border-[#172e42] rounded-xl p-5 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-[#142636] mb-3">
                <div>
                  <h3 className="text-sm font-bold text-hud-cyan font-mono">{zone.name}</h3>
                  <div className="text-xs text-slate-400 font-mono flex items-center gap-1 mt-0.5">
                    <MapPin className="w-3 h-3 text-slate-500" /> {zone.location}
                  </div>
                </div>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                  ANTENNA ONLINE
                </span>
              </div>

              <div className="space-y-3">
                <div className="text-xs font-mono text-slate-400">
                  Current Occupancy: <span className="font-bold text-white">{zone.activeVehicles.length} Haulers</span>
                </div>

                {zone.activeVehicles.length > 0 ? (
                  <div className="space-y-2">
                    {zone.activeVehicles.map((occ) => (
                      <div
                        key={occ.vehicleId}
                        onClick={() => {
                          setSelectedVehicleId(occ.vehicleId === 'DUMPER-01' ? 'D-01' : occ.vehicleId === 'DUMPER-02' ? 'D-02' : 'D-03');
                          setActiveTab('live-map');
                          soundFx.playClick();
                        }}
                        className="bg-[#060d14] border border-[#142636] hover:border-hud-cyan/50 p-3 rounded-lg cursor-pointer transition-all"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-slate-100 font-mono">{occ.vehicleId}</span>
                          <span className="text-[10px] font-bold text-hud-cyan font-mono bg-cyan-950 px-1.5 py-0.5 rounded">
                            {occ.status}
                          </span>
                        </div>
                        <div className="text-xs text-slate-400 font-mono mt-1">Operator: {occ.operator}</div>
                        <div className="text-[10px] text-slate-500 font-mono mt-1 flex items-center gap-1">
                          <Clock className="w-3 h-3" /> Checked in since {occ.since}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-xs font-mono text-slate-500 italic py-4 text-center bg-[#070e16] rounded border border-dashed border-[#142636]">
                    Zone clear. No haulers currently in sector.
                  </div>
                )}
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-[#142636] flex items-center justify-between text-xs font-mono text-slate-400">
              <span>Reader Model: Alien ALR-F800</span>
              <span className="text-emerald-400 flex items-center gap-1"><Signal className="w-3 h-3" /> 915 MHz Active</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
