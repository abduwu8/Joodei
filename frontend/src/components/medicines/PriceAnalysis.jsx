import React from 'react';
import Highcharts from 'highcharts';

// Price Analysis: encapsulates filters, tab switcher, table and graph views
// UI-only component; expects a prepared medicines list and helpers from parent.
// API: Parent owns data and passes props; this component does not fetch.

const PriceAnalysis = ({
  isDark,
  PIE_BAR_COLORS,
  authorizationStatuses,
  distributeAreasOptions,
  selectedAuthorizationStatuses,
  setSelectedAuthorizationStatuses,
  selectedDistributeAreas,
  setSelectedDistributeAreas,
  activeTab,
  setActiveTab,
  viewMode,
  setViewMode,
  topMedicines,
  bottomMedicines,
  getCountryFlag
}) => {
  // Helper to toggle values inside multi-select arrays
  const createToggleHandler = (setter) => (value) => {
    setter((prev) => (prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]));
  };

  // Chart renderer for Highcharts graph view
  const renderChart = (containerId, data, isTop) => {
    if (typeof Highcharts === 'undefined') return;
    const chartData = data.map((medicine) => [
      medicine.trade_name.length > 20 ? medicine.trade_name.substring(0, 20) + '...' : medicine.trade_name,
      isTop ? medicine.public_price / 1000000 : medicine.public_price
    ]);

    const colors = isTop
      ? ['#00d4aa', '#00b8a9', '#009c9f', '#008095', '#00648b', '#004881', '#002c77', '#00106d', '#000063', '#000059']
      : ['#ff6b35', '#ff8e53', '#ffb171', '#ffd48f', '#fff7ad', '#e6d89b', '#ccb989', '#b39a77', '#997b65', '#805c53'];

    Highcharts.chart(containerId, {
      chart: { type: 'column', backgroundColor: 'transparent', style: { fontFamily: 'Inter, system-ui, sans-serif' } },
      title: { text: `${isTop ? 'Top 10' : 'Bottom 10'} Medicines by Price`, style: { color: isTop ? '#00d4aa' : '#ff6b35', fontSize: '18px', fontWeight: '600' } },
      subtitle: { text: isTop ? 'Highest value medicines in the market' : 'Most affordable medicines available', style: { color: '#6b7280', fontSize: '14px' } },
      xAxis: { type: 'category', labels: { autoRotation: [-45, -90], style: { fontSize: '12px', fontFamily: 'Inter, system-ui, sans-serif', color: '#6b7280' } }, lineColor: '#e5e7eb', tickColor: '#e5e7eb' },
      yAxis: { min: 0, title: { text: isTop ? 'Price (Millions USD)' : 'Price (USD)', style: { color: '#6b7280', fontSize: '14px' } }, labels: { style: { color: '#6b7280', fontSize: '12px' } }, gridLineColor: '#f3f4f6' },
      legend: { enabled: false },
      tooltip: { backgroundColor: 'rgba(255, 255, 255, 0.95)', borderColor: '#e5e7eb', borderRadius: 8, shadow: true, style: { fontSize: '13px' }, pointFormat: isTop ? 'Price: <b>${point.y:.1f}M</b>' : 'Price: <b>${point.y:.2f}</b>' },
      series: [{ name: 'Price', colors, colorByPoint: true, groupPadding: 0.1, pointPadding: 0.05, data: chartData, dataLabels: { enabled: true, rotation: -90, color: '#FFFFFF', inside: true, verticalAlign: 'top', format: isTop ? '{point.y:.1f}M' : '${point.y:.2f}', y: 10, style: { fontSize: '11px', fontFamily: 'Inter, system-ui, sans-serif', fontWeight: '600', textShadow: '0 1px 2px rgba(0,0,0,0.3)' } } }],
      credits: { enabled: false }
    });
  };

  React.useEffect(() => {
    if (viewMode === 'graph' && typeof Highcharts !== 'undefined') {
      // Ensure the DOM node exists before rendering chart
      const id = `chart-container-${activeTab}`;
      const el = document.getElementById(id);
      if (!el) return;
      setTimeout(() => {
        renderChart(id, activeTab === 'top' ? topMedicines : bottomMedicines, activeTab === 'top');
      }, 50);
    }
  }, [viewMode, activeTab, topMedicines, bottomMedicines]);

  return (
    <div className="col-span-1 md:col-span-2 mt-[60px] pt-16 md:pt-32">
      {/* Price Analysis: filters + tabbed table/graph views */}
      <div className="group relative overflow-visible p-0 text-gray-900 dark:text-white">
        <div className="flex items-center justify-between pt-8 pb-4">
          <h3 className="text-xl md:text-2xl font-semibold text-gray-900 dark:text-white">Medicine Price Analysis</h3>
        </div>

        {/* Filters for Price Analysis (authorization_status, distribute_area) */}
        <div className="mb-4 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <div className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">authorization_status</div>
            <div className="flex items-center gap-4">
              {authorizationStatuses.map((status) => (
                <label key={status} className="inline-flex items-center gap-2 text-sm text-gray-700 dark:text-gray-200">
                  <input type="checkbox" className="h-4 w-4 rounded border-gray-300 text-gray-900 focus:ring-gray-500 dark:border-white/20 dark:bg-transparent" checked={selectedAuthorizationStatuses.includes(status)} onChange={() => createToggleHandler(setSelectedAuthorizationStatuses)(status)} />
                  <span>{status}</span>
                </label>
              ))}
            </div>
          </div>
          <div>
            <div className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">distribute_area</div>
            <div className="flex items-center gap-4">
              {distributeAreasOptions.map((area) => (
                <label key={area} className="inline-flex items-center gap-2 text-sm text-gray-700 dark:text-gray-200">
                  <input type="checkbox" className="h-4 w-4 rounded border-gray-300 text-gray-900 focus:ring-gray-500 dark:border-white/20 dark:bg-transparent" checked={selectedDistributeAreas.includes(area)} onChange={() => createToggleHandler(setSelectedDistributeAreas)(area)} />
                  <span>{area}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* View Mode Toggle */}
        <div className="flex justify-end mb-6">
          <div className="flex items-center space-x-2 bg-gray-100 dark:bg-gray-800/50 rounded-lg p-1">
            <button onClick={() => setViewMode('table')} className={`px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 ${viewMode === 'table' ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm' : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'}`}> 
              <div className="flex items-center space-x-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H6a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
                <span>Table</span>
              </div>
            </button>
            <button onClick={() => setViewMode('graph')} className={`px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 ${viewMode === 'graph' ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm' : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'}`}>
              <div className="flex items-center space-x-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" /></svg>
                <span>Graph</span>
              </div>
            </button>
          </div>
        </div>

        {/* Content Container with Smooth Transitions */}
        <div className="relative overflow-hidden">
          {/* Table View */}
          <div className={`transition-all duration-700 ease-in-out ${viewMode === 'table' ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 -translate-y-8 scale-95 pointer-events-none absolute inset-0 z-10'}`}>
            <div className="bg-white/60 dark:bg-gray-900/60 backdrop-blur-sm rounded-2xl border border-gray-100/50 dark:border-white/5 overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-100/80 dark:border-white/5">
                      <th className="px-8 py-6 text-left text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-widest">#</th>
                      <th className="px-8 py-6 text-left text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-widest">Medicine</th>
                      <th className="px-8 py-6 text-left text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-widest">Origin</th>
                      <th className="px-8 py-6 text-right text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-widest">Price</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50/50 dark:divide-white/5">
                    {(activeTab === 'top' ? topMedicines : bottomMedicines).map((medicine, index) => (
                      <tr key={index} className="group hover:bg-white/40 dark:hover:bg-gray-800/40 transition-all duration-200">
                        <td className="px-8 py-5 whitespace-nowrap"><div className="flex items-center"><span className={`text-sm font-medium ${activeTab === 'top' ? 'text-cyan-600 dark:text-cyan-400' : 'text-orange-600 dark:text-orange-400'}`}>{index + 1}</span></div></td>
                        <td className="px-8 py-5"><div className="text-sm font-semibold text-gray-900 dark:text-white tracking-tight">{medicine.trade_name}</div></td>
                        <td className="px-8 py-5">
                          {(() => {
                            const country = medicine.manufacture_country || 'Unknown';
                            return (
                              <div className="flex items-center"><span className="text-lg mr-3">{getCountryFlag(country)}</span><span className="text-sm text-gray-500 dark:text-gray-400 font-medium">{country}</span></div>
                            );
                          })()}
                        </td>
                        <td className="px-8 py-5 text-right">
                          <div className="flex items-center justify-end space-x-3">
                            <div className={`text-sm font-bold tracking-tight ${activeTab === 'top' ? 'text-cyan-600 dark:text-cyan-400' : 'text-orange-600 dark:text-orange-400'}`}>
                              {medicine.public_price >= 1000000 ? `$${(medicine.public_price / 1000000).toFixed(1)}M` : `$${medicine.public_price.toFixed(2)}`}
                            </div>
                            <div className="flex items-center space-x-2">
                              <div className="w-16 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                                <div className={`h-full rounded-full transition-all duration-300 ${activeTab === 'top' ? 'bg-gradient-to-r from-cyan-400 to-teal-500' : 'bg-gradient-to-r from-orange-400 to-red-500'}`} style={{ width: `${Math.min(100, Math.max(5, (index + 1) * 10))}%` }}></div>
                              </div>
                              <span className={`text-xs font-semibold ${activeTab === 'top' ? 'text-cyan-600 dark:text-cyan-400' : 'text-orange-600 dark:text-orange-400'}`}>
                                {activeTab === 'top' ? `+${(100 - (index + 1) * 10).toFixed(0)}%` : `-${(index + 1) * 10}%`}
                              </span>
                            </div>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Graph View */}
          <div className={`transition-all duration-700 ease-in-out ${viewMode === 'graph' ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-8 scale-95 pointer-events-none absolute inset-0 z-20'}`}>
            <div className="bg-white/60 dark:bg-gray-900/60 backdrop-blur-sm rounded-2xl border border-gray-100/50 dark:border-white/5 overflow-hidden shadow-sm p-8">
              <div className="space-y-6">
                <h4 className="text-lg font-semibold text-gray-900 dark:text-white text-center mb-8">{activeTab === 'top' ? 'Top 10' : 'Bottom 10'} Medicines Price Distribution</h4>
                {/* Highcharts Column Chart */}
                <div id={`chart-container-${activeTab}`} className="w-full h-96"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex space-x-1 mb-6 bg-gray-100 dark:bg-gray-800/50 rounded-lg p-1 mt-6">
          <button onClick={() => setActiveTab('top')} className={`flex-1 px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 ${activeTab === 'top' ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm' : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'}`}>Top 10 Medicines</button>
          <button onClick={() => setActiveTab('bottom')} className={`flex-1 px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 ${activeTab === 'bottom' ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm' : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'}`}>Bottom 10 Medicines</button>
        </div>
      </div>
    </div>
  );
};

export default PriceAnalysis;


