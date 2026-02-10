
import React from 'react';
import { VJMixerState, Source } from '../types';
import { es } from '../localization';
import { Command } from './console/CommandBus';

interface VJMixerPanelProps {
    vjMixerState: VJMixerState;
    sources: Source[];
    previewId: string;
    dispatch: (command: Command) => void;
}

const VJMixerPanel: React.FC<VJMixerPanelProps> = ({ vjMixerState, sources, previewId, dispatch }) => {
    const deckASource = sources.find(s => s.id === vjMixerState.deckA);
    const deckBSource = sources.find(s => s.id === vjMixerState.deckB);

    const assignPreviewToDeck = (deck: 'deckA' | 'deckB') => {
        dispatch({ type: 'VJMixer_ASSIGN_DECK', payload: { deck, sourceId: previewId } });
    };

    const clearDeck = (deck: 'deckA' | 'deckB') => {
        dispatch({ type: 'VJMixer_CLEAR_DECK', payload: { deck } });
    };

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <h3 className="text-lg font-bold text-white">{es.vjMixerTitle}</h3>
                <div className="flex items-center space-x-2">
                    <span className="text-xs font-semibold">{vjMixerState.mode === 'transition' ? 'Modo Transición' : 'Modo VJ'}</span>
                    <button onClick={() => dispatch({type: 'VJMixer_SET_MODE', payload: vjMixerState.mode === 'transition' ? 'vj' : 'transition'})} className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors ${vjMixerState.mode === 'vj' ? 'bg-blue-600' : 'bg-gray-600'}`}>
                        <span className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform ${vjMixerState.mode === 'vj' ? 'translate-x-6' : 'translate-x-1'}`} />
                    </button>
                </div>
            </div>
            
            <div className={`p-4 bg-gray-700/50 rounded-lg space-y-4 ${vjMixerState.mode === 'transition' ? 'opacity-50 pointer-events-none' : ''}`}>
                <div className="grid grid-cols-2 gap-4">
                    <div className="text-center">
                        <div className="font-bold text-blue-400 mb-2">{es.deckA}</div>
                        <div className="h-16 bg-gray-900/50 rounded flex items-center justify-center text-sm p-2 truncate">{deckASource?.name || 'Vacío'}</div>
                        <button onClick={() => clearDeck('deckA')} className="text-xs text-red-400 mt-1">{es.clearDeck}</button>
                    </div>
                    <div className="text-center">
                        <div className="font-bold text-green-400 mb-2">{es.deckB}</div>
                        <div className="h-16 bg-gray-900/50 rounded flex items-center justify-center text-sm p-2 truncate">{deckBSource?.name || 'Vacío'}</div>
                        <button onClick={() => clearDeck('deckB')} className="text-xs text-red-400 mt-1">{es.clearDeck}</button>
                    </div>
                </div>

                 <div className="flex items-center space-x-2">
                    <button onClick={() => assignPreviewToDeck('deckA')} className="w-full p-2 bg-blue-600 text-xs font-bold rounded">{es.assignToDeckA}</button>
                    <button onClick={() => assignPreviewToDeck('deckB')} className="w-full p-2 bg-green-600 text-xs font-bold rounded">{es.assignToDeckB}</button>
                </div>

                <div>
                    <input type="range" min="-1" max="1" step="0.01" value={vjMixerState.crossfade} onChange={e => dispatch({type: 'VJMixer_SET_CROSSFADE', payload: parseFloat(e.target.value)})} className="w-full h-3 bg-gray-900 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:w-2 [&::-webkit-slider-thumb]:bg-red-500" />
                </div>
            </div>
        </div>
    );
};

export default VJMixerPanel;