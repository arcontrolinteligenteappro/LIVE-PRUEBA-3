
import React, { useEffect, useState } from 'react';
import { AudioSource } from '../../types';
import { Command } from '../console/CommandBus';
import { IconVolumeMute } from '../Icons';

const MiniVUMeter: React.FC<{ volume: number, isMuted: boolean }> = ({ volume, isMuted }) => {
    const [peak, setPeak] = useState(0);

    useEffect(() => {
        let timeout: number;
        if (!isMuted && volume > 0) {
            const randomPeak = (volume / 100) * (0.8 + Math.random() * 0.2); // Simulate audio signal
            setPeak(p => Math.max(p, randomPeak));
            timeout = window.setTimeout(() => setPeak(p => p * 0.8), 600); // Peak hold decay
        } else {
            setPeak(0);
        }
        return () => clearTimeout(timeout);
    }, [volume, isMuted]);

    const level = isMuted ? 0 : volume;
    const peakLevel = isMuted ? 0 : peak * 100;
    
    return (
        <div className="absolute top-0 left-0 w-full h-full bg-transparent flex flex-col-reverse rounded-full overflow-hidden">
            {/* Main Level */}
            <div 
                className="w-full bg-gradient-to-t from-green-600 via-yellow-500 to-red-600 transition-[height] duration-75"
                style={{ height: `${level}%` }}
            ></div>
            {/* Peak Hold */}
            <div className="absolute bottom-0 left-0 w-full h-full">
                 <div 
                    className="absolute w-full h-0.5 bg-white/80" 
                    style={{ bottom: `${peakLevel}%`}}
                ></div>
            </div>
        </div>
    );
};


const FaderChannel: React.FC<{ source: AudioSource, dispatch: (c: Command) => void, isMaster?: boolean }> = ({ source, dispatch, isMaster = false }) => {
    const handleFaderChange = (level: number) => {
        dispatch({ type: 'AUDIO_SET_FADER_LEVEL', payload: { channelId: source.id, level } });
    };

    return (
        <div className="flex flex-col h-full items-center gap-2 w-16">
            <div className="flex-grow w-full relative flex justify-center py-2">
                {/* Track */}
                <div className={`w-2 h-full rounded-full ${isMaster ? 'bg-gray-700' : 'bg-gray-800'}`}></div>
                {/* VU Meter inside track */}
                <div className="absolute w-2 h-full top-0 left-1/2 -ml-1">
                    <MiniVUMeter volume={source.volume} isMuted={source.isMuted}/>
                </div>
                {/* Fader Input */}
                <input
                    type="range" min="0" max="100" value={source.isMuted ? 0 : source.volume}
                    onChange={e => handleFaderChange(parseInt(e.target.value))}
                    className="absolute inset-0 w-full h-full appearance-none bg-transparent cursor-pointer 
                               [&::-webkit-slider-thumb]:appearance-none 
                               [&::-webkit-slider-thumb]:h-8 
                               [&::-webkit-slider-thumb]:w-10
                               [&::-webkit-slider-thumb]:bg-gray-300
                               [&::-webkit-slider-thumb]:dark:bg-gray-400
                               [&::-webkit-slider-thumb]:rounded-md
                               [&::-webkit-slider-thumb]:border-2
                               [&::-webkit-slider-thumb]:border-gray-500
                               [&::-webkit-slider-thumb]:cursor-pointer"
                    style={{ writingMode: 'vertical-lr', direction: 'rtl' }}
                />
            </div>
            <button onClick={() => dispatch({ type: 'AUDIO_TOGGLE_MUTE', payload: source.id })} className={`w-12 h-10 flex items-center justify-center rounded-md font-bold text-xs ${source.isMuted ? 'bg-red-600 text-white' : 'bg-gray-600 text-gray-300'}`}>
                MUTE
            </button>
            <div className={`text-xs font-bold truncate w-full text-center h-8 flex items-center justify-center rounded-md px-1 ${isMaster ? 'bg-red-900/50 text-red-300' : 'bg-gray-900/50'}`}>
                {source.name}
            </div>
        </div>
    );
};

const MiniAudioMixer: React.FC<{ audioSources: AudioSource[], dispatch: (c: Command) => void }> = ({ audioSources, dispatch }) => {
    const channels = audioSources.filter(s => s.id !== 'master').slice(0, 4); // Show first 4 channels
    const master = audioSources.find(s => s.id === 'master');

    return (
        <div className="h-full w-full p-2 flex justify-center gap-x-2 sm:gap-x-4">
            {channels.map(ch => <FaderChannel key={ch.id} source={ch} dispatch={dispatch} />)}
            {master && (
                <div className="border-l-2 border-gray-700 pl-2 sm:pl-4">
                    <FaderChannel source={master} dispatch={dispatch} isMaster={true} />
                </div>
            )}
        </div>
    );
};

export default MiniAudioMixer;
