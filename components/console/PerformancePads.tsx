
import React from 'react';
import { ProductionMode, ScoreboardState, ScoreboardEvent } from '../../types';
import { Command } from './CommandBus';
import { es } from '../../localization';
import { loadScoreboardState } from '../../data/sports';

const ButtonGroup: React.FC<{
    title: string;
    events: string[];
    onEvent: (event: string) => void;
    className?: string;
}> = ({ title, events, onEvent, className }) => (
    <div className="mb-4">
        <div className="text-[10px] font-black uppercase text-gray-500 tracking-tighter mb-2 border-b border-gray-700 pb-1">{title}</div>
        <div className="grid grid-cols-2 gap-2">
            {events.map(event => (
                <button
                    key={event}
                    onClick={() => onEvent(event)}
                    className={`p-3 rounded-md text-xs font-black uppercase shadow-inner active:brightness-125 active:scale-95 transition-all ${className}`}
                >
                    {es.sportEvents[event] || event.replace(/_/g, ' ')}
                </button>
            ))}
        </div>
    </div>
);

const SportsPads: React.FC<{
    dispatch: (c: Command) => void;
    scoreboardState: ScoreboardState;
}> = ({ dispatch, scoreboardState }) => {
    
    if (!scoreboardState) return null;

    const handleSportEvent = (actionId: string) => {
        const newState = JSON.parse(JSON.stringify(scoreboardState));
        const action = scoreboardState.actions[actionId];

        // 1. Aplicar Deltas Numéricos
        if (action?.delta) {
            const apply = (target: any, delta: any) => {
                for (const key in delta) {
                    if (typeof delta[key] === 'object' && target[key]) apply(target[key], delta[key]);
                    else if (typeof target[key] === 'number') target[key] += delta[key];
                }
            };
            apply(newState, action.delta);
        }

        // 2. Aplicar Toggles
        if (action?.toggle) {
            const parts = action.toggle.split('.');
            let curr = newState;
            for (let i = 0; i < parts.length - 1; i++) curr = curr[parts[i]];
            curr[parts[parts.length - 1]] = !curr[parts[parts.length - 1]];
        }

        // 3. Acciones de Reloj y Sistema
        switch(actionId) {
            case 'START_STOP_CLOCK': newState.clock.running = !newState.clock.running; break;
            case 'RESET_MATCH': 
                if(confirm("¿Reiniciar todo el partido?")) {
                    dispatch({ type: 'SCOREBOARD_SET_STATE', payload: loadScoreboardState(scoreboardState.sportId) });
                }
                return;
        }
        
        // Registrar Evento en Log (P3 Meta-data)
        const newEvent: ScoreboardEvent = { 
            type: actionId, 
            timestamp: new Date().toISOString(), 
            payload: action || {} 
        };
        newState.events.push(newEvent);

        dispatch({ type: 'SCOREBOARD_SET_STATE', payload: newState });
    };

    return (
        <div className="pb-20">
            <ButtonGroup 
                title="Acciones de Juego"
                events={scoreboardState.ui.primaryActions}
                onEvent={handleSportEvent}
                className="bg-blue-600 text-white"
            />
            <ButtonGroup 
                title="Gestión Técnica"
                events={scoreboardState.ui.secondaryActions}
                onEvent={handleSportEvent}
                className="bg-gray-700 text-gray-300"
            />
            
            {/* Visualizadores Especiales de Deporte */}
            {scoreboardState.sportId === 'baseball' && (
                <div className="mt-4 p-4 bg-black/40 rounded-lg flex justify-around items-center">
                    <div className="text-center">
                        <div className="text-[10px] text-gray-500 font-bold">BALLS</div>
                        <div className="text-2xl font-black text-yellow-400">{scoreboardState.count?.balls}</div>
                    </div>
                    <div className="relative w-16 h-16 border-2 border-gray-700 rotate-45 flex items-center justify-center">
                        <div className={`w-4 h-4 absolute -top-2 -left-2 rotate-45 ${scoreboardState.bases?.second ? 'bg-orange-500' : 'bg-gray-800'}`}></div>
                        <div className={`w-4 h-4 absolute -bottom-2 -left-2 rotate-45 ${scoreboardState.bases?.third ? 'bg-orange-500' : 'bg-gray-800'}`}></div>
                        <div className={`w-4 h-4 absolute -top-2 -right-2 rotate-45 ${scoreboardState.bases?.first ? 'bg-orange-500' : 'bg-gray-800'}`}></div>
                    </div>
                    <div className="text-center">
                        <div className="text-[10px] text-gray-500 font-bold">OUTS</div>
                        <div className="text-2xl font-black text-red-500">{scoreboardState.outs}</div>
                    </div>
                </div>
            )}
        </div>
    );
};

const PerformancePads: React.FC<{
    productionMode: ProductionMode;
    dispatch: (command: Command) => void;
    scoreboardState: ScoreboardState;
}> = ({ productionMode, dispatch, scoreboardState }) => {
    return (
        <div className="h-full flex flex-col">
             <div className="flex-grow">
                {productionMode === ProductionMode.SPORTS ? (
                    <SportsPads dispatch={dispatch} scoreboardState={scoreboardState} />
                ) : (
                    <div className="h-full flex items-center justify-center text-gray-500 italic text-sm">
                        Modo {productionMode} no tiene pads asignados.
                    </div>
                )}
             </div>
        </div>
    );
};

export default PerformancePads;
