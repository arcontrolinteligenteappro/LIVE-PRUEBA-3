
import React, { useRef } from 'react';
import { AudioSource, ControlSurfaceState } from '../../types';
import { Command } from './CommandBus';
import { es } from '../../localization';
import { IconLock } from '../Icons';
import { config } from '../../config';

const CompactKnob: React.FC<{label: string, value: number, min?: number, max?: number, onChange: (value: number) => void, color?: string}> = ({label, value, min = 0, max = 100, onChange, color='bg-blue-400'}) => {
    const knobRef = useRef<HTMLDivElement>(null);
    const initialY = useRef(0);
    const initialValue = useRef(0);

    const handleInteractionStart = (clientY: number) => {
        initialY.current = clientY;
        initialValue.current = value;
    };

    const handleInteractionMove = (clientY: number) => {
        const deltaY = initialY.current - clientY; // Drag up increases value
        const range = max - min;
        const sensitivity = range / 80; // Adjust sensitivity: 80px drag for full range
        let newValue = initialValue.current + deltaY * sensitivity;
        
        newValue = Math.max(min, Math.min(max, newValue)); // Clamp value
        onChange(newValue);
    };

    const handleMouseDown = (e: React.MouseEvent) => {
        handleInteractionStart(e.clientY);
        
        const onMouseMove = (moveEvent: MouseEvent) => { handleInteractionMove(moveEvent.clientY); };
        const onMouseUp = () => {
            document.removeEventListener('mousemove', onMouseMove);
            document.removeEventListener('mouseup', onMouseUp);
        };
        
        document.addEventListener('mousemove', onMouseMove);
        document.addEventListener('mouseup', onMouseUp);
    };

    const handleTouchStart = (e: React.TouchEvent) => {
        e.preventDefault();
        handleInteractionStart(e.touches[0].clientY);

        const onTouchMove = (moveEvent: TouchEvent) => {
            if (moveEvent.touches.length > 0) handleInteractionMove(moveEvent.touches[0].clientY);
        };
        const onTouchEnd = () => {
            document.removeEventListener('touchmove', onTouchMove);
            document.removeEventListener('touchend', onTouchEnd);
        };

        document.addEventListener('touchmove', onTouchMove);
        document.addEventListener('touchend', onTouchEnd);
    };

    const percentage = ((value - min) / (max - min)) * 100;
    
    return (
        <div 
            className="flex flex-col items-center space-y-1 w-10 cursor-ns-resize select-none touch-none"
            onMouseDown={handleMouseDown}
            onTouchStart={handleTouchStart}
            ref={knobRef}
        >
            <div 
                className="w-6 h-6 rounded-full border border-gray-600 bg-gray-700 relative"
                style={{ transform: `rotate(${-135 + (percentage * 2.7)}deg)`}}
            >
                <div className={`w-0.5 h-2 ${color} absolute top-0.5 left-1/2 -ml-px rounded-full`}></div>
            </div>
             <div className="text-[9px] font-bold text-gray-400 uppercase">{label}</div>
        </div>
    )
}

const AudioChannelStrip: React.FC<{
    source: AudioSource;
    dispatch: (command: Command) => void;
}> = ({ source, dispatch }) => {
    const panValue = Math.round(source.pan);
    let panDisplay: string;
    if (panValue === 0) panDisplay = "C";
    else if (panValue < 0) panDisplay = `L${Math.abs(panValue)}`;
    else panDisplay = `R${panValue}`;

    return (
        <div className="flex flex-col h-full items-center gap-1 bg-gray-800/50 p-1 rounded-md border border-gray-700">
            {/* Top Processing */}
            <div className="flex flex-col items-center gap-2 p-1 bg-black/20 rounded-md w-full">
                <button onClick={() => dispatch({type: 'AUDIO_TOGGLE_HPF', payload: source.id})} className={`w-full text-[9px] font-black rounded-sm py-0.5 ${source.hpf.enabled ? 'bg-red-600 text-white' : 'bg-gray-600'}`}>HPF</button>
                <CompactKnob label="GAIN" value={source.gain} min={-12} max={12} onChange={v => dispatch({type: 'AUDIO_SET_GAIN_TRIM', payload: {channelId: source.id, gain: v}})} color="bg-red-400" />
                <CompactKnob label="GATE" value={source.gate.threshold} min={-60} max={0} onChange={v => dispatch({type: 'AUDIO_SET_GATE', payload: {channelId: source.id, threshold: v}})} color="bg-yellow-400" />
                <CompactKnob label="COMP" value={source.compressor.threshold} min={-40} max={0} onChange={v => dispatch({type: 'AUDIO_SET_COMPRESSOR', payload: {channelId: source.id, threshold: v, ratio: source.compressor.ratio}})} color="bg-yellow-400" />
            </div>

            {/* EQ Section */}
            <div className="grid grid-cols-2 gap-1 p-1 bg-black/20 rounded-md w-full">
                 <CompactKnob label="HIGH" value={source.eq.high} min={-12} max={12} onChange={v => dispatch({type: 'AUDIO_SET_EQ', payload: {channelId: source.id, band: 'high', value: v}})} />
                 <CompactKnob label="MID 1" value={source.eq.mid1} min={-12} max={12} onChange={v => dispatch({type: 'AUDIO_SET_EQ', payload: {channelId: source.id, band: 'mid1', value: v}})} />
                 <CompactKnob label="MID 2" value={source.eq.mid2} min={-12} max={12} onChange={v => dispatch({type: 'AUDIO_SET_EQ', payload: {channelId: source.id, band: 'mid2', value: v}})} />
                 <CompactKnob label="LOW" value={source.eq.low} min={-12} max={12} onChange={v => dispatch({type: 'AUDIO_SET_EQ', payload: {channelId: source.id, band: 'low', value: v}})} />
            </div>
            
            {/* Sends Section */}
            <div className="grid grid-cols-2 gap-1 p-1 bg-black/20 rounded-md w-full">
                 <CompactKnob label="AUX 1" value={source.busSends.aux1} onChange={v => dispatch({type: 'AUDIO_SET_BUS_SEND', payload: {channelId: source.id, bus: 'aux1', level: v}})} color="bg-green-400" />
                 <CompactKnob label="AUX 2" value={source.busSends.aux2} onChange={v => dispatch({type: 'AUDIO_SET_BUS_SEND', payload: {channelId: source.id, bus: 'aux2', level: v}})} color="bg-green-400" />
            </div>
            <div className="p-1 w-full flex items-center justify-center">
                 <CompactKnob label={panDisplay} value={source.pan} min={-100} max={100} onChange={v => dispatch({type: 'AUDIO_SET_PAN', payload: {channelId: source.id, pan: v}})} />
            </div>

            {/* Fader Section */}
            <div className="flex-grow w-full relative flex justify-center py-2">
                 <input
                    type="range" min="0" max="100" value={source.volume}
                    onChange={e => dispatch({ type: 'AUDIO_SET_FADER_LEVEL', payload: { channelId: source.id, level: parseInt(e.target.value) } })}
                    className="w-4 h-full appearance-none bg-transparent [&::-webkit-slider-runnable-track]:rounded-full [&::-webkit-slider-runnable-track]:bg-gray-600 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-8 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-gray-300"
                    style={{ writingMode: 'vertical-lr', direction: 'rtl' }}
                />
            </div>
            <div className="flex gap-1 w-full">
                <button onClick={() => dispatch({type: 'AUDIO_TOGGLE_MUTE', payload: source.id})} className={`flex-1 h-6 text-xs font-bold rounded ${source.isMuted ? 'bg-red-600' : 'bg-gray-600'}`}>M</button>
                <button onClick={() => dispatch({type: 'AUDIO_TOGGLE_SOLO', payload: source.id})} className={`flex-1 h-6 text-xs font-bold rounded ${source.isSolo ? 'bg-yellow-500' : 'bg-gray-600'}`}>S</button>
            </div>
            <div className="text-xs font-semibold text-center h-8 truncate w-full p-1 bg-gray-900 rounded">{source.name}</div>
        </div>
    );
};

const MasterChannelStrip: React.FC<{
    source: AudioSource;
    isLive: boolean;
    dispatch: (command: Command) => void;
}> = ({ source, isLive, dispatch }) => {
    return (
        <div className="flex flex-col items-center gap-2 h-full bg-red-900/30 p-1 rounded border border-red-700">
             <div className="p-2 text-center w-full">
                <button className={`w-full mt-2 text-xs p-1 rounded font-bold ${isLive ? 'bg-gray-600 cursor-not-allowed' : 'bg-red-600'}`} disabled={isLive}>
                    LIMITER
                </button>
            </div>
            <div className="flex-grow w-full relative flex justify-center py-2">
                 <input
                    type="range" min="0" max="100" value={source.volume}
                    onChange={e => dispatch({ type: 'AUDIO_SET_FADER_LEVEL', payload: { channelId: source.id, level: parseInt(e.target.value) } })}
                    className="w-6 h-full appearance-none bg-transparent [&::-webkit-slider-runnable-track]:rounded-full [&::-webkit-slider-runnable-track]:bg-gray-600 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-10 [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:rounded-md [&::-webkit-slider-thumb]:bg-red-400"
                    style={{ writingMode: 'vertical-lr', direction: 'rtl' }}
                />
            </div>
            <div className="text-sm font-black text-center h-8 truncate w-full p-1 bg-red-900 rounded">{source.name}</div>
        </div>
    );
}

const AudioMixerConsole: React.FC<{
    audioSources: AudioSource[];
    controlSurfaceState: ControlSurfaceState;
    isLive: boolean;
    dispatch: (command: Command) => void;
}> = ({ audioSources, controlSurfaceState, isLive, dispatch }) => {
    const channels = audioSources.filter(s => s.id !== 'master');
    const master = audioSources.find(s => s.id === 'master');

    if (!config.features.audioConsole) { /* Fallback to simple mixer if disabled */
        return ( <div className="p-4 text-center text-sm text-gray-500">Consola de Audio no habilitada.</div> )
    }

    return (
        <div className="flex flex-col h-full gap-2">
            <div className="flex justify-between items-center">
                 <h3 className="text-sm font-bold text-gray-400 uppercase">Audio Console</h3>
                 <div className="flex items-center gap-2">
                    <button onClick={() => dispatch({type: 'CONSOLE_TOGGLE_MIC_LOCK'})} className={`flex items-center gap-1 text-xs px-2 py-1 rounded ${controlSurfaceState.micLock ? 'bg-yellow-500 text-black' : 'bg-gray-700'}`}><IconLock className="w-3 h-3"/> {es.micLock}</button>
                    <button onClick={() => dispatch({type: 'CONSOLE_TOGGLE_AFV'})} className={`text-xs px-2 py-1 rounded ${controlSurfaceState.audioFollowsVideo ? 'bg-blue-500' : 'bg-gray-700'}`}>AFV</button>
                 </div>
            </div>
            <div className="flex-grow grid grid-cols-4 lg:grid-cols-5 gap-1.5 min-h-0">
                 {channels.slice(0, 4).map(ch => <AudioChannelStrip key={ch.id} source={ch} dispatch={dispatch} />)}
                {master && <MasterChannelStrip source={master} dispatch={dispatch} isLive={isLive} />}
            </div>
        </div>
    );
};

export default AudioMixerConsole;
