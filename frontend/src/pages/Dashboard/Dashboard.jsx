import React from 'react';
import { Routes, Route, useNavigate, useLocation, Navigate } from 'react-router-dom';
import { IconPills, IconChartBar, IconCurrencyDollar, IconTrendingUp, IconGlobe, IconPackage, IconRoute, IconBuilding } from '@tabler/icons-react';
import FloatingDock from '../../components/FloatingDock';
import ThemeToggle from '../../components/ThemeToggle';
import MedicinesPage from './pages/MedicinesPage.jsx';
import RevenuePage from './pages/RevenuePage.jsx';
import PricesPage from './pages/PricesPage.jsx';
import medicine from '../../images/medicine.png';

const Dashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const navigationItems = [
    {
      title: 'Medicines',
      href: '/dashboard/medicines',
      icon: <img src={medicine} alt="Medicines" className="w-full h-full object-contain" />,
      onClick: () => navigate('/dashboard/medicines')
    },
    {
      title: 'Revenue',
      href: '/dashboard/revenue',
      icon: <IconChartBar />,
      onClick: () => navigate('/dashboard/revenue')
    },
    {
      title: 'Prices',
      href: '/dashboard/prices',
      icon: <IconCurrencyDollar />,
      onClick: () => navigate('/dashboard/prices')
    }
  ];

  // Comprehensive overview data
  const overviewStats = [
    { title: 'Total Medicines', value: '2,345', icon: IconPills, color: 'text-blue-500', change: '+5.2%' },
    { title: 'Active Manufacturers', value: '156', icon: IconBuilding, color: 'text-green-500', change: '+2.1%' },
    { title: 'Countries Represented', value: '42', icon: IconGlobe, color: 'text-purple-500', change: '+1.8%' },
    { title: 'Administration Routes', value: '12', icon: IconRoute, color: 'text-indigo-500', change: '+0.5%' },
    { title: 'Pharmaceutical Forms', value: '8', icon: IconPackage, color: 'text-pink-500', change: '+0.3%' },
    { title: 'Total Revenue', value: '$124,592', icon: IconTrendingUp, color: 'text-orange-500', change: '+12.5%' }
  ];

  const recentUpdates = [
    { type: 'Price Change', description: 'Antibiotics category prices increased by 8.5%', time: '2 hours ago', impact: 'High' },
    { type: 'New Medicine', description: '15 new cardiovascular medicines registered', time: '4 hours ago', impact: 'Medium' },
    { type: 'Manufacturer Update', description: 'New manufacturer from Switzerland added', time: '6 hours ago', impact: 'Low' },
    { type: 'Revenue Milestone', description: 'Monthly revenue target exceeded by 15%', time: '1 day ago', impact: 'High' }
  ];

  const topPerformers = [
    { name: 'Pfizer', metric: 'Revenue', value: '$18,500', change: '+12.3%' },
    { name: 'Novartis', metric: 'Medicines', value: '38', change: '+8.7%' },
    { name: 'Switzerland', metric: 'Avg Price', value: '$245.50', change: '+15.2%' },
    { name: 'Oral Route', metric: 'Market Share', value: '41.7%', change: '+2.1%' }
  ];

  // Dashboard Overview Component
  const DashboardOverview = () => (
    <>
      {/* Cross-Sectional Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Recent Updates */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 dark:bg-gray-900 dark:border-gray-800">
          <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">Recent Updates</h3>
          <div className="space-y-3">
            {recentUpdates.map((update, index) => (
              <div key={index} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg dark:bg-gray-800">
                <div className={`w-2 h-2 rounded-full mt-2 ${
                  update.impact === 'High' ? 'bg-red-500' : 
                  update.impact === 'Medium' ? 'bg-yellow-500' : 'bg-green-500'
                }`}></div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-900 dark:text-white">{update.type}</span>
                    <span className="text-xs text-gray-500 dark:text-white/60">{update.time}</span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1 dark:text-white/80">{update.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Performers */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 dark:bg-black dark:border-white/20">
          <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Top Performers</h3>
          <div className="space-y-3">
            {topPerformers.map((performer, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg dark:bg-white/10">
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">{performer.name}</p>
                  <p className="text-xs text-gray-600 dark:text-white/70">{performer.metric}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-gray-900 dark:text-white">{performer.value}</p>
                  <p className="text-xs text-green-600 dark:text-green-400">{performer.change}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-100">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button 
            onClick={() => navigate('/dashboard/medicines')}
            className="bg-blue-600 text-white p-4 rounded-lg hover:bg-blue-700 transition-colors text-center"
          >
            <IconPills className="w-8 h-8 mx-auto mb-2" />
            <p className="font-medium">Analyze Medicines</p>
          </button>
          <button 
            onClick={() => navigate('/dashboard/revenue')}
            className="bg-green-600 text-white p-4 rounded-lg hover:bg-green-700 transition-colors text-center"
          >
            <IconChartBar className="w-8 h-8 mx-auto mb-2" />
            <p className="font-medium">View Revenue</p>
          </button>
          <button 
            onClick={() => navigate('/dashboard/prices')}
            className="bg-purple-600 text-white p-4 rounded-lg hover:bg-purple-700 transition-colors text-center"
          >
            <IconCurrencyDollar className="w-8 h-8 mx-auto mb-2" />
            <p className="font-medium">Check Prices</p>
          </button>
        </div>
      </div>
    </>
  );

  return (
    <div className="min-h-screen text-gray-900 dark:text-gray-100">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <ThemeToggle />
        </div>

        <Routes>
          <Route path="/" element={<Navigate to="/dashboard/medicines" replace />} />
          <Route path="medicines" element={<MedicinesPage />} />
          <Route path="revenue" element={<RevenuePage />} />
          <Route path="prices" element={<PricesPage />} />
        </Routes>

        <FloatingDock
          navigationItems={navigationItems}
          activeItem={location.pathname}
        />
      </div>
    </div>
  );
};

export default Dashboard;