import React, { useState, useEffect } from 'react';
import { ResponsivePie } from '@nivo/pie';

// ✅ IMPLEMENTED: DrugTypeDistribution with Nivo ResponsivePie chart
// Nivo ResponsivePie chart for drug type distribution with enhanced styling
// Data source: pie_drugtype from /medicines/summary_latest API endpoint
// Parent passes data already shaped as [{ type, count }]

const DrugTypeDistribution = ({ isDark, colors, data, valueFormatter, loading }) => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Transform data for Nivo pie chart
  const pieData = data.map((item, index) => ({
    id: item.type,
    label: item.type,
    value: item.count,
    color: colors[index % colors.length]
  }));

  return (
    <div className="group relative overflow-visible p-0 text-gray-900 dark:text-white">
      
      <div className="flex items-center justify-between pt-6 pb-4 border-t border-gray-200 dark:border-white/10">
        <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
          Drug Type Distribution
        </h3>
      </div>
      
      <div className="h-[28rem] relative">
        {loading ? (
          <div className="h-full flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <ResponsivePie
            data={pieData}
            margin={{ top: 60, right: 100, bottom: 100, left: 100 }}
            innerRadius={0.5}
            padAngle={0.6}
            cornerRadius={2}
            activeOuterRadiusOffset={8}
            theme={{
              labels: {
                text: {
                  fill: isDark ? '#e5e7eb' : '#111827',
                  fontWeight: 700
                }
              },
              text: {
                fontFamily: 'Inter, system-ui, sans-serif',
                fontSize: 12,
                fill: isDark ? '#ffffff' : '#333333'
              },
              tooltip: {
                container: {
                  background: isDark ? 'rgba(17,24,39,0.95)' : '#ffffff',
                  color: isDark ? '#ffffff' : '#333333',
                  borderRadius: 8,
                  border: `1px solid ${isDark ? '#374151' : '#e5e7eb'}`,
                  boxShadow:
                    '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
                }
              }
            }}
            arcLinkLabelsSkipAngle={10}
            arcLinkLabelsTextColor={isDark ? "#ffffff" : "#333333"}
            arcLinkLabelsThickness={2}
            arcLinkLabelsColor={{ from: 'color' }}
            arcLabelsSkipAngle={10}
            arcLabelsTextColor={{ from: 'color', modifiers: [['darker', 2]] }}
            colors={colors}
            legends={[
              {
                anchor: 'bottom',
                direction: 'row',
                translateY: 80,
                itemWidth: 120,
                itemHeight: 20,
                symbolShape: 'circle',
                itemTextColor: isDark ? "#ffffff" : "#333333",
                itemDirection: 'left-to-right',
                symbolSize: 14,
                effects: [
                  {
                    on: 'hover',
                    style: {
                      itemTextColor: isDark ? "#e5e7eb" : "#111827",
                    }
                  }
                ]
              }
            ]}
            tooltip={({ datum }) => (
              <div style={{
                background: isDark ? "rgba(17,24,39,0.95)" : "#ffffff",
                color: isDark ? "#ffffff" : "#333333",
                padding: "8px 12px",
                borderRadius: 8,
                border: `1px solid ${isDark ? "#374151" : "#e5e7eb"}`,
                boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
                fontFamily: 'Inter, system-ui, sans-serif',
                fontSize: 12
              }}>
                <strong>{datum.label}</strong><br/>
                Count: {datum.value.toLocaleString()}
              </div>
            )}
          />
        )}
      </div>
    </div>
  );
};

export default DrugTypeDistribution;