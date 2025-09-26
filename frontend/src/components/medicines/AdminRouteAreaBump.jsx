import React, { useMemo, useState, useEffect } from 'react';
import { ResponsiveAreaBump } from '@nivo/bump';
import { ResponsiveContainer, BarChart as ReBarChart, Bar, CartesianGrid, XAxis, YAxis, Tooltip, Cell, LabelList } from 'recharts';

// AdminRouteAreaBump: renders either a Nivo area bump (time series) or a simple bar chart
// If the provided series do not span multiple x values, we fallback to a bar chart (counts by route)

const AdminRouteAreaBump = ({ isDark, palette, data, deepPalette, barData = [], colors = [] }) => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);
  const hasMultiX = useMemo(() => {
    try {
      const xs = new Set();
      (data || []).forEach(series => (series?.data || []).forEach(p => xs.add(p.x)));
      return xs.size > 1 && (data || []).length > 0;
    } catch {
      return false;
    }
  }, [data]);

  if (!hasMultiX) {
    // Fallback: bar chart for simple group data (counts by administration route)
    return (
      <div className="group relative overflow-visible p-0 text-gray-900 dark:text-white">
        <div className="flex items-center justify-between pt-6 pb-4 border-t border-gray-200 dark:border-white/10">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Administration Route Distribution</h3>
        </div>
        <div className={isMobile ? "h-64" : "h-80"}>
          <ResponsiveContainer width="100%" height="100%">
            <ReBarChart data={barData} margin={isMobile ? { top: 5, right: 10, bottom: 15, left: 10 } : { top: 10, right: 20, bottom: 20, left: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={isDark ? '#374151' : '#e5e7eb'} />
              <XAxis 
                dataKey="route" 
                tick={{ 
                  fill: isDark ? '#e5e7eb' : '#111827',
                  fontSize: isMobile ? 9 : 11,
                  textAnchor: 'end'
                }} 
                interval={0} 
                angle={-45} 
                height={isMobile ? 50 : 70}
                tickMargin={isMobile ? 5 : 10}
              />
              <YAxis tick={{ fill: isDark ? '#e5e7eb' : '#111827', fontSize: isMobile ? 10 : 12 }} allowDecimals={false} />
              <Tooltip cursor={{ fill: isDark ? 'rgba(55,65,81,0.2)' : 'rgba(229,231,235,0.3)' }} />
              <Bar dataKey="count">
                {barData.map((entry, index) => (
                  <Cell key={`cell-route-${index}`} fill={colors[index % (colors.length || 1)] || '#4CB8F6'} />
                ))}
                <LabelList dataKey="count" position="top" fill={isDark ? '#ffffff' : '#111827'} fontSize={isMobile ? 10 : 12} />
              </Bar>
            </ReBarChart>
          </ResponsiveContainer>
        </div>
      </div>
    );
  }

  return (
    <div className="group relative overflow-visible p-0 text-gray-900 dark:text-white">
      <div className="flex items-center justify-between pt-6 pb-4 border-t border-gray-200 dark:border-white/10">
        <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Administration Route Distribution</h3>
      </div>
      <div className={isMobile ? "h-64" : "h-80"}>
        <ResponsiveAreaBump
          data={data}
          margin={isMobile ? { top: 10, right: 10, bottom: 30, left: 30 } : { top: 20, right: 20, bottom: 50, left: 60 }}
          spacing={isMobile ? 4 : 8}
          padding={0.2}
          colors={isDark ? palette : deepPalette}
          blendMode="multiply"
          align="center"
          interpolation="smooth"
          theme={{
            axis: {
              ticks: {
                line: { stroke: isDark ? '#ffffff' : '#111827', strokeWidth: 1 },
                text: { fill: isDark ? '#ffffff' : '#111827', fontSize: isMobile ? 10 : 12 }
              },
              legend: { text: { fill: isDark ? '#ffffff' : '#111827', fontSize: isMobile ? 10 : 12 } }
            },
            tooltip: {
              container: {
                background: isDark ? '#1f2937' : '#ffffff',
                color: isDark ? '#ffffff' : '#111827',
                fontSize: isMobile ? 10 : 12,
                borderRadius: 8,
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
              }
            }
          }}
          axisTop={null}
          axisBottom={{ 
            tickSize: isMobile ? 3 : 5, 
            tickPadding: isMobile ? 3 : 5, 
            tickRotation: 0, 
            legend: isMobile ? '' : 'Month', 
            legendOffset: isMobile ? 20 : 36, 
            legendPosition: 'middle' 
          }}
        />
      </div>
    </div>
  );
};

export default AdminRouteAreaBump;


