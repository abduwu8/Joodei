import React from 'react';
import { IconUsers, IconFlag, IconWorld } from '@tabler/icons-react';

const ActiveUsersWidget = () => {
  const countries = [
    { name: 'United States', flag: '🇺🇸', percentage: 50, color: '#8B5CF6' },
    { name: 'India', flag: '🇮🇳', percentage: 30, color: '#8B5CF6' },
    { name: 'United Kingdom', flag: '🇬🇧', percentage: 20, color: '#8B5CF6' },
    { name: 'Australia', flag: '🇦🇺', percentage: 10, color: '#8B5CF6' },
    { name: 'Canada', flag: '🇨🇦', percentage: 10, color: '#8B5CF6' }
  ];

  return (
    <div className="bg-gray-900/95 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50 shadow-xl">
      {/* Header Section */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-white text-lg font-semibold">Active users right now</h3>
        <button className="bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200">
          Real-time report
        </button>
      </div>

      {/* Total Active Users */}
      <div className="mb-6">
        <div className="text-4xl font-bold text-white mb-2">10.8k</div>
        <div className="text-gray-400 text-sm">Total active users</div>
      </div>

      {/* Country Breakdown */}
      <div className="space-y-4 mb-6">
        {countries.map((country, index) => (
          <div key={index} className="flex items-center space-x-3">
            <div className="flex items-center space-x-2 min-w-[120px]">
              <span className="text-lg">{country.flag}</span>
              <span className="text-white text-sm font-medium">{country.name}</span>
            </div>
            <div className="flex-1">
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div 
                  className="h-2 rounded-full transition-all duration-300 ease-out"
                  style={{ 
                    width: `${country.percentage}%`, 
                    backgroundColor: country.color 
                  }}
                />
              </div>
            </div>
            <div className="text-white text-sm font-semibold min-w-[40px] text-right">
              {country.percentage}%
            </div>
          </div>
        ))}
      </div>

      {/* Map Placeholder */}
      <div className="relative">
        <div className="w-full h-32 bg-gray-800/50 rounded-lg border border-gray-700/50 flex items-center justify-center">
          <div className="text-center">
            <IconWorld className="w-8 h-8 text-gray-500 mx-auto mb-2" />
            <p className="text-gray-400 text-sm">Interactive Map Coming Soon</p>
            <p className="text-gray-500 text-xs">Geographic distribution visualization</p>
          </div>
        </div>
        
        {/* Subtle world map outline effect */}
        <div className="absolute inset-0 rounded-lg opacity-10">
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <path 
              d="M20,30 Q30,25 40,30 Q50,35 60,30 Q70,25 80,30 M15,50 Q25,45 35,50 Q45,55 55,50 Q65,45 75,50 M25,70 Q35,65 45,70 Q55,75 65,70 Q75,65 85,70"
              fill="none" 
              stroke="currentColor" 
              strokeWidth="0.5"
              className="text-gray-400"
            />
          </svg>
        </div>
        
        {/* Glowing dot indicator */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <div className="w-3 h-3 bg-purple-500 rounded-full animate-pulse shadow-lg shadow-purple-500/50"></div>
        </div>
      </div>
    </div>
  );
};

export default ActiveUsersWidget;

