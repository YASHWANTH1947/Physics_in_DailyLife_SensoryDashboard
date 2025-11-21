// Defines the shape of a single point in time for our data
export interface SensorReading {
  timestamp: number; // Unix timestamp for sorting/graphing
  timeLabel: string; // Human readable time (HH:mm:ss)
  temperature: number; // Celsius
  pulse: number; // BPM
  sound: number; // dB
}

// Configuration for a specific sensor type to make components reusable
export interface SensorConfig {
  id: 'temperature' | 'pulse' | 'sound';
  label: string;
  unit: string;
  min: number;
  max: number;
  color: string; // Tailwind color class base (e.g., 'blue', 'red')
  thresholds: {
    warning: number;
    critical: number;
  };
}

export interface StatSummary {
  min: number;
  max: number;
  avg: number;
}