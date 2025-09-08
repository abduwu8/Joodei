import React from 'react';
import MedicineGlobe from '../../components/ui/MedicineGlobe';

// GlobeDistribution: wraps globe visualization and side insights panel
// Parent passes data, loading flag, palette, and aggregates.

const GlobeDistribution = ({ isDark, data, loading, colors, total, numCountries }) => {
  const top = [...data].sort((a, b) => b.count - a.count).slice(0, 5);
  return (
    <div className="col-span-1 md:col-span-2">
      <div className="group relative overflow-visible p-0 text-gray-900 dark:text-white">
        <div className="flex items-center justify-between pt-6 pb-4 border-t border-gray-200 dark:border-white/10">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Global Medicine Distribution</h3>
        </div>
        <div className="h-[900px] md:h-[900px] relative grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-0">
          <div className="lg:col-span-8 overflow-visible pr-0 lg:pr-6">
            {loading ? (
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
                  <p className="text-gray-500 dark:text-gray-400">Loading global data...</p>
                </div>
              </div>
            ) : (
              <MedicineGlobe data={data} autoRotate={false} autoRotateSpeed={0} globeSize={1.8} />
            )}
          </div>
          <div className="lg:col-span-4 lg:pl-6 lg:border-l border-gray-200 dark:border-white/10 p-0 flex flex-col gap-4">
            <div>
              <p className="text-xs uppercase tracking-wide text-gray-500 dark:text_white/70">Active medicines right now</p>
              <div className="mt-1 text-3xl font-bold text-gray-900 dark:text-white">{total.toLocaleString()}</div>
              <p className="text-xs text-gray-500 dark:text-white/60">across {numCountries} countries</p>
            </div>
            <div className="flex-1 divide-y divide-gray-200/80 dark:divide-white/10">
              {top.map((c, i) => {
                const pct = total > 0 ? Math.round((c.count / total) * 100) : 0;
                const color = colors[i % colors.length];
                return (
                  <div key={c.country} className="py-3">
                    <div className="flex items-center justify_between text-sm pb-2">
                      <div className="flex items-center gap-2">
                        <span className="inline-block w-2 h-2 rounded-full" style={{ backgroundColor: color }}></span>
                        <span className="text-gray-900 dark:text-white font-medium">{c.country}</span>
                      </div>
                      <div className="text-gray-500 dark:text-white/70">{pct}%</div>
                    </div>
                    <div className="h-1.5 w-full rounded-full bg-gray-200/70 dark:bg-white/10 overflow-hidden">
                      <div className="h-full rounded-full" style={{ width: `${pct}%`, background: color }}></div>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="text-xs text-gray-500 dark:text-white/60">Data reflects current registry counts. Hover dots on the globe for details.</div>
          </div>
          <div className="pointer-events-none absolute bottom-4 left-4 right-4 flex justify-center lg:justify-start lg:right-auto">
            <div className="px-4 py-2 rounded-lg text-sm text-gray-900 dark:text-white bg-white/90 dark:bg-gray-900/80 backdrop-blur border border-gray-200/60 dark:border-white/20 shadow-lg">
              <span className="font-semibold">Interactive Globe</span>: Drag to rotate • Scroll to zoom • Pan to explore
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GlobeDistribution;


