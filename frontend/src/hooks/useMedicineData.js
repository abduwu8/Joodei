import { useState, useEffect } from 'react';
import { fetchMedicineKPI, transformApiData } from '../services/medicineApi';

export const useMedicineData = (filters = {}) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();

    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const apiData = await fetchMedicineKPI(filters);
        
        if (isMounted) {
          // Transform all the data for different chart types
          const transformedData = {
            // Raw API response
            raw: apiData,
            
            // KPI Metrics
            metrics: apiData.metrics,
            meta: apiData.meta,
            
            // Chart data (transformed)
            distributionArea: transformApiData.forPieChart(apiData, 'total_medicine_by_distribute_area'),
            pharmaceuticalForms: transformApiData.forBarChart(apiData, 'top_5_pharmaceuticalform'),
            topCountries: transformApiData.forBarChart(apiData, 'top_10_countries_by_medicines'),
            monthlyData: transformApiData.forLineChart(apiData, 'medicine_by_month'),
            administrationRoutes: transformApiData.forBarChart(apiData, 'administration_route_by_medicine'),
            topManufacturers: transformApiData.forBarChart(apiData, 'manufacture_name_by_meddicine'),
            administrationAreaChart: transformApiData.forAreaChart(apiData, 'administration_area_chart_top_10'),
            countryDistribution: transformApiData.forGlobalMap(apiData, 'country_distribution_analysis_top_10'),
            continentDistribution: transformApiData.forPieChart(apiData, 'continent_distribution_analysis_top_10')
          };
          
          setData(transformedData);
        }
      } catch (err) {
        if (isMounted) {
          setError(err.message);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadData();

    return () => {
      isMounted = false;
      controller.abort();
    };
  }, [JSON.stringify(filters)]); // Re-fetch when filters change

  return { data, loading, error };
};