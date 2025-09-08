import React from 'react';
import { ResponsiveContainer, BarChart as ReBarChart, Bar, CartesianGrid, XAxis, YAxis, Tooltip, Cell, LabelList } from 'recharts';

// MedicinesByForm: Recharts vertical bar with inside labels
// Parent supplies data and color palette.

const MedicinesByForm = ({ isDark, data, colors, renderInsideTopLabel }) => (
  <div className="group relative overflow-visible p-0 text-gray-900 dark:text-white">
    <div className="flex items-center justify-between pt-6 pb-4 border-t border-gray-200 dark:border-white/10">
      <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Medicines by Pharmaceutical Form</h3>
    </div>
    <div className="h-80">
      <ResponsiveContainer width="100%" height="100%">
        <ReBarChart data={data} margin={{ top: 10, right: 20, bottom: 20, left: 20 }}>
          <CartesianGrid strokeDasharray="3 3" stroke={isDark ? '#374151' : '#e5e7eb'} />
          <XAxis dataKey="form" tick={{ fill: isDark ? '#e5e7eb' : '#111827' }} />
          <YAxis tick={{ fill: isDark ? '#e5e7eb' : '#111827' }} />
          <Tooltip />
          <Bar dataKey="count">
            {data.map((entry, index) => (
              <Cell key={`cell-form-${index}`} fill={colors[index % colors.length]} />
            ))}
            <LabelList dataKey="count" content={renderInsideTopLabel} />
          </Bar>
        </ReBarChart>
      </ResponsiveContainer>
    </div>
  </div>
);

export default MedicinesByForm;


