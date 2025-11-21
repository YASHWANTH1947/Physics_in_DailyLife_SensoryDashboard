import React, { useState, useEffect } from 'react';
import { generateReading } from './utils';
import { SensorReading, SensorConfig } from './types';
import SensorCard from './components/SensorCard';
import { Activity, PauseCircle, PlayCircle } from 'lucide-react';

// --- CONFIGURATION ---
// This defines the sensors we want to monitor.
// Easy for a student to add a new sensor (e.g., Humidity) by adding an object here.
const SENSORS: SensorConfig[] = [
  {
    id: 'temperature',
    label: 'Temperature',
    unit: '°C',
    min: 20,
    max: 40,
    color: 'red', // Tailwind base color
    thresholds: { warning: 35, critical: 38 }
  },
  {
    id: 'pulse',
    label: 'Heart Rate',
    unit: 'BPM',
    min: 50,
    max: 110, // Slightly wider for visual context
    color: 'blue',
    thresholds: { warning: 90, critical: 100 }
  },
  {
    id: 'sound',
    label: 'Sound Intensity',
    unit: 'dB',
    min: 30,
    max: 100,
    color: 'orange',
    thresholds: { warning: 70, critical: 85 }
  }
];

const App: React.FC = () => {
  const [isMonitoring, setIsMonitoring] = useState<boolean>(true);
  const [history, setHistory] = useState<SensorReading[]>([]);
  
  // The max number of data points to keep.
  // If we update every 2 seconds, 30 points = 60 seconds of history.
  const MAX_HISTORY_POINTS = 30;

  useEffect(() => {
    let intervalId: ReturnType<typeof setInterval>;

    if (isMonitoring) {
      intervalId = setInterval(() => {
        setHistory(prevHistory => {
          // Get the last reading to base the next random walk on
          const lastReading = prevHistory.length > 0 ? prevHistory[prevHistory.length - 1] : undefined;
          
          // Generate new data
          const newReading = generateReading(lastReading);
          
          // Create new array, appending new reading and slicing to keep size constant
          const newHistory = [...prevHistory, newReading];
          if (newHistory.length > MAX_HISTORY_POINTS) {
            return newHistory.slice(newHistory.length - MAX_HISTORY_POINTS);
          }
          return newHistory;
        });
      }, 2000); // Update every 2 seconds
    }

    return () => clearInterval(intervalId);
  }, [isMonitoring]);

  // Helper to get the absolute latest reading
  const currentReading = history.length > 0 ? history[history.length - 1] : null;

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        
        {/* Header Section */}
        <header className="flex flex-col md:flex-row justify-between items-center mb-8 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <Activity className="text-indigo-600" />
              Sensor Monitoring Dashboard
            </h1>
            <p className="text-gray-500 text-sm mt-1">
              Real-time environmental and physiological data visualization
            </p>
          </div>

          <div className="mt-4 md:mt-0 flex items-center gap-4">
            <div className="text-right hidden md:block mr-4">
               <p className="text-xs text-gray-400 uppercase font-bold">System Status</p>
               <p className="text-sm font-medium text-green-600 flex items-center justify-end gap-1">
                 <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                 Active
               </p>
            </div>
            
            <button 
              onClick={() => setIsMonitoring(!isMonitoring)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                isMonitoring 
                  ? 'bg-red-50 text-red-600 hover:bg-red-100 border border-red-200' 
                  : 'bg-green-50 text-green-600 hover:bg-green-100 border border-green-200'
              }`}
            >
              {isMonitoring ? <><PauseCircle size={18} /> Pause Monitor</> : <><PlayCircle size={18} /> Resume Monitor</>}
            </button>
          </div>
        </header>

        {/* Main Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {SENSORS.map(sensorConfig => (
            <SensorCard 
              key={sensorConfig.id}
              config={sensorConfig}
              currentReading={currentReading}
              history={history}
            />
          ))}
        </div>

        {/* Footer / Info for Student */}
        <footer className="mt-12 text-center text-gray-400 text-sm">
          <p>College Project - CSE Semester 3</p>
          <p className="mt-1 text-xs">
            Data is simulated. Updates every 2 seconds. Keeps 60s history.
          </p>
        </footer>

      </div>
    </div>
  );
};

export default App;