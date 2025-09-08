import React from 'react';
import { ResponsiveContainer, BarChart as ReBarChart, Bar, CartesianGrid, XAxis, YAxis, Tooltip, Cell, LabelList } from 'recharts';

// ManufacturersRanking: horizontal bar showing top manufacturers
// Parent passes data, colors, and label renderer.

const ManufacturersRanking = ({ isDark, data, colors, renderInsideRightLabel }) => (
  <div className="group relative overflow-visible p-0 text-gray-900 dark:text-white">
    <div className="flex items-center justify-between pt-6 pb-4 border-t border-gray-200 dark:border-white/10">
      <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Top Manufacturers by Medicines</h3>
    </div>
    <div className="h-80">
      <ResponsiveContainer width="100%" height="100%">
        <ReBarChart data={data} layout="vertical" margin={{ top: 10, right: 20, bottom: 20, left: 20 }}>
          <CartesianGrid strokeDasharray="3 3" stroke={isDark ? '#374151' : '#e5e7eb'} />
          <XAxis type="number" tick={{ fill: isDark ? '#e5e7eb' : '#111827' }} />
          <YAxis type="category" dataKey="manufacturer" tick={{ fill: isDark ? '#e5e7eb' : '#111827' }} width={120} />
          <Tooltip />
          <Bar dataKey="medicines">
            {data.map((entry, index) => (
              <Cell key={`cell-manu-${index}`} fill={colors[index % colors.length]} />
            ))}
            <LabelList dataKey="medicines" content={renderInsideRightLabel} />
          </Bar>
        </ReBarChart>
      </ResponsiveContainer>
    </div>
  </div>
);

export default ManufacturersRanking;


