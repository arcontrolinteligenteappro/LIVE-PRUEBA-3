
import React from 'react';
import { BroadcastSession } from '../../types';
import { Command } from './CommandBus';
import { es } from '../../localization';

interface SessionPanelProps {
    session: BroadcastSession;
    isLive: boolean;
    dispatch: (command: Command) => void;
}

const SessionPanel: React.FC<SessionPanelProps> = ({ session, isLive, dispatch }) => {
    
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        dispatch({
            type: 'SESSION_UPDATE_METADATA',
            payload: { [e.target.name]: e.target.value }
        });
    };

    const inputFields = [
        { name: 'eventName', label: es.eventName },
        { name: 'date', label: es.date, type: 'date' },
        { name: 'sport', label: es.sport },
        { name: 'venue', label: es.venue },
        { name: 'league', label: es.league },
        { name: 'homeTeam', label: es.homeTeam },
        { name: 'awayTeam', label: es.awayTeam },
        { name: 'sponsors', label: es.sponsors },
    ];

    return (
        <div className="space-y-4">
            <h3 className="text-lg font-bold text-white">{es.sessionPanelTitle}</h3>
            <p className="text-xs text-gray-400">
                Configure los datos de la transmisión antes de iniciar. Estos campos se bloquean al estar en vivo.
            </p>
            <fieldset disabled={isLive} className="space-y-3 p-3 bg-gray-700/50 rounded-lg disabled:opacity-60">
                {inputFields.map(field => (
                    <div key={field.name}>
                        <label htmlFor={field.name} className="block text-xs font-semibold text-gray-300 mb-1">{field.label}</label>
                        <input
                            type={field.type || 'text'}
                            id={field.name}
                            name={field.name}
                            value={session[field.name as keyof BroadcastSession]}
                            onChange={handleChange}
                            className="w-full bg-gray-900 border border-gray-600 rounded-md px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                ))}
            </fieldset>
        </div>
    );
};

export default SessionPanel;
