import React from 'react';
import Highcharts from 'highcharts/highmaps';
import HighchartsReact from 'highcharts-react-official';
// highcharts/highmaps already includes the maps module

const MarketingCompanyCountryTable = () => {
  const marketingCounts = [
    { trade_name: 'Abrilada', marketing_company: 'PFIZER', marketing_country: 'United States', count: 310 },
    { trade_name: 'ADVL COLD AND SINUS CAPLET', marketing_company: 'PFIZER', marketing_country: 'United States', count: 295 },
    { trade_name: 'AROMASIN 25MG COATED TAB', marketing_company: 'PFIZER', marketing_country: 'Italy', count: 188 },
    { trade_name: 'CARDURA 4 mg tablet', marketing_company: 'PFIZER', marketing_country: 'Germany', count: 176 },
    { trade_name: 'CAVERJECT 20MCG VIAL', marketing_company: 'PFIZER', marketing_country: 'Belgium', count: 171 },
    { trade_name: 'Lyrica 25', marketing_company: 'PFIZER', marketing_country: 'United States', count: 165 },
    { trade_name: 'Ibrance 100 mg capsule', marketing_company: 'PFIZER', marketing_country: 'United States', count: 152 },
    { trade_name: 'Ibrance 125 mg capsule', marketing_company: 'PFIZER', marketing_country: 'United States', count: 148 },
    { trade_name: 'DEPO-MEDROL VIAL 40MG-ML SAS', marketing_company: 'PFIZER', marketing_country: 'Belgium', count: 141 },
    { trade_name: 'DEPO-PROVERA VIAL I-M 150MG-ML', marketing_company: 'PFIZER', marketing_country: 'Belgium', count: 137 },
    { trade_name: 'Zithromax 500 mg tablet', marketing_company: 'PFIZER', marketing_country: 'Italy', count: 132 },
    { trade_name: 'Medrol 4 mg tablet', marketing_company: 'PFIZER', marketing_country: 'Italy', count: 128 },
    { trade_name: 'Ponstan Forte 500 mg film-coated tablet', marketing_company: 'PFIZER', marketing_country: 'Germany', count: 121 },
    { trade_name: 'Xanax 0.5 mg tablet', marketing_company: 'PFIZER', marketing_country: 'United States', count: 118 },
    { trade_name: 'Lipitor 20 mg tablet', marketing_company: 'PFIZER', marketing_country: 'United States', count: 112 },
    { trade_name: 'Caduet 5/10 mg tablet', marketing_company: 'PFIZER', marketing_country: 'Germany', count: 104 },
    { trade_name: 'Coartem 20/120 mg tablets', marketing_company: 'NOVARTIS', marketing_country: 'Switzerland', count: 96 },
    { trade_name: 'Diovan 80 mg tablet', marketing_company: 'NOVARTIS', marketing_country: 'Switzerland', count: 89 },
    { trade_name: 'Plavix 75 mg tablet', marketing_company: 'SANOFI', marketing_country: 'France', count: 84 },
    { trade_name: 'Augmentin 1g tablet', marketing_company: 'GSK', marketing_country: 'United Kingdom', count: 79 }
  ];

  const [mapOptions, setMapOptions] = React.useState(null);
  const [showMap, setShowMap] = React.useState(false);
  const [sidebarOpen, setSidebarOpen] = React.useState(false);

  // Aggregate counts by country and build map options
  React.useEffect(() => {
    let mounted = true;
    if (!showMap) return () => { mounted = false; };
    const build = async () => {
      try {
        const topology = await fetch('https://code.highcharts.com/mapdata/custom/world.topo.json').then(r => r.json());
        // Aggregate counts by ISO A3 inferred from country names
        const nameToIso3 = {
          'United States': 'USA',
          'Italy': 'ITA',
          'Germany': 'DEU',
          'Belgium': 'BEL'
        };
        const byCountry = marketingCounts.reduce((acc, row) => {
          const iso3 = nameToIso3[row.marketing_country];
          if (!iso3) return acc;
          acc[iso3] = (acc[iso3] || 0) + row.count;
          return acc;
        }, {});
        const data = Object.entries(byCountry).map(([code3, count]) => ({ code3, value: count }));

        const mapData = Highcharts.geojson(topology);

        const options = {
          chart: {
            map: topology,
            spacing: [2, 2, 2, 2],
            backgroundColor: 'transparent',
            style: { fontFamily: 'Inter, system-ui, sans-serif' },
            animation: false
          },
          title: { text: '' },
          subtitle: { text: '' },
          credits: { enabled: false },
          mapNavigation: { enabled: true, enableDoubleClickZoomTo: true, buttonOptions: { verticalAlign: 'bottom' } },
          mapView: {
            projection: { name: 'EqualEarth' },
            padding: 20
          },
          legend: {
            layout: 'horizontal',
            floating: false,
            backgroundColor: 'rgba(0, 0, 0, 0)',
            itemStyle: { color: '#cbd5e1' }
          },
          colorAxis: {
            min: 0,
            type: 'linear',
            minColor: '#60a5fa', // light blue for low values
            maxColor: '#0b3b91', // darker blue for higher values
            stops: [
              [0, '#60a5fa'],
              [0.5, '#2563eb'],
              [1, '#0b3b91']
            ]
          },
          tooltip: {
            useHTML: true,
            backgroundColor: 'rgba(15,23,42,0.95)',
            borderColor: '#1f2937',
            style: { color: '#e5e7eb' },
            pointFormat: '<b>{point.name}</b><br/>Count: {point.value}'
          },
          plotOptions: { series: { animation: false } },
          series: [{
            data,
            mapData,
            joinBy: ['iso-a3', 'code3'],
            name: 'Count',
            nullColor: '#3b82f6', // blue for countries without data
            borderColor: '#000000',
            borderWidth: 1.0,
            states: { hover: { color: '#60a5fa' } },
            clip: false
          }]
        };
        if (mounted) setMapOptions(options);
      } catch (_) {
        // ignore network errors for now
      }
    };
    build();
    return () => { mounted = false; };
  }, [showMap]);

  return (
    <div className="group relative overflow-visible p-0 text-gray-900 dark:text-white">
      <div className="flex items-center justify-between pt-8 pb-4">
        <h3 className="text-xl md:text-2xl font-semibold text-gray-900 dark:text-white">Count of marketing_country by marketing_company</h3>
      </div>
      {/* Toggle controls */}
      <div className="flex items-center justify-end gap-3 pb-3">
        {showMap ? (
          <>
            <button onClick={() => setSidebarOpen(s => !s)} className="px-3 py-2 text-xs rounded-md bg-white/80 dark:bg-gray-800/70 border border-gray-200/60 dark:border-white/10 text-gray-900 dark:text-white">
              {sidebarOpen ? 'Hide data' : 'Show data'}
            </button>
            <button onClick={() => { setShowMap(false); setSidebarOpen(false); }} className="px-3 py-2 text-xs rounded-md bg-white/80 dark:bg-gray-800/70 border border-gray-200/60 dark:border-white/10 text-gray-900 dark:text-white">
              Hide map
            </button>
          </>
        ) : (
          <button onClick={() => setShowMap(true)} className="px-3 py-2 text-xs rounded-md bg-white/80 dark:bg-gray-800/70 border border-gray-200/60 dark:border-white/10 text-gray-900 dark:text-white">
            Show map
          </button>
        )}
      </div>

      {/* Content area */}
      {!showMap ? (
        // Table only view
        <div className="bg-white/60 dark:bg-gray-900/60 backdrop-blur-sm rounded-2xl border border-gray-100/50 dark:border-white/5 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100/80 dark:border-white/5">
                  <th className="px-8 py-6 text-left text-[13px] font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">trade_name</th>
                  <th className="px-8 py-6 text-left text-[13px] font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">marketing_company</th>
                  <th className="px-8 py-6 text-left text-[13px] font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">marketing_country</th>
                  <th className="px-8 py-6 text-right text-[13px] font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">count</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50/50 dark:divide-white/5">
                {marketingCounts.map((row, i) => (
                  <tr key={i} className="hover:bg-white/60 dark:hover:bg-gray-800/40 transition-colors">
                    <td className="px-8 py-4 text-sm font-medium text-gray-900 dark:text-white">{row.trade_name}</td>
                    <td className="px-8 py-4 text-sm text-gray-800 dark:text-gray-200">{row.marketing_company}</td>
                    <td className="px-8 py-4 text-sm text-gray-700 dark:text-gray-300">{row.marketing_country}</td>
                    <td className="px-8 py-4 text-sm text-right text-gray-900 dark:text-gray-100">{row.count.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        // Map view with slide-in sidebar table
        <div className="relative">
          <div className="bg-white/60 dark:bg-gray-900/60 backdrop-blur-sm rounded-2xl border border-gray-100/50 dark:border-white/5 overflow-hidden shadow-sm">
            <div style={{ width: '100%', height: 520 }}>
              {mapOptions ? (
                <HighchartsReact
                  highcharts={Highcharts}
                  constructorType="mapChart"
                  options={mapOptions}
                  containerProps={{ style: { width: '100%', height: '100%' } }}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-500 dark:text-gray-400">Loading map…</div>
              )}
            </div>
          </div>

          {/* Slide-in sidebar */}
          <div className={`absolute top-2 right-2 h-[calc(100%-1rem)] w-96 max-w-[90vw] bg-white/95 dark:bg-gray-900/95 rounded-xl border border-gray-200/60 dark:border-white/10 shadow-xl transform transition-all duration-300 ${sidebarOpen ? 'translate-x-0 opacity-100 pointer-events-auto' : 'translate-x-[105%] opacity-0 pointer-events-none'}`} aria-hidden={!sidebarOpen}>
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200/60 dark:border-white/10">
              <div className="text-sm font-semibold text-gray-900 dark:text-white">Data</div>
              <button onClick={() => setSidebarOpen(false)} className="text-xs px-2 py-1 rounded-md bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200">Close</button>
            </div>
            <div className="overflow-y-auto h-[calc(100%-44px)]">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-100/80 dark:border-white/5">
                    <th className="px-4 py-3 text-left text-[12px] font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">trade_name</th>
                    <th className="px-4 py-3 text-left text-[12px] font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">marketing_company</th>
                    <th className="px-4 py-3 text-left text-[12px] font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">marketing_country</th>
                    <th className="px-4 py-3 text-right text-[12px] font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">count</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50/50 dark:divide-white/5">
                  {marketingCounts.map((row, i) => (
                    <tr key={i} className="hover:bg-white/60 dark:hover:bg-gray-800/40 transition-colors">
                      <td className="px-4 py-2.5 text-[12px] font-medium text-gray-900 dark:text-white">{row.trade_name}</td>
                      <td className="px-4 py-2.5 text-[12px] text-gray-800 dark:text-gray-200">{row.marketing_company}</td>
                      <td className="px-4 py-2.5 text-[12px] text-gray-700 dark:text-gray-300">{row.marketing_country}</td>
                      <td className="px-4 py-2.5 text-[12px] text-right text-gray-900 dark:text-gray-100">{row.count.toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Peek button when sidebar is closed */}
          {!sidebarOpen && (
            <button onClick={() => setSidebarOpen(true)} className="absolute top-4 right-4 px-3 py-2 text-xs rounded-md bg-white/80 dark:bg-gray-800/70 border border-gray-200/60 dark:border-white/10 text-gray-900 dark:text-white shadow">
              Show data
            </button>
          )}
        </div>
      )}
    </div>  
  );
};

export default MarketingCompanyCountryTable;


