
import React, { useState, useEffect } from 'react';
import { AudioSource, AudioFXState } from '../types';
import { IconVolume, IconVolumeMute, IconLock } from './Icons';
import { es } from '../localization';

const VUMeter: React.FC<{ volume: number, isMuted: boolean }> = ({ volume, isMuted }) => {
    const [peak, setPeak] = useState(0);

    useEffect(() => {
        let timeout: number;
        if (!isMuted && volume > 0) {
            const randomPeak = (volume / 100) * (0.8 + Math.random() * 0.2);
            setPeak(randomPeak);
            timeout = window.setTimeout(() => setPeak(p => p * 0.7), 150);
        } else {
            setPeak(0);
        }
        return () => clearTimeout(timeout);
    }, [volume, isMuted]);

    const width = `${peak * 100}%`;
    const color = peak > 0.9 ? 'bg-red-500' : peak > 0.7 ? 'bg-yellow-400' : 'bg-green-500';

    return (
        <div className="w-full h-2 bg-gray-900/50 rounded-full overflow-hidden">
            <div className={`h-full ${color} transition-all duration-100`} style={{ width }}></div>
        </div>
    );
};

const Knob: React.FC<{label: string, value: number, onChange: (value: number) => void}> = ({label, value, onChange}) => {
    return (
        <div className="flex flex-col items-center space-y-1">
            <div className="text-xs font-bold">{label}</div>
            <input type="range" min="0" max="100" value={value} onChange={e => onChange(parseInt(e.target.value))} className="w-16 h-16 appearance-none bg-transparent cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-16 [&::-webkit-slider-thumb]:w-16 [&::-webkit-slider-thumb]:rounded-full" style={{background: `conic-gradient(#3b82f6 ${value * 3.6}deg, #4b5563 ${value * 3.6}deg)`}}/>
            <div className="text-xs">{value}%</div>
        </div>
    )
}

const AudioMixer: React.FC<{ 
    audioSources: AudioSource[], 
    updateAudioSource: (id: string, newValues: Partial<AudioSource>) => void,
    audioFXState: AudioFXState,
    setAudioFXState: (state: AudioFXState) => void,
}> = ({ audioSources, updateAudioSource, audioFXState, setAudioFXState }) => {
  const masterSource = audioSources.find(s => s.id === 'master');
  
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-bold text-white">{es.audioMixerTitle}</h3>
      {audioSources.map(source => (
        <div key={source.id}>
            <div className="grid grid-cols-12 items-center gap-2">
              <div className="col-span-4 text-sm font-semibold truncate flex items-center space-x-2">
                <span>{source.name}</span>
                {source.isMasterLock && <IconLock className="w-4 h-4 text-yellow-400" title="Mic Master Lock"/>}
              </div>
              <div className="col-span-6">
                <input
                  type="range" min="0" max="100" value={source.isMuted ? 0 : source.volume}
                  onChange={(e) => updateAudioSource(source.id, { volume: parseInt(e.target.value), isMuted: false })}
                  className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer"
                />
              </div>
              <div className="col-span-1 text-center text-xs w-8">{source.isMuted ? 'MUTE' : `${source.volume}%`}</div>
              <div className="col-span-1">
                <button 
                  onClick={() => updateAudioSource(source.id, { isMuted: !source.isMuted })}
                  className={`p-2 rounded-full ${source.isMuted ? 'bg-red-600' : 'bg-gray-600'} hover:bg-gray-500`}
                >
                  {source.isMuted ? <IconVolumeMute className="w-4 h-4"/> : <IconVolume className="w-4 h-4"/>}
                </button>
              </div>
            </div>
            <div className="col-span-12 mt-1 px-1">
                 <VUMeter volume={source.volume} isMuted={source.isMuted} />
            </div>
        </div>
      ))}
       {masterSource && (
         <div className="border-t-2 border-gray-600 pt-4">
            <h4 className="text-md font-bold text-white mb-2">{es.masterOutput}</h4>
            <div className="grid grid-cols-12 items-center gap-2">
                 <div className="col-span-4 text-sm font-semibold">PGM Master</div>
                 <div className="col-span-8"><VUMeter volume={masterSource.volume} isMuted={masterSource.isMuted} /></div>
            </div>
         </div>
      )}
       <div className="border-t-2 border-gray-600 pt-4">
            <h4 className="text-md font-bold text-white mb-2">{es.audioFX}</h4>
            <div className="flex justify-around p-2 bg-gray-900/50 rounded-lg">
                <Knob label={es.filter} value={audioFXState.filter} onChange={v => setAudioFXState({...audioFXState, filter: v})}/>
                <Knob label={es.echo} value={audioFXState.echo} onChange={v => setAudioFXState({...audioFXState, echo: v})}/>
                <Knob label={es.reverb} value={audioFXState.reverb} onChange={v => setAudioFXState({...audioFXState, reverb: v})}/>
            </div>
       </div>
    </div>
  );
};

export default AudioMixer;
