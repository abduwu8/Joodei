import React from 'react';
import { useTheme } from '../context/ThemeContext';
import Aurora from './aurora';

const Background = ({ children }) => {
  const { theme } = useTheme();

  return (
    <div className={`min-h-screen w-full relative overflow-hidden ${theme === 'dark' ? 'bg-[#020617]' : 'bg-[#f8fafc]'}`}>
      {/* Aurora Background for Dark Mode */}
      {theme === 'dark' && (
        <div className="absolute inset-0 z-0">
          <Aurora 
            colorStops={["#00FFFF", "#00CED1", "#40E0D0"]}
            amplitude={0.8}
            blend={0.6}
          />
        </div>
      )}
      
      {/* Grid Background for Light Mode */}
      {theme === 'light' && (
        <div
          className="absolute inset-0 z-0"
          style={{
            backgroundImage: `
              linear-gradient(to right, #e2e8f0 1px, transparent 1px),
              linear-gradient(to bottom, #e2e8f0 1px, transparent 1px)
            `,
            backgroundSize: "20px 30px",
            WebkitMaskImage:
              "radial-gradient(ellipse 70% 60% at 50% 0%, #000 60%, transparent 100%)",
            maskImage:
              "radial-gradient(ellipse 70% 60% at 50% 0%, #000 60%, transparent 100%)",
          }}
        />
      )}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
};

export default Background;