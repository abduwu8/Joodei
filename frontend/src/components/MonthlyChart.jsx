import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Box } from '@mui/material';

const MonthlyChart = ({ data, isDark = false }) => {
  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-500">No monthly data available</p>
      </div>
    );
  }

  return (
    <div className="bg-[#1f2d3a] border-2 border-[#00B8D9] rounded-lg p-4 shadow-lg">
      <h4 className="text-lg font-semibold mb-4 text-center text-white">Medicine Registrations by Month</h4>
      <div className="h-[400px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis 
              dataKey="month" 
              tick={{ fill: '#e5e7eb' }}
              axisLine={{ stroke: '#374151' }}
            />
            <YAxis 
              tick={{ fill: '#e5e7eb' }}
              axisLine={{ stroke: '#374151' }}
            />
            <Tooltip 
              contentStyle={{
                backgroundColor: '#1f2937',
                border: '1px solid #374151',
                borderRadius: '6px',
                color: '#e5e7eb'
              }}
            />
            <Line 
              type="monotone" 
              dataKey="count" 
              stroke="#00B8D9" 
              strokeWidth={3}
              dot={{ fill: '#00B8D9', strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, stroke: '#00B8D9', strokeWidth: 2 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default MonthlyChart;