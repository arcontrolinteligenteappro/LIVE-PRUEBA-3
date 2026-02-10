
import React from 'react';
import { Command } from '../console/CommandBus';
import { IconCut, IconFade, IconBroadcast, IconRecord, IconLock, IconOverlay } from '../Icons';
import { es } from '../../localization';
import { SingleModePanel } from '../../types';

interface SingleModeFixedBarProps {
    micLock: boolean;
    dispatch: (command: Command) => void;
}

const SingleModeFixedBar: React.FC<SingleModeFixedBarProps> = ({ micLock, dispatch }) => {
    const buttons = [
        { id: 'cut', label: 'CUT', icon: <IconCut className="w-5 h-5"/>, command: { type: 'SWITCHER_CUT' } as Command },
        { id: 'auto', label: 'AUTO', icon: <IconFade className="w-5 h-5"/>, command: { type: 'SWITCHER_AUTO' } as Command },
        { id: 'stream', label: es.live, icon: <IconBroadcast className="w-5 h-5"/>, command: { type: 'MASTER_GO_LIVE' } as Command },
        { id: 'record', label: es.rec, icon: <IconRecord className="w-5 h-5"/>, command: { type: 'MASTER_TOGGLE_RECORD' } as Command },
        { id: 'miclock', label: 'Mic', icon: <IconLock className="w-5 h-5"/>, command: { type: 'CONSOLE_TOGGLE_MIC_LOCK' } as Command, active: micLock },
        { id: 'overlays', label: 'Capas', icon: <IconOverlay className="w-5 h-5"/>, command: { type: 'UI_TOGGLE_SINGLE_MODE_PANEL', payload: SingleModePanel.OVERLAYS } as Command },
        { id: 'more', label: 'Más', icon: <span className="font-bold">...</span>, command: { type: 'UI_TOGGLE_SINGLE_MODE_PANEL', payload: SingleModePanel.PERFORMANCE } as Command },
    ];

    return (
        <div className="bg-gray-800 p-1 rounded-lg grid grid-cols-7 gap-1">
            {buttons.map(btn => (
                <button
                    key={btn.id}
                    onClick={() => dispatch(btn.command)}
                    className={`flex flex-col items-center justify-center p-2 rounded-md transition-colors h-16
                        ${btn.active ? 'bg-yellow-500 text-black' : 'bg-gray-700 hover:bg-gray-600 text-gray-200'}
                    `}
                >
                    {btn.icon}
                    <span className="text-xs font-semibold mt-1">{btn.label}</span>
                </button>
            ))}
        </div>
    );
};

export default SingleModeFixedBar;
