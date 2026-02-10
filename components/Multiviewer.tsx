
import React from 'react';
import { Source, Scene } from '../types';

interface MultiviewerProps {
    sources: (Source | Scene)[];
    programId: string;
    previewId: string;
    setPreviewId: (id: string) => void;
}

const Multiviewer: React.FC<MultiviewerProps> = ({ sources, programId, previewId, setPreviewId }) => {
    return (
        <div className="h-full">
            <h3 className="text-sm font-bold text-gray-400 uppercase mb-2">Sources</h3>
            <div className="grid grid-cols-2 gap-2">
                {sources.filter(s => 'isVisible' in s ? s.isVisible && s.type !== 'BLANK' : true).map(source => {
                    const isProgram = source.id === programId;
                    const isPreview = source.id === previewId;
                    let borderClass = 'border-gray-600';
                    if (isProgram) borderClass = 'border-red-600';
                    else if (isPreview) borderClass = 'border-green-600';
                    
                    return (
                        <button 
                            key={source.id}
                            onClick={() => setPreviewId(source.id)}
                            className={`relative aspect-video bg-black rounded overflow-hidden border-2 ${borderClass} transition-colors hover:border-yellow-400`}
                        >
                            <img src={`https://picsum.photos/seed/${source.id}/160/90`} className="object-cover w-full h-full" alt={source.name} />
                             <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white text-xs px-1 py-0.5 truncate">
                                {'items' in source ? 'S: ' : ''}{source.name}
                            </div>
                        </button>
                    );
                })}
            </div>
        </div>
    );
};

export default Multiviewer;
