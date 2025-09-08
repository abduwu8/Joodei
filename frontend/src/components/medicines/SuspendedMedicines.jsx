import React, { useMemo } from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import 'highcharts/modules/treegraph';

// Suspended Medicines: table + treegraph visualization
// API: Parent can pass rows; fallback demo rows included for now.

const SuspendedMedicines = ({ isDark, rows }) => {
  const suspendedRows = rows && rows.length > 0 ? rows : [
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
  ];

  // Build treegraph data: root -> areas -> drugtypes
  const treeData = useMemo(() => {
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
  }, [suspendedRows]);

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
        <div className="bg-white/60 dark:bg-gray-900/60 backdrop-blur-sm rounded-2xl border border-gray-100/50 dark:border-white/5 overflow-hidden shadow-sm p-0">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
            <div className="lg:col-span-7 border-r border-gray-100/60 dark:border-white/10">
              <div className="overflow-x-auto">
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
                    {suspendedRows.map((row, i) => (
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
            </div>
            <div className="lg:col-span-5 p-4">
              <div style={{ width: '100%', height: 700 }}>
                <HighchartsReact highcharts={Highcharts} options={nodeOptions} containerProps={{ style: { width: '100%', height: '100%' } }} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SuspendedMedicines;


