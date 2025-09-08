import React from 'react';
import { ResponsiveAreaBump } from '@nivo/bump';

// AdminRouteAreaBump: Nivo area bump for administration route distribution trends
// Parent passes data and theme-related props.

const AdminRouteAreaBump = ({ isDark, palette, data, deepPalette }) => (
  <div className="group relative overflow-visible p-0 text-gray-900 dark:text-white">
    <div className="flex items-center justify-between pt-6 pb-4 border-t border-gray-200 dark:border-white/10">
      <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Administration Route Distribution</h3>
    </div>
    <div className="h-80">
      <ResponsiveAreaBump
        data={data}
        margin={{ top: 20, right: 20, bottom: 50, left: 60 }}
        spacing={8}
        padding={0.2}
        colors={isDark ? palette : deepPalette}
        blendMode="multiply"
        align="center"
        interpolation="smooth"
        theme={{
          axis: {
            ticks: {
              line: { stroke: isDark ? '#ffffff' : '#111827', strokeWidth: 1 },
              text: { fill: isDark ? '#ffffff' : '#111827', fontSize: 12 }
            },
            legend: { text: { fill: isDark ? '#ffffff' : '#111827', fontSize: 12 } }
          },
          tooltip: {
            container: {
              background: isDark ? '#1f2937' : '#ffffff',
              color: isDark ? '#ffffff' : '#111827',
              fontSize: 12,
              borderRadius: 8,
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
            }
          }
        }}
        axisTop={null}
        axisBottom={{ tickSize: 5, tickPadding: 5, tickRotation: 0, legend: 'Month', legendOffset: 36, legendPosition: 'middle' }}
      />
    </div>
  </div>
);

export default AdminRouteAreaBump;


