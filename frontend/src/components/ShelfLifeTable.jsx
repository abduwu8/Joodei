import React, { useState, useMemo, useEffect } from 'react';
import { IconChevronDown } from '@tabler/icons-react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import 'highcharts/modules/treemap';
import Loader from './Loader';
import SearchBar from './ui/SearchBar';

// ✅ IMPLEMENTED: Shelf Life Analysis with Real API Integration
// Backend API: /analysis/shelf_life endpoint provides real shelf life data
// Features: Filters, Pagination, Loading states, Heatmap, Bar chart visualization

const ShelfLifeTable = ({ isDark }) => {
  // ✅ IMPLEMENTED: API data state management
  const [shelfLifeTableData, setShelfLifeTableData] = useState([]);
  const [topManufacturingCountries, setTopManufacturingCountries] = useState([]);
  const [topManufacturers, setTopManufacturers] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Fallback mock data
  const mockShelfLifeData = [
    { registernumber: '101244649', trade_name: 'United States Medicine 1', shelflife: '24' },
    { registernumber: '101244650', trade_name: 'United States Medicine 2', shelflife: '36' },
    { registernumber: '101256513', trade_name: 'Germany Medicine 1', shelflife: '12' },
    { registernumber: '102210483', trade_name: 'Italy Medicine 1', shelflife: '48' },
    { registernumber: '102210484', trade_name: 'France Medicine 1', shelflife: '18' }
  ];

  // ✅ IMPLEMENTED: Use API data with fallback to mock data
  const shelfLifeData = shelfLifeTableData.length > 0 ? shelfLifeTableData : mockShelfLifeData;

  // UI: table filters (drugtype, legal_status)
  const [selectedDrugtypes, setSelectedDrugtypes] = useState([]);
  const [selectedLegalStatuses, setSelectedLegalStatuses] = useState([]);
  const [viewMode, setViewMode] = useState('table'); // 'table', 'heatmap', or 'barchart'
  
  // ✅ IMPLEMENTED: Search functionality
  const [searchTerm, setSearchTerm] = useState('');
  
  // UI: pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // ✅ IMPLEMENTED: Fetch shelf life data from /analysis/shelf_life API
  const fetchShelfLifeData = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      
      // Add filter parameters if selected
      if (selectedDrugtypes.length > 0) {
        selectedDrugtypes.forEach(drugtype => params.append('drugtype', drugtype));
      }
      if (selectedLegalStatuses.length > 0) {
        selectedLegalStatuses.forEach(legalStatus => params.append('legal_status', legalStatus));
      }
      
      params.append('limit', '500');

      const url = `http://localhost:8000/analysis/shelf_life?${params.toString()}`;
      console.log('🔍 Fetching shelf life data with filters:', {
        selectedDrugtypes,
        selectedLegalStatuses,
        url
      });

      const res = await fetch(url);
      if (!res.ok) {
        console.error('❌ API request failed:', res.status, res.statusText);
        return;
      }
      const payload = await res.json();
      
      console.log('✅ API response received:', {
        totalRows: payload.data?.rows?.length || 0,
        manufacturingCountries: payload.data?.top_5_manufacturing_countries?.length || 0,
        manufacturers: payload.data?.top_20_manufacturers?.length || 0
      });
      
      if (payload.data) {
        setShelfLifeTableData(payload.data.rows || []);
        setTopManufacturingCountries(payload.data.top_5_manufacturing_countries || []);
        setTopManufacturers(payload.data.top_20_manufacturers || []);
      }
    } catch (e) {
      console.error('❌ Error fetching shelf life data:', e);
    } finally {
      setLoading(false);
    }
  };

  // ✅ IMPLEMENTED: Fetch data on component mount and when filters change
  useEffect(() => {
    fetchShelfLifeData();
  }, [selectedDrugtypes, selectedLegalStatuses]);

  // UI: filter options (static). Consider deriving from API metadata
  const drugtypes = ['Biological', 'Generic', 'NCE', 'Radiopharmaceutical'];
  const legalStatuses = ['OTC', 'Prescription'];

  // Color mapping for different drug types - vibrant colors like the country treemap
  const getColorForDrugType = (drugtype) => {
    const colors = {
      'Biological': '#FBBF24',      // Bright sunny yellow
      'Generic': '#35B48F',         // Vibrant teal/seafoam green
      'NCE': '#1883AA',             // Medium bright blue
      'Radiopharmaceutical': '#1E40AF' // Deep rich navy blue
    };
    return colors[drugtype] || '#89AB56';
  };

  // Color mapping for countries - vibrant colors like the country treemap
  const getColorForCountry = (country) => {
    const colors = {
      'United States': '#FBBF24',      // Bright sunny yellow
      'Germany': '#35B48F',            // Vibrant teal/seafoam green
      'Italy': '#1883AA',              // Medium bright blue
      'France': '#1E40AF',             // Deep rich navy blue
      'India': '#89AB56',              // Light muted olive green
      'United Kingdom': '#F9B31B',     // Deeper golden yellow
      'Spain': '#16A4A8',              // Darker blue-leaning teal
      'Ireland': '#1B61AD',            // Darker royal blue
      'Switzerland': '#F7A711',        // Orange-yellow
      'Saudi Arabia': '#DCA11C',       // Muted earthy gold
      'Canada': '#FBBF24',             // Bright sunny yellow
      'Belgium': '#35B48F',            // Vibrant teal/seafoam green
      'China': '#1883AA',              // Medium bright blue
      'Greece': '#1E40AF',             // Deep rich navy blue
      'Portugal': '#89AB56',           // Light muted olive green
      'Netherlands': '#F9B31B',        // Deeper golden yellow
      'Jordan': '#16A4A8',             // Darker blue-leaning teal
      'Sweden': '#1B61AD',             // Darker royal blue
      'Poland': '#F7A711',             // Orange-yellow
      'Turkey': '#DCA11C',             // Muted earthy gold
      'Japan': '#FBBF24',              // Bright sunny yellow
      'Denmark': '#35B48F',            // Vibrant teal/seafoam green
      'Unknown': '#89AB56'             // Light muted olive green
    };
    return colors[country] || '#89AB56';
  };

  // ✅ IMPLEMENTED: Use API data with search filtering
  // Backend handles filter parameters, frontend handles search
  const filteredData = useMemo(() => {
    if (!searchTerm.trim()) return shelfLifeData;
    
    const searchLower = searchTerm.toLowerCase().trim();
    return shelfLifeData.filter(item => {
      const tradeName = (item.trade_name || '').toLowerCase();
      const registernumber = (item.registernumber || '').toLowerCase();
      const shelflife = (item.shelflife || '').toString().toLowerCase();
      
      return tradeName.includes(searchLower) || 
             registernumber.includes(searchLower) || 
             shelflife.includes(searchLower);
    });
  }, [shelfLifeData, searchTerm]);

  // Pagination calculations
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedData = filteredData.slice(startIndex, endIndex);

  // Reset to first page when filters or search change
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedDrugtypes, selectedLegalStatuses, searchTerm]);

  const handleDrugtypeChange = (drugtype) => {
    console.log('🔧 Drugtype filter changed:', drugtype);
    setSelectedDrugtypes(prev => {
      const newSelection = prev.includes(drugtype) 
        ? prev.filter(item => item !== drugtype)
        : [...prev, drugtype];
      console.log('🔧 New drugtype selection:', newSelection);
      return newSelection;
    });
  };

  const handleLegalStatusChange = (legalStatus) => {
    console.log('🔧 Legal status filter changed:', legalStatus);
    setSelectedLegalStatuses(prev => {
      const newSelection = prev.includes(legalStatus) 
        ? prev.filter(item => item !== legalStatus)
        : [...prev, legalStatus];
      console.log('🔧 New legal status selection:', newSelection);
      return newSelection;
    });
  };

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

  // ✅ IMPLEMENTED: Transform for heatmap (treemap) by manufacturing country using API data
  const heatmapData = useMemo(() => {
    // Use API manufacturing countries data if available, otherwise fallback to table data
    if (topManufacturingCountries.length > 0) {
      return topManufacturingCountries.map((item, index) => ({
        id: `country-${index}`,
        name: item.manufacture_country || 'Unknown',
        value: item.count_registernumber || 0,
        shelflife: 0, // API doesn't provide shelf life for countries
        color: getColorForCountry(item.manufacture_country)
      }));
    }

    // Fallback: Group by country from table data
    const grouped = filteredData.reduce((acc, item) => {
      const country = item.country || 'Unknown';
      if (!acc[country]) {
        acc[country] = {
          country: country,
          count: 0,
          totalShelfLife: 0
        };
      }
      acc[country].count += 1;
      acc[country].totalShelfLife += parseInt(item.shelflife) || 0;
      return acc;
    }, {});

    // Create treemap data structure with country names and vibrant colors
    const data = Object.values(grouped).map((item, index) => ({
      id: `country-${index}`,
      name: item.country,
      value: item.count,
      shelflife: item.totalShelfLife / item.count,
      color: getColorForCountry(item.country)
    }));

    return data;
  }, [topManufacturingCountries, filteredData]);

  // ✅ IMPLEMENTED: Transform for bar chart (top manufacturers) using API data
  const barChartData = useMemo(() => {
    // Use API manufacturers data if available, otherwise fallback to table data
    if (topManufacturers.length > 0) {
      return topManufacturers.map((item, index) => ({
        name: item.manufacture_name || 'Unknown',
        y: item.count_registernumber || 0,
        color: '#4A90E2', // Blue color like in the image
        // ✅ IMPLEMENTED: Add additional data for enhanced tooltips
        countriesCount: item.manufacture_countries_count || 0,
        countries: item.manufacture_countries || []
      }));
    }

    // Fallback: Group by manufacturer from table data
    const grouped = filteredData.reduce((acc, item) => {
      const manufacturer = item.manufacturer || 'Unknown';
      if (!acc[manufacturer]) {
        acc[manufacturer] = {
          manufacturer: manufacturer,
          count: 0
        };
      }
      acc[manufacturer].count += 1;
      return acc;
    }, {});

    // Convert to array and sort by count (descending), take top 20
    const data = Object.values(grouped)
      .sort((a, b) => b.count - a.count)
      .slice(0, 20)
      .map((item, index) => ({
        name: item.manufacturer,
        y: item.count,
        color: '#4A90E2' // Blue color like in the image
      }));

    return data;
  }, [topManufacturers, filteredData]);

  // UI: Highcharts treemap options
  const heatmapOptions = useMemo(() => ({
    chart: {
      backgroundColor: 'transparent',
      type: 'treemap'
    },
    title: {
      text: 'Number of medicines by country',
      align: 'left',
      style: {
        color: isDark ? '#ffffff' : '#111827',
        fontSize: '16px',
        fontWeight: 'bold'
      }
    },
    series: [{
      type: 'treemap',
      name: 'Medicines',
      data: heatmapData,
      dataLabels: {
        enabled: true,
        format: '{point.name}',
        style: {
          color: '#ffffff',
          fontSize: '11px',
          fontWeight: 'bold',
          textOutline: '1px contrast'
        },
        crop: true,
        overflow: 'allow'
      },
      borderRadius: 1,
      borderWidth: 1,
      borderColor: '#ffffff',
      colorByPoint: false,
      allowTraversingTree: true,
      alternateStartingDirection: true,
      layoutAlgorithm: 'sliceAndDice',
      levelIsConstant: false,
      groupPadding: 2,
      levels: [{
        level: 1,
        dataLabels: {
          enabled: true,
          style: {
            fontSize: '12px',
            fontWeight: 'bold',
            color: '#ffffff',
            textOutline: '1px contrast'
          },
          crop: true,
          overflow: 'allow'
        },
        borderWidth: 2,
        borderColor: '#ffffff'
      }]
    }],
    tooltip: {
      useHTML: true,
      backgroundColor: isDark ? 'rgba(15,23,42,0.95)' : 'rgba(255,255,255,0.95)',
      borderColor: isDark ? '#1f2937' : '#e5e7eb',
      style: {
        color: isDark ? '#e5e7eb' : '#111827'
      },
      pointFormat: '<b>{point.name}</b><br/>Number of medicines: <b>{point.value}</b>'
    },
    credits: { enabled: false }
  }), [isDark, heatmapData, viewMode]);

  // UI: Highcharts bar options
  const barChartOptions = useMemo(() => ({
    chart: {
      type: 'bar',
      backgroundColor: 'transparent'
    },
    title: {
      text: 'Top 20 Manufacturers and their manufacturing country by',
      align: 'left',
      style: {
        color: isDark ? '#ffffff' : '#111827',
        fontSize: '16px',
        fontWeight: 'bold'
      }
    },
    xAxis: {
      categories: barChartData.map(item => item.name),
      labels: {
        style: {
          color: isDark ? '#ffffff' : '#111827',
          fontSize: '11px'
        },
        rotation: -45
      }
    },
    yAxis: {
      min: 0,
      title: {
        text: '',
        style: {
          color: isDark ? '#ffffff' : '#111827'
        }
      },
      labels: {
        style: {
          color: isDark ? '#ffffff' : '#111827'
        }
      },
      gridLineColor: isDark ? '#374151' : '#e5e7eb'
    },
    series: [{
      name: 'Count',
      data: barChartData,
      dataLabels: {
        enabled: true,
        format: '{y}',
        style: {
          color: isDark ? '#ffffff' : '#111827',
          fontSize: '11px',
          fontWeight: 'bold'
        }
      }
    }],
    tooltip: {
      useHTML: true,
      backgroundColor: isDark ? 'rgba(15,23,42,0.95)' : 'rgba(255,255,255,0.95)',
      borderColor: isDark ? '#1f2937' : '#e5e7eb',
      style: {
        color: isDark ? '#e5e7eb' : '#111827'
      },
      // ✅ IMPLEMENTED: Enhanced tooltip with manufacturer countries information
      pointFormatter: function() {
        const countriesInfo = this.countriesCount ? 
          `<br/>Manufacturing Countries: <b>${this.countriesCount}</b>` : '';
        const countriesList = this.countries && this.countries.length > 0 ? 
          `<br/>Countries: <b>${this.countries.slice(0, 3).join(', ')}${this.countries.length > 3 ? '...' : ''}</b>` : '';
        return `<b>${this.name}</b><br/>Count: <b>${this.y}</b>${countriesInfo}${countriesList}`;
      }
    },
    credits: { enabled: false }
  }), [isDark, barChartData, viewMode]);

  return (
    <div className="bg-white/60 dark:bg-gray-900/60 backdrop-blur-sm rounded-2xl border border-gray-100/50 dark:border-white/5 overflow-hidden shadow-sm">
      {/* Search Bar */}
      <div className="px-6 py-4 border-b border-gray-100/80 dark:border-white/5">
        <div className="mb-4">
          <SearchBar
            value={searchTerm}
            onChange={setSearchTerm}
            placeholder="Search by trade name, register number, or shelf life..."
            isDark={isDark}
            className="max-w-md"
          />
        </div>
      </div>

      {/* Filters and View Toggle */}
      <div className="px-6 py-4 border-b border-gray-100/80 dark:border-white/5">
        <div className="flex flex-wrap gap-6 mb-4">
          {/* Drugtype Filter */}
          <div className="flex-1 min-w-[200px]">
            <div className="flex items-center gap-2 mb-3">
              <IconChevronDown size={16} className="text-gray-500 dark:text-gray-400" />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">drugtype</span>
            </div>
            <div className="space-y-2">
              {drugtypes.map((drugtype) => (
                <label key={drugtype} className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={selectedDrugtypes.includes(drugtype)}
                    onChange={() => handleDrugtypeChange(drugtype)}
                    className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700"
                  />
                  <span className="text-gray-700 dark:text-gray-300">{drugtype}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Legal Status Filter */}
          <div className="flex-1 min-w-[200px]">
            <div className="flex items-center gap-2 mb-3">
              <IconChevronDown size={16} className="text-gray-500 dark:text-gray-400" />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">legal_status</span>
            </div>
            <div className="space-y-2">
              {legalStatuses.map((legalStatus) => (
                <label key={legalStatus} className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={selectedLegalStatuses.includes(legalStatus)}
                    onChange={() => handleLegalStatusChange(legalStatus)}
                    className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700"
                  />
                  <span className="text-gray-700 dark:text-gray-300">{legalStatus}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* View Toggle */}
        <div className="flex justify-end">
          <div className="flex items-center space-x-2 bg-gray-100 dark:bg-gray-800/50 rounded-lg p-1">
            <button 
              onClick={() => setViewMode('table')} 
              className={`px-3 py-1.5 text-sm font-medium rounded-md transition-all ${
                viewMode === 'table' 
                  ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm' 
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              Table
            </button>
            <button 
              onClick={() => setViewMode('heatmap')} 
              className={`px-3 py-1.5 text-sm font-medium rounded-md transition-all ${
                viewMode === 'heatmap' 
                  ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm' 
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              Heatmap
            </button>
            <button 
              onClick={() => setViewMode('barchart')} 
              className={`px-3 py-1.5 text-sm font-medium rounded-md transition-all ${
                viewMode === 'barchart' 
                  ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm' 
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              Bar Chart
            </button>
          </div>
        </div>
      </div>

      {/* Content Area */}
      {viewMode === 'table' ? (
        <>
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
                    <tr className="bg-gray-50 dark:bg-gray-800/50 border-b border-blue-200 dark:border-blue-800">
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-widest">
                        Register Number
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-widest">
                        Trade Name
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-widest">
                        Shelf Life
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50/50 dark:divide-white/5">
                    {paginatedData.map((row, index) => (
                      <tr 
                        key={row.registernumber} 
                        className={`hover:bg-white/40 dark:hover:bg-gray-800/40 transition-all duration-200 ${
                          index % 2 === 0 
                            ? 'bg-white dark:bg-gray-900/20' 
                            : 'bg-gray-50/50 dark:bg-gray-800/30'
                        }`}
                      >
                        <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">
                          {row.registernumber}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-300">
                          {row.trade_name}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-300">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
                            {row.shelflife} months
                          </span>
                        </td>
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
                      Showing {startIndex + 1} to {Math.min(endIndex, filteredData.length)} of {filteredData.length} results
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
          </>
      ) : viewMode === 'heatmap' ? (
        <div className="p-4">
          {/* ✅ IMPLEMENTED: Loading State for Heatmap */}
          {loading ? (
            <div className="flex items-center justify-center py-16">
              <Loader size={80} color={isDark ? "#20c997" : "#0891b2"} speed={1.5} />
            </div>
          ) : (
            <div style={{ width: '100%', height: 500 }}>
              <HighchartsReact
                key={`heatmap-${viewMode}`}
                highcharts={Highcharts}
                options={heatmapOptions}
                containerProps={{ style: { width: '100%', height: '100%' } }}
              />
            </div>
          )}
        </div>
      ) : (
        <div className="p-4">
          {/* ✅ IMPLEMENTED: Loading State for Bar Chart */}
          {loading ? (
            <div className="flex items-center justify-center py-16">
              <Loader size={80} color={isDark ? "#20c997" : "#0891b2"} speed={1.5} />
            </div>
          ) : (
            <div style={{ width: '100%', height: 500 }}>
              <HighchartsReact
                key={`barchart-${viewMode}`}
                highcharts={Highcharts}
                options={barChartOptions}
                containerProps={{ style: { width: '100%', height: '100%' } }}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ShelfLifeTable;
