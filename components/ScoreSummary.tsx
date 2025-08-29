
import React from 'react';
import { ScoreBreakdown } from '../types.ts';

interface ScoreSummaryProps {
  totalScore: number;
  breakdown: ScoreBreakdown;
  onReset: () => void;
}

const ScoreSummary: React.FC<ScoreSummaryProps> = ({ totalScore, breakdown, onReset }) => {
  return (
    <div className="sticky top-8 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Pontszámok Összesítése</h3>
      <div className="flex items-baseline justify-center text-center my-6">
        <span className="text-7xl font-extrabold text-blue-600 dark:text-blue-400">{totalScore}</span>
        <span className="text-2xl font-semibold text-gray-500 dark:text-gray-400 ml-2">pont</span>
      </div>

      <div className="space-y-3 mb-6 max-h-80 overflow-y-auto pr-2">
        {Object.keys(breakdown).length > 0 ? (
          Object.entries(breakdown).map(([key, { label, points }]) => (
            <div key={key} className="flex justify-between items-center text-sm p-2 rounded-md bg-gray-50 dark:bg-gray-700/50">
              <span className="text-gray-600 dark:text-gray-300 truncate mr-2">{label}</span>
              <span className={`font-bold ${points > 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                {points > 0 ? `+${points}` : points}
              </span>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500 dark:text-gray-400 py-4">Válasszon a lehetőségek közül a pontszámok megtekintéséhez.</p>
        )}
      </div>

      <button
        onClick={onReset}
        className="w-full bg-red-500 hover:bg-red-600 dark:bg-red-600 dark:hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg transition duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 dark:focus:ring-offset-gray-800 dark:focus:ring-red-500"
      >
        Kalkulátor alaphelyzetbe állítása
      </button>
    </div>
  );
};

export default ScoreSummary;