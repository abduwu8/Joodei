import React, { useMemo, useState, useEffect } from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import 'highcharts/highcharts-3d';
import { ResponsiveContainer, BarChart as ReBarChart, Bar, CartesianGrid, XAxis, YAxis, Tooltip, Legend, Cell, LabelList } from 'recharts';
import { Box } from '@mui/material';
import { IconThermometer, IconShieldCheck, IconLicense } from '@tabler/icons-react';

// Minimal theme hook shim; consumer can pass isDark, otherwise default to false
const useThemeLike = (propIsDark) => ({ isDark: !!propIsDark });

const PIE_BAR_COLORS = ['#8DC8D9', '#C5B39C', '#288A9A', '#2CCFB2', '#4CB8F6', '#91B3AD', '#9DB391'];

const MedicinesVisualsSection = ({ isDark: isDarkProp }) => {
  // UI: this section renders pie, bar, and stacked charts from filtered local data
  // To integrate backend data, lift state to parent and pass datasets via props
  const { isDark } = useThemeLike(isDarkProp);
  // Dummy dataset (same shape as page version)
  const medicinesList = [
    { trade_name: 'ZYPREXA 10MG F.C.TAB', administrationroute: 'Oral use', distribute_area: 'Pharmacy', temperature_band: 'Room temperature', authorization_status: 'valid', legal_status: 'Prescription', drugtype: 'Generic', public_price: 18500, pharmaceuticalform: 'Film coated Tablet' },
    { trade_name: 'ZYRTEC 10MG F.C.TAB', administrationroute: 'Oral use', distribute_area: 'Pharmacy', temperature_band: 'Room temperature', authorization_status: 'valid', legal_status: 'OTC', drugtype: 'Generic', public_price: 9200, pharmaceuticalform: 'Tablet' },
    { trade_name: 'ZYTELO 25 mg Film Coated Tablet', administrationroute: 'Oral use', distribute_area: 'Pharmacy', temperature_band: 'Cold chain (2-8°C)', authorization_status: 'conditional approval', legal_status: 'Prescription', drugtype: 'NCE', public_price: 1250000, pharmaceuticalform: 'Film coated Tablet' },
    { trade_name: 'ZYTIGA 500 Film-coated Tablet', administrationroute: 'Oral use', distribute_area: 'Pharmacy', temperature_band: 'Room temperature', authorization_status: 'valid', legal_status: 'Prescription', drugtype: 'NCE', public_price: 890000, pharmaceuticalform: 'Tablet' },
    { trade_name: 'ZYTEDIN 100MG POWDER FOR INJECTION', administrationroute: 'Subcutaneous use', distribute_area: 'Hospital', temperature_band: 'Frozen', authorization_status: 'suspended', legal_status: 'Prescription', drugtype: 'Biological', public_price: 22400000, pharmaceuticalform: 'Powder for injection' },
    { trade_name: 'ZIVYOX 2 MG/ML SOLUTION FOR INFUSION', administrationroute: 'Intravenous use', distribute_area: 'Hospital', temperature_band: 'Cold chain (2-8°C)', authorization_status: 'valid', legal_status: 'Prescription', drugtype: 'Biological', public_price: 24100000, pharmaceuticalform: 'Solution for infusion' },
  ];

  // UI: local filters/state
  const [selectedTemperatureBand, setSelectedTemperatureBand] = useState('All');
  const [selectedAuthorizationStatuses, setSelectedAuthorizationStatuses] = useState([]);
  const [selectedLegalStatuses, setSelectedLegalStatuses] = useState([]);
  const [medsView, setMedsView] = useState('table');

  const temperatureBands = ['All', 'Cold chain (2-8°C)', 'Room temperature', 'Frozen'];
  const authorizationStatuses = ['conditional approval', 'suspended', 'valid'];
  const legalStatuses = ['OTC', 'Prescription'];

  const filteredMedicines = medicinesList.filter((m) => {
    const tempOk = selectedTemperatureBand === 'All' || m.temperature_band === selectedTemperatureBand;
    const authOk = selectedAuthorizationStatuses.length === 0 || selectedAuthorizationStatuses.includes(m.authorization_status);
    const legalOk = selectedLegalStatuses.length === 0 || selectedLegalStatuses.includes(m.legal_status);
    return tempOk && authOk && legalOk;
  });

  // UI: aggregations for visuals
  const groupByDrugtypeCounts = useMemo(() => Object.values(filteredMedicines.reduce((acc, row) => {
    const key = row.drugtype || 'Unknown';
    if (!acc[key]) acc[key] = { id: key, label: key, value: 0 };
    acc[key].value += 1;
    return acc;
  }, {})), [filteredMedicines]);

  const sumsByDrugtype = useMemo(() => Object.values(filteredMedicines.reduce((acc, row) => {
    const key = row.drugtype || 'Unknown';
    if (!acc[key]) acc[key] = { drugtype: key, sum: 0 };
    acc[key].sum += Number(row.public_price || 0);
    return acc;
  }, {})).sort((a, b) => b.sum - a.sum), [filteredMedicines]);

  const pharmaForms = useMemo(() => {
    const set = new Set(filteredMedicines.map(m => m.pharmaceuticalform || 'Unknown'));
    return Array.from(set);
  }, [filteredMedicines]);

  const drugtypesUnique = useMemo(() => {
    const set = new Set(filteredMedicines.map(m => m.drugtype || 'Unknown'));
    return Array.from(set);
  }, [filteredMedicines]);

  const countsByFormAndDrugtype = useMemo(() => {
    const map = {};
    pharmaForms.forEach(f => { map[f] = {}; drugtypesUnique.forEach(d => { map[f][d] = 0; }); });
    filteredMedicines.forEach(m => {
      const f = m.pharmaceuticalform || 'Unknown';
      const d = m.drugtype || 'Unknown';
      if (!map[f]) map[f] = {};
      if (!map[f][d]) map[f][d] = 0;
      map[f][d] += 1;
    });
    return map;
  }, [filteredMedicines, pharmaForms, drugtypesUnique]);

  const formatMillions = (val) => {
    if (val >= 1_000_000) return `${(val / 1_000_000).toFixed(2)}M`;
    if (val >= 1_000) return `${(val / 1_000).toFixed(1)}K`;
    return `${val}`;
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

  const pieVisualOptions = useMemo(() => ({
    chart: { type: 'pie', backgroundColor: 'transparent' },
    colors: PIE_BAR_COLORS,
    title: { text: '' },
    subtitle: { text: '' },
    tooltip: { headerFormat: '', pointFormat: '<span style="color:{point.color}">●</span> {point.name}: <b>{point.percentage:.1f}%</b>' },
    legend: { itemStyle: { color: isDark ? '#ffffff' : '#111827' } },
    plotOptions: { pie: { allowPointSelect: true, borderWidth: 2, cursor: 'pointer', colors: PIE_BAR_COLORS, dataLabels: { enabled: true, distance: 20, formatter: function () { return `<b>${this.point.name}</b><br/>${this.percentage.toFixed(1)}%`; }, style: { color: isDark ? '#ffffff' : '#111827', textOutline: 'none' } } } },
    series: [{ type: 'pie', enableMouseTracking: false, animation: { duration: 2000 }, colorByPoint: true, data: pieSeriesData, colors: PIE_BAR_COLORS }],
    credits: { enabled: false }
  }), [pieSeriesData, isDark]);

  const sumsTotal = useMemo(() => sumsByDrugtype.reduce((s, d) => s + d.sum, 0), [sumsByDrugtype]);

  const stackedSeries = useMemo(() => (
    drugtypesUnique.map((dt, idx) => ({
      type: 'column',
      name: dt,
      data: pharmaForms.map(f => countsByFormAndDrugtype[f]?.[dt] || 0),
      stack: 'forms',
      color: PIE_BAR_COLORS[idx % PIE_BAR_COLORS.length]
    }))
  ), [drugtypesUnique, pharmaForms, countsByFormAndDrugtype]);

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
              {filteredMedicines.map((row, idx) => (
                <tr key={idx} className="group hover:bg-white/40 dark:hover:bg-gray-800/40 transition-all duration-200">
                  <td className="px-8 py-5 whitespace-nowrap"><div className="text-sm font-semibold text-gray-900 dark:text-white tracking-tight">{row.trade_name}</div></td>
                  <td className="px-8 py-5 whitespace-nowrap"><div className="text-sm text-gray-700 dark:text-gray-300">{row.administrationroute}</div></td>
                  <td className="px-8 py-5 whitespace-nowrap"><span className="inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset bg-gray-100 text-gray-700 dark:bg-white/10 dark:text-white/80 dark:ring-white/10">{row.distribute_area}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="px-4 pb-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white/50 dark:bg-gray-900/40 rounded-xl border border-gray-100/70 dark:border-white/10 p-4">
              <h4 className="text-lg md:text-xl font-semibold text-gray-900 dark:text-white mb-3">Count of drugtype by drugtype</h4>
              <div style={{ width: '100%', height: 320 }}>
                <HighchartsReact highcharts={Highcharts} options={pieVisualOptions} containerProps={{ style: { width: '100%', height: '100%' } }} />
              </div>
            </div>
            <div className="bg-white/50 dark:bg-gray-900/40 rounded-xl border border-gray-100/70 dark:border-white/10 p-4">
              <h4 className="text-lg md:text-xl font-semibold text-gray-900 dark:text-white mb-3">Sum of public_price by drugtype</h4>
              <div style={{ width: '100%', height: 320 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <ReBarChart data={sumsByDrugtype} layout="vertical" margin={{ top: 10, right: 40, bottom: 10, left: 90 }} className="text-tertiary">
                    <CartesianGrid strokeDasharray="3 3" stroke={isDark ? '#374151' : '#e5e7eb'} />
                    <XAxis type="number" tick={{ fill: isDark ? '#e5e7eb' : '#111827' }} tickFormatter={(v) => `$${formatMillions(v)}`} />
                    <YAxis type="category" dataKey="drugtype" tick={{ fill: isDark ? '#e5e7eb' : '#111827' }} width={110} />
                    <Tooltip formatter={(v) => `$${formatMillions(v)}`} cursor={{ fill: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)' }} />
                    <Legend />
                    <Bar dataKey="sum" name="Public Price" maxBarSize={32}>
                      {sumsByDrugtype.map((entry, index) => (
                        <Cell key={`cell-sum-${index}`} fill={PIE_BAR_COLORS[index % PIE_BAR_COLORS.length]} />
                      ))}
                      <LabelList dataKey="sum" position="right" formatter={(v) => `$${formatMillions(v)}`} />
                    </Bar>
                  </ReBarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
          <div className="mt-6 bg-white/50 dark:bg-gray-900/40 rounded-xl border border-gray-100/70 dark:border-white/10 p-4">
            <h4 className="text-lg md:text-xl font-semibold text-gray-900 dark:text-white mb-3">Count of drugtype by pharmaceuticalform and drugtype</h4>
            <div style={{ width: '100%', height: 360 }}>
              <HighchartsReact highcharts={Highcharts} options={stackedOptions} containerProps={{ style: { width: '100%', height: '100%' } }} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MedicinesVisualsSection;
