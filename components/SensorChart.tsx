import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { SensorReading } from '../types';

interface SensorChartProps {
  data: SensorReading[];
  dataKey: keyof SensorReading;
  color: string;
  min: number;
  max: number;
}

const SensorChart: React.FC<SensorChartProps> = ({ data, dataKey, color, min, max }) => {
  return (
    <div className="h-48 w-full mt-4">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" opacity={0.3} vertical={false} />
          <XAxis 
            dataKey="timeLabel" 
            tick={{ fontSize: 10, fill: '#9ca3af' }} 
            interval="preserveStartEnd"
            tickMargin={10}
          />
          <YAxis 
            domain={[min, max]} 
            hide={false} 
            tick={{ fontSize: 10, fill: '#9ca3af' }}
            width={30}
          />
          <Tooltip 
            contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
            labelStyle={{ color: '#6b7280', fontSize: '12px', marginBottom: '4px' }}
          />
          <Line 
            type="monotone" 
            dataKey={dataKey} 
            stroke={color} 
            strokeWidth={2} 
            dot={false}
            activeDot={{ r: 4 }}
            animationDuration={500}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default SensorChart;