import React, { useState, useMemo, useEffect } from 'react';
import { IconChevronDown } from '@tabler/icons-react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import 'highcharts/modules/treemap';

const ShelfLifeTable = ({ isDark }) => {
  // Data source: replace demo data with API results when backend is ready
  // API auth key: attach header like { Authorization: `Bearer ${import.meta.env.VITE_API_KEY}` } in fetch
  // Manufacturer data for bar chart
  const manufacturers = [
    'TABUK PHARMACEUTICAL', 'SPIMACO', 'Gulf Pharmaceutical Ind', 'Pharmaceutical Solution', 
    'Jamjoom Pharmaceutical', 'Jazeera Pharmaceutical I', 'RIYADH PHARMA', 'Avalon Pharma', 
    'DAR ALDAWA', 'UNITED PHARMACEUTICAL', 'SAJA-SAUDI ARABIAN J', 'NATIONAL PHARMACEUTICAL', 
    'QATAR PHARMA', 'KUWAIT SAUDI PHARM', 'Pharma International Co.', 'DEEF PHARMACEUTICAL', 
    'PFIZER', 'OMAN PHARMACEUTICAL', 'Hetero Labs Limited', 'The Jordanian Pharmaceutical', 
    'Hikma Farmaceutica', 'Jordan Sweden Medical', 'NOVARTIS', 'ROCHE', 'MERCK', 
    'GLAXOSMITHKLINE', 'SANOFI', 'ASTRAZENECA', 'JOHNSON & JOHNSON', 'BRISTOL MYERS SQUIBB'
  ];

  // Helper function to create medicine data with manufacturer
  const createMedicineData = (length, startReg, countryName, countryIndex) => {
    return Array.from({ length }, (_, i) => ({
      registernumber: `${startReg + i}`,
      trade_name: `${countryName} Medicine ${i + 1}`,
      shelflife: 24 + (i % 12),
      drugtype: ['Biological', 'Generic', 'NCE', 'Radiopharmaceutical'][i % 4],
      legal_status: ['Prescription', 'OTC'][i % 2],
      country: countryName,
      manufacturer: manufacturers[(i + countryIndex) % manufacturers.length]
    }));
  };

  // UI: sample data (15 items). Swap with API response payload
  const shelfLifeData = [
    // United States - 5 items
    ...createMedicineData(5, 101244649, 'United States', 0),
    
    // Germany - 4 items
    ...createMedicineData(4, 101256513, 'Germany', 1),
    
    // Italy - 3 items
    ...createMedicineData(3, 102210483, 'Italy', 2),
    
    // France - 2 items
    ...createMedicineData(2, 102210484, 'France', 3),
    
    // India - 1 item
    ...createMedicineData(1, 102210485, 'India', 4)
  ];

  // UI: table filters (drugtype, legal_status)
  const [selectedDrugtypes, setSelectedDrugtypes] = useState([]);
  const [selectedLegalStatuses, setSelectedLegalStatuses] = useState([]);
  const [viewMode, setViewMode] = useState('table'); // 'table', 'heatmap', or 'barchart'
  
  // UI: pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // UI: filter options (static). Consider deriving from API metadata
  const drugtypes = ['Biological', 'Generic', 'NCE', 'Radiopharmaceutical'];
  const legalStatuses = ['OTC', 'Prescription'];

  // Color mapping for different drug types - vibrant colors like the country treemap
  const getColorForDrugType = (drugtype) => {
    const colors = {
      'Biological': '#4A90E2',      // Bright blue
      'Generic': '#2E8B57',         // Dark blue  
      'NCE': '#FF6B35',             // Orange
      'Radiopharmaceutical': '#8B4B8C' // Dark purple
    };
    return colors[drugtype] || '#A9B4C2';
  };

  // Color mapping for countries - vibrant colors like the country treemap
  const getColorForCountry = (country) => {
    const colors = {
      'United States': '#4A90E2',      // Bright blue
      'Germany': '#2E8B57',            // Dark blue
      'Italy': '#FF6B35',              // Orange
      'France': '#8B4B8C',             // Dark purple
      'India': '#FF69B4',              // Pink
      'United Kingdom': '#9370DB',     // Light purple
      'Spain': '#FFD700',              // Gold/yellow
      'Ireland': '#FF0000',            // Red
      'Switzerland': '#20B2AA',        // Teal
      'Saudi Arabia': '#32CD32',       // Green
      'Canada': '#00CED1',             // Cyan
      'Belgium': '#87CEEB',            // Light blue
      'China': '#FFD700',              // Gold/yellow
      'Greece': '#FFB6C1',             // Light pink
      'Portugal': '#20B2AA',           // Teal
      'Netherlands': '#87CEEB',        // Light blue
      'Jordan': '#FFA500',             // Orange
      'Sweden': '#4169E1',             // Medium blue
      'Poland': '#191970',             // Darker blue
      'Turkey': '#CD853F',             // Orange-red
      'Japan': '#DDA0DD',              // Lavender
      'Denmark': '#000080',            // Very dark blue
      'Unknown': '#A9B4C2'             // Default gray
    };
    return colors[country] || '#A9B4C2';
  };

  // UI: apply filters to dataset
  const filteredData = useMemo(() => {
    return shelfLifeData.filter(item => {
      const drugtypeMatch = selectedDrugtypes.length === 0 || selectedDrugtypes.includes(item.drugtype);
      const legalStatusMatch = selectedLegalStatuses.length === 0 || selectedLegalStatuses.includes(item.legal_status);
      return drugtypeMatch && legalStatusMatch;
    });
  }, [selectedDrugtypes, selectedLegalStatuses]);

  // Pagination calculations
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedData = filteredData.slice(startIndex, endIndex);

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedDrugtypes, selectedLegalStatuses]);

  const handleDrugtypeChange = (drugtype) => {
    setSelectedDrugtypes(prev => 
      prev.includes(drugtype) 
        ? prev.filter(item => item !== drugtype)
        : [...prev, drugtype]
    );
  };

  const handleLegalStatusChange = (legalStatus) => {
    setSelectedLegalStatuses(prev => 
      prev.includes(legalStatus) 
        ? prev.filter(item => item !== legalStatus)
        : [...prev, legalStatus]
    );
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

  // UI: transform for heatmap (treemap) by country
  const heatmapData = useMemo(() => {
    // Group by country
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
      acc[country].totalShelfLife += item.shelflife;
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
  }, [filteredData]);

  // UI: transform for bar chart (top manufacturers)
  const barChartData = useMemo(() => {
    // Group by manufacturer
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
  }, [filteredData]);

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
      pointFormat: '<b>{point.name}</b><br/>Number of medicines: <b>{point.value}</b><br/>Avg Shelf Life: <b>{point.shelflife ? point.shelflife.toFixed(1) : "N/A"} months</b>'
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
      pointFormat: '<b>{point.name}</b><br/>Count: <b>{point.y}</b>'
    },
    credits: { enabled: false }
  }), [isDark, barChartData, viewMode]);

  return (
    <div className="bg-white/60 dark:bg-gray-900/60 backdrop-blur-sm rounded-2xl border border-gray-100/50 dark:border-white/5 overflow-hidden shadow-sm">
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
      ) : viewMode === 'heatmap' ? (
        <div className="p-4">
          <div style={{ width: '100%', height: 500 }}>
            <HighchartsReact
              key={`heatmap-${viewMode}`}
              highcharts={Highcharts}
              options={heatmapOptions}
              containerProps={{ style: { width: '100%', height: '100%' } }}
            />
          </div>
        </div>
      ) : (
        <div className="p-4">
          <div style={{ width: '100%', height: 500 }}>
            <HighchartsReact
              key={`barchart-${viewMode}`}
              highcharts={Highcharts}
              options={barChartOptions}
              containerProps={{ style: { width: '100%', height: '100%' } }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ShelfLifeTable;
