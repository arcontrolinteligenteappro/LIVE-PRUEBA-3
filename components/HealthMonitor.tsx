
import React from 'react';
import { SystemHealthState } from '../types';
import { IconBroadcast, IconRecord, IconStream, IconWarning } from './Icons';

interface HealthMonitorProps {
    health: SystemHealthState;
}

const Stat: React.FC<{ label: string; value: string | number; warn?: boolean }> = ({ label, value, warn }) => (
    <div className={`flex items-center gap-1 text-xs ${warn ? 'text-red-500 dark:text-red-400' : 'text-gray-700 dark:text-gray-300'}`}>
        <span className="font-bold text-gray-500 dark:text-gray-500">{label}</span>
        <span className="font-mono font-semibold tabular-nums">{value}</span>
    </div>
);


const HealthMonitor: React.FC<HealthMonitorProps> = ({ health }) => {
    const bitrateColor = health.bitrate > 4500 ? 'text-green-600 dark:text-green-400' : health.bitrate > 2000 ? 'text-yellow-500 dark:text-yellow-400' : 'text-red-600 dark:text-red-500';

    return (
        <div className="hidden lg:flex items-center gap-4 bg-gray-300/50 dark:bg-gray-900/50 px-3 py-1.5 rounded-lg border border-gray-400/50 dark:border-gray-700">
            <Stat label="CPU" value={`${health.temperature.toFixed(0)}°C`} warn={health.temperature > 75} />
            <div className="w-px h-4 bg-gray-400 dark:bg-gray-700"></div>
            <Stat label="FPS" value={health.fps.toFixed(1)} warn={health.fps < 29} />
             <div className="w-px h-4 bg-gray-400 dark:bg-gray-700"></div>
            <div className={`flex items-center gap-1 text-xs`}>
                <span className="font-bold text-gray-500 dark:text-gray-500">Kbps</span>
                <span className={`font-mono font-semibold tabular-nums ${bitrateColor}`}>{health.bitrate.toLocaleString()}</span>
            </div>
             <div className="w-px h-4 bg-gray-400 dark:bg-gray-700"></div>
            <Stat label="DROP" value={health.droppedFrames} warn={health.droppedFrames > 0} />
             <div className="w-px h-4 bg-gray-400 dark:bg-gray-700"></div>
            <Stat label="PING" value={`${health.latency}ms`} warn={health.latency > 100} />
        </div>
    );
};

export default HealthMonitor;
