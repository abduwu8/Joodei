import React from 'react';
import { IconSearch, IconX } from '@tabler/icons-react';

// ✅ IMPLEMENTED: Clean, transparent search bar component
// Features: No background, clean icon, transparent design, responsive
const SearchBar = ({ 
  value, 
  onChange, 
  placeholder = "Search...", 
  isDark = false,
  className = "",
  showClearButton = true,
  onClear
}) => {
  const handleClear = () => {
    if (onClear) {
      onClear();
    } else {
      onChange('');
    }
  };

  return (
    <div className={`relative ${className}`}>
      {/* Search Icon */}
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <IconSearch 
          size={18} 
          className={`${isDark ? 'text-gray-400' : 'text-gray-500'} transition-colors duration-200`} 
        />
      </div>

      {/* Search Input */}
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={`
          w-full pl-10 pr-10 py-2.5 
          bg-transparent 
          border-0 
          border-b-2 
          ${isDark 
            ? 'border-gray-600 text-white placeholder-gray-400 focus:border-blue-400' 
            : 'border-gray-300 text-gray-900 placeholder-gray-500 focus:border-blue-500'
          }
          focus:outline-none 
          focus:ring-0 
          transition-all duration-200 
          text-sm 
          font-medium
          ${isDark ? 'hover:border-gray-500' : 'hover:border-gray-400'}
        `}
      />

      {/* Clear Button */}
      {showClearButton && value && (
        <button
          onClick={handleClear}
          className={`
            absolute inset-y-0 right-0 pr-3 flex items-center
            ${isDark 
              ? 'text-gray-400 hover:text-white' 
              : 'text-gray-500 hover:text-gray-700'
            }
            transition-colors duration-200
            focus:outline-none
          `}
          aria-label="Clear search"
        >
          <IconX size={16} />
        </button>
      )}
    </div>
  );
};

export default SearchBar;
