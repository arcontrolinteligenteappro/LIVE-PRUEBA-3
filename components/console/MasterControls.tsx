
import React from 'react';
import { Command } from './CommandBus';
import { es } from '../../localization';
import { IconRecord, IconBroadcast } from '../Icons';

interface MasterControlsProps {
    isLive: boolean;
    isRecording: boolean;
    dispatch: (command: Command) => void;
}

const MasterControls: React.FC<MasterControlsProps> = ({ isLive, isRecording, dispatch }) => {
    return (
        <div className="flex justify-between items-center gap-2 flex-shrink-0">
            <button onClick={() => dispatch({ type: 'SYSTEM_TRIGGER_FAILSAFE' })} className="px-4 py-2 text-sm font-bold bg-yellow-600 hover:bg-yellow-700 text-black rounded-md">
                SAFE SCENE
            </button>
            <div className="flex items-center gap-2">
                <button onClick={() => dispatch({ type: 'MASTER_TOGGLE_RECORD' })} className={`flex items-center space-x-1.5 px-3 py-1.5 text-xs font-semibold rounded-md ${isRecording ? 'bg-red-500 text-white animate-pulse' : 'bg-gray-600 text-gray-300'}`}>
                    <IconRecord className="w-4 h-4" /><span>{es.rec}</span>
                </button>
                <div className={`flex items-center space-x-1.5 px-3 py-1.5 text-xs font-semibold rounded-md ${isLive ? 'bg-red-700 text-white animate-pulse' : 'bg-gray-600 text-gray-300'}`}>
                    <IconBroadcast className="w-4 h-4" /><span>{isLive ? es.live : es.offline}</span>
                </div>
                <button onClick={() => dispatch({ type: 'MASTER_GO_LIVE' })} className={`px-4 py-2 text-sm font-bold text-white rounded-md transition-colors ${isLive ? 'bg-red-800 hover:bg-red-900' : 'bg-green-600 hover:bg-green-700'}`}>
                    {isLive ? es.stop : es.goLive}
                </button>
            </div>
        </div>
    );
};

export default MasterControls;
