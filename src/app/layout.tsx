import type { Metadata } from 'next';
import './globals.css';
import { SimulationProvider } from '@/context/SimulationContext';

export const metadata: Metadata = {
  title: 'FRIDSS Control Center | Mining Safety & Fleet Risk Detection',
  description:
    'Fleet Risk & Intelligent Detection Safety System (FRIDSS) for low visibility open-cast mine haul roads. Autonomous collision avoidance, V2V telemetry, and sensor fusion.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-[#060b10] text-slate-100 antialiased overflow-hidden">
        <SimulationProvider>{children}</SimulationProvider>
      </body>
    </html>
  );
}
