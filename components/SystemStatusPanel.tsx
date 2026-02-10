
import React from 'react';
import { es } from '../localization';
import { Command } from './console/CommandBus';

interface SystemStatusPanelProps {
    systemStatus: 'Normal' | 'CpuStress' | 'NetworkStress';
    dispatch: (command: Command) => void;
}

const SystemStatusPanel: React.FC<SystemStatusPanelProps> = ({ systemStatus, dispatch }) => {
    return (
        <div className="space-y-4">
            <h3 className="text-lg font-bold text-white">{es.systemStatusTitle}</h3>
            
            <div className="p-3 bg-gray-700/50 rounded-lg space-y-3">
                <div className="flex justify-between items-center text-sm">
                    <span className="font-semibold">{es.status}:</span>
                    <span className={`font-bold px-2 py-0.5 rounded-full text-xs ${systemStatus === 'Normal' ? 'bg-green-500/30 text-green-300' : 'bg-yellow-500/30 text-yellow-300'}`}>
                        {systemStatus === 'Normal' ? es.normal : es.degraded}
                    </span>
                </div>
                <p className="text-xs text-gray-400">
                    Esto simula cómo ARCLS apaga los módulos no críticos (P2, P3) bajo estrés para proteger la transmisión principal (P0).
                </p>
            </div>

            <div>
                <h4 className="font-bold text-white mb-2">{es.simulateStress}</h4>
                <div className="flex flex-col space-y-2">
                    <button 
                        onClick={() => dispatch({ type: 'SYSTEM_SET_HEALTH', payload: { temperature: 45, fps: 29.97, bitrate: 5500, latency: 25 } })} 
                        className={`p-2 text-sm font-semibold rounded ${systemStatus === 'Normal' ? 'bg-blue-600' : 'bg-gray-600'}`}
                    >
                        {es.normal}
                    </button>
                    <button 
                        onClick={() => dispatch({ type: 'SYSTEM_SET_HEALTH', payload: { temperature: 85, fps: 24.1 } })} 
                        className={`p-2 text-sm font-semibold rounded ${systemStatus === 'CpuStress' ? 'bg-yellow-600' : 'bg-gray-600'}`}
                    >
                        {es.cpuStress}
                    </button>
                     <button 
                        onClick={() => dispatch({ type: 'SYSTEM_SET_HEALTH', payload: { bitrate: 1500, droppedFrames: (Math.random() * 10) + 1, latency: 150 } })} 
                        className={`p-2 text-sm font-semibold rounded ${systemStatus === 'NetworkStress' ? 'bg-yellow-600' : 'bg-gray-600'}`}
                    >
                        {es.networkStress}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SystemStatusPanel;
