'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { VehicleTelemetry, RfidZone, EventLogEntry, WeatherTelemetry, ActiveTab } from '@/types';
import { soundFx } from '@/utils/audio';

interface SimulationContextType {
  vehicles: VehicleTelemetry[];
  selectedVehicleId: string;
  setSelectedVehicleId: (id: string) => void;
  selectedVehicle: VehicleTelemetry | undefined;
  zones: RfidZone[];
  logs: EventLogEntry[];
  weather: WeatherTelemetry;
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  isPlaying: boolean;
  setIsPlaying: (playing: boolean) => void;
  simSpeed: number;
  setSimSpeed: (speed: number) => void;
  isMuted: boolean;
  setIsMuted: (muted: boolean) => void;
  systemTime: string;
  systemDate: string;
  triggerEmergencyBrake: (vehicleId: string) => void;
  releaseEmergencyBrake: (vehicleId: string) => void;
  applyScenario: (scenario: 'nominal' | 'fog_surge' | 'collision_risk' | 'slope_hazard') => void;
  addLog: (severity: 'CRITICAL' | 'WARNING' | 'INFO', vehicleId: string, message: string) => void;
  aiFogFilterActive: boolean;
  setAiFogFilterActive: (active: boolean) => void;
  cctvPreset: 'CAM-03 HILLTOP' | 'CAM-01 PIT ENTRY' | 'CAM-05 BEND APEX';
  setCctvPreset: (preset: 'CAM-03 HILLTOP' | 'CAM-01 PIT ENTRY' | 'CAM-05 BEND APEX') => void;
  isLiveHardware: boolean;
}

const initialVehicles: VehicleTelemetry[] = [
  {
    id: 'D-01',
    name: 'DUMPER-01',
    callsign: 'D-01',
    operator: 'J. Makarov',
    operatorCode: 'D-441',
    status: 'safe',
    speed: 24,
    maxSpeed: 40,
    heading: 48,
    slope: 2.5,
    distanceToObstacle: 88.4,
    relativeVelocity: 0.3,
    ttc: 18.4,
    activeZoneId: 'zone-1',
    activeZoneName: 'Loading Bay Alpha',
    zoneStatus: 'IN ZONE',
    zoneSince: '09:47:12',
    payload: 142.5,
    fuelLevel: 84,
    engineBrake: false,
    sensors: { vis: true, ir: true, gps: true, imu: true, rfid: true, lidar: true },
    pathProgress: 0.18,
    direction: 1,
  },
  {
    id: 'D-02',
    name: 'DUMPER-02',
    callsign: 'D-02',
    operator: 'T. Nkosi',
    operatorCode: 'D-238',
    status: 'warning',
    speed: 19,
    maxSpeed: 40,
    heading: 92,
    slope: 6.1,
    distanceToObstacle: 14.8,
    relativeVelocity: 2.4,
    ttc: 9.6,
    activeZoneId: 'zone-3',
    activeZoneName: 'Hilltop Bend',
    zoneStatus: 'TRANSIT',
    zoneSince: '10:14:55',
    payload: 156.0,
    fuelLevel: 68,
    engineBrake: true,
    sensors: { vis: true, ir: true, gps: true, imu: true, rfid: true, lidar: true },
    pathProgress: 0.65,
    direction: 1,
    v2vTargetId: 'D-03',
  },
  {
    id: 'D-03',
    name: 'DUMPER-03',
    callsign: 'D-03',
    operator: 'R. Raman',
    operatorCode: 'D-089',
    status: 'critical',
    speed: 12,
    maxSpeed: 35,
    heading: 115,
    slope: 8.3,
    distanceToObstacle: 9.6,
    relativeVelocity: 4.7,
    ttc: 2.0,
    activeZoneId: 'zone-3',
    activeZoneName: 'Hilltop Bend',
    zoneStatus: 'TRANSIT',
    zoneSince: '10:18:02',
    payload: 160.0,
    fuelLevel: 55,
    engineBrake: true,
    sensors: { vis: true, ir: true, gps: true, imu: true, rfid: true, lidar: true },
    pathProgress: 0.72,
    direction: 1,
    v2vTargetId: 'D-02',
  },
];

const initialZones: RfidZone[] = [
  {
    id: 'zone-1',
    name: 'ZONE 1 — LOADING BAY ALPHA',
    location: 'Mine Pit North',
    activeVehicles: [
      {
        vehicleId: 'DUMPER-01',
        operator: 'J. Makarov',
        status: 'IN ZONE',
        since: '09:47:12',
        signalStrength: 5,
      },
    ],
  },
  {
    id: 'zone-3',
    name: 'ZONE 3 — HILLTOP BEND',
    location: 'Blind Ascent S-Curve',
    activeVehicles: [
      {
        vehicleId: 'DUMPER-02',
        operator: 'T. Nkosi',
        status: 'TRANSIT',
        since: '10:14:55',
        signalStrength: 4,
      },
      {
        vehicleId: 'DUMPER-03',
        operator: 'R. Raman',
        status: 'TRANSIT',
        since: '10:18:02',
        signalStrength: 4,
      },
    ],
  },
  {
    id: 'zone-4',
    name: 'ZONE 4 — WASTE DUMP APEX',
    location: 'Overburden Dump 02',
    activeVehicles: [],
  },
];

const initialLogs: EventLogEntry[] = [
  {
    id: 'log-1',
    timestamp: '17:31:18',
    vehicleId: 'DUMPER-03',
    severity: 'CRITICAL',
    message: 'TTC recalculating — obstacle closure rate 4.7m/s',
    zone: 'Zone 3',
  },
  {
    id: 'log-2',
    timestamp: '17:31:22',
    vehicleId: 'DUMPER-03',
    severity: 'WARNING',
    message: 'Engine brake active — slope 8.3%',
    zone: 'Zone 3',
  },
  {
    id: 'log-3',
    timestamp: '17:31:25',
    vehicleId: 'DUMPER-02',
    severity: 'WARNING',
    message: 'Speed reduced — proximity to DUMPER-03',
    zone: 'Zone 3',
  },
  {
    id: 'log-4',
    timestamp: '17:31:29',
    vehicleId: 'DUMPER-02',
    severity: 'WARNING',
    message: 'CCTV detection confidence 88% — fog impeding view',
    zone: 'Zone 3',
  },
  {
    id: 'log-5',
    timestamp: '17:30:50',
    vehicleId: 'DUMPER-01',
    severity: 'INFO',
    message: 'Telemetry synchronized with BT-A Beacon Tower (4.8 GHz V2X)',
    zone: 'Zone 1',
  },
];

// You can fetch this from REST API if not taken via sensors 
const initialWeather: WeatherTelemetry = {
  humidity: 73,
  temperature: 8.4,
  visibility: 8.6,
  vhi: 71,
  condition: 'MONSOON_FOG',
  windSpeed: 14.2,
  rainIntensity: 8.5,
};

const SimulationContext = createContext<SimulationContextType | undefined>(undefined);

export const SimulationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [vehicles, setVehicles] = useState<VehicleTelemetry[]>(initialVehicles);
  const [selectedVehicleId, setSelectedVehicleId] = useState<string>('D-01');
  const [zones] = useState<RfidZone[]>(initialZones);
  const [logs, setLogs] = useState<EventLogEntry[]>(initialLogs);
  const [weather, setWeather] = useState<WeatherTelemetry>(initialWeather);
  const [activeTab, setActiveTab] = useState<ActiveTab>('live-map');
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [simSpeed, setSimSpeed] = useState<number>(1);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [aiFogFilterActive, setAiFogFilterActive] = useState<boolean>(true);
  const [cctvPreset, setCctvPreset] = useState<'CAM-03 HILLTOP' | 'CAM-01 PIT ENTRY' | 'CAM-05 BEND APEX'>('CAM-03 HILLTOP');

  const [systemTime, setSystemTime] = useState<string>('17:31:31');
  const [systemDate, setSystemDate] = useState<string>('27 AUG 2026');
  const [isLiveHardware, setIsLiveHardware] = useState<boolean>(false);
  const [liveVehicleIds, setLiveVehicleIds] = useState<string[]>([]);

  // Fetch real-time live meteorological data for Bailadila Mining Complex (Lat: 18.664, Lon: 81.256, Elev: 648m)
  const fetchBailadilaWeather = useCallback(async () => {
    try {
      const url = 'https://api.open-meteo.com/v1/forecast?latitude=18.664&longitude=81.256&current=temperature_2m,relative_humidity_2m,visibility,wind_speed_10m,weather_code,rain';
      const res = await fetch(url);
      if (!res.ok) return;
      const data = await res.json();
      if (data && data.current) {
        const cur = data.current;
        const humidity = Math.round(Number(cur.relative_humidity_2m)) || 88;
        const temp = Number(cur.temperature_2m) || 21.5;
        const wind = Number(cur.wind_speed_10m) || 5.2;
        const rain = Number(cur.rain) || 0.0;

        // Hilltop fog visibility calculation for Bailadila haul road (Elevation 648m):
        // In high humidity / monsoon conditions, hilltop cloud immersion reduces visibility down to 3-12m
        let visMeters = 35.0;
        if (humidity > 90) {
          visMeters = Math.max(3.5, Math.min(9.5, 42.0 - (humidity * 0.38)));
        } else if (humidity > 75) {
          visMeters = Math.max(8.0, Math.min(22.0, 50.0 - (humidity * 0.35)));
        }

        const vhi = Math.min(100, Math.max(0, Math.round((humidity * 0.4) + (Math.max(0, 50 - visMeters) * 0.8))));

        setWeather({
          humidity,
          temperature: Number(temp.toFixed(1)),
          visibility: Number(visMeters.toFixed(1)),
          vhi,
          condition: humidity > 80 ? 'MONSOON_FOG' : 'CLEAR',
          windSpeed: Number(wind.toFixed(1)),
          rainIntensity: Number(rain.toFixed(1)),
        });
      }
    } catch {
      // Fallback handled gracefully
    }
  }, []);

  // Fetch on mount & refresh every 60 seconds
  useEffect(() => {
    fetchBailadilaWeather();
    const weatherTimer = setInterval(fetchBailadilaWeather, 60000);
    return () => clearInterval(weatherTimer);
  }, [fetchBailadilaWeather]);

  // Polling /api/telemetry for real-time Python Gateway / Sensor Feed
  useEffect(() => {
    const pollInterval = setInterval(async () => {
      try {
        const res = await fetch('/api/telemetry');
        if (!res.ok) return;
        const data = await res.json();

        if (data.isLive && data.vehicles && data.vehicles.length > 0) {
          setIsLiveHardware(true);
          const activeIds = data.vehicles.map((v: Partial<VehicleTelemetry>) => v.id);
          setLiveVehicleIds(activeIds);

          setVehicles((prev) => {
            const liveMap = new Map(data.vehicles.map((v: Partial<VehicleTelemetry>) => [v.id, v]));
            return prev.map((v) => {
              const live = liveMap.get(v.id);
              if (!live) return v;
              return {
                ...v,
                ...live,
              };
            });
          });

          if (data.weather) {
            setWeather((w) => ({ ...w, ...data.weather }));
          }
        } else {
          setIsLiveHardware(false);
          setLiveVehicleIds([]);
        }
      } catch {
        // Quietly handle network blip in local dev
        setIsLiveHardware(false);
      }
    }, 250);

    return () => clearInterval(pollInterval);
  }, []);

  // Clock sync
  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      setSystemTime(
        now.toTimeString().split(' ')[0]
      );
      setSystemDate(
        now.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }).toUpperCase()
      );
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Update soundFx mute state
  useEffect(() => {
    soundFx.isMuted = isMuted;
  }, [isMuted]);

  const addLog = useCallback((severity: 'CRITICAL' | 'WARNING' | 'INFO', vehicleId: string, message: string) => {
    const now = new Date();
    const timeStr = now.toTimeString().split(' ')[0];
    const newEntry: EventLogEntry = {
      id: `log-${Date.now()}-${Math.random().toString(36).substring(2, 5)}`,
      timestamp: timeStr,
      vehicleId,
      severity,
      message,
    };
    setLogs((prev) => [newEntry, ...prev.slice(0, 39)]);

    if (severity === 'CRITICAL') {
      soundFx.playCriticalAlert();
    } else if (severity === 'WARNING') {
      soundFx.playWarning();
    }
  }, []);

  const triggerEmergencyBrake = useCallback((vehicleId: string) => {
    setVehicles((prev) =>
      prev.map((v) => {
        if (v.id === vehicleId) {
          return {
            ...v,
            speed: Math.max(0, v.speed - 10),
            engineBrake: true,
            status: 'critical',
          };
        }
        return v;
      })
    );
    addLog('CRITICAL', vehicleId, `EMERGENCY BRAKE ENGAGED by Control Operator A. Kowalski`);

    // Notify Python Flask Backend (which commands ESP32 hardware)
    fetch('http://localhost:5000/api/emergency-brake', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ vehicleId }),
    }).catch(() => {
      // Backend may be running on a different port or offline; graceful fallback
    });
  }, [addLog]);

  const releaseEmergencyBrake = useCallback((vehicleId: string) => {
    setVehicles((prev) =>
      prev.map((v) => {
        if (v.id === vehicleId) {
          return {
            ...v,
            speed: 22,
            engineBrake: false,
            status: 'safe',
          };
        }
        return v;
      })
    );
    addLog('INFO', vehicleId, `Emergency brake RELEASED. Resuming nominal haul road transit.`);

    // Notify Python Flask Backend
    fetch('http://localhost:5000/api/emergency-brake', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ vehicleId, release: true }),
    }).catch(() => {});
  }, [addLog]);

  const applyScenario = useCallback((scenario: 'nominal' | 'fog_surge' | 'collision_risk' | 'slope_hazard') => {
    if (scenario === 'nominal') {
      setWeather((w) => ({ ...w, visibility: 35.0, humidity: 45, vhi: 22, condition: 'CLEAR' }));
      setVehicles((prev) =>
        prev.map((v) => ({
          ...v,
          status: 'safe',
          speed: 28,
          distanceToObstacle: 95,
          ttc: 24.5,
          engineBrake: false,
        }))
      );
      addLog('INFO', 'FLEET-ALL', 'Weather cleared. Visibility nominal (35m). Speed cap restored to 40 km/h.');
    } else if (scenario === 'fog_surge') {
      setWeather((w) => ({ ...w, visibility: 3.5, humidity: 96, vhi: 94, condition: 'MONSOON_FOG' }));
      setVehicles((prev) =>
        prev.map((v) => ({
          ...v,
          status: v.id === 'D-01' ? 'safe' : 'warning',
          speed: Math.min(v.speed, 16),
        }))
      );
      addLog('WARNING', 'SENSOR-FUSION', 'Dense monsoon fog surge detected! Visibility reduced to 3.5m in Hilltop sector.');
    } else if (scenario === 'collision_risk') {
      setWeather((w) => ({ ...w, visibility: 4.2, vhi: 88 }));
      setVehicles((prev) =>
        prev.map((v) => {
          if (v.id === 'D-03') {
            return {
              ...v,
              status: 'critical',
              speed: 10,
              distanceToObstacle: 8.2,
              ttc: 1.7,
              engineBrake: true,
              slope: 8.9,
            };
          }
          if (v.id === 'D-02') {
            return {
              ...v,
              status: 'warning',
              speed: 15,
              distanceToObstacle: 12.0,
              ttc: 4.8,
              engineBrake: true,
            };
          }
          return v;
        })
      );
      addLog('CRITICAL', 'DUMPER-03', 'PROXIMITY WARNING: TTC < 2.0s with DUMPER-02 in Zone 3 blind curve! Autonomous braking active.');
    } else if (scenario === 'slope_hazard') {
      setVehicles((prev) =>
        prev.map((v) => (v.id === 'D-03' ? { ...v, slope: 11.2, status: 'warning', engineBrake: true } : v))
      );
      addLog('WARNING', 'DUMPER-03', 'Grade steepness exceeded threshold (11.2% slope). Hill descent assist engaged.');
    }
  }, [addLog]);

  // Main dynamic simulation physics loop
  useEffect(() => {
    if (!isPlaying) return;

    const interval = setInterval(() => {
      setVehicles((prevVehicles) => {
        return prevVehicles.map((v) => {
          // If this vehicle is currently receiving live hardware data, preserve live readings
          if (liveVehicleIds.includes(v.id)) {
            return v;
          }

          // Progress speed delta
          const baseStep = (v.speed / 3600) * 0.15 * simSpeed;
          let newProgress = v.pathProgress + (v.direction === 1 ? baseStep : -baseStep);

          if (newProgress > 0.95) {
            newProgress = 0.95;
            v.direction = -1;
          } else if (newProgress < 0.05) {
            newProgress = 0.05;
            v.direction = 1;
          }

          // Compute dynamic heading and slope from path position
          // S-curve apex is between 0.50 and 0.80
          const inFogZone = newProgress >= 0.48 && newProgress <= 0.85;
          const slopeVal = inFogZone ? 6.0 + Math.sin(newProgress * 15) * 2.8 : 2.0 + Math.sin(newProgress * 10) * 1.5;
          const headingVal = Math.floor(40 + newProgress * 80 + Math.sin(newProgress * 12) * 25);

          // Calculate distance and TTC to the nearest other vehicle on the haul road
          let distObs = 85.0;
          let relVel = 0.5;
          let calculatedTtc = 35.0;
          let newStatus: 'safe' | 'warning' | 'critical' = 'safe';

          const closestOther = prevVehicles
            .filter((other) => other.id !== v.id)
            .map((other) => ({
              vehicle: other,
              diffMeters: Math.abs(newProgress - other.pathProgress) * 300,
            }))
            .sort((a, b) => a.diffMeters - b.diffMeters)[0];

          if (closestOther) {
            const other = closestOther.vehicle;
            distObs = Math.max(4.5, Number(closestOther.diffMeters.toFixed(1)));
            relVel = Math.max(0.4, Number((Math.abs(v.speed - other.speed) / 3.6 + 0.5).toFixed(1)));
            calculatedTtc = Number((distObs / relVel).toFixed(1));
            newStatus = (calculatedTtc < 4.0 || distObs < 10.0) 
              ? 'critical' 
              : (calculatedTtc <= 8.0 || distObs < 25.0) 
              ? 'warning' 
              : 'safe';
          }

          return {
            ...v,
            pathProgress: newProgress,
            slope: Number(slopeVal.toFixed(1)),
            heading: headingVal % 360,
            distanceToObstacle: distObs,
            relativeVelocity: Number(relVel.toFixed(1)),
            ttc: calculatedTtc,
            status: newStatus,
          };
        });
      });
    }, 150);

    return () => clearInterval(interval);
  }, [isPlaying, simSpeed, liveVehicleIds]);

  const selectedVehicle = vehicles.find((v) => v.id === selectedVehicleId) || vehicles[0];

  return (
    <SimulationContext.Provider
      value={{
        vehicles,
        selectedVehicleId,
        setSelectedVehicleId,
        selectedVehicle,
        zones,
        logs,
        weather,
        activeTab,
        setActiveTab,
        isPlaying,
        setIsPlaying,
        simSpeed,
        setSimSpeed,
        isMuted,
        setIsMuted,
        systemTime,
        systemDate,
        triggerEmergencyBrake,
        releaseEmergencyBrake,
        applyScenario,
        addLog,
        aiFogFilterActive,
        setAiFogFilterActive,
        cctvPreset,
        setCctvPreset,
        isLiveHardware,
      }}
    >
      {children}
    </SimulationContext.Provider>
  );
};

export const useSimulation = () => {
  const context = useContext(SimulationContext);
  if (!context) {
    throw new Error('useSimulation must be used within a SimulationProvider');
  }
  return context;
};
