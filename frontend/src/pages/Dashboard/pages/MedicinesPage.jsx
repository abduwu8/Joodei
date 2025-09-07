import React, { useState, useEffect, useMemo } from 'react';
import CanvasJSReact from '@canvasjs/react-charts';
import { ResponsiveContainer, ComposedChart, CartesianGrid, Tooltip, Legend, XAxis, YAxis, Line, Scatter, BarChart as ReBarChart, Bar, Cell, LabelList, LineChart } from 'recharts';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import 'highcharts/highcharts-3d';
import SuspendedNodes from '../../../components/SuspendedNodes';
import MarketingCompanyCountryTable from '../../../components/MarketingCompanyCountryTable';
import { ResponsiveLine } from '@nivo/line';
import { ResponsiveAreaBump } from '@nivo/bump';
import { Box } from '@mui/material';
import { PieChart, SparkLineChart } from '@mui/x-charts';
import MedicineGlobe from '../../../components/ui/MedicineGlobe';
import { useTheme } from '../../../context/ThemeContext';
import { IconPills, IconBuilding, IconGlobe, IconRoute, IconPackage, IconCertificate, IconClock, IconCurrencyDollar, IconThermometer, IconShieldCheck, IconLicense } from '@tabler/icons-react';
import { LazyMotion, domAnimation, m } from 'framer-motion';
import DefenseRDChart from '../../../components/DefenseRDChart';
import DistributionAreaChart from '../../../components/DistributionAreaChart';
import MedicinesVisualsSection from '../../../components/MedicinesVisualsSection';

const cardVariants = {
  hidden: { opacity: 0, y: 8 },
  show: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.28, ease: 'easeOut', delay: i * 0.05 }
  })
};

// Helper: render-on-scroll to trigger native chart animations
const useInViewOnce = (options) => {
  const ref = React.useRef(null);
  const [inView, setInView] = useState(false);
  React.useEffect(() => {
    if (!ref.current || inView) return;
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setInView(true);
        obs.disconnect();
      }
    }, options || { threshold: 0.25 });
    obs.observe(ref.current);
    return () => obs.disconnect();
  }, [inView, options]);
  return [ref, inView];
};

// Tiny 3D bar chart for stat cards
const Mini3DBarChart = ({ color, data, dark }) => {
  const darker = Highcharts.color(color).brighten(dark ? -0.1 : -0.35).get();
  const lighter = Highcharts.color(color).brighten(dark ? 0.3 : 0.25).get();
  const border = Highcharts.color(color).brighten(dark ? -0.5 : -0.45).get();
  const options = {
    chart: {
      type: 'column',
      backgroundColor: 'rgba(0,0,0,0)',
      plotBackgroundColor: 'rgba(0,0,0,0)',
      plotBorderWidth: 0,
      plotShadow: false,
      shadow: false,
      borderWidth: 0,
      options3d: {
        enabled: true,
        alpha: 15,
        beta: 15,
        depth: 40,
        viewDistance: 25,
        frame: {
          bottom: { size: 0, color: 'transparent' },
          back: { size: 0, color: 'transparent' },
          side: { size: 0, color: 'transparent' }
        }
      },
      spacing: [0, 0, 0, 0],
      margin: [0, 0, 0, 0],
      animation: false,
    },
    title: { text: '' },
    subtitle: { text: '' },
    legend: { enabled: false },
    credits: { enabled: false },
    tooltip: { enabled: false },
    xAxis: {
      categories: data.map((_, i) => `${i + 1}`),
      lineWidth: 0,
      tickLength: 0,
      gridLineWidth: 0,
      minorGridLineWidth: 0,
      labels: { enabled: false },
      visible: false,
    },
    yAxis: {
      title: { text: null },
      gridLineWidth: 0,
      minorGridLineWidth: 0,
      labels: { enabled: false },
      lineWidth: 0,
      tickLength: 0,
      min: 0,
      visible: false,
    },
    plotOptions: {
      series: {
        shadow: false,
        borderWidth: 0,
        states: { inactive: { opacity: 1 } },
      },
      column: {
        depth: 25,
        borderWidth: dark ? 1 : 0,
        borderColor: border,
        shadow: false,
        color: {
          linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1 },
          stops: [
            [0, lighter],
            [1, darker]
          ]
        },
        // Increase paddings to create visible gaps between bars
        pointPadding: 0.2,
        groupPadding: 0.1,
      }
    },
    series: [
      {
        type: 'column',
        data,
        colorByPoint: false,
        borderWidth: dark ? 1 : 0,
        shadow: false,
        borderColor: border,
      }
    ],
  };
  return (
    <div className="mini-3d-chart" style={{ width: '100%', height: '140px' }}>
      <style>{`
        .mini-3d-chart .highcharts-background,
        .mini-3d-chart .highcharts-plot-background,
        .mini-3d-chart .highcharts-plot-border,
        .mini-3d-chart .highcharts-grid-line,
        .mini-3d-chart .highcharts-3d-frame,
        .mini-3d-chart .highcharts-3d-frame path,
        .mini-3d-chart .highcharts-3d-side,
        .mini-3d-chart .highcharts-3d-side path {
          fill: transparent !important;
          stroke: transparent !important;
        }
      `}</style>
      <HighchartsReact
        highcharts={Highcharts}
        options={options}
        containerProps={{ style: { width: '100%', height: '100%' } }}
      />
    </div>
  );
};

// (Removed Mini3DPieChart in favor of sparkline trend on stat cards)

// Minimal SVG trend line to match reference style
const MiniTrendLineSVG = ({ color }) => {
  return (
    <svg width="100%" height="56" viewBox="0 0 120 56" preserveAspectRatio="none">
      <path
        d="M8 44 L 20 38 L 32 42 L 44 30 L 56 34 L 68 26 L 80 32 L 92 20 L 104 24 L 116 16"
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

const MedicinesPage = () => {
  const PALETTE = ['#8DC8D9', '#C5B39C', '#288A9A', '#2CCFB2', '#4CB8F6'];
  // Palette presets to try different contrasting looks
  const CHART_PALETTES = {
    vibrant: ['#8DC8D9', '#C5B39C', '#288A9A', '#2CCFB2', '#4CB8F6'],
    aurora:  ['#8DC8D9', '#C5B39C', '#288A9A', '#2CCFB2', '#4CB8F6'],
    deep:    ['#288A9A', '#C5B39C', '#2CCFB2', '#8DC8D9', '#4CB8F6'],
    retro:   ['#8DC8D9', '#2CCFB2', '#C5B39C', '#288A9A', '#4CB8F6'],
    image:   ['#8DC8D9', '#C5B39C', '#288A9A', '#2CCFB2', '#4CB8F6'],
  };
  // Choose active palette with distinct colors from reference image
  const PIE_BAR_COLORS = ['#8DC8D9', '#C5B39C', '#288A9A', '#2CCFB2', '#4CB8F6', '#91B3AD', '#9DB391'];
  // Theme
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  // Accent colors to match reference image (teal lines, blue bars, orange price)
  const ACCENT = {
    teal: '#2CCFB2',
    blue: '#4CB8F6',
    orange: '#F59E0B',
    gray: '#9CA3AF',
    pink: '#EC4899',
  };

  // Filters based on backend fields
  const [selectedDrugType, setSelectedDrugType] = useState('All');
  const [selectedCountry, setSelectedCountry] = useState('All');
  const [selectedArea, setSelectedArea] = useState('All');
  const [selectedRoute, setSelectedRoute] = useState('All');
  const [selectedForm, setSelectedForm] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [selectedShelfLife, setSelectedShelfLife] = useState('All');

  // Mock options (reflecting backend CSV columns)
  const drugTypes = ['All', 'Antibiotic', 'Painkiller', 'Vitamin', 'Antihistamine', 'Cardiovascular', 'Oncology'];
  const countries = ['All', 'Saudi Arabia', 'United States', 'Germany', 'United Kingdom', 'France', 'India', 'Switzerland', 'China'];
  const areas = ['All', 'Riyadh', 'Jeddah', 'Dammam', 'Mecca', 'Medina'];
  const routes = ['All', 'Oral', 'Intravenous', 'Intramuscular', 'Topical', 'Inhalation'];
  const forms = ['All', 'Tablet', 'Capsule', 'Syrup', 'Injection', 'Cream'];
  const statuses = ['All', 'Approved', 'Pending', 'Rejected', 'Expired'];
  const shelfLives = ['All', '6-12 months', '1-2 years', '2-3 years', '3-5 years', '5+ years'];

  // Fetch one value from backend (FastAPI): total medicines
  const [totalMedicines, setTotalMedicines] = useState(null);
  const [statsApi, setStatsApi] = useState(null);
  React.useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();
    const fetchSummary = async () => {
      try {
        const params = new URLSearchParams();
        if (selectedDrugType && selectedDrugType !== 'All') params.append('drugtype', selectedDrugType);
        if (selectedCountry && selectedCountry !== 'All') params.append('country', selectedCountry);
        if (selectedArea && selectedArea !== 'All') params.append('area', selectedArea);
        if (selectedRoute && selectedRoute !== 'All') params.append('route', selectedRoute);
        if (selectedForm && selectedForm !== 'All') params.append('form', selectedForm);
        if (selectedStatus && selectedStatus !== 'All') params.append('status', selectedStatus);

        const [resSummary, resStats] = await Promise.all([
          fetch(`http://localhost:8000/api/summary?${params.toString()}`, { signal: controller.signal }),
          fetch(`http://localhost:8000/api/stats?${params.toString()}`, { signal: controller.signal }),
        ]);
        if (resSummary?.ok) {
          const data = await resSummary.json();
          if (isMounted && typeof data?.total_medicines === 'number') {
            setTotalMedicines(data.total_medicines);
          }
        }
        if (resStats?.ok) {
          const s = await resStats.json();
          if (isMounted) setStatsApi(s);
        }
      } catch (e) {
        // swallow network errors for now
      }
    };
    fetchSummary();
    return () => { isMounted = false; controller.abort(); };
  }, [selectedDrugType, selectedCountry, selectedArea, selectedRoute, selectedForm, selectedStatus]);

  // Stats - first item uses real API value when available
  const stats = [
    { title: 'Total Medicines', value: totalMedicines != null ? totalMedicines.toLocaleString() : '—', icon: IconPills, color: ACCENT.teal, bgColor: ACCENT.teal },
    { title: 'Scientific Names', value: statsApi?.scientific_names != null ? statsApi.scientific_names.toLocaleString() : '—', icon: IconCertificate, color: ACCENT.blue, bgColor: ACCENT.blue },
    { title: 'Manufacturers', value: statsApi?.manufacturers != null ? statsApi.manufacturers.toLocaleString() : '—', icon: IconBuilding, color: ACCENT.teal, bgColor: ACCENT.teal },
    { title: 'Countries', value: statsApi?.countries != null ? statsApi.countries.toLocaleString() : '—', icon: IconGlobe, color: ACCENT.blue, bgColor: ACCENT.blue },
    { title: 'Administration Routes', value: statsApi?.routes != null ? statsApi.routes.toLocaleString() : '—', icon: IconRoute, color: ACCENT.teal, bgColor: ACCENT.teal },
    { title: 'Pharmaceutical Forms', value: statsApi?.forms != null ? statsApi.forms.toLocaleString() : '—', icon: IconPackage, color: ACCENT.pink, bgColor: ACCENT.pink },
    { title: 'Avg Public Price', value: statsApi?.avg_public_price != null ? `$${statsApi.avg_public_price.toFixed(2)}` : '—', icon: IconCurrencyDollar, color: ACCENT.orange, bgColor: ACCENT.orange },
    { title: 'Last Updated', value: statsApi?.last_updated ? new Date(statsApi.last_updated).toLocaleString() : '—', icon: IconClock, color: ACCENT.gray, bgColor: ACCENT.gray }
  ];

  // Tiny inline charts for stat cards
  const miniTrendData = [
    { x: 0, y: 36 },
    { x: 1, y: 24 },
    { x: 2, y: 30 },
    { x: 3, y: 18 },
    { x: 4, y: 12 },
    { x: 5, y: 6 },
    { x: 6, y: 0 },
  ];
  const miniBarData = [
    { x: 0, v: 12 },
    { x: 1, v: 24 },
    { x: 2, v: 18 },
    { x: 3, v: 30 },
    { x: 4, v: 36 },
    { x: 5, v: 42 },
  ];

  // Monthly registrations from API
  const [monthlyRegistrations, setMonthlyRegistrations] = useState([]);
  const [monthlyRegistrationsLoading, setMonthlyRegistrationsLoading] = useState(true);
  React.useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();
    const fetchMonthlyRegistrations = async () => {
      try {
        setMonthlyRegistrationsLoading(true);
        const params = new URLSearchParams();
        if (selectedDrugType && selectedDrugType !== 'All') params.append('drugtype', selectedDrugType);
        if (selectedCountry && selectedCountry !== 'All') params.append('country', selectedCountry);
        if (selectedArea && selectedArea !== 'All') params.append('area', selectedArea);
        if (selectedRoute && selectedRoute !== 'All') params.append('route', selectedRoute);
        if (selectedForm && selectedForm !== 'All') params.append('form', selectedForm);
        if (selectedStatus && selectedStatus !== 'All') params.append('status', selectedStatus);
        
        const res = await fetch(`http://localhost:8000/api/monthly-registrations?${params.toString()}`, { signal: controller.signal });
        if (!res.ok) return;
        const data = await res.json();
        if (isMounted && Array.isArray(data)) {
          setMonthlyRegistrations(data);
        }
      } catch (e) {
        // ignore network errors
      } finally {
        if (isMounted) {
          setMonthlyRegistrationsLoading(false);
        }
      }
    };
    fetchMonthlyRegistrations();
    return () => { isMounted = false; controller.abort(); };
  }, [selectedDrugType, selectedCountry, selectedArea, selectedRoute, selectedForm, selectedStatus]);

  // CanvasJS chart for Monthly Registrations
  const CanvasJSChart = CanvasJSReact.CanvasJSChart;
  const monthlyDataPoints = monthlyRegistrations.map((m) => {
    // Parse the month string (format: "2024-01") to create a proper date
    const [year, month] = m.month.split('-');
    return { x: new Date(parseInt(year), parseInt(month) - 1, 1), y: m.count };
  });
  const canvasOptions = {
    animationEnabled: true,
    backgroundColor: 'transparent',
    title: {
      text: '',
      fontColor: isDark ? '#ffffff' : '#111827'
    },
    axisX: {
      valueFormatString: 'MMM',
      labelFontColor: isDark ? '#e5e7eb' : '#111827',
      lineColor: isDark ? '#374151' : '#e5e7eb',
      tickColor: isDark ? '#374151' : '#e5e7eb'
    },
    axisY: {
      title: 'Registrations',
      labelFontColor: isDark ? '#e5e7eb' : '#111827',
      titleFontColor: isDark ? '#e5e7eb' : '#111827',
      gridColor: isDark ? '#374151' : '#e5e7eb'
    },
    toolTip: {
      shared: false,
      content: '{x}: {y}',
      fontColor: isDark ? '#ffffff' : '#111827',
      backgroundColor: isDark ? 'rgba(17,24,39,0.95)' : '#ffffff',
      borderColor: isDark ? '#374151' : '#e5e7eb',
      borderThickness: 1,
      cornerRadius: 6,
      fontSize: 12,
    },
    data: [
      {
        type: 'spline',
        color: isDark ? '#20c997' : '#20c997',
        markerColor: isDark ? '#20c997' : '#20c997',
        xValueFormatString: 'MMMM',
        yValueFormatString: '#,###',
        dataPoints: monthlyDataPoints,
      },
    ],
  };

  // Drug type distribution from API
  const [drugTypeDistribution, setDrugTypeDistribution] = useState([]);
  React.useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();
    const fetchDrugTypes = async () => {
      try {
        const params = new URLSearchParams();
        if (selectedDrugType && selectedDrugType !== 'All') params.append('drugtype', selectedDrugType);
        if (selectedCountry && selectedCountry !== 'All') params.append('country', selectedCountry);
        if (selectedArea && selectedArea !== 'All') params.append('area', selectedArea);
        if (selectedRoute && selectedRoute !== 'All') params.append('route', selectedRoute);
        if (selectedForm && selectedForm !== 'All') params.append('form', selectedForm);
        if (selectedStatus && selectedStatus !== 'All') params.append('status', selectedStatus);
        const res = await fetch(`http://localhost:8000/api/drugtype-distribution?${params.toString()}`, { signal: controller.signal });
        if (!res.ok) return;
        const data = await res.json();
        if (isMounted && Array.isArray(data)) {
          setDrugTypeDistribution(data);
        }
      } catch (e) {
        // ignore
      }
    };
    fetchDrugTypes();
    return () => { isMounted = false; controller.abort(); };
  }, [selectedDrugType, selectedCountry, selectedArea, selectedRoute, selectedForm, selectedStatus]);

  // Distribution areas from API
  const [distributeAreaDistribution, setDistributeAreaDistribution] = useState([]);
  React.useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();
    const fetchAreas = async () => {
      try {
        const params = new URLSearchParams();
        if (selectedDrugType && selectedDrugType !== 'All') params.append('drugtype', selectedDrugType);
        if (selectedCountry && selectedCountry !== 'All') params.append('country', selectedCountry);
        if (selectedArea && selectedArea !== 'All') params.append('area', selectedArea);
        if (selectedRoute && selectedRoute !== 'All') params.append('route', selectedRoute);
        if (selectedForm && selectedForm !== 'All') params.append('form', selectedForm);
        if (selectedStatus && selectedStatus !== 'All') params.append('status', selectedStatus);
        const res = await fetch(`http://localhost:8000/api/distribution-areas?${params.toString()}`, { signal: controller.signal });
        if (!res.ok) return;
        const data = await res.json();
        if (isMounted && Array.isArray(data)) setDistributeAreaDistribution(data);
      } catch (e) {
        // ignore
      }
    };
    fetchAreas();
    return () => { isMounted = false; controller.abort(); };
  }, [selectedDrugType, selectedCountry, selectedArea, selectedRoute, selectedForm, selectedStatus]);

  // Fetch medicines by country from API
  const [medicinesByCountryApi, setMedicinesByCountryApi] = useState([]);
  const [medicinesByCountryLoading, setMedicinesByCountryLoading] = useState(true);

  // Dummy medicines data
  const [activeTab, setActiveTab] = useState('top'); // 'top' or 'bottom'
  const [viewMode, setViewMode] = useState('table'); // 'table' or 'graph'
  React.useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();
    
    const fetchMedicinesByCountry = async () => {
      try {
        setMedicinesByCountryLoading(true);
        const params = new URLSearchParams();
        if (selectedDrugType && selectedDrugType !== 'All') params.append('drugtype', selectedDrugType);
        if (selectedCountry && selectedCountry !== 'All') params.append('country', selectedCountry);
        if (selectedArea && selectedArea !== 'All') params.append('area', selectedArea);
        if (selectedRoute && selectedRoute !== 'All') params.append('route', selectedRoute);
        if (selectedForm && selectedForm !== 'All') params.append('form', selectedForm);
        if (selectedStatus && selectedStatus !== 'All') params.append('status', selectedStatus);
        
        const res = await fetch(`http://localhost:8000/api/medicines-by-country?${params.toString()}`, { signal: controller.signal });
        if (!res.ok) return;
        const data = await res.json();
        if (isMounted && Array.isArray(data)) {
          setMedicinesByCountryApi(data);
        }
      } catch (e) {
        // ignore
      } finally {
        if (isMounted) setMedicinesByCountryLoading(false);
      }
    };
    fetchMedicinesByCountry();
    return () => { isMounted = false; controller.abort(); };
  }, [selectedDrugType, selectedCountry, selectedArea, selectedRoute, selectedForm, selectedStatus]);

  // Filters for price analysis
  const [selectedDistributeAreas, setSelectedDistributeAreas] = useState([]); // ['Hospital', 'Pharmacy']

  // Dummy medicines list for basic table (trade_name, administrationroute, distribute_area)
  const medicinesList = [
    { trade_name: 'ZYPREXA 10MG F.C.TAB', administrationroute: 'Oral use', distribute_area: 'Pharmacy', temperature_band: 'Room temperature', authorization_status: 'valid', legal_status: 'Prescription', drugtype: 'Generic', public_price: 18_500, pharmaceuticalform: 'Film coated Tablet' },
    { trade_name: 'ZYRTEC 10MG F.C.TAB', administrationroute: 'Oral use', distribute_area: 'Pharmacy', temperature_band: 'Room temperature', authorization_status: 'valid', legal_status: 'OTC', drugtype: 'Generic', public_price: 9_200, pharmaceuticalform: 'Tablet' },
    { trade_name: 'ZYTELO 25 mg Film Coated Tablet', administrationroute: 'Oral use', distribute_area: 'Pharmacy', temperature_band: 'Cold chain (2-8°C)', authorization_status: 'conditional approval', legal_status: 'Prescription', drugtype: 'NCE', public_price: 1_250_000, pharmaceuticalform: 'Film coated Tablet' },
    { trade_name: 'ZYTIGA 500 Film-coated Tablet', administrationroute: 'Oral use', distribute_area: 'Pharmacy', temperature_band: 'Room temperature', authorization_status: 'valid', legal_status: 'Prescription', drugtype: 'NCE', public_price: 890_000, pharmaceuticalform: 'Tablet' },
    { trade_name: 'ZYTEDIN 100MG POWDER FOR INJECTION', administrationroute: 'Subcutaneous use', distribute_area: 'Hospital', temperature_band: 'Frozen', authorization_status: 'suspended', legal_status: 'Prescription', drugtype: 'Biological', public_price: 22_400_000, pharmaceuticalform: 'Powder for injection' },
    { trade_name: 'ZIVYOX 2 MG/ML SOLUTION FOR INFUSION', administrationroute: 'Intravenous use', distribute_area: 'Hospital', temperature_band: 'Cold chain (2-8°C)', authorization_status: 'valid', legal_status: 'Prescription', drugtype: 'Biological', public_price: 24_100_000, pharmaceuticalform: 'Solution for infusion' },
    { trade_name: 'ZYROSAL 10MG F.C.TABLET', administrationroute: 'Oral use', distribute_area: 'Pharmacy', temperature_band: 'Room temperature', authorization_status: 'valid', legal_status: 'OTC', drugtype: 'Generic', public_price: 6_800, pharmaceuticalform: 'Tablet' },
    { trade_name: 'ZYPREXA 5MG COATED TABLETS', administrationroute: 'Oral use', distribute_area: 'Pharmacy', temperature_band: 'Room temperature', authorization_status: 'conditional approval', legal_status: 'Prescription', drugtype: 'Generic', public_price: 11_300, pharmaceuticalform: 'Film coated Tablet' },
    { trade_name: 'ZYTELO 12.5 mg/ 1000 mg Film Coated Tablet', administrationroute: 'Oral use', distribute_area: 'Pharmacy', temperature_band: 'Cold chain (2-8°C)', authorization_status: 'valid', legal_status: 'Prescription', drugtype: 'Radiopharmaceutical', public_price: 120_000, pharmaceuticalform: 'Solution' },
    { trade_name: 'ZYTELO PLUS 12.5 mg/ 500 mg Film Coated Tablet', administrationroute: 'Oral use', distribute_area: 'Pharmacy', temperature_band: 'Room temperature', authorization_status: 'valid', legal_status: 'OTC', drugtype: 'Generic', public_price: 8_900, pharmaceuticalform: 'Film coated Tablet' },
  ];

  // Local filters for the dummy medicines table
  const [selectedTemperatureBand, setSelectedTemperatureBand] = useState('All');
  const [selectedAuthorizationStatuses, setSelectedAuthorizationStatuses] = useState([]); // ['conditional approval', 'suspended', 'valid']
  const [selectedLegalStatuses, setSelectedLegalStatuses] = useState([]); // ['OTC', 'Prescription']
  const [medsView, setMedsView] = useState('table'); // 'table' | 'visuals'

  const temperatureBands = ['All', 'Cold chain (2-8°C)', 'Room temperature', 'Frozen'];
  const authorizationStatuses = ['conditional approval', 'suspended', 'valid'];
  const legalStatuses = ['OTC', 'Prescription'];
  const distributeAreasOptions = ['Hospital', 'Pharmacy'];

  const filteredMedicines = medicinesList.filter((m) => {
    const tempOk = selectedTemperatureBand === 'All' || m.temperature_band === selectedTemperatureBand;
    const authOk = selectedAuthorizationStatuses.length === 0 || selectedAuthorizationStatuses.includes(m.authorization_status);
    const legalOk = selectedLegalStatuses.length === 0 || selectedLegalStatuses.includes(m.legal_status);
    return tempOk && authOk && legalOk;
  });

  // Filtered dataset used for price analysis (authorization_status + distribute_area)
  const filteredForPrice = useMemo(() => {
    return medicinesList.filter((m) => {
      const authOk = selectedAuthorizationStatuses.length === 0 || selectedAuthorizationStatuses.includes(m.authorization_status);
      const areaOk = selectedDistributeAreas.length === 0 || selectedDistributeAreas.includes(m.distribute_area);
      return authOk && areaOk;
    });
  }, [medicinesList, selectedAuthorizationStatuses, selectedDistributeAreas]);

  // Compute Top/Bottom 10 by price based on filters
  const topMedicines = useMemo(() => {
    return [...filteredForPrice]
      .sort((a, b) => Number(b.public_price || 0) - Number(a.public_price || 0))
      .slice(0, 10);
  }, [filteredForPrice]);

  const bottomMedicines = useMemo(() => {
    return [...filteredForPrice]
      .sort((a, b) => Number(a.public_price || 0) - Number(b.public_price || 0))
      .slice(0, 10);
  }, [filteredForPrice]);

  // Aggregate for visuals
  const groupByDrugtypeCounts = Object.values(filteredMedicines.reduce((acc, row) => {
    const key = row.drugtype || 'Unknown';
    if (!acc[key]) acc[key] = { id: key, label: key, value: 0 };
    acc[key].value += 1;
    return acc;
  }, {}));

  const sumsByDrugtype = Object.values(filteredMedicines.reduce((acc, row) => {
    const key = row.drugtype || 'Unknown';
    if (!acc[key]) acc[key] = { drugtype: key, sum: 0 };
    acc[key].sum += Number(row.public_price || 0);
    return acc;
  }, {})).sort((a, b) => b.sum - a.sum);

  const formatMillions = (val) => {
    if (val >= 1_000_000) return `${(val / 1_000_000).toFixed(2)}M`;
    if (val >= 1_000) return `${(val / 1_000).toFixed(1)}K`;
    return `${val}`;
  };

  // Country flag mapping function
  const getCountryFlag = (countryName) => {
    const flagMap = {
      'Saudi Arabia': '🇸🇦',
      'United States': '🇺🇸',
      'Germany': '🇩🇪',
      'United Kingdom': '🇬🇧',
      'Italy': '🇮🇹',
      'Canada': '🇨🇦',
      'Spain': '🇪🇸',
      'France': '🇫🇷',
      'India': '🇮🇳',
      'Switzerland': '🇨🇭',
      'China': '🇨🇳',
      'Japan': '🇯🇵',
      'Brazil': '🇧🇷',
      'Australia': '🇦🇺',
      'Netherlands': '🇳🇱',
      'Belgium': '🇧🇪',
      'Sweden': '🇸🇪',
      'Norway': '🇳🇴',
      'Denmark': '🇩🇰',
      'Finland': '🇫🇮'
    };
    return flagMap[countryName] || '🌍'; // Default to world flag if country not found
  };

  // Chart rendering function
  const renderChart = (containerId, data, isTop) => {
    if (typeof Highcharts === 'undefined') return;
    
    const chartData = data.map((medicine, index) => [
      medicine.trade_name.length > 20 ? medicine.trade_name.substring(0, 20) + '...' : medicine.trade_name,
      isTop ? medicine.public_price / 1000000 : medicine.public_price
    ]);

    const colors = isTop 
      ? ['#00d4aa', '#00b8a9', '#009c9f', '#008095', '#00648b', '#004881', '#002c77', '#00106d', '#000063', '#000059']
      : ['#ff6b35', '#ff8e53', '#ffb171', '#ffd48f', '#fff7ad', '#e6d89b', '#ccb989', '#b39a77', '#997b65', '#805c53'];

    Highcharts.chart(containerId, {
      chart: {
        type: 'column',
        backgroundColor: 'transparent',
        style: {
          fontFamily: 'Inter, system-ui, sans-serif'
        }
      },
      title: {
        text: `${isTop ? 'Top 10' : 'Bottom 10'} Medicines by Price`,
        style: {
          color: isTop ? '#00d4aa' : '#ff6b35',
          fontSize: '18px',
          fontWeight: '600'
        }
      },
      subtitle: {
        text: isTop ? 'Highest value medicines in the market' : 'Most affordable medicines available',
        style: {
          color: '#6b7280',
          fontSize: '14px'
        }
      },
      xAxis: {
        type: 'category',
        labels: {
          autoRotation: [-45, -90],
          style: {
            fontSize: '12px',
            fontFamily: 'Inter, system-ui, sans-serif',
            color: '#6b7280'
          }
        },
        lineColor: '#e5e7eb',
        tickColor: '#e5e7eb'
      },
      yAxis: {
        min: 0,
        title: {
          text: isTop ? 'Price (Millions USD)' : 'Price (USD)',
          style: {
            color: '#6b7280',
            fontSize: '14px'
          }
        },
        labels: {
          style: {
            color: '#6b7280',
            fontSize: '12px'
          }
        },
        gridLineColor: '#f3f4f6'
      },
      legend: {
        enabled: false
      },
      tooltip: {
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        borderColor: '#e5e7eb',
        borderRadius: 8,
        shadow: true,
        style: {
          fontSize: '13px'
        },
        pointFormat: isTop 
          ? 'Price: <b>${point.y:.1f}M</b>'
          : 'Price: <b>${point.y:.2f}</b>'
      },
      series: [{
        name: 'Price',
        colors: colors,
        colorByPoint: true,
        groupPadding: 0.1,
        pointPadding: 0.05,
        data: chartData,
        dataLabels: {
          enabled: true,
          rotation: -90,
          color: '#FFFFFF',
          inside: true,
          verticalAlign: 'top',
          format: isTop ? '{point.y:.1f}M' : '${point.y:.2f}',
          y: 10,
          style: {
            fontSize: '11px',
            fontFamily: 'Inter, system-ui, sans-serif',
            fontWeight: '600',
            textShadow: '0 1px 2px rgba(0,0,0,0.3)'
          }
        }
      }],
      credits: {
        enabled: false
      }
    });
  };

  // Render charts when view mode or active tab changes
  React.useEffect(() => {
    if (viewMode === 'graph' && typeof Highcharts !== 'undefined') {
      // Small delay to ensure DOM is ready
      setTimeout(() => {
        renderChart(`chart-container-${activeTab}`, activeTab === 'top' ? topMedicines : bottomMedicines, activeTab === 'top');
      }, 100);
    }
  }, [viewMode, activeTab, topMedicines, bottomMedicines]);

  // Use API data when available, fallback to mock data
  const medicinesByCountry = medicinesByCountryApi.length > 0 ? medicinesByCountryApi : [
    { country: 'Saudi Arabia', count: 365 },
    { country: 'United States', count: 320 },
    { country: 'Germany', count: 290 },
    { country: 'United Kingdom', count: 230 },
    { country: 'France', count: 210 },
    { country: 'India', count: 200 },
    { country: 'Switzerland', count: 160 },
    { country: 'China', count: 140 }
  ];

  const medicinesByForm = [
    { form: 'Tablet', count: 680 },
    { form: 'Capsule', count: 420 },
    { form: 'Syrup', count: 260 },
    { form: 'Injection', count: 220 },
    { form: 'Cream', count: 160 }
  ];

  const statusDistribution = [
    { status: 'Approved', count: 1840 },
    { status: 'Pending', count: 320 },
    { status: 'Rejected', count: 90 },
    { status: 'Expired', count: 95 }
  ];

  // Mock data for Authorization Status Breakdown using Recharts ComposedChart
  const authorizationStatusChartData = [
    { index: 0, red: 20, blue: 28, redLine: 20, blueLine: 28 },
    { index: 1, red: 22, blue: 30, redLine: 22, blueLine: 30 },
    { index: 2, red: 23, blue: 29, redLine: 23, blueLine: 29 },
    { index: 3, red: 25, blue: 32, redLine: 25, blueLine: 32 },
    { index: 4, red: 27, blue: 35, redLine: 27, blueLine: 35 },
    { index: 5, red: 28, blue: 36, redLine: 28, blueLine: 36 },
    { index: 6, red: 30, blue: 38, redLine: 30, blueLine: 38 },
    { index: 7, red: 29, blue: 37, redLine: 29, blueLine: 37 },
    { index: 8, red: 31, blue: 39, redLine: 31, blueLine: 39 },
    { index: 9, red: 33, blue: 41, redLine: 33, blueLine: 41 },
    { index: 10, red: 34, blue: 42, redLine: 34, blueLine: 42 },
    { index: 11, red: 36, blue: 44, redLine: 36, blueLine: 44 }
  ];

  const routeTrendsData = [
    {
      id: 'Oral',
      data: [
        { x: 'Jan', y: 35 },
        { x: 'Feb', y: 38 },
        { x: 'Mar', y: 36 },
        { x: 'Apr', y: 40 },
        { x: 'May', y: 42 },
        { x: 'Jun', y: 45 }
      ]
    },
    {
      id: 'Intravenous',
      data: [
        { x: 'Jan', y: 12 },
        { x: 'Feb', y: 14 },
        { x: 'Mar', y: 16 },
        { x: 'Apr', y: 15 },
        { x: 'May', y: 17 },
        { x: 'Jun', y: 18 }
      ]
    },
    {
      id: 'Intramuscular',
      data: [
        { x: 'Jan', y: 10 },
        { x: 'Feb', y: 11 },
        { x: 'Mar', y: 12 },
        { x: 'Apr', y: 12 },
        { x: 'May', y: 13 },
        { x: 'Jun', y: 14 }
      ]
    },
    {
      id: 'Topical',
      data: [
        { x: 'Jan', y: 9 },
        { x: 'Feb', y: 9 },
        { x: 'Mar', y: 10 },
        { x: 'Apr', y: 11 },
        { x: 'May', y: 12 },
        { x: 'Jun', y: 12 }
      ]
    },
    {
      id: 'Inhalation',
      data: [
        { x: 'Jan', y: 7 },
        { x: 'Feb', y: 8 },
        { x: 'Mar', y: 8 },
        { x: 'Apr', y: 9 },
        { x: 'May', y: 10 },
        { x: 'Jun', y: 10 }
      ]
    }
  ];

  const manufacturerRanking = [
    { manufacturer: 'Pfizer', medicines: 115 },
    { manufacturer: 'Novartis', medicines: 102 },
    { manufacturer: 'Roche', medicines: 96 },
    { manufacturer: 'Merck', medicines: 84 },
    { manufacturer: 'GSK', medicines: 79 },
    { manufacturer: 'Johnson & Johnson', medicines: 72 },
    { manufacturer: 'Sanofi', medicines: 68 },
    { manufacturer: 'AstraZeneca', medicines: 63 }
  ];
  
  const valueFormatter = (item) => `${item.value.toLocaleString()}`;
  const axisStyles = {
    tickLabelStyle: { fill: isDark ? '#e5e7eb' : '#111827' },
    labelStyle: { fill: isDark ? '#e5e7eb' : '#111827' }
  };
  const totalMedicinesByCountry = medicinesByCountry.reduce((s, d) => s + d.count, 0);
  const numCountries = medicinesByCountry.length;

  // Helper function to determine if a color is light or dark
  const isLightColor = (color) => {
    // Convert hex to RGB
    const hex = color.replace('#', '');
    const r = parseInt(hex.substr(0, 2), 16);
    const g = parseInt(hex.substr(2, 2), 16);
    const b = parseInt(hex.substr(4, 2), 16);
    
    // Calculate luminance
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    // Adjusted threshold for better contrast detection
    return luminance > 0.6;
  };

  // Helper to toggle values inside multi-select arrays
  const createToggleHandler = (setter) => (value) => {
    setter((prev) => {
      if (prev.includes(value)) return prev.filter((v) => v !== value);
      return [...prev, value];
    });
  };

  // Label renderers for inside-bar labels with adaptive text color
  const renderInsideTopLabel = (props) => {
    const { x, y, width, value, payload } = props;
    const text = typeof value === 'number' ? value.toLocaleString() : String(value);
    // Get the bar color based on index
    const barIndex = medicinesByForm.findIndex(item => item.count === value);
    const barColor = PIE_BAR_COLORS[barIndex % PIE_BAR_COLORS.length];
    // Use black text for light colors, white for dark colors
    const isLight = isLightColor(barColor);
    const textColor = isLight ? '#000000' : '#ffffff';
    const shadowColor = isLight ? 'rgba(255,255,255,0.8)' : 'rgba(0,0,0,0.8)';
    
    return (
      <text 
        x={x + width / 2} 
        y={y + 14} 
        fill={textColor}
        textAnchor="middle" 
        dominantBaseline="central" 
        fontSize={12}
        style={{ textShadow: `1px 1px 2px ${shadowColor}`, fontWeight: 'bold' }}
      >
        {text}
      </text>
    );
  };

  const renderInsideRightLabel = (props) => {
    const { x, y, width, height, value, payload } = props;
    const text = typeof value === 'number' ? value.toLocaleString() : String(value);
    // Get the bar color based on index
    const barIndex = manufacturerRanking.findIndex(item => item.medicines === value);
    const barColor = PIE_BAR_COLORS[barIndex % PIE_BAR_COLORS.length];
    // Use black text for light colors, white for dark colors
    const isLight = isLightColor(barColor);
    const textColor = isLight ? '#000000' : '#ffffff';
    const shadowColor = isLight ? 'rgba(255,255,255,0.8)' : 'rgba(0,0,0,0.8)';
    
    return (
      <text 
        x={x + width - 6} 
        y={y + height / 2} 
        fill={textColor}
        textAnchor="end" 
        dominantBaseline="central" 
        fontSize={12}
        style={{ textShadow: `1px 1px 2px ${shadowColor}`, fontWeight: 'bold' }}
      >
        {text}
      </text>
    );
  };

  // in-view refs per chart to mount only when visible
  const [monthlyRef, monthlyInView] = useInViewOnce({ threshold: 0.3 });
  const [pieDrugRef, pieDrugInView] = useInViewOnce({ threshold: 0.2 });
  const [pieAreaRef, pieAreaInView] = useInViewOnce({ threshold: 0.2 });
  const [formRef, formInView] = useInViewOnce({ threshold: 0.2 });
  const [authRef, authInView] = useInViewOnce({ threshold: 0.2 });
  const [bumpRef, bumpInView] = useInViewOnce({ threshold: 0.2 });
  const [manuRef, manuInView] = useInViewOnce({ threshold: 0.2 });
  const [hasScrolled, setHasScrolled] = useState(false);
  React.useEffect(() => {
    const onScroll = () => {
      setHasScrolled(true);
      window.removeEventListener('scroll', onScroll);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  

  // Globe: keep rotation disabled for smoother UI

  // Highcharts Pie: plugin for custom fan animation (runs once)
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
            graphic
              .attr({ start: startAngleRadLocal, end: startAngleRadLocal, opacity: 1 })
              .animate({ start: args.start, end: args.end }, { duration: animation.duration / points.length }, function () {
                if (points[point.index + 1]) fanAnimate(points[point.index + 1], args.end);
                if (point.index === series.points.length - 1) {
                  if (series.dataLabelsGroup) {
                    series.dataLabelsGroup.attr({ opacity: 0 }).animate({ opacity: 1 });
                  }
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

  // Highcharts pie options derived from grouped counts
  const pieSeriesData = useMemo(() => (
    groupByDrugtypeCounts.map(d => ({ name: d.label, y: d.value }))
  ), [groupByDrugtypeCounts]);

  const pieVisualOptions = useMemo(() => ({
    chart: { type: 'pie', backgroundColor: 'transparent' },
    title: { text: '' },
    subtitle: { text: '' },
    tooltip: {
      headerFormat: '',
      pointFormat: '<span style="color:{point.color}">●</span> {point.name}: <b>{point.percentage:.1f}%</b>'
    },
    legend: { itemStyle: { color: isDark ? '#ffffff' : '#111827' } },
    plotOptions: {
      pie: {
         allowPointSelect: true,
         borderWidth: 2,
         cursor: 'pointer',
         colors: PIE_BAR_COLORS,
         dataLabels: {
           enabled: true,
           distance: 20,
           formatter: function () { return `<b>${this.point.name}</b><br/>${this.percentage.toFixed(1)}%`; },
           style: { color: isDark ? '#ffffff' : '#111827', textOutline: 'none' }
         }
       }
     },
     series: [{
       type: 'pie',
       enableMouseTracking: false,
       animation: { duration: 2000 },
       colorByPoint: true,
       data: pieSeriesData,
       colors: PIE_BAR_COLORS
     }],
     credits: { enabled: false }
   }), [pieSeriesData, isDark]);

  // Highcharts horizontal bar for Sum of public_price by drugtype
  React.useEffect(() => {
    if (Highcharts?.Templating?.helpers) {
      Highcharts.Templating.helpers.abs = (value) => Math.abs(value);
    }
  }, []);

  const barCategories = React.useMemo(() => sumsByDrugtype.map(d => d.drugtype), [sumsByDrugtype]);
  const barData = React.useMemo(() => sumsByDrugtype.map(d => d.sum), [sumsByDrugtype]);
  const totalBar = React.useMemo(() => barData.reduce((a, b) => a + b, 0), [barData]);

  const barVisualOptions = React.useMemo(() => ({
    chart: { type: 'bar', backgroundColor: 'transparent' },
    title: { text: '' },
    subtitle: { text: '' },
    xAxis: [{
      categories: barCategories,
      reversed: false,
      labels: { style: { color: isDark ? '#ffffff' : '#111827' } }
    }],
    yAxis: {
      title: { text: null },
      labels: {
        style: { color: isDark ? '#ffffff' : '#111827' },
        formatter: function () {
          const pct = totalBar > 0 ? (this.value / totalBar) * 100 : 0;
          return `${pct.toFixed(0)}%`;
        }
      }
    },
    legend: { enabled: false },
    plotOptions: {
      series: {
        borderRadius: '50%',
        dataLabels: {
          enabled: true,
          formatter: function () { return `$${formatMillions(this.y)}`; },
          style: { color: isDark ? '#ffffff' : '#111827', textOutline: 'none', fontWeight: '600' }
        }
      }
    },
    tooltip: {
      backgroundColor: isDark ? 'rgba(17,24,39,0.95)' : '#ffffff',
      style: { color: isDark ? '#ffffff' : '#111827' },
      pointFormatter: function () {
        const pct = totalBar > 0 ? (this.y / totalBar) * 100 : 0;
        return `<b>${this.category}</b><br/>Sum: $${formatMillions(this.y)} (${pct.toFixed(1)}%)`;
      }
    },
    series: [{
      name: 'Public Price',
      type: 'bar',
      data: barData,
      colorByPoint: true,
      colors: PIE_BAR_COLORS
    }],
    credits: { enabled: false }
  }), [barCategories, barData, totalBar, isDark]);

  // Stacked Column: Count of drugtype by pharmaceuticalform and drugtype
  const pharmaForms = React.useMemo(() => {
    const set = new Set(filteredMedicines.map(m => m.pharmaceuticalform || 'Unknown'));
    return Array.from(set);
  }, [filteredMedicines]);

  const drugtypesUnique = React.useMemo(() => {
    const set = new Set(filteredMedicines.map(m => m.drugtype || 'Unknown'));
    return Array.from(set);
  }, [filteredMedicines]);

  const countsByFormAndDrugtype = React.useMemo(() => {
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

  const stackedSeries = React.useMemo(() => (
    drugtypesUnique.map((dt, idx) => ({
      type: 'column',
      name: dt,
      data: pharmaForms.map(f => countsByFormAndDrugtype[f]?.[dt] || 0),
      stack: 'forms',
      color: PIE_BAR_COLORS[idx % PIE_BAR_COLORS.length]
    }))
  ), [drugtypesUnique, pharmaForms, countsByFormAndDrugtype]);

  const stackedOptions = React.useMemo(() => ({
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
    <div className="min-h-screen w-full relative">
      <div className="relative z-10 space-y-6 p-4 pb-20">
        {/* Stats - minimalist small cards */}
        <LazyMotion features={domAnimation} strict>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {stats.map((stat, index) => (
              <m.div
                key={index}
                className="group relative overflow-hidden rounded-xl border border-gray-300 dark:border-white/20 hover:border-gray-400 dark:hover:border-white/30 bg-white dark:bg-transparent will-change-transform transform-gpu"
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, amount: 0.4 }}
                variants={cardVariants}
                custom={index}
                style={{ backfaceVisibility: 'hidden', transform: 'translateZ(0)' }}
              >
                <div className="relative p-4">
                  <div className="flex items-center justify-between gap-3">
                    <div className="space-y-1">
                      <p className="text-xs font-medium text-gray-500 uppercase tracking-wide dark:text-white/70">{stat.title}</p>
                      <p className={`${index === 7 ? 'text-base md:text-lg' : 'text-2xl'} font-bold text-gray-900 dark:text-white`}>{stat.value}</p>
                    </div>
                    {index === 0 || index === 2 ? (
                      <div className="flex-1 flex items-center justify-center ml-3" style={{ height: '56px' }}>
                        <MiniTrendLineSVG color={ACCENT.teal} />
                      </div>
                    ) : index === 1 || index === 3 ? (
                      <div className="flex-1 flex items-center justify-center ml-3" style={{ height: '56px' }}>
                        <Mini3DBarChart color={stat.color} data={miniBarData.map(d => d.v)} dark={isDark} />
                      </div>
                    ) : (
                      <div className="flex items-center justify-center ml-3">
                        <stat.icon className="w-6 h-6" style={{ color: stat.color }} />
                      </div>
                    )}
                  </div>
                </div>
              </m.div>
            ))}
          </div>
        </LazyMotion>

        {/* Filters */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-[0_1px_3px_0_rgb(0,0,0,0.1),0_1px_2px_-1px_rgb(0,0,0,0.1)] border border-gray-100/50 dark:bg-white/5 dark:border-white/10">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 dark:text-white">Filters & Controls</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-7 gap-4">
            <select value={selectedDrugType} onChange={(e) => setSelectedDrugType(e.target.value)} className="bg-white/80 backdrop-blur-sm border border-gray-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-gray-500 text-gray-900 dark:bg-white/5 dark:text-white dark:border-white/10 [&>option]:bg-white [&>option]:text-gray-900 dark:[&>option]:bg-gray-800 dark:[&>option]:text-white">
              {drugTypes.map((x) => <option key={x} value={x}>{x}</option>)}
            </select>
            <select value={selectedCountry} onChange={(e) => setSelectedCountry(e.target.value)} className="bg-white/80 backdrop-blur-sm border border-gray-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-gray-500 text-gray-900 dark:bg-white/5 dark:text-white dark:border-white/10 [&>option]:bg-white [&>option]:text-gray-900 dark:[&>option]:bg-gray-800 dark:[&>option]:text-white">
              {countries.map((x) => <option key={x} value={x}>{x}</option>)}
            </select>
            <select value={selectedArea} onChange={(e) => setSelectedArea(e.target.value)} className="bg-white/80 backdrop-blur-sm border border-gray-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-gray-500 text-gray-900 dark:bg-white/5 dark:text-white dark:border-white/10 [&>option]:bg-white [&>option]:text-gray-900 dark:[&>option]:bg-gray-800 dark:[&>option]:text-white">
              {areas.map((x) => <option key={x} value={x}>{x}</option>)}
            </select>
            <select value={selectedRoute} onChange={(e) => setSelectedRoute(e.target.value)} className="bg-white/80 backdrop-blur-sm border border-gray-200 rounded-lg px-2 py-2 focus:outline-none focus:ring-2 focus:ring-gray-500 text-gray-900 dark:bg-white/5 dark:text-white dark:border-white/10 [&>option]:bg-white [&>option]:text-gray-900 dark:[&>option]:bg-gray-800 dark:[&>option]:text-white">
              {routes.map((x) => <option key={x} value={x}>{x}</option>)}
            </select>
            <select value={selectedForm} onChange={(e) => setSelectedForm(e.target.value)} className="bg-white/80 backdrop-blur-sm border border-gray-200 rounded-lg px-2 py-2 focus:outline-none focus:ring-2 focus:ring-gray-500 text-gray-900 dark:bg-white/5 dark:text-white dark:border-white/10 [&>option]:bg-white [&>option]:text-gray-900 dark:[&>option]:bg-gray-800 dark:[&>option]:text-white">
              {forms.map((x) => <option key={x} value={x}>{x}</option>)}
            </select>
            <select value={selectedStatus} onChange={(e) => setSelectedStatus(e.target.value)} className="bg-white/80 backdrop-blur-sm border border-gray-200 rounded-lg px-2 py-2 focus:outline-none focus:ring-2 focus:ring-gray-500 text-gray-900 dark:bg-white/5 dark:text-white dark:border-white/10 [&>option]:bg-white [&>option]:text-gray-900 dark:[&>option]:bg-gray-800 dark:[&>option]:text-white">
              {statuses.map((x) => <option key={x} value={x}>{x}</option>)}
            </select>
            <select value={selectedShelfLife} onChange={(e) => setSelectedShelfLife(e.target.value)} className="bg-white/80 backdrop-blur-sm border border-gray-200 rounded-lg px-2 py-2 focus:outline-none focus:ring-2 focus:ring-gray-500 text-gray-900 dark:bg-white/5 dark:text-white dark:border-white/10 [&>option]:bg-white [&>option]:text-gray-900 dark:[&>option]:bg-gray-800 dark:[&>option]:text-white">
              {shelfLives.map((x) => <option key={x} value={x}>{x}</option>)}
            </select>
          </div>
        </div>

        {/* Charts Grid - 2 per row on large screens with center divider */}
        <div className="relative">
          <div className="pointer-events-none hidden md:block absolute inset-y-0 left-1/2 -translate-x-1/2 w-px bg-gray-200/80 dark:bg-white/10" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="group relative overflow-visible p-0 text-gray-900 dark:text-white">
            <div className="flex items-center justify-between pt-6 pb-4 border-t border-gray-200 dark:border-white/10">
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Monthly Medicine Registrations</h3>
            </div>
            <div className="h-80" ref={monthlyRef}>
              {hasScrolled && monthlyInView && (
                monthlyRegistrationsLoading ? (
                  <div className="flex items-center justify-center h-full">
                    <div className="text-gray-500 dark:text-gray-400">Loading...</div>
                  </div>
                ) : monthlyRegistrations.length > 0 ? (
                  <CanvasJSChart options={canvasOptions} containerProps={{ width: '100%', height: '100%' }} />
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <div className="text-gray-500 dark:text-gray-400">No data available</div>
                  </div>
                )
              )}
            </div>
          </div>

          <div className="group relative overflow-visible p-0 text-gray-900 dark:text-white">
            <div className="flex items-center justify-between pt-6 pb-4 border-t border-gray-200 dark:border-white/10">
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Drug Type Distribution</h3>
            </div>
            <div className="h-80" ref={pieDrugRef}>
              <Box sx={{ width: '100%', height: 320 }}>
                {hasScrolled && pieDrugInView && (
                <PieChart
                  height={320}
                  colors={PIE_BAR_COLORS}
                  sx={{
                    '--ChartsPie-labelTextColor': '#ffffff',
                    '--ChartsPie-labelLineColor': isDark ? '#9ca3af' : '#6b7280',
                  }}
                  slotProps={{
                    legend: {
                      labelStyle: { fill: isDark ? '#ffffff' : '#111827' },
                      sx: {
                        '--ChartsLegend-labelColor': isDark ? '#ffffff' : '#111827',
                        '& .MuiChartsLegend-label': {
                          fill: isDark ? '#ffffff' : '#111827',
                          color: isDark ? '#ffffff' : '#111827',
                        },
                      },
                    },
                    pieArcLabel: (params) => ({
                      style: {
                        fill: params.dataIndex === 0 ? '#ffffff' : '#ffffff',
                        fontSize: '14px',
                        fontWeight: 'bold',
                        textShadow: '1px 1px 2px rgba(0,0,0,0.8)'
                      }
                    })
                  }}
                  series={[{
                    data: drugTypeDistribution.map(d => ({ id: d.type, value: d.count, label: d.type })),
                    highlightScope: { fade: 'global', highlight: 'item' },
                    faded: { innerRadius: 30, additionalRadius: -30, color: 'gray' },
                    valueFormatter,
                    arcLabel: (item) => `${item.value.toLocaleString()}`,
                    arcLabelMinAngle: 35,
                    innerRadius: 60,
                    outerRadius: 110,
                  }]}
                />
                )}
              </Box>
            </div>
          </div>

          <div className="group relative overflow-visible p-0 text-gray-900 dark:text-white">
            <div className="flex items-center justify-between pt-6 pb-4 border-t border-gray-200 dark:border-white/10">
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Distribution Area</h3>
            </div>
            <div className="h-80" ref={pieAreaRef}>
              {hasScrolled && pieAreaInView && (
                <div className="w-full h-full flex items-center justify-center p-4">
                  <div className="w-full h-full max-w-sm max-h-72">
                    {/* <DistributionAreaChart compact /> */}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="group relative overflow-visible p-0 text-gray-900 dark:text-white">
            <div className="flex items-center justify-between pt-6 pb-4 border-t border-gray-200 dark:border-white/10">
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Medicines by Pharmaceutical Form</h3>
            </div>
            <div className="h-80" ref={formRef}>
              {hasScrolled && formInView && (
              <ResponsiveContainer width="100%" height="100%">
                <ReBarChart data={medicinesByForm} margin={{ top: 10, right: 20, bottom: 20, left: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke={isDark ? '#374151' : '#e5e7eb'} />
                  <XAxis dataKey="form" tick={{ fill: isDark ? '#e5e7eb' : '#111827' }} />
                  <YAxis tick={{ fill: isDark ? '#e5e7eb' : '#111827' }} />
                  <Tooltip />
                  <Bar dataKey="count">
                    {medicinesByForm.map((entry, index) => (
                      <Cell key={`cell-form-${index}`} fill={PIE_BAR_COLORS[index % PIE_BAR_COLORS.length]} />
                    ))}
                    <LabelList dataKey="count" content={renderInsideTopLabel} />
                  </Bar>
                </ReBarChart>
              </ResponsiveContainer>
              )}
            </div>
          </div>

          <div className="group relative overflow-visible p-0 text-gray-900 dark:text-white">
            <div className="flex items-center justify-between pt-6 pb-4 border-t border-gray-200 dark:border-white/10">
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Medicines by Manufacture Country</h3>
            </div>
            <div className="h-80 relative">
              {/* <MedicineGlobe data={medicinesByCountry} autoRotate={false} autoRotateSpeed={0} /> */}
              <div className="pointer-events-none absolute bottom-2 left-2 right-2 flex justify-center">
                <div className="px-3 py-1.5 rounded-md text-xs text-gray-900 dark:text-white bg-white/80 dark:bg-gray-900/70 backdrop-blur border border-gray-200/60 dark:border-white/10 shadow-sm">
                  <span className="font-semibold">Globe</span>: {numCountries} countries • {totalMedicinesByCountry.toLocaleString()} medicines • Hover dots for details
                </div>
              </div>
            </div>
          </div>

          <div className="group relative overflow-visible p-0 text-gray-900 dark:text-white">
            <div className="flex items-center justify-between pt-6 pb-4 border-t border-gray-200 dark:border-white/10">
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Authorization Status Breakdown</h3>
            </div>
            <div className="h-80" ref={authRef}>
              {hasScrolled && authInView && (
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart
                  width={500}
                  height={400}
                  data={authorizationStatusChartData}
                  margin={{
                    top: 20,
                    right: 80,
                    bottom: 20,
                    left: 20,
                  }}
                >
                  <CartesianGrid stroke={isDark ? '#374151' : '#f5f5f5'} />
                  <Tooltip />
                  <Legend />

                  <XAxis dataKey="index" type="number" label={{ value: 'Index', position: 'insideBottomRight', offset: 0 }} />
                  <YAxis unit="ms" type="number" label={{ value: 'Time', angle: -90, position: 'insideLeft' }} />
                  <Scatter name="A" dataKey="red" fill={isDark ? PALETTE[3] : PALETTE[4]} />
                  <Scatter name="B" dataKey="blue" fill={isDark ? PALETTE[0] : PALETTE[1]} />
                  <Line dataKey="blueLine" stroke={isDark ? PALETTE[0] : PALETTE[1]} dot={false} activeDot={false} legendType="none" />
                  <Line dataKey="redLine" stroke={isDark ? PALETTE[3] : PALETTE[4]} dot={false} activeDot={false} legendType="none" />
                </ComposedChart>
              </ResponsiveContainer>
              )}
            </div>
          </div>

          <div className="group relative overflow-visible p-0 text-gray-900 dark:text-white">
            <div className="flex items-center justify-between pt-6 pb-4 border-t border-gray-200 dark:border-white/10">
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Administration Route Distribution</h3>
            </div>
            <div className="h-80" ref={bumpRef}>
              {hasScrolled && bumpInView && (
              <ResponsiveAreaBump
                data={routeTrendsData}
                margin={{ top: 20, right: 20, bottom: 50, left: 60 }}
                spacing={8}
                padding={0.2}
                colors={isDark ? PALETTE : CHART_PALETTES.deep}
                blendMode="multiply"
                align="center"
                interpolation="smooth"
                theme={{
                  axis: {
                    ticks: {
                      line: {
                        stroke: isDark ? '#ffffff' : '#111827',
                        strokeWidth: 1
                      },
                      text: {
                        fill: isDark ? '#ffffff' : '#111827',
                        fontSize: 12
                      }
                    },
                    legend: {
                      text: {
                        fill: isDark ? '#ffffff' : '#111827',
                        fontSize: 12
                      }
                    }
                  },
                  tooltip: {
                    container: {
                      background: isDark ? '#1f2937' : '#ffffff',
                      color: isDark ? '#ffffff' : '#111827',
                      fontSize: 12,
                      borderRadius: 8,
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                    }
                  }
                }}
                axisTop={null}
                axisBottom={{
                  tickSize: 5,
                  tickPadding: 5,
                  tickRotation: 0,
                  legend: 'Month',
                  legendOffset: 36,
                  legendPosition: 'middle'
                }}
              />
              )}
            </div>
          </div>

          <div className="group relative overflow-visible p-0 text-gray-900 dark:text-white">
            <div className="flex items-center justify-between pt-6 pb-4 border-t border-gray-200 dark:border-white/10">
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Top Manufacturers by Medicines</h3>
            </div>
            <div className="h-80" ref={manuRef}>
              {hasScrolled && manuInView && (
              <ResponsiveContainer width="100%" height="100%">
                <ReBarChart data={manufacturerRanking} layout="vertical" margin={{ top: 10, right: 20, bottom: 20, left: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke={isDark ? '#374151' : '#e5e7eb'} />
                  <XAxis type="number" tick={{ fill: isDark ? '#e5e7eb' : '#111827' }} />
                  <YAxis type="category" dataKey="manufacturer" tick={{ fill: isDark ? '#e5e7eb' : '#111827' }} width={120} />
                  <Tooltip />
                  <Bar dataKey="medicines">
                    {manufacturerRanking.map((entry, index) => (
                      <Cell key={`cell-manu-${index}`} fill={PIE_BAR_COLORS[index % PIE_BAR_COLORS.length]} />
                    ))}
                    <LabelList dataKey="medicines" content={renderInsideRightLabel} />
                  </Bar>
                </ReBarChart>
              </ResponsiveContainer>
              )}
            </div>
          </div>
          
          </div>
        </div>

        {/* Medicine Globe - Spans 2 columns with informative insights panel (outside center divider) */}
        <div className="col-span-1 md:col-span-2">
          <div className="group relative overflow-visible p-0 text-gray-900 dark:text-white">
            <div className="flex items-center justify-between pt-6 pb-4 border-t border-gray-200 dark:border-white/10">
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Global Medicine Distribution</h3>
            </div>
            {(() => {
              // prepare top countries for side panel
              const sorted = [...medicinesByCountry].sort((a, b) => b.count - a.count);
              const top = sorted.slice(0, 5);
              return (
                <div className="h-[700px] relative grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-0">
                  <div className="lg:col-span-8 overflow-hidden pr-0 lg:pr-6">
                    {medicinesByCountryLoading ? (
                      <div className="flex items-center justify-center h-full">
                        <div className="text-center">
                          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
                          <p className="text-gray-500 dark:text-gray-400">Loading global data...</p>
                        </div>
                      </div>
                    ) : (
                      <MedicineGlobe 
                        data={medicinesByCountry} 
                        autoRotate={false} 
                        autoRotateSpeed={0}
                        globeSize={1.8}
                      />
                    )}
                  </div>
                  <div className="lg:col-span-4 lg:pl-6 lg:border-l border-gray-200 dark:border-white/10 p-0 flex flex-col gap-4">
                    <div>
                      <p className="text-xs uppercase tracking-wide text-gray-500 dark:text-white/70">Active medicines right now</p>
                      <div className="mt-1 text-3xl font-bold text-gray-900 dark:text-white">{totalMedicinesByCountry.toLocaleString()}</div>
                      <p className="text-xs text-gray-500 dark:text-white/60">across {numCountries} countries</p>
                    </div>
                    <div className="flex-1 divide-y divide-gray-200/80 dark:divide-white/10">
                      {top.map((c, i) => {
                        const pct = totalMedicinesByCountry > 0 ? Math.round((c.count / totalMedicinesByCountry) * 100) : 0;
                        const color = PIE_BAR_COLORS[i % PIE_BAR_COLORS.length];
                        return (
                          <div key={c.country} className="py-3">
                            <div className="flex items-center justify-between text-sm pb-2">
                              <div className="flex items-center gap-2">
                                <span className="inline-block w-2 h-2 rounded-full" style={{ backgroundColor: color }}></span>
                                <span className="text-gray-900 dark:text-white font-medium">{c.country}</span>
                              </div>
                              <div className="text-gray-500 dark:text-white/70">{pct}%</div>
                            </div>
                            <div className="h-1.5 w-full rounded-full bg-gray-200/70 dark:bg-white/10 overflow-hidden">
                              <div className="h-full rounded-full" style={{ width: `${pct}%`, background: color }}></div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-white/60">
                      Data reflects current registry counts. Hover dots on the globe for details.
                    </div>
                  </div>
                  <div className="pointer-events-none absolute bottom-4 left-4 right-4 flex justify-center lg:justify-start lg:right-auto">
                    <div className="px-4 py-2 rounded-lg text-sm text-gray-900 dark:text-white bg-white/90 dark:bg-gray-900/80 backdrop-blur border border-gray-200/60 dark:border-white/20 shadow-lg">
                      <span className="font-semibold">Interactive Globe</span>: Drag to rotate • Scroll to zoom • Pan to explore
                    </div>
                  </div>
                </div>
              );
            })()}
          </div>
        </div>

        {/* Distribution Area - Large section below the globe */}
        <div className="col-span-1 md:col-span-2">
          <div className="group relative overflow-visible p-0 text-gray-900 dark:text-white">
            <div className="flex items-center justify-between pt-6 pb-4 border-t border-gray-200 dark:border-white/10">
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Distribution Area Analysis</h3>
            </div>
            <div className="h-[700px] relative">
              <DistributionAreaChart />
            </div>
          </div>
        </div>

        {/* Top/Bottom Medicines Table */}
        <div className="col-span-1 md:col-span-2 mt-[60px] pt-16 md:pt-32">
          <div className="group relative overflow-visible p-0 text-gray-900 dark:text-white">
            <div className="flex items-center justify-between pt-8 pb-4">
              <h3 className="text-xl md:text-2xl font-semibold text-gray-900 dark:text-white">Medicine Price Analysis</h3>
            </div>
            
            {/* Tab Navigation */}
            <div className="flex space-x-1 mb-6 bg-gray-100 dark:bg-gray-800/50 rounded-lg p-1">
              <button
                onClick={() => setActiveTab('top')}
                className={`flex-1 px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
                  activeTab === 'top'
                    ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                Top 10 Medicines
              </button>
              <button
                onClick={() => setActiveTab('bottom')}
                className={`flex-1 px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
                  activeTab === 'bottom'
                    ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                Bottom 10 Medicines
              </button>
            </div>

            {/* Filters for Price Analysis */}
            <div className="mb-4 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <div className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">authorization_status</div>
                <div className="flex items-center gap-4">
                  {authorizationStatuses.map((status) => (
                    <label key={status} className="inline-flex items-center gap-2 text-sm text-gray-700 dark:text-gray-200">
                      <input
                        type="checkbox"
                        className="h-4 w-4 rounded border-gray-300 text-gray-900 focus:ring-gray-500 dark:border-white/20 dark:bg-transparent"
                        checked={selectedAuthorizationStatuses.includes(status)}
                        onChange={() => createToggleHandler(setSelectedAuthorizationStatuses)(status)}
                      />
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
                      <input
                        type="checkbox"
                        className="h-4 w-4 rounded border-gray-300 text-gray-900 focus:ring-gray-500 dark:border-white/20 dark:bg-transparent"
                        checked={selectedDistributeAreas.includes(area)}
                        onChange={() => createToggleHandler(setSelectedDistributeAreas)(area)}
                      />
                      <span>{area}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            {/* View Mode Toggle */}
            <div className="flex justify-end mb-6">
              <div className="flex items-center space-x-2 bg-gray-100 dark:bg-gray-800/50 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('table')}
                  className={`px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
                    viewMode === 'table'
                      ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                      : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H6a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                    <span>Table</span>
                  </div>
                </button>
                <button
                  onClick={() => setViewMode('graph')}
                  className={`px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
                    viewMode === 'graph'
                      ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                      : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
                    </svg>
                    <span>Graph</span>
                  </div>
                </button>
              </div>
            </div>

            {/* Content Container with Smooth Transitions */}
            <div className="relative overflow-hidden">
              {/* Table View */}
              <div 
                className={`transition-all duration-700 ease-in-out ${
                  viewMode === 'table' 
                    ? 'opacity-100 translate-y-0 scale-100' 
                    : 'opacity-0 -translate-y-8 scale-95 pointer-events-none absolute inset-0 z-10'
                }`}
              >
                <div className="bg-white/60 dark:bg-gray-900/60 backdrop-blur-sm rounded-2xl border border-gray-100/50 dark:border-white/5 overflow-hidden shadow-sm">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-gray-100/80 dark:border-white/5">
                          <th className="px-8 py-6 text-left text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-widest">
                            #
                          </th>
                          <th className="px-8 py-6 text-left text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-widest">
                            Medicine
                          </th>
                          <th className="px-8 py-6 text-left text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-widest">
                            Origin
                          </th>
                          <th className="px-8 py-6 text-right text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-widest">
                            Price
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-50/50 dark:divide-white/5">
                        {(activeTab === 'top' ? topMedicines : bottomMedicines).map((medicine, index) => (
                          <tr key={index} className="group hover:bg-white/40 dark:hover:bg-gray-800/40 transition-all duration-200">
                            <td className="px-8 py-5 whitespace-nowrap">
                              <div className="flex items-center">
                                <span className={`text-sm font-medium ${
                                  activeTab === 'top' 
                                    ? 'text-cyan-600 dark:text-cyan-400' 
                                    : 'text-orange-600 dark:text-orange-400'
                                }`}>
                                  {index + 1}
                                </span>
                              </div>
                            </td>
                            <td className="px-8 py-5">
                              <div className="text-sm font-semibold text-gray-900 dark:text-white tracking-tight">
                                {medicine.trade_name}
                              </div>
                            </td>
                            <td className="px-8 py-5">
                              {(() => {
                                const country = medicine.manufacture_country || 'Unknown';
                                return (
                                  <div className="flex items-center">
                                    <span className="text-lg mr-3">
                                      {getCountryFlag(country)}
                                    </span>
                                    <span className="text-sm text-gray-500 dark:text-gray-400 font-medium">
                                      {country}
                                    </span>
                                  </div>
                                );
                              })()}
                            </td>
                            <td className="px-8 py-5 text-right">
                              <div className="flex items-center justify-end space-x-3">
                                {/* Price Value */}
                                <div className={`text-sm font-bold tracking-tight ${
                                  activeTab === 'top' 
                                    ? 'text-cyan-600 dark:text-cyan-400' 
                                    : 'text-orange-600 dark:text-orange-400'
                                }`}>
                                  {medicine.public_price >= 1000000 
                                    ? `$${(medicine.public_price / 1000000).toFixed(1)}M`
                                    : `$${medicine.public_price.toFixed(2)}`
                                  }
                                </div>
                                
                                {/* Visual Bar Indicator */}
                                <div className="flex items-center space-x-2">
                                  <div className="w-16 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                                    <div 
                                      className={`h-full rounded-full transition-all duration-300 ${
                                        activeTab === 'top' 
                                          ? 'bg-gradient-to-r from-cyan-400 to-teal-500' 
                                          : 'bg-gradient-to-r from-orange-400 to-red-500'
                                      }`}
                                      style={{ 
                                        width: `${Math.min(100, Math.max(5, (index + 1) * 10))}%` 
                                      }}
                                    ></div>
                                  </div>
                                  <span className={`text-xs font-semibold ${
                                    activeTab === 'top' 
                                      ? 'text-cyan-600 dark:text-cyan-400' 
                                      : 'text-orange-600 dark:text-orange-400'
                                  }`}>
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
              <div 
                className={`transition-all duration-700 ease-in-out ${
                  viewMode === 'graph' 
                    ? 'opacity-100 translate-y-0 scale-100' 
                    : 'opacity-0 translate-y-8 scale-95 pointer-events-none absolute inset-0 z-20'
                }`}
              >
                <div className="bg-white/60 dark:bg-gray-900/60 backdrop-blur-sm rounded-2xl border border-gray-100/50 dark:border-white/5 overflow-hidden shadow-sm p-8">
                  <div className="space-y-6">
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white text-center mb-8">
                      {activeTab === 'top' ? 'Top 10' : 'Bottom 10'} Medicines Price Distribution
                    </h4>
                    
                    {/* Highcharts Column Chart */}
                    <div id={`chart-container-${activeTab}`} className="w-full h-96"></div>
                  </div>
                </div>
              </div>
            </div>


          </div>
        </div>

        {/* Medicines Section (extracted) */}
        <div className="col-span-1 md:col-span-2 mt-8">
          <div className="group relative overflow-visible p-0 text-gray-900 dark:text-white">
            <div className="flex items-center justify-between pt-8 pb-4">
              <h3 className="text-xl md:text-2xl font-semibold text-gray-900 dark:text-white">Medicines</h3>
            </div>
            <MedicinesVisualsSection isDark={isDark} />
          </div>
        </div>

        {/* Suspended Medicines Table (dummy) */}
        <div className="col-span-1 md:col-span-2 mt-8">
          <div className="group relative overflow-visible p-0 text-gray-900 dark:text-white">
            <div className="flex items-center justify-between pt-8 pb-4">
              <h3 className="text-xl md:text-2xl font-semibold text-gray-900 dark:text-white">Suspended Medicines</h3>
            </div>
            <div className="bg-white/60 dark:bg-gray-900/60 backdrop-blur-sm rounded-2xl border border-gray-100/50 dark:border-white/5 overflow-hidden shadow-sm p-0">
              {(() => {
                const suspendedRows = [
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
                const areaGroups = suspendedRows.reduce((acc, r) => {
                  if (!acc[r.distribute_area]) acc[r.distribute_area] = {};
                  if (!acc[r.distribute_area][r.drugtype]) acc[r.distribute_area][r.drugtype] = 0;
                  acc[r.distribute_area][r.drugtype] += 1;
                  return acc;
                }, {});

                const treeData = [
                  { id: 'root', parent: '', name: 'Suspended_Medicines' }
                ];
                Object.entries(areaGroups).forEach(([area, drugMap], idx) => {
                  const areaId = `area-${idx}`;
                  const areaCount = Object.values(drugMap).reduce((s, v) => s + v, 0);
                  treeData.push({ id: areaId, parent: 'root', name: `${area}` });
                  Object.entries(drugMap).forEach(([dt, count], j) => {
                    treeData.push({ id: `${areaId}-${j}`, parent: areaId, name: `${dt} (${count})` });
                  });
                });

                const nodeOptions = {
                  chart: { inverted: true, backgroundColor: 'transparent', marginBottom: 120 },
                  title: { text: '' },
                  series: [{
                    type: 'treegraph',
                    data: treeData,
                    tooltip: { pointFormat: '{point.name}' },
                    dataLabels: {
                      pointFormat: '{point.name}',
                      style: { whiteSpace: 'nowrap', color: isDark ? '#fff' : '#111827', textOutline: 'none' },
                      crop: false
                    },
                    marker: { radius: 6 },
                    levels: [
                      { level: 1, dataLabels: { align: 'left', x: 20 } },
                      { level: 2, colorByPoint: true, dataLabels: { verticalAlign: 'bottom', y: -20 } },
                      { level: 3, colorVariation: { key: 'brightness', to: -0.5 }, dataLabels: { verticalAlign: 'top', rotation: 90, y: 20 } }
                    ]
                  }],
                  credits: { enabled: false }
                };

                return (
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
                        <SuspendedNodes rows={suspendedRows} isDark={isDark} />
                      </div>
                    </div>
                  </div>
                );
              })()}
            </div>
          </div>
        </div>

        {/* Marketing Company x Country Table */}
        <div className="col-span-1 md:col-span-2 mt-8">
          <MarketingCompanyCountryTable />
        </div>
      </div>
    </div>
  );
};

export default MedicinesPage;
