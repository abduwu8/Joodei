import React, { useState, useEffect, useRef } from 'react';
import { useTheme } from '../context/ThemeContext';

const DistributionAreaChart = ({ compact = false }) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const { useState: reactUseState, useEffect: reactUseEffect, useRef: reactUseRef } = React;
  const [isD3Loaded, setIsD3Loaded] = useState(false);
  const svgRef = useRef();

  // Data adapted for medicine distribution areas
  const data = [
    { name: ['Riyadh', 'Region'], value: 52, color: isDark ? '#1a5f66' : '#2563eb' },
    { name: ['Jeddah'], value: 19, color: isDark ? '#165259' : '#3b82f6' },
    { name: ['Eastern', 'Province'], value: 18, color: isDark ? '#13484d' : '#60a5fa' },
    { name: ['Mecca'], value: 11, color: isDark ? '#103e42' : '#93c5fd' },
    { name: ['Medina'], value: 11, color: isDark ? '#0d3437' : '#bfdbfe' },
    { name: ['Northern', 'Regions'], value: 6, color: isDark ? '#0a2a2c' : '#dbeafe' },
    { name: ['Southern', 'Regions'], value: 3, color: isDark ? '#072021' : '#eff6ff' }
  ];

  // Effect to load D3.js script dynamically
  useEffect(() => {
    // Check if D3 is already loaded
    if (window.d3) {
      setIsD3Loaded(true);
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://d3js.org/d3.v7.min.js';
    script.async = true;
    script.onload = () => setIsD3Loaded(true);
    script.onerror = () => console.error("D3.js failed to load.");
    document.body.appendChild(script);

    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, []);

  // Effect to draw the chart once D3 is loaded
  useEffect(() => {
    if (!isD3Loaded || !svgRef.current) return;

    const d3 = window.d3;
    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const width = compact ? 300 : 500;
    const height = compact ? 300 : 400;
    const cx = width / 2;
    const cy = height / 2;
    const innerRadius = compact ? 60 : 80;
    const outerRadius = compact ? 110 : 160;

    const g = svg.append('g').attr('transform', `translate(${cx},${cy})`);

    const pie = d3.pie().value(d => d.value).sort(null).padAngle(0.015);
    const arcs = pie(data);

    const arc = d3.arc()
      .innerRadius(innerRadius)
      .outerRadius(outerRadius)
      .cornerRadius(6);

    // Segments
    g.selectAll('path')
      .data(arcs)
      .join('path')
      .attr('d', arc)
      .attr('fill', d => d.data.color)
      .attr('stroke', isDark ? '#041a1c' : '#ffffff')
      .attr('stroke-width', 2)
      .style('transition', 'opacity 0.2s')
      .on('mouseover', function() { d3.select(this).style('opacity', 0.8); })
      .on('mouseout', function() { d3.select(this).style('opacity', 1); });

    // Center circle
    g.append('circle')
      .attr('r', innerRadius - 20)
      .attr('fill', isDark ? '#0a2426' : '#f8fafc')
      .attr('stroke', isDark ? '#164449' : '#e2e8f0')
      .attr('stroke-width', 2);

    // Center text
    const centerLines = compact ? [
      'Medicine Distribution',
      'across Saudi Arabia',
      'regions'
    ] : [
      'Medicine distribution varies', 'across regions with Riyadh',
      'leading at 52%, followed by', 'Jeddah and Eastern Province',
      'showing concentration patterns'
    ];
    
    g.selectAll('.center-text')
      .data(centerLines)
      .join('text')
      .attr('class', 'center-text')
      .attr('text-anchor', 'middle')
      .attr('y', (d, i) => -20 + i * (compact ? 10 : 14))
      .attr('fill', isDark ? '#b7eae6' : '#475569')
      .attr('font-size', compact ? '9px' : '12px')
      .attr('opacity', 0.9)
      .text(d => d);

    // Value labels
    g.selectAll('.value-text')
      .data(arcs)
      .join('text')
      .attr('class', 'value-text')
      .attr('transform', d => `translate(${arc.centroid(d)})`)
      .attr('text-anchor', 'middle')
      .attr('dominant-baseline', 'middle')
      .attr('fill', isDark ? '#6ff3e7' : '#1e40af')
      .attr('font-size', compact ? '16px' : '20px')
      .attr('font-weight', '800')
      .style('pointer-events', 'none')
      .text(d => `${d.data.value}%`);

    // Category labels
    const labelRadius = outerRadius + (compact ? 25 : 30);
    arcs.forEach(d => {
      const [x, y] = d3.arc().innerRadius(labelRadius).outerRadius(labelRadius).centroid(d);
      const angle = (d.startAngle + d.endAngle) / 2 * (180 / Math.PI) - 90;
      const rotation = angle > 90 ? angle - 180 : angle;

      const label = g.append('text')
        .attr('transform', `translate(${x}, ${y}) rotate(${rotation})`)
        .attr('text-anchor', 'middle')
        .attr('dominant-baseline', 'middle');

      d.data.name.forEach((line, i) => {
        label.append('tspan')
          .attr('x', 0)
          .attr('dy', i === 0 ? 0 : '1.2em')
          .attr('fill', isDark ? '#43d9cb' : '#374151')
          .attr('font-size', compact ? '9px' : '11px')
          .attr('letter-spacing', '0.08em')
          .style('text-transform', 'uppercase')
          .text(line);
      });
    });

  }, [isD3Loaded, isDark, compact]);

  if (!compact) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'transparent' }}>
        <div className="max-w-6xl w-full mx-auto px-4 py-8">
          <div className="text-left mb-6">
            <h1 className="text-5xl font-black tracking-wider" style={{ color: isDark ? '#e7fffb' : '#1e293b' }}>
              DISTRIBUTION
            </h1>
            <p className="text-sm uppercase tracking-widest mt-2" style={{ color: isDark ? '#43d9cb' : '#64748b' }}>
              MEDICINE DISTRIBUTION BY REGION, PERCENTAGE, 2024
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            <div className="lg:col-span-2">
              <div 
                className="relative w-full rounded-2xl border p-2"
                style={{
                  aspectRatio: '1/1',
                  background: 'transparent',
                  borderColor: isDark ? 'rgba(111,243,231,0.06)' : 'rgba(148,163,184,0.2)',
                }}
              >
                {isD3Loaded ? (
                  <svg ref={svgRef} viewBox="0 0 500 450" className="w-full h-full" />
                ) : (
                  <div className="flex items-center justify-center h-full" style={{ color: isDark ? '#ffffff' : '#1e293b' }}>
                    Loading Chart...
                  </div>
                )}
              </div>
            </div>
            
            <div className="flex flex-col space-y-2 max-h-full overflow-y-auto pr-2">
              <p className="text-sm leading-relaxed opacity-95 mb-3" style={{ color: isDark ? '#b7eae6' : '#475569' }}>
                In 2024, medicine distribution across Saudi Arabia shows regional concentration patterns,
                with major urban centers leading pharmaceutical accessibility.
              </p>
              <div className="space-y-2">
                {data.map((item) => (
                  <div 
                    key={item.name.join('-')}
                    className="flex items-center space-x-3 p-2 rounded-lg"
                    style={{ backgroundColor: isDark ? 'rgba(11, 42, 45, 0.8)' : 'rgba(241, 245, 249, 0.8)' }}
                  >
                    <div className="w-3 h-8 rounded flex-shrink-0" style={{ backgroundColor: item.color }} />
                    <div className="min-w-0 flex-1">
                      <div className="text-base font-bold" style={{ color: isDark ? '#6ff3e7' : '#1e40af' }}>
                        {item.value}%
                      </div>
                      <div className="text-xs opacity-80 truncate" style={{ color: isDark ? '#43d9cb' : '#64748b' }}>
                        {item.name.join(' ')}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full flex items-center justify-center p-2">
      <div 
        className="relative w-full rounded-xl border p-2"
        style={{
          aspectRatio: '1/1',
          background: isDark 
            ? 'radial-gradient(circle at center, #0e3b3f 0%, transparent 70%), transparent'
            : 'radial-gradient(circle at center, #f1f5f9 0%, transparent 70%), transparent',
          borderColor: isDark ? 'rgba(111,243,231,0.06)' : 'rgba(148,163,184,0.2)',
        }}
      >
        {isD3Loaded ? (
          <svg ref={svgRef} viewBox="0 0 300 300" className="w-full h-full" />
        ) : (
          <div className="flex items-center justify-center h-full" style={{ color: isDark ? '#ffffff' : '#1e293b' }}>
            Loading...
          </div>
        )}
      </div>
    </div>
  );
};

export default DistributionAreaChart;