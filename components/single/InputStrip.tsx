
import React from 'react';
import { Source, Scene } from '../../types';
import { Command } from '../console/CommandBus';

interface InputStripProps {
    sources: (Source | Scene)[];
    previewId: string;
    programId: string;
    dispatch: (command: Command) => void;
}

const InputStrip: React.FC<InputStripProps> = ({ sources, previewId, programId, dispatch }) => {
    const handleSelect = (id: string) => {
        dispatch({ type: 'SET_PREVIEW', payload: id });
    };

    return (
        <div className="bg-gray-800 p-2 rounded-lg">
            <div className="flex space-x-2 overflow-x-auto">
                {sources.filter(s => 'isVisible' in s ? s.isVisible : true).map(item => {
                    const isPreview = item.id === previewId;
                    const isProgram = item.id === programId;
                    let borderClass = 'border-transparent';
                    if (isProgram) borderClass = 'border-red-600';
                    else if (isPreview) borderClass = 'border-green-600';

                    return (
                        <button 
                            key={item.id} 
                            onClick={() => handleSelect(item.id)}
                            className={`relative flex-shrink-0 w-32 h-20 bg-black rounded overflow-hidden border-2 ${borderClass} transition-all`}
                        >
                            <img src={`https://picsum.photos/seed/${item.id}/128/80`} className="object-cover w-full h-full" alt={item.name}/>
                            <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white text-xs px-1 py-0.5 truncate">
                                {'items' in item ? 'S: ' : ''}{item.name}
                            </div>
                        </button>
                    );
                })}
            </div>
        </div>
    );
};

export default InputStrip;
