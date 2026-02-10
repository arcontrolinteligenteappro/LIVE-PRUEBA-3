
import React, { useState } from 'react';
import { Source, SourceType, Scene } from '../types';
import { IconTrash, IconEye, IconEyeOff, IconPlus, IconEdit, IconSignal, IconSource, IconBranding, IconOverlay } from './Icons';
import { es } from '../localization';
import { getAvailableCameras, getAvailableMicrophones } from '../utils/webcam';

interface SourceManagerProps {
    sources: Source[];
    addSource: (source: Source) => void;
    updateSource: (id: string, newValues: Partial<Source>) => void;
    removeSource: (id: string) => void;
}

const SourceTypeIcon: React.FC<{type: SourceType | 'Scene'}> = ({ type }) => {
    switch (type) {
        case SourceType.INTERNAL:
        case SourceType.USB:
        case SourceType.NDI:
        case SourceType.PTZ_CAM:
            return <IconSource className="w-4 h-4 text-blue-400" title="Cámara"/>;
        case SourceType.IMAGE:
            return <IconBranding className="w-4 h-4 text-purple-400" title="Imagen"/>;
        case SourceType.TEXT:
            return <span className="text-lg font-black text-purple-400">T</span>;
        case 'Scene':
             return <IconOverlay className="w-4 h-4 text-yellow-400" title="Escena"/>;
        default:
            return <IconSource className="w-4 h-4 text-gray-400"/>;
    }
}

const SourceManager: React.FC<SourceManagerProps> = ({ sources, addSource, updateSource, removeSource }) => {
    const [editingId, setEditingId] = useState<string | null>(null);
    const [newName, setNewName] = useState('');

    const handleAddSource = () => {
        const id = `source-${Date.now()}`;
        addSource({ id, name: `Nueva Fuente ${sources.length + 1}`, type: SourceType.RTSP, isVisible: true });
    };

    const handleRescan = async () => {
        alert("Volviendo a escanear dispositivos. En una app real, los nuevos dispositivos se añadirían a esta lista.");
        const cameras = await getAvailableCameras();
        const mics = await getAvailableMicrophones();
        console.log("Dispositivos encontrados:", { cameras, mics });
        // Aquí iría la lógica para comparar con `sources` y `audioSources` y despachar `SOURCE_ADD` para los nuevos.
    };

    const handleStartEdit = (source: Source) => { setEditingId(source.id); setNewName(source.name); };
    const handleConfirmEdit = () => { if (editingId && newName) { updateSource(editingId, { name: newName }); } setEditingId(null); setNewName(''); };

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <h3 className="text-lg font-bold text-white">{es.sourceManagerTitle}</h3>
                <div className="flex gap-2">
                     <button onClick={handleRescan} className="px-3 py-1 bg-gray-600 text-white rounded-md text-sm font-semibold hover:bg-gray-700">
                        Re-escanear
                    </button>
                    <button onClick={handleAddSource} className="flex items-center space-x-2 px-3 py-1 bg-blue-600 text-white rounded-md text-sm font-semibold hover:bg-blue-700">
                        <IconPlus className="w-4 h-4" /><span>{es.add} IP</span>
                    </button>
                </div>
            </div>
            <div className="space-y-2">
                {sources.map(source => (
                    <div key={source.id} className="flex items-center p-2 bg-gray-700/50 rounded-lg space-x-3">
                        <SourceTypeIcon type={source.type} />
                        {editingId === source.id ? (
                            <input type="text" value={newName} onChange={(e) => setNewName(e.target.value)} onBlur={handleConfirmEdit} onKeyDown={(e) => e.key === 'Enter' && handleConfirmEdit()} className="flex-grow bg-gray-900 border border-blue-500 rounded-md px-2 py-1 text-sm" autoFocus/>
                        ) : ( <span className="flex-grow font-semibold truncate">{source.name}</span> )}
                        <div className="flex items-center space-x-1">
                            <button onClick={() => handleStartEdit(source)} className="p-2 text-gray-300 hover:text-white hover:bg-gray-600 rounded-full"><IconEdit className="w-4 h-4"/></button>
                            <button onClick={() => updateSource(source.id, { isVisible: !source.isVisible })} className="p-2 text-gray-300 hover:text-white hover:bg-gray-600 rounded-full">{source.isVisible ? <IconEye className="w-4 h-4"/> : <IconEyeOff className="w-4 h-4" />}</button>
                            <button onClick={() => removeSource(source.id)} className="p-2 text-gray-300 hover:text-white hover:bg-gray-600 rounded-full"><IconTrash className="w-4 h-4 text-red-500"/></button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default SourceManager;
