
import React from 'react';
import { ProductionMode } from '../types';
import { es } from '../localization';

interface GlobalSelectorsProps {
    productionMode: ProductionMode;
    setProductionMode: (mode: ProductionMode) => void;
    theme: 'light' | 'dark';
    setTheme: (theme: 'light' | 'dark') => void;
    isLive: boolean;
}

const GlobalSelectors: React.FC<GlobalSelectorsProps> = ({ productionMode, setProductionMode, theme, setTheme, isLive }) => {

    return (
        <div className="flex-shrink-0 p-2 flex flex-wrap items-center justify-center gap-2 md:gap-4 bg-gray-200 dark:bg-gray-800 border-b border-gray-300 dark:border-gray-700">
            {/* Production Mode Selector */}
            <select 
                value={productionMode}
                onChange={(e) => setProductionMode(e.target.value as ProductionMode)}
                disabled={isLive}
                className="bg-gray-300 dark:bg-gray-700 text-gray-800 dark:text-white rounded-md pl-2 sm:pl-3 pr-6 sm:pr-8 py-1 text-xs font-bold appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
                <option value="General">SIMPLE STREAM</option>
                <option value="Deportivo">SPORTS LIVE</option>
                <option value="Podcast">INTERVIEW / PODCAST</option>
                <option value="Venta">LIVE COMMERCE</option>
            </select>
            
            {/* Theme Toggle */}
            <button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} className="p-1.5 bg-gray-300 dark:bg-gray-700 rounded-md">
                 {theme === 'dark' ? '☀️' : '🌙'}
            </button>
        </div>
    );
};

export default GlobalSelectors;
