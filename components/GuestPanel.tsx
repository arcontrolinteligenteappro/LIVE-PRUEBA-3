
import React, { useState } from 'react';
import { Guest, SourceType, AudioSource } from '../types';
import { es } from '../localization';
import { IconUsers, IconSignal, IconPlus, IconTrash, IconVolumeMute, IconAudio } from './Icons';
import { Command } from './console/CommandBus';

interface GuestPanelProps {
    guests: Guest[];
    audioSources: AudioSource[];
    dispatch: (command: Command) => void;
}

const capturePlatforms: Guest['platform'][] = ['Zoom', 'Meet', 'WhatsApp', 'Skype', 'Teams', 'Discord', 'Telegram', 'Messenger'];

const GuestPanel: React.FC<GuestPanelProps> = ({ guests, audioSources, dispatch }) => {
    const [showCaptureModal, setShowCaptureModal] = useState(false);

    const handleCreateLink = () => {
        const link = `https://arcls.live/guest/${Date.now().toString(36)}`;
        prompt(es.guestLink, link);
        dispatch({ type: 'GUEST_ADD_SIMULATED', payload: { type: 'WEBRTC' } });
    };
    
    const handleAddCapture = (platform: Guest['platform']) => {
        dispatch({ type: 'GUEST_ADD_SIMULATED', payload: { type: 'CAPTURE', platform } });
        setShowCaptureModal(false);
    }

    const handleAddGuestAsSource = (guest: Guest) => {
        const sourceType = guest.type === 'WEBRTC' ? SourceType.WEBRTC_GUEST : SourceType.SCREEN_CAPTURE;
        dispatch({ type: 'SOURCE_ADD_GUEST', payload: { guest, sourceType } });
    };

    const getGuestAudioSource = (guest: Guest): AudioSource | undefined => {
        return audioSources.find(a => a.id === guest.audioSourceId);
    }

    return (
        <div className="space-y-4">
            <h3 className="text-lg font-bold text-white">{es.guestPanelTitle}</h3>
            
            <div className="grid grid-cols-2 gap-2">
                <button onClick={handleCreateLink} className="w-full flex items-center justify-center space-x-2 p-2 bg-blue-600 text-white rounded-md text-sm font-semibold hover:bg-blue-700">
                    <IconUsers className="w-4 h-4" />
                    <span>{es.createGuestLink}</span>
                </button>
                <button onClick={() => setShowCaptureModal(true)} className="w-full p-2 bg-gray-600 text-white rounded-md text-sm font-semibold hover:bg-gray-700">{es.addExternalCall}</button>
            </div>
            
             {showCaptureModal && (
                <div className="absolute inset-0 bg-gray-900/80 flex items-center justify-center z-20">
                    <div className="bg-gray-800 p-4 rounded-lg w-11/12 max-w-sm">
                        <h4 className="font-bold mb-3">Selecciona App a Capturar</h4>
                         <div className="grid grid-cols-3 gap-2">
                            {capturePlatforms.map(p => <button key={p} onClick={() => handleAddCapture(p)} className="p-3 bg-gray-700 hover:bg-gray-600 rounded text-xs">{p}</button>)}
                        </div>
                        <button onClick={() => setShowCaptureModal(false)} className="w-full mt-4 p-2 bg-red-600 rounded text-xs">Cancelar</button>
                    </div>
                </div>
            )}

            <div>
                <h4 className="font-bold text-white mb-2">{es.connectedGuests}</h4>
                <div className="space-y-2 max-h-96 overflow-y-auto pr-2">
                    {guests.length === 0 ? (
                        <p className="text-sm text-gray-400 text-center p-4">No hay invitados conectados.</p>
                    ) : (
                        guests.map(guest => {
                            const audioSource = getGuestAudioSource(guest);
                            return (
                                <div key={guest.id} className="p-2 bg-gray-700/50 rounded-lg">
                                    <div className="flex items-center justify-between">
                                        <div className="flex flex-col">
                                            <span className="font-semibold text-sm">{guest.name}</span>
                                            <span className="text-xs text-gray-400">{guest.platform || 'WebRTC Guest'}</span>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <div className="flex items-center space-x-1 text-xs text-green-400">
                                                <IconSignal className="w-4 h-4" /> <span>{guest.status}</span>
                                            </div>
                                            {!guest.sourceId && (
                                                <button onClick={() => handleAddGuestAsSource(guest)} className="flex items-center space-x-1 p-1.5 bg-green-600 text-white rounded text-xs font-semibold hover:bg-green-700" title={es.addToSwitcher}>
                                                    <IconPlus className="w-3 h-3"/>
                                                </button>
                                            )}
                                             <button onClick={() => dispatch({ type: 'GUEST_REMOVE', payload: guest.id })} className="p-1.5 bg-red-800/80 text-white rounded text-xs font-semibold hover:bg-red-700">
                                                <IconTrash className="w-3 h-3"/>
                                            </button>
                                        </div>
                                    </div>
                                    {audioSource && (
                                        <div className="flex items-center space-x-2 mt-2 pt-2 border-t border-gray-600/50">
                                            <input type="range" min="0" max="100" value={audioSource.volume} onChange={(e) => dispatch({ type: 'AUDIO_SET_FADER_LEVEL', payload: { channelId: audioSource.id, level: parseInt(e.target.value) }})} className="w-full h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer" />
                                            <button onClick={() => dispatch({type: 'AUDIO_TOGGLE_MUTE', payload: audioSource.id})} className={`p-1.5 rounded-full ${audioSource.isMuted ? 'bg-red-600' : 'bg-gray-600'}`}>
                                                <IconVolumeMute className="w-4 h-4" />
                                            </button>
                                            <button onClick={() => dispatch({type: 'AUDIO_SET_MIX_MINUS', payload: { channelId: audioSource.id, enabled: !audioSource.mixMinus }})} title={es.mixMinus} className={`p-1.5 rounded-full ${audioSource.mixMinus ? 'bg-blue-600' : 'bg-gray-600'}`}>
                                                <IconAudio className="w-4 h-4" />
                                            </button>
                                        </div>
                                    )}
                                </div>
                            )
                        })
                    )}
                </div>
            </div>
        </div>
    );
};

export default GuestPanel;
