import React, { useEffect, useState } from 'react';
import { ResponsivePie } from '@nivo/pie';

// Pie chart for Distribution Area using Nivo ResponsivePie (consistent with DrugTypeDistribution)
const DistributionAreaPieChart = ({ isDark, data, colors }) => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const items = (Array.isArray(data) ? data : []).slice(0, 10);
  const palette = Array.isArray(colors) && colors.length ? colors : ['#06b6d4', '#14b8a6', '#22c55e', '#84cc16', '#eab308', '#f59e0b', '#f97316', '#ef4444', '#a855f7', '#3b82f6'];
  const pieData = items.map((item, idx) => ({
    id: item.area ?? String(idx + 1),
    label: item.area ?? String(idx + 1),
    value: Number(item.count ?? 0),
    color: palette[idx % palette.length]
  }));

  if (!items || items.length === 0) {
    return (
      <div className="group relative overflow-visible p-0 text-gray-900 dark:text-white">
        <div className="flex items-center justify-between pt-6 pb-4 border-t border-gray-200 dark:border-white/10">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Distribution Area</h3>
        </div>
        <div className={`${isMobile ? 'h-64' : 'h-80'} w-full flex items-center justify-center p-4`}>
          <div className="text-gray-500 dark:text-gray-400">No distribution data available</div>
        </div>
      </div>
    );
  }

  return (
    <div className="group relative overflow-visible p-0 text-gray-900 dark:text-white">
      <div className="flex items-center justify-between pt-6 pb-4 border-t border-gray-200 dark:border-white/10">
        <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Distribution Area</h3>
      </div>
      <div className={`${isMobile ? 'h-64' : 'h-80'} w-full p-4 pt-2`}> 
        <div className="w-full h-full">
        <ResponsivePie
          data={pieData}
          margin={{ top: 10, right: 30, bottom: 40, left: 30 }}
          innerRadius={0.4}
          padAngle={0.6}
          cornerRadius={2}
          activeOuterRadiusOffset={8}
          theme={{
            labels: { text: { fill: isDark ? '#e5e7eb' : '#111827', fontWeight: 700 } },
            text: { fontFamily: 'Inter, system-ui, sans-serif', fontSize: 12, fill: isDark ? '#ffffff' : '#333333' },
            tooltip: { container: { background: isDark ? 'rgba(17,24,39,0.95)' : '#ffffff', color: isDark ? '#ffffff' : '#333333', borderRadius: 8, border: `1px solid ${isDark ? '#374151' : '#e5e7eb'}` } }
          }}
          enableArcLinkLabels={false}
          arcLabelsSkipAngle={10}
          arcLabelsTextColor={{ from: 'color', modifiers: [['darker', 2]] }}
          colors={palette}
          legends={[{ anchor: 'bottom', direction: 'row', translateY: 40, itemWidth: 120, itemHeight: 20, symbolShape: 'circle', itemTextColor: isDark ? '#ffffff' : '#333333', symbolSize: 14 }]}
          tooltip={({ datum }) => (
            <div style={{
              background: isDark ? 'rgba(17,24,39,0.95)' : '#ffffff',
              color: isDark ? '#ffffff' : '#333333',
              padding: '8px 12px',
              borderRadius: 8,
              border: `1px solid ${isDark ? '#374151' : '#e5e7eb'}`,
              fontFamily: 'Inter, system-ui, sans-serif',
              fontSize: 12
            }}>
              <strong>{datum.label}</strong><br/>
              Medicines: {datum.value.toLocaleString()}
            </div>
          )}
        />
        </div>
      </div>
    </div>
  );
};

export default DistributionAreaPieChart;



