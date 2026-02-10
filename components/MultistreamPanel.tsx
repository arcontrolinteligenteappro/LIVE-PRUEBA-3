
import React, { useState, useEffect } from 'react';
import { StreamDestination } from '../types';
import { IconYouTube, IconFacebook, IconTikTok, IconUsersGroup } from './Icons';
import { es } from '../localization';

const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600).toString().padStart(2, '0');
    const m = Math.floor((seconds % 3600) / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${h}:${m}:${s}`;
};

const StreamTimer: React.FC<{ liveSince: number | null }> = ({ liveSince }) => {
    const [duration, setDuration] = useState(0);
    useEffect(() => {
        if (liveSince === null) {
            setDuration(0);
            return;
        }
        const interval = setInterval(() => {
            setDuration(Math.floor((Date.now() - liveSince) / 1000));
        }, 1000);
        return () => clearInterval(interval);
    }, [liveSince]);

    if (liveSince === null) return null;
    return <span className="font-mono text-xs tabular-nums tracking-tighter">{formatTime(duration)}</span>;
};


interface MultistreamPanelProps {
  streamDestinations: StreamDestination[];
  updateStreamDestination: (id: string, newValues: Partial<StreamDestination>) => void;
  systemStatus: 'Normal' | 'CpuStress' | 'NetworkStress';
}

const platformIcons: Record<StreamDestination['platform'], React.ReactNode> = {
    YouTube: <IconYouTube className="w-5 h-5 text-red-500" />,
    Facebook: <IconFacebook className="w-5 h-5 text-blue-500" />,
    TikTok: <IconTikTok className="w-5 h-5" />,
}

const statusColors: Record<StreamDestination['status'], string> = {
    Offline: 'text-gray-400',
    Connecting: 'text-yellow-400 animate-pulse',
    Live: 'text-green-400 font-bold',
    Error: 'text-red-500 font-bold',
}

const MultistreamPanel: React.FC<MultistreamPanelProps> = ({ streamDestinations, updateStreamDestination, systemStatus }) => {
    
  const handleToggle = (dest: StreamDestination) => {
    const newActiveState = !dest.isActive;
    let newStatus: StreamDestination['status'] = 'Offline';
    let newLiveSince: number | null = null;
    let viewers = 0;

    if (newActiveState) {
        newStatus = 'Connecting';
        newLiveSince = Date.now();
        setTimeout(() => {
            const success = Math.random() > 0.1;
            updateStreamDestination(dest.id, { 
                status: success ? 'Live' : 'Error',
                viewers: success ? Math.floor(Math.random() * 5000) + 100 : 0
            });
        }, 2000);
    }
    updateStreamDestination(dest.id, { isActive: newActiveState, status: newStatus, liveSince: newLiveSince, viewers });
  };

  return (
    <div className="space-y-3">
      <h3 className="text-lg font-bold text-white">Multistream</h3>
      {systemStatus === 'NetworkStress' && <div className="p-2 text-xs font-semibold text-center bg-yellow-500/20 text-yellow-300 rounded-md">MODO DEGRADADO: Ancho de banda bajo. Solo se permite 1 plataforma.</div>}
      
      <div className="grid grid-cols-12 text-xs font-bold text-gray-400 uppercase px-2">
        <div className="col-span-4">Plataforma</div>
        <div className="col-span-2">Estado</div>
        <div className="col-span-3 text-center">Duración</div>
        <div className="col-span-2 text-right">Vistas</div>
      </div>

      {streamDestinations.map((dest, index) => {
        const isDegraded = systemStatus === 'NetworkStress' && index > 0;
        return (
            <div key={dest.id} className={`grid grid-cols-12 items-center p-2 bg-gray-700/50 rounded-lg text-sm ${isDegraded ? 'opacity-50' : ''}`}>
                <div className="col-span-4 flex items-center space-x-2">
                    {platformIcons[dest.platform]}
                    <span className="font-semibold">{dest.name}</span>
                </div>
                <div className={`col-span-2 text-xs font-bold ${statusColors[dest.status]}`}>{isDegraded ? 'Desactivado' : dest.status}</div>
                <div className="col-span-3 text-center text-green-400"><StreamTimer liveSince={dest.liveSince} /></div>
                <div className="col-span-2 text-right flex items-center justify-end space-x-1">
                    <IconUsersGroup className="w-3 h-3 text-gray-400"/>
                    <span className="font-mono text-xs">{dest.viewers.toLocaleString()}</span>
                </div>
                <div className="col-span-1 flex justify-end">
                     <button
                        onClick={() => handleToggle(dest)}
                        disabled={isDegraded}
                        className={`relative inline-flex items-center h-5 w-9 transition-colors rounded-full ${
                        dest.isActive && !isDegraded ? 'bg-blue-600' : 'bg-gray-600'
                        } ${isDegraded ? 'cursor-not-allowed' : ''}`}
                    >
                        <span
                        className={`inline-block w-3.5 h-3.5 transform bg-white rounded-full transition-transform ${
                            dest.isActive && !isDegraded ? 'translate-x-5' : 'translate-x-1'
                        }`}
                        />
                    </button>
                </div>
            </div>
        )
      })}
    </div>
  );
};

export default MultistreamPanel;