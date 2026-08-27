'use client';

import React from 'react';
import { FileBarChart, Download, ShieldCheck, AlertTriangle, TrendingDown, Award, CheckCircle } from 'lucide-react';
import { soundFx } from '@/utils/audio';

export const ReportsView: React.FC = () => {
  return (
    <div className="flex-1 bg-[#060b10] p-6 overflow-y-auto font-sans select-none">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 border-b border-[#142330] pb-4">
        <div>
          <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
            <FileBarChart className="w-5 h-5 text-hud-cyan" />
            Bailadila Haul Road Safety &amp; Collision Prevention Reports
          </h2>
          <p className="text-xs text-slate-400 font-mono mt-1">
            Autonomous Incident Mitigation KPI, Brake Intervention Audit &amp; Monsoon Season Analytics
          </p>
        </div>

        <button
          onClick={() => soundFx.playClick()}
          className="px-4 py-2 bg-[#0c1a26] border border-hud-cyan/40 hover:bg-hud-cyan hover:text-black text-hud-cyan text-xs font-mono font-bold rounded flex items-center gap-2 transition-all shadow-glowCyan"
        >
          <Download className="w-4 h-4" /> EXPORT DGMS SAFETY AUDIT (PDF)
        </button>
      </div>

      {/* KPI Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6 font-mono">
        <div className="bg-[#0a1520] border border-[#172e42] p-4 rounded-xl">
          <div className="text-xs text-slate-400">INCIDENT PREVENTION RATE</div>
          <div className="text-2xl font-bold text-emerald-400 mt-1">99.8%</div>
          <div className="text-[10px] text-slate-500 mt-0.5">&uarr; 34% vs conventional headlights</div>
        </div>

        <div className="bg-[#0a1520] border border-[#172e42] p-4 rounded-xl">
          <div className="text-xs text-slate-400">AVG TTC SAFETY MARGIN</div>
          <div className="text-2xl font-bold text-hud-cyan mt-1">14.2s</div>
          <div className="text-[10px] text-slate-500 mt-0.5">Threshold: &gt; 6.0s</div>
        </div>

        <div className="bg-[#0a1520] border border-[#172e42] p-4 rounded-xl">
          <div className="text-xs text-slate-400">FOG ZONE SPEED COMPLIANCE</div>
          <div className="text-2xl font-bold text-amber-400 mt-1">96.4%</div>
          <div className="text-[10px] text-slate-500 mt-0.5">Speed cap: 20 km/h in fog</div>
        </div>

        <div className="bg-[#0a1520] border border-[#172e42] p-4 rounded-xl">
          <div className="text-xs text-slate-400">AUTONOMOUS BRAKE OVERRIDES</div>
          <div className="text-2xl font-bold text-purple-400 mt-1">3 TODAY</div>
          <div className="text-[10px] text-slate-500 mt-0.5">All 3 potential collisions averted</div>
        </div>
      </div>

      {/* Incident Breakdown Table */}
      <div className="bg-[#0a1520] border border-[#172e42] rounded-xl p-5 mb-6">
        <h3 className="text-sm font-bold text-slate-200 font-mono mb-3">
          Near-Miss &amp; Proximity Interventions Log (Past 24 Hours)
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left font-mono text-xs text-slate-300">
            <thead className="bg-[#070e16] text-slate-400 border-b border-[#142636]">
              <tr>
                <th className="p-2.5">Time</th>
                <th className="p-2.5">Location</th>
                <th className="p-2.5">Vehicles</th>
                <th className="p-2.5">Min TTC</th>
                <th className="p-2.5">Visibility</th>
                <th className="p-2.5">AI Intervention</th>
                <th className="p-2.5">Outcome</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#142636]">
              <tr className="hover:bg-[#0c1824]">
                <td className="p-2.5">17:31:18</td>
                <td className="p-2.5">Zone 3 - Hilltop Bend</td>
                <td className="p-2.5 font-bold text-hud-cyan">D-03 &rarr; D-02</td>
                <td className="p-2.5 text-red-400 font-bold">2.0s</td>
                <td className="p-2.5 text-amber-400">8.6m Fog</td>
                <td className="p-2.5">Retarder Engaged (-12 km/h)</td>
                <td className="p-2.5 text-emerald-400 font-bold">Averted (9.6m gap)</td>
              </tr>
              <tr className="hover:bg-[#0c1824]">
                <td className="p-2.5">14:12:05</td>
                <td className="p-2.5">Zone 3 - Blind Switchback</td>
                <td className="p-2.5 font-bold text-hud-cyan">D-02 &rarr; EX-04</td>
                <td className="p-2.5 text-amber-400 font-bold">3.4s</td>
                <td className="p-2.5 text-amber-400">5.2m Rain</td>
                <td className="p-2.5">In-Cab Audible Alert</td>
                <td className="p-2.5 text-emerald-400 font-bold">Driver decelerated</td>
              </tr>
              <tr className="hover:bg-[#0c1824]">
                <td className="p-2.5">10:48:30</td>
                <td className="p-2.5">Mine Pit North Ramp</td>
                <td className="p-2.5 font-bold text-hud-cyan">D-01 &rarr; LV-01</td>
                <td className="p-2.5 text-slate-300 font-bold">5.8s</td>
                <td className="p-2.5 text-slate-300">18.0m Hazy</td>
                <td className="p-2.5">RFID Geofence Warning</td>
                <td className="p-2.5 text-emerald-400 font-bold">Nominal yield</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
