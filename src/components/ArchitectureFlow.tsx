'use client';

import React, { useState } from 'react';
import { 
  Camera, 
  Radio, 
  CloudRain, 
  Compass, 
  Cpu, 
  ShieldCheck, 
  AlertTriangle, 
  AlertOctagon, 
  UserCheck, 
  Send, 
  CheckCircle, 
  Database, 
  BarChart3, 
  BrainCircuit, 
  Users, 
  Play, 
  RotateCcw
} from 'lucide-react';
import { soundFx } from '@/utils/audio';

export const ArchitectureFlow: React.FC = () => {
  const [simStep, setSimStep] = useState<number>(0);
  const [isRunningSim, setIsRunningSim] = useState<boolean>(false);

  const startPipelineDemo = () => {
    setIsRunningSim(true);
    setSimStep(1);
    soundFx.playBeep(440, 'sine', 0.1);

    const timeouts = [
      setTimeout(() => { setSimStep(2); soundFx.playBeep(550, 'sine', 0.1); }, 1200),
      setTimeout(() => { setSimStep(3); soundFx.playWarning(); }, 2400),
      setTimeout(() => { setSimStep(4); soundFx.playBeep(700, 'sine', 0.1); }, 3600),
      setTimeout(() => { setSimStep(5); soundFx.playBeep(880, 'sine', 0.15); setIsRunningSim(false); }, 4800),
    ];

    return () => timeouts.forEach(clearTimeout);
  };

  return (
    <div className="flex-1 bg-[#060b10] p-6 overflow-y-auto font-sans select-none">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 border-b border-[#142330] pb-4">
        <div>
          <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
            <Cpu className="w-5 h-5 text-hud-cyan" />
            Mine Lander End-to-End System Architecture & Decision Flow
          </h2>
          <p className="text-xs text-slate-400 font-mono mt-1">
            Replicating the 5-Stage Autonomous Detection, Risk Decision Engine, Onboard Execution & Analytics Pipeline
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={startPipelineDemo}
            disabled={isRunningSim}
            className="px-3.5 py-1.5 bg-gradient-to-r from-hud-cyan to-blue-600 hover:from-hud-cyan hover:to-blue-500 text-black font-mono font-bold text-xs rounded shadow-glowCyan flex items-center gap-2 transition-all disabled:opacity-50"
          >
            <Play className="w-3.5 h-3.5" />
            {isRunningSim ? `PIPELINE ACTIVE (STAGE ${simStep}/5)` : 'TEST DECISION PIPELINE'}
          </button>
          <button
            onClick={() => { setSimStep(0); setIsRunningSim(false); }}
            className="p-1.5 bg-[#0c1822] border border-[#162f44] text-slate-400 hover:text-white rounded"
            title="Reset"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Main 5-Stage Horizontal / Grid Layout */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* STAGE 1: MONITOR & DETECT */}
        <div
          className={`bg-[#0a141e] rounded-xl border p-4 transition-all duration-300 ${
            simStep === 1
              ? 'border-hud-cyan shadow-[0_0_16px_rgba(0,240,255,0.3)]'
              : 'border-[#142636]'
          }`}
        >
          <div className="flex items-center justify-between pb-3 border-b border-[#142636] mb-3">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded bg-cyan-950 border border-hud-cyan/40 text-hud-cyan flex items-center justify-center text-xs font-mono font-bold">
                1
              </span>
              <h3 className="text-sm font-bold text-slate-200">MONITOR & DETECT</h3>
            </div>
            <span className="text-[10px] font-mono text-hud-cyan bg-[#0e2130] px-2 py-0.5 rounded">
              EDGE INGEST
            </span>
          </div>

          <div className="space-y-3">
            {/* Real-time Data Collectors */}
            <div className="bg-[#070e16] border border-[#162c3e] rounded-lg p-3">
              <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider block mb-2">
                Real-time Data Sources
              </span>
              <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                <div className="flex items-center gap-1.5 text-slate-300 bg-[#0c1924] p-1.5 rounded">
                  <Camera className="w-3.5 h-3.5 text-hud-cyan" /> Camera (YOLOv9)
                </div>
                <div className="flex items-center gap-1.5 text-slate-300 bg-[#0c1924] p-1.5 rounded">
                  <Radio className="w-3.5 h-3.5 text-amber-400" /> LiDAR / mmWave Radar
                </div>
                <div className="flex items-center gap-1.5 text-slate-300 bg-[#0c1924] p-1.5 rounded">
                  <CloudRain className="w-3.5 h-3.5 text-blue-400" /> Visibility Sensor
                </div>
                <div className="flex items-center gap-1.5 text-slate-300 bg-[#0c1924] p-1.5 rounded">
                  <Compass className="w-3.5 h-3.5 text-emerald-400" /> GNSS & IMU
                </div>
                <div className="flex items-center gap-1.5 text-slate-300 bg-[#0c1924] p-1.5 rounded">
                  <Radio className="w-3.5 h-3.5 text-purple-400" /> RFID Zone ID
                </div>
                <div className="flex items-center gap-1.5 text-slate-300 bg-[#0c1924] p-1.5 rounded">
                  <UserCheck className="w-3.5 h-3.5 text-pink-400" /> Operator Input
                </div>
              </div>
            </div>

            {/* AI & Sensor Fusion Engine */}
            <div className="bg-[#0b1c2b] border border-hud-cyan/40 rounded-lg p-3 relative">
              <div className="flex items-center gap-2 text-hud-cyan font-bold text-xs mb-2">
                <BrainCircuit className="w-4 h-4" /> AI & Sensor Fusion Layer
              </div>
              <ul className="text-xs font-mono text-slate-300 space-y-1 pl-4 list-disc marker:text-hud-cyan">
                <li>360° Low-Light Object Detection</li>
                <li>Fog Density & Road Surface Status</li>
                <li>Dynamic Hazard & Inclination Metric</li>
                <li>Time-To-Collision (TTC) Calculation</li>
              </ul>
            </div>
          </div>
        </div>

        {/* STAGE 2: RISK ANALYSIS & DECISION */}
        <div
          className={`bg-[#0a141e] rounded-xl border p-4 transition-all duration-300 ${
            simStep === 2
              ? 'border-amber-400 shadow-[0_0_16px_rgba(245,158,11,0.3)]'
              : 'border-[#142636]'
          }`}
        >
          <div className="flex items-center justify-between pb-3 border-b border-[#142636] mb-3">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded bg-amber-950 border border-amber-400/40 text-amber-400 flex items-center justify-center text-xs font-mono font-bold">
                2
              </span>
              <h3 className="text-sm font-bold text-slate-200">RISK ANALYSIS & DECISION</h3>
            </div>
            <span className="text-[10px] font-mono text-amber-400 bg-amber-950/40 px-2 py-0.5 rounded">
              DECISION CORE
            </span>
          </div>

          <div className="space-y-3">
            {/* Visibility Evaluation Gate */}
            <div className="bg-[#070e16] border border-[#162c3e] rounded-lg p-3">
              <div className="text-xs font-mono font-bold text-slate-300 mb-2">Visibility Threshold Check</div>
              <div className="flex items-center justify-between gap-2 text-xs font-mono">
                <div className="flex-1 bg-emerald-950/30 border border-emerald-500/40 p-2 rounded text-emerald-400 text-center">
                  &gt; 15m: Nominal
                </div>
                <div className="flex-1 bg-red-950/30 border border-red-500/40 p-2 rounded text-red-400 text-center font-bold">
                  &le; 10m: High Alert
                </div>
              </div>
            </div>

            {/* Risk Assessment Matrix */}
            <div className="bg-[#070e16] border border-[#162c3e] rounded-lg p-3">
              <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
                Multi-Factor Risk Assessment
              </span>
              <div className="grid grid-cols-2 gap-1 text-[11px] font-mono text-slate-300">
                <div className="bg-[#0c1924] p-1.5 rounded">• Object Proximity</div>
                <div className="bg-[#0c1924] p-1.5 rounded">• Road Grade Slope</div>
                <div className="bg-[#0c1924] p-1.5 rounded">• Speed & Closure Rate</div>
                <div className="bg-[#0c1924] p-1.5 rounded">• Weather Severity</div>
              </div>
            </div>

            {/* Risk Level Triage Output */}
            <div className="grid grid-cols-3 gap-2 text-center text-xs font-mono">
              <div className="bg-emerald-950/30 border border-emerald-500/40 p-2 rounded text-emerald-400">
                <div className="font-bold">LOW</div>
                <div className="text-[10px]">Continue</div>
              </div>
              <div className="bg-amber-950/30 border border-amber-500/40 p-2 rounded text-amber-400">
                <div className="font-bold">MEDIUM</div>
                <div className="text-[10px]">Caution / Slow</div>
              </div>
              <div className="bg-red-950/30 border border-red-500/40 p-2 rounded text-red-400">
                <div className="font-bold">HIGH</div>
                <div className="text-[10px]">Stop / Hold</div>
              </div>
            </div>
          </div>
        </div>

        {/* STAGE 3: COMMAND & OPERATOR APPROVAL */}
        <div
          className={`bg-[#0a141e] rounded-xl border p-4 transition-all duration-300 ${
            simStep === 3
              ? 'border-purple-400 shadow-[0_0_16px_rgba(168,85,247,0.3)]'
              : 'border-[#142636]'
          }`}
        >
          <div className="flex items-center justify-between pb-3 border-b border-[#142636] mb-3">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded bg-purple-950 border border-purple-400/40 text-purple-400 flex items-center justify-center text-xs font-mono font-bold">
                3
              </span>
              <h3 className="text-sm font-bold text-slate-200">COMMAND & OPERATOR APPROVAL</h3>
            </div>
            <span className="text-[10px] font-mono text-purple-400 bg-purple-950/40 px-2 py-0.5 rounded">
              CONTROL LOOP
            </span>
          </div>

          <div className="space-y-3">
            {/* Recommended Action */}
            <div className="bg-[#070e16] border border-[#162c3e] rounded-lg p-3">
              <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
                AI Advisory Command
              </span>
              <div className="bg-[#0d1e2e] border border-hud-cyan/30 p-2 rounded text-xs font-mono text-hud-cyan">
                &gt; &quot;Speed reduction to 15 km/h + Retarder active on Hilltop Bend&quot;
              </div>
            </div>

            {/* Approval Gate */}
            <div className="bg-[#070e16] border border-[#162c3e] rounded-lg p-3">
              <div className="text-xs font-mono font-bold text-slate-300 mb-2">Operator Action Decision</div>
              <div className="flex items-center justify-between gap-2 text-xs font-mono">
                <div className="flex-1 bg-[#0c1a26] border border-slate-700 p-2 rounded text-slate-300 text-center">
                  Auto Execute / Approved
                </div>
                <div className="flex-1 bg-purple-950/30 border border-purple-500/40 p-2 rounded text-purple-300 text-center">
                  Manual Driver Override
                </div>
              </div>
            </div>

            {/* Broadcast Command */}
            <div className="bg-[#0c1a26] border border-hud-cyan/30 rounded-lg p-3 flex items-center gap-3">
              <Send className="w-5 h-5 text-hud-cyan shrink-0 animate-pulse" />
              <div className="text-xs font-mono">
                <div className="font-bold text-slate-200">V2V & C-V2X Command Broadcast</div>
                <div className="text-[10px] text-slate-400">Encrypted low-latency telemetry to vehicle CAN-bus</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Row 2: STAGE 4 & STAGE 5 */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mt-6">
        {/* STAGE 4: ONBOARD VALIDATION & EXECUTION */}
        <div
          className={`bg-[#0a141e] rounded-xl border p-4 transition-all duration-300 ${
            simStep === 4
              ? 'border-emerald-400 shadow-[0_0_16px_rgba(16,185,129,0.3)]'
              : 'border-[#142636]'
          }`}
        >
          <div className="flex items-center justify-between pb-3 border-b border-[#142636] mb-3">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded bg-emerald-950 border border-emerald-400/40 text-emerald-400 flex items-center justify-center text-xs font-mono font-bold">
                4
              </span>
              <h3 className="text-sm font-bold text-slate-200">ONBOARD VALIDATION & EXECUTION</h3>
            </div>
            <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/40 px-2 py-0.5 rounded">
              VEHICLE RETARDER
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="bg-[#070e16] border border-[#162c3e] rounded-lg p-3">
              <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider block mb-2">
                Onboard Verification
              </span>
              <ul className="text-xs font-mono text-slate-300 space-y-1">
                <li className="flex items-center gap-1.5"><CheckCircle className="w-3 h-3 text-emerald-400" /> Sensor Health Check</li>
                <li className="flex items-center gap-1.5"><CheckCircle className="w-3 h-3 text-emerald-400" /> Position / Zone Confirm</li>
                <li className="flex items-center gap-1.5"><CheckCircle className="w-3 h-3 text-emerald-400" /> Obstacle Range Validation</li>
              </ul>
            </div>

            <div className="bg-[#070e16] border border-[#162c3e] rounded-lg p-3 flex flex-col justify-between">
              <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider block mb-1">
                Execution Status
              </span>
              <div className="bg-emerald-950/40 border border-emerald-500/40 p-2 rounded text-xs font-mono text-emerald-400 font-bold text-center">
                Command Executed &bull; Retarder Active
              </div>
              <div className="text-[10px] font-mono text-slate-400 mt-2">
                Telemetry feedback piped back to Central Dashboard in 12ms.
              </div>
            </div>
          </div>
        </div>

        {/* STAGE 5: CENTRAL ANALYTICS DASHBOARD */}
        <div
          className={`bg-[#0a141e] rounded-xl border p-4 transition-all duration-300 ${
            simStep === 5
              ? 'border-blue-400 shadow-[0_0_16px_rgba(59,130,246,0.3)]'
              : 'border-[#142636]'
          }`}
        >
          <div className="flex items-center justify-between pb-3 border-b border-[#142636] mb-3">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded bg-blue-950 border border-blue-400/40 text-blue-400 flex items-center justify-center text-xs font-mono font-bold">
                5
              </span>
              <h3 className="text-sm font-bold text-slate-200">CENTRAL ANALYTICS DASHBOARD</h3>
            </div>
            <span className="text-[10px] font-mono text-blue-400 bg-blue-950/40 px-2 py-0.5 rounded">
              LONG-TERM MINE OPS
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-xs font-mono">
            <div className="bg-[#070e16] border border-[#162c3e] rounded-lg p-3">
              <Database className="w-4 h-4 text-hud-cyan mb-1" />
              <div className="font-bold text-slate-200">Data Store</div>
              <div className="text-[10px] text-slate-400 mt-1">High-throughput time-series event archive</div>
            </div>

            <div className="bg-[#070e16] border border-[#162c3e] rounded-lg p-3">
              <BarChart3 className="w-4 h-4 text-amber-400 mb-1" />
              <div className="font-bold text-slate-200">Hazard Analysis</div>
              <div className="text-[10px] text-slate-400 mt-1">Accident trend &amp; near-miss analytics</div>
            </div>

            <div className="bg-[#070e16] border border-[#162c3e] rounded-lg p-3">
              <Users className="w-4 h-4 text-emerald-400 mb-1" />
              <div className="font-bold text-slate-200">Mine Operations</div>
              <div className="text-[10px] text-slate-400 mt-1">Optimized haul road dispatch insights</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
