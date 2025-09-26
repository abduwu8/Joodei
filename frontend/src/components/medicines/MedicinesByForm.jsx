import React, { useState, useEffect } from 'react';
import { ResponsivePie } from '@nivo/pie';

// ✅ IMPLEMENTED: MedicinesByForm with Nivo ResponsivePie chart
// Nivo ResponsivePie chart for pharmaceutical forms data with enhanced styling
// Data source: top_5_pharmaceuticalform from /medicine_kpi API endpoint
// Features: interactive selection, responsive design, theme support

const MedicinesByForm = ({ isDark, data, colors }) => {
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
    id: item.form,
    label: item.form,
    value: item.count,
    color: colors[index % colors.length]
  }));

  // Calculate total for display
  const total = data.reduce((sum, item) => sum + item.count, 0);

  return (
    <div className="group relative overflow-visible p-0 text-gray-900 dark:text-white">
      <div className="flex items-center justify-between pt-6 pb-4 border-t border-gray-200 dark:border-white/10">
        <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
          Medicines by Pharmaceutical Form
        </h3>
      </div>
      <div className={`${isMobile ? "h-96" : "h-[28rem]"} w-full flex items-center justify-center`}>
        <div className="w-full h-full flex flex-col items-center justify-center p-2">
          {/* Total count display */}
          <div className="text-xs text-gray-500 dark:text-gray-400 mb-2">
            Total: {total.toLocaleString()} medicines
          </div>
          
          {/* Nivo ResponsivePie Chart */}
          <div className="w-full h-full">
            <ResponsivePie
              data={pieData}
              margin={{ top: 40, right: 80, bottom: 80, left: 80 }}
              innerRadius={0.5}
              padAngle={0.6}
              cornerRadius={2}
              activeOuterRadiusOffset={8}
              colors={colors}
              theme={{
                labels: {
                  text: {
                    fill: isDark ? '#e5e7eb' : '#111827',
                    fontWeight: 700
                  }
                }
              }}
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
                    Count: <strong>{datum.value.toLocaleString()}</strong>
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
                  itemWidth: isMobile ? 80 : 100,
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
        </div>
      </div>
    </div>
  );
};

export default MedicinesByForm;