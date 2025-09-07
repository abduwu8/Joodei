import React from 'react';

const Loader = ({ size = 50, color = "currentColor", speed = 1.75 }) => {
  const containerSize = size;
  const trackSize = size * 0.625; // 31.25/50 ratio
  
  return (
    <div 
      className="relative overflow-visible"
      style={{
        width: `${containerSize}px`,
        height: `${trackSize}px`,
        transformOrigin: 'center'
      }}
    >
      {/* Track */}
      <svg
        className="absolute inset-0"
        viewBox="0 0 50 31.25"
        height={trackSize}
        width={containerSize}
        preserveAspectRatio="xMidYMid meet"
      >
        <path 
          className="opacity-10"
          strokeWidth="4" 
          fill="none" 
          pathLength="100"
          stroke={color}
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M0.625 21.5 h10.25 l3.75 -5.875 l7.375 15 l9.75 -30 l7.375 20.875 v0 h10.25"
        />
      </svg>
      
      {/* Animated Car */}
      <svg
        className="absolute inset-0"
        viewBox="0 0 50 31.25"
        height={trackSize}
        width={containerSize}
        preserveAspectRatio="xMidYMid meet"
      >
        <path 
          className="animate-pulse"
          strokeWidth="4" 
          fill="none" 
          pathLength="100"
          stroke={color}
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M0.625 21.5 h10.25 l3.75 -5.875 l7.375 15 l9.75 -30 l7.375 20.875 v0 h10.25"
          style={{
            strokeDasharray: 100,
            strokeDashoffset: 100,
            animation: `travel ${speed}s ease-in-out infinite, fade ${speed}s ease-out infinite`
          }}
        />
      </svg>
      
      <style jsx>{`
        @keyframes travel {
          0% {
            stroke-dashoffset: 100;
          }
          75% {
            stroke-dashoffset: 0;
          }
        }
        
        @keyframes fade {
          0% {
            opacity: 0;
          }
          20%, 55% {
            opacity: 1;
          }
          100% {
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
};

export default Loader;
