
import React from 'react';
import { Source, Scene } from '../../types';
import { Command } from '../console/CommandBus';

interface SourceBusProps {
    sources: (Source | Scene)[];
    previewId: string;
    programId: string;
    dispatch: (command: Command) => void;
}

const SourceBus: React.FC<SourceBusProps> = ({ sources, previewId, programId, dispatch }) => {
    
    const handleSelect = (id: string) => {
        dispatch({ type: 'SET_PREVIEW', payload: id });
    };

    const sourceButtons = sources.filter(s => 'isVisible' in s ? s.isVisible : true);

    return (
        <div className="bg-gray-800 p-2 rounded-lg flex-grow flex flex-col justify-center">
             <div className="grid grid-cols-5 gap-2">
                {sourceButtons.slice(0, 5).map(item => {
                    const isPreview = item.id === previewId;
                    const isProgram = item.id === programId;
                    let buttonClass = "font-bold py-4 rounded-lg transition-colors text-white text-sm ";
                    if (isProgram) buttonClass += "bg-red-600 ring-2 ring-red-400";
                    else if (isPreview) buttonClass += "bg-green-600 ring-2 ring-green-400";
                    else buttonClass += "bg-gray-700 hover:bg-gray-600";

                    return (
                        <button 
                            key={item.id} 
                            onClick={() => handleSelect(item.id)}
                            className={buttonClass}
                        >
                            {'items' in item ? 'SCN ' : ''}{item.name}
                        </button>
                    );
                })}
            </div>
        </div>
    );
};

export default SourceBus;
