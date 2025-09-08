import React from 'react';
import { ResponsiveContainer, ComposedChart, CartesianGrid, Tooltip, Legend, XAxis, YAxis, Line, Scatter } from 'recharts';

// AuthorizationStatusChart: Composed scatter + lines
// Parent passes palette, data, and isDark for styling.

const AuthorizationStatusChart = ({ isDark, palette, data }) => (
  <div className="group relative overflow-visible p-0 text-gray-900 dark:text-white">
    <div className="flex items-center justify-between pt-6 pb-4 border-t border-gray-200 dark:border-white/10">
      <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Authorization Status Breakdown</h3>
    </div>
    <div className="h-80">
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart width={500} height={400} data={data} margin={{ top: 20, right: 80, bottom: 20, left: 20 }}>
          <CartesianGrid stroke={isDark ? '#374151' : '#f5f5f5'} />
          <Tooltip />
          <Legend />
          <XAxis dataKey="index" type="number" label={{ value: 'Index', position: 'insideBottomRight', offset: 0 }} />
          <YAxis unit="ms" type="number" label={{ value: 'Time', angle: -90, position: 'insideLeft' }} />
          <Scatter name="A" dataKey="red" fill={isDark ? palette[3] : palette[4]} />
          <Scatter name="B" dataKey="blue" fill={isDark ? palette[0] : palette[1]} />
          <Line dataKey="blueLine" stroke={isDark ? palette[0] : palette[1]} dot={false} activeDot={false} legendType="none" />
          <Line dataKey="redLine" stroke={isDark ? palette[3] : palette[4]} dot={false} activeDot={false} legendType="none" />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  </div>
);

export default AuthorizationStatusChart;


