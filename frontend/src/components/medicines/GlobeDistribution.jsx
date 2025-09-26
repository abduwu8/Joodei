import React, { useState, useEffect } from 'react';
import MedicineGlobe from '../../components/ui/MedicineGlobe';

// GlobeDistribution: wraps globe visualization and side insights panel
// Parent passes data, loading flag, palette, and aggregates.

const GlobeDistribution = ({ isDark, data, loading, colors, total, numCountries }) => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const top = [...data].sort((a, b) => b.count - a.count).slice(0, 10);
  return (
    <div className="col-span-1 md:col-span-2">
      <div className="group relative overflow-hidden p-0 text-gray-900 dark:text-white">
        <div className="flex items-center justify-between pt-6 pb-4 border-t border-gray-200 dark:border-white/10">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Global Medicine Distribution</h3>
        </div>
        <div className={`${isMobile ? "h-[400px]" : "h-[600px] lg:h-[700px]"} relative grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-6`}>
          <div className="lg:col-span-8 overflow-visible pr-0 lg:pr-6">
            {loading ? (
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
                  <p className="text-gray-500 dark:text-gray-400">Loading global data...</p>
                </div>
              </div>
            ) : (
              <MedicineGlobe data={data} autoRotate={false} autoRotateSpeed={0} globeSize={isMobile ? 0.8 : 1.4} />
            )}
          </div>
          <div className="lg:col-span-4 lg:pl-6 lg:border-l border-gray-200 dark:border-white/10 p-0 flex flex-col gap-2 lg:gap-4">
            <div>
              <p className="text-xs uppercase tracking-wide text-gray-500 dark:text_white/70">Active medicines right now</p>
              <div className="mt-1 text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white">{total.toLocaleString()}</div>
              <p className="text-xs text-gray-500 dark:text-white/60">across {numCountries} countries</p>
            </div>
            <div className="flex-1 divide-y divide-gray-200/80 dark:divide-white/10">
              {top.slice(0, isMobile ? 5 : 10).map((c, i) => {
                const pct = total > 0 ? Math.round((c.count / total) * 100) : 0;
                const color = colors[i % colors.length];
                return (
                  <div key={c.country} className="py-2 lg:py-3">
                    <div className="flex items-center justify_between text-xs lg:text-sm pb-1 lg:pb-2">
                      <div className="flex items-center gap-1 lg:gap-2">
                        <span className="inline-block w-1.5 h-1.5 lg:w-2 lg:h-2 rounded-full" style={{ backgroundColor: color }}></span>
                        <span className="text-gray-900 dark:text-white font-medium truncate">{c.country}</span>
                      </div>
                      <div className="text-gray-500 dark:text-white/70 text-xs lg:text-sm">{pct}%</div>
                    </div>
                    <div className="h-1 lg:h-1.5 w-full rounded-full bg-gray-200/70 dark:bg-white/10 overflow-hidden">
                      <div className="h-full rounded-full" style={{ width: `${pct}%`, background: color }}></div>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="text-xs text-gray-500 dark:text-white/60 hidden lg:block">Data reflects current registry counts. Hover dots on the globe for details.</div>
          </div>
          <div className="pointer-events-none absolute bottom-2 lg:bottom-4 left-2 lg:left-4 right-2 lg:right-4 flex justify-center lg:justify-start lg:right-auto">
            <div className="px-2 lg:px-4 py-1 lg:py-2 rounded-lg text-xs lg:text-sm text-gray-900 dark:text-white bg-white/90 dark:bg-gray-900/80 backdrop-blur border border-gray-200/60 dark:border-white/20 shadow-lg">
              <span className="font-semibold">Interactive Globe</span>: {isMobile ? 'Touch to explore' : 'Drag to rotate • Scroll to zoom • Pan to explore'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GlobeDistribution;


