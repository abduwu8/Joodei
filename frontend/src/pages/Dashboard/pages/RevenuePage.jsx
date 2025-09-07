import React, { useState } from 'react';
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { IconCash, IconTrendingUp, IconUsers, IconShoppingCart, IconRoute, IconGlobe, IconBuilding, IconPackage } from '@tabler/icons-react';

const RevenuePage = () => {
  const [selectedCountry, setSelectedCountry] = useState('All');
  const [selectedDrugType, setSelectedDrugType] = useState('All');
  const [selectedShelfLife, setSelectedShelfLife] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [selectedAdministrationRoute, setSelectedAdministrationRoute] = useState('All');
  const [selectedPharmaceuticalForm, setSelectedPharmaceuticalForm] = useState('All');

  // Mock data for filters
  const countries = ['All', 'USA', 'Germany', 'India', 'Switzerland', 'France', 'UK', 'Japan', 'China'];
  const drugTypes = ['All', 'Antibiotics', 'Painkillers', 'Vitamins', 'Supplements', 'Cardiovascular', 'Oncology'];
  const shelfLives = ['All', '1-2 years', '2-3 years', '3-5 years', '5+ years'];
  const statuses = ['All', 'Approved', 'Pending', 'Rejected', 'Expired'];
  const administrationRoutes = ['All', 'Oral', 'Intravenous', 'Intramuscular', 'Topical', 'Inhalation'];
  const pharmaceuticalForms = ['All', 'Tablet', 'Capsule', 'Injection', 'Cream', 'Syrup', 'Aerosol'];

  // Mock data for stats
  const stats = [
    { title: 'Total Revenue', value: '$124,592', icon: IconCash, color: 'text-green-500' },
    { title: 'Growth Rate', value: '+12.5%', icon: IconTrendingUp, color: 'text-blue-500' },
    { title: 'Active Customers', value: '1,234', icon: IconUsers, color: 'text-purple-500' },
    { title: 'Orders', value: '856', icon: IconShoppingCart, color: 'text-orange-500' },
    { title: 'Manufacturers', value: '156', icon: IconBuilding, color: 'text-indigo-500' },
    { title: 'Countries', value: '42', icon: IconGlobe, color: 'text-red-500' },
    { title: 'Administration Routes', value: '12', icon: IconRoute, color: 'text-teal-500' },
    { title: 'Pharmaceutical Forms', value: '8', icon: IconPackage, color: 'text-pink-500' }
  ];

  // Mock data for monthly revenue trend
  const monthlyRevenue = [
    { month: 'Jan', revenue: 15000 },
    { month: 'Feb', revenue: 18000 },
    { month: 'Mar', revenue: 16500 },
    { month: 'Apr', revenue: 21000 },
    { month: 'May', revenue: 19500 },
    { month: 'Jun', revenue: 23000 },
    { month: 'Jul', revenue: 25000 },
    { month: 'Aug', revenue: 28000 },
    { month: 'Sep', revenue: 30000 },
    { month: 'Oct', revenue: 27000 },
    { month: 'Nov', revenue: 32000 },
    { month: 'Dec', revenue: 35000 }
  ];

  // Mock data for revenue by category
  const revenueByCategory = [
    { category: 'Antibiotics', revenue: 45000 },
    { category: 'Painkillers', revenue: 35000 },
    { category: 'Vitamins', revenue: 25000 },
    { category: 'Supplements', revenue: 20000 },
    { category: 'Others', revenue: 15000 }
  ];

  // New data for missing sections
  const administrationRouteRevenue = [
    { route: 'Oral', revenue: 52000, percentage: 41.7 },
    { route: 'Intravenous', revenue: 28000, percentage: 22.5 },
    { route: 'Intramuscular', revenue: 22000, percentage: 17.7 },
    { route: 'Topical', revenue: 15000, percentage: 12.0 },
    { route: 'Inhalation', revenue: 6580, percentage: 5.3 },
    { route: 'Others', revenue: 1012, percentage: 0.8 }
  ];

  const manufacturerRanking = [
    { manufacturer: 'Pfizer', revenue: 18500, medicines: 45, marketShare: 14.8 },
    { manufacturer: 'Novartis', revenue: 16200, medicines: 38, marketShare: 13.0 },
    { manufacturer: 'Roche', revenue: 14800, medicines: 32, marketShare: 11.9 },
    { manufacturer: 'Merck', revenue: 13200, medicines: 28, marketShare: 10.6 },
    { manufacturer: 'GSK', revenue: 11800, medicines: 25, marketShare: 9.5 },
    { manufacturer: 'Johnson & Johnson', revenue: 10500, medicines: 22, marketShare: 8.4 },
    { manufacturer: 'Sanofi', revenue: 9200, medicines: 20, marketShare: 7.4 },
    { manufacturer: 'AstraZeneca', revenue: 8100, medicines: 18, marketShare: 6.5 }
  ];

  const priceAnalysisByCountry = [
    { country: 'Switzerland', avgPrice: 245.50, totalRevenue: 18500, medicines: 65 },
    { country: 'USA', avgPrice: 198.75, totalRevenue: 16200, medicines: 120 },
    { country: 'Germany', avgPrice: 187.30, totalRevenue: 14800, medicines: 98 },
    { country: 'France', avgPrice: 165.80, totalRevenue: 13200, medicines: 85 },
    { country: 'UK', avgPrice: 152.40, totalRevenue: 11800, medicines: 78 },
    { country: 'Japan', avgPrice: 142.60, totalRevenue: 10500, medicines: 72 },
    { country: 'India', avgPrice: 89.25, totalRevenue: 9200, medicines: 86 },
    { country: 'China', avgPrice: 76.80, totalRevenue: 8100, medicines: 95 }
  ];

  const pharmaceuticalFormRevenue = [
    { form: 'Tablet', revenue: 58000, percentage: 46.6, avgPrice: 125.50 },
    { form: 'Capsule', revenue: 32000, percentage: 25.7, avgPrice: 98.75 },
    { form: 'Injection', revenue: 22000, percentage: 17.7, avgPrice: 245.30 },
    { form: 'Cream', revenue: 8500, percentage: 6.8, avgPrice: 67.80 },
    { form: 'Syrup', revenue: 3592, percentage: 2.9, avgPrice: 45.60 },
    { form: 'Aerosol', revenue: 1500, percentage: 1.2, avgPrice: 89.40 }
  ];

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D', '#FFC658', '#FF6B6B'];
  
  return (
    <div className="min-h-screen w-full relative">
      {/* Your Content/Components */}
      <div className="relative z-10 space-y-6">


      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className="group relative overflow-hidden bg-white rounded-2xl shadow-[0_1px_3px_0_rgb(0,0,0,0.1),0_1px_2px_-1px_rgb(0,0,0,0.1)] hover:shadow-[0_10px_25px_-3px_rgb(0,0,0,0.1),0_4px_6px_-4px_rgb(0,0,0,0.1)] transition-all duration-300 ease-out border border-gray-100/50 backdrop-blur-sm dark:bg-black dark:border-white/20 dark:hover:shadow-[0_10px_25px_-3px_rgba(255,255,255,0.15),0_4px_6px_-4px_rgba(255,255,255,0.15)]">
            <div className="absolute inset-0 bg-gradient-to-br from-white via-gray-50/30 to-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 dark:from-white/5 dark:via-white/0 dark:to-white/5"></div>
            <div className="relative p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-gray-500 uppercase tracking-wide dark:text-gray-400">{stat.title}</p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-gray-100">{stat.value}</p>
                </div>
                <div className={`p-3 rounded-xl bg-gradient-to-br ${stat.color.replace('text-', 'bg-')} bg-opacity-10`}>
                  <stat.icon className={`w-6 h-6 ${stat.color}`} />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Enhanced Filters Section */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-[0_1px_3px_0_rgb(0,0,0,0.1),0_1px_2px_-1px_rgb(0,0,0,0.1)] border border-gray-100/50 dark:bg-black dark:border-white/20">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 dark:text-white">Filters & Controls</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <select
          value={selectedCountry}
          onChange={(e) => setSelectedCountry(e.target.value)}
          className="bg-white border border-gray-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-gray-500 text-gray-900 dark:bg-black dark:text-white dark:border-white/20"
        >
          {countries.map((country) => (
            <option key={country} value={country}>{country}</option>
          ))}
        </select>

        <select
          value={selectedDrugType}
          onChange={(e) => setSelectedDrugType(e.target.value)}
          className="bg-white border border-gray-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-gray-500 text-gray-900 dark:bg-black dark:text-white dark:border-white/20"
        >
          {drugTypes.map((type) => (
            <option key={type} value={type}>{type}</option>
          ))}
        </select>

        <select
          value={selectedShelfLife}
          onChange={(e) => setSelectedShelfLife(e.target.value)}
          className="bg-white border border-gray-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-gray-500 text-gray-900 dark:bg-black dark:text-white dark:border-white/20"
        >
          {shelfLives.map((life) => (
            <option key={life} value={life}>{life}</option>
          ))}
        </select>

        <select
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
          className="bg-white border border-gray-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-gray-500 text-gray-900 dark:bg-black dark:text-white dark:border-white/20"
        >
          {statuses.map((status) => (
            <option key={status} value={status}>{status}</option>
          ))}
        </select>

        <select
          value={selectedAdministrationRoute}
          onChange={(e) => setSelectedAdministrationRoute(e.target.value)}
          className="bg-white border border-gray-200 rounded-lg px-2 py-2 focus:outline-none focus:ring-2 focus:ring-gray-500 text-gray-900 dark:bg-black dark:text-white dark:border-white/20"
        >
          {administrationRoutes.map((route) => (
            <option key={route} value={route}>{route}</option>
          ))}
        </select>
          <select
            value={selectedPharmaceuticalForm}
            onChange={(e) => setSelectedPharmaceuticalForm(e.target.value)}
            className="bg-white border border-gray-200 rounded-lg px-2 py-2 focus:outline-none focus:ring-2 focus:ring-gray-500 text-gray-900 dark:bg-black dark:text-white dark:border-white/20"
          >
            {pharmaceuticalForms.map((form) => (
              <option key={form} value={form}>{form}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Charts Grid - Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Revenue Trend */}
        <div className="group relative overflow-hidden bg-white p-6 rounded-lg shadow-sm text-gray-900 border border-gray-200 dark:bg-black dark:border-white/20 dark:text-white transition-shadow duration-300 ease-out dark:hover:shadow-[0_10px_25px_-3px_rgba(255,255,255,0.15),0_4px_6px_-4px_rgba(255,255,255,0.15)]">
          <div className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 dark:from-white/5 dark:via-white/0 dark:to-white/5 bg-gradient-to-br hidden dark:block"></div>
          <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">Monthly Revenue Trend</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlyRevenue}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="#0088FE"
                  fill="#0088FE"
                  fillOpacity={0.2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Revenue by Category */}
        <div className="group relative overflow-hidden bg-white p-6 rounded-lg shadow-sm text-gray-900 border border-gray-200 dark:bg-black dark:border-white/20 dark:text-white transition-shadow duration-300 ease-out dark:hover:shadow-[0_10px_25px_-3px_rgba(255,255,255,0.15),0_4px_6px_-4px_rgba(255,255,255,0.15)]">
          <div className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 dark:from-white/5 dark:via-white/0 dark:to-white/5 bg-gradient-to-br hidden dark:block"></div>
          <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">Revenue by Category</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={revenueByCategory}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="category" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="revenue" fill="#00C49F" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Charts Grid - Row 2 (New Missing Sections) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Administration Route Revenue */}
        <div className="group relative overflow-hidden bg-white p-6 rounded-lg shadow-sm text-gray-900 border border-gray-200 dark:bg-black dark:border-white/20 dark:text-white transition-shadow duration-300 ease-out dark:hover:shadow-[0_10px_25px_-3px_rgba(255,255,255,0.15),0_4px_6px_-4px_rgba(255,255,255,0.15)]">
          <div className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 dark:from-white/5 dark:via-white/0 dark:to-white/5 bg-gradient-to-br hidden dark:block"></div>
          <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">Revenue by Administration Route</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={administrationRouteRevenue} layout="horizontal">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis dataKey="route" type="category" width={100} />
                <Tooltip />
                <Bar dataKey="revenue" fill="#8884D8" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Pharmaceutical Form Revenue */}
        <div className="group relative overflow-hidden bg-white p-6 rounded-lg shadow-sm text-gray-900 border border-gray-200 dark:bg-black dark:border-white/20 dark:text-white transition-shadow duration-300 ease-out dark:hover:shadow-[0_10px_25px_-3px_rgba(255,255,255,0.15),0_4px_6px_-4px_rgba(255,255,255,0.15)]">
          <div className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 dark:from-white/5 dark:via-white/0 dark:to-white/5 bg-gradient-to-br hidden dark:block"></div>
          <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">Revenue by Pharmaceutical Form</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={pharmaceuticalFormRevenue} layout="horizontal">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis dataKey="form" type="category" width={100} />
                <Tooltip />
                <Bar dataKey="revenue" fill="#82CA9D" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Charts Grid - Row 3 (More Missing Sections) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Manufacturer Ranking */}
        <div className="group relative overflow-hidden bg-white p-6 rounded-lg shadow-sm text-gray-900 border border-gray-200 dark:bg-black dark:border-white/20 dark:text-white transition-shadow duration-300 ease-out dark:hover:shadow-[0_10px_25px_-3px_rgba(255,255,255,0.15),0_4px_6px_-4px_rgba(255,255,255,0.15)]">
          <div className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 dark:from-white/5 dark:via-white/0 dark:to-white/5 bg-gradient-to-br hidden dark:block"></div>
          <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">Top Manufacturers by Revenue</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={manufacturerRanking} layout="horizontal">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis dataKey="manufacturer" type="category" width={120} />
                <Tooltip />
                <Bar dataKey="revenue" fill="#FFC658" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Price Analysis by Country */}
        <div className="group relative overflow-hidden bg-white p-6 rounded-lg shadow-sm text-gray-900 border border-gray-200 dark:bg-black dark:border-white/20 dark:text-white transition-shadow duration-300 ease-out dark:hover:shadow-[0_10px_25px_-3px_rgba(255,255,255,0.15),0_4px_6px_-4px_rgba(255,255,255,0.15)]">
          <div className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 dark:from-white/5 dark:via-white/0 dark:to-white/5 bg-gradient-to-br hidden dark:block"></div>
          <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">Price Analysis by Country</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={priceAnalysisByCountry}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="country" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="avgPrice" fill="#FF6B6B" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Charts Grid - Row 4 (Final Missing Sections) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Market Share Distribution */}
        <div className="g-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-[0_1px_3px_0_rgb(0,0,0,0.1),0_1px_2px_-1px_rgb(0,0,0,0.1)] border border-gray-100/50 dark:bg-black dark:border-white/20">
          <div className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 dark:from-gray-800/30 dark:via-gray-900/10 dark:to-gray-800/30 bg-gradient-to-br hidden dark:block"></div>
          <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">Market Share Distribution</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={manufacturerRanking}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="marketShare"
                >
                  {manufacturerRanking.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Revenue Performance Metrics */}
        <div className="g-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-[0_1px_3px_0_rgb(0,0,0,0.1),0_1px_2px_-1px_rgb(0,0,0,0.1)] border border-gray-100/50 dark:bg-black dark:border-white/20">
          <div className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 dark:from-gray-800/30 dark:via-gray-900/10 dark:to-gray-800/30 bg-gradient-to-br hidden dark:block"></div>
          <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">Revenue Performance Metrics</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg dark:bg-white/10">
              <span className="text-gray-700 dark:text-white/80">Total Revenue</span>
              <span className="font-semibold text-gray-900 dark:text-white">$124,592</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg dark:bg-white/10">
              <span className="text-gray-700 dark:text-white/80">Average Price</span>
              <span className="font-semibold text-gray-900 dark:text-white">$145.80</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg dark:bg-white/10">
              <span className="text-gray-700 dark:text-white/80">Revenue Growth</span>
              <span className="font-semibold text-green-600">+12.5%</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg dark:bg-white/10">
              <span className="text-gray-700 dark:text-white/80">Top Market</span>
              <span className="font-semibold text-gray-900 dark:text-white">Switzerland</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg dark:bg-white/10">
              <span className="text-gray-700 dark:text-white/80">Most Profitable Form</span>
              <span className="font-semibold text-gray-900 dark:text-white">Tablet</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg dark:bg-white/10">
              <span className="text-gray-700 dark:text-white/80">Leading Route</span>
              <span className="font-semibold text-gray-900 dark:text-white">Oral</span>
            </div>
          </div>
        </div>
      </div>
      </div>
      </div>
  );
};

export default RevenuePage;
