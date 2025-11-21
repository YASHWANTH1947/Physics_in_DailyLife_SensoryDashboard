import { SensorReading, StatSummary } from './types';

/**
 * Generates a random number within a specific range.
 * This mimics reading raw data from a sensor pin.
 */
export const getRandomValue = (min: number, max: number): number => {
  return Math.random() * (max - min) + min;
};

/**
 * Formats a timestamp into a readable string (HH:mm:ss).
 */
export const formatTime = (date: Date): string => {
  return date.toLocaleTimeString('en-US', {
    hour12: false,
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
};

/**
 * Generates a new simulated sensor reading.
 * We add some slight randomization to the previous value to make the graph look
 * like real natural data (random walk), rather than jumping wildly every second.
 */
export const generateReading = (lastReading?: SensorReading): SensorReading => {
  const now = new Date();
  
  // Default centers if no previous reading exists
  let temp = lastReading ? lastReading.temperature : 30;
  let pulse = lastReading ? lastReading.pulse : 75;
  let sound = lastReading ? lastReading.sound : 50;

  // Random walk: slightly increase or decrease the previous value
  // This makes the chart look more realistic
  temp += getRandomValue(-0.5, 0.5);
  pulse += getRandomValue(-2, 2);
  sound += getRandomValue(-5, 5);

  // Clamp values to realistic physical limits defined in the project requirements
  temp = Math.max(20, Math.min(40, temp));
  pulse = Math.max(60, Math.min(100, pulse)); // Clamp pulse between 60-100 as requested
  sound = Math.max(30, Math.min(90, sound));

  return {
    timestamp: now.getTime(),
    timeLabel: formatTime(now),
    temperature: parseFloat(temp.toFixed(1)),
    pulse: Math.round(pulse),
    sound: Math.round(sound),
  };
};

/**
 * Calculates Min, Max, and Average for a given array of numbers.
 */
export const calculateStats = (values: number[]): StatSummary => {
  if (values.length === 0) return { min: 0, max: 0, avg: 0 };

  const min = Math.min(...values);
  const max = Math.max(...values);
  const sum = values.reduce((a, b) => a + b, 0);
  const avg = parseFloat((sum / values.length).toFixed(1));

  return { min, max, avg };
};