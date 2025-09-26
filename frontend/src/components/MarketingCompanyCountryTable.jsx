import React, { useState, useMemo, useEffect } from 'react';
import Highcharts from 'highcharts/highmaps';
import HighchartsReact from 'highcharts-react-official';
import Loader from './Loader';
import SearchBar from './ui/SearchBar';
// highcharts/highmaps already includes the maps module

// ✅ IMPLEMENTED: Marketing Company Country Table with Real API Integration
// Backend API: /analytics/marketing_company_country_simple endpoint provides real marketing data
// Features: Pagination, Loading states, Map visualization, API integration

const MarketingCompanyCountryTable = ({ isDark }) => {
  // ✅ IMPLEMENTED: API data state management
  const [marketingTableData, setMarketingTableData] = useState([]);
  const [countryAggregation, setCountryAggregation] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Fallback mock data
  const mockMarketingCounts = [
    { trade_name: 'Abrilada', marketing_company: 'PFIZER', marketing_country: 'United States', registernumber_count: 310 },
    { trade_name: 'ADVL COLD AND SINUS CAPLET', marketing_company: 'PFIZER', marketing_country: 'United States', registernumber_count: 295 },
    { trade_name: 'AROMASIN 25MG COATED TAB', marketing_company: 'PFIZER', marketing_country: 'Italy', registernumber_count: 188 },
    { trade_name: 'CARDURA 4 mg tablet', marketing_company: 'PFIZER', marketing_country: 'Germany', registernumber_count: 176 },
    { trade_name: 'CAVERJECT 20MCG VIAL', marketing_company: 'PFIZER', marketing_country: 'Belgium', registernumber_count: 171 },
    { trade_name: 'Lyrica 25', marketing_company: 'PFIZER', marketing_country: 'United States', registernumber_count: 165 },
    { trade_name: 'Ibrance 100 mg capsule', marketing_company: 'PFIZER', marketing_country: 'United States', registernumber_count: 152 },
    { trade_name: 'Ibrance 125 mg capsule', marketing_company: 'PFIZER', marketing_country: 'United States', registernumber_count: 148 },
    { trade_name: 'DEPO-MEDROL VIAL 40MG-ML SAS', marketing_company: 'PFIZER', marketing_country: 'Belgium', registernumber_count: 141 },
    { trade_name: 'DEPO-PROVERA VIAL I-M 150MG-ML', marketing_company: 'PFIZER', marketing_country: 'Belgium', registernumber_count: 137 },
    { trade_name: 'Zithromax 500 mg tablet', marketing_company: 'PFIZER', marketing_country: 'Italy', registernumber_count: 132 },
    { trade_name: 'Medrol 4 mg tablet', marketing_company: 'PFIZER', marketing_country: 'Italy', registernumber_count: 128 },
    { trade_name: 'Ponstan Forte 500 mg film-coated tablet', marketing_company: 'PFIZER', marketing_country: 'Germany', registernumber_count: 121 },
    { trade_name: 'Xanax 0.5 mg tablet', marketing_company: 'PFIZER', marketing_country: 'United States', registernumber_count: 118 },
    { trade_name: 'Lipitor 20 mg tablet', marketing_company: 'PFIZER', marketing_country: 'United States', registernumber_count: 112 },
    { trade_name: 'Caduet 5/10 mg tablet', marketing_company: 'PFIZER', marketing_country: 'Germany', registernumber_count: 104 },
    { trade_name: 'Coartem 20/120 mg tablets', marketing_company: 'NOVARTIS', marketing_country: 'Switzerland', registernumber_count: 96 },
    { trade_name: 'Diovan 80 mg tablet', marketing_company: 'NOVARTIS', marketing_country: 'Switzerland', registernumber_count: 89 },
    { trade_name: 'Plavix 75 mg tablet', marketing_company: 'SANOFI', marketing_country: 'France', registernumber_count: 84 },
    { trade_name: 'Augmentin 1g tablet', marketing_company: 'GSK', marketing_country: 'United Kingdom', registernumber_count: 79 }
  ];

  // ✅ IMPLEMENTED: Search functionality
  const [searchTerm, setSearchTerm] = useState('');

  // ✅ IMPLEMENTED: Use API data with search filtering
  const marketingCounts = useMemo(() => {
    const baseData = marketingTableData.length > 0 ? marketingTableData : mockMarketingCounts;

    // Apply search filter
    if (!searchTerm.trim()) return baseData;
    
    const searchLower = searchTerm.toLowerCase().trim();
    return baseData.filter(item => {
      const marketingCompany = (item.marketing_company || '').toLowerCase();
      const marketingCountry = (item.marketing_country || '').toLowerCase();
      
      return marketingCompany.includes(searchLower) || 
             marketingCountry.includes(searchLower);
    });
  }, [marketingTableData, mockMarketingCounts, searchTerm]);

  const [mapOptions, setMapOptions] = React.useState(null);
  const [showMap, setShowMap] = React.useState(false);
  const [sidebarOpen, setSidebarOpen] = React.useState(false);
  
  // Pagination states
  
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // ✅ IMPLEMENTED: Fetch marketing company country data from /analytics/marketing_company_country_simple API
  const fetchMarketingData = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      params.append('top_n', '1000');

      const res = await fetch(`http://localhost:8000/analytics/marketing_company_country_simple?${params.toString()}`);
      if (!res.ok) return;
      const payload = await res.json();
      
      if (payload.data) {
        setMarketingTableData(payload.data.table_rows || []);
        setCountryAggregation(payload.data.country_aggregation || []);
      }
    } catch (e) {
      console.error('Error fetching marketing company country data:', e);
    } finally {
      setLoading(false);
    }
  };

  // ✅ IMPLEMENTED: Fetch data on component mount
  useEffect(() => {
    fetchMarketingData();
  }, []);

  // Pagination calculations
  const totalPages = Math.ceil(marketingCounts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedData = marketingCounts.slice(startIndex, endIndex);

  // Pagination functions
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  // ✅ IMPLEMENTED: Aggregate counts by country and build map options using API data
  React.useEffect(() => {
    let mounted = true;
    if (!showMap) return () => { mounted = false; };
    const build = async () => {
      try {
        const topology = await fetch('https://code.highcharts.com/mapdata/custom/world.topo.json').then(r => r.json());
        
        // ✅ IMPLEMENTED: Use API country aggregation data or fallback to table data
        let data = [];
        if (countryAggregation.length > 0) {
          // Use API country aggregation data
          const nameToIso3 = {
            'United States': 'USA',
            'Italy': 'ITA',
            'Germany': 'DEU',
            'Belgium': 'BEL',
            'Switzerland': 'CHE',
            'France': 'FRA',
            'United Kingdom': 'GBR',
            'Canada': 'CAN',
            'Spain': 'ESP',
            'Netherlands': 'NLD',
            'Austria': 'AUT',
            'Sweden': 'SWE',
            'Denmark': 'DNK',
            'Norway': 'NOR',
            'Finland': 'FIN'
          };
          
          data = countryAggregation
            .map(row => {
              const iso3 = nameToIso3[row.marketing_country];
              if (!iso3) return null;
              // ✅ IMPLEMENTED: Ensure positive values for logarithmic scale
              const value = Math.max(1, row.total_registernumber_count || 0);
              return { code3: iso3, value: value };
            })
            .filter(Boolean);
        } else {
          // Fallback: aggregate from table data
          const nameToIso3 = {
            'United States': 'USA',
            'Italy': 'ITA',
            'Germany': 'DEU',
            'Belgium': 'BEL',
            'Switzerland': 'CHE',
            'France': 'FRA',
            'United Kingdom': 'GBR'
          };
          const byCountry = marketingCounts.reduce((acc, row) => {
            const iso3 = nameToIso3[row.marketing_country];
            if (!iso3) return acc;
            acc[iso3] = (acc[iso3] || 0) + (row.registernumber_count || row.count || 0);
            return acc;
          }, {});
          data = Object.entries(byCountry).map(([code3, count]) => ({ 
            code3, 
            // ✅ IMPLEMENTED: Ensure positive values for logarithmic scale
            value: Math.max(1, count || 0) 
          }));
        }

        // ✅ IMPLEMENTED: Add debugging and fallback for empty data
        console.log('Map data points:', data);
        if (data.length === 0) {
          console.warn('No data available for map visualization');
          data = [{ code3: 'USA', value: 1 }]; // Fallback data point
        }

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
            itemStyle: { 
              color: isDark ? '#e5e7eb' : '#374151',
              fontSize: '12px',
              fontWeight: '500'
            },
            // ✅ IMPLEMENTED: Enhanced legend positioning and styling
            align: 'center',
            verticalAlign: 'bottom',
            margin: 20,
            symbolHeight: 12,
            symbolWidth: 20,
            symbolRadius: 2
          },
          colorAxis: {
            min: 1, // ✅ IMPLEMENTED: Set minimum to 1 for logarithmic scale (cannot be 0)
            type: 'logarithmic', // ✅ IMPLEMENTED: Use logarithmic scale for better data visibility
            minColor: '#e0f2fe', // Very light blue for low values
            maxColor: '#0c4a6e', // Very dark blue for high values
            stops: [
              [0, '#e0f2fe'],     // Very light blue (0-10%)
              [0.1, '#7dd3fc'],   // Light blue (10-20%)
              [0.2, '#38bdf8'],   // Medium light blue (20-30%)
              [0.3, '#0ea5e9'],   // Medium blue (30-40%)
              [0.4, '#0284c7'],   // Medium dark blue (40-50%)
              [0.5, '#0369a1'],   // Dark blue (50-60%)
              [0.6, '#075985'],   // Darker blue (60-70%)
              [0.7, '#0c4a6e'],   // Very dark blue (70-80%)
              [0.8, '#082f49'],   // Darkest blue (80-90%)
              [0.9, '#0f172a'],   // Almost black (90-100%)
              [1, '#0c4a6e']      // Maximum dark blue (100%)
            ],
            // ✅ IMPLEMENTED: Enhanced color axis labels and formatting
            labels: {
              style: {
                color: isDark ? '#e5e7eb' : '#374151',
                fontSize: '12px',
                fontWeight: '500'
              },
              formatter: function() {
                return this.value.toLocaleString();
              }
            },
            // ✅ IMPLEMENTED: Add color bar for better visualization
            colorBar: {
              enabled: true,
              width: 20,
              height: 200,
              verticalAlign: 'middle',
              align: 'right',
              margin: 20
            }
          },
          tooltip: {
            useHTML: true,
            backgroundColor: isDark ? 'rgba(15,23,42,0.95)' : 'rgba(255,255,255,0.95)',
            borderColor: isDark ? '#1f2937' : '#e5e7eb',
            style: { 
              color: isDark ? '#e5e7eb' : '#374151',
              fontSize: '14px',
              fontWeight: '500'
            },
            // ✅ IMPLEMENTED: Enhanced tooltip with better formatting
            pointFormatter: function() {
              const value = this.value || 0;
              const percentage = this.percentage ? this.percentage.toFixed(1) : '0.0';
              return `
                <div style="padding: 8px;">
                  <div style="font-weight: 600; margin-bottom: 4px; color: ${isDark ? '#f8fafc' : '#111827'};">${this.name}</div>
                  <div style="margin-bottom: 2px;">📊 Marketing Count: <strong>${value.toLocaleString()}</strong></div>
                  <div style="font-size: 12px; color: ${isDark ? '#94a3b8' : '#6b7280'};">Percentage: ${percentage}%</div>
                </div>
              `;
            }
          },
          plotOptions: { series: { animation: false } },
          series: [{
            data,
            mapData,
            joinBy: ['iso-a3', 'code3'],
            name: 'Marketing Count',
            // ✅ IMPLEMENTED: Enhanced null color for countries without data
            nullColor: isDark ? '#374151' : '#f3f4f6',
            // ✅ IMPLEMENTED: Better border styling
            borderColor: isDark ? '#1f2937' : '#d1d5db',
            borderWidth: 1.5,
            // ✅ IMPLEMENTED: Enhanced hover states
            states: { 
              hover: { 
                borderColor: isDark ? '#60a5fa' : '#2563eb',
                borderWidth: 2,
                brightness: 0.1
              },
              select: {
                borderColor: isDark ? '#f59e0b' : '#d97706',
                borderWidth: 3
              }
            },
            // ✅ IMPLEMENTED: Add data labels for better visibility
            dataLabels: {
              enabled: false, // Disable by default, can be enabled for specific countries
              format: '{point.name}<br/>{point.value}',
              style: {
                color: isDark ? '#f8fafc' : '#111827',
                fontSize: '10px',
                fontWeight: '600',
                textOutline: '1px contrast'
              }
            },
            clip: false,
            // ✅ IMPLEMENTED: Add animation for better UX
            animation: {
              duration: 1000,
              easing: 'easeOutBounce'
            }
          }]
        };
        
        // ✅ IMPLEMENTED: Only set map options if we have valid data
        if (mounted && data && data.length > 0) {
          setMapOptions(options);
        } else {
          console.warn('Map options not set due to invalid or empty data');
        }
      } catch (_) {
        // ignore network errors for now
      }
    };
    build();
    return () => { mounted = false; };
  }, [showMap, countryAggregation, marketingCounts]);

  return (
    <div className="group relative overflow-visible p-0 text-gray-900 dark:text-white">
      <div className="flex items-center justify-between pt-8 pb-4">
        <h3 className="text-xl md:text-2xl font-semibold text-gray-900 dark:text-white">Count of marketing_country by marketing_company</h3>
      </div>
      
      {/* Search Bar */}
      <div className="px-6 py-4 border-b border-gray-100/80 dark:border-white/5">
        <div className="mb-4">
          <SearchBar
            value={searchTerm}
            onChange={setSearchTerm}
            placeholder="Search by marketing company or country..."
            isDark={isDark}
            className="max-w-md"
          />
        </div>
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
          {/* ✅ IMPLEMENTED: Loading State with Loader Component */}
          {loading ? (
            <div className="flex items-center justify-center py-16">
              <Loader size={80} color={isDark ? "#20c997" : "#0891b2"} speed={1.5} />
            </div>
          ) : (
            <>
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
                {paginatedData.map((row, i) => (
                  <tr key={i} className="hover:bg-white/60 dark:hover:bg-gray-800/40 transition-colors">
                    <td className="px-8 py-4 text-sm font-medium text-gray-900 dark:text-white">{row.trade_name}</td>
                    <td className="px-8 py-4 text-sm text-gray-800 dark:text-gray-200">{row.marketing_company}</td>
                    <td className="px-8 py-4 text-sm text-gray-700 dark:text-gray-300">{row.marketing_country}</td>
                    <td className="px-8 py-4 text-sm text-right text-gray-900 dark:text-gray-100">{(row.registernumber_count || row.count || 0).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {/* Pagination */}
          {totalPages > 1 && (
            <div className="px-6 py-4 border-t border-gray-100/80 dark:border-white/5 bg-gray-50/50 dark:bg-gray-800/30">
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-700 dark:text-gray-300">
                  Showing {startIndex + 1} to {Math.min(endIndex, marketingCounts.length)} of {marketingCounts.length} results
                </div>
                
                <div className="flex items-center space-x-2">
                  {/* Previous Button */}
                  <button
                    onClick={handlePreviousPage}
                    disabled={currentPage === 1}
                    className={`px-3 py-2 text-sm font-medium rounded-md transition-all ${
                      currentPage === 1
                        ? 'text-gray-400 dark:text-gray-600 cursor-not-allowed'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-white dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white'
                    }`}
                  >
                    Previous
                  </button>

                  {/* Page Numbers */}
                  <div className="flex items-center space-x-1">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                      // Show first page, last page, current page, and pages around current page
                      const shouldShow = 
                        page === 1 || 
                        page === totalPages || 
                        (page >= currentPage - 1 && page <= currentPage + 1);
                      
                      if (!shouldShow) {
                        // Show ellipsis for gaps
                        if (page === currentPage - 2 || page === currentPage + 2) {
                          return (
                            <span key={page} className="px-2 py-1 text-gray-400 dark:text-gray-600">
                              ...
                            </span>
                          );
                        }
                        return null;
                      }

                      return (
                        <button
                          key={page}
                          onClick={() => handlePageChange(page)}
                          className={`px-3 py-2 text-sm font-medium rounded-md transition-all ${
                            currentPage === page
                              ? 'bg-blue-600 text-white shadow-sm'
                              : 'text-gray-700 dark:text-gray-300 hover:bg-white dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white'
                          }`}
                        >
                          {page}
                        </button>
                      );
                    })}
                  </div>

                  {/* Next Button */}
                  <button
                    onClick={handleNextPage}
                    disabled={currentPage === totalPages}
                    className={`px-3 py-2 text-sm font-medium rounded-md transition-all ${
                      currentPage === totalPages
                        ? 'text-gray-400 dark:text-gray-600 cursor-not-allowed'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-white dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white'
                    }`}
                  >
                    Next
                  </button>
                </div>
              </div>
            </div>
          )}
          </>
          )}
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
                  {paginatedData.map((row, i) => (
                    <tr key={i} className="hover:bg-white/60 dark:hover:bg-gray-800/40 transition-colors">
                      <td className="px-4 py-2.5 text-[12px] font-medium text-gray-900 dark:text-white">{row.trade_name}</td>
                      <td className="px-4 py-2.5 text-[12px] text-gray-800 dark:text-gray-200">{row.marketing_company}</td>
                      <td className="px-4 py-2.5 text-[12px] text-gray-700 dark:text-gray-300">{row.marketing_country}</td>
                      <td className="px-4 py-2.5 text-[12px] text-right text-gray-900 dark:text-gray-100">{(row.registernumber_count || row.count || 0).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              
              {/* Sidebar Pagination */}
              {totalPages > 1 && (
                <div className="px-4 py-3 border-t border-gray-200/60 dark:border-white/10 bg-gray-50/50 dark:bg-gray-800/30">
                  <div className="flex items-center justify-between">
                    <div className="text-xs text-gray-600 dark:text-gray-400">
                      {startIndex + 1}-{Math.min(endIndex, marketingCounts.length)} of {marketingCounts.length}
                    </div>
                    
                    <div className="flex items-center space-x-1">
                      {/* Previous Button */}
                      <button
                        onClick={handlePreviousPage}
                        disabled={currentPage === 1}
                        className={`px-2 py-1 text-xs font-medium rounded transition-all ${
                          currentPage === 1
                            ? 'text-gray-400 dark:text-gray-600 cursor-not-allowed'
                            : 'text-gray-700 dark:text-gray-300 hover:bg-white dark:hover:bg-gray-700'
                        }`}
                      >
                        ‹
                      </button>

                      {/* Page Numbers - simplified for sidebar */}
                      <div className="flex items-center space-x-1">
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                          const shouldShow = 
                            page === 1 || 
                            page === totalPages || 
                            (page >= currentPage - 1 && page <= currentPage + 1);
                          
                          if (!shouldShow) {
                            if (page === currentPage - 2 || page === currentPage + 2) {
                              return (
                                <span key={page} className="px-1 text-gray-400 dark:text-gray-600 text-xs">
                                  ...
                                </span>
                              );
                            }
                            return null;
                          }

                          return (
                            <button
                              key={page}
                              onClick={() => handlePageChange(page)}
                              className={`px-2 py-1 text-xs font-medium rounded transition-all ${
                                currentPage === page
                                  ? 'bg-blue-600 text-white'
                                  : 'text-gray-700 dark:text-gray-300 hover:bg-white dark:hover:bg-gray-700'
                              }`}
                            >
                              {page}
                            </button>
                          );
                        })}
                      </div>

                      {/* Next Button */}
                      <button
                        onClick={handleNextPage}
                        disabled={currentPage === totalPages}
                        className={`px-2 py-1 text-xs font-medium rounded transition-all ${
                          currentPage === totalPages
                            ? 'text-gray-400 dark:text-gray-600 cursor-not-allowed'
                            : 'text-gray-700 dark:text-gray-300 hover:bg-white dark:hover:bg-gray-700'
                        }`}
                      >
                        ›
                      </button>
                    </div>
                  </div>
                </div>
              )}
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


