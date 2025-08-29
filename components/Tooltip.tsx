import React, { useState } from 'react';

interface TooltipProps {
  text: string;
}

const Tooltip: React.FC<TooltipProps> = ({ text }) => {
  const [isVisible, setIsVisible] = useState(false);
  
  return (
    <div 
      className="relative flex items-center"
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="h-4 w-4 text-gray-400 hover:text-blue-500 dark:text-gray-500 dark:hover:text-blue-400 cursor-pointer"
      >
        <circle cx="12" cy="12" r="10"></circle>
        <line x1="12" y1="16" x2="12" y2="12"></line>
        <line x1="12" y1="8" x2="12.01" y2="8"></line>
      </svg>
      <div className={`absolute bottom-full left-1/2 z-50 mb-2 w-72 -translate-x-1/2 transform rounded-lg bg-gray-800 p-3 text-sm font-medium text-white transition-opacity duration-300 shadow-lg ${isVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
        <p className="whitespace-pre-wrap">{text}</p>
        <div className="absolute left-1/2 top-full h-2 w-4 -translate-x-1/2 transform">
            <div className="h-0 w-0 border-x-8 border-x-transparent border-t-8 border-t-gray-800"></div>
        </div>
      </div>
    </div>
  );
};

export default Tooltip;