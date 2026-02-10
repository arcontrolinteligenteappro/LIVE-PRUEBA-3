
import React from 'react';
import { BrandingState, BrandingElement, BrandingPosition } from '../types';
import { Command } from './console/CommandBus';

interface BrandingPanelProps {
    branding: BrandingState;
    dispatch: (command: Command) => void;
}

const positionOptions: BrandingPosition[] = ['top-left', 'top-right', 'bottom-left', 'bottom-right'];

const BrandingPanel: React.FC<BrandingPanelProps> = ({ branding, dispatch }) => {

    const handleUpdate = (type: 'logo' | 'text', values: Partial<BrandingElement>) => {
        const newBranding = {
            ...branding,
            [type]: { ...branding[type], ...values }
        };
        dispatch({ type: 'BRANDING_UPDATE', payload: newBranding });
    };

    return (
        <div className="space-y-6">
            <h3 className="text-lg font-bold text-white">Production Branding</h3>

            {/* Logo Watermark */}
            <div className="space-y-3 p-3 bg-gray-700/50 rounded-lg">
                <div className="flex items-center justify-between">
                    <h4 className="font-semibold">Logo Watermark</h4>
                    <button
                        onClick={() => handleUpdate('logo', { enabled: !branding.logo.enabled })}
                        className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors ${branding.logo.enabled ? 'bg-blue-600' : 'bg-gray-600'}`}
                    >
                        <span className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform ${branding.logo.enabled ? 'translate-x-6' : 'translate-x-1'}`} />
                    </button>
                </div>
                <div className={`space-y-3 ${!branding.logo.enabled && 'opacity-50 pointer-events-none'}`}>
                    <div>
                        <label className="text-xs font-semibold">Position</label>
                        <select 
                            value={branding.logo.position}
                            onChange={(e) => handleUpdate('logo', { position: e.target.value as BrandingPosition })}
                            className="w-full mt-1 bg-gray-900 border border-gray-600 rounded-md px-2 py-1 text-sm"
                        >
                            {positionOptions.map(p => <option key={p} value={p}>{p.replace('-', ' ')}</option>)}
                        </select>
                    </div>
                     <div>
                        <label className="text-xs font-semibold">Size ({branding.logo.size}%)</label>
                        <input type="range" min="5" max="30" value={branding.logo.size} onChange={e => handleUpdate('logo', { size: parseInt(e.target.value)})} className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer" />
                    </div>
                     <div>
                        <label className="text-xs font-semibold">Opacity ({Math.round(branding.logo.opacity * 100)}%)</label>
                        <input type="range" min="0" max="1" step="0.1" value={branding.logo.opacity} onChange={e => handleUpdate('logo', { opacity: parseFloat(e.target.value)})} className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer" />
                    </div>
                </div>
            </div>

            {/* Text Watermark */}
             <div className="space-y-3 p-3 bg-gray-700/50 rounded-lg">
                <div className="flex items-center justify-between">
                    <h4 className="font-semibold">Text Watermark</h4>
                    <button
                        onClick={() => handleUpdate('text', { enabled: !branding.text.enabled })}
                        className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors ${branding.text.enabled ? 'bg-blue-600' : 'bg-gray-600'}`}
                    >
                        <span className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform ${branding.text.enabled ? 'translate-x-6' : 'translate-x-1'}`} />
                    </button>
                </div>
                <div className={`space-y-3 ${!branding.text.enabled && 'opacity-50 pointer-events-none'}`}>
                     <div>
                        <label className="text-xs font-semibold">Text</label>
                        <input type="text" value={branding.text.content} onChange={e => handleUpdate('text', { content: e.target.value })} className="w-full mt-1 bg-gray-900 border border-gray-600 rounded-md px-3 py-2 text-sm" />
                    </div>
                    <div>
                        <label className="text-xs font-semibold">Position</label>
                        <select 
                             value={branding.text.position}
                             onChange={(e) => handleUpdate('text', { position: e.target.value as BrandingPosition })}
                             className="w-full mt-1 bg-gray-900 border border-gray-600 rounded-md px-2 py-1 text-sm"
                        >
                            {positionOptions.map(p => <option key={p} value={p}>{p.replace('-', ' ')}</option>)}
                        </select>
                    </div>
                     <div>
                        <label className="text-xs font-semibold">Opacity ({Math.round(branding.text.opacity * 100)}%)</label>
                        <input type="range" min="0" max="1" step="0.1" value={branding.text.opacity} onChange={e => handleUpdate('text', { opacity: parseFloat(e.target.value)})} className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer" />
                    </div>
                </div>
            </div>

        </div>
    );
};

export default BrandingPanel;