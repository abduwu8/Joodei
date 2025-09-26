import React from 'react';

// ✅ IMPLEMENTED: FiltersControls with ALL backend filters
// Renders 8 active filters: country, area, route, form, legal_status, product_control, authorization_status, shelflife
// API mapping: values map to backend params (manufacture_country, distribute_area, administrationroute, pharmaceuticalform, legal_status, product_control, authorization_status, shelflife)
// Parent owns state; this component is purely presentational.

const FiltersControls = ({
  selectedCountry,
  setSelectedCountry,
  selectedArea,
  setSelectedArea,
  selectedRoute,
  setSelectedRoute,
  selectedForm,
  setSelectedForm,
  selectedLegalStatus,
  setSelectedLegalStatus,
  selectedProductControl,
  setSelectedProductControl,
  selectedAuthorizationStatus,
  setSelectedAuthorizationStatus,
  selectedShelfLife,
  setSelectedShelfLife,
  countries,
  areas,
  routes,
  forms,
  legalStatuses,
  productControls,
  authorizationStatuses,
  shelfLives,
  isDark
}) => {
  const selectClassName = "w-full bg-white/80 backdrop-blur-sm border border-gray-200 rounded-lg px-3 md:px-4 py-2 text-sm md:text-base focus:outline-none focus:ring-2 focus:ring-gray-500 text-gray-900 dark:bg-white/5 dark:text-white dark:border-white/10 [&>option]:bg-white [&>option]:text-gray-900 dark:[&>option]:bg-gray-800 dark:[&>option]:text-white";
  const labelClassName = "text-xs md:text-sm font-medium text-gray-700 dark:text-gray-300";

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 md:p-6 shadow-[0_1px_3px_0_rgb(0,0,0,0.1),0_1px_2px_-1px_rgb(0,0,0,0.1)] border border-gray-100/50 dark:bg-white/5 dark:border-white/10">
      {/* UI: Filters & Controls section */}
      <h3 className="text-base md:text-lg font-semibold text-gray-900 mb-3 md:mb-4 dark:text-white">Filters & Controls</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-3 md:gap-4">
        {/* Row 1: Basic Filters */}
        <div className="space-y-2">
          <label className={labelClassName}>Country</label>
          <select value={selectedCountry} onChange={(e) => setSelectedCountry(e.target.value)} className={selectClassName}>
            {countries.map((x) => <option key={x} value={x}>{x}</option>)}
          </select>
        </div>
        <div className="space-y-2">
          <label className={labelClassName}>Area</label>
          <select value={selectedArea} onChange={(e) => setSelectedArea(e.target.value)} className={selectClassName}>
            {areas.map((x) => <option key={x} value={x}>{x}</option>)}
          </select>
        </div>
        <div className="space-y-2">
          <label className={labelClassName}>Route</label>
          <select value={selectedRoute} onChange={(e) => setSelectedRoute(e.target.value)} className={selectClassName}>
            {routes.map((x) => <option key={x} value={x}>{x}</option>)}
          </select>
        </div>
        <div className="space-y-2">
          <label className={labelClassName}>Form</label>
          <select value={selectedForm} onChange={(e) => setSelectedForm(e.target.value)} className={selectClassName}>
            {forms.map((x) => <option key={x} value={x}>{x}</option>)}
          </select>
        </div>
        
        {/* Row 2: Status & Control Filters */}
        <div className="space-y-2">
          <label className={labelClassName}>Legal Status</label>
          <select value={selectedLegalStatus} onChange={(e) => setSelectedLegalStatus(e.target.value)} className={selectClassName}>
            {legalStatuses.map((x) => <option key={x} value={x}>{x}</option>)}
          </select>
        </div>
        <div className="space-y-2">
          <label className={labelClassName}>Product Control</label>
          <select value={selectedProductControl} onChange={(e) => setSelectedProductControl(e.target.value)} className={selectClassName}>
            {productControls.map((x) => <option key={x} value={x}>{x}</option>)}
          </select>
        </div>
        <div className="space-y-2">
          <label className={labelClassName}>Authorization</label>
          <select value={selectedAuthorizationStatus} onChange={(e) => setSelectedAuthorizationStatus(e.target.value)} className={selectClassName}>
            {authorizationStatuses.map((x) => <option key={x} value={x}>{x}</option>)}
          </select>
        </div>
        <div className="space-y-2">
          <label className={labelClassName}>Shelf Life</label>
          <select value={selectedShelfLife} onChange={(e) => setSelectedShelfLife(e.target.value)} className={selectClassName}>
            {shelfLives.map((x) => <option key={x} value={x}>{x}</option>)}
          </select>
        </div>
      </div>
    </div>
  );
};

export default FiltersControls;