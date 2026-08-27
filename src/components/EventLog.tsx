'use client';

import React, { useState } from 'react';
import { useSimulation } from '@/context/SimulationContext';
import { HelpCircle, Download, Trash2, Filter } from 'lucide-react';
import { soundFx } from '@/utils/audio';

export const EventLog: React.FC = () => {
  const { logs, addLog } = useSimulation();
  const [filter, setFilter] = useState<'ALL' | 'CRIT' | 'WARN' | 'INFO'>('ALL');
  const [showHelpModal, setShowHelpModal] = useState(false);

  const filteredLogs = logs.filter((l) => {
    if (filter === 'ALL') return true;
    if (filter === 'CRIT') return l.severity === 'CRITICAL';
    if (filter === 'WARN') return l.severity === 'WARNING';
    if (filter === 'INFO') return l.severity === 'INFO';
    return true;
  });

  const exportLogs = () => {
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      ['Timestamp,Vehicle,Severity,Message']
        .concat(logs.map((l) => `${l.timestamp},${l.vehicleId},${l.severity},"${l.message}"`))
        .join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `fridss_event_log_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="h-28 bg-[#050b11] border-t border-[#142330] px-4 py-2 flex flex-col justify-between select-none z-20">
      {/* Header bar with filters */}
      <div className="flex items-center justify-between border-b border-[#11202d] pb-1">
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-hud-cyan animate-pulse" />
          <span className="text-[11px] font-mono font-bold tracking-wider text-slate-300 uppercase">
            SYSTEM EVENT LOG
          </span>
        </div>

        {/* Severity Filter Toggles matching Image 1 */}
        <div className="flex items-center gap-3 text-[10px] font-mono">
          <button
            onClick={() => { setFilter('ALL'); soundFx.playClick(); }}
            className={`px-1.5 py-0.5 rounded transition-colors ${
              filter === 'ALL' ? 'bg-[#142636] text-white font-bold' : 'text-slate-500 hover:text-slate-300'
            }`}
          >
            ALL
          </button>

          <button
            onClick={() => { setFilter('CRIT'); soundFx.playClick(); }}
            className={`flex items-center gap-1 px-1.5 py-0.5 rounded transition-colors ${
              filter === 'CRIT'
                ? 'bg-red-500/20 text-red-400 font-bold border border-red-500/40'
                : 'text-slate-400 hover:text-red-400'
            }`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
            <span>CRIT</span>
          </button>

          <button
            onClick={() => { setFilter('WARN'); soundFx.playClick(); }}
            className={`flex items-center gap-1 px-1.5 py-0.5 rounded transition-colors ${
              filter === 'WARN'
                ? 'bg-amber-500/20 text-amber-400 font-bold border border-amber-500/40'
                : 'text-slate-400 hover:text-amber-400'
            }`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
            <span>WARN</span>
          </button>

          <button
            onClick={() => { setFilter('INFO'); soundFx.playClick(); }}
            className={`flex items-center gap-1 px-1.5 py-0.5 rounded transition-colors ${
              filter === 'INFO'
                ? 'bg-cyan-500/20 text-hud-cyan font-bold border border-hud-cyan/40'
                : 'text-slate-400 hover:text-hud-cyan'
            }`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-hud-cyan" />
            <span>INFO</span>
          </button>

          {/* Export CSV */}
          <button
            onClick={exportLogs}
            className="p-1 rounded text-slate-400 hover:text-hud-cyan transition-colors"
            title="Export CSV Log"
          >
            <Download className="w-3.5 h-3.5" />
          </button>

          {/* Help Button matching ? icon in Image 1 */}
          <button
            onClick={() => { setShowHelpModal(true); soundFx.playClick(); }}
            className="w-5 h-5 rounded-full bg-[#102130] border border-[#1b374e] text-slate-300 hover:text-hud-cyan flex items-center justify-center text-xs font-mono font-bold"
            title="System Documentation & Diagnostics"
          >
            ?
          </button>
        </div>
      </div>

      {/* Log Feed List */}
      <div className="flex-1 overflow-y-auto space-y-1 font-mono text-[11px] pt-1 pr-1">
        {filteredLogs.map((log) => {
          let badgeColor = 'text-hud-cyan';
          if (log.severity === 'CRITICAL') badgeColor = 'text-red-400 font-extrabold';
          else if (log.severity === 'WARNING') badgeColor = 'text-amber-400 font-bold';

          return (
            <div
              key={log.id}
              className="flex items-center gap-3 py-0.5 hover:bg-[#0c1822] rounded px-1 transition-colors"
            >
              <span className="text-slate-500 text-[10px] shrink-0">{log.timestamp}</span>
              <span className="text-slate-200 font-bold shrink-0">{log.vehicleId}</span>
              <span className={`shrink-0 ${badgeColor}`}>{log.severity}</span>
              <span className="text-slate-300 truncate">{log.message}</span>
            </div>
          );
        })}
      </div>

      {/* Help Modal */}
      {showHelpModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#0a1520] border border-hud-cyan/50 rounded-xl p-6 max-w-xl w-full font-mono text-slate-300 shadow-2xl relative">
            <h3 className="text-lg font-bold text-hud-cyan mb-2 flex items-center gap-2">
              <HelpCircle className="w-5 h-5" /> FRIDSS Safety Telemetry Diagnostics
            </h3>
            <p className="text-xs text-slate-400 mb-4">
              Fleet Risk & Intelligent Detection Safety System (FRIDSS) designed for Bailadila Iron Ore Mines haul road navigation under low visibility / monsoon conditions.
            </p>
            <div className="space-y-2 text-xs">
              <div className="bg-[#050b11] p-2.5 rounded border border-[#172e42]">
                <span className="text-hud-cyan font-bold">V2V (Vehicle-to-Vehicle) Link:</span> 5.9 GHz C-V2X direct radio packets exchanging GPS, IMU slope inclination, and forward speed at 50Hz.
              </div>
              <div className="bg-[#050b11] p-2.5 rounded border border-[#172e42]">
                <span className="text-amber-400 font-bold">TTC (Time-To-Collision):</span> Dynamic algorithm calculating closure rate vs vehicle braking distance under varying road grade slopes.
              </div>
              <div className="bg-[#050b11] p-2.5 rounded border border-[#172e42]">
                <span className="text-red-400 font-bold">Autonomous Override:</span> Engages retarder / electromagnetic brake when TTC &lt; 2.5s and driver response time exceeds threshold.
              </div>
            </div>
            <div className="mt-5 flex justify-end">
              <button
                onClick={() => setShowHelpModal(false)}
                className="px-4 py-1.5 bg-hud-cyan text-black font-bold text-xs rounded hover:bg-hud-cyan/80 transition-colors"
              >
                CLOSE
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
