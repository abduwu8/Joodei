import React, { useMemo, useState, useEffect } from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import 'highcharts/modules/treegraph';
import Loader from '../Loader';
import SearchBar from '../ui/SearchBar';

// ✅ IMPLEMENTED: Suspended Medicines with Real API Integration
// Backend API: /decomposition/suspended endpoint provides real suspended medicines data
// Features: Pagination, Loading states, Tree visualization

const SuspendedMedicines = ({ isDark, rows }) => {
  // ✅ IMPLEMENTED: API data state management
  const [suspendedTableData, setSuspendedTableData] = useState([]);
  const [decompositionTree, setDecompositionTree] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // ✅ IMPLEMENTED: Search functionality
  const [searchTerm, setSearchTerm] = useState('');
  
  // ✅ IMPLEMENTED: Pagination state
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

  // ✅ IMPLEMENTED: Fetch suspended medicines data from /decomposition/suspended API
  const fetchSuspendedData = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      params.append('top_n_distribute', '20');
      params.append('top_n_drugtype', '10');

      const res = await fetch(`http://localhost:8000/decomposition/suspended?${params.toString()}`);
      if (!res.ok) return;
      const payload = await res.json();
      
      if (payload.data) {
        setSuspendedTableData(payload.data.table_rows || []);
        setDecompositionTree(payload.data.decomposition_tree || null);
      }
    } catch (e) {
      console.error('Error fetching suspended medicines data:', e);
    } finally {
      setLoading(false);
    }
  };

  // ✅ IMPLEMENTED: Fetch data on component mount
  useEffect(() => {
    fetchSuspendedData();
  }, []);

  // ✅ IMPLEMENTED: Use API data with search filtering
  const suspendedRows = useMemo(() => {
    const baseData = suspendedTableData.length > 0 ? suspendedTableData : (rows && rows.length > 0 ? rows : [
      { authorization_status: 'suspended', trade_name: 'ANTACID JEDCO 480MG CHEWABLE TABLETS', distribute_area: 'Pharmacy', drugtype: 'Generic' },
      { authorization_status: 'suspended', trade_name: 'JEDCOMAG EFFERVESCENT GRANULES SACHET', distribute_area: 'Pharmacy', drugtype: 'Generic' },
      { authorization_status: 'suspended', trade_name: 'ESOMA 20 MG DELAYED RELEASE CAPSULES', distribute_area: 'Pharmacy', drugtype: 'Generic' },
      { authorization_status: 'suspended', trade_name: 'LORDAY 10MG TABLET', distribute_area: 'Pharmacy', drugtype: 'Generic' },
      { authorization_status: 'suspended', trade_name: 'ALLERCET 5MG F.C.TABLET', distribute_area: 'Pharmacy', drugtype: 'Generic' },
      { authorization_status: 'suspended', trade_name: 'SARFEX 180MG F.C.TAB.(10S)', distribute_area: 'Pharmacy', drugtype: 'Generic' },
      { authorization_status: 'suspended', trade_name: 'NEOMOL 120MG-5ML SUSPENSION', distribute_area: 'Pharmacy', drugtype: 'Generic' },
      { authorization_status: 'suspended', trade_name: 'NEODAY 5MG-5ML SYRUP', distribute_area: 'Pharmacy', drugtype: 'Generic' },
      { authorization_status: 'suspended', trade_name: 'NEODAY 10MG TABLETS', distribute_area: 'Pharmacy', drugtype: 'Generic' },
      { authorization_status: 'suspended', trade_name: 'IMATIS 400MG F.C.TABLET', distribute_area: 'Hospital', drugtype: 'Generic' },
      { authorization_status: 'suspended', trade_name: 'PRIZMA 2GM/0.25GM POWDER FOR I.V. INFUSION', distribute_area: 'Hospital', drugtype: 'Generic' },
    ]);

    // Apply search filter
    if (!searchTerm.trim()) return baseData;
    
    const searchLower = searchTerm.toLowerCase().trim();
    return baseData.filter(item => {
      const tradeName = (item.trade_name || '').toLowerCase();
      const authStatus = (item.authorization_status || '').toLowerCase();
      const distributeArea = (item.distribute_area || '').toLowerCase();
      const drugtype = (item.drugtype || '').toLowerCase();
      
      return tradeName.includes(searchLower) || 
             authStatus.includes(searchLower) || 
             distributeArea.includes(searchLower) ||
             drugtype.includes(searchLower);
    });
  }, [suspendedTableData, rows, searchTerm]);

  // ✅ IMPLEMENTED: Pagination logic
  const totalPages = Math.ceil(suspendedRows.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedRows = suspendedRows.slice(startIndex, endIndex);

  // ✅ IMPLEMENTED: Build treegraph data from API or fallback data
  const treeData = useMemo(() => {
    // Use API decomposition tree if available, otherwise build from table data
    if (decompositionTree) {
      const out = [{ id: 'root', parent: '', name: decompositionTree.name }];
      if (decompositionTree.children) {
        decompositionTree.children.forEach((area, idx) => {
          const areaId = `area-${idx}`;
          out.push({ id: areaId, parent: 'root', name: `${area.name} (${area.value})` });
          if (area.children) {
            area.children.forEach((drug, j) => {
              out.push({ id: `${areaId}-${j}`, parent: areaId, name: `${drug.name} (${drug.value})` });
            });
          }
        });
      }
      return out;
    }

    // Fallback: build from table data
    const areaGroups = suspendedRows.reduce((acc, r) => {
      if (!acc[r.distribute_area]) acc[r.distribute_area] = {};
      if (!acc[r.distribute_area][r.drugtype]) acc[r.distribute_area][r.drugtype] = 0;
      acc[r.distribute_area][r.drugtype] += 1;
      return acc;
    }, {});

    const out = [{ id: 'root', parent: '', name: 'Suspended_Medicines' }];
    Object.entries(areaGroups).forEach(([area, drugMap], idx) => {
      const areaId = `area-${idx}`;
      out.push({ id: areaId, parent: 'root', name: `${area}` });
      Object.entries(drugMap).forEach(([dt, count], j) => {
        out.push({ id: `${areaId}-${j}`, parent: areaId, name: `${dt} (${count})` });
      });
    });
    return out;
  }, [suspendedRows, decompositionTree]);

  const nodeOptions = useMemo(() => ({
    chart: { inverted: true, backgroundColor: 'transparent', marginBottom: 120 },
    title: { text: '' },
    series: [{
      type: 'treegraph',
      data: treeData,
      tooltip: { pointFormat: '{point.name}' },
      dataLabels: { pointFormat: '{point.name}', style: { whiteSpace: 'nowrap', color: isDark ? '#fff' : '#111827', textOutline: 'none' }, crop: false },
      marker: { radius: 6 },
      levels: [
        { level: 1, dataLabels: { align: 'left', x: 20 } },
        { level: 2, colorByPoint: true, dataLabels: { verticalAlign: 'bottom', y: -20 } },
        { level: 3, colorVariation: { key: 'brightness', to: -0.5 }, dataLabels: { verticalAlign: 'top', rotation: 90, y: 20 } }
      ]
    }],
    credits: { enabled: false }
  }), [treeData, isDark]);

  return (
    <div className="col-span-1 md:col-span-2 mt-8">
      {/* Suspended Medicines: table + treegraph */}
      <div className="group relative overflow-visible p-0 text-gray-900 dark:text-white">
        <div className="flex items-center justify-between pt-8 pb-4">
          <h3 className="text-xl md:text-2xl font-semibold text-gray-900 dark:text-white">Suspended Medicines</h3>
        </div>
        <div className="bg-white/60 dark:bg-gray-900/60 backdrop-blur-sm rounded-2xl border border-gray-100/50 dark:border-white/5 overflow-hidden shadow-sm p-0 flex flex-col">
          {/* Search Bar */}
          <div className="px-6 py-4 border-b border-gray-100/80 dark:border-white/5">
            <div className="mb-4">
              <SearchBar
                value={searchTerm}
                onChange={setSearchTerm}
                placeholder="Search by trade name, authorization status, distribute area, or drug type..."
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
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 flex-1">
            <div className="lg:col-span-7 border-r border-gray-100/60 dark:border-white/10 flex flex-col">
              <div className="overflow-x-auto flex-1">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-100/80 dark:border-white/5">
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-widest">authorization_status</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-widest">trade_name</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-widest">distribute_area</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-widest">drugtype</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50/50 dark:divide-white/5">
                    {paginatedRows.map((row, i) => (
                      <tr key={i} className="hover:bg-white/40 dark:hover:bg-gray-800/40 transition-all duration-200">
                        <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-300">{row.authorization_status}</td>
                        <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">{row.trade_name}</td>
                        <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-300">{row.distribute_area}</td>
                        <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-300">{row.drugtype}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              {/* ✅ IMPLEMENTED: Pagination Controls - Fixed at bottom */}
              {totalPages > 1 && (
                <div className="px-6 py-4 border-t border-gray-100/80 dark:border-white/5 bg-gray-50/95 dark:bg-gray-800/95 backdrop-blur-sm">
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-700 dark:text-gray-300">
                      Showing {startIndex + 1} to {Math.min(endIndex, suspendedRows.length)} of {suspendedRows.length} results
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
            <div className="lg:col-span-5 p-4">
              <div style={{ width: '100%', height: 700 }}>
                <HighchartsReact highcharts={Highcharts} options={nodeOptions} containerProps={{ style: { width: '100%', height: '100%' } }} />
              </div>
            </div>
          </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default SuspendedMedicines;


