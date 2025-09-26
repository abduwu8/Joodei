import React, { useState, useEffect } from "react";
import {
  ResponsiveContainer,
  BarChart as ReBarChart,
  Bar,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
  LabelList,
} from "recharts";

// ManufacturersRanking: horizontal bar showing top manufacturers
// Parent passes data, colors, and label renderer.

const ManufacturersRanking = ({
  isDark,
  data,
  colors,
  renderInsideRightLabel,
}) => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
  <div className="group relative overflow-visible p-0 text-gray-900 dark:text-white">
    <div className="flex items-center justify-between pt-6 pb-4 border-t border-gray-200 dark:border-white/10">
      <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
        Top Manufacturers by Medicines
      </h3>
    </div>
    <div className={isMobile ? "h-80" : "h-96"}>
      <ResponsiveContainer width="100%" height="100%">
        <ReBarChart
          data={data}
          layout="vertical"
          margin={{ 
            top: 20, 
            right: isMobile ? 20 : 30, 
            bottom: 20, 
            left: isMobile ? 10 : -80 
          }}
        >
          <CartesianGrid
            strokeDasharray="3 3"
            stroke={isDark ? "#374151" : "#e5e7eb"}
          />
          <XAxis
            type="number"
            tick={{ fill: isDark ? "#e5e7eb" : "#111827", fontSize: 12 }}
            axisLine={{ stroke: isDark ? "#374151" : "#e5e7eb" }}
            tickLine={{ stroke: isDark ? "#374151" : "#e5e7eb" }}
          />
          <YAxis
            type="category"
            dataKey="manufacturer"
            tick={{
              fill: isDark ? "#e5e7eb" : "#111827",
              fontSize: isMobile ? 10 : 11,
              textAnchor: "end",
            }}
            width={isMobile ? 250 : 400}
            interval={0}
            axisLine={{ stroke: isDark ? "#374151" : "#e5e7eb" }}
            tickLine={{ stroke: isDark ? "#374151" : "#e5e7eb" }}
          />
          <Tooltip
            formatter={(value) => [value.toLocaleString(), "Medicines"]}
            labelFormatter={(label) => `Manufacturer: ${label}`}
            contentStyle={{
              backgroundColor: isDark
                ? "rgba(17,24,39,0.95)"
                : "rgba(255,255,255,0.95)",
              border: `1px solid ${isDark ? "#374151" : "#e5e7eb"}`,
              borderRadius: "8px",
              color: isDark ? "#ffffff" : "#111827",
              fontSize: "13px",
              fontFamily: "Inter, system-ui, sans-serif",
            }}
            labelStyle={{
              color: isDark ? "#ffffff" : "#111827",
              fontWeight: "600",
            }}
            itemStyle={{
              color: isDark ? "#ffffff" : "#111827",
            }}
          />
          <Bar dataKey="medicines" radius={[0, 4, 4, 0]}>
            {data.map((_, index) => (
              <Cell
                key={`cell-manu-${index}`}
                fill={colors[index % colors.length]}
              />
            ))}
            <LabelList
              dataKey="medicines"
              content={renderInsideRightLabel}
              position="insideRight"
            />
          </Bar>
        </ReBarChart>
      </ResponsiveContainer>
    </div>
  </div>
  );
};

export default ManufacturersRanking;
