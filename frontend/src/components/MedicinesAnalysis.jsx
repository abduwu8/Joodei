import React, { useState } from 'react'
import { BarChart, PieChart } from '@mui/x-charts'
import { Box } from '@mui/material'

// Mock data - replace with actual data from backend
const mockData = {
  drugTypes: ['Antibiotic', 'Painkiller', 'Vitamin', 'Antihistamine'],
  manufactureCountries: ['Saudi Arabia', 'USA', 'Germany', 'UK', 'France'],
  pharmaceuticalForms: ['Tablet', 'Capsule', 'Syrup', 'Injection', 'Cream'],
  distributeAreas: ['Riyadh', 'Jeddah', 'Dammam', 'Mecca', 'Medina']
}

const MedicinesAnalysis = () => {
  const [selectedDrugType, setSelectedDrugType] = useState('')

  // Mock chart data
  const drugTypeData = [
    { name: 'Antibiotic', value: 35, color: '#00B8D9' },
    { name: 'Painkiller', value: 25, color: '#01697E' },
    { name: 'Vitamin', value: 20, color: '#5EC6D9' },
    { name: 'Antihistamine', value: 20, color: '#3896A6' }
  ]

  const distributeAreaData = [
    { name: 'Riyadh', value: 40, color: '#00B8D9' },
    { name: 'Jeddah', value: 30, color: '#01697E' },
    { name: 'Dammam', value: 20, color: '#5EC6D9' },
    { name: 'Mecca', value: 10, color: '#3896A6' }
  ]

  const manufactureCountryData = [
    { name: 'Saudi Arabia', value: 45 },
    { name: 'USA', value: 25 },
    { name: 'Germany', value: 20 },
    { name: 'UK', value: 10 }
  ]

  const pharmaceuticalFormData = [
    { name: 'Tablet', value: 50 },
    { name: 'Capsule', value: 25 },
    { name: 'Syrup', value: 15 },
    { name: 'Injection', value: 10 }
  ]

  return (
    <div className="text-white">
      {/* Top row with dropdown and stats cards */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 mb-6">
        {/* Drug Type Dropdown */}
        <div className="lg:col-span-3">
          <select
            value={selectedDrugType}
            onChange={(e) => setSelectedDrugType(e.target.value)}
            className="w-full p-3 bg-white text-gray-800 rounded border-2 border-[#B2EBF2] focus:border-[#01697E] focus:outline-none focus:ring-2 focus:ring-[#01697E] focus:ring-opacity-20 font-['Open_Sans']"
          >
            <option value="">Select Drug Type</option>
            {mockData.drugTypes.map((type) => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </div>

        {/* Stats Cards */}
        <div className="lg:col-span-2">
          <div className="bg-[#1f2d3a] border-2 border-[#00B8D9] rounded-lg p-4 h-full text-center shadow-lg">
            <h3 className="text-lg font-semibold mb-2">Total Medicines</h3>
            <p className="text-2xl font-bold text-[#00B8D9]">1,247</p>
          </div>
        </div>

        <div className="lg:col-span-2">
          <div className="bg-[#1f2d3a] border-2 border-[#00B8D9] rounded-lg p-4 h-full text-center shadow-lg">
            <h3 className="text-lg font-semibold mb-2">Scientific Names</h3>
            <p className="text-2xl font-bold text-[#00B8D9]">892</p>
          </div>
        </div>

        <div className="lg:col-span-2">
          <div className="bg-[#1f2d3a] border-2 border-[#00B8D9] rounded-lg p-4 h-full text-center shadow-lg">
            <h3 className="text-lg font-semibold mb-2">Manufacturers</h3>
            <p className="text-2xl font-bold text-[#00B8D9]">156</p>
          </div>
        </div>

        <div className="lg:col-span-3">
          <div className="bg-[#1f2d3a] border-2 border-[#00B8D9] rounded-lg p-4 h-full text-center shadow-lg">
            <h3 className="text-lg font-semibold mb-2">Manufacturing Countries</h3>
            <p className="text-2xl font-bold text-[#00B8D9]">23</p>
          </div>
        </div>
      </div>

      {/* Row for donut charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Drug Type Distribution */}
        <div className="bg-[#1f2d3a] border-2 border-[#00B8D9] rounded-lg p-4 shadow-lg">
          <h4 className="text-lg font-semibold mb-4 text-center">Drug Type Distribution</h4>
          <Box sx={{ width: '100%', height: 300 }}>
            <PieChart
              height={300}
              series={[
                {
                  data: drugTypeData.map(d => ({ id: d.name, value: d.value, label: d.name })),
                  innerRadius: 60,
                  outerRadius: 100,
                },
              ]}
            />
          </Box>
        </div>

        {/* Distribute Area Distribution */}
        <div className="bg-[#1f2d3a] border-2 border-[#00B8D9] rounded-lg p-4 shadow-lg">
          <h4 className="text-lg font-semibold mb-4 text-center">Distribution Area</h4>
          <Box sx={{ width: '100%', height: 300 }}>
            <PieChart
              height={300}
              series={[
                {
                  data: distributeAreaData.map(d => ({ id: d.name, value: d.value, label: d.name })),
                  innerRadius: 60,
                  outerRadius: 100,
                },
              ]}
            />
          </Box>
        </div>
      </div>

      {/* Row for horizontal bar charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Total Medicines by Manufacture Country */}
        <div className="bg-[#1f2d3a] border-2 border-[#00B8D9] rounded-lg p-4 shadow-lg">
          <h4 className="text-lg font-semibold mb-4 text-center">Total Medicines by Manufacture Country</h4>
          <div className="h-[400px] overflow-y-auto">
            <Box sx={{ width: '100%', height: 350 }}>
              <BarChart
                height={350}
                xAxis={[{ data: manufactureCountryData.map(d => d.name), scaleType: 'band' }]}
                series={[{ data: manufactureCountryData.map(d => d.value), color: '#00B8D9', label: 'Count' }]}
                grid={{ vertical: true, horizontal: true }}
              />
            </Box>
          </div>
        </div>

        {/* Total Medicines by Pharmaceutical Form */}
        <div className="bg-[#1f2d3a] border-2 border-[#00B8D9] rounded-lg p-4 shadow-lg">
          <h4 className="text-lg font-semibold mb-4 text-center">Total Medicines by Pharmaceutical Form</h4>
          <div className="h-[400px] overflow-y-auto">
            <Box sx={{ width: '100%', height: 350 }}>
              <BarChart
                height={350}
                xAxis={[{ data: pharmaceuticalFormData.map(d => d.name), scaleType: 'band' }]}
                series={[{ data: pharmaceuticalFormData.map(d => d.value), color: '#00B8D9', label: 'Count' }]}
                grid={{ vertical: true, horizontal: true }}
              />
            </Box>
          </div>
        </div>
      </div>
    </div>
  )
}

export default MedicinesAnalysis
