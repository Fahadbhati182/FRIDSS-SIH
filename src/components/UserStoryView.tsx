'use client';

import React, { useState } from 'react';
import { 
  CloudRain, 
  Truck, 
  EyeOff, 
  ShieldCheck, 
  Radio, 
  AlertOctagon, 
  CheckCircle2, 
  Sparkles,
  ArrowRight,
  User,
  MapPin,
  Flame
} from 'lucide-react';
import { soundFx } from '@/utils/audio';

export const UserStoryView: React.FC = () => {
  const [activeStoryStep, setActiveStoryStep] = useState<number>(0);

  const storySteps = [
    {
      id: 1,
      title: 'Raman at Bailadila Iron Ore Mines',
      role: 'Heavy Mining Hauler Operator',
      location: 'Bailadila Complex, Deposit 14 / 11C',
      description:
        'Raman is a frontline haul truck operator in the Bailadila Iron Ore Mines, tasked with hauling 160-ton payload ore trucks down steep, winding mountain roads from high-altitude loading pits to processing plants.',
      badge: 'MINE WORKER SCENARIO',
      badgeColor: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30',
      icon: <User className="w-8 h-8 text-cyan-400" />,
      detailHighlight: 'Hauls up to 12 cycles per 8-hour shift along steep 8.5% downhill haul roads.',
    },
    {
      id: 2,
      title: 'Monsoon Fog & Extreme Visibility Drop',
      role: 'Hazardous Atmospheric Condition',
      location: 'Blind Hilltop S-Curves',
      description:
        'During the peak monsoon season in the dense valley hills, sudden cloud inversions reduce road visibility to just 3 to 5 meters. At 25 km/h, a loaded 160t truck requires at least 45 meters of braking distance.',
      badge: 'CRITICAL ENVIRONMENTAL RISK',
      badgeColor: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
      icon: <CloudRain className="w-8 h-8 text-amber-400" />,
      detailHighlight: 'Visibility drops to 3-5m — impossible for human vision to spot stationary or oncoming haulers.',
    },
    {
      id: 3,
      title: 'The Blind Corner Threat',
      role: 'Pre-FRIDSS Vulnerability',
      location: 'Zone 3 — Hilltop Ascent',
      description:
        'Raman cannot see oncoming vehicles rounding the switchback bend or clearly judge road grade. Another dumper (D-02) slowed down due to a rockfall ahead, creating an imminent collision trap in the zero-visibility fog.',
      badge: 'IMMINENT DANGER',
      badgeColor: 'bg-red-500/10 text-red-400 border-red-500/30',
      icon: <EyeOff className="w-8 h-8 text-red-400" />,
      detailHighlight: 'Without smart telemetry, blind-bend collisions are the #1 cause of catastrophic mining haul road accidents.',
    },
    {
      id: 4,
      title: 'FRIDSS Intelligent Safety System Active',
      role: 'Autonomous Detection & Sensor Fusion',
      location: 'Onboard DUMPER-03 (D-089)',
      description:
        'Raman’s dumper is equipped with FRIDSS: an AI vision camera running fog-penetration YOLO models, high-frequency mmWave radar penetrating water vapor, 6-axis IMU slope sensors, and 5.9 GHz V2V radio mesh.',
      badge: 'AI DEFENSE LAYER',
      badgeColor: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
      icon: <Radio className="w-8 h-8 text-emerald-400" />,
      detailHighlight: 'LiDAR & Radar detect Dumper-02 through the fog at 88.4 meters despite zero human eye visibility.',
    },
    {
      id: 5,
      title: 'Real-Time V2V Assessment & Autonomous Warning',
      role: 'Collision Avoidance in Action',
      location: 'Closure Rate Calculation',
      description:
        'The system cross-references GPS location, vehicle heading, and closure velocity (4.7 m/s) on the 8.3% slope. Calculating TTC = 2.0s, the in-cab display flashes a high-intensity audio-visual warning and primes the hydraulic retarder brake.',
      badge: 'DECISION & EXECUTION',
      badgeColor: 'bg-purple-500/10 text-purple-400 border-purple-500/30',
      icon: <AlertOctagon className="w-8 h-8 text-purple-400" />,
      detailHighlight: 'Autonomous engine brake engages, decelerating from 24 km/h to 10 km/h smoothly.',
    },
    {
      id: 6,
      title: 'Collision Averted & Central Control Synchronization',
      role: 'Safe Mine Operations',
      location: 'Central Control Center Feed',
      description:
        'Raman brings the vehicle to a safe, controlled speed with a safe 9.6m buffer distance from Dumper-02. The Central Control Center instantly logs the averted incident, updates weather advisory, and mine operations continue without harm.',
      badge: 'MISSION ACCOMPLISHED',
      badgeColor: 'bg-hud-cyan/10 text-hud-cyan border-hud-cyan/30',
      icon: <CheckCircle2 className="w-8 h-8 text-hud-cyan" />,
      detailHighlight: 'Zero collision, zero injuries, zero ore transport downtime. Raman completes his shift safely.',
    },
  ];

  return (
    <div className="flex-1 bg-[#060b10] p-6 overflow-y-auto font-sans select-none">
      {/* Title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 border-b border-[#142330] pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-500/20 text-amber-400 border border-amber-500/40">
              SMART INDIA HACKATHON USE-CASE
            </span>
            <span className="text-xs font-mono text-slate-400 flex items-center gap-1">
              <MapPin className="w-3 h-3 text-red-400" /> Bailadila Iron Ore Mines, Chhattisgarh
            </span>
          </div>
          <h2 className="text-xl font-bold text-slate-100 mt-1">
            Operator Raman&apos;s Story: Preventing Haul Road Collisions in Dense Monsoon Fog
          </h2>
        </div>

        {/* Step Progression indicator */}
        <div className="flex items-center gap-1.5 bg-[#0a1520] border border-[#173044] p-1.5 rounded-lg">
          {storySteps.map((s, idx) => (
            <button
              key={s.id}
              onClick={() => {
                setActiveStoryStep(idx);
                soundFx.playClick();
              }}
              className={`w-7 h-7 rounded text-xs font-mono font-bold transition-all ${
                activeStoryStep === idx
                  ? 'bg-hud-cyan text-black shadow-glowCyan'
                  : 'text-slate-400 hover:text-white hover:bg-[#122434]'
              }`}
            >
              {idx + 1}
            </button>
          ))}
        </div>
      </div>

      {/* Featured Story Step Display */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Main Step Card */}
        <div className="lg:col-span-8 bg-[#0a1520] border border-[#162d40] rounded-xl p-6 relative overflow-hidden flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className={`px-2.5 py-1 rounded text-xs font-mono font-bold border ${storySteps[activeStoryStep].badgeColor}`}>
                {storySteps[activeStoryStep].badge}
              </span>
              <span className="text-xs font-mono text-slate-400">
                Step {activeStoryStep + 1} of {storySteps.length}
              </span>
            </div>

            <div className="flex items-start gap-4">
              <div className="p-3 bg-[#060c12] border border-[#152a3a] rounded-xl shrink-0">
                {storySteps[activeStoryStep].icon}
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-100">
                  {storySteps[activeStoryStep].title}
                </h3>
                <div className="text-xs font-mono text-hud-cyan mt-0.5">
                  {storySteps[activeStoryStep].role} &bull; {storySteps[activeStoryStep].location}
                </div>
              </div>
            </div>

            <p className="text-sm text-slate-300 leading-relaxed font-normal bg-[#070e16] p-4 rounded-lg border border-[#132534]">
              {storySteps[activeStoryStep].description}
            </p>

            <div className="bg-[#0b1c2b] border border-hud-cyan/30 rounded-lg p-3 text-xs font-mono text-hud-cyan flex items-center gap-2">
              <Sparkles className="w-4 h-4 shrink-0" />
              <span>{storySteps[activeStoryStep].detailHighlight}</span>
            </div>
          </div>

          {/* Navigation Controls */}
          <div className="flex items-center justify-between pt-6 border-t border-[#142636] mt-6">
            <button
              onClick={() => {
                setActiveStoryStep((prev) => Math.max(0, prev - 1));
                soundFx.playClick();
              }}
              disabled={activeStoryStep === 0}
              className="px-4 py-2 bg-[#0c1824] border border-[#173044] hover:bg-[#122434] text-slate-300 text-xs font-mono font-semibold rounded disabled:opacity-30"
            >
              &larr; Previous Stage
            </button>

            <button
              onClick={() => {
                setActiveStoryStep((prev) => Math.min(storySteps.length - 1, prev + 1));
                soundFx.playClick();
              }}
              disabled={activeStoryStep === storySteps.length - 1}
              className="px-5 py-2 bg-hud-cyan text-black hover:bg-hud-cyan/80 text-xs font-mono font-bold rounded flex items-center gap-1.5 shadow-glowCyan disabled:opacity-30"
            >
              <span>Next Stage</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Side Comparison: Without FRIDSS vs With FRIDSS */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-[#120808] border border-red-900/50 rounded-xl p-4">
            <div className="flex items-center gap-2 text-red-400 font-bold text-xs font-mono uppercase mb-2">
              <AlertOctagon className="w-4 h-4" /> Traditional Haul Operations (Risk)
            </div>
            <ul className="text-xs font-mono text-slate-300 space-y-2">
              <li className="text-red-200/80">• Human driver relying only on headlights (penetration &lt; 5m in dense fog)</li>
              <li className="text-red-200/80">• Zero awareness of stalled vehicles behind blind hairpin turns</li>
              <li className="text-red-200/80">• Delayed braking response leading to catastrophic 160-ton truck pileups</li>
            </ul>
          </div>

          <div className="bg-[#051614] border border-emerald-900/50 rounded-xl p-4">
            <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs font-mono uppercase mb-2">
              <ShieldCheck className="w-4 h-4" /> With FRIDSS Active (Zero Accidents)
            </div>
            <ul className="text-xs font-mono text-slate-300 space-y-2">
              <li className="text-emerald-200/80">• YOLO + mmWave radar detection penetrates monsoon fog at 100m+</li>
              <li className="text-emerald-200/80">• 50Hz V2V direct mesh syncs speed, inclination, and brake intent</li>
              <li className="text-emerald-200/80">• Automatic retarder braking activates before driver reaction limit</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
