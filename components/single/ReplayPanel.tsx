
import React from 'react';
import { ReplayState } from '../../types';
import { Command } from '../console/CommandBus';
import { es } from '../../localization';

const ReplayPanel: React.FC<{
    replayState: ReplayState;
    dispatch: (command: Command) => void;
}> = ({ replayState, dispatch }) => {
    return (
        <div className="p-4 space-y-3">
            <h4 className="font-bold text-center text-sm">{es.replayTitle}</h4>
            <div className="grid grid-cols-3 gap-2">
                <button onClick={() => dispatch({ type: 'REPLAY_TRIGGER', payload: { duration: 5 } })} className="p-3 bg-gray-700 hover:bg-gray-600 rounded font-semibold text-xs">REPLAY 5s</button>
                <button onClick={() => dispatch({ type: 'REPLAY_TRIGGER', payload: { duration: 10 } })} className="p-3 bg-gray-700 hover:bg-gray-600 rounded font-semibold text-xs">REPLAY 10s</button>
                <button onClick={() => dispatch({ type: 'REPLAY_TRIGGER', payload: { duration: 15 } })} className="p-3 bg-gray-700 hover:bg-gray-600 rounded font-semibold text-xs">REPLAY 15s</button>
            </div>
            <div className="grid grid-cols-3 gap-2">
                <button className="p-3 bg-gray-700 rounded font-semibold text-xs">Play/Pause</button>
                <button onClick={() => dispatch({ type: 'REPLAY_TOGGLE_SLOMO' })} className={`p-3 rounded font-semibold text-xs transition-colors ${replayState.isSlowMo ? 'bg-blue-600' : 'bg-gray-700'}`}>0.5x</button>
                <button onClick={() => dispatch({ type: 'REPLAY_RETURN_LIVE' })} className="p-3 bg-green-600 rounded font-semibold text-xs">Return LIVE</button>
            </div>
             <p className="text-xs text-gray-400 text-center pt-2">El Replay se ejecuta sobre PGM sin interrumpir la transmisión.</p>
        </div>
    );
};

export default ReplayPanel;
