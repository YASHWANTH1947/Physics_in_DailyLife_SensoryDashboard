import React from 'react';

interface GaugeProps {
  value: number;
  min: number;
  max: number;
  unit: string;
  color: string; // e.g., "text-blue-500"
}

const Gauge: React.FC<GaugeProps> = ({ value, min, max, unit, color }) => {
  // Calculate percentage for the gauge arc
  const range = max - min;
  const normalizedValue = Math.min(Math.max(value, min), max);
  const percentage = ((normalizedValue - min) / range) * 100;

  // SVG Circle Math
  const radius = 40;
  const circumference = 2 * Math.PI * radius;
  // We only want a semi-circle (180 degrees) or partial circle.
  // Let's do a 240-degree arc for a cool dashboard look.
  const arcLength = circumference * (240 / 360); 
  const dashOffset = arcLength - (percentage / 100) * arcLength;

  return (
    <div className="relative flex flex-col items-center justify-center">
      <svg width="120" height="120" viewBox="0 0 120 120" className="transform rotate-90 md:rotate-0">
        {/* Definitions for gradients */}
        <defs>
          <linearGradient id="gaugeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="currentColor" stopOpacity="0.4" />
            <stop offset="100%" stopColor="currentColor" stopOpacity="1" />
          </linearGradient>
        </defs>

        {/* Background Track */}
        <circle
          cx="60"
          cy="60"
          r={radius}
          stroke="#e5e7eb" // gray-200
          strokeWidth="10"
          fill="transparent"
          strokeDasharray={`${arcLength} ${circumference}`}
          strokeLinecap="round"
          transform="rotate(150 60 60)" 
        />

        {/* Value Arc */}
        <circle
          cx="60"
          cy="60"
          r={radius}
          stroke="currentColor"
          strokeWidth="10"
          fill="transparent"
          strokeDasharray={`${arcLength} ${circumference}`}
          strokeDashoffset={dashOffset}
          strokeLinecap="round"
          className={`${color} transition-all duration-500 ease-out`}
          transform="rotate(150 60 60)"
        />
      </svg>

      {/* Text Value Centered */}
      <div className="absolute flex flex-col items-center top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 mt-1">
        <span className={`text-2xl font-bold ${color}`}>
          {value}
        </span>
        <span className="text-xs text-gray-500 font-medium">{unit}</span>
      </div>
    </div>
  );
};

export default Gauge;