'use client';

import React, { useState } from 'react';
import { useSimulation } from '@/context/SimulationContext';
import { Radio, Signal, Clock, ChevronUp, ChevronDown, Eye, EyeOff } from 'lucide-react';
import { soundFx } from '@/utils/audio';

export const RfidZonesPanel: React.FC = () => {
  const { zones, setSelectedVehicleId } = useSimulation();
  const [isExpanded, setIsExpanded] = useState<boolean>(true);

  const totalOccupancy = zones.reduce((acc, z) => acc + z.activeVehicles.length, 0);

  return (
    <div className="bg-[#070e16] border-t border-[#142330] select-none transition-all duration-300">
      {/* Clickable Header with Toggle */}
      <button
        onClick={() => {
          setIsExpanded(!isExpanded);
          soundFx.playClick();
        }}
        className="w-full px-3.5 py-2.5 flex items-center justify-between hover:bg-[#0b1622] transition-colors group cursor-pointer"
      >
        <div className="flex items-center gap-2 text-cyan-400 font-mono text-xs font-bold">
          <Radio className="w-3.5 h-3.5 animate-pulse" />
          <span>RFID ZONES</span>
          <span className="text-[10px] text-slate-400 font-normal ml-1">
            ({totalOccupancy} vehicles in {zones.length} zones)
          </span>
        </div>

        <div className="flex items-center gap-1.5 text-[10px] font-mono text-slate-400 group-hover:text-cyan-300">
          <span>{isExpanded ? 'Hide' : 'Show'}</span>
          {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
        </div>
      </button>

      {/* Collapsible Zones Content */}
      {isExpanded && (
        <div className="p-3 pt-0 space-y-2 max-h-56 overflow-y-auto transition-all duration-300">
          {zones.map((zone) => (
            <div key={zone.id} className="bg-[#09141f] border border-[#142636] rounded-lg p-2 text-[11px] font-mono">
              {/* Zone Title */}
              <div className="text-cyan-400 font-bold text-[10px] tracking-wider mb-1.5 flex items-center justify-between">
                <span>{zone.name}</span>
                <span className="text-slate-400 text-[9px]">{zone.location}</span>
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
                      className="flex items-center justify-between bg-[#060c12] border border-[#11202d] hover:border-cyan-400/50 p-2 rounded-md cursor-pointer transition-colors"
                    >
                      <div className="flex flex-col">
                        <div className="font-bold text-slate-100">{occ.vehicleId}</div>
                        <div className="text-[9px] text-slate-400">{occ.operator}</div>
                      </div>

                      <div className="flex items-center gap-2">
                        <div className="flex flex-col items-end">
                          <span
                            className={`text-[9px] font-bold px-1.5 py-0.5 rounded border ${
                              occ.status === 'IN ZONE'
                                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                                : 'bg-cyan-500/10 border-cyan-500/30 text-cyan-400'
                            }`}
                          >
                            {occ.status}
                          </span>
                          <span className="text-[8px] text-slate-500 flex items-center gap-0.5 mt-0.5">
                            <Clock className="w-2.5 h-2.5" /> since {occ.since}
                          </span>
                        </div>

                        {/* Signal Strength bars */}
                        <div className="flex items-end gap-0.5 h-3.5 pl-1">
                          <span className="w-1 h-1 bg-cyan-400 rounded-xs" />
                          <span className="w-1 h-2 bg-cyan-400 rounded-xs" />
                          <span className="w-1 h-2.5 bg-cyan-400 rounded-xs" />
                          <span className="w-1 h-3.5 bg-cyan-400 rounded-xs" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-[10px] text-slate-500 italic py-1">No vehicles in zone</div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
