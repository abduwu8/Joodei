import React from 'react';
import { useTheme } from '../context/ThemeContext';
import Aurora from './aurora';
import Loader from './Loader';

const LoadingScreen = () => {
    const { theme } = useTheme();
    const isDark = theme === 'dark';

    return (
        <div className={`h-screen overflow-hidden relative ${isDark ? 'bg-[#020617]' : 'bg-white'}`}>
            {/* Aurora Background for Dark Mode */}
            {isDark && (
                <div className="absolute inset-0 z-0">
                    <Aurora 
                        colorStops={["#00FFFF", "#00CED1", "#40E0D0"]}
                        amplitude={0.8}
                        blend={0.6}
                    />
                </div>
            )}
            
            {/* Grid Background for Light Mode */}
            {!isDark && (
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
            
            {/* Fade overlay across entire width */}
            <div className="absolute inset-0 z-5">
                <div className={`w-full h-full ${isDark ? 'bg-gradient-to-r from-[#020617] via-[#020617]/80 via-[#020617]/40 via-[#020617]/10 to-transparent' : 'bg-gradient-to-r from-white via-white/80 via-white/40 via-white/10 to-transparent'}`}></div>
            </div>
            
            {/* Centered Loader */}
            <div className="absolute inset-0 flex items-center justify-center z-10">
                <Loader size={50} color={isDark ? "#00FFFF" : "#0891b2"} speed={1.5} />
            </div>
        </div>
    );
};

export default LoadingScreen;
