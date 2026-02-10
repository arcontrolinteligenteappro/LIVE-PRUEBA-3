
import React, { useState } from 'react';
import { Scene, Source } from '../../types';
import { Command } from '../console/CommandBus';
import { IconPlus, IconTrash } from '../Icons';

interface SceneEditorProps {
    scenes: Scene[];
    sources: Source[];
    dispatch: (command: Command) => void;
}

const SceneEditor: React.FC<SceneEditorProps> = ({ scenes, sources, dispatch }) => {
    const [selectedSceneId, setSelectedSceneId] = useState<string | null>(scenes[0]?.id || null);
    const [selectedItemId, setSelectedItemId] = useState<string | null>(null);

    const selectedScene = scenes.find(s => s.id === selectedSceneId);
    const selectedItem = selectedScene?.items.find(i => i.id === selectedItemId);

    const handleUpdateLayer = (values: Partial<Scene['items'][0]>) => {
        if (selectedSceneId && selectedItemId) {
            dispatch({ type: 'SCENE_UPDATE_LAYER', payload: { sceneId: selectedSceneId, itemId: selectedItemId, values }});
        }
    };
    
     const handleUpdateTransform = (key: keyof Scene['items'][0]['transform'], value: number) => {
        if (selectedItem) {
            handleUpdateLayer({ transform: { ...selectedItem.transform, [key]: value } });
        }
    };
    
    const handleUpdateProperties = (key: keyof Scene['items'][0]['properties'], value: number) => {
        if (selectedItem) {
            handleUpdateLayer({ properties: { ...selectedItem.properties, [key]: value } });
        }
    };

    return (
        <div className="h-full flex flex-col space-y-2">
            <div className="flex space-x-2">
                <select value={selectedSceneId || ''} onChange={e => setSelectedSceneId(e.target.value)} className="w-full bg-gray-900 border border-gray-600 rounded px-2 py-1 text-sm">
                    {scenes.map(scene => <option key={scene.id} value={scene.id}>{scene.name}</option>)}
                </select>
                <button onClick={() => dispatch({type: 'SCENE_ADD', payload: { name: `Escena ${scenes.length + 1}`}})} className="p-1.5 bg-blue-600 rounded"><IconPlus className="w-4 h-4"/></button>
            </div>
            {selectedScene && (
                 <div className="flex-grow flex flex-col space-y-2 min-h-0">
                    <div className="flex-shrink-0">
                         <h5 className="font-bold text-xs uppercase text-gray-400">Capas en "{selectedScene.name}"</h5>
                         <div className="flex space-x-2 mt-1">
                            <select onChange={e => dispatch({type: 'SCENE_ADD_LAYER', payload: { sceneId: selectedScene.id, sourceId: e.target.value}})} className="w-full bg-gray-700 p-1 rounded text-xs" value="">
                                <option value="" disabled>+ Añadir Fuente a Escena</option>
                                {sources.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                            </select>
                         </div>
                    </div>
                    <div className="flex-grow space-y-1 overflow-y-auto">
                        {selectedScene.items.map(item => {
                            const source = sources.find(s => s.id === item.sourceId);
                            return (
                                <div key={item.id} onClick={() => setSelectedItemId(item.id)} className={`flex items-center justify-between p-1 rounded cursor-pointer text-xs ${selectedItemId === item.id ? 'bg-blue-600/50' : 'bg-gray-900/50'}`}>
                                    <span>{source?.name || 'Fuente Desconocida'}</span>
                                    <button onClick={(e) => { e.stopPropagation(); dispatch({type: 'SCENE_REMOVE_LAYER', payload: { sceneId: selectedScene.id, itemId: item.id}})}} className="p-1 hover:bg-red-500/50 rounded-full"><IconTrash className="w-3 h-3"/></button>
                                </div>
                            );
                        })}
                    </div>
                 </div>
            )}
             {selectedItem && (
                <div className="flex-shrink-0 space-y-2 text-xs">
                     <h5 className="font-bold text-xs uppercase text-gray-400">Propiedades de Capa</h5>
                     <div>
                        <label>Opacidad</label>
                        <input type="range" min="0" max="1" step="0.05" value={selectedItem.properties.opacity} onChange={e => handleUpdateProperties('opacity', parseFloat(e.target.value))} className="w-full h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer" />
                     </div>
                     <div className="grid grid-cols-2 gap-1">
                        <div><label>X:</label><input type="number" value={selectedItem.transform.x} onChange={e => handleUpdateTransform('x', parseInt(e.target.value))} className="w-full bg-gray-900 rounded px-1 text-xs"/></div>
                        <div><label>Y:</label><input type="number" value={selectedItem.transform.y} onChange={e => handleUpdateTransform('y', parseInt(e.target.value))} className="w-full bg-gray-900 rounded px-1 text-xs"/></div>
                        <div><label>W:</label><input type="number" value={selectedItem.transform.width} onChange={e => handleUpdateTransform('width', parseInt(e.target.value))} className="w-full bg-gray-900 rounded px-1 text-xs"/></div>
                        <div><label>H:</label><input type="number" value={selectedItem.transform.height} onChange={e => handleUpdateTransform('height', parseInt(e.target.value))} className="w-full bg-gray-900 rounded px-1 text-xs"/></div>
                     </div>
                </div>
            )}
        </div>
    );
};

export default SceneEditor;
