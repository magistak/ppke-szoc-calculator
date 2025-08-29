
import React, { useState } from 'react';
import { CHEVRON_DOWN, CHEVRON_UP } from '../constants.tsx';

interface AccordionItemProps {
  title: string;
  children: React.ReactNode;
  isOpenDefault?: boolean;
}

const AccordionItem: React.FC<AccordionItemProps> = ({ title, children, isOpenDefault = false }) => {
  const [isOpen, setIsOpen] = useState(isOpenDefault);

  return (
    <div className="border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800">
      <h2>
        <button
          type="button"
          className="flex items-center justify-between w-full p-5 font-medium text-left text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-800"
          onClick={() => setIsOpen(!isOpen)}
          aria-expanded={isOpen}
        >
          <span className="text-lg">{title}</span>
          {isOpen ? CHEVRON_UP : CHEVRON_DOWN}
        </button>
      </h2>
      <div className={`${isOpen ? 'block' : 'hidden'} border-t border-gray-200 dark:border-gray-700`}>
        <div className="p-5 space-y-6">
          {children}
        </div>
      </div>
    </div>
  );
};

export default AccordionItem;