import React, { useState, useEffect } from 'react';

const DefenseRDChart = ({ compact = false }) => {
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

  const data = [
    { category: "Mission Support", value: 52, color: "#17312e" },
    { category: "Space Based Systems", value: 21, color: "#1b3a36" },
    { category: "Aviation", value: 19, color: "#20443f" },
    { category: "Science, Technicians, and Others", value: 18, color: "#254e48" },
    { category: "Missile Defence", value: 11, color: "#2a5851" },
    { category: "Communications, Intelligence", value: 11, color: "#2e625a" },
    { category: "Naval Systems", value: 6, color: "#336c63" },
    { category: "Ground Systems", value: 3, color: "#37766c" }
  ];

  // Calculate angles based on values
  const total = data.reduce((sum, item) => sum + item.value, 0);
  const dataWithAngles = data.map(item => ({
    ...item,
    angle: (item.value / total) * 360
  }));

  const radius = compact ? 180 : 200;
  const innerRadius = compact ? 124 : 138;
  const svgSize = compact ? 480 : 500;
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
    <div className={compact ? "w-full h-full flex items-center justify-center p-2" : "w-full h-screen bg-gradient-to-br from-gray-900 via-slate-900 to-gray-900 flex items-center justify-center p-8 relative overflow-hidden"}>
      {!compact && (
        <div className="absolute inset-0">
          <div className="absolute top-0 right-0 w-96 h-96 bg-teal-500/5 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl"></div>
        </div>
      )}
      
      <div className="relative max-w-7xl w-full">
        {!compact && (
          <div className="mb-8 text-cyan-400">
            <h1 className="text-5xl font-bold tracking-wider mb-2" style={{ fontFamily: 'monospace' }}>
              INVESTMENT
            </h1>
            <h2 className="text-2xl font-light tracking-wide">
              DOD AND EDF R&D ALLOCATIONS
            </h2>
            <h3 className="text-xl font-light">
              BY CATEGORY AS <span className="text-cyan-300">BILLIONS</span>,
            </h3>
            <p className="text-lg text-gray-400 mt-1">$US BILLIONS, 2024</p>
          </div>
        )}

        <div className={compact ? "flex items-center justify-center" : "flex items-center justify-between"}>
          {!compact && (
            <div className="max-w-md">
              <p className="text-gray-300 text-base leading-relaxed mb-4">
                In 2024, the U.S. Department of Defense (DoD) and European Defence Fund (EDF) spent{' '}
                <span className="text-cyan-400">nearly $146 billion</span> researching new defense technologies.
              </p>
            </div>
          )}

          <div className="relative flex items-center justify-center">
            <svg width={svgSize} height={svgSize} viewBox={`-250 -250 500 500`} className="transform">
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
                    
                    const isHovered = hoveredSegment === index;
                    
                    return (
                      <g key={index}>
                        <path
                          d={createPath(startAngle, endAngle, radius, innerRadius, animationProgress)}
                          fill={item.color}
                          stroke="#0f1419"
                          strokeWidth="1"
                          className="transition-all duration-300 cursor-pointer"
                          style={{
                            filter: isHovered ? 'brightness(1.3)' : 'brightness(1)',
                            opacity: animationProgress
                          }}
                          onMouseEnter={() => setHoveredSegment(index)}
                          onMouseLeave={() => setHoveredSegment(null)}
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
                fill="#0f1419"
                stroke="none"
                opacity={animationProgress}
              />
              
              {/* Text labels positioned on segments */}
              {(() => {
                let currentAngle = -90;
                return dataWithAngles.map((item, index) => {
                  const midAngle = currentAngle + item.angle / 2;
                  currentAngle += item.angle;
                  
                  // Different positioning based on segment size and location
                  let textRadius, fontSize, categoryFontSize;
                  
                  if (item.angle > 60) { // Large segments like Mission Support
                    textRadius = (innerRadius + radius) / 2;
                    fontSize = "24";
                    categoryFontSize = "10";
                  } else if (item.angle > 30) { // Medium segments
                    textRadius = (innerRadius + radius) / 2;
                    fontSize = "18";
                    categoryFontSize = "9";
                  } else { // Small segments
                    textRadius = radius + 30;
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
                        className="fill-cyan-400"
                        fontSize={fontSize}
                        fontWeight="700"
                        transform={`rotate(${rotation}, ${x}, ${y})`}
                      >
                        ${item.value}B
                      </text>
                      
                      {/* Category text for larger segments */}
                      {item.angle > 25 && (
                        <text
                          x={x}
                          y={y + 12}
                          textAnchor="middle"
                          className="fill-gray-300"
                          fontSize={categoryFontSize}
                          fontWeight="400"
                          transform={`rotate(${rotation}, ${x}, ${y})`}
                        >
                          {item.category.length > 20 ? 
                            item.category.split(' ').slice(0, 2).join(' ') : 
                            item.category}
                        </text>
                      )}
                    </g>
                  );
                });
              })()}
            </svg>

            {/* Center content overlay - use descriptive text */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="text-center p-2" style={{ opacity: animationProgress, width: centerBox, maxWidth: centerBox }}>
                <div className="text-cyan-300 font-semibold text-[13px] md:text-sm mb-1 leading-tight">
                  DoD and EDF focus areas
                </div>
                <div className="text-gray-300 text-[11px] md:text-[13px] leading-snug break-words hyphens-auto">
                </div>
              </div>
            </div>
          </div>

          {!compact && <div className="w-32"></div>}
        </div>
      </div>
    </div>
  );
};

export default DefenseRDChart;