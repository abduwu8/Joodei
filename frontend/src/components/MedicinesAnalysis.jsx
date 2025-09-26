import React, { useState } from 'react'
import { BarChart } from '@mui/x-charts'
import { Box } from '@mui/material'
import { ResponsivePie } from '@nivo/pie'
import { useMedicineData } from '../hooks/useMedicineData'

// Filter options based on your API
const filterOptions = {
  drugTypes: ['All', 'Generic', 'NCE', 'Biological', 'Radiopharmaceutical'],
  manufactureCountries: ['All', 'Saudi Arabia', 'USA', 'Germany', 'UK', 'France', 'Switzerland', 'India'],
  pharmaceuticalForms: ['All', 'Tablet', 'Capsule', 'Syrup', 'Injection', 'Cream', 'Film coated Tablet'],
  distributeAreas: ['All', 'Pharmacy', 'Hospital'],
  legalStatuses: ['All', 'Prescription', 'OTC'],
  authorizationStatuses: ['All', 'valid', 'conditional approval', 'suspended'],
  productControls: ['All', 'Controlled', 'Non-controlled'],
  shelfLives: ['All', '1-2 years', '2-3 years', '3-5 years', '5+ years']
}

const MedicinesAnalysis = () => {
  // Filter states
  const [selectedDrugType, setSelectedDrugType] = useState('All')
  const [selectedCountry, setSelectedCountry] = useState('All')
  const [selectedArea, setSelectedArea] = useState('All')
  const [selectedLegalStatus, setSelectedLegalStatus] = useState('All')
  const [selectedAuthStatus, setSelectedAuthStatus] = useState('All')

  // Build filters object for API
  const filters = {
    drugtype: selectedDrugType !== 'All' ? [selectedDrugType] : undefined,
    manufacture_country: selectedCountry !== 'All' ? [selectedCountry] : undefined,
    distribute_area: selectedArea !== 'All' ? [selectedArea] : undefined,
    legal_status: selectedLegalStatus !== 'All' ? [selectedLegalStatus] : undefined,
    authorization_status: selectedAuthStatus !== 'All' ? [selectedAuthStatus] : undefined
  }

  // Fetch data from API
  const { data, loading, error } = useMedicineData(filters)

  if (loading) {
    return (
      <div className="text-white flex items-center justify-center h-64">
        <div className="text-lg">Loading medicine data...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-white flex items-center justify-center h-64">
        <div className="text-lg text-red-400">Error loading data: {error}</div>
      </div>
    )
  }

  if (!data) {
    return (
      <div className="text-white flex items-center justify-center h-64">
        <div className="text-lg">No data available</div>
      </div>
    )
  }

  return (
    <div className="text-white">
      {/* Filters Row */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 mb-6">
        {/* Drug Type Filter */}
        <div>
          <label className="block text-sm font-medium mb-2">Drug Type</label>
          <select
            value={selectedDrugType}
            onChange={(e) => setSelectedDrugType(e.target.value)}
            className="w-full p-3 bg-white text-gray-800 rounded border-2 border-[#B2EBF2] focus:border-[#01697E] focus:outline-none focus:ring-2 focus:ring-[#01697E] focus:ring-opacity-20"
          >
            {filterOptions.drugTypes.map((type) => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </div>

        {/* Country Filter */}
        <div>
          <label className="block text-sm font-medium mb-2">Country</label>
          <select
            value={selectedCountry}
            onChange={(e) => setSelectedCountry(e.target.value)}
            className="w-full p-3 bg-white text-gray-800 rounded border-2 border-[#B2EBF2] focus:border-[#01697E] focus:outline-none focus:ring-2 focus:ring-[#01697E] focus:ring-opacity-20"
          >
            {filterOptions.manufactureCountries.map((country) => (
              <option key={country} value={country}>{country}</option>
            ))}
          </select>
        </div>

        {/* Area Filter */}
        <div>
          <label className="block text-sm font-medium mb-2">Distribution Area</label>
          <select
            value={selectedArea}
            onChange={(e) => setSelectedArea(e.target.value)}
            className="w-full p-3 bg-white text-gray-800 rounded border-2 border-[#B2EBF2] focus:border-[#01697E] focus:outline-none focus:ring-2 focus:ring-[#01697E] focus:ring-opacity-20"
          >
            {filterOptions.distributeAreas.map((area) => (
              <option key={area} value={area}>{area}</option>
            ))}
          </select>
        </div>

        {/* Legal Status Filter */}
        <div>
          <label className="block text-sm font-medium mb-2">Legal Status</label>
          <select
            value={selectedLegalStatus}
            onChange={(e) => setSelectedLegalStatus(e.target.value)}
            className="w-full p-3 bg-white text-gray-800 rounded border-2 border-[#B2EBF2] focus:border-[#01697E] focus:outline-none focus:ring-2 focus:ring-[#01697E] focus:ring-opacity-20"
          >
            {filterOptions.legalStatuses.map((status) => (
              <option key={status} value={status}>{status}</option>
            ))}
          </select>
        </div>

        {/* Authorization Status Filter */}
        <div>
          <label className="block text-sm font-medium mb-2">Authorization</label>
          <select
            value={selectedAuthStatus}
            onChange={(e) => setSelectedAuthStatus(e.target.value)}
            className="w-full p-3 bg-white text-gray-800 rounded border-2 border-[#B2EBF2] focus:border-[#01697E] focus:outline-none focus:ring-2 focus:ring-[#01697E] focus:ring-opacity-20"
          >
            {filterOptions.authorizationStatuses.map((status) => (
              <option key={status} value={status}>{status}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Stats Cards Row */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mb-6">

        <div className="bg-[#1f2d3a] border-2 border-[#00B8D9] rounded-lg p-4 text-center shadow-lg">
          <h3 className="text-lg font-semibold mb-2">Total Medicines</h3>
          <p className="text-2xl font-bold text-[#00B8D9]">
            {data.metrics?.total_medicines?.toLocaleString() || '—'}
          </p>
        </div>

        <div className="bg-[#1f2d3a] border-2 border-[#00B8D9] rounded-lg p-4 text-center shadow-lg">
          <h3 className="text-lg font-semibold mb-2">Scientific Names</h3>
          <p className="text-2xl font-bold text-[#00B8D9]">
            {data.metrics?.total_scientific_name?.toLocaleString() || '—'}
          </p>
        </div>

        <div className="bg-[#1f2d3a] border-2 border-[#00B8D9] rounded-lg p-4 text-center shadow-lg">
          <h3 className="text-lg font-semibold mb-2">Manufacturers</h3>
          <p className="text-2xl font-bold text-[#00B8D9]">
            {data.metrics?.total_manufacture_name?.toLocaleString() || '—'}
          </p>
        </div>

        <div className="bg-[#1f2d3a] border-2 border-[#00B8D9] rounded-lg p-4 text-center shadow-lg">
          <h3 className="text-lg font-semibold mb-2">Countries</h3>
          <p className="text-2xl font-bold text-[#00B8D9]">
            {data.metrics?.total_manufacture_country?.toLocaleString() || '—'}
          </p>
        </div>
      </div>

      {/* Row for donut charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Distribution Area Chart */}
        <div className="bg-[#1f2d3a] border-2 border-[#00B8D9] rounded-lg p-4 shadow-lg">
          <h4 className="text-lg font-semibold mb-4 text-center">Distribution by Area</h4>
          <div style={{ width: '100%', height: 300 }}>
            <ResponsivePie
              data={data.distributionArea || []}
              margin={{ top: 40, right: 80, bottom: 80, left: 80 }}
              innerRadius={0.5}
              padAngle={0.6}
              cornerRadius={2}
              activeOuterRadiusOffset={8}
              colors={['#FBBF24', '#35B48F', '#1883AA', '#1E40AF', '#89AB56']}
              borderWidth={1}
              borderColor={{
                from: 'color',
                modifiers: [['darker', 0.2]]
              }}
              arcLinkLabelsSkipAngle={10}
              arcLinkLabelsTextColor="#e5e7eb"
              arcLinkLabelsThickness={2}
              arcLinkLabelsColor={{ from: 'color' }}
              arcLabelsSkipAngle={10}
              arcLabelsTextColor={{
                from: 'color',
                modifiers: [['darker', 2]]
              }}
              enableArcLabels={true}
              arcLabel={(d) => `${d.value.toLocaleString()}`}
              tooltip={({ datum }) => (
                <div
                  style={{
                    background: 'rgba(15,23,42,0.95)',
                    padding: '12px',
                    borderRadius: '8px',
                    border: '1px solid #1f2937',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                    color: '#e5e7eb',
                    fontSize: '14px',
                    fontFamily: 'Inter, system-ui, sans-serif'
                  }}
                >
                  <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>
                    {datum.label}
                  </div>
                  <div>
                    Value: <strong>{datum.value.toLocaleString()}</strong>
                  </div>
                </div>
              )}
              legends={[
                {
                  anchor: 'bottom',
                  direction: 'row',
                  translateY: 56,
                  itemWidth: 100,
                  itemHeight: 18,
                  itemTextColor: '#e5e7eb',
                  symbolShape: 'circle',
                  symbolSize: 12,
                  effects: [
                    {
                      on: 'hover',
                      style: {
                        itemTextColor: '#ffffff'
                      }
                    }
                  ]
                }
              ]}
              motionConfig="gentle"
              transitionMode="startAngle"
              animate={true}
            />
          </div>
        </div>

        {/* Continent Distribution */}
        <div className="bg-[#1f2d3a] border-2 border-[#00B8D9] rounded-lg p-4 shadow-lg">
          <h4 className="text-lg font-semibold mb-4 text-center">Continent Distribution</h4>
          <div style={{ width: '100%', height: 300 }}>
            <ResponsivePie
              data={data.continentDistribution || []}
              margin={{ top: 40, right: 80, bottom: 80, left: 80 }}
              innerRadius={0.5}
              padAngle={0.6}
              cornerRadius={2}
              activeOuterRadiusOffset={8}
              colors={['#FBBF24', '#35B48F', '#1883AA', '#1E40AF', '#89AB56']}
              borderWidth={1}
              borderColor={{
                from: 'color',
                modifiers: [['darker', 0.2]]
              }}
              arcLinkLabelsSkipAngle={10}
              arcLinkLabelsTextColor="#e5e7eb"
              arcLinkLabelsThickness={2}
              arcLinkLabelsColor={{ from: 'color' }}
              arcLabelsSkipAngle={10}
              arcLabelsTextColor={{
                from: 'color',
                modifiers: [['darker', 2]]
              }}
              enableArcLabels={true}
              arcLabel={(d) => `${d.value.toLocaleString()}`}
              tooltip={({ datum }) => (
                <div
                  style={{
                    background: 'rgba(15,23,42,0.95)',
                    padding: '12px',
                    borderRadius: '8px',
                    border: '1px solid #1f2937',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                    color: '#e5e7eb',
                    fontSize: '14px',
                    fontFamily: 'Inter, system-ui, sans-serif'
                  }}
                >
                  <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>
                    {datum.label}
                  </div>
                  <div>
                    Value: <strong>{datum.value.toLocaleString()}</strong>
                  </div>
                </div>
              )}
              legends={[
                {
                  anchor: 'bottom',
                  direction: 'row',
                  translateY: 56,
                  itemWidth: 100,
                  itemHeight: 18,
                  itemTextColor: '#e5e7eb',
                  symbolShape: 'circle',
                  symbolSize: 12,
                  effects: [
                    {
                      on: 'hover',
                      style: {
                        itemTextColor: '#ffffff'
                      }
                    }
                  ]
                }
              ]}
              motionConfig="gentle"
              transitionMode="startAngle"
              animate={true}
            />
          </div>
        </div>
      </div>

      {/* Row for horizontal bar charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Countries */}
        <div className="bg-[#1f2d3a] border-2 border-[#00B8D9] rounded-lg p-4 shadow-lg">
          <h4 className="text-lg font-semibold mb-4 text-center">Top 10 Countries by Medicines</h4>
          <div className="h-[400px] overflow-y-auto">
            <Box sx={{ width: '100%', height: 350 }}>
              <BarChart
                height={350}
                xAxis={[{ data: data.topCountries?.map(d => d.name) || [], scaleType: 'band' }]}
                series={[{ 
                  data: data.topCountries?.map(d => d.value) || [], 
                  color: '#00B8D9', 
                  label: 'Medicines Count' 
                }]}
                grid={{ vertical: true, horizontal: true }}
              />
            </Box>
          </div>
        </div>

        {/* Top Pharmaceutical Forms */}
        <div className="bg-[#1f2d3a] border-2 border-[#00B8D9] rounded-lg p-4 shadow-lg">
          <h4 className="text-lg font-semibold mb-4 text-center">Top 5 Pharmaceutical Forms</h4>
          <div className="h-[400px] overflow-y-auto">
            <Box sx={{ width: '100%', height: 350 }}>
              <BarChart
                height={350}
                xAxis={[{ data: data.pharmaceuticalForms?.map(d => d.name) || [], scaleType: 'band' }]}
                series={[{ 
                  data: data.pharmaceuticalForms?.map(d => d.value) || [], 
                  color: '#00B8D9', 
                  label: 'Count' 
                }]}
                grid={{ vertical: true, horizontal: true }}
              />
            </Box>
          </div>
        </div>
      </div>

      {/* Additional Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        {/* Administration Routes */}
        <div className="bg-[#1f2d3a] border-2 border-[#00B8D9] rounded-lg p-4 shadow-lg">
          <h4 className="text-lg font-semibold mb-4 text-center">Top Administration Routes</h4>
          <div className="h-[400px] overflow-y-auto">
            <Box sx={{ width: '100%', height: 350 }}>
              <BarChart
                height={350}
                xAxis={[{ data: data.administrationRoutes?.map(d => d.name) || [], scaleType: 'band' }]}
                series={[{ 
                  data: data.administrationRoutes?.map(d => d.value) || [], 
                  color: '#2CCFB2', 
                  label: 'Count' 
                }]}
                grid={{ vertical: true, horizontal: true }}
              />
            </Box>
          </div>
        </div>

        {/* Top Manufacturers */}
        <div className="bg-[#1f2d3a] border-2 border-[#00B8D9] rounded-lg p-4 shadow-lg">
          <h4 className="text-lg font-semibold mb-4 text-center">Top 10 Manufacturers</h4>
          <div className="h-[400px] overflow-y-auto">
            <Box sx={{ width: '100%', height: 350 }}>
              <BarChart
                height={350}
                xAxis={[{ data: data.topManufacturers?.map(d => d.name) || [], scaleType: 'band' }]}
                series={[{ 
                  data: data.topManufacturers?.map(d => d.value) || [], 
                  color: '#4CB8F6', 
                  label: 'Medicines Count' 
                }]}
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
