import React from 'react';
import CanvasJSReact from '@canvasjs/react-charts';

// MonthlyRegistrationsChart: renders CanvasJS spline chart for monthly registrations
// Expects prepared options and flags from parent; no fetching here.

const CanvasJSChart = CanvasJSReact.CanvasJSChart;

const MonthlyRegistrationsChart = ({
  title = 'Monthly Medicine Registrations',
  loading,
  inView,
  hasScrolled,
  canvasOptions
}) => {
  return (
    <div className="group relative overflow-visible p-0 text-gray-900 dark:text-white">
      <div className="flex items-center justify-between pt-6 pb-4 border-t border-gray-200 dark:border-white/10">
        <h3 className="text-sm font-semibold text-gray-900 dark:text-white">{title}</h3>
      </div>
      <div className="h-80">
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


