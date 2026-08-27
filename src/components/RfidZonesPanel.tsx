'use client';

import React from 'react';
import { useSimulation } from '@/context/SimulationContext';
import { Radio, Signal, Clock, ChevronRight } from 'lucide-react';
import { soundFx } from '@/utils/audio';

export const RfidZonesPanel: React.FC = () => {
  const { zones, setSelectedVehicleId } = useSimulation();

  return (
    <div className="bg-[#070e16] border-t border-[#142330] p-3 select-none">
      {/* Panel Header */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-1.5 text-hud-cyan font-mono text-xs font-bold">
          <Radio className="w-3.5 h-3.5" />
          <span>RFID ZONES</span>
        </div>
        <span className="text-[10px] font-mono text-slate-400">3 active</span>
      </div>

      {/* Zones List */}
      <div className="space-y-2 max-h-48 overflow-y-auto">
        {zones.map((zone) => (
          <div key={zone.id} className="bg-[#09141f] border border-[#142636] rounded p-2 text-[11px] font-mono">
            {/* Zone Title */}
            <div className="text-hud-cyan font-bold text-[10px] tracking-wider mb-1.5 flex items-center justify-between">
              <span>{zone.name}</span>
              <span className="text-slate-500 text-[9px]">{zone.location}</span>
            </div>

            {/* Vehicle occupancy in zone */}
            {zone.activeVehicles.length > 0 ? (
              <div className="space-y-1.5">
                {zone.activeVehicles.map((occ) => (
                  <div
                    key={occ.vehicleId}
                    onClick={() => {
                      setSelectedVehicleId(occ.vehicleId === 'DUMPER-01' ? 'D-01' : occ.vehicleId === 'DUMPER-02' ? 'D-02' : 'D-03');
                      soundFx.playClick();
                    }}
                    className="flex items-center justify-between bg-[#060c12] border border-[#11202d] hover:border-hud-cyan/40 p-1.5 rounded cursor-pointer transition-colors"
                  >
                    <div className="flex flex-col">
                      <div className="font-bold text-slate-200">{occ.vehicleId}</div>
                      <div className="text-[9px] text-slate-400">{occ.operator}</div>
                    </div>

                    <div className="flex items-center gap-2">
                      <div className="flex flex-col items-end">
                        <span
                          className={`text-[9px] font-bold px-1.5 py-0.2 rounded border ${
                            occ.status === 'IN ZONE'
                              ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                              : 'bg-cyan-500/10 border-cyan-500/30 text-hud-cyan'
                          }`}
                        >
                          {occ.status}
                        </span>
                        <span className="text-[8px] text-slate-500 flex items-center gap-0.5 mt-0.5">
                          <Clock className="w-2.5 h-2.5" /> since {occ.since}
                        </span>
                      </div>

                      {/* Signal Strength bars */}
                      <div className="flex items-end gap-0.5 h-3.5">
                        <span className="w-1 h-1 bg-hud-cyan rounded-xs" />
                        <span className="w-1 h-2 bg-hud-cyan rounded-xs" />
                        <span className="w-1 h-2.5 bg-hud-cyan rounded-xs" />
                        <span className="w-1 h-3.5 bg-hud-cyan rounded-xs" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-[9px] text-slate-500 italic py-1">No vehicles in zone</div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
