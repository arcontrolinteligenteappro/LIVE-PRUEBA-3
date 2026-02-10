
import React from 'react';
import { LightingState } from '../../types';
import { Command } from './CommandBus';
import { es } from '../../localization';

const LightingConsole: React.FC<{
    lightingState: LightingState;
    dispatch: (command: Command) => void;
}> = ({ lightingState, dispatch }) => {
    const { scenes, activeSceneId, masterIntensity, colorTemperature } = lightingState;
    
    return (
        <div className="flex flex-col h-full gap-4">
            <h3 className="text-sm font-bold text-gray-400 uppercase flex-shrink-0">{es.lightingConsoleTitle}</h3>

            <div className="grid grid-cols-2 gap-2 flex-shrink-0">
                {scenes.map(scene => (
                    <button
                        key={scene.id}
                        onClick={() => dispatch({ type: 'LIGHTING_SET_SCENE', payload: scene.id })}
                        className={`p-3 rounded text-sm font-semibold truncate transition-all ${
                            activeSceneId === scene.id ? 'bg-blue-600 text-white ring-2 ring-blue-400' : 'bg-gray-700 hover:bg-gray-600'
                        }`}
                        style={{'--scene-color': scene.color} as React.CSSProperties}
                    >
                        <div className="flex items-center space-x-2">
                            <div className="w-4 h-4 rounded-full" style={{backgroundColor: scene.color}}></div>
                            <span>{scene.name}</span>
                        </div>
                    </button>
                ))}
            </div>

            <div className="space-y-3 flex-grow">
                <div>
                    <label className="text-xs font-semibold">{es.masterIntensity} ({masterIntensity}%)</label>
                    <input 
                        type="range" min="0" max="100" value={masterIntensity} 
                        onChange={e => dispatch({ type: 'LIGHTING_SET_MASTER_INTENSITY', payload: parseInt(e.target.value) })}
                        className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer" 
                    />
                </div>
                 <div>
                    <label className="text-xs font-semibold">{es.colorTemperature} ({colorTemperature}K)</label>
                    <input 
                        type="range" min="3200" max="6500" step="100" value={colorTemperature} 
                        onChange={e => dispatch({ type: 'LIGHTING_SET_COLOR_TEMP', payload: parseInt(e.target.value) })}
                        className="w-full h-2 bg-gradient-to-r from-orange-300 to-blue-300 rounded-lg appearance-none cursor-pointer" 
                    />
                </div>
            </div>
        </div>
    );
};

export default LightingConsole;
