
import React, { useState } from 'react';
import { Overlay, OverlayType } from '../types';
import { generateTitleForName } from '../services/geminiService';
import { IconAi, IconTrash, IconEye, IconEyeOff } from './Icons';

interface OverlayManagerProps {
  overlays: Overlay[];
  addOverlay: (overlay: Overlay) => void;
  toggleOverlay: (id: string) => void;
  removeOverlay: (id: string) => void;
}

const overlayLayers: { layer: string, type: OverlayType, title: string }[] = [
    { layer: 'L1', type: OverlayType.LOWER_THIRD, title: 'Lower Thirds' },
    { layer: 'L2', type: OverlayType.SCOREBOARD, title: 'Scoreboard' },
    { layer: 'L3', type: OverlayType.SPONSOR, title: 'Sponsor Logos' },
    { layer: 'L4', type: OverlayType.COMMENT, title: 'Comment/Chat' },
    { layer: 'L5', type: OverlayType.REPLAY, title: 'Alerts / Replay' },
];

const OverlayLayer: React.FC<{
    title: string;
    layer: string;
    overlays: Overlay[];
    toggleOverlay: (id: string) => void;
    removeOverlay: (id: string) => void;
}> = ({ title, layer, overlays, toggleOverlay, removeOverlay }) => {
    return (
        <div>
            <h4 className="font-bold text-sm mb-1"><span className="bg-gray-900 px-2 py-1 rounded-md mr-2">{layer}</span>{title}</h4>
            <div className="space-y-1 pl-10">
                {overlays.length === 0 ? (
                     <p className="text-xs text-gray-500 italic">No hay overlays en esta capa.</p>
                ) : (
                    overlays.map(overlay => (
                        <div key={overlay.id} className="flex items-center justify-between p-1.5 bg-gray-700/50 rounded-md">
                            <div className="flex-grow text-xs">
                                <p className="font-semibold">{overlay.content.title || overlay.type}</p>
                                {overlay.content.subtitle && <p className="text-gray-400">{overlay.content.subtitle}</p>}
                            </div>
                            <div className="flex items-center space-x-1">
                                <button onClick={() => toggleOverlay(overlay.id)} className="p-1.5 text-gray-300 hover:text-white hover:bg-gray-600 rounded-full">
                                    {overlay.active ? <IconEye className="w-4 h-4 text-green-400"/> : <IconEyeOff className="w-4 h-4" />}
                                </button>
                                <button onClick={() => removeOverlay(overlay.id)} className="p-1.5 text-gray-300 hover:text-white hover:bg-gray-600 rounded-full">
                                    <IconTrash className="w-4 h-4 text-red-500"/>
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};


const OverlayManager: React.FC<OverlayManagerProps> = ({ overlays, addOverlay, toggleOverlay, removeOverlay }) => {
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const handleAddLowerThird = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title) return;
    const newOverlay: Overlay = {
      id: `overlay-${Date.now()}`,
      type: OverlayType.LOWER_THIRD,
      content: { title, subtitle },
      active: false,
    };
    addOverlay(newOverlay);
    setTitle('');
    setSubtitle('');
  };

  const handleGenerateSubtitle = async () => {
    if (!title) return;
    setIsGenerating(true);
    const generatedSubtitle = await generateTitleForName(title);
    setSubtitle(generatedSubtitle);
    setIsGenerating(false);
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-bold text-white mb-2">Create Lower Third (L1)</h3>
        <form onSubmit={handleAddLowerThird} className="space-y-3 p-3 bg-gray-700/50 rounded-lg">
          <input
            type="text"
            placeholder="Title / Name"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full bg-gray-900 border border-gray-600 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <div className="flex space-x-2">
             <input
                type="text"
                placeholder="Subtitle / Description"
                value={subtitle}
                onChange={(e) => setSubtitle(e.target.value)}
                className="w-full bg-gray-900 border border-gray-600 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="button"
                onClick={handleGenerateSubtitle}
                disabled={isGenerating || !title}
                className="flex-shrink-0 px-3 py-2 bg-blue-600 text-white rounded-md text-sm font-semibold hover:bg-blue-700 disabled:bg-gray-500 disabled:cursor-not-allowed flex items-center"
              >
                <IconAi className={`w-5 h-5 ${isGenerating ? 'animate-spin' : ''}`} />
              </button>
          </div>
          <button
            type="submit"
            className="w-full px-4 py-2 bg-indigo-600 text-white rounded-md text-sm font-semibold hover:bg-indigo-700 disabled:bg-gray-500"
            disabled={!title}
          >
            Add Overlay
          </button>
        </form>
      </div>
      
      <div>
        <h3 className="text-lg font-bold text-white mb-2">Overlay Layers</h3>
        <div className="space-y-3">
           {overlayLayers.map(layerInfo => (
               <OverlayLayer 
                    key={layerInfo.layer}
                    layer={layerInfo.layer}
                    title={layerInfo.title}
                    overlays={overlays.filter(o => o.type === layerInfo.type)}
                    toggleOverlay={toggleOverlay}
                    removeOverlay={removeOverlay}
               />
           ))}
        </div>
      </div>
    </div>
  );
};

export default OverlayManager;
