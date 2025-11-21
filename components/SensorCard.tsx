import React, { useMemo } from 'react';
import { SensorConfig, SensorReading } from '../types';
import Gauge from './Gauge';
import SensorChart from './SensorChart';
import { calculateStats } from '../utils';
import { AlertTriangle, CheckCircle, Activity } from 'lucide-react';

interface SensorCardProps {
  config: SensorConfig;
  currentReading: SensorReading | null;
  history: SensorReading[];
}

const SensorCard: React.FC<SensorCardProps> = ({ config, currentReading, history }) => {
  // Extract the specific value for this sensor from the generic reading object
  const value = currentReading ? currentReading[config.id] as number : 0;

  // Calculate statistics based on history
  const stats = useMemo(() => {
    const values = history.map(h => h[config.id] as number);
    return calculateStats(values);
  }, [history, config.id]);

  // Determine alert status
  let statusColor = "bg-green-100 text-green-800";
  let icon = <CheckCircle className="w-5 h-5 text-green-500" />;
  let statusText = "Normal";
  let gaugeColor = config.color === 'red' ? 'text-red-500' : config.color === 'blue' ? 'text-blue-500' : 'text-orange-500'; // Simplification for gauge

  if (value >= config.thresholds.critical || (config.id === 'pulse' && value <= 60)) {
    statusColor = "bg-red-100 text-red-800";
    icon = <AlertTriangle className="w-5 h-5 text-red-500" />;
    statusText = "Critical";
    gaugeColor = "text-red-600";
  } else if (value >= config.thresholds.warning || (config.id === 'pulse' && value >= 90)) {
    statusColor = "bg-yellow-100 text-yellow-800";
    icon = <Activity className="w-5 h-5 text-yellow-600" />;
    statusText = "Warning";
    gaugeColor = "text-yellow-500";
  }

  // Chart Color Hex Code
  const hexColor = config.color === 'red' ? '#ef4444' : config.color === 'blue' ? '#3b82f6' : '#f59e0b';

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
          {config.label}
        </h2>
        <div className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${statusColor}`}>
          {icon}
          {statusText}
        </div>
      </div>

      {/* Main Visuals: Gauge + Stats */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-6">
        {/* Gauge */}
        <div className="flex-shrink-0">
          <Gauge 
            value={value} 
            min={config.min} 
            max={config.max} 
            unit={config.unit} 
            color={gaugeColor}
          />
        </div>

        {/* Statistics Grid */}
        <div className="grid grid-cols-3 gap-4 w-full">
          <div className="text-center p-2 bg-gray-50 rounded-lg">
            <p className="text-xs text-gray-500 uppercase font-bold tracking-wider">Min</p>
            <p className="text-sm font-semibold text-gray-700">{stats.min} {config.unit}</p>
          </div>
          <div className="text-center p-2 bg-gray-50 rounded-lg">
            <p className="text-xs text-gray-500 uppercase font-bold tracking-wider">Avg</p>
            <p className="text-sm font-semibold text-gray-700">{stats.avg} {config.unit}</p>
          </div>
          <div className="text-center p-2 bg-gray-50 rounded-lg">
            <p className="text-xs text-gray-500 uppercase font-bold tracking-wider">Max</p>
            <p className="text-sm font-semibold text-gray-700">{stats.max} {config.unit}</p>
          </div>
        </div>
      </div>

      {/* Trend Chart */}
      <div className="mt-auto">
        <h3 className="text-xs font-medium text-gray-400 mt-6 mb-2 uppercase tracking-wider">Last 60 Seconds</h3>
        <SensorChart 
          data={history} 
          dataKey={config.id} 
          color={hexColor}
          min={config.min}
          max={config.max}
        />
      </div>
    </div>
  );
};

export default SensorCard;