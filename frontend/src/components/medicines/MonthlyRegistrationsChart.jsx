import React, { useState, useEffect } from 'react';
import CanvasJSReact from '@canvasjs/react-charts';

// MonthlyRegistrationsChart: renders CanvasJS spline chart for monthly registrations
// Expects prepared options and flags from parent; no fetching here.

const CanvasJSChart = CanvasJSReact.CanvasJSChart;

const MonthlyRegistrationsChart = ({
  title = 'Monthly Medicine Registrations',
  loading,
  inView,
  hasScrolled,
  canvasOptions,
  selectedTrendPeriod,
  setSelectedTrendPeriod,
  isDark
}) => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const trendPeriods = [
    { value: 3, label: '3M' },
    { value: 6, label: '6M' },
    { value: 9, label: '9M' },
    { value: 12, label: '12M' }
  ];

  return (
    <div className="group relative overflow-visible p-0 text-gray-900 dark:text-white">
      <div className="flex items-center justify-between pt-6 pb-4 border-t border-gray-200 dark:border-white/10">
        <h3 className="text-sm font-semibold text-gray-900 dark:text-white">{title}</h3>
        {/* ✅ IMPLEMENTED: Trend period selection toolkit */}
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
      </div>
      <div className={isMobile ? "h-64" : "h-80"}>
        {hasScrolled && inView && (
          loading ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-gray-500 dark:text-gray-400">Loading...</div>
            </div>
          ) : (
            <CanvasJSChart options={canvasOptions} containerProps={{ width: '100%', height: '100%' }} />
          )
        )}
      </div>
    </div>
  );
};

export default MonthlyRegistrationsChart;


