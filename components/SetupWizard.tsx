
import React, { useState, useEffect } from 'react';
import { es } from '../localization';
import { IconSource, IconAudio, IconStream, IconWarning, IconCheckCircle } from './Icons';
import { requestPermissions, getAvailableCameras, getAvailableMicrophones, Camera, AudioDevice } from '../utils/webcam';
import { Command } from './console/CommandBus';
import { Source, AudioSource as AppAudioSource, SourceType } from '../types';

interface SetupWizardProps {
    onComplete: () => void;
    dispatch: (command: Command) => void;
}

const SetupWizard: React.FC<SetupWizardProps> = ({ onComplete, dispatch }) => {
    const [step, setStep] = useState(1);
    const [permissionStatus, setPermissionStatus] = useState<'idle' | 'pending' | 'granted' | 'denied'>('idle');
    const [cameras, setCameras] = useState<Camera[]>([]);
    const [microphones, setMicrophones] = useState<AudioDevice[]>([]);

    const handleRequestPermissions = async () => {
        setPermissionStatus('pending');
        const granted = await requestPermissions();
        setPermissionStatus(granted ? 'granted' : 'denied');
        if (granted) {
            setTimeout(() => setStep(2), 1000);
        }
    };
    
    useEffect(() => {
        if (step === 2 && permissionStatus === 'granted') {
            const scanDevices = async () => {
                const foundCameras = await getAvailableCameras();
                const foundMics = await getAvailableMicrophones();
                setCameras(foundCameras);
                setMicrophones(foundMics);
            };
            scanDevices();
        }
    }, [step, permissionStatus]);

    const handleFinish = () => {
        // Register discovered devices in the SourceRegistry (App state)
        const newVideoSources: Source[] = cameras.map(cam => ({
            id: cam.id,
            name: cam.label,
            type: SourceType.USB, // Assume USB/Internal for discovered cams
            isVisible: true,
        }));
        
        const newAudioSources: AppAudioSource[] = microphones.map(mic => ({
             id: mic.id, name: mic.label, volume: 70, gain: 0, isMuted: false, isSolo: false, pan: 0, hpf: { enabled: true, frequency: 100 },
             eq: { low: 0, mid1: 0, mid2: 0, high: 0 }, compressor: { threshold: -18, ratio: 3 }, gate: { threshold: -50 }, busSends: { aux1: 0, aux2: 0 }, mixMinus: false
        }));

        dispatch({ type: 'SOURCE_BATCH_ADD', payload: { video: newVideoSources, audio: newAudioSources }});
        onComplete();
    };

    const renderStep = () => {
        switch(step) {
            case 1: // Permissions
                return (
                    <div className="text-center">
                        <h2 className="text-xl font-bold mb-2">{es.wizardPermissionsTitle}</h2>
                        <p className="text-gray-400 mb-6">{es.wizardPermissionsDesc}</p>
                        {permissionStatus === 'idle' && <button onClick={handleRequestPermissions} className="px-6 py-3 bg-blue-600 text-white font-bold rounded-md hover:bg-blue-700">{es.wizardGrantPermission}</button>}
                        {permissionStatus === 'pending' && <p className="text-yellow-400">{es.wizardPendingPermission}</p>}
                        {permissionStatus === 'granted' && <p className="text-green-400 flex items-center justify-center"><IconCheckCircle className="w-6 h-6 mr-2"/> {es.wizardGrantedPermission}</p>}
                        {permissionStatus === 'denied' && <p className="text-red-400 flex items-center justify-center"><IconWarning className="w-6 h-6 mr-2"/> {es.wizardDeniedPermission}</p>}
                    </div>
                );
            case 2: // Device Scan
                 return (
                    <div>
                        <h2 className="text-xl font-bold text-center mb-4">{es.wizardDeviceScanTitle}</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-64 overflow-y-auto">
                            <div>
                                <h3 className="font-bold flex items-center gap-2"><IconSource className="w-5 h-5"/> Cámaras Encontradas</h3>
                                <ul className="list-disc list-inside text-sm text-gray-300 mt-2">
                                    {cameras.length > 0 ? cameras.map(cam => <li key={cam.id} className="truncate">{cam.label}</li>) : <li>Escaneando...</li>}
                                </ul>
                            </div>
                             <div>
                                <h3 className="font-bold flex items-center gap-2"><IconAudio className="w-5 h-5"/> Micrófonos Encontrados</h3>
                                <ul className="list-disc list-inside text-sm text-gray-300 mt-2">
                                    {microphones.length > 0 ? microphones.map(mic => <li key={mic.id} className="truncate">{mic.label}</li>) : <li>Escaneando...</li>}
                                </ul>
                            </div>
                        </div>
                    </div>
                );
            case 3: // Manual IP Sources
                 return (
                    <div>
                        <h2 className="text-xl font-bold text-center mb-4">{es.wizardIPSourcesTitle}</h2>
                        <p className="text-center text-sm text-gray-400 mb-4">{es.wizardIPSourcesDesc}</p>
                        <input type="text" placeholder="rtsp://192.168.1.100/stream1" className="w-full bg-gray-900 border border-gray-600 rounded-md px-3 py-2 text-sm" />
                    </div>
                 );
            case 4: // RTMP
                return (
                     <div>
                        <h2 className="text-xl font-bold text-center mb-4">{es.wizardRTMPSourcesTitle}</h2>
                        <p className="text-center text-sm text-gray-400 mb-4">{es.wizardRTMPSourcesDesc}</p>
                        <input type="text" placeholder="rtmp://a.rtmp.youtube.com/live2" className="w-full bg-gray-900 border border-gray-600 rounded-md px-3 py-2 text-sm mb-2" />
                        <input type="text" placeholder="Stream Key" className="w-full bg-gray-900 border border-gray-600 rounded-md px-3 py-2 text-sm" />
                    </div>
                );
        }
    }

    return (
        <div className="fixed inset-0 bg-gray-900/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-gray-800 rounded-lg shadow-2xl w-full max-w-2xl max-h-[95vh] flex flex-col">
                <div className="p-6 border-b border-gray-700 text-center">
                    <h1 className="text-2xl font-bold text-white">{es.wizardTitle}</h1>
                    <p className="text-gray-400 mt-1">{es.wizardIntro}</p>
                </div>

                <div className="p-6 flex-grow min-h-0">
                    {renderStep()}
                </div>

                <div className="p-6 border-t border-gray-700 mt-auto flex justify-between items-center">
                    <div>Paso {step} de 4</div>
                    <div className="flex gap-2">
                        {step > 1 && <button onClick={() => setStep(s => s - 1)} className="px-4 py-2 bg-gray-600 text-white font-bold rounded-md">Atrás</button>}
                        {step < 4 && <button onClick={() => setStep(s => s + 1)} disabled={step === 1 && permissionStatus !== 'granted'} className="px-4 py-2 bg-blue-600 text-white font-bold rounded-md disabled:bg-gray-500">Siguiente</button>}
                        {step === 4 && <button onClick={handleFinish} className="px-6 py-3 bg-green-600 text-white font-bold rounded-md text-lg hover:bg-green-700">{es.launchStudio}</button>}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SetupWizard;
