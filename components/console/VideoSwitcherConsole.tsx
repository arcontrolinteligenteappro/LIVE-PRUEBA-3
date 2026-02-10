
import React, { useEffect, useRef } from 'react';
import { TransitionState, TransitionType, VJMixerState } from '../../types';
import { Command } from './CommandBus';
import { es } from '../../localization';

interface VideoSwitcherConsoleProps {
    transitionState: TransitionState;
    vjMixerState: VJMixerState;
    dispatch: (command: Command) => void;
}

const VideoSwitcherConsole: React.FC<VideoSwitcherConsoleProps> = ({ transitionState, vjMixerState, dispatch }) => {
    const tBarRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (tBarRef.current && transitionState.isActive) {
            tBarRef.current.value = String(transitionState.progress);
        } else if (tBarRef.current && !transitionState.isActive) {
            tBarRef.current.value = "0";
        }
    }, [transitionState.progress, transitionState.isActive]);


    const handleTBarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        dispatch({ type: 'SWITCHER_SET_TRANSITION_PROGRESS', payload: parseFloat(e.target.value) });
    };

    return (
        <div className="flex flex-col gap-2">
             <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-gray-400 uppercase">Switcher</h3>
                <div className="flex items-center space-x-2">
                    <span className="text-xs font-semibold">{vjMixerState.mode === 'transition' ? 'T-Bar' : 'VJ'}</span>
                    <button onClick={() => dispatch({ type: 'VJMixer_SET_MODE', payload: vjMixerState.mode === 'transition' ? 'vj' : 'transition' })} className={`relative inline-flex items-center h-5 w-9 transition-colors rounded-full ${vjMixerState.mode === 'vj' ? 'bg-blue-600' : 'bg-gray-600'}`}>
                        <span className={`inline-block w-3.5 h-3.5 transform bg-white rounded-full transition-transform ${vjMixerState.mode === 'vj' ? 'translate-x-5' : 'translate-x-1'}`} />
                    </button>
                </div>
            </div>
            <div className="grid grid-cols-12 gap-2">
                <div className="col-span-8 flex flex-col gap-2">
                    <div className="grid grid-cols-2 gap-2">
                        <button onClick={() => dispatch({ type: 'SWITCHER_CUT' })} className="p-3 bg-red-600 hover:bg-red-700 rounded text-white font-bold">CUT</button>
                        <button onClick={() => dispatch({ type: 'SWITCHER_AUTO' })} className="p-3 bg-green-600 hover:bg-green-700 rounded text-white font-bold">AUTO</button>
                    </div>
                     <select 
                        value={transitionState.type} 
                        onChange={e => dispatch({ type: 'SWITCHER_SET_TRANSITION_TYPE', payload: e.target.value as TransitionType })} 
                        className="bg-gray-700 text-white text-xs rounded px-2 py-1 w-full"
                     >
                        {Object.values(TransitionType).map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                </div>
                <div className="col-span-4 flex items-center justify-center">
                    {vjMixerState.mode === 'transition' ? (
                        <input ref={tBarRef} type="range" min="0" max="1" step="0.01" defaultValue="0" onChange={handleTBarChange} className="w-4 h-24 appearance-none bg-transparent [&::-webkit-slider-runnable-track]:rounded-full [&::-webkit-slider-runnable-track]:bg-black/25 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-8 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-gray-400" style={{ writingMode: 'vertical-lr', direction: 'rtl' }} />
                    ) : (
                         <input type="range" min="-1" max="1" step="0.01" value={vjMixerState.crossfade} onChange={e => dispatch({type: 'VJMixer_SET_CROSSFADE', payload: parseFloat(e.target.value)})} className="w-full h-3 bg-gray-900 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:w-2 [&::-webkit-slider-thumb]:bg-red-500" />
                    )}
                </div>
            </div>
        </div>
    );
};

export default VideoSwitcherConsole;
