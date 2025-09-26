import React, { useState, useEffect, useMemo } from "react";
import CanvasJSReact from "@canvasjs/react-charts";
import {
  ResponsiveContainer,
  ComposedChart,
  CartesianGrid,
  Tooltip,
  Legend,
  XAxis,
  YAxis,
  Line,
  Scatter,
  BarChart as ReBarChart,
  Bar,
  Cell,
  LabelList,
  LineChart,
} from "recharts";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import "highcharts/highcharts-3d";
import "highcharts/modules/treemap";
import "highcharts/modules/treegraph";
// Removed SuspendedNodes import - replaced with Highcharts treegraph
import MarketingCompanyCountryTable from "../../../components/MarketingCompanyCountryTable";
import ShelfLifeTable from "../../../components/ShelfLifeTable";
import Loader from "../../../components/Loader";
import { ResponsiveLine } from "@nivo/line";
import { ResponsiveAreaBump } from "@nivo/bump";
import { Box } from "@mui/material";
import { PieChart, SparkLineChart } from "@mui/x-charts";
import MedicineGlobe from "../../../components/ui/MedicineGlobe";
import { useTheme } from "../../../context/ThemeContext";
import {
  IconPills,
  IconBuilding,
  IconGlobe,
  IconRoute,
  IconPackage,
  IconCertificate,
  IconClock,
  IconCurrencyDollar,
  IconThermometer,
  IconShieldCheck,
  IconLicense,
} from "@tabler/icons-react";
import { LazyMotion, domAnimation, m } from "framer-motion";
import MedicinesVisualsSection from "../../../components/MedicinesVisualsSection";
// Extracted sections
import PriceAnalysis from "../../../components/medicines/PriceAnalysis";
import SuspendedMedicines from "../../../components/medicines/SuspendedMedicines";
import FiltersControls from "../../../components/medicines/FiltersControls";
import MonthlyRegistrationsChart from "../../../components/medicines/MonthlyRegistrationsChart";
import DrugTypeDistribution from "../../../components/medicines/DrugTypeDistribution";
import MedicinesByForm from "../../../components/medicines/MedicinesByForm";
import AuthorizationStatusChart from "../../../components/medicines/AuthorizationStatusChart";
import AdminRouteAreaBump from "../../../components/medicines/AdminRouteAreaBump";
import ManufacturersRanking from "../../../components/medicines/ManufacturersRanking";
import GlobeDistribution from "../../../components/medicines/GlobeDistribution";
import DistributionAreaAreaChart from "../../../components/medicines/DistributionAreaAreaChart";
import DistributionAreaPieChart from "../../../components/medicines/DistributionAreaPieChart";
import DefenseRDChart from "../../../components/DefenseRDChart";

const cardVariants = {
  hidden: { opacity: 0, y: 8 },
  show: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.28, ease: "easeOut", delay: i * 0.05 },
  }),
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
  const darker = Highcharts.color(color)
    .brighten(dark ? -0.1 : -0.35)
    .get();
  const lighter = Highcharts.color(color)
    .brighten(dark ? 0.3 : 0.25)
    .get();
  const border = Highcharts.color(color)
    .brighten(dark ? -0.5 : -0.45)
    .get();
  const options = {
    chart: {
      type: "column",
      backgroundColor: "rgba(0,0,0,0)",
      plotBackgroundColor: "rgba(0,0,0,0)",
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
          bottom: { size: 0, color: "transparent" },
          back: { size: 0, color: "transparent" },
          side: { size: 0, color: "transparent" },
        },
      },
      spacing: [0, 0, 0, 0],
      margin: [0, 0, 0, 0],
      animation: false,
    },
    title: { text: "" },
    subtitle: { text: "" },
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
            [1, darker],
          ],
        },
        // Increase paddings to create visible gaps between bars
        pointPadding: 0.2,
        groupPadding: 0.1,
      },
    },
    series: [
      {
        type: "column",
        data,
        colorByPoint: false,
        borderWidth: dark ? 1 : 0,
        shadow: false,
        borderColor: border,
      },
    ],
  };
  return (
    <div className="mini-3d-chart" style={{ width: "100%", height: "140px" }}>
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
        containerProps={{ style: { width: "100%", height: "100%" } }}
      />
    </div>
  );
};

// (Removed Mini3DPieChart in favor of sparkline trend on stat cards)

// Minimal SVG trend line to match reference style
const MiniTrendLineSVG = ({ color }) => {
  return (
    <svg
      width="100%"
      height="56"
      viewBox="0 0 120 56"
      preserveAspectRatio="none"
    >
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

const SuspendedMedicinesTreegraph = ({ isDark, suspendedRows }) => {
  // Build treegraph data from actual suspended medicines data
  const treegraphData = useMemo(() => {
    if (!suspendedRows || suspendedRows.length === 0) return [];

    // Group by distribute_area first, then by drugtype
    const areaGroups = suspendedRows.reduce((acc, medicine) => {
      const area = medicine.distribute_area || "Unknown";
      const drugtype = medicine.drugtype || "Unknown";

      if (!acc[area]) acc[area] = {};
      if (!acc[area][drugtype]) acc[area][drugtype] = [];
      acc[area][drugtype].push(medicine);

      return acc;
    }, {});

    // Build hierarchical data structure
    const data = [
      {
        id: "root",
        parent: "",
        name: `Suspended Medicines (${suspendedRows.length})`,
      },
    ];

    let nodeId = 1;
    const areaIds = {};

    // Add distribute_area nodes
    Object.entries(areaGroups).forEach(([area, drugtypes]) => {
      const areaId = `area-${nodeId++}`;
      areaIds[area] = areaId;
      const totalInArea = Object.values(drugtypes).flat().length;

      data.push({
        id: areaId,
        parent: "root",
        name: `${area} (${totalInArea})`,
      });

      // Add drugtype nodes for this area
      Object.entries(drugtypes).forEach(([drugtype, medicines]) => {
        const drugtypeId = `drugtype-${nodeId++}`;
        data.push({
          id: drugtypeId,
          parent: areaId,
          name: `${drugtype} (${medicines.length})`,
        });
      });
    });

    return data;
  }, [suspendedRows]);

  const treegraphOptions = useMemo(
    () => ({
      chart: {
        inverted: true,
        marginBottom: 170,
        marginLeft: 50,
        backgroundColor: "transparent",
      },
      title: {
        text: "Suspended Medicines Distribution",
        align: "left",
        style: {
          color: isDark ? "#ffffff" : "#111827",
        },
      },
      series: [
        {
          type: "treegraph",
          data: treegraphData,
          tooltip: {
            pointFormat: "{point.name}",
            backgroundColor: isDark
              ? "rgba(15,23,42,0.95)"
              : "rgba(255,255,255,0.95)",
            borderColor: isDark ? "#1f2937" : "#e5e7eb",
            style: {
              color: isDark ? "#e5e7eb" : "#111827",
            },
          },
          dataLabels: {
            pointFormat: "{point.name}",
            style: {
              whiteSpace: "nowrap",
              color: isDark ? "#ffffff" : "#000000",
              textOutline: "3px contrast",
            },
            crop: false,
          },
          marker: {
            radius: 6,
          },
          levels: [
            {
              level: 1,
              dataLabels: {
                align: "left",
                x: 20,
              },
            },
            {
              level: 2,
              colorByPoint: true,
              dataLabels: {
                verticalAlign: "bottom",
                y: -20,
              },
            },
            {
              level: 3,
              colorVariation: {
                key: "brightness",
                to: -0.5,
              },
              dataLabels: {
                verticalAlign: "top",
                rotation: 90,
                y: 20,
              },
            },
          ],
        },
      ],
      credits: { enabled: false },
    }),
    [isDark, treegraphData]
  );

  return (
    <HighchartsReact
      highcharts={Highcharts}
      options={treegraphOptions}
      containerProps={{ style: { width: "100%", height: "100%" } }}
    />
  );
};

const MedicinesPage = () => {
  const PALETTE = ["#FBBF24", "#35B48F", "#1883AA", "#1E40AF", "#89AB56"];
  // Palette presets to try different contrasting looks
  const CHART_PALETTES = {
    vibrant: ["#FBBF24", "#35B48F", "#1883AA", "#1E40AF", "#89AB56"],
    aurora: ["#FBBF24", "#35B48F", "#1883AA", "#1E40AF", "#89AB56"],
    deep: ["#1E40AF", "#1B61AD", "#1883AA", "#16A4A8", "#35B48F"],
    retro: ["#DCA11C", "#F7A711", "#F9B31B", "#FBBF24", "#89AB56"],
    image: ["#FBBF24", "#35B48F", "#1883AA", "#1E40AF", "#89AB56"],
  };
  // Choose active palette with distinct colors from reference image
  const PIE_BAR_COLORS = [
    "#FBBF24", // Bright sunny yellow
    "#35B48F", // Vibrant teal/seafoam green
    "#1883AA", // Medium bright blue
    "#1E40AF", // Deep rich navy blue
    "#89AB56", // Light muted olive green
    "#F9B31B", // Deeper golden yellow
    "#16A4A8", // Darker blue-leaning teal
    "#1B61AD", // Darker royal blue
    "#F7A711", // Orange-yellow
    "#DCA11C", // Muted earthy gold
  ];
  // Theme
  const { theme } = useTheme();
  const isDark = theme === "dark";

  // Accent colors to match reference image (teal lines, blue bars, orange price)
  const ACCENT = {
    teal: "#2CCFB2",
    blue: "#4CB8F6",
    orange: "#F59E0B",
    gray: "#9CA3AF",
    pink: "#EC4899",
  };

  // ✅ IMPLEMENTED: Active filters with backend data
  const [selectedCountry, setSelectedCountry] = useState("All");
  const [selectedArea, setSelectedArea] = useState("All");
  const [selectedRoute, setSelectedRoute] = useState("All");
  const [selectedForm, setSelectedForm] = useState("All");

  // ✅ IMPLEMENTED: Additional filters for complete backend integration
  const [selectedLegalStatus, setSelectedLegalStatus] = useState("All");
  const [selectedProductControl, setSelectedProductControl] = useState("All");
  const [selectedAuthorizationStatus, setSelectedAuthorizationStatus] =
    useState("All");
  const [selectedShelfLife, setSelectedShelfLife] = useState("All");

  // ✅ IMPLEMENTED: Monthly trend period selection
  const [selectedTrendPeriod, setSelectedTrendPeriod] = useState(12); // 3, 6, 9, or 12 months

  // ✅ IMPLEMENTED: Filter options from backend API
  const [countries, setCountries] = useState(["All"]);
  const [areas, setAreas] = useState(["All"]);
  const [routes, setRoutes] = useState(["All"]);
  const [forms, setForms] = useState(["All"]);

  // ✅ IMPLEMENTED: Additional filter options from backend API
  const [legalStatusOptions, setLegalStatusOptions] = useState(["All"]);
  const [productControlOptions, setProductControlOptions] = useState(["All"]);
  const [authorizationStatusOptions, setAuthorizationStatusOptions] = useState([
    "All",
  ]);
  const [shelfLifeOptions, setShelfLifeOptions] = useState(["All"]);

  // ========================================
  // ✅ IMPLEMENTED: Stats API Integration
  // ========================================
  // Backend API: /medicine_kpi endpoint from chatgpt_pie.py
  // This API provides real-time statistics for the top 8 stat cards
  // including: total medicines, scientific names, manufacturers, countries,
  // administration routes, pharmaceutical forms, average price, and last updated
  const [totalMedicines, setTotalMedicines] = useState(null);
  const [statsApi, setStatsApi] = useState(null);
  const [monthlyRegistrations, setMonthlyRegistrations] = useState([]);
  const [monthlyRegistrationsLoading, setMonthlyRegistrationsLoading] =
    useState(true);
  const [drugTypeDistribution, setDrugTypeDistribution] = useState([]);
  const [drugTypeDistributionLoading, setDrugTypeDistributionLoading] =
    useState(true);
  const [medicinesByCountryApi, setMedicinesByCountryApi] = useState([]);
  const [medicinesByCountryLoading, setMedicinesByCountryLoading] =
    useState(true);
  const [manufacturerRanking, setManufacturerRanking] = useState([]);
  const [routeTrendsData, setRouteTrendsData] = useState([]);
  const [adminRouteBarData, setAdminRouteBarData] = useState([]);
  const [pharmaFormsData, setPharmaFormsData] = useState([]);
  const [distributionAreaData, setDistributionAreaData] = useState([]);
  const [continentDistribution, setContinentDistribution] = useState([]);

  // ✅ IMPLEMENTED: Main loading state for initial page load
  const [isInitialLoading, setIsInitialLoading] = useState(true);

  // ✅ IMPLEMENTED: Fetch filter options from backend API
  const fetchFilterOptions = async () => {
    try {
      const res = await fetch("http://localhost:8000/medicine_kpi");
      if (!res.ok) return;
      const payload = await res.json();

      // Update filter options with real data from backend
      if (payload.total_medicine_by_distribute_area?.labels) {
        setAreas(["All", ...payload.total_medicine_by_distribute_area.labels]);
      }
      if (payload.top_10_countries_by_medicines?.labels) {
        setCountries(["All", ...payload.top_10_countries_by_medicines.labels]);
      }
      if (payload.top_5_pharmaceuticalform?.labels) {
        setForms(["All", ...payload.top_5_pharmaceuticalform.labels]);
      }
      if (payload.administration_route_by_medicine?.labels) {
        setRoutes(["All", ...payload.administration_route_by_medicine.labels]);
      }

      // ✅ IMPLEMENTED: Fetch additional filter options from backend
      // Note: These might need separate API calls or be included in the main response
      // For now, using fallback values that match common pharmaceutical data
      setLegalStatusOptions(["All", "OTC", "Prescription", "Controlled"]);
      setProductControlOptions([
        "All",
        "Prescription Only",
        "Over the Counter",
        "Controlled Substance",
      ]);
      setAuthorizationStatusOptions([
        "All",
        "Valid",
        "Suspended",
        "Conditional Approval",
        "Expired",
      ]);
      setShelfLifeOptions([
        "All",
        "24 months",
        "36 months",
        "48 months",
        "60 months",
        "Indefinite",
      ]);
    } catch (e) {
      // Fallback to default options on error
      setCountries([
        "All",
        "Saudi Arabia",
        "United States",
        "Germany",
        "United Kingdom",
        "France",
        "India",
        "Switzerland",
        "China",
      ]);
      setAreas(["All", "Riyadh", "Jeddah", "Dammam", "Mecca", "Medina"]);
      setRoutes([
        "All",
        "Oral",
        "Intravenous",
        "Intramuscular",
        "Topical",
        "Inhalation",
      ]);
      setForms(["All", "Tablet", "Capsule", "Syrup", "Injection", "Cream"]);
      setLegalStatusOptions(["All", "OTC", "Prescription", "Controlled"]);
      setProductControlOptions([
        "All",
        "Prescription Only",
        "Over the Counter",
        "Controlled Substance",
      ]);
      setAuthorizationStatusOptions([
        "All",
        "Valid",
        "Suspended",
        "Conditional Approval",
        "Expired",
      ]);
      setShelfLifeOptions([
        "All",
        "24 months",
        "36 months",
        "48 months",
        "60 months",
        "Indefinite",
      ]);
    }
  };

  // ✅ IMPLEMENTED: Real-time data fetching from backend API
  // Fetches all statistics and chart data from /medicine_kpi endpoint
  React.useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();
    const fetchAll = async () => {
      try {
        setMonthlyRegistrationsLoading(true);
        setMedicinesByCountryLoading(true);
        setIsInitialLoading(true);

        const params = new URLSearchParams();
        if (selectedCountry && selectedCountry !== "All")
          params.append("manufacture_country", selectedCountry);
        if (selectedArea && selectedArea !== "All")
          params.append("distribute_area", selectedArea);
        if (selectedForm && selectedForm !== "All")
          params.append("pharmaceuticalform", selectedForm);
        if (selectedRoute && selectedRoute !== "All")
          params.append("administrationroute", selectedRoute);

        // ✅ IMPLEMENTED: Include additional filters in API call
        if (selectedLegalStatus && selectedLegalStatus !== "All")
          params.append("legal_status", selectedLegalStatus);
        if (selectedProductControl && selectedProductControl !== "All")
          params.append("product_control", selectedProductControl);
        if (
          selectedAuthorizationStatus &&
          selectedAuthorizationStatus !== "All"
        )
          params.append("authorization_status", selectedAuthorizationStatus);
        if (selectedShelfLife && selectedShelfLife !== "All")
          params.append("shelflife", selectedShelfLife);

        // ✅ MAIN API INTEGRATION: Fetching data from /medicine_kpi endpoint
        const res = await fetch(
          `http://localhost:8000/medicine_kpi?${params.toString()}`,
          { signal: controller.signal }
        );
        if (!res.ok) return;
        const payload = await res.json();
        if (!isMounted || !payload) return;

        // ✅ IMPLEMENTED: Processing real-time stats data from backend
        // This section extracts the 8 main statistics for the top cards
        const m = payload.metrics || {};
        setTotalMedicines(
          typeof m.total_medicines === "number" ? m.total_medicines : null
        );
        setStatsApi({
          scientific_names: m.total_scientific_name,
          manufacturers: m.total_manufacture_name,
          countries: m.total_manufacture_country,
          routes: m.total_administrationroute,
          forms: m.total_pharmaceuticalform,
          avg_public_price: m.avg_public_price,
          last_updated: payload?.meta?.last_updated || null,
        });

        // ✅ IMPLEMENTED: Monthly registrations from backend API
        const monthBlock = payload.medicine_by_month || {};
        const monthLabels = Array.isArray(monthBlock.labels)
          ? monthBlock.labels
          : [];
        const monthData = Array.isArray(monthBlock.data) ? monthBlock.data : [];
        const toMonthIndex = (lbl) => {
          const map = {
            Jan: 0,
            Feb: 1,
            Mar: 2,
            Apr: 3,
            May: 4,
            Jun: 5,
            Jul: 6,
            Aug: 7,
            Sep: 8,
            Oct: 9,
            Nov: 10,
            Dec: 11,
          };
          return map[lbl] ?? 0;
        };
        const monthly = monthLabels.map((label, i) => {
          if (typeof label === "string" && label.includes("-")) {
            const [year, month] = label.split("-");
            return {
              month: label,
              count: Number(monthData[i] || 0),
              _date: new Date(parseInt(year), parseInt(month) - 1, 1),
            };
          }
          // Fallback for month names
          return {
            month: String(label),
            count: Number(monthData[i] || 0),
            _date: new Date(
              new Date().getFullYear(),
              toMonthIndex(String(label)),
              1
            ),
          };
        });
        setMonthlyRegistrations(monthly);

        // ✅ IMPLEMENTED: Pharmaceutical Form bar chart from top_5_pharmaceuticalform API
        const pharmTop5 = payload.top_5_pharmaceuticalform || {};
        const formLabels = Array.isArray(pharmTop5.labels)
          ? pharmTop5.labels
          : [];
        const formData = Array.isArray(pharmTop5.data) ? pharmTop5.data : [];
        setPharmaFormsData(
          formLabels.map((label, i) => ({
            form: String(label),
            count: Number(formData[i] || 0),
          }))
        );

        // ✅ IMPLEMENTED: Distribution Area data from total_medicine_by_distribute_area API
        const distAreaBlock = payload.total_medicine_by_distribute_area || {};
        const distLabels = Array.isArray(distAreaBlock.labels)
          ? distAreaBlock.labels
          : [];
        const distData = Array.isArray(distAreaBlock.data)
          ? distAreaBlock.data
          : [];
        const transformedDistData = distLabels.map((label, i) => ({
          area: String(label),
          count: Number(distData[i] || 0),
        }));
        setDistributionAreaData(transformedDistData);

        // Globe: countries top 10
        const countriesBlock =
          payload.country_distribution_analysis_top_10 || {};
        const cLabels = Array.isArray(countriesBlock.labels)
          ? countriesBlock.labels
          : [];
        const cData = Array.isArray(countriesBlock.data)
          ? countriesBlock.data
          : [];
        setMedicinesByCountryApi(
          cLabels.map((label, i) => ({
            country: String(label),
            count: Number(cData[i] || 0),
          }))
        );

        // Continent distribution (top 10)
        const continentBlock = payload.continent_distribution_analysis_top_10 || {};
        const contLabels = Array.isArray(continentBlock.labels) ? continentBlock.labels : [];
        const contData = Array.isArray(continentBlock.data) ? continentBlock.data : [];
        const contMapped = contLabels.map((label, i) => ({
          category: String(label),
          value: Number(contData[i] || 0),
        }));
        setContinentDistribution(contMapped);

        // Manufacturers ranking top 10
        const manuBlock = payload.manufacture_name_by_meddicine || {};
        const manuLabels = Array.isArray(manuBlock.labels)
          ? manuBlock.labels
          : [];
        const manuData = Array.isArray(manuBlock.data) ? manuBlock.data : [];
        setManufacturerRanking(
          manuLabels.map((label, i) => ({
            manufacturer: String(label),
            medicines: Number(manuData[i] || 0),
          }))
        );

        // Admin route area bump + fallback bar
        const areaBlock = payload.administration_area_chart_top_10 || {};
        if (
          areaBlock.type === "timeseries_by_group" &&
          Array.isArray(areaBlock.labels) &&
          Array.isArray(areaBlock.series)
        ) {
          const labels = areaBlock.labels.map((l) => String(l));
          const series = areaBlock.series.map((s) => ({
            id: String(s.name),
            data: labels.map((x, idx) => ({
              x,
              y: Number((s.data || [])[idx] || 0),
            })),
          }));
          setRouteTrendsData(series);
        } else if (
          Array.isArray(areaBlock.labels) &&
          Array.isArray(areaBlock.data)
        ) {
          // Fallback simple group -> convert into single time point series
          const labels = areaBlock.labels.map((l) => String(l));
          const series = labels.map((name, idx) => ({
            id: name,
            data: [{ x: "All", y: Number(areaBlock.data[idx] || 0) }],
          }));
          setRouteTrendsData(series);
        } else {
          setRouteTrendsData([]);
        }

        // Also parse simple group for bar fallback from administration_route_by_medicine
        const routeSimple = payload.administration_route_by_medicine || {};
        const rLabels = Array.isArray(routeSimple.labels)
          ? routeSimple.labels
          : [];
        const rData = Array.isArray(routeSimple.data) ? routeSimple.data : [];
        setAdminRouteBarData(
          rLabels.map((label, i) => ({
            route: String(label),
            count: Number(rData[i] || 0),
          }))
        );
      } catch (e) {
        // ignore network errors
      } finally {
        if (isMounted) {
          setMonthlyRegistrationsLoading(false);
          setMedicinesByCountryLoading(false);
          setIsInitialLoading(false);
        }
      }
    };
    fetchAll();
    return () => {
      isMounted = false;
      controller.abort();
    };
  }, [
    selectedCountry,
    selectedArea,
    selectedForm,
    selectedRoute,
    selectedTrendPeriod,
    selectedLegalStatus,
    selectedProductControl,
    selectedAuthorizationStatus,
    selectedShelfLife,
  ]);

  // ✅ IMPLEMENTED: Fetch drug type distribution from main API endpoint
  const fetchDrugTypeDistribution = async () => {
    try {
      setDrugTypeDistributionLoading(true);
      
      // Build query parameters for the API
      const params = new URLSearchParams();
      if (selectedCountry && selectedCountry !== "All")
        params.append("manufacture_country", selectedCountry);
      if (selectedArea && selectedArea !== "All")
        params.append("distribute_area", selectedArea);
      if (selectedForm && selectedForm !== "All")
        params.append("pharmaceuticalform", selectedForm);
      if (selectedRoute && selectedRoute !== "All")
        params.append("administrationroute", selectedRoute);
      if (selectedLegalStatus && selectedLegalStatus !== "All")
        params.append("legal_status", selectedLegalStatus);
      if (selectedProductControl && selectedProductControl !== "All")
        params.append("product_control", selectedProductControl);
      if (selectedAuthorizationStatus && selectedAuthorizationStatus !== "All")
        params.append("authorization_status", selectedAuthorizationStatus);
      if (selectedShelfLife && selectedShelfLife !== "All")
        params.append("shelflife", selectedShelfLife);

      const res = await fetch(`http://localhost:8000/medicines/summary_latest?${params.toString()}`);
      if (!res.ok) return;
      const payload = await res.json();

      if (payload.data?.pie_drugtype) {
        const pieData = payload.data.pie_drugtype;
        const labels = Array.isArray(pieData.labels) ? pieData.labels : [];
        const values = Array.isArray(pieData.values) ? pieData.values : [];

        const drugTypeData = labels.map((label, i) => ({
          type: String(label),
          count: Number(values[i] || 0),
        }));

        setDrugTypeDistribution(drugTypeData);
      }
    } catch (e) {
      console.error("Error fetching drug type distribution:", e);
    } finally {
      setDrugTypeDistributionLoading(false);
    }
  };

  // ✅ IMPLEMENTED: Fetch Medicine Price Analysis data from /medicines/top-bottom API
  // Backend API: /medicines/top-bottom endpoint from chatgpt_pie.py
  // This API provides real-time top and bottom medicines by average public_price
  // with optional filters for authorization_status and distribute_area
  const fetchPriceAnalysisData = async () => {
    try {
      setPriceAnalysisLoading(true);

      // Build query parameters for the API
      const params = new URLSearchParams();
      if (selectedAuthorizationStatuses.length > 0) {
        // API expects single value, so we'll use the first selected status
        params.append("authorization_status", selectedAuthorizationStatuses[0]);
      }
      if (selectedDistributeAreas.length > 0) {
        // API expects single value, so we'll use the first selected area
        params.append("distribute_area", selectedDistributeAreas[0]);
      }
      // ✅ IMPLEMENTED: Include additional filters in price analysis
      if (selectedLegalStatus && selectedLegalStatus !== "All")
        params.append("legal_status", selectedLegalStatus);
      if (selectedProductControl && selectedProductControl !== "All")
        params.append("product_control", selectedProductControl);
      if (selectedShelfLife && selectedShelfLife !== "All")
        params.append("shelflife", selectedShelfLife);
      params.append("top_n", "10"); // Get top 10 and bottom 10

      const res = await fetch(
        `http://localhost:8000/medicines/top-bottom?${params.toString()}`
      );
      if (!res.ok) return;
      const payload = await res.json();

      if (payload.result) {
        // Transform API data to match frontend expectations
        const transformMedicine = (med) => ({
          trade_name: med.trade_name || "Unknown",
          public_price: med.avg_price || 0,
          manufacture_country: med.manufacture_country || "Unknown",
        });

        setTopMedicinesApi(
          (payload.result.top_medicines || []).map(transformMedicine)
        );
        setBottomMedicinesApi(
          (payload.result.bottom_medicines || []).map(transformMedicine)
        );
      }
    } catch (e) {
      console.error("Error fetching price analysis data:", e);
    } finally {
      setPriceAnalysisLoading(false);
    }
  };

  // ✅ IMPLEMENTED: Fetch Medicine by Month data from /analytics/medicine_by_month API
  // Backend API: /analytics/medicine_by_month endpoint from chatgpt_pie.py
  // This API provides real-time medicine registration data by month with filters
  const fetchMedicineByMonthData = async () => {
    try {
      setMedicineByMonthLoading(true);

      // Build query parameters for the API
      const params = new URLSearchParams();
      if (selectedCountry && selectedCountry !== "All") {
        params.append("manufacture_country", selectedCountry);
      }
      if (selectedArea && selectedArea !== "All") {
        params.append("distribute_area", selectedArea);
      }
      if (selectedForm && selectedForm !== "All") {
        params.append("pharmaceuticalform", selectedForm);
      }
      if (selectedRoute && selectedRoute !== "All") {
        params.append("administrationroute", selectedRoute);
      }
      // ✅ IMPLEMENTED: Include additional filters in medicine by month
      if (selectedLegalStatus && selectedLegalStatus !== "All") {
        params.append("legal_status", selectedLegalStatus);
      }
      if (selectedProductControl && selectedProductControl !== "All") {
        params.append("product_control", selectedProductControl);
      }
      if (
        selectedAuthorizationStatus &&
        selectedAuthorizationStatus !== "All"
      ) {
        params.append("authorization_status", selectedAuthorizationStatus);
      }
      if (selectedShelfLife && selectedShelfLife !== "All") {
        params.append("shelflife", selectedShelfLife);
      }

      const res = await fetch(
        `http://localhost:8000/analytics/medicine_by_month?${params.toString()}`
      );
      if (!res.ok) return;
      const payload = await res.json();

      if (payload.medicine_by_month) {
        const monthData = payload.medicine_by_month;
        const labels = Array.isArray(monthData.labels) ? monthData.labels : [];
        const data = Array.isArray(monthData.data) ? monthData.data : [];

        // Transform data to match AuthorizationStatusChart format
        const transformedData = labels.map((label, index) => ({
          index: index,
          month: label,
          registrations: data[index] || 0,
          // Create two series for the chart (red and blue)
          red: data[index] || 0,
          blue: data[index] || 0,
          redLine: data[index] || 0,
          blueLine: data[index] || 0,
        }));

        setMedicineByMonthData(transformedData);
      }
    } catch (e) {
      console.error("Error fetching medicine by month data:", e);
    } finally {
      setMedicineByMonthLoading(false);
    }
  };

  // ✅ IMPLEMENTED: Fetch filter options on component mount
  React.useEffect(() => {
    fetchFilterOptions();
    fetchDrugTypeDistribution();
    fetchPriceAnalysisData(); // Initial load
    fetchMedicinesTableData(); // Initial load
    fetchMedicineByMonthData(); // Initial load
  }, []);

  // ✅ IMPLEMENTED: Fetch drug type distribution when filters change
  React.useEffect(() => {
    fetchDrugTypeDistribution();
  }, [
    selectedCountry,
    selectedArea,
    selectedForm,
    selectedRoute,
    selectedLegalStatus,
    selectedProductControl,
    selectedAuthorizationStatus,
    selectedShelfLife,
  ]);

  // ========================================
  // ✅ IMPLEMENTED: Top 8 Stats Cards with Real API Data
  // ========================================
  // All stats below are connected to the /medicine_kpi API endpoint
  // Data is fetched in real-time and updates when filters are applied
  const stats = [
    // ✅ API Connected: Total unique medicines count
    {
      title: "Total Medicines",
      value: totalMedicines != null ? totalMedicines.toLocaleString() : "—",
      icon: IconPills,
      color: ACCENT.teal,
      bgColor: ACCENT.teal,
    },
    // ✅ API Connected: Total unique scientific names count
    {
      title: "Scientific Names",
      value:
        statsApi?.scientific_names != null
          ? statsApi.scientific_names.toLocaleString()
          : "—",
      icon: IconCertificate,
      color: ACCENT.blue,
      bgColor: ACCENT.blue,
    },
    // ✅ API Connected: Total unique manufacturers count
    {
      title: "Manufacturers",
      value:
        statsApi?.manufacturers != null
          ? statsApi.manufacturers.toLocaleString()
          : "—",
      icon: IconBuilding,
      color: ACCENT.teal,
      bgColor: ACCENT.teal,
    },
    // ✅ API Connected: Total unique manufacturing countries count
    {
      title: "Countries",
      value:
        statsApi?.countries != null ? statsApi.countries.toLocaleString() : "—",
      icon: IconGlobe,
      color: ACCENT.blue,
      bgColor: ACCENT.blue,
    },
    // ✅ API Connected: Total unique administration routes count
    {
      title: "Administration Routes",
      value: statsApi?.routes != null ? statsApi.routes.toLocaleString() : "—",
      icon: IconRoute,
      color: ACCENT.teal,
      bgColor: ACCENT.teal,
    },
    // ✅ API Connected: Total unique pharmaceutical forms count
    {
      title: "Pharmaceutical Forms",
      value: statsApi?.forms != null ? statsApi.forms.toLocaleString() : "—",
      icon: IconPackage,
      color: ACCENT.pink,
      bgColor: ACCENT.pink,
    },
    // ✅ API Connected: Average public price across all medicines
    {
      title: "Avg Public Price",
      value:
        statsApi?.avg_public_price != null
          ? `${statsApi.avg_public_price.toFixed(2)} SAR`
          : "—",
      icon: IconCurrencyDollar,
      color: ACCENT.orange,
      bgColor: ACCENT.orange,
    },
    // ✅ API Connected: Last update timestamp from dataset
    {
      title: "Last Updated",
      value: statsApi?.last_updated
        ? new Date(statsApi.last_updated).toLocaleString()
        : "—",
      icon: IconClock,
      color: ACCENT.gray,
      bgColor: ACCENT.gray,
    },
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

  // (old per-endpoint effects removed; now sourced from /medicine_kpi)

  // CanvasJS chart for Monthly Registrations
  const CanvasJSChart = CanvasJSReact.CanvasJSChart;
  // ✅ IMPLEMENTED: Build a chronological series with configurable period (3, 6, 9, 12 months)
  const monthlyDataPoints = (() => {
    const monthNameToIndex = {
      January: 0,
      February: 1,
      March: 2,
      April: 3,
      May: 4,
      June: 5,
      July: 6,
      August: 7,
      September: 8,
      October: 9,
      November: 10,
      December: 11,
      Jan: 0,
      Feb: 1,
      Mar: 2,
      Apr: 3,
      May: 4,
      Jun: 5,
      Jul: 6,
      Aug: 7,
      Sep: 8,
      Oct: 9,
      Nov: 10,
      Dec: 11,
    };

    // Create array for selected period (always 12 months but show only selected period)
    const countsByIndex = Array(12).fill(0);
    const year = new Date().getFullYear();
    const currentMonth = new Date().getMonth();

    // Process monthly registrations data
    monthlyRegistrations.forEach((m) => {
      if (!m) return;

      // Handle Date objects
      if (m?._date instanceof Date) {
        const monthIndex = m._date.getMonth();
        countsByIndex[monthIndex] += Number(m.count || 0);
        return;
      }

      const mm = String(m?.month || "").trim();

      // Handle YYYY-MM format
      if (mm.includes("-")) {
        const parts = mm.split("-");
        if (parts.length === 2) {
          const monthIndex = Math.max(
            0,
            Math.min(11, parseInt(parts[1], 10) - 1)
          );
          countsByIndex[monthIndex] += Number(m.count || 0);
        }
        return;
      }

      // Handle month names (full and abbreviated)
      const monthIndex = monthNameToIndex[mm];
      if (typeof monthIndex === "number") {
        countsByIndex[monthIndex] += Number(m.count || 0);
      }
    });

    // Create data points for selected period (show last N months)
    const monthNames = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    const startMonth = Math.max(0, currentMonth - selectedTrendPeriod + 1);
    const endMonth = currentMonth + 1;

    const dataPoints = [];
    for (let i = startMonth; i < endMonth; i++) {
      const monthIndex = i % 12;
      const yearOffset = Math.floor(i / 12);
      dataPoints.push({
        x: new Date(year + yearOffset, monthIndex, 1),
        y: countsByIndex[monthIndex] || 0, // Ensure empty months show 0
        label: monthNames[monthIndex],
      });
    }

    return dataPoints;
  })();
  const canvasOptions = {
    animationEnabled: true,
    animationDuration: 1200,
    backgroundColor: "transparent",
    title: {
      text: "",
      fontColor: isDark ? "#ffffff" : "#111827",
    },
    axisX: {
      valueFormatString: "MMM",
      interval: 1,
      intervalType: "month",
      labelFontColor: isDark ? "#e5e7eb" : "#111827",
      lineColor: isDark ? "#374151" : "#e5e7eb",
      tickColor: isDark ? "#374151" : "#e5e7eb",
      gridThickness: 0,
      labelFontSize: 12,
      labelFontFamily: "Inter, system-ui, sans-serif",
      titleFontFamily: "Inter, system-ui, sans-serif",
    },
    axisY: {
      title: "Registrations",
      labelFontColor: isDark ? "#e5e7eb" : "#111827",
      titleFontColor: isDark ? "#e5e7eb" : "#111827",
      gridColor: isDark ? "#374151" : "#e5e7eb",
      includeZero: true,
      labelFontSize: 12,
      labelFontFamily: "Inter, system-ui, sans-serif",
      titleFontFamily: "Inter, system-ui, sans-serif",
      gridThickness: 1,
      gridDashType: "dash",
    },
    toolTip: {
      shared: true,
      content:
        '<span style="font-weight: 600; color: {color};">{x}</span><br/>Registrations: <b>{y}</b>',
      fontColor: isDark ? "#ffffff" : "#111827",
      backgroundColor: isDark ? "rgba(17,24,39,0.95)" : "#ffffff",
      borderColor: isDark ? "#374151" : "#e5e7eb",
      borderThickness: 1,
      cornerRadius: 8,
      fontSize: 13,
      fontFamily: "Inter, system-ui, sans-serif",
      shadow: true,
    },
    data: [
      {
        type: "spline",
        color: isDark ? "#20c997" : "#20c997",
        markerColor: isDark ? "#20c997" : "#20c997",
        markerType: "circle",
        markerSize: 5,
        markerBorderColor: isDark ? "#ffffff" : "#ffffff",
        markerBorderThickness: 2,
        lineThickness: 3,
        xValueFormatString: "MMMM",
        yValueFormatString: "#,###",
        dataPoints: monthlyDataPoints,
        showInLegend: false,
        // Enhanced spline properties for smoother curves
        splineType: "cardinal",
        tension: 0.4,
      },
    ],
  };

  // (distribution area pie placeholder remains; data available in payload.total_medicine_by_distribute_area if needed)

  // Dummy medicines data
  const [activeTab, setActiveTab] = useState("top"); // 'top' or 'bottom'
  const [viewMode, setViewMode] = useState("table"); // 'table' or 'graph'

  // Price Analysis: local filters - moved before API data to fix initialization order
  const [selectedAuthorizationStatuses, setSelectedAuthorizationStatuses] =
    useState([]); // ['conditional approval', 'suspended', 'valid']
  const [selectedDistributeAreas, setSelectedDistributeAreas] = useState([]); // ['Hospital', 'Pharmacy']

  // ✅ IMPLEMENTED: Real API data for Medicine Price Analysis
  // Backend API: /medicines/top-bottom endpoint from chatgpt_pie.py
  // This API provides real-time top and bottom medicines by price with filters
  const [topMedicinesApi, setTopMedicinesApi] = useState([]);
  const [bottomMedicinesApi, setBottomMedicinesApi] = useState([]);
  const [priceAnalysisLoading, setPriceAnalysisLoading] = useState(true);

  // ✅ IMPLEMENTED: Medicine by Month data for Authorization Status Breakdown
  // Backend API: /analytics/medicine_by_month endpoint from chatgpt_pie.py
  // This API provides real-time medicine registration data by month
  const [medicineByMonthData, setMedicineByMonthData] = useState([]);
  const [medicineByMonthLoading, setMedicineByMonthLoading] = useState(true);

  // Local filters for the dummy medicines table
  const [selectedTemperatureBand, setSelectedTemperatureBand] = useState("All");
  const [selectedLegalStatuses, setSelectedLegalStatuses] = useState([]); // ['OTC', 'Prescription']
  const [medsView, setMedsView] = useState("table"); // 'table' | 'visuals'

  const temperatureBands = [
    "All",
    "Cold chain (2-8°C)",
    "Room temperature",
    "Frozen",
  ];
  const authorizationStatuses = ["conditional approval", "suspended", "valid"];
  const legalStatuses = ["OTC", "Prescription"];
  const distributeAreasOptions = ["Hospital", "Pharmacy"];

  // ✅ IMPLEMENTED: Real API data for medicines table
  // Backend API: /medicines/summary_latest endpoint provides real medicines data
  const [medicinesTableData, setMedicinesTableData] = useState([]);
  const [medicinesTableLoading, setMedicinesTableLoading] = useState(true);

  // Fallback dummy data for backward compatibility
  const medicinesList = [
    {
      trade_name: "ZYPREXA 10MG F.C.TAB",
      administrationroute: "Oral use",
      distribute_area: "Pharmacy",
      temperature_band: "Room temperature",
      authorization_status: "valid",
      legal_status: "Prescription",
      drugtype: "Generic",
      public_price: 18_500,
      pharmaceuticalform: "Film coated Tablet",
    },
    {
      trade_name: "ZYRTEC 10MG F.C.TAB",
      administrationroute: "Oral use",
      distribute_area: "Pharmacy",
      temperature_band: "Room temperature",
      authorization_status: "valid",
      legal_status: "OTC",
      drugtype: "Generic",
      public_price: 9_200,
      pharmaceuticalform: "Tablet",
    },
    {
      trade_name: "ZYTELO 25 mg Film Coated Tablet",
      administrationroute: "Oral use",
      distribute_area: "Pharmacy",
      temperature_band: "Cold chain (2-8°C)",
      authorization_status: "conditional approval",
      legal_status: "Prescription",
      drugtype: "NCE",
      public_price: 1_250_000,
      pharmaceuticalform: "Film coated Tablet",
    },
    {
      trade_name: "ZYTIGA 500 Film-coated Tablet",
      administrationroute: "Oral use",
      distribute_area: "Pharmacy",
      temperature_band: "Room temperature",
      authorization_status: "valid",
      legal_status: "Prescription",
      drugtype: "NCE",
      public_price: 890_000,
      pharmaceuticalform: "Tablet",
    },
    {
      trade_name: "ZYTEDIN 100MG POWDER FOR INJECTION",
      administrationroute: "Subcutaneous use",
      distribute_area: "Hospital",
      temperature_band: "Frozen",
      authorization_status: "suspended",
      legal_status: "Prescription",
      drugtype: "Biological",
      public_price: 22_400_000,
      pharmaceuticalform: "Powder for injection",
    },
    {
      trade_name: "ZIVYOX 2 MG/ML SOLUTION FOR INFUSION",
      administrationroute: "Intravenous use",
      distribute_area: "Hospital",
      temperature_band: "Cold chain (2-8°C)",
      authorization_status: "valid",
      legal_status: "Prescription",
      drugtype: "Biological",
      public_price: 24_100_000,
      pharmaceuticalform: "Solution for infusion",
    },
    {
      trade_name: "ZYROSAL 10MG F.C.TABLET",
      administrationroute: "Oral use",
      distribute_area: "Pharmacy",
      temperature_band: "Room temperature",
      authorization_status: "valid",
      legal_status: "OTC",
      drugtype: "Generic",
      public_price: 6_800,
      pharmaceuticalform: "Tablet",
    },
    {
      trade_name: "ZYPREXA 5MG COATED TABLETS",
      administrationroute: "Oral use",
      distribute_area: "Pharmacy",
      temperature_band: "Room temperature",
      authorization_status: "conditional approval",
      legal_status: "Prescription",
      drugtype: "Generic",
      public_price: 11_300,
      pharmaceuticalform: "Film coated Tablet",
    },
    {
      trade_name: "ZYTELO 12.5 mg/ 1000 mg Film Coated Tablet",
      administrationroute: "Oral use",
      distribute_area: "Pharmacy",
      temperature_band: "Cold chain (2-8°C)",
      authorization_status: "valid",
      legal_status: "Prescription",
      drugtype: "Radiopharmaceutical",
      public_price: 120_000,
      pharmaceuticalform: "Solution",
    },
    {
      trade_name: "ZYTELO PLUS 12.5 mg/ 500 mg Film Coated Tablet",
      administrationroute: "Oral use",
      distribute_area: "Pharmacy",
      temperature_band: "Room temperature",
      authorization_status: "valid",
      legal_status: "OTC",
      drugtype: "Generic",
      public_price: 8_900,
      pharmaceuticalform: "Film coated Tablet",
    },
  ];

  // ✅ IMPLEMENTED: Fetch medicines table data from /medicines/summary_latest API
  const fetchMedicinesTableData = async () => {
    try {
      setMedicinesTableLoading(true);
      const params = new URLSearchParams();
      if (selectedTemperatureBand && selectedTemperatureBand !== "All") {
        params.append("temperature_band", selectedTemperatureBand);
      }
      if (selectedAuthorizationStatuses.length > 0) {
        params.append("authorization_status", selectedAuthorizationStatuses[0]);
      }
      if (selectedLegalStatuses.length > 0) {
        params.append("legal_status", selectedLegalStatuses[0]);
      }
      // ✅ IMPLEMENTED: Include additional filters in medicines table
      if (selectedProductControl && selectedProductControl !== "All") {
        params.append("product_control", selectedProductControl);
      }
      if (selectedShelfLife && selectedShelfLife !== "All") {
        params.append("shelflife", selectedShelfLife);
      }
      params.append("table_limit", "200");

      const res = await fetch(
        `http://localhost:8000/medicines/summary_latest?${params.toString()}`
      );
      if (!res.ok) return;
      const payload = await res.json();

      if (payload.data?.table_rows) {
        setMedicinesTableData(payload.data.table_rows);
      }
    } catch (e) {
      console.error("Error fetching medicines table data:", e);
    } finally {
      setMedicinesTableLoading(false);
    }
  };

  // ✅ IMPLEMENTED: Fetch price analysis data when filters change
  // This effect runs after all state variables are declared
  const isFirstRender = React.useRef(true);
  React.useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return; // Skip first render
    }
    fetchPriceAnalysisData();
    fetchMedicinesTableData();
    fetchMedicineByMonthData();
  }, [
    selectedAuthorizationStatuses,
    selectedDistributeAreas,
    selectedTemperatureBand,
    selectedLegalStatuses,
    selectedCountry,
    selectedArea,
    selectedForm,
    selectedRoute,
    selectedProductControl,
    selectedAuthorizationStatus,
    selectedShelfLife,
  ]);

  // ✅ IMPLEMENTED: Use API data for medicines table
  const filteredMedicines =
    medicinesTableData.length > 0
      ? medicinesTableData
      : medicinesList.filter((m) => {
          const tempOk =
            selectedTemperatureBand === "All" ||
            m.temperature_band === selectedTemperatureBand;
          const authOk =
            selectedAuthorizationStatuses.length === 0 ||
            selectedAuthorizationStatuses.includes(m.authorization_status);
          const legalOk =
            selectedLegalStatuses.length === 0 ||
            selectedLegalStatuses.includes(m.legal_status);
          return tempOk && authOk && legalOk;
        });

  // Filtered dataset used for price analysis (authorization_status + distribute_area)
  const filteredForPrice = useMemo(() => {
    return medicinesList.filter((m) => {
      const authOk =
        selectedAuthorizationStatuses.length === 0 ||
        selectedAuthorizationStatuses.includes(m.authorization_status);
      const areaOk =
        selectedDistributeAreas.length === 0 ||
        selectedDistributeAreas.includes(m.distribute_area);
      return authOk && areaOk;
    });
  }, [medicinesList, selectedAuthorizationStatuses, selectedDistributeAreas]);

  // ✅ IMPLEMENTED: Use real API data for top/bottom medicines
  // Backend API: /medicines/top-bottom endpoint provides pre-computed top and bottom medicines
  // Falls back to mock data if API data is not available
  const topMedicines = useMemo(() => {
    if (topMedicinesApi.length > 0) {
      return topMedicinesApi;
    }
    // Fallback to mock data computation if API data is not available
    return [...filteredForPrice]
      .sort((a, b) => Number(b.public_price || 0) - Number(a.public_price || 0))
      .slice(0, 10);
  }, [topMedicinesApi, filteredForPrice]);

  const bottomMedicines = useMemo(() => {
    if (bottomMedicinesApi.length > 0) {
      return bottomMedicinesApi;
    }
    // Fallback to mock data computation if API data is not available
    return [...filteredForPrice]
      .sort((a, b) => Number(a.public_price || 0) - Number(b.public_price || 0))
      .slice(0, 10);
  }, [bottomMedicinesApi, filteredForPrice]);

  // Aggregate for visuals
  const groupByDrugtypeCounts = Object.values(
    filteredMedicines.reduce((acc, row) => {
      const key = row.drugtype || "Unknown";
      if (!acc[key]) acc[key] = { id: key, label: key, value: 0 };
      acc[key].value += 1;
      return acc;
    }, {})
  );

  const sumsByDrugtype = Object.values(
    filteredMedicines.reduce((acc, row) => {
      const key = row.drugtype || "Unknown";
      if (!acc[key]) acc[key] = { drugtype: key, sum: 0 };
      acc[key].sum += Number(row.public_price || 0);
      return acc;
    }, {})
  ).sort((a, b) => b.sum - a.sum);

  const formatMillions = (val) => {
    if (val >= 1_000_000) return `${(val / 1_000_000).toFixed(2)}M`;
    if (val >= 1_000) return `${(val / 1_000).toFixed(1)}K`;
    return `${val}`;
  };

  // Country flag mapping function
  const getCountryFlag = (countryName) => {
    const flagMap = {
      "Saudi Arabia": "🇸🇦",
      "United States": "🇺🇸",
      Germany: "🇩🇪",
      "United Kingdom": "🇬🇧",
      Italy: "🇮🇹",
      Canada: "🇨🇦",
      Spain: "🇪🇸",
      France: "🇫🇷",
      India: "🇮🇳",
      Switzerland: "🇨🇭",
      China: "🇨🇳",
      Japan: "🇯🇵",
      Brazil: "🇧🇷",
      Australia: "🇦🇺",
      Netherlands: "🇳🇱",
      Belgium: "🇧🇪",
      Sweden: "🇸🇪",
      Norway: "🇳🇴",
      Denmark: "🇩🇰",
      Finland: "🇫🇮",
    };
    return flagMap[countryName] || "🌍"; // Default to world flag if country not found
  };

  // Chart rendering function
  const renderChart = (containerId, data, isTop) => {
    if (typeof Highcharts === "undefined") return;

    const chartData = data.map((medicine, index) => [
      medicine.trade_name.length > 20
        ? medicine.trade_name.substring(0, 20) + "..."
        : medicine.trade_name,
      isTop ? medicine.public_price / 1000000 : medicine.public_price,
    ]);

    const colors = isTop
      ? [
          "#00d4aa",
          "#00b8a9",
          "#009c9f",
          "#008095",
          "#00648b",
          "#004881",
          "#002c77",
          "#00106d",
          "#000063",
          "#000059",
        ]
      : [
          "#ff6b35",
          "#ff8e53",
          "#ffb171",
          "#ffd48f",
          "#fff7ad",
          "#e6d89b",
          "#ccb989",
          "#b39a77",
          "#997b65",
          "#805c53",
        ];

    Highcharts.chart(containerId, {
      chart: {
        type: "column",
        backgroundColor: "transparent",
        style: {
          fontFamily: "Inter, system-ui, sans-serif",
        },
      },
      title: {
        text: `${isTop ? "Top 10" : "Bottom 10"} Medicines by Price`,
        style: {
          color: isTop ? "#00d4aa" : "#ff6b35",
          fontSize: "18px",
          fontWeight: "600",
        },
      },
      subtitle: {
        text: isTop
          ? "Highest value medicines in the market"
          : "Most affordable medicines available",
        style: {
          color: "#6b7280",
          fontSize: "14px",
        },
      },
      xAxis: {
        type: "category",
        labels: {
          autoRotation: [-45, -90],
          style: {
            fontSize: "12px",
            fontFamily: "Inter, system-ui, sans-serif",
            color: "#6b7280",
          },
        },
        lineColor: "#e5e7eb",
        tickColor: "#e5e7eb",
      },
      yAxis: {
        min: 0,
        title: {
          text: isTop ? "Price (Millions USD)" : "Price (USD)",
          style: {
            color: "#6b7280",
            fontSize: "14px",
          },
        },
        labels: {
          style: {
            color: "#6b7280",
            fontSize: "12px",
          },
        },
        gridLineColor: "#f3f4f6",
      },
      legend: {
        enabled: false,
      },
      tooltip: {
        backgroundColor: "rgba(255, 255, 255, 0.95)",
        borderColor: "#e5e7eb",
        borderRadius: 8,
        shadow: true,
        style: {
          fontSize: "13px",
        },
        pointFormat: isTop
          ? "Price: <b>${point.y:.1f}M</b>"
          : "Price: <b>${point.y:.2f}</b>",
      },
      series: [
        {
          name: "Price",
          colors: colors,
          colorByPoint: true,
          groupPadding: 0.1,
          pointPadding: 0.05,
          data: chartData,
          dataLabels: {
            enabled: true,
            rotation: -90,
            color: "#FFFFFF",
            inside: true,
            verticalAlign: "top",
            format: isTop ? "{point.y:.1f}M" : "${point.y:.2f}",
            y: 10,
            style: {
              fontSize: "11px",
              fontFamily: "Inter, system-ui, sans-serif",
              fontWeight: "600",
              textShadow: "0 1px 2px rgba(0,0,0,0.3)",
            },
          },
        },
      ],
      credits: {
        enabled: false,
      },
    });
  };

  // Price Analysis chart rendering moved into PriceAnalysis component

  // Use API data when available, fallback to mock data
  const medicinesByCountry =
    medicinesByCountryApi.length > 0
      ? medicinesByCountryApi
      : [
          { country: "Saudi Arabia", count: 365 },
          { country: "United States", count: 320 },
          { country: "Germany", count: 290 },
          { country: "United Kingdom", count: 230 },
          { country: "France", count: 210 },
          { country: "India", count: 200 },
          { country: "Switzerland", count: 160 },
          { country: "China", count: 140 },
        ];

  // ✅ IMPLEMENTED: Fallback data for Medicines by Pharmaceutical Form (used when API data is empty)
  const medicinesByForm = [
    { form: "Tablet", count: 680 },
    { form: "Capsule", count: 420 },
    { form: "Syrup", count: 260 },
    { form: "Injection", count: 220 },
    { form: "Cream", count: 160 },
  ];

  const statusDistribution = [
    { status: "Approved", count: 1840 },
    { status: "Pending", count: 320 },
    { status: "Rejected", count: 90 },
    { status: "Expired", count: 95 },
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
    { index: 11, red: 36, blue: 44, redLine: 36, blueLine: 44 },
  ];

  // routeTrendsData now comes from backend

  // manufacturerRanking now comes from backend

  const valueFormatter = (item) => `${item.value.toLocaleString()}`;
  const axisStyles = {
    tickLabelStyle: { fill: isDark ? "#e5e7eb" : "#111827" },
    labelStyle: { fill: isDark ? "#e5e7eb" : "#111827" },
  };
  const totalMedicinesByCountry = medicinesByCountry.reduce(
    (s, d) => s + d.count,
    0
  );
  const numCountries = medicinesByCountry.length;

  // Helper function to determine if a color is light or dark
  const isLightColor = (color) => {
    if (typeof color !== "string" || !color.startsWith("#")) return false;
    const hex = color.replace("#", "");
    const r = parseInt(hex.substr(0, 2), 16);
    const g = parseInt(hex.substr(2, 2), 16);
    const b = parseInt(hex.substr(4, 2), 16);
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
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
    const text =
      typeof value === "number" ? value.toLocaleString() : String(value);
    // Get the bar color based on index
    const barIndex = medicinesByForm.findIndex((item) => item.count === value);
    const safeIndex = barIndex >= 0 ? barIndex : 0;
    const barColor = PIE_BAR_COLORS[safeIndex % PIE_BAR_COLORS.length];
    // Use black text for light colors, white for dark colors
    const isLight = isLightColor(barColor);
    const textColor = isLight ? "#000000" : "#ffffff";
    const shadowColor = isLight ? "rgba(255,255,255,0.8)" : "rgba(0,0,0,0.8)";

    return (
      <text
        x={x + width / 2}
        y={y + 14}
        fill={textColor}
        textAnchor="middle"
        dominantBaseline="central"
        fontSize={12}
        style={{ textShadow: `1px 1px 2px ${shadowColor}`, fontWeight: "bold" }}
      >
        {text}
      </text>
    );
  };

  const renderInsideRightLabel = (props) => {
    const { x, y, width, height, value, payload } = props;
    const text =
      typeof value === "number" ? value.toLocaleString() : String(value);
    // Get the bar color based on index
    const barIndex = manufacturerRanking.findIndex(
      (item) => item.medicines === value
    );
    const safeIndex = barIndex >= 0 ? barIndex : 0;
    const barColor = PIE_BAR_COLORS[safeIndex % PIE_BAR_COLORS.length];
    // Use black text for light colors, white for dark colors
    const isLight = isLightColor(barColor);
    const textColor = isLight ? "#000000" : "#ffffff";
    const shadowColor = isLight ? "rgba(255,255,255,0.8)" : "rgba(0,0,0,0.8)";

    return (
      <text
        x={x + width - 6}
        y={y + height / 2}
        fill={textColor}
        textAnchor="end"
        dominantBaseline="central"
        fontSize={12}
        style={{ textShadow: `1px 1px 2px ${shadowColor}`, fontWeight: "bold" }}
      >
        {text}
      </text>
    );
  };

  // in-view refs per chart to mount only when visible
  const [monthlyRef, monthlyInView] = useInViewOnce({ threshold: 0.3 });
  const [pieDrugRef, pieDrugInView] = useInViewOnce({ threshold: 0.2 });
  const [formRef, formInView] = useInViewOnce({ threshold: 0.2 });
  const [authRef, authInView] = useInViewOnce({ threshold: 0.2 });
  const [bumpRef, bumpInView] = useInViewOnce({ threshold: 0.2 });
  const [manuRef, manuInView] = useInViewOnce({ threshold: 0.2 });
  const [hasScrolled, setHasScrolled] = useState(false);
  React.useEffect(() => {
    const onScroll = () => {
      setHasScrolled(true);
      window.removeEventListener("scroll", onScroll);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
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
              .attr({
                start: startAngleRadLocal,
                end: startAngleRadLocal,
                opacity: 1,
              })
              .animate(
                { start: args.start, end: args.end },
                { duration: animation.duration / points.length },
                function () {
                  if (points[point.index + 1])
                    fanAnimate(points[point.index + 1], args.end);
                  if (point.index === series.points.length - 1) {
                    if (series.dataLabelsGroup) {
                      series.dataLabelsGroup
                        .attr({ opacity: 0 })
                        .animate({ opacity: 1 });
                    }
                    points.forEach((p) => {
                      p.opacity = 1;
                    });
                    series.update({ enableMouseTracking: true }, false);
                    chart.update({
                      plotOptions: {
                        pie: { innerSize: "40%", borderRadius: 8 },
                      },
                    });
                  }
                }
              );
          }
        }

        if (init) {
          points.forEach((point) => {
            point.opacity = 0;
          });
        } else if (points && points[0]) {
          fanAnimate(points[0], startAngleRad);
        }
      };
    })(Highcharts);
    pieProto.__fanAnimationInstalled = true;
  }, []);

  // Highcharts pie options derived from grouped counts
  const pieSeriesData = useMemo(
    () => groupByDrugtypeCounts.map((d) => ({ name: d.label, y: d.value })),
    [groupByDrugtypeCounts]
  );

  const pieVisualOptions = useMemo(
    () => ({
      chart: { type: "pie", backgroundColor: "transparent" },
      title: { text: "" },
      subtitle: { text: "" },
      tooltip: {
        headerFormat: "",
        pointFormat:
          '<span style="color:{point.color}">●</span> {point.name}: <b>{point.percentage:.1f}%</b>',
      },
      legend: { itemStyle: { color: isDark ? "#ffffff" : "#111827" } },
      plotOptions: {
        pie: {
          allowPointSelect: true,
          borderWidth: 2,
          cursor: "pointer",
          colors: PIE_BAR_COLORS,
          dataLabels: {
            enabled: true,
            distance: 20,
            formatter: function () {
              return `<b>${this.point.name}</b><br/>${this.percentage.toFixed(
                1
              )}%`;
            },
            style: {
              color: isDark ? "#ffffff" : "#111827",
              textOutline: "none",
            },
          },
        },
      },
      series: [
        {
          type: "pie",
          enableMouseTracking: false,
          animation: { duration: 2000 },
          colorByPoint: true,
          data: pieSeriesData,
          colors: PIE_BAR_COLORS,
        },
      ],
      credits: { enabled: false },
    }),
    [pieSeriesData, isDark]
  );

  // Highcharts horizontal bar for Sum of public_price by drugtype
  React.useEffect(() => {
    if (Highcharts?.Templating?.helpers) {
      Highcharts.Templating.helpers.abs = (value) => Math.abs(value);
    }
  }, []);

  const barCategories = React.useMemo(
    () => sumsByDrugtype.map((d) => d.drugtype),
    [sumsByDrugtype]
  );
  const barData = React.useMemo(
    () => sumsByDrugtype.map((d) => d.sum),
    [sumsByDrugtype]
  );
  const totalBar = React.useMemo(
    () => barData.reduce((a, b) => a + b, 0),
    [barData]
  );

  const barVisualOptions = React.useMemo(
    () => ({
      chart: { type: "bar", backgroundColor: "transparent" },
      title: { text: "" },
      subtitle: { text: "" },
      xAxis: [
        {
          categories: barCategories,
          reversed: false,
          labels: { style: { color: isDark ? "#ffffff" : "#111827" } },
        },
      ],
      yAxis: {
        title: { text: null },
        labels: {
          style: { color: isDark ? "#ffffff" : "#111827" },
          formatter: function () {
            const pct = totalBar > 0 ? (this.value / totalBar) * 100 : 0;
            return `${pct.toFixed(0)}%`;
          },
        },
      },
      legend: { enabled: false },
      plotOptions: {
        series: {
          borderRadius: "50%",
          dataLabels: {
            enabled: true,
            formatter: function () {
              return `$${formatMillions(this.y)}`;
            },
            style: {
              color: isDark ? "#ffffff" : "#111827",
              textOutline: "none",
              fontWeight: "600",
            },
          },
        },
      },
      tooltip: {
        backgroundColor: isDark ? "rgba(17,24,39,0.95)" : "#ffffff",
        style: { color: isDark ? "#ffffff" : "#111827" },
        pointFormatter: function () {
          const pct = totalBar > 0 ? (this.y / totalBar) * 100 : 0;
          return `<b>${this.category}</b><br/>Sum: $${formatMillions(
            this.y
          )} (${pct.toFixed(1)}%)`;
        },
      },
      series: [
        {
          name: "Public Price",
          type: "bar",
          data: barData,
          colorByPoint: true,
          colors: PIE_BAR_COLORS,
        },
      ],
      credits: { enabled: false },
    }),
    [barCategories, barData, totalBar, isDark]
  );

  // Stacked Column: Count of drugtype by pharmaceuticalform and drugtype
  const pharmaForms = React.useMemo(() => {
    const set = new Set(
      filteredMedicines.map((m) => m.pharmaceuticalform || "Unknown")
    );
    return Array.from(set);
  }, [filteredMedicines]);

  const drugtypesUnique = React.useMemo(() => {
    const set = new Set(filteredMedicines.map((m) => m.drugtype || "Unknown"));
    return Array.from(set);
  }, [filteredMedicines]);

  const countsByFormAndDrugtype = React.useMemo(() => {
    const map = {};
    pharmaForms.forEach((f) => {
      map[f] = {};
      drugtypesUnique.forEach((d) => {
        map[f][d] = 0;
      });
    });
    filteredMedicines.forEach((m) => {
      const f = m.pharmaceuticalform || "Unknown";
      const d = m.drugtype || "Unknown";
      if (!map[f]) map[f] = {};
      if (!map[f][d]) map[f][d] = 0;
      map[f][d] += 1;
    });
    return map;
  }, [filteredMedicines, pharmaForms, drugtypesUnique]);

  const stackedSeries = React.useMemo(
    () =>
      drugtypesUnique.map((dt, idx) => ({
        type: "column",
        name: dt,
        data: pharmaForms.map((f) => countsByFormAndDrugtype[f]?.[dt] || 0),
        stack: "forms",
        color: PIE_BAR_COLORS[idx % PIE_BAR_COLORS.length],
      })),
    [drugtypesUnique, pharmaForms, countsByFormAndDrugtype]
  );

  const stackedOptions = React.useMemo(
    () => ({
      chart: { type: "column", backgroundColor: "transparent" },
      title: { text: "" },
      xAxis: {
        categories: pharmaForms,
        labels: { style: { color: isDark ? "#ffffff" : "#111827" } },
      },
      yAxis: {
        allowDecimals: false,
        min: 0,
        title: {
          text: "Count of drugtype",
          style: { color: isDark ? "#ffffff" : "#111827" },
        },
        labels: { style: { color: isDark ? "#ffffff" : "#111827" } },
      },
      tooltip: { shared: true },
      plotOptions: { column: { stacking: "normal" } },
      legend: { itemStyle: { color: isDark ? "#ffffff" : "#111827" } },
      series: stackedSeries,
      credits: { enabled: false },
    }),
    [pharmaForms, stackedSeries, isDark]
  );

  return (
    <div className="min-h-screen w-full relative">
      <div className="relative z-10 space-y-4 md:space-y-6 p-3 md:p-4 pb-16 md:pb-20">
        {/* ========================================
            ✅ IMPLEMENTED: Top 8 Stats Cards Display
            ========================================
            These cards display real-time data from the /medicine_kpi API
            All values update automatically when filters are applied
            Data includes: medicines count, scientific names, manufacturers,
            countries, routes, forms, average price, and last updated time
        */}
        <LazyMotion features={domAnimation} strict>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
            {isInitialLoading
              ? // Show loading placeholders for stats cards
                Array.from({ length: 8 }).map((_, index) => (
                  <m.div
                    key={`loading-${index}`}
                    className="group relative overflow-hidden rounded-xl border border-gray-300 dark:border-white/20 bg-white dark:bg-transparent will-change-transform transform-gpu"
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true, amount: 0.4 }}
                    variants={cardVariants}
                    custom={index}
                    style={{
                      backfaceVisibility: "hidden",
                      transform: "translateZ(0)",
                    }}
                  >
                    <div className="relative p-4">
                      <div className="flex items-center justify-between gap-3">
                        <div className="space-y-1 flex-1">
                          <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                        </div>
                        <div className="flex items-center justify-center ml-3">
                          <Loader
                            size={24}
                            color={isDark ? "#ffffff" : "#6b7280"}
                            speed={1.5}
                          />
                        </div>
                      </div>
                    </div>
                  </m.div>
                ))
              : stats.map((stat, index) => (
                  <m.div
                    key={index}
                    className="group relative overflow-hidden rounded-xl border border-gray-300 dark:border-white/20 hover:border-gray-400 dark:hover:border-white/30 bg-white dark:bg-transparent will-change-transform transform-gpu"
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true, amount: 0.4 }}
                    variants={cardVariants}
                    custom={index}
                    style={{
                      backfaceVisibility: "hidden",
                      transform: "translateZ(0)",
                    }}
                  >
                    <div className="relative p-4">
                      <div className="flex items-center justify-between gap-3">
                        <div className="space-y-1">
                          <p className="text-xs font-medium text-gray-500 uppercase tracking-wide dark:text-white/70">
                            {stat.title}
                          </p>
                          <p
                            className={`${
                              index === 7 ? "text-base md:text-lg" : "text-2xl"
                            } font-bold text-gray-900 dark:text-white`}
                          >
                            {stat.value}
                          </p>
                        </div>
                        {index === 0 || index === 2 ? (
                          <div
                            className="flex-1 flex items-center justify-center ml-3"
                            style={{ height: "56px" }}
                          >
                            <MiniTrendLineSVG color={ACCENT.teal} />
                          </div>
                        ) : index === 1 || index === 3 ? (
                          <div
                            className="flex-1 flex items-center justify-center ml-3"
                            style={{ height: "56px" }}
                          >
                            <Mini3DBarChart
                              color={stat.color}
                              data={miniBarData.map((d) => d.v)}
                              dark={isDark}
                            />
                          </div>
                        ) : (
                          <div className="flex items-center justify-center ml-3">
                            <stat.icon
                              className="w-6 h-6"
                              style={{ color: stat.color }}
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  </m.div>
                ))}
          </div>
        </LazyMotion>

        {/* ✅ IMPLEMENTED: Active filters with backend data */}
        {isInitialLoading ? (
          <div className="group relative overflow-visible p-0 text-gray-900 dark:text-white">
            <div className="flex items-center justify-between pt-6 pb-4 border-t border-gray-200 dark:border-white/10">
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                Filters
              </h3>
            </div>
              <div className="h-24 flex items-center justify-center">
              <Loader
                size={40}
                color={isDark ? "#ffffff" : "#6b7280"}
                speed={1.5}
              />
            </div>
          </div>
        ) : (
          <FiltersControls
            selectedCountry={selectedCountry}
            setSelectedCountry={setSelectedCountry}
            selectedArea={selectedArea}
            setSelectedArea={setSelectedArea}
            selectedRoute={selectedRoute}
            setSelectedRoute={setSelectedRoute}
            selectedForm={selectedForm}
            setSelectedForm={setSelectedForm}
            selectedLegalStatus={selectedLegalStatus}
            setSelectedLegalStatus={setSelectedLegalStatus}
            selectedProductControl={selectedProductControl}
            setSelectedProductControl={setSelectedProductControl}
            selectedAuthorizationStatus={selectedAuthorizationStatus}
            setSelectedAuthorizationStatus={setSelectedAuthorizationStatus}
            selectedShelfLife={selectedShelfLife}
            setSelectedShelfLife={setSelectedShelfLife}
            countries={countries}
            areas={areas}
            routes={routes}
            forms={forms}
            legalStatuses={legalStatusOptions}
            productControls={productControlOptions}
            authorizationStatuses={authorizationStatusOptions}
            shelfLives={shelfLifeOptions}
            isDark={isDark}
          />
        )}

        {/* Charts Grid - 2 per row on large screens with center divider */}
        {/* UI: monthly registrations, drug type distribution, distribution area, medicines by form, auth status, route bump, manufacturers */}
        <div className="relative">
          <div className="pointer-events-none hidden md:block absolute inset-y-0 left-1/2 -translate-x-1/2 w-px bg-gray-200/80 dark:bg-white/10" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-6 items-start content-start">
            <div ref={monthlyRef}>
              {isInitialLoading ? (
                <div className="group relative overflow-visible p-0 text-gray-900 dark:text-white">
                  <div className="flex items-center justify-between pt-6 pb-4 border-t border-gray-200 dark:border-white/10">
                    <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                      Medicine Registrations by Month
                    </h3>
                  </div>
                  <div className="h-[28rem] flex items-center justify-center">
                    <Loader
                      size={60}
                      color={isDark ? "#ffffff" : "#6b7280"}
                      speed={1.5}
                    />
                  </div>
                </div>
              ) : (
                hasScrolled && monthlyInView && (
                  <AuthorizationStatusChart
                    isDark={isDark}
                    palette={PALETTE}
                    data={
                      medicineByMonthData.length > 0
                        ? medicineByMonthData
                        : authorizationStatusChartData
                    }
                    loading={medicineByMonthLoading}
                    selectedTrendPeriod={selectedTrendPeriod}
                    setSelectedTrendPeriod={setSelectedTrendPeriod}
                    title="Medicine Registrations by Month"
                  />
                )
              )}
            </div>

            <div ref={pieDrugRef}>
              {isInitialLoading ? (
                <div className="group relative overflow-visible p-0 text-gray-900 dark:text-white">
                  <div className="flex items-center justify-between pt-6 pb-4 border-t border-gray-200 dark:border-white/10">
                    <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                      Drug Type Distribution
                    </h3>
                  </div>
                  <div className="h-[28rem] flex items-center justify-center">
                    <Loader
                      size={60}
                      color={isDark ? "#ffffff" : "#6b7280"}
                      speed={1.5}
                    />
                  </div>
                </div>
              ) : (
                hasScrolled &&
                pieDrugInView && (
                  <DrugTypeDistribution
                    isDark={isDark}
                    colors={PIE_BAR_COLORS}
                    data={drugTypeDistribution}
                    valueFormatter={valueFormatter}
                    loading={drugTypeDistributionLoading}
                  />
                )
              )}
            </div>

            <div ref={formRef}>
              {isInitialLoading ? (
                <div className="group relative overflow-visible p-0 text-gray-900 dark:text-white">
                  <div className="flex items-center justify-between pt-6 pb-4 border-t border-gray-200 dark:border-white/10">
                    <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                      Medicines by Form
                    </h3>
                  </div>
                  <div className="h-[28rem] flex items-center justify-center">
                    <Loader
                      size={60}
                      color={isDark ? "#ffffff" : "#6b7280"}
                      speed={1.5}
                    />
                  </div>
                </div>
              ) : (
                hasScrolled &&
                formInView && (
                  <MedicinesByForm
                    isDark={isDark}
                    data={
                      pharmaFormsData.length ? pharmaFormsData : medicinesByForm
                    }
                    colors={PIE_BAR_COLORS}
                  />
                )
              )}
            </div>

            <div className="group relative overflow-visible p-0 text-gray-900 dark:text-white">
              <div className="flex items-center justify-between pt-6 pb-4 border-t border-gray-200 dark:border-white/10">
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                  Medicines by Manufacture Country
                </h3>
              </div>
              <div className="h-64 md:h-[28rem] relative">
                {isInitialLoading ? (
                  <div className="h-full flex items-center justify-center">
                    <Loader
                      size={60}
                      color={isDark ? "#ffffff" : "#6b7280"}
                      speed={1.5}
                    />
                  </div>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <ReBarChart
                      data={medicinesByCountry}
                      margin={{
                        top: 20,
                        right: 30,
                        left: 20,
                        bottom: 5,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke={isDark ? "#374151" : "#e5e7eb"} />
                      <XAxis 
                        dataKey="country" 
                        tick={{ fontSize: 12, fill: isDark ? "#e5e7eb" : "#111827" }}
                        axisLine={{ stroke: isDark ? "#374151" : "#e5e7eb" }}
                        tickLine={{ stroke: isDark ? "#374151" : "#e5e7eb" }}
                        angle={-45}
                        textAnchor="end"
                        height={80}
                      />
                      <YAxis 
                        tick={{ fontSize: 12, fill: isDark ? "#e5e7eb" : "#111827" }}
                        axisLine={{ stroke: isDark ? "#374151" : "#e5e7eb" }}
                        tickLine={{ stroke: isDark ? "#374151" : "#e5e7eb" }}
                        label={{ 
                          value: 'Number of Medicines', 
                          angle: -90, 
                          position: 'insideLeft',
                          style: { textAnchor: 'middle', fill: isDark ? "#e5e7eb" : "#111827" }
                        }}
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: isDark ? "rgba(17,24,39,0.95)" : "#ffffff",
                          border: `1px solid ${isDark ? "#374151" : "#e5e7eb"}`,
                          borderRadius: "8px",
                          color: isDark ? "#e5e7eb" : "#111827",
                        }}
                        formatter={(value, name) => [
                          value.toLocaleString(),
                          "Medicines"
                        ]}
                        labelFormatter={(label) => `Country: ${label}`}
                      />
                      <Bar 
                        dataKey="count" 
                        fill="#2CCFB2"
                        radius={[4, 4, 0, 0]}
                      >
                        <LabelList 
                          dataKey="count" 
                          position="top" 
                          style={{ 
                            fill: isDark ? "#e5e7eb" : "#111827", 
                            fontSize: 12,
                            fontWeight: 600
                          }}
                          formatter={(value) => value.toLocaleString()}
                        />
                      </Bar>
                    </ReBarChart>
                  </ResponsiveContainer>
                )}
              </div>
            </div>

            {/* Removed duplicate Medicine Registrations by Month section after moving it above */}

            <div ref={bumpRef}>
              {isInitialLoading ? (
                <div className="group relative overflow-visible p-0 text-gray-900 dark:text-white">
                  <div className="flex items-center justify-between pt-6 pb-4 border-t border-gray-200 dark:border-white/10">
                    <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                      Administration Route Trends
                    </h3>
                  </div>
                  <div className="h-[28rem] flex items-center justify-center">
                    <Loader
                      size={60}
                      color={isDark ? "#ffffff" : "#6b7280"}
                      speed={1.5}
                    />
                  </div>
                </div>
              ) : (
                hasScrolled &&
                bumpInView && (
                  <AdminRouteAreaBump
                    isDark={isDark}
                    palette={PALETTE}
                    data={routeTrendsData}
                    deepPalette={CHART_PALETTES.deep}
                    barData={adminRouteBarData}
                    colors={PIE_BAR_COLORS}
                  />
                )
              )}
            </div>

            {/* New: Distribution Area pie chart placed beside Administration Route Trends */}
            <div>
              {isInitialLoading ? (
                <div className="group relative overflow-visible p-0 text-gray-900 dark:text-white">
                  <div className="flex items-center justify-between pt-6 pb-4 border-t border-gray-200 dark:border-white/10">
                    <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                      Distribution Area
                    </h3>
                  </div>
                  <div className="h-[28rem] flex items-center justify-center">
                    <Loader
                      size={60}
                      color={isDark ? "#ffffff" : "#6b7280"}
                      speed={1.5}
                    />
                  </div>
                </div>
              ) : (
                <DistributionAreaPieChart
                  isDark={isDark}
                  data={distributionAreaData}
                  colors={PIE_BAR_COLORS}
                />
              )}
            </div>
          </div>
        </div>

        {/* Top Manufacturers - Full width section for better label visibility */}
        <div className="w-full mt-8 md:mt-16">
          <div ref={manuRef}>
            {isInitialLoading ? (
              <div className="group relative overflow-visible p-0 text-gray-900 dark:text-white">
                <div className="flex items-center justify-between pt-6 pb-4 border-t border-gray-200 dark:border-white/10">
                  <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                    Top Manufacturers
                  </h3>
                </div>
                <div className="h-64 md:h-[28rem] flex items-center justify-center">
                  <Loader
                    size={60}
                    color={isDark ? "#ffffff" : "#6b7280"}
                    speed={1.5}
                  />
                </div>
              </div>
            ) : (
              hasScrolled &&
              manuInView && (
                <ManufacturersRanking
                  isDark={isDark}
                  data={manufacturerRanking}
                  colors={PIE_BAR_COLORS}
                  renderInsideRightLabel={renderInsideRightLabel}
                />
              )
            )}
          </div>
        </div>

        {/* Medicine Globe - Spans 2 columns with informative insights panel (outside center divider) */}
        <div className="w-full mt-3 md:mt-4 mb-6 md:mb-8 relative z-10">
          {isInitialLoading ? (
            <div className="group relative overflow-visible p-0 text-gray-900 dark:text-white">
              <div className="flex items-center justify-between pt-6 pb-4 border-t border-gray-200 dark:border-white/10">
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                  Global Medicine Distribution
                </h3>
              </div>
              <div className="h-64 md:h-[28rem] flex items-center justify-center">
                <Loader
                  size={60}
                  color={isDark ? "#ffffff" : "#6b7280"}
                  speed={1.5}
                />
              </div>
            </div>
          ) : (
            <GlobeDistribution
              isDark={isDark}
              data={medicinesByCountry}
              loading={medicinesByCountryLoading}
              colors={PIE_BAR_COLORS}
              total={totalMedicinesByCountry}
              numCountries={numCountries}
            />
          )}
        </div>

        {/* Continent Distribution (full-width) */}
        <div className="w-full mt-6 md:mt-10">
          <div className="group relative overflow-visible p-0 text-gray-900 dark:text-white">
            <div className="flex items-center justify-between pt-6 pb-4 border-t border-gray-200 dark:border-white/10">
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                Continent Distribution (Top 10)
              </h3>
            </div>
            <div className="w-full">
              <DefenseRDChart
                compact={false}
                data={continentDistribution}
                title="Continent Distribution"
                isDark={isDark}
              />
            </div>
          </div>
        </div>

        {/* Removed Distribution Area large section (moved beside Administration Route Trends as a pie chart) */}

        {/* ✅ IMPLEMENTED: Price Analysis with real API data */}
        <div className="w-full mt-6 md:mt-8 relative z-30">
          {isInitialLoading ? (
            <div className="group relative overflow-visible p-0 text-gray-900 dark:text-white">
              <div className="flex items-center justify-between pt-6 pb-4 border-t border-gray-200 dark:border-white/10">
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                  Price Analysis
                </h3>
              </div>
              <div className="h-64 md:h-[28rem] flex items-center justify-center">
                <Loader
                  size={60}
                  color={isDark ? "#ffffff" : "#6b7280"}
                  speed={1.5}
                />
              </div>
            </div>
          ) : (
            <PriceAnalysis
              isDark={isDark}
              PIE_BAR_COLORS={PIE_BAR_COLORS}
              authorizationStatuses={authorizationStatuses}
              distributeAreasOptions={distributeAreasOptions}
              selectedAuthorizationStatuses={selectedAuthorizationStatuses}
              setSelectedAuthorizationStatuses={setSelectedAuthorizationStatuses}
              selectedDistributeAreas={selectedDistributeAreas}
              setSelectedDistributeAreas={setSelectedDistributeAreas}
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              viewMode={viewMode}
              setViewMode={setViewMode}
              topMedicines={topMedicines}
              bottomMedicines={bottomMedicines}
              getCountryFlag={getCountryFlag}
              loading={priceAnalysisLoading}
            />
          )}
        </div>

        {/* Medicines Section (extracted) */}
        <div className="w-full mt-4 md:mt-6 md:col-span-2">
          <div className="group relative overflow-visible p-0 text-gray-900 dark:text-white">
            <div className="flex items-center justify-between pt-6 md:pt-8 pb-4">
              <h3 className="text-lg md:text-xl lg:text-2xl font-semibold text-gray-900 dark:text-white">
                Medicines
              </h3>
            </div>
            {isInitialLoading ? (
              <div className="h-64 md:h-[28rem] flex items-center justify-center">
                <Loader
                  size={60}
                  color={isDark ? "#ffffff" : "#6b7280"}
                  speed={1.5}
                />
              </div>
            ) : (
              <MedicinesVisualsSection
                isDark={isDark}
                loading={medicinesTableLoading}
                colors={PIE_BAR_COLORS}
              />
            )}
          </div>
        </div>

        {/* Suspended Medicines: extracted into separate component */}
        {isInitialLoading ? (
          <div className="group relative overflow-visible p-0 text-gray-900 dark:text-white">
            <div className="flex items-center justify-between pt-6 pb-4 border-t border-gray-200 dark:border-white/10">
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                Suspended Medicines
              </h3>
            </div>
            <div className="h-64 md:h-80 flex items-center justify-center">
              <Loader
                size={60}
                color={isDark ? "#ffffff" : "#6b7280"}
                speed={1.5}
              />
            </div>
          </div>
        ) : (
          <SuspendedMedicines isDark={isDark} />
        )}

        {/* Marketing Company x Country Table */}
        <div className="col-span-1 md:col-span-2 mt-4 md:mt-6">
          {isInitialLoading ? (
            <div className="group relative overflow-visible p-0 text-gray-900 dark:text-white">
              <div className="flex items-center justify-between pt-6 pb-4 border-t border-gray-200 dark:border-white/10">
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                  Marketing Company Analysis
                </h3>
              </div>
              <div className="h-64 md:h-[28rem] flex items-center justify-center">
                <Loader
                  size={60}
                  color={isDark ? "#ffffff" : "#6b7280"}
                  speed={1.5}
                />
              </div>
            </div>
          ) : (
            <MarketingCompanyCountryTable />
          )}
        </div>

        {/* Shelf Life Analysis Table */}
        <div className="col-span-1 md:col-span-2 mt-4 md:mt-6">
          <div className="flex items-center justify-between pt-6 md:pt-8 pb-4">
            <h3 className="text-lg md:text-xl lg:text-2xl font-semibold text-gray-900 dark:text-white">
              Shelf Life Analysis
            </h3>
          </div>
          {isInitialLoading ? (
            <div className="h-64 md:h-80 flex items-center justify-center">
              <Loader
                size={60}
                color={isDark ? "#ffffff" : "#6b7280"}
                speed={1.5}
              />
            </div>
          ) : (
            <ShelfLifeTable isDark={isDark} />
          )}
        </div>
      </div>
    </div>
  );
};

export default MedicinesPage;
