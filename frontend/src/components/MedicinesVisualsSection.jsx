import React, { useMemo, useState, useEffect } from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import 'highcharts/highcharts-3d';
import { ResponsiveContainer, BarChart as ReBarChart, Bar, CartesianGrid, XAxis, YAxis, Tooltip, Legend, Cell, LabelList } from 'recharts';
import { Box } from '@mui/material';
import { IconThermometer, IconShieldCheck, IconLicense } from '@tabler/icons-react';
import Loader from './Loader';
import SearchBar from './ui/SearchBar';

// Minimal theme hook shim; consumer can pass isDark, otherwise default to false
const useThemeLike = (propIsDark) => ({ isDark: !!propIsDark });

const DEFAULT_COLORS = ['#8DC8D9', '#C5B39C', '#288A9A', '#2CCFB2', '#4CB8F6', '#91B3AD', '#9DB391'];

// ✅ IMPLEMENTED: Medicines Visuals Section with Real API Integration
// Backend APIs: /medicines/summary_latest and /chart/top10_pharmaform_drugtype
// This component displays real-time medicines data with filtering and visualizations
const MedicinesVisualsSection = ({ isDark: isDarkProp, loading: externalLoading = false, colors }) => {
  const { isDark } = useThemeLike(isDarkProp);
  
  // ✅ IMPLEMENTED: Real API data state management
  const [medicinesTableData, setMedicinesTableData] = useState([]);
  const [drugTypeDistribution, setDrugTypeDistribution] = useState([]);
  const [sumByDrugType, setSumByDrugType] = useState([]);
  const [pharmaFormDrugTypeData, setPharmaFormDrugTypeData] = useState([]);
  const [internalLoading, setInternalLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);
  
  // Use external loading if provided, otherwise use internal loading
  const loading = externalLoading || internalLoading;

  // UI: local filters/state
  const [selectedTemperatureBand, setSelectedTemperatureBand] = useState('All');
  const [selectedAuthorizationStatuses, setSelectedAuthorizationStatuses] = useState([]);
  const [selectedLegalStatuses, setSelectedLegalStatuses] = useState([]);
  const [medsView, setMedsView] = useState('table');
  
  // ✅ IMPLEMENTED: Pagination state for table view
  // ✅ IMPLEMENTED: Search functionality
  const [searchTerm, setSearchTerm] = useState('');
  
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

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

  const temperatureBands = ['All', 'Cold chain (2-8°C)', 'Room temperature', 'Frozen'];
  const authorizationStatuses = ['conditional approval', 'suspended', 'valid'];
  const legalStatuses = ['OTC', 'Prescription'];

  // ✅ IMPLEMENTED: Fetch medicines summary data from /medicines/summary_latest API
  const fetchMedicinesSummary = async () => {
    try {
      setInternalLoading(true);
      const params = new URLSearchParams();
      if (selectedTemperatureBand && selectedTemperatureBand !== 'All') {
        params.append('temperature_band', selectedTemperatureBand);
      }
      if (selectedAuthorizationStatuses.length > 0) {
        params.append('authorization_status', selectedAuthorizationStatuses[0]);
      }
      if (selectedLegalStatuses.length > 0) {
        params.append('legal_status', selectedLegalStatuses[0]);
      }
      params.append('table_limit', '200');

      const res = await fetch(`http://localhost:8000/medicines/summary_latest?${params.toString()}`);
      if (!res.ok) return;
      const payload = await res.json();
      
      if (payload.data) {
        // Update table data
        setMedicinesTableData(payload.data.table_rows || []);
        
        // Update drug type distribution for pie chart
        if (payload.data.pie_drugtype) {
          const pieData = payload.data.pie_drugtype;
          const labels = Array.isArray(pieData.labels) ? pieData.labels : [];
          const values = Array.isArray(pieData.values) ? pieData.values : [];
          
          const drugTypeData = labels.map((label, i) => ({
            id: String(label),
            label: String(label),
            value: Number(values[i] || 0)
          }));
          setDrugTypeDistribution(drugTypeData);
        }
        
        // Update sum by drug type for bar chart
        if (payload.data.sum_by_drugtype) {
          const sumData = payload.data.sum_by_drugtype.map(item => ({
            drugtype: item.drug_type,
            sum: item.sum_public_price
          }));
          setSumByDrugType(sumData);
        }
      }
    } catch (e) {
      console.error('Error fetching medicines summary:', e);
    } finally {
      setInternalLoading(false);
    }
  };

  // ✅ IMPLEMENTED: Fetch pharmaceutical form drugtype data from /chart/top10_pharmaform_drugtype API
  const fetchPharmaFormDrugType = async () => {
    try {
      const params = new URLSearchParams();
      if (selectedTemperatureBand && selectedTemperatureBand !== 'All') {
        params.append('temperature_band', selectedTemperatureBand);
      }
      if (selectedAuthorizationStatuses.length > 0) {
        selectedAuthorizationStatuses.forEach(status => {
          params.append('authorization_status', status);
        });
      }
      if (selectedLegalStatuses.length > 0) {
        selectedLegalStatuses.forEach(status => {
          params.append('legal_status', status);
        });
      }
      params.append('percent', 'false'); // Get actual counts, not percentages

      const res = await fetch(`http://localhost:8000/chart/top10_pharmaform_drugtype?${params.toString()}`);
      if (!res.ok) return;
      const payload = await res.json();
      
      if (payload.chart) {
        const chartData = payload.chart;
        const labels = Array.isArray(chartData.labels) ? chartData.labels : [];
        const series = Array.isArray(chartData.series) ? chartData.series : [];
        
        // Transform data for stacked chart
        const transformedData = labels.map((label, index) => {
          const dataPoint = { pharmaceuticalform: String(label) };
          series.forEach(seriesItem => {
            dataPoint[seriesItem.name] = Number(seriesItem.data[index] || 0);
          });
          return dataPoint;
        });
        
        setPharmaFormDrugTypeData(transformedData);
      }
    } catch (e) {
      console.error('Error fetching pharma form drugtype data:', e);
    }
  };

  // ✅ IMPLEMENTED: Fetch data when filters change
  useEffect(() => {
    fetchMedicinesSummary();
    fetchPharmaFormDrugType();
    setCurrentPage(1); // Reset to first page when filters change
  }, [selectedTemperatureBand, selectedAuthorizationStatuses, selectedLegalStatuses]);

  // ✅ IMPLEMENTED: Initial data fetch
  useEffect(() => {
    fetchMedicinesSummary();
    fetchPharmaFormDrugType();
  }, []);

  // ✅ IMPLEMENTED: Use API data with search filtering
  const filteredMedicines = useMemo(() => {
    if (!searchTerm.trim()) return medicinesTableData;
    
    const searchLower = searchTerm.toLowerCase().trim();
    return medicinesTableData.filter(item => {
      const tradeName = (item.trade_name || '').toLowerCase();
      const adminRoute = (item.administrationroute || '').toLowerCase();
      const distributeArea = (item.distribute_area || '').toLowerCase();
      
      return tradeName.includes(searchLower) || 
             adminRoute.includes(searchLower) || 
             distributeArea.includes(searchLower);
    });
  }, [medicinesTableData, searchTerm]);
  
  // ✅ IMPLEMENTED: Pagination logic
  const totalPages = Math.ceil(filteredMedicines.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedMedicines = filteredMedicines.slice(startIndex, endIndex);

  // ✅ IMPLEMENTED: Use API data for aggregations
  const groupByDrugtypeCounts = useMemo(() => drugTypeDistribution, [drugTypeDistribution]);
  const sumsByDrugtype = useMemo(() => sumByDrugType, [sumByDrugType]);

  // ✅ IMPLEMENTED: Use API data for pharmaceutical forms and drug types
  const pharmaForms = useMemo(() => {
    if (pharmaFormDrugTypeData.length > 0) {
      return pharmaFormDrugTypeData.map(item => item.pharmaceuticalform);
    }
    return [];
  }, [pharmaFormDrugTypeData]);

  const drugtypesUnique = useMemo(() => {
    if (pharmaFormDrugTypeData.length > 0) {
      const drugTypes = new Set();
      pharmaFormDrugTypeData.forEach(item => {
        Object.keys(item).forEach(key => {
          if (key !== 'pharmaceuticalform') {
            drugTypes.add(key);
          }
        });
      });
      return Array.from(drugTypes);
    }
    return [];
  }, [pharmaFormDrugTypeData]);

  // ✅ IMPLEMENTED: Use API data for stacked chart
  const countsByFormAndDrugtype = useMemo(() => {
    if (pharmaFormDrugTypeData.length > 0) {
    const map = {};
      pharmaFormDrugTypeData.forEach(item => {
        const form = item.pharmaceuticalform;
        if (!map[form]) map[form] = {};
        Object.keys(item).forEach(key => {
          if (key !== 'pharmaceuticalform') {
            map[form][key] = item[key];
          }
        });
    });
    return map;
    }
    return {};
  }, [pharmaFormDrugTypeData]);

  // ✅ IMPLEMENTED: Format prices in SAR currency
  const formatMillions = (val) => {
    if (val >= 1_000_000) return `${(val / 1_000_000).toFixed(2)}M SAR`;
    if (val >= 1_000) return `${(val / 1_000).toFixed(1)}K SAR`;
    return `${val} SAR`;
  };

  // UI: Highcharts pie plugin fan animation (install once)
  useEffect(() => {
    const pieProto = Highcharts?.seriesTypes?.pie?.prototype;
    if (!pieProto || pieProto.__fanAnimationInstalled) return;
    (function (H) {
      H.seriesTypes.pie.prototype.animate = function (init) {
        const series = this,
          chart = series.chart,
          points = series.points,
          animation = series.options.animation || { duration: 1000 },
          startAngleRad = series.startAngleRad;
        function fanAnimate(point, startAngleRadLocal) {
          const graphic = point.graphic,
            args = point.shapeArgs;
          if (graphic && args) {
            graphic.attr({ start: startAngleRadLocal, end: startAngleRadLocal, opacity: 1 })
              .animate({ start: args.start, end: args.end }, { duration: animation.duration / points.length }, function () {
                if (points[point.index + 1]) fanAnimate(points[point.index + 1], args.end);
                if (point.index === series.points.length - 1) {
                  if (series.dataLabelsGroup) series.dataLabelsGroup.attr({ opacity: 0 }).animate({ opacity: 1 });
                  points.forEach(p => { p.opacity = 1; });
                  series.update({ enableMouseTracking: true }, false);
                  chart.update({ plotOptions: { pie: { innerSize: '40%', borderRadius: 8 } } });
                }
              });
          }
        }
        if (init) {
          points.forEach(point => { point.opacity = 0; });
        } else if (points && points[0]) {
          fanAnimate(points[0], startAngleRad);
        }
      };
    })(Highcharts);
    pieProto.__fanAnimationInstalled = true;
  }, []);

  const pieSeriesData = useMemo(() => groupByDrugtypeCounts.map(d => ({ name: d.label, y: d.value })), [groupByDrugtypeCounts]);

  const activeColors = Array.isArray(colors) && colors.length ? colors : DEFAULT_COLORS;

  const pieVisualOptions = useMemo(() => ({
    chart: { 
      type: 'pie', 
      backgroundColor: 'transparent',
      spacing: isMobile ? [10, 10, 10, 10] : [20, 20, 20, 20],
      margin: isMobile ? [20, 20, 40, 20] : [40, 40, 60, 80]
    },
    colors: activeColors,
    title: { text: '' },
    subtitle: { text: '' },
    tooltip: { headerFormat: '', pointFormat: '<span style="color:{point.color}">●</span> {point.name}: <b>{point.percentage:.1f}%</b>' },
    legend: { 
      itemStyle: { color: isDark ? '#ffffff' : '#111827' },
      itemWidth: isMobile ? 80 : 120,
      symbolHeight: isMobile ? 8 : 12,
      symbolWidth: isMobile ? 8 : 12,
      itemMarginBottom: isMobile ? 2 : 4,
      itemMarginTop: isMobile ? 2 : 4
    },
    plotOptions: { 
      pie: { 
        allowPointSelect: true, 
        borderWidth: 2, 
        cursor: 'pointer', 
        colors: activeColors,
        center: isMobile ? ['50%', '50%'] : ['50%', '50%'],
        size: isMobile ? '80%' : '70%',
        dataLabels: { 
          enabled: true, 
          distance: isMobile ? 15 : 20, 
          formatter: function () { 
            return `<b>${this.point.name}</b><br/>${this.percentage.toFixed(1)}%`; 
          }, 
          style: { 
            color: isDark ? '#e5e7eb' : '#111827', 
            textOutline: 'none',
            fontSize: isMobile ? '10px' : '12px',
            fontWeight: '700'
          } 
        } 
      } 
    },
    series: [{ type: 'pie', enableMouseTracking: false, animation: { duration: 2000 }, colorByPoint: true, data: pieSeriesData, colors: activeColors }],
    credits: { enabled: false }
  }), [pieSeriesData, isDark, isMobile, activeColors]);

  const sumsTotal = useMemo(() => sumsByDrugtype.reduce((s, d) => s + d.sum, 0), [sumsByDrugtype]);

  const stackedSeries = useMemo(() => (
    drugtypesUnique.map((dt, idx) => ({
      type: 'column',
      name: dt,
      data: pharmaForms.map(f => countsByFormAndDrugtype[f]?.[dt] || 0),
      stack: 'forms',
      color: activeColors[idx % activeColors.length]
    }))
  ), [drugtypesUnique, pharmaForms, countsByFormAndDrugtype, activeColors]);

  const stackedOptions = useMemo(() => ({
    chart: { type: 'column', backgroundColor: 'transparent' },
    title: { text: '' },
    xAxis: { categories: pharmaForms, labels: { style: { color: isDark ? '#ffffff' : '#111827' } } },
    yAxis: { allowDecimals: false, min: 0, title: { text: 'Count of drugtype', style: { color: isDark ? '#ffffff' : '#111827' } }, labels: { style: { color: isDark ? '#ffffff' : '#111827' } } },
    tooltip: { shared: true },
    plotOptions: { column: { stacking: 'normal' } },
    legend: { itemStyle: { color: isDark ? '#ffffff' : '#111827' } },
    series: stackedSeries,
    credits: { enabled: false }
  }), [pharmaForms, stackedSeries, isDark]);

  return (
    <div className="bg-white/60 dark:bg-gray-900/60 backdrop-blur-sm rounded-2xl border border-gray-100/50 dark:border-white/5 overflow-hidden shadow-sm">
      {/* Search Bar */}
      <div className="px-6 py-4 border-b border-gray-100/80 dark:border-white/5">
        <div className="mb-4">
          <SearchBar
            value={searchTerm}
            onChange={setSearchTerm}
            placeholder="Search by trade name, administration route, or distribute area..."
            isDark={isDark}
            className="max-w-md"
          />
        </div>
      </div>

      {/* ✅ IMPLEMENTED: Loading State with Loader Component */}
      {loading && (
        <div className="flex items-center justify-center py-16">
          <Loader size={80} color={isDark ? "#20c997" : "#0891b2"} speed={1.5} />
        </div>
      )}
      
      {!loading && (
        <>
      {/* Filters */}
      <div className="p-4 border-b border-gray-100/80 dark:border-white/5 grid grid-cols-1 md:grid-cols-3 gap-3">
        <div className="rounded-lg border border-gray-200/60 dark:border-white/10 bg-white/50 dark:bg-white/5 px-3 py-3">
          <div className="flex items-center gap-2 text-xs font-medium text-gray-500 dark:text-white/70 mb-2">
            <IconThermometer size={16} className="opacity-80" />
            <span>temperature_band</span>
          </div>
          <select value={selectedTemperatureBand} onChange={(e) => setSelectedTemperatureBand(e.target.value)} className="w-full bg-transparent border border-gray-200 dark:border-white/10 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-500 text-gray-900 dark:text-white [&>option]:bg-white [&>option]:text-gray-900 dark:[&>option]:bg-gray-800 dark:[&>option]:text-white">
            {temperatureBands.map((x) => <option key={x} value={x}>{x}</option>)}
          </select>
        </div>
        <div className="rounded-lg border border-gray-200/60 dark:border-white/10 bg-white/50 dark:bg-white/5 px-3 py-3">
          <div className="flex items-center gap-2 text-xs font-medium text-gray-500 dark:text-white/70 mb-2">
            <IconShieldCheck size={16} className="opacity-80" />
            <span>authorization_status</span>
          </div>
          <div className="space-y-1.5">
            {authorizationStatuses.map((label) => (
              <label key={label} className="flex items-center justify-between text-sm">
                <span className="text-gray-700 dark:text-gray-200">{label}</span>
                <input type="checkbox" className="h-4 w-4 rounded border-gray-300 text-gray-700 focus:ring-gray-500" checked={selectedAuthorizationStatuses.includes(label)} onChange={(e) => setSelectedAuthorizationStatuses((prev) => e.target.checked ? [...prev, label] : prev.filter((x) => x !== label))} />
              </label>
            ))}
          </div>
        </div>
        <div className="rounded-lg border border-gray-200/60 dark:border-white/10 bg-white/50 dark:bg-white/5 px-3 py-3">
          <div className="flex items-center gap-2 text-xs font-medium text-gray-500 dark:text-white/70 mb-2">
            <IconLicense size={16} className="opacity-80" />
            <span>legal_status</span>
          </div>
          <div className="space-y-1.5">
            {legalStatuses.map((label) => (
              <label key={label} className="flex items-center justify-between text-sm">
                <span className="text-gray-700 dark:text-gray-200">{label}</span>
                <input type="checkbox" className="h-4 w-4 rounded border-gray-300 text-gray-700 focus:ring-gray-500" checked={selectedLegalStatuses.includes(label)} onChange={(e) => setSelectedLegalStatuses((prev) => e.target.checked ? [...prev, label] : prev.filter((x) => x !== label))} />
              </label>
            ))}
          </div>
        </div>
      </div>

      {/* View toggle */}
      <div className="px-4 pt-3 pb-2 flex justify-end">
        <div className="flex items-center space-x-2 bg-gray-100 dark:bg-gray-800/50 rounded-lg p-1">
          <button onClick={() => setMedsView('table')} className={`px-3 py-1.5 text-sm font-medium rounded-md transition-all ${medsView === 'table' ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm' : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'}`}>Table</button>
          <button onClick={() => setMedsView('visuals')} className={`px-3 py-1.5 text-sm font-medium rounded-md transition-all ${medsView === 'visuals' ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm' : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'}`}>Visuals</button>
        </div>
      </div>

      {medsView === 'table' ? (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100/80 dark:border-white/5">
                <th className="px-8 py-6 text-left text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-widest">Trade Name</th>
                <th className="px-8 py-6 text-left text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-widest">Administration Route</th>
                <th className="px-8 py-6 text-left text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-widest">Distribute Area</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50/50 dark:divide-white/5">
              {paginatedMedicines.map((row, idx) => (
                <tr key={idx} className="group hover:bg-white/40 dark:hover:bg-gray-800/40 transition-all duration-200">
                  <td className="px-8 py-5 whitespace-nowrap"><div className="text-sm font-semibold text-gray-900 dark:text-white tracking-tight">{row.trade_name}</div></td>
                  <td className="px-8 py-5 whitespace-nowrap"><div className="text-sm text-gray-700 dark:text-gray-300">{row.administrationroute}</div></td>
                  <td className="px-8 py-5 whitespace-nowrap"><span className="inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset bg-gray-100 text-gray-700 dark:bg-white/10 dark:text-white/80 dark:ring-white/10">{row.distribute_area}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {/* ✅ IMPLEMENTED: Pagination Controls - Sticky at bottom */}
          {totalPages > 1 && (
            <div className="sticky bottom-0 z-10 px-6 py-4 border-t border-gray-100/80 dark:border-white/5 bg-gray-50/95 dark:bg-gray-800/95 backdrop-blur-sm">
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-700 dark:text-gray-300">
                  Showing {startIndex + 1} to {Math.min(endIndex, filteredMedicines.length)} of {filteredMedicines.length} results
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
        </div>
      ) : (
        <div className="px-4 pb-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white/50 dark:bg-gray-900/40 rounded-xl border border-gray-100/70 dark:border-white/10 p-4">
              <h4 className="text-lg md:text-xl font-semibold text-gray-900 dark:text-white mb-3">Count of drugtype by drugtype</h4>
              <div style={{ width: '100%', height: isMobile ? 360 : 420, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <HighchartsReact highcharts={Highcharts} options={pieVisualOptions} containerProps={{ style: { width: '100%', height: '100%' } }} />
              </div>
            </div>
            <div className="bg-white/50 dark:bg-gray-900/40 rounded-xl border border-gray-100/70 dark:border-white/10 p-4">
              <h4 className="text-lg md:text-xl font-semibold text-gray-900 dark:text-white mb-3">Sum of public_price by drugtype</h4>
              <div style={{ width: '100%', height: isMobile ? 360 : 420 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <ReBarChart 
                    data={sumsByDrugtype} 
                    layout="vertical" 
                    margin={isMobile ? { top: 10, right: 20, bottom: 10, left: 10 } : { top: 10, right: 40, bottom: 10, left: 90 }} 
                    className="text-tertiary"
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke={isDark ? '#374151' : '#e5e7eb'} />
                    <XAxis 
                      type="number" 
                      tick={{ 
                        fill: isDark ? '#e5e7eb' : '#111827',
                        fontSize: isMobile ? 9 : 11
                      }} 
                      tickFormatter={(v) => formatMillions(v)} 
                    />
                    <YAxis 
                      type="category" 
                      dataKey="drugtype" 
                      tick={{ 
                        fill: isDark ? '#e5e7eb' : '#111827',
                        fontSize: isMobile ? 9 : 11,
                        textAnchor: 'end'
                      }} 
                      width={isMobile ? 80 : 110} 
                    />
                    <Tooltip formatter={(v) => formatMillions(v)} cursor={{ fill: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)' }} />
                    <Legend />
                    <Bar dataKey="sum" name="Public Price" maxBarSize={isMobile ? 24 : 32}>
                      {sumsByDrugtype.map((entry, index) => (
                        <Cell key={`cell-sum-${index}`} fill={activeColors[index % activeColors.length]} />
                      ))}
                      <LabelList 
                        dataKey="sum" 
                        position="right" 
                        formatter={(v) => formatMillions(v)} 
                        style={{ 
                          fontSize: isMobile ? 9 : 11,
                          fill: isDark ? '#e5e7eb' : '#111827'
                        }}
                      />
                    </Bar>
                  </ReBarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
          <div className="mt-6 bg-white/50 dark:bg-gray-900/40 rounded-xl border border-gray-100/70 dark:border-white/10 p-4">
            <h4 className="text-lg md:text-xl font-semibold text-gray-900 dark:text-white mb-3">Count of drugtype by pharmaceuticalform and drugtype</h4>
            <div style={{ width: '100%', height: 480 }}>
              <HighchartsReact highcharts={Highcharts} options={stackedOptions} containerProps={{ style: { width: '100%', height: '100%' } }} />
            </div>
          </div>
        </div>
      )}
        </>
      )}
    </div>
  );
};

export default MedicinesVisualsSection;
