'use client';

import React from 'react';
import { useSimulation } from '@/context/SimulationContext';
import { Header } from '@/components/Header';
import { Sidebar } from '@/components/Sidebar';
import { LiveMap } from '@/components/LiveMap';
import { AIVisionCCTV } from '@/components/AIVisionCCTV';
import { TelemetryCards } from '@/components/TelemetryCards';
import { RfidZonesPanel } from '@/components/RfidZonesPanel';
import { EventLog } from '@/components/EventLog';
import { ArchitectureFlow } from '@/components/ArchitectureFlow';
import { UserStoryView } from '@/components/UserStoryView';
import { FleetStatusView } from '@/components/FleetStatusView';
import { CctvFullView } from '@/components/CctvFullView';
import { RfidFullView } from '@/components/RfidFullView';
import { ReportsView } from '@/components/ReportsView';

export default function Home() {
  const { activeTab } = useSimulation();

  return (
    <div className="flex flex-col h-screen w-screen bg-[#060b10] text-slate-100 overflow-hidden select-none">
      {/* Top Tactical Status Bar */}
      <Header />

      {/* Main Content Area */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Navigation Bar */}
        <Sidebar />

        {/* Dynamic Center/Right Area */}
        {activeTab === 'live-map' && (
          <div className="flex flex-1 overflow-hidden">
            {/* Center Live SVG/Canvas Map */}
            <LiveMap />

            {/* Right Side Tactical HUD Panels */}
            <div className="w-[380px] xl:w-[420px] bg-[#070e16] flex flex-col h-full overflow-y-auto border-l border-[#142330]">
              {/* Top: CCTV AI Vision Panel */}
              <AIVisionCCTV />

              {/* Middle: Vehicle Telemetry Cards */}
              <TelemetryCards />

              {/* Bottom: RFID Zones summary */}
              <RfidZonesPanel />
            </div>
          </div>
        )}

        {activeTab === 'fleet-status' && <FleetStatusView />}
        {activeTab === 'cctv-feed' && <CctvFullView />}
        {activeTab === 'rfid-zones' && <RfidFullView />}
        {activeTab === 'architecture' && <ArchitectureFlow />}
        {activeTab === 'user-story' && <UserStoryView />}
        {activeTab === 'reports' && <ReportsView />}
        {activeTab === 'event-log' && (
          <div className="flex-1 flex flex-col p-6 bg-[#060b10] overflow-hidden">
            <h2 className="text-xl font-bold text-slate-100 font-mono mb-4">
              Real-Time C-V2X &amp; Sensor Telemetry Log Stream
            </h2>
            <div className="flex-1 bg-[#09141f] border border-[#142636] rounded-xl p-4 overflow-hidden">
              <EventLog />
            </div>
          </div>
        )}
      </div>

      {/* Persistent Bottom System Event Log */}
      {/* {activeTab !== 'event-log' && <EventLog />} */}
    </div>
  );
}
