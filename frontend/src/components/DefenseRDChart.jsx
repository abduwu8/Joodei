import React, { useState, useEffect } from 'react';

const DefenseRDChart = ({ compact = false, data: externalData, title, isDark = false, colors }) => {
  const [animationProgress, setAnimationProgress] = useState(0);
  const [hoveredSegment, setHoveredSegment] = useState(null);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      const interval = setInterval(() => {
        setAnimationProgress(prev => {
          if (prev >= 1) {
            clearInterval(interval);
            return 1;
          }
          return prev + 0.02;
        });
      }, 20);
    }, 500);
    
    return () => clearTimeout(timer);
  }, []);

  const defaultPalette = colors && colors.length ? colors : [
    "#06b6d4", "#14b8a6", "#22c55e", "#84cc16", "#eab308",
    "#f59e0b", "#f97316", "#ef4444", "#a855f7", "#3b82f6"
  ];
  const fallbackData = [
    { category: "Mission Support", value: 52 },
    { category: "Space Based Systems", value: 21 },
    { category: "Aviation", value: 19 },
    { category: "Science, Technicians, and Others", value: 18 },
    { category: "Missile Defence", value: 11 },
    { category: "Communications, Intelligence", value: 11 },
    { category: "Naval Systems", value: 6 },
    { category: "Ground Systems", value: 3 }
  ];
  const sortedSource = (externalData && externalData.length ? externalData : fallbackData)
    .slice()
    .sort((a, b) => (Number(b.value ?? b.count ?? 0) - Number(a.value ?? a.count ?? 0)));
  const topTen = sortedSource.slice(0, 10);
  const data = topTen.map((item, idx) => ({
    category: item.category ?? item.label ?? String(item.name ?? `Item ${idx+1}`),
    value: Number(item.value ?? item.count ?? 0),
    color: item.color || defaultPalette[idx % defaultPalette.length]
  }));

  // Calculate angles based on values
  const total = data.reduce((sum, item) => sum + item.value, 0);
  const dataWithAngles = data.map(item => ({
    ...item,
    angle: (item.value / total) * 360
  }));

  const radius = compact ? 180 : 210;
  const innerRadius = compact ? 124 : 140;
  const svgSize = compact ? 500 : 560;
  // Box that always fits inside the circle: inscribed square side = r * sqrt(2)
  const centerBox = Math.floor((innerRadius - 10) * Math.SQRT1_2 * 2);

  const createPath = (startAngle, endAngle, outerR, innerR, progress = 1) => {
    const actualEndAngle = startAngle + (endAngle - startAngle) * progress;
    const startAngleRad = (startAngle * Math.PI) / 180;
    const endAngleRad = (actualEndAngle * Math.PI) / 180;
    
    const x1 = Math.cos(startAngleRad) * outerR;
    const y1 = Math.sin(startAngleRad) * outerR;
    const x2 = Math.cos(endAngleRad) * outerR;
    const y2 = Math.sin(endAngleRad) * outerR;
    
    const x3 = Math.cos(endAngleRad) * innerR;
    const y3 = Math.sin(endAngleRad) * innerR;
    const x4 = Math.cos(startAngleRad) * innerR;
    const y4 = Math.sin(startAngleRad) * innerR;
    
    const largeArcFlag = endAngle - startAngle > 180 ? 1 : 0;
    
    return `
      M ${x1} ${y1}
      A ${outerR} ${outerR} 0 ${largeArcFlag} 1 ${x2} ${y2}
      L ${x3} ${y3}
      A ${innerR} ${innerR} 0 ${largeArcFlag} 0 ${x4} ${y4}
      Z
    `;
  };

  return (
    <div className={compact ? "w-full h-full flex items-center justify-center p-2" : "w-full bg-transparent flex items-start justify-center p-2 md:p-4"}>
      <div className="relative w-full max-w-7xl">
        {!compact && (
          <div className="mb-4 md:mb-6">
            <h2 className="text-lg md:text-2xl font-semibold tracking-wide text-cyan-500">
              {title || 'Distribution Overview'}
            </h2>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8 items-start">
          {/* Left: Donut/Pie */}
          <div className="w-full flex items-center justify-center">
            <svg width={svgSize} height={svgSize} viewBox={`-280 -280 560 560`} className="transform">
              <defs>
                <filter id="shadow">
                  <feDropShadow dx="0" dy="0" stdDeviation="4" floodOpacity="0.3"/>
                </filter>
              </defs>

              <g>
                {(() => {
                  let currentAngle = -90; // Start from top
                  return dataWithAngles.map((item, index) => {
                    const startAngle = currentAngle;
                    const endAngle = currentAngle + item.angle;
                    currentAngle = endAngle;
                    
                    const isHovered = false;
                    
                    return (
                      <g key={index}>
                        <path
                          d={createPath(startAngle, endAngle, radius, innerRadius, animationProgress)}
                          fill={item.color}
                          stroke={isDark ? "#0b1220" : "#ffffff"}
                          strokeOpacity="0.6"
                          strokeWidth="1"
                          className="transition-all duration-200"
                          style={{ opacity: animationProgress }}
                        />
                      </g>
                    );
                  });
                })()}
              </g>

              {/* Center circle */}
              <circle 
                cx="0" 
                cy="0" 
                r={innerRadius - 5} 
                fill={isDark ? '#0b1220' : '#ffffff'}
                stroke="none"
                opacity={animationProgress}
              />
              <g style={{ opacity: animationProgress }}>
                <text x="0" y="-6" textAnchor="middle" className={isDark ? 'fill-white' : 'fill-gray-900'} fontSize={compact ? "18" : "22"} fontWeight="800">
                  {total.toLocaleString()}
                </text>
                <text x="0" y="14" textAnchor="middle" className={isDark ? 'fill-white' : 'fill-gray-600'} fontSize={compact ? "9" : "10"}>
                  Total
                </text>
              </g>
              
              {/* Text labels positioned on segments */}
              {(() => {
                let currentAngle = -90;
                return dataWithAngles.map((item, index) => {
                  const midAngle = currentAngle + item.angle / 2;
                  currentAngle += item.angle;
                  
                  // Different positioning based on segment size and location
                  let textRadius, fontSize, categoryFontSize;
                  
                  if (item.angle > 60) { // Large segments
                    textRadius = (innerRadius + radius) / 2;
                    fontSize = "24";
                    categoryFontSize = "10";
                  } else if (item.angle > 30) { // Medium segments
                    textRadius = (innerRadius + radius) / 2;
                    fontSize = "18";
                    categoryFontSize = "9";
                  } else { // Small segments
                    textRadius = radius + 22;
                    fontSize = "14";
                    categoryFontSize = "8";
                  }
                  
                  const x = Math.cos((midAngle * Math.PI) / 180) * textRadius;
                  const y = Math.sin((midAngle * Math.PI) / 180) * textRadius;
                  
                  // Determine rotation - flip text if it would be upside down
                  const rotation = midAngle > 90 && midAngle < 270 ? midAngle + 180 : midAngle;
                  
                  return (
                    <g key={`text-${index}`} style={{ opacity: animationProgress }}>
                      {/* Value text */}
                        <text
                        x={x}
                        y={y - 3}
                        textAnchor="middle"
                          className={isDark ? 'fill-white' : 'fill-gray-900'}
                        fontSize={fontSize}
                        fontWeight="700"
                        transform={`rotate(${rotation}, ${x}, ${y})`}
                      >
                        {item.value.toLocaleString()}
                      </text>
                      
                      {/* Category text for larger segments */}
                      {item.angle > 25 && (
                        <text
                          x={x}
                          y={y + 12}
                          textAnchor="middle"
                          className={isDark ? 'fill-white' : 'fill-gray-700'}
                          fontSize={categoryFontSize}
                          fontWeight="400"
                          transform={`rotate(${rotation}, ${x}, ${y})`}
                        >
                          {item.category.length > 20 ? 
                            item.category.split(' ').slice(0, 2).join(' ') : 
                            item.category}
                        </text>
                      )}
                      {item.angle <= 25 && (
                        <g>
                          <circle cx={x} cy={y + 8} r="10" fill={isDark ? '#0b1220' : '#ffffff'} stroke={item.color} strokeOpacity="0.6" />
                          <text x={x} y={y + 12} textAnchor="middle" className={isDark ? 'fill-white' : 'fill-gray-900'} fontSize="8">
                            {Math.round((item.value / total) * 100)}%
                          </text>
                        </g>
                      )}
                    </g>
                  );
                });
              })()}
            </svg>
          </div>

          {/* Right: Detailed List */}
          <div className="w-full">
            <div className={isDark ? "rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm p-5" : "rounded-xl border border-gray-200 bg-white p-5"}>
              {/* Header like the reference card */}
              <div className="mb-4">
                <div className={isDark ? "text-xs uppercase tracking-wide text-white/70" : "text-xs uppercase tracking-wide text-gray-500"}>Continent breakdown</div>
                <div className={isDark ? "mt-1 text-3xl font-extrabold text-white" : "mt-1 text-3xl font-extrabold text-gray-900"}>{total.toLocaleString()}</div>
                <div className={isDark ? "text-xs text-white/60" : "text-xs text-gray-600"}>across top 10 continents</div>
              </div>
              <div className={isDark ? "max-h-[28rem] overflow-auto pr-1 divide-y divide-white/10" : "max-h-[28rem] overflow-auto pr-1 divide-y divide-gray-200"}>
                {data
                  .slice()
                  .sort((a, b) => b.value - a.value)
                  .map((item, idx) => {
                    const percentage = total ? (item.value / total) * 100 : 0;
                    return (
                      <div key={idx} className="py-4">
                        <div className="flex items-center justify-between gap-3">
                          <div className="flex items-center gap-2 min-w-0">
                            <span className="inline-block w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                            <span className={isDark ? "text-sm font-semibold text-white truncate" : "text-sm font-semibold text-gray-900 truncate"}>{item.category}</span>
                          </div>
                          <span className={isDark ? "text-sm text-white/80 whitespace-nowrap" : "text-sm text-gray-700 whitespace-nowrap"}>{Math.round(percentage)}%</span>
                        </div>
                        <div className={isDark ? "mt-2 h-[3px] w-full rounded-full bg-white/10 overflow-hidden" : "mt-2 h-[3px] w-full rounded-full bg-gray-200 overflow-hidden"}>
                          <div className="h-[3px] rounded-full" style={{ width: `${percentage}%`, backgroundColor: item.color }} />
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DefenseRDChart;