import React, { useState, useEffect } from 'react';
import { ResponsiveContainer, ComposedChart, CartesianGrid, Tooltip, Legend, XAxis, YAxis, Line, Scatter, Bar } from 'recharts';
import Loader from '../Loader';

// AuthorizationStatusChart: Composed chart for medicine registrations by month
// Parent passes palette, data, isDark for styling, and loading state.

const AuthorizationStatusChart = ({ isDark, palette, data, loading, selectedTrendPeriod, setSelectedTrendPeriod, title = 'Medicine Registrations by Month' }) => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);
  // Custom tooltip for better data display
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const dataPoint = payload[0].payload;
      return (
        <div className="bg-white dark:bg-gray-800 p-3 border border-gray-200 dark:border-gray-600 rounded-lg shadow-lg">
          <p className="font-semibold text-gray-900 dark:text-white">
            {dataPoint.month || `Month ${label + 1}`}
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-300">
            Registrations: <span className="font-medium">{dataPoint.registrations || dataPoint.red || 0}</span>
          </p>
        </div>
      );
    }
    return null;
  };

  const trendPeriods = [
    { value: 3, label: '3M' },
    { value: 6, label: '6M' },
    { value: 9, label: '9M' },
    { value: 12, label: '12M' }
  ];

  if (loading) {
    return (
      <div className="group relative overflow-visible p-0 text-gray-900 dark:text-white">
        <div className="flex items-center justify-between pt-6 pb-4 border-t border-gray-200 dark:border-white/10">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white">{title}</h3>
          {typeof selectedTrendPeriod === 'number' && typeof setSelectedTrendPeriod === 'function' && (
            <div className="flex items-center space-x-2">
              <span className="text-xs text-gray-500 dark:text-gray-400 hidden sm:inline">Period:</span>
              <div className="flex bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
                {trendPeriods.map((period) => (
                  <button
                    key={period.value}
                    onClick={() => setSelectedTrendPeriod(period.value)}
                    className={`px-2 sm:px-3 py-1 text-xs font-medium rounded-md transition-all duration-200 ${
                      selectedTrendPeriod === period.value
                        ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                        : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                    }`}
                  >
                    {period.label}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
        <div className="h-80 flex items-center justify-center">
          <Loader size={60} color={isDark ? '#ffffff' : '#6b7280'} speed={1.5} />
        </div>
      </div>
    );
  }

  return (
    <div className="group relative overflow-visible p-0 text-gray-900 dark:text-white">
      <div className="flex items-center justify-between pt-6 pb-4 border-t border-gray-200 dark:border-white/10">
        <h3 className="text-sm font-semibold text-gray-900 dark:text-white">{title}</h3>
        {typeof selectedTrendPeriod === 'number' && typeof setSelectedTrendPeriod === 'function' && (
          <div className="flex items-center space-x-2">
            <span className="text-xs text-gray-500 dark:text-gray-400 hidden sm:inline">Period:</span>
            <div className="flex bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
              {trendPeriods.map((period) => (
                <button
                  key={period.value}
                  onClick={() => setSelectedTrendPeriod(period.value)}
                  className={`px-2 sm:px-3 py-1 text-xs font-medium rounded-md transition-all duration-200 ${
                    selectedTrendPeriod === period.value
                      ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                      : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                  }`}
                >
                  {period.label}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
      <div className={(isMobile ? "h-64" : "h-[28rem]") + " mt-2 md:mt-16"}>
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart 
            width={500} 
            height={400} 
            data={data} 
            margin={isMobile ? { top: 10, right: 20, bottom: 10, left: 10 } : { top: 20, right: 80, bottom: 20, left: 20 }}
          >
            <CartesianGrid stroke={isDark ? '#374151' : '#f5f5f5'} />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <XAxis 
              dataKey="index" 
              type="number" 
              label={{ 
                value: isMobile ? '' : 'Month Index', 
                position: 'insideBottomRight', 
                offset: 0,
                style: { fill: isDark ? '#e5e7eb' : '#111827', fontSize: isMobile ? '10px' : '12px' }
              }}
              tick={{ fill: isDark ? '#e5e7eb' : '#111827', fontSize: isMobile ? '10px' : '12px' }}
            />
            <YAxis 
              type="number" 
              label={{ 
                value: isMobile ? '' : 'Registrations', 
                angle: -90, 
                position: 'insideLeft',
                style: { fill: isDark ? '#e5e7eb' : '#111827', fontSize: isMobile ? '10px' : '12px' }
              }}
              tick={{ fill: isDark ? '#e5e7eb' : '#111827', fontSize: isMobile ? '10px' : '12px' }}
            />
            <Bar 
              name="Registrations" 
              dataKey="registrations" 
              fill={isDark ? palette[2] : palette[1]} 
              opacity={0.7}
            />
            <Line 
              dataKey="redLine" 
              stroke={isDark ? palette[3] : palette[4]} 
              strokeWidth={2}
              dot={{ fill: isDark ? palette[3] : palette[4], strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, stroke: isDark ? palette[3] : palette[4], strokeWidth: 2 }}
              legendType="none" 
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default AuthorizationStatusChart;


