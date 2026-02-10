
import React, { useState } from 'react';
import { Scene, Source, SceneItem } from '../types';
import { IconTrash } from './Icons';

interface SceneComposerProps {
    scenes: Scene[];
    sources: Source[];
    previewId: string;
    programId: string;
    setPreviewId: (id: string) => void;
    updateSceneItem: (sceneId: string, itemId: string, newTransform: Partial<SceneItem['transform']>, newProperties: Partial<SceneItem['properties']>) => void;
    addSourceToScene: (sceneId: string, sourceId: string) => void;
    removeSceneItem: (sceneId: string, itemId: string) => void;
}

const LayerPropertiesPanel: React.FC<{
    item: SceneItem;
    sceneId: string;
    updateSceneItem: SceneComposerProps['updateSceneItem'];
}> = ({ item, sceneId, updateSceneItem }) => {

    const handleTransformChange = (key: keyof SceneItem['transform'], value: string) => {
        updateSceneItem(sceneId, item.id, { [key]: parseInt(value) || 0 }, {});
    };
    
    const handleOpacityChange = (value: string) => {
        updateSceneItem(sceneId, item.id, {}, { opacity: parseFloat(value) || 0 });
    }

    return (
        <div className="bg-gray-900/50 p-2 rounded-md space-y-2">
             <div className="grid grid-cols-2 gap-2 text-sm">
                <div><label>X:</label><input type="number" value={item.transform.x} onChange={e => handleTransformChange('x', e.target.value)} className="w-full bg-gray-700 rounded px-1"/></div>
                <div><label>Y:</label><input type="number" value={item.transform.y} onChange={e => handleTransformChange('y', e.target.value)} className="w-full bg-gray-700 rounded px-1"/></div>
                <div><label>W:</label><input type="number" value={item.transform.width} onChange={e => handleTransformChange('width', e.target.value)} className="w-full bg-gray-700 rounded px-1"/></div>
                <div><label>H:</label><input type="number" value={item.transform.height} onChange={e => handleTransformChange('height', e.target.value)} className="w-full bg-gray-700 rounded px-1"/></div>
             </div>
             <div>
                <label>Opacity:</label>
                <input type="range" min="0" max="1" step="0.05" value={item.properties.opacity} onChange={e => handleOpacityChange(e.target.value)} className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer" />
             </div>
        </div>
    );
};

const SceneComposer: React.FC<SceneComposerProps> = (props) => {
    const [selectedLayerId, setSelectedLayerId] = useState<string | null>(null);
    const previewScene = props.scenes.find(s => s.id === props.previewId);

    const handleSelectScene = (sceneId: string) => {
        props.setPreviewId(sceneId);
        setSelectedLayerId(null);
    }
    
    return (
        <div className="grid grid-cols-12 gap-4 h-full">
            {/* Scenes List */}
            <div className="col-span-4 h-full flex flex-col space-y-2">
                <h3 className="text-sm font-bold text-gray-400 uppercase flex-shrink-0">Scenes</h3>
                <div className="flex-grow space-y-1 overflow-y-auto">
                    {props.scenes.map(scene => {
                        const isPreview = scene.id === props.previewId;
                        const isProgram = scene.id === props.programId;
                        let buttonClass = "w-full p-2 text-left text-xs rounded transition-colors ";
                        if (isProgram) buttonClass += "bg-red-700 text-white font-bold";
                        else if (isPreview) buttonClass += "bg-green-700 text-white font-semibold";
                        else buttonClass += "bg-gray-700 hover:bg-gray-600 text-gray-200";
                        return <button key={scene.id} onClick={() => handleSelectScene(scene.id)} className={buttonClass}>{scene.name}</button>;
                    })}
                </div>
            </div>

            {/* Layers List for Previewed Scene */}
            <div className="col-span-8 h-full flex flex-col">
                 <h3 className="text-sm font-bold text-gray-400 uppercase flex-shrink-0">Layers: {previewScene?.name || 'None'}</h3>
                 <div className="flex-grow space-y-1 overflow-y-auto mt-2 pr-2">
                    {previewScene && previewScene.items.map(item => {
                         const source = props.sources.find(s => s.id === item.sourceId);
                         return (
                            <div key={item.id}>
                                <div onClick={() => setSelectedLayerId(item.id)} className={`flex items-center justify-between p-2 rounded cursor-pointer ${selectedLayerId === item.id ? 'bg-blue-600/50' : 'bg-gray-700/50'}`}>
                                    <span className="text-xs font-semibold">{source?.name || 'Unknown Source'}</span>
                                    <div className="flex items-center">
                                       <button onClick={(e) => { e.stopPropagation(); props.removeSceneItem(previewScene.id, item.id);}} className="p-1 hover:bg-red-500/50 rounded-full"><IconTrash className="w-4 h-4"/></button>
                                    </div>
                                </div>
                                {selectedLayerId === item.id && (
                                    <LayerPropertiesPanel item={item} sceneId={previewScene.id} updateSceneItem={props.updateSceneItem} />
                                )}
                            </div>
                         )
                    })}
                 </div>
                 {previewScene && (
                    <div className="flex-shrink-0 mt-2">
                        <select onChange={e => props.addSourceToScene(previewScene.id, e.target.value)} className="w-full bg-gray-600 text-white p-2 text-xs rounded" value="">
                            <option value="" disabled>+ Add Source to Scene...</option>
                            {props.sources.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                        </select>
                    </div>
                 )}
            </div>
        </div>
    );
};

export default SceneComposer;
