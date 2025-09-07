import React, { useState } from 'react';
import { IconArrowUpRight, IconArrowDownRight, IconPercentage, IconClock, IconTrendingUp, IconTrendingDown, IconCurrencyDollar, IconPackage } from '@tabler/icons-react';

const PricesPage = () => {
  const [selectedDrugType, setSelectedDrugType] = useState('All');
  const [selectedCountry, setSelectedCountry] = useState('All');
  const [selectedArea, setSelectedArea] = useState('All');
  const [selectedPriceRange, setSelectedPriceRange] = useState('All');
  const [selectedChangeStatus, setSelectedChangeStatus] = useState('All');

  // Mock data for filters
  const drugTypes = ['All', 'Antibiotics', 'Painkillers', 'Vitamins', 'Supplements', 'Cardiovascular', 'Oncology'];
  const countries = ['All', 'USA', 'Germany', 'India', 'Switzerland', 'France', 'UK', 'Japan', 'China'];
  const areas = ['All', 'North', 'South', 'East', 'West', 'Central', 'International'];
  const priceRanges = ['All', 'Under $50', '$50-$100', '$100-$200', '$200-$500', 'Over $500'];
  const changeStatuses = ['All', 'Increased', 'Decreased', 'No Change', 'New Product'];

  // Mock data for stats
  const stats = [
    { title: 'Price Increases', value: '+15.2%', icon: IconArrowUpRight, color: 'text-red-500' },
    { title: 'Price Decreases', value: '-8.5%', icon: IconArrowDownRight, color: 'text-green-500' },
    { title: 'Average Change', value: '+3.8%', icon: IconPercentage, color: 'text-blue-500' },
    { title: 'Last Updated', value: '2h ago', icon: IconClock, color: 'text-gray-500' },
    { title: 'Total Products', value: '2,345', icon: IconPackage, color: 'text-purple-500' },
    { title: 'Average Price', value: '$145.80', icon: IconCurrencyDollar, color: 'text-indigo-500' },
    { title: 'Price Volatility', value: '12.3%', icon: IconTrendingUp, color: 'text-orange-500' },
    { title: 'Change Frequency', value: 'Daily', icon: IconClock, color: 'text-teal-500' }
  ];

  // Mock data for price trends
  const priceTrends = [
    { month: 'Jan', increase: 12, decrease: 8, noChange: 5 },
    { month: 'Feb', increase: 15, decrease: 10, noChange: 3 },
    { month: 'Mar', increase: 18, decrease: 12, noChange: 4 },
    { month: 'Apr', increase: 14, decrease: 9, noChange: 6 },
    { month: 'May', increase: 16, decrease: 11, noChange: 2 },
    { month: 'Jun', increase: 20, decrease: 13, noChange: 5 }
  ];

  // Mock data for category price changes
  const categoryChanges = [
    { category: 'Antibiotics', change: 8.5, avgPrice: 125.50, volatility: 15.2 },
    { category: 'Painkillers', change: 6.2, avgPrice: 89.75, volatility: 12.8 },
    { category: 'Vitamins', change: 4.8, avgPrice: 67.30, volatility: 8.9 },
    { category: 'Supplements', change: 3.5, avgPrice: 145.20, volatility: 18.5 },
    { category: 'Cardiovascular', change: 12.1, avgPrice: 234.80, volatility: 22.3 },
    { category: 'Oncology', change: 18.7, avgPrice: 567.90, volatility: 28.9 }
  ];

  // New data for missing sections
  const priceChangeStatusData = [
    { status: 'Increased', count: 1250, percentage: 53.2, avgChange: 12.5 },
    { status: 'Decreased', count: 680, percentage: 29.0, avgChange: -8.3 },
    { status: 'No Change', count: 345, percentage: 14.7, avgChange: 0.0 },
    { status: 'New Product', count: 70, percentage: 3.0, avgChange: 0.0 }
  ];

  const averageDaysData = [
    { category: 'Antibiotics', avgDays: 45, priceChange: 8.5, frequency: 'Monthly' },
    { category: 'Painkillers', avgDays: 38, priceChange: 6.2, frequency: 'Bi-monthly' },
    { category: 'Vitamins', avgDays: 52, priceChange: 4.8, frequency: 'Quarterly' },
    { category: 'Supplements', avgDays: 41, priceChange: 3.5, frequency: 'Monthly' },
    { category: 'Cardiovascular', avgDays: 28, priceChange: 12.1, frequency: 'Weekly' },
    { category: 'Oncology', avgDays: 15, priceChange: 18.7, frequency: 'Weekly' }
  ];

  const priceVolatilityByCountry = [
    { country: 'Switzerland', volatility: 8.5, avgPrice: 245.50, changeFrequency: 'Low' },
    { country: 'USA', volatility: 12.3, avgPrice: 198.75, changeFrequency: 'Medium' },
    { country: 'Germany', volatility: 10.8, avgPrice: 187.30, changeFrequency: 'Medium' },
    { country: 'France', volatility: 9.2, avgPrice: 165.80, changeFrequency: 'Low' },
    { country: 'UK', volatility: 11.7, avgPrice: 152.40, changeFrequency: 'Medium' },
    { country: 'Japan', volatility: 7.8, avgPrice: 142.60, changeFrequency: 'Low' },
    { country: 'India', volatility: 18.9, avgPrice: 89.25, changeFrequency: 'High' },
    { country: 'China', volatility: 16.4, avgPrice: 76.80, changeFrequency: 'High' }
  ];

  const administrationRoutePriceChanges = [
    { route: 'Oral', avgPrice: 125.50, priceChange: 6.8, volatility: 12.5 },
    { route: 'Intravenous', avgPrice: 245.30, priceChange: 15.2, volatility: 18.7 },
    { route: 'Intramuscular', avgPrice: 198.75, priceChange: 8.9, volatility: 14.3 },
    { route: 'Topical', avgPrice: 89.40, priceChange: 4.2, volatility: 9.8 },
    { route: 'Inhalation', avgPrice: 167.80, priceChange: 12.6, volatility: 16.4 }
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
                  <p className="text-sm font-medium text-gray-500 uppercase tracking-wide dark:text-white/80">{stat.title}</p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
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
          value={selectedDrugType}
          onChange={(e) => setSelectedDrugType(e.target.value)}
          className="bg-white border border-gray-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-gray-500 text-gray-900 dark:bg-black dark:text-white dark:border-white/20"
        >
          {drugTypes.map((type) => (
            <option key={type} value={type}>{type}</option>
          ))}
        </select>

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
          value={selectedArea}
          onChange={(e) => setSelectedArea(e.target.value)}
          className="bg-white border border-gray-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-gray-500 text-gray-900 dark:bg-black dark:text-white dark:border-white/20"
        >
          {areas.map((area) => (
            <option key={area} value={area}>{area}</option>
          ))}
        </select>

        <select
          value={selectedPriceRange}
          onChange={(e) => setSelectedPriceRange(e.target.value)}
          className="bg-white border border-gray-200 rounded-lg px-2 py-2 focus:outline-none focus:ring-2 focus:ring-gray-500 text-gray-900 dark:bg-black dark:text-white dark:border-white/20"
        >
          {priceRanges.map((range) => (
            <option key={range} value={range}>{range}</option>
          ))}
        </select>

        <select
          value={selectedChangeStatus}
          onChange={(e) => setSelectedChangeStatus(e.target.value)}
          className="bg-white border border-gray-200 rounded-lg px-2 py-2 focus:outline-none focus:ring-2 focus:ring-gray-500 text-gray-900 dark:bg-black dark:text-white dark:border-white/20"
        >
          {changeStatuses.map((status) => (
            <option key={status} value={status}>{status}</option>
          ))}
        </select>

        <button className="bg-gray-800 text-white px-6 py-2 rounded-lg hover:bg-gray-700 transition-colors font-medium dark:bg-white/10 dark:hover:bg-white/20">
          Apply Filters
        </button>
        </div>
      </div>

      {/* Charts Grid - Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Price Trends */}
        <div className="group relative overflow-hidden bg-white p-6 rounded-lg shadow-sm text-gray-900 border border-gray-200 dark:bg-black dark:border-white/20 dark:text-white transition-shadow duration-300 ease-out dark:hover:shadow-[0_10px_25px_-3px_rgba(255,255,255,0.15),0_4px_6px_-4px_rgba(255,255,255,0.15)]">
          <div className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 dark:from-white/5 dark:via-white/0 dark:to-white/5 bg-gradient-to-br hidden dark:block"></div>
          <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Price Trends Over Time</h3>
          <div className="h-80">
            
          </div>
        </div>

        {/* Category Price Changes */}
        <div className="group relative overflow-hidden bg-white p-6 rounded-lg shadow-sm text-gray-900 border border-gray-200 dark:bg-black dark:border-white/20 dark:text-white transition-shadow duration-300 ease-out dark:hover:shadow-[0_10px_25px_-3px_rgba(255,255,255,0.15),0_4px_6px_-4px_rgba(255,255,255,0.15)]">
          <div className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 dark:from-white/5 dark:via-white/0 dark:to-white/5 bg-gradient-to-br hidden dark:block"></div>
          <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Category Price Changes</h3>
          <div className="h-80">
            
          </div>
        </div>
      </div>

      {/* Charts Grid - Row 2 (New Missing Sections) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Price Change Status Distribution */}
        <div className="group relative overflow-hidden bg-white p-6 rounded-lg shadow-sm text-gray-900 border border-gray-200 dark:bg-black dark:border-white/20 dark:text-white transition-shadow duration-300 ease-out dark:hover:shadow-[0_10px_25px_-3px_rgba(255,255,255,0.15),0_4px_6px_-4px_rgba(255,255,255,0.15)]">
          <div className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 dark:from-white/5 dark:via-white/0 dark:to-white/5 bg-gradient-to-br hidden dark:block"></div>
          <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Price Change Status Distribution</h3>
          <div className="h-80">
            
          </div>
        </div>

        {/* Average Days Analysis */}
        <div className="group relative overflow-hidden bg-white p-6 rounded-lg shadow-sm text-gray-900 border border-gray-200 dark:bg-black dark:border-white/20 dark:text-white transition-shadow duration-300 ease-out dark:hover:shadow-[0_10px_25px_-3px_rgba(255,255,255,0.15),0_4px_6px_-4px_rgba(255,255,255,0.15)]">
          <div className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 dark:from-white/5 dark:via-white/0 dark:to-white/5 bg-gradient-to-br hidden dark:block"></div>
          <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Average Days Between Price Changes</h3>
          <div className="h-80">
            
          </div>
        </div>
      </div>

      {/* Charts Grid - Row 3 (More Missing Sections) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Price Volatility by Country */}
        <div className="group relative overflow-hidden bg-white p-6 rounded-lg shadow-sm text-gray-900 border border-gray-200 dark:bg-black dark:border-white/20 dark:text-white transition-shadow duration-300 ease-out dark:hover:shadow-[0_10px_25px_-3px_rgba(255,255,255,0.15),0_4px_6px_-4px_rgba(255,255,255,0.15)]">
          <div className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 dark:from-white/5 dark:via-white/0 dark:to-white/5 bg-gradient-to-br hidden dark:block"></div>
          <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Price Volatility by Country</h3>
          <div className="h-80">
            
          </div>
        </div>

        {/* Administration Route Price Changes */}
        <div className="group relative overflow-hidden bg-white p-6 rounded-lg shadow-sm text-gray-900 border border-gray-200 dark:bg-black dark:border-white/20 dark:text-white transition-shadow duration-300 ease-out dark:hover:shadow-[0_10px_25px_-3px_rgba(255,255,255,0.15),0_4px_6px_-4px_rgba(255,255,255,0.15)]">
          <div className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 dark:from-white/5 dark:via-white/0 dark:to-white/5 bg-gradient-to-br hidden dark:block"></div>
          <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Price Changes by Administration Route</h3>
          <div className="h-80">
           
          </div>
        </div>
      </div>

      {/* Charts Grid - Row 4 (Final Missing Sections) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Price vs Volatility Scatter Plot */}
        <div className="group relative overflow-hidden bg-white p-6 rounded-lg shadow-sm text-gray-900 border border-gray-200 dark:bg-black dark:border-white/20 dark:text-white transition-shadow duration-300 ease-out dark:hover:shadow-[0_10px_25px_-3px_rgba(255,255,255,0.15),0_4px_6px_-4px_rgba(255,255,255,0.15)]">
          <div className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 dark:from-white/5 dark:via-white/0 dark:to-white/5 bg-gradient-to-br hidden dark:block"></div>
          <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Price vs Volatility Analysis</h3>
          <div className="h-80">
            
          </div>
        </div>

        {/* Price Change Summary Metrics */}
        <div className="group relative overflow-hidden bg-white p-6 rounded-lg shadow-sm text-gray-900 border border-gray-200 dark:bg-black dark:border-white/20 dark:text-white transition-shadow duration-300 ease-out dark:hover:shadow-[0_10px_25px_-3px_rgba(255,255,255,0.15),0_4px_6px_-4px_rgba(255,255,255,0.15)]">
          <div className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 dark:from-white/5 dark:via-white/0 dark:to-white/5 bg-gradient-to-br hidden dark:block"></div>
          <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Price Change Summary Metrics</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg dark:bg-white/10">
              <span className="text-gray-700 dark:text-white/80">Total Price Changes</span>
              <span className="font-semibold text-gray-900 dark:text-white">2,345</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg dark:bg-white/10">
              <span className="text-gray-700 dark:text-white/80">Average Increase</span>
              <span className="font-semibold text-red-600">+12.5%</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg dark:bg-white/10">
              <span className="text-gray-700 dark:text-white/80">Average Decrease</span>
              <span className="font-semibold text-green-600">-8.3%</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg dark:bg-white/10">
              <span className="text-gray-700 dark:text-white/80">Net Change</span>
              <span className="font-semibold text-blue-600">+3.8%</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg dark:bg-white/10">
              <span className="text-gray-700 dark:text-white/80">Most Volatile Category</span>
              <span className="font-semibold text-gray-900 dark:text-white">Oncology</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg dark:bg-white/10">
              <span className="text-gray-700 dark:text:white/80">Change Frequency</span>
              <span className="font-semibold text-gray-900 dark:text-white">Daily</span>
            </div>
          </div>
        </div>
      </div>
      </div>
    </div>
  );
};

export default PricesPage;
