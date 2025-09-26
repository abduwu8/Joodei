import React, { useEffect, useRef, useState } from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';

// ✅ IMPLEMENTED: DistributionAreaAreaChart with Highcharts area chart
// Area chart displaying distribution area data over time
// Data source: total_medicine_by_distribute_area from /medicine_kpi API endpoint
// Uses Highcharts for smooth area visualization

const DistributionAreaAreaChart = ({ isDark, data, colors }) => {
  const chartRef = useRef(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Ensure data is always an array
  const chartData = Array.isArray(data) ? data : [];
  // Ensure colors is always an array
  const chartColors = Array.isArray(colors) ? colors : ['#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#00ff00'];

  // Prepare data for Highcharts area chart
  const prepareAreaData = () => {
    if (!chartData || chartData.length === 0) {
      return [];
    }

    // Sort data by count (descending) for better visualization
    const sortedData = [...chartData].sort((a, b) => b.count - a.count);
    
    // Create area series data - each area becomes a data point
    return sortedData.map((item, index) => ({
      name: item.area,
      y: item.count,
      color: chartColors[index % chartColors.length]
    }));
  };

  const areaData = prepareAreaData();

  const chartOptions = {
    chart: {
      type: 'area',
      backgroundColor: 'transparent',
      style: {
        fontFamily: 'Inter, system-ui, sans-serif'
      },
      spacing: isMobile ? [10, 10, 10, 10] : [20, 20, 20, 20],
      margin: isMobile ? [20, 20, 30, 40] : [40, 40, 60, 80]
    },
    accessibility: {
      description: 'An area chart showing the distribution of medicines across different areas. ' +
        'Each area is represented by a colored segment showing the number of medicines distributed. ' +
        'The chart is interactive and allows you to explore the distribution data for each area.'
    },
    title: {
      text: null
    },
    subtitle: {
      text: null
    },
    xAxis: {
      categories: areaData.map(item => item.name),
      labels: {
        style: {
          color: isDark ? '#e5e7eb' : '#111827',
          fontSize: isMobile ? '10px' : '12px'
        },
        y: isMobile ? 10 : 20,
        rotation: 0
      },
      lineColor: isDark ? '#374151' : '#e5e7eb',
      tickColor: isDark ? '#374151' : '#e5e7eb',
      tickLength: 5,
      tickWidth: 1
    },
    yAxis: {
      title: {
        text: isMobile ? '' : 'Number of Medicines',
        style: {
          color: isDark ? '#e5e7eb' : '#111827',
          fontSize: isMobile ? '10px' : '12px'
        },
        margin: isMobile ? 10 : 20,
        offset: isMobile ? 10 : 20
      },
      labels: {
        style: {
          color: isDark ? '#e5e7eb' : '#111827',
          fontSize: isMobile ? '10px' : '12px'
        },
        x: isMobile ? -5 : -10
      },
      gridLineColor: isDark ? '#374151' : '#e5e7eb',
      lineColor: isDark ? '#374151' : '#e5e7eb'
    },
    tooltip: {
      backgroundColor: isDark ? 'rgba(17,24,39,0.95)' : '#ffffff',
      borderColor: isDark ? '#374151' : '#e5e7eb',
      style: {
        color: isDark ? '#ffffff' : '#111827',
        fontSize: isMobile ? '12px' : '14px'
      },
      pointFormat: '<b>{point.name}</b><br/>' +
        'Medicines: <b>{point.y:,.0f}</b>'
    },
    plotOptions: {
      area: {
        marker: {
          enabled: true,
          symbol: 'circle',
          radius: 4,
          states: {
            hover: {
              enabled: true,
              radius: 6
            }
          }
        },
        fillOpacity: 0.6,
        lineWidth: 2,
        states: {
          hover: {
            lineWidth: 3
          }
        }
      }
    },
    series: [{
      name: 'Distribution Areas',
      data: areaData,
      showInLegend: false
    }],
    credits: {
      enabled: false
    },
    legend: {
      enabled: false
    }
  };

  // Show loading or empty state if no data
  if (!chartData || chartData.length === 0) {
    return (
      <div className="group relative overflow-visible p-0 text-gray-900 dark:text-white">
        <div className="flex items-center justify-between pt-6 pb-4 border-t border-gray-200 dark:border-white/10">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Distribution Area</h3>
        </div>
        <div className={`${isMobile ? "h-64" : "h-80"} w-full flex items-center justify-center p-4`}>
          <div className="text-gray-500 dark:text-gray-400">No distribution data available</div>
        </div>
      </div>
    );
  }

  return (
    <div className="group relative overflow-visible p-0 text-gray-900 dark:text-white">
      <div className="flex items-center justify-between pt-6 pb-4 border-t border-gray-200 dark:border-white/10">
        <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Distribution Area</h3>
      </div>
      <div className={`${isMobile ? "h-64" : "h-80"} w-full flex items-center justify-center p-4`}>
        <div className="w-full h-full max-w-full">
          <HighchartsReact
            highcharts={Highcharts}
            options={chartOptions}
            ref={chartRef}
          />
        </div>
      </div>
    </div>
  );
};

export default DistributionAreaAreaChart;
