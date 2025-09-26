import React from 'react';
import { ResponsivePie } from '@nivo/pie';

// ✅ IMPLEMENTED: Generic PieChart component with Nivo ResponsivePie
// Reusable pie chart component for consistent styling across the application
// Data format: [{ label: 'A', value: 10 }, ...]

const PieChart = ({ data, isDark = false, colors = ['#FBBF24', '#35B48F', '#1883AA', '#1E40AF', '#89AB56'] }) => {
  // Transform data for Nivo pie chart
  const pieData = data.map((item, index) => ({
    id: item.label,
    label: item.label,
    value: item.value,
    color: colors[index % colors.length]
  }));

  // Calculate total for percentage calculations
  const total = data.reduce((sum, item) => sum + item.value, 0);

  return (
    <div style={{ height: 300, width: '100%' }}>
      <ResponsivePie
        data={pieData}
        margin={{ top: 40, right: 80, bottom: 80, left: 80 }}
        innerRadius={0.5}
        padAngle={0.6}
        cornerRadius={2}
        activeOuterRadiusOffset={8}
        colors={colors}
        borderWidth={1}
        borderColor={{
          from: 'color',
          modifiers: [['darker', 0.2]]
        }}
        arcLinkLabelsSkipAngle={10}
        arcLinkLabelsTextColor={isDark ? '#e5e7eb' : '#111827'}
        arcLinkLabelsThickness={2}
        arcLinkLabelsColor={{ from: 'color' }}
        arcLabelsSkipAngle={10}
        arcLabelsTextColor={{
          from: 'color',
          modifiers: [['darker', 2]]
        }}
        enableArcLabels={true}
        arcLabel={(d) => `${d.value.toLocaleString()}`}
        tooltip={({ datum }) => (
          <div
            style={{
              background: isDark ? 'rgba(15,23,42,0.95)' : 'rgba(255,255,255,0.95)',
              padding: '12px',
              borderRadius: '8px',
              border: `1px solid ${isDark ? '#1f2937' : '#e5e7eb'}`,
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
              color: isDark ? '#e5e7eb' : '#111827',
              fontSize: '14px',
              fontFamily: 'Inter, system-ui, sans-serif'
            }}
          >
            <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>
              {datum.label}
            </div>
            <div>
              Value: <strong>{datum.value.toLocaleString()}</strong>
            </div>
            <div>
              Percentage: <strong>{((datum.value / total) * 100).toFixed(1)}%</strong>
            </div>
          </div>
        )}
        legends={[
          {
            anchor: 'bottom',
            direction: 'row',
            translateY: 56,
            itemWidth: 100,
            itemHeight: 18,
            itemTextColor: isDark ? '#e5e7eb' : '#111827',
            symbolShape: 'circle',
            symbolSize: 12,
            effects: [
              {
                on: 'hover',
                style: {
                  itemTextColor: isDark ? '#ffffff' : '#000000'
                }
              }
            ]
          }
        ]}
        motionConfig="gentle"
        transitionMode="startAngle"
        animate={true}
      />
    </div>
  );
};

export default PieChart;