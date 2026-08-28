import { NextRequest, NextResponse } from 'next/server';
import { VehicleTelemetry, WeatherTelemetry } from '@/types';

// In-memory store for live telemetry from Python Gateway
interface TelemetryStore {
  vehicles: Record<string, { data: Partial<VehicleTelemetry>; timestamp: number }>;
  weather?: { data: Partial<WeatherTelemetry>; timestamp: number };
  lastUpdated: number;
}

// Global reference so it persists across hot-reloads in Next.js development
declare global {
  // eslint-disable-next-line no-var
  var __telemetryStore: TelemetryStore | undefined;
}

if (!globalThis.__telemetryStore) {
  globalThis.__telemetryStore = {
    vehicles: {},
    lastUpdated: 0,
  };
}

const store = globalThis.__telemetryStore;

// GET: Dashboard polls or fetches latest hardware telemetry
export async function GET() {
  const now = Date.now();
  // Filter vehicles received in the last 6 seconds
  const activeVehicles: Partial<VehicleTelemetry>[] = [];

  for (const [id, entry] of Object.entries(store.vehicles)) {
    if (now - entry.timestamp <= 6000) {
      activeVehicles.push(entry.data);
    }
  }

  const isLive = activeVehicles.length > 0 || (store.weather && (now - store.weather.timestamp <= 6000));

  return NextResponse.json({
    success: true,
    isLive,
    lastUpdated: store.lastUpdated,
    vehicles: activeVehicles,
    weather: store.weather && (now - store.weather.timestamp <= 6000) ? store.weather.data : null,
  });
}

// POST: Python gateway posts sensor & vehicle telemetry
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const now = Date.now();

    // Check if it's weather telemetry
    if (body.humidity !== undefined || body.vhi !== undefined) {
      store.weather = {
        data: body,
        timestamp: now,
      };
      store.lastUpdated = now;
      return NextResponse.json({ success: true, message: 'Weather telemetry updated' });
    }

    // Single Vehicle Telemetry
    if (body.id) {
      store.vehicles[body.id] = {
        data: body,
        timestamp: now,
      };
      store.lastUpdated = now;
      return NextResponse.json({ 
        success: true, 
        message: `Vehicle ${body.id} telemetry updated`, 
        vehicleId: body.id 
      });
    }

    // Array of Vehicles Telemetry
    if (Array.isArray(body)) {
      for (const v of body) {
        if (v.id) {
          store.vehicles[v.id] = {
            data: v,
            timestamp: now,
          };
        }
      }
      store.lastUpdated = now;
      return NextResponse.json({ 
        success: true, 
        message: `Updated ${body.length} vehicles telemetry` 
      });
    }

    return NextResponse.json({ success: false, error: 'Invalid payload structure' }, { status: 400 });
  } catch (error) {
    return NextResponse.json({ success: false, error: (error as Error).message }, { status: 500 });
  }
}
