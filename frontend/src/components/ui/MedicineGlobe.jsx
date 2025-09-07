import React, { useMemo } from 'react';
import { World } from './globe';

// Comprehensive country to lat/lng mapping for real data
export const COUNTRY_COORDS = {
  // Middle East
  'Saudi Arabia': { lat: 24.7136, lng: 46.6753 },
  'United Arab Emirates': { lat: 24.0000, lng: 54.0000 },
  'Kuwait': { lat: 29.3117, lng: 47.4818 },
  'Qatar': { lat: 25.3548, lng: 51.1839 },
  'Oman': { lat: 21.5126, lng: 55.9233 },
  'Jordan': { lat: 30.5852, lng: 36.2384 },
  'Lebanon': { lat: 33.8547, lng: 35.8623 },
  'Egypt': { lat: 26.8206, lng: 30.8025 },
  'Tunisia': { lat: 33.8869, lng: 9.5375 },
  'Morocco': { lat: 31.7917, lng: -7.0926 },
  'South Africa': { lat: -30.5595, lng: 22.9375 },
  
  // Asia
  'India': { lat: 20.5937, lng: 78.9629 },
  'China': { lat: 35.8617, lng: 104.1954 },
  'Japan': { lat: 36.2048, lng: 138.2529 },
  'South Korea': { lat: 35.9078, lng: 127.7669 },
  'KOREA': { lat: 35.9078, lng: 127.7669 }, // Handle both variations
  'Singapore': { lat: 1.3521, lng: 103.8198 },
  'Indonesia': { lat: -0.7893, lng: 113.9213 },
  'Malaysia': { lat: 4.2105, lng: 108.9758 },
  'Taiwan': { lat: 23.6978, lng: 120.9605 },
  
  // Europe
  'Germany': { lat: 51.1657, lng: 10.4515 },
  'United Kingdom': { lat: 55.3781, lng: -3.4360 },
  'France': { lat: 46.2276, lng: 2.2137 },
  'Switzerland': { lat: 46.8182, lng: 8.2275 },
  'Austria': { lat: 47.5162, lng: 14.5501 },
  'Belgium': { lat: 50.8503, lng: 4.3517 },
  'Netherlands': { lat: 52.1326, lng: 5.2913 },
  'Italy': { lat: 41.8719, lng: 12.5674 },
  'Spain': { lat: 40.4637, lng: -3.7492 },
  'Portugal': { lat: 39.3999, lng: -8.2245 },
  'Sweden': { lat: 60.1282, lng: 18.6435 },
  'Norway': { lat: 60.4720, lng: 8.4689 },
  'Denmark': { lat: 56.2639, lng: 9.5018 },
  'Finland': { lat: 61.9241, lng: 25.7482 },
  'Poland': { lat: 51.9194, lng: 19.1451 },
  'Czech Republic': { lat: 49.8175, lng: 15.4730 },
  'Hungary': { lat: 47.1625, lng: 19.5033 },
  'Slovakia': { lat: 48.6690, lng: 19.6990 },
  'Slovenia': { lat: 46.0569, lng: 14.5058 },
  'Croatia': { lat: 45.1000, lng: 15.2000 },
  'Serbia': { lat: 44.0165, lng: 21.0059 },
  'Romania': { lat: 45.9432, lng: 24.9668 },
  'Bulgaria': { lat: 42.7339, lng: 25.4858 },
  'Greece': { lat: 39.0742, lng: 21.8243 },
  'Turkey': { lat: 38.9637, lng: 35.2433 },
  'Cyprus': { lat: 35.1264, lng: 33.4299 },
  'Malta': { lat: 35.9375, lng: 14.3754 },
  'Iceland': { lat: 64.9631, lng: -19.0208 },
  'Ireland': { lat: 53.1424, lng: -7.6921 },
  'Luxembourg': { lat: 49.8153, lng: 6.1296 },
  'Latvia': { lat: 56.8796, lng: 24.6032 },
  'Ukraine': { lat: 48.3794, lng: 31.1656 },
  
  // North America
  'United States': { lat: 37.0902, lng: -95.7129 },
  'Canada': { lat: 56.1304, lng: -106.3468 },
  'Mexico': { lat: 23.6345, lng: -102.5528 },
  'Puerto Rico': { lat: 18.2208, lng: -66.5901 },
  
  // South America
  'Brazil': { lat: -14.2350, lng: -51.9253 },
  'Argentina': { lat: -38.4161, lng: -63.6167 },
  'Chile': { lat: -35.6751, lng: -71.5430 },
  
  // Oceania
  'Australia': { lat: -25.2744, lng: 133.7751 },
  'New Zealand': { lat: -40.9006, lng: 174.8860 },
  
  // Africa
  'Swaziland': { lat: -26.5225, lng: 31.4659 },
};

const COLORS = ['#8DC8D9', '#C5B39C', '#288A9A', '#2CCFB2', '#4CB8F6', '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7'];

function chooseColor(index) {
  return COLORS[index % COLORS.length];
}

export default function MedicineGlobe({ data, autoRotate = true, autoRotateSpeed = 0.5, globeSize = 1.5 }) {
  // data: [{ country: string, count: number }]
  const points = useMemo(() => {
    if (!Array.isArray(data) || data.length === 0) return [];
    
    console.log('Globe data received:', data); // Debug log
    
    const pts = [];
    data.forEach((item, i) => {
      const coords = COUNTRY_COORDS[item.country];
      if (!coords) {
        console.warn(`No coordinates found for country: ${item.country}`);
        return;
      }
      
      // Calculate point size based on count (logarithmic scale for better visualization)
      const baseSize = Math.max(1, Math.min(8, Math.log(item.count + 1) * 2));
      
      // Create multiple points for countries with high medicine counts
      const duplicates = Math.max(1, Math.min(5, Math.round((item.count || 1) / 100)));
      
      for (let k = 0; k < duplicates; k++) {
        // Add slight randomization to prevent overlapping
        const jitter = 0.5;
        const point = { 
          lat: coords.lat + (Math.random() - 0.5) * jitter, 
          lng: coords.lng + (Math.random() - 0.5) * jitter, 
          color: chooseColor(i + k), 
          country: item.country, 
          count: item.count,
          size: baseSize + (k * 0.5)
        };
        pts.push(point);
      }
    });
    
    console.log('Generated points:', pts); // Debug log
    return pts;
  }, [data]);

  // Generate arcs from a central hub to each country
  const arcs = useMemo(() => {
    if (!Array.isArray(data) || data.length === 0) return [];
    
    // Use Saudi Arabia as the central hub since it's the primary market
    const hub = COUNTRY_COORDS['Saudi Arabia'] || { lat: 24.7136, lng: 46.6753 };
    
    return data
      .map((item, i) => {
        const coords = COUNTRY_COORDS[item.country];
        if (!coords) return null;
        
        // Only create arcs for countries with significant medicine counts
        if (item.count < 50) return null;
        
        return {
          startLat: hub.lat,
          startLng: hub.lng,
          endLat: coords.lat,
          endLng: coords.lng,
          arcAlt: 0.3 + (Math.random() * 0.2), // Vary arc height
          color: chooseColor(i),
          weight: Math.min(3, Math.max(1, item.count / 100)), // Arc thickness based on count
        };
      })
      .filter(Boolean);
  }, [data]);

  const globeConfig = {
    pointSize: 4 * globeSize,
    globeColor: '#062056',
    showAtmosphere: true,
    atmosphereColor: '#FFFFFF',
    atmosphereAltitude: 0.1,
    emissive: '#062056',
    emissiveIntensity: 0.1,
    shininess: 0.9,
    polygonColor: '#FFFFFF',
    ambientLight: '#38bdf8',
    directionalLeftLight: '#ffffff',
    directionalTopLight: '#ffffff',
    pointLight: '#ffffff',
    autoRotate,
    autoRotateSpeed,
    globeSize,
  };

  return (
    <div className="relative w-full h-full">
      <World globeConfig={globeConfig} points={points} arcs={arcs} />
    </div>
  );
}


