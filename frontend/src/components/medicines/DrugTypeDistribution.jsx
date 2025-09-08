import React from 'react';
import { Box } from '@mui/material';
import { PieChart } from '@mui/x-charts';

// DrugTypeDistribution: MUI X Pie chart for drug type distribution
// Parent passes data already shaped as [{ type, count }]

const DrugTypeDistribution = ({ isDark, colors, data, valueFormatter }) => {
  return (
    <div className="group relative overflow-visible p-0 text-gray-900 dark:text-white">
      <div className="flex items-center justify-between pt-6 pb-4 border-t border-gray-200 dark:border-white/10">
        <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Drug Type Distribution</h3>
      </div>
      <div className="h-80">
        <Box sx={{ width: '100%', height: 320 }}>
          <PieChart
            height={320}
            colors={colors}
            sx={{ '--ChartsPie-labelTextColor': '#ffffff', '--ChartsPie-labelLineColor': isDark ? '#9ca3af' : '#6b7280' }}
            slotProps={{ legend: { labelStyle: { fill: isDark ? '#ffffff' : '#111827' }, sx: { '--ChartsLegend-labelColor': isDark ? '#ffffff' : '#111827', '& .MuiChartsLegend-label': { fill: isDark ? '#ffffff' : '#111827', color: isDark ? '#ffffff' : '#111827' } } }, pieArcLabel: (params) => ({ style: { fill: '#ffffff', fontSize: '14px', fontWeight: 'bold', textShadow: '1px 1px 2px rgba(0,0,0,0.8)' } }) }}
            series={[{ data: data.map(d => ({ id: d.type, value: d.count, label: d.type })), highlightScope: { fade: 'global', highlight: 'item' }, faded: { innerRadius: 30, additionalRadius: -30, color: 'gray' }, valueFormatter, arcLabel: (item) => `${item.value.toLocaleString()}`, arcLabelMinAngle: 35, innerRadius: 60, outerRadius: 110 }]}
          />
        </Box>
      </div>
    </div>
  );
};

export default DrugTypeDistribution;


