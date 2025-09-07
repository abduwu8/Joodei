import React, { useEffect, useRef, useState } from 'react';
import Globe from 'react-globe.gl';

export function World({ globeConfig, points, arcs = [] }) {
  const globeEl = useRef();
  const containerRef = useRef();
  const [countries, setCountries] = useState([]);
  const [hoverPoint, setHoverPoint] = useState(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const waterDataUrl = 'data:image/svg+xml;utf8,' + encodeURIComponent("<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1024 512'><rect width='1024' height='512' fill='#062056'/></svg>");

  // Match reference defaults and allow overrides from globeConfig
  const defaultProps = {
    pointSize: 1,
    atmosphereColor: '#ffffff',
    showAtmosphere: true,
    atmosphereAltitude: 0.1,
    polygonColor: 'rgba(255,255,255,0.7)',
    globeColor: '#1d072e',
    emissive: '#000000',
    emissiveIntensity: 0.1,
    shininess: 0.9,
    arcTime: 2000,
    arcLength: 0.9,
    rings: 1,
    maxRings: 3,
    ...globeConfig,
  };

  useEffect(() => {
    let isMounted = true;
    const loadLocal = () => fetch('/world-countries.json').then((r) => {
      if (!r.ok) throw new Error('local geojson not found');
      return r.json();
    });
    const loadRemote = () => fetch('https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson').then((r) => r.json());
    loadLocal()
      .catch(loadRemote)
      .then((geo) => {
        if (!isMounted) return;
        if (geo && geo.features) setCountries(geo.features);
      })
      .catch(() => {});
    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    if (!globeEl.current) return;
    
    // Add a small delay to ensure Globe is fully initialized
    const timer = setTimeout(() => {
      if (!globeEl.current) return;
      
      const controls = globeEl.current.controls?.();
      if (controls) {
        controls.autoRotate = globeConfig?.autoRotate ?? true;
        controls.autoRotateSpeed = globeConfig?.autoRotateSpeed ?? 0.5;
        controls.enablePan = true;
        controls.enableZoom = true;
        controls.enableRotate = true;
      }
      
      // Center globe and set altitude based on size - larger globe = closer view
      const altitude = globeConfig?.globeSize ? 2.8 / globeConfig.globeSize : 2.8;
      globeEl.current.pointOfView({ lat: 18, lng: 8, altitude }, 0);
      
      // Enable raycaster for mouse interactions with proper null checks
      if (globeEl.current.renderer && 
          globeEl.current.renderer.domElement && 
          globeEl.current.renderer.domElement.style) {
        globeEl.current.renderer.domElement.style.pointerEvents = 'auto';
        console.log('Globe renderer initialized successfully');
      } else {
        console.log('Globe renderer not yet available, will retry');
      }
    }, 100);
    
    return () => clearTimeout(timer);
  }, [globeConfig]);

  const handleMouseMove = (e) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    setMousePos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => setHoverPoint(null)}
      style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', pointerEvents: 'auto' }}>
      <Globe
        ref={globeEl}
        backgroundColor="rgba(0,0,0,0)"
        showAtmosphere={defaultProps.showAtmosphere}
        atmosphereColor={defaultProps.atmosphereColor}
        atmosphereAltitude={defaultProps.atmosphereAltitude}
        globeImageUrl={globeConfig?.globeImageUrl || waterDataUrl}
        bumpImageUrl={globeConfig?.bumpImageUrl || 'https://unpkg.com/three-globe/example/img/earth-topology.png'}
        style={{
          transform: `scale(${globeConfig?.globeSize || 1})`,
          transformOrigin: 'center center',
          pointerEvents: 'auto'
        }}
        showGraticules={true}
        graticulesColor="#ffffff"
        hexPolygonsData={countries}
        hexPolygonResolution={3}
        hexPolygonMargin={0.65}
        hexPolygonAltitude={0.02}
        hexPolygonColor={() => '#FFFFFF'}
        pointsData={points}
        pointLat="lat"
        pointLng="lng"
        pointColor={(d) => d.color || '#3b82f6'}
        pointAltitude={0.02}
        pointRadius={1.1}
        pointsMerge={false}
        enablePointerInteraction={true}
        onPointClick={(point) => {
          console.log('Point clicked (fallback):', point);
          setHoverPoint(point);
        }}
        pointLabel={(e) => {
          // Disable built-in tooltip to use custom overlay
          return '';
        }}
        onPointHover={(point, prevPoint) => {
          console.log('Globe hover triggered!'); // Basic hover detection
          console.log('Hover point:', point); // Debug log
          console.log('Previous point:', prevPoint); // Debug log
          if (point) {
            console.log('Point data structure:', {
              lat: point.lat,
              lng: point.lng,
              country: point.country,
              count: point.count,
              color: point.color
            });
          }
          setHoverPoint(point);
        }}
        arcsData={arcs}
        arcStartLat="startLat"
        arcStartLng="startLng"
        arcEndLat="endLat"
        arcEndLng="endLng"
        arcColor={(e) => e.color || ['#06b6d4', '#3b82f6']}
        arcAltitude={(e) => e.arcAlt ?? 0.25}
        arcStroke={() => 0.38}
        arcDashLength={0.95}
        arcDashGap={0.9}
        arcDashAnimateTime={1300}
        labelsData={[]}
      />
             {/* Custom tooltip overlay for hover data */}
       {hoverPoint && (
         <div
           className="absolute pointer-events-none z-10 bg-gray-900/90 text-white px-3 py-2 rounded-lg shadow-lg text-sm font-medium backdrop-blur-sm border border-gray-700"
           style={{
             left: mousePos.x + 10,
             top: mousePos.y - 10,
             transform: 'translateY(-100%)'
           }}
         >
           <div className="font-semibold">{hoverPoint.country || 'Unknown Country'}</div>
           <div className="text-gray-300">
             Medicines: {hoverPoint.count ? hoverPoint.count.toLocaleString() : 'N/A'}
           </div>
         </div>
       )}
    </div>
  );
}


