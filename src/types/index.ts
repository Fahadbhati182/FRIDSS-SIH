export type VehicleStatus = 'safe' | 'warning' | 'critical' | 'idle';

export interface VehicleTelemetry {
  id: string;
  name: string; // e.g. 'DUMPER-01'
  callsign: string; // e.g. 'D-01'
  operator: string;
  operatorCode: string;
  status: VehicleStatus;
  speed: number; // km/h
  maxSpeed: number;
  heading: number; // degrees 0-360
  slope: number; // percentage
  distanceToObstacle: number; // meters
  relativeVelocity: number; // m/s
  ttc: number; // Time To Collision in seconds
  activeZoneId: string;
  activeZoneName: string;
  zoneStatus: 'IN ZONE' | 'TRANSIT' | 'EXITED';
  zoneSince: string;
  payload: number; // tons
  fuelLevel: number; // percentage
  engineBrake: boolean;
  sensors: {
    vis: boolean;
    ir: boolean;
    gps: boolean;
    imu: boolean;
    rfid: boolean;
    lidar: boolean;
  };
  // Path position normalized 0.0 -> 1.0 along the haul road
  pathProgress: number;
  direction: 1 | -1; // 1 = uphill/to waste dump, -1 = downhill/to pit
  v2vTargetId?: string;
}

export interface RfidZone {
  id: string;
  name: string;
  location: string;
  activeVehicles: {
    vehicleId: string;
    operator: string;
    status: 'IN ZONE' | 'TRANSIT';
    since: string;
    signalStrength: number; // 1-5
  }[];
}

export interface EventLogEntry {
  id: string;
  timestamp: string;
  vehicleId: string;
  severity: 'CRITICAL' | 'WARNING' | 'INFO';
  message: string;
  zone?: string;
  acknowledged?: boolean;
}

export interface WeatherTelemetry {
  humidity: number; // %
  temperature: number; // °C
  visibility: number; // meters
  vhi: number; // Vehicle Hazard Index (0-100%)
  condition: 'MONSOON_FOG' | 'DENSE_FOG' | 'RAIN' | 'CLEAR' | 'NIGHT';
  windSpeed: number; // km/h
  rainIntensity: number; // mm/h
}

export interface BoundingBoxDetection {
  id: string;
  label: string;
  confidence: number;
  color: string;
  x: number; // percentage
  y: number;
  width: number;
  height: number;
  distance: string;
}

export type ActiveTab = 
  | 'live-map' 
  | 'fleet-status' 
  | 'cctv-feed' 
  | 'rfid-zones' 
  | 'event-log' 
  | 'architecture' 
  | 'user-story' 
  | 'reports';
