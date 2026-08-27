'use client';

import React from 'react';
import { useSimulation } from '@/context/SimulationContext';
import { 
  Map, 
  Truck, 
  Camera, 
  Radio, 
  FileText, 
  FileBarChart, 
  GitFork, 
  BookOpen, 
  ChevronRight,
  ShieldCheck
} from 'lucide-react';
import { ActiveTab } from '@/types';
import { soundFx } from '@/utils/audio';

export const Sidebar: React.FC = () => {
  const { activeTab, setActiveTab, vehicles } = useSimulation();

  const navItems: { id: ActiveTab; label: string; icon: React.ReactNode; badge?: number }[] = [
    { id: 'live-map', label: 'Live Map', icon: <Map className="w-4 h-4" /> },
    { id: 'fleet-status', label: 'Fleet Status', icon: <Truck className="w-4 h-4" />, badge: vehicles.length },
    { id: 'cctv-feed', label: 'CCTV / AI Feed', icon: <Camera className="w-4 h-4" /> },
    { id: 'rfid-zones', label: 'RFID Zones', icon: <Radio className="w-4 h-4" /> },
    { id: 'event-log', label: 'Event Log', icon: <FileText className="w-4 h-4" /> },
    { id: 'reports', label: 'Reports', icon: <FileBarChart className="w-4 h-4" /> },
    { id: 'architecture', label: 'System Architecture', icon: <GitFork className="w-4 h-4 text-cyan-400" /> },
    { id: 'user-story', label: 'Bailadila Story', icon: <BookOpen className="w-4 h-4 text-amber-400" /> },
  ];

  return (
    <aside className="w-60 bg-[#070d13] border-r border-[#142330] flex flex-col justify-between py-3 select-none z-20">
      {/* Top Section */}
      <div className="space-y-4">
        {/* Collapse toggle / chevron indicator */}
        <div className="px-4 flex items-center justify-between text-slate-500 hover:text-slate-300 cursor-pointer">
          <span className="text-[10px] font-mono uppercase tracking-widest text-slate-500 font-bold">
            Navigation
          </span>
          <ChevronRight className="w-4 h-4" />
        </div>

        {/* Navigation list */}
        <nav className="space-y-1 px-2">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  soundFx.playClick();
                }}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded text-xs font-semibold tracking-wide transition-all ${
                  isActive
                    ? 'bg-gradient-to-r from-hud-cyan/20 to-transparent border-l-2 border-hud-cyan text-hud-cyan shadow-sm font-bold'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-[#0c1822]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className={isActive ? 'text-hud-cyan glow-text-cyan' : 'text-slate-400'}>
                    {item.icon}
                  </span>
                  <span>{item.label}</span>
                </div>

                {item.badge && (
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-[#102535] text-hud-cyan border border-hud-cyan/30">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom System Status Box */}
      <div className="px-3">
        <div className="bg-[#0a1520] border border-[#173044] rounded-lg p-3 relative overflow-hidden">
          <div className="flex items-center gap-2 mb-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span className="text-[10px] font-mono font-bold tracking-wider text-slate-300 uppercase">
              SYSTEM
            </span>
          </div>

          <div className="flex items-center gap-1.5 text-[11px] text-emerald-400 font-medium mb-2">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>All systems nominal</span>
          </div>

          <div className="border-t border-[#173044] pt-2 flex items-center justify-between text-[9px] font-mono text-slate-400">
            <span>v2.4.1</span>
            <span className="text-hud-cyan">MINE-OPS</span>
          </div>
        </div>
      </div>
    </aside>
  );
};
