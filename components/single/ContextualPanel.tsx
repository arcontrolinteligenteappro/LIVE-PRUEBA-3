
import React, { useState } from 'react';
import { SingleModePanel, ControlSurfaceState, ProductionMode, AudioSource, LightingState } from '../../types';
import { Command } from '../console/CommandBus';
import PerformancePads from '../console/PerformancePads';
import { config } from '../../config';
import { es } from '../../localization';

const MiniAudioMixer: React.FC<{
    audioSources: AudioSource[],
    dispatch: (command: Command) => void;
}> = ({ audioSources, dispatch }) => {
    const showAdvanced = config.features.audioConsole;
    return (
        <div className="p-2 space-y-3">
            <h4 className="font-bold text-center">Audio Mixer</h4>
            {audioSources.map(source => (
                <div key={source.id} className="grid grid-cols-5 gap-2 items-center">
                    <div className="col-span-2 text-xs truncate font-semibold">{source.name}</div>
                    <div className="col-span-3">
                        <input type="range" min="0" max="100" value={source.isMuted ? 0 : source.volume} onChange={(e) => dispatch({ type: 'AUDIO_SET_FADER_LEVEL', payload: { channelId: source.id, level: parseInt(e.target.value) }})} className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer" />
                    </div>
                    {showAdvanced && (
                         <div className="col-start-3 col-span-3 flex justify-end gap-2">
                             <button onClick={() => dispatch({type: 'AUDIO_TOGGLE_MUTE', payload: source.id})} className={`w-10 h-6 text-xs font-bold rounded ${source.isMuted ? 'bg-red-600' : 'bg-gray-600'}`}>M</button>
                             <button onClick={() => dispatch({type: 'AUDIO_TOGGLE_SOLO', payload: source.id})} className={`w-10 h-6 text-xs font-bold rounded ${source.isSolo ? 'bg-yellow-500' : 'bg-gray-600'}`}>S</button>
                         </div>
                    )}
                </div>
            ))}
        </div>
    );
}

const MiniLightingConsole: React.FC<{
    lightingState: LightingState;
    dispatch: (command: Command) => void;
}> = ({ lightingState, dispatch }) => {
    const quickScenes = lightingState.scenes.slice(0, 4);
    return (
        <div className="p-2 space-y-4">
            <h4 className="font-bold text-center">{es.lightingConsoleTitle}</h4>
            <div className="grid grid-cols-2 gap-2">
                {quickScenes.map(scene => (
                    <button 
                        key={scene.id}
                        onClick={() => dispatch({ type: 'LIGHTING_SET_SCENE', payload: scene.id })}
                        className={`p-2 text-xs rounded font-semibold ${lightingState.activeSceneId === scene.id ? 'bg-blue-600' : 'bg-gray-700'}`}
                    >
                        {scene.name}
                    </button>
                ))}
            </div>
             <div>
                <label className="text-xs font-semibold">{es.masterIntensity} ({lightingState.masterIntensity}%)</label>
                <input 
                    type="range" min="0" max="100" value={lightingState.masterIntensity} 
                    onChange={e => dispatch({ type: 'LIGHTING_SET_MASTER_INTENSITY', payload: parseInt(e.target.value) })}
                    className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer" 
                />
            </div>
        </div>
    )
}

interface ContextualPanelProps {
    controlSurfaceState: ControlSurfaceState;
    productionMode: ProductionMode;
    audioSources: AudioSource[];
    lightingState: LightingState;
    dispatch: (command: Command) => void;
}

const ContextualPanel: React.FC<ContextualPanelProps> = (props) => {
    const { activeSingleModePanel } = props.controlSurfaceState;
    const [performanceTab, setPerformanceTab] = useState<'performance' | 'lights'>('performance');

    const renderPanelContent = () => {
        switch (activeSingleModePanel) {
            case SingleModePanel.AUDIO:
                return <MiniAudioMixer audioSources={props.audioSources} dispatch={props.dispatch} />;
            case SingleModePanel.PERFORMANCE:
                return (
                    <div className="flex flex-col h-full">
                        <div className="flex space-x-1 p-1 bg-gray-900/50 rounded-md flex-shrink-0">
                             <button onClick={() => setPerformanceTab('performance')} className={`flex-1 p-2 text-xs font-bold rounded ${performanceTab === 'performance' ? 'bg-blue-600' : ''}`}>{es.tabPerformance}</button>
                             {config.features.lighting && <button onClick={() => setPerformanceTab('lights')} className={`flex-1 p-2 text-xs font-bold rounded ${performanceTab === 'lights' ? 'bg-blue-600' : ''}`}>{es.tabLights}</button>}
                        </div>
                        <div className="flex-grow mt-2">
                            {performanceTab === 'performance' && <PerformancePads productionMode={props.productionMode} dispatch={props.dispatch} />}
                            {performanceTab === 'lights' && config.features.lighting && <MiniLightingConsole lightingState={props.lightingState} dispatch={props.dispatch} />}
                        </div>
                    </div>
                );
            case SingleModePanel.OVERLAYS:
                 return <div className="p-4 text-center text-sm text-gray-400">Controles de Overlay aquí.</div>;
            default:
                return null;
        }
    };
    
    return (
        <div className={`absolute top-0 right-0 h-full w-80 bg-gray-800/95 backdrop-blur-sm shadow-lg transition-transform duration-300 ease-in-out z-20
            ${activeSingleModePanel !== SingleModePanel.NONE ? 'translate-x-0' : 'translate-x-full'}
        `}>
            <button 
                onClick={() => props.dispatch({ type: 'UI_TOGGLE_SINGLE_MODE_PANEL', payload: activeSingleModePanel })}
                className="absolute top-2 -left-8 bg-gray-800/95 p-2 rounded-l-md"
            >
                &gt;
            </button>
            <div className="p-2 h-full overflow-y-auto">
                {renderPanelContent()}
            </div>
        </div>
    );
};

export default ContextualPanel;
