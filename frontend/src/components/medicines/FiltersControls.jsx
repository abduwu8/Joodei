import React from 'react';

// FiltersControls: renders the seven select filters used on Medicines page
// API mapping: values map to backend params (drugtype, country, area, route, form, status, shelflife)
// Parent owns state; this component is purely presentational.

const FiltersControls = ({
  selectedDrugType,
  setSelectedDrugType,
  selectedCountry,
  setSelectedCountry,
  selectedArea,
  setSelectedArea,
  selectedRoute,
  setSelectedRoute,
  selectedForm,
  setSelectedForm,
  selectedStatus,
  setSelectedStatus,
  selectedShelfLife,
  setSelectedShelfLife,
  drugTypes,
  countries,
  areas,
  routes,
  forms,
  statuses,
  shelfLives,
  isDark
}) => {
  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-[0_1px_3px_0_rgb(0,0,0,0.1),0_1px_2px_-1px_rgb(0,0,0,0.1)] border border-gray-100/50 dark:bg-white/5 dark:border-white/10">
      {/* UI: Filters & Controls section */}
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
  );
};

export default FiltersControls;


