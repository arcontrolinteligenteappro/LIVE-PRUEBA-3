
import React, { useState } from 'react';
import { ProgramItem, Source, Scene, AudioSource, BrandingState, CommentOverlayConfig, ControlSurfaceState, Overlay, ProductionMode, LightingState, BroadcastSession, StreamDestination, TransitionState, ReplayState, OutputState, ScoreboardState } from '../types';
import { Command } from '../console/CommandBus';
import { SourceMonitor } from '../ProgramPreview';
import { es } from '../localization';
import PerformancePads from '../console/PerformancePads';
import PTZControls from '../PTZControls';
import ReplayPanel from './ReplayPanel';
import SceneEditor from './SceneEditor';
import CallInPanel from './CallInPanel';
import MiniAudioMixer from './MiniAudioMixer';
// FIX: Import 'IconUsers' to be used for the 'Invitados' tab icon.
import { IconSource, IconAudio, IconPTZ, IconTool, IconOverlay, IconStream, IconSettings, IconCut, IconFade, IconReplay, IconBroadcast, IconRecord, IconUsers } from '../Icons';

type TabId = 'score' | 'audio' | 'ptz' | 'replay' | 'overlays' | 'stream' | 'callin' | 'config';

const tabs: { id: TabId; label: string; icon: React.ReactNode }[] = [
    { id: 'score', label: 'Score', icon: <IconTool className="w-6 h-6"/> },
    { id: 'audio', label: 'Audio', icon: <IconAudio className="w-6 h-6"/> },
    { id: 'ptz', label: 'PTZ', icon: <IconPTZ className="w-6 h-6"/> },
    { id: 'replay', label: 'Replay', icon: <IconReplay className="w-6 h-6"/> },
    { id: 'overlays', label: 'Capas', icon: <IconOverlay className="w-6 h-6"/> },
    { id: 'stream', label: 'Live', icon: <IconStream className="w-6 h-6"/> },
    { id: 'callin' as any, label: 'Invitados', icon: <IconUsers className="w-6 h-6"/> }, // FIX: Use correct icon
    { id: 'config', label: 'Conf', icon: <IconSettings className="w-6 h-6"/> },
];

interface SingleModeLayoutProps {
    fullscreenMonitor: 'preview' | 'program' | null;
    setFullscreenMonitor: (monitor: 'preview' | 'program' | null) => void;
    programItem?: ProgramItem;
    previewItem?: ProgramItem;
    allSources: (Source | Scene)[];
    audioSources: AudioSource[];
    previewId: string;
    programId: string;
    activeOverlays: Overlay[];
    branding: BrandingState;
    productionMode: ProductionMode;
    overlays: Overlay[];
    scenes: Scene[];
    liveTime: number;
    commentOverlayConfig: CommentOverlayConfig;
    controlSurfaceState: ControlSurfaceState;
    transitionState: TransitionState;
    lightingState: LightingState;
    replayState: ReplayState;
    outputState: OutputState;
    dispatch: (command: Command) => void;
    broadcastSession: BroadcastSession;
    isGamepadConnected: boolean;
    streamDestinations: StreamDestination[];
    isLive: boolean;
    isRecording: boolean;
    guests: any[];
    scoreboardState: ScoreboardState;
    sources: Source[];
}

// Permanente y Crucial: Barra de Acción Rápida (VirtualDJ Style)
const GlobalActionBar: React.FC<{ 
    dispatch: (c: Command) => void, 
    isLive: boolean, 
    isRecording: boolean,
    scoreboardState: ScoreboardState 
}> = ({ dispatch, isLive, isRecording, scoreboardState }) => (
    <div className="bg-black/90 p-2 flex items-center justify-between gap-2 border-t border-gray-700 h-16 lg:h-20 flex-shrink-0">
        <div className="flex gap-1 h-full">
            <button onClick={() => dispatch({type: 'MASTER_GO_LIVE'})} className={`flex flex-col items-center justify-center px-3 rounded font-bold text-[10px] transition-all ${isLive ? 'bg-red-600 animate-pulse' : 'bg-gray-700 text-gray-400'}`}>
                <IconBroadcast className="w-5 h-5 mb-0.5" />
                STREAM
            </button>
            <button onClick={() => dispatch({type: 'MASTER_TOGGLE_RECORD'})} className={`flex flex-col items-center justify-center px-3 rounded font-bold text-[10px] transition-all ${isRecording ? 'bg-red-500' : 'bg-gray-700 text-gray-400'}`}>
                <IconRecord className="w-5 h-5 mb-0.5" />
                REC
            </button>
        </div>

        <div className="flex-grow flex justify-center gap-4">
            <div className="flex flex-col items-center">
                 <div className="flex gap-2">
                    <button 
                        onClick={() => dispatch({type: 'SCOREBOARD_SET_STATE', payload: {...scoreboardState, home: {...scoreboardState.home, score: scoreboardState.home.score + 1}}})}
                        className="bg-blue-600 text-white font-black px-4 py-1 rounded text-lg active:scale-95"
                    >+1 LOC</button>
                     <button 
                        onClick={() => dispatch({type: 'SCOREBOARD_SET_STATE', payload: {...scoreboardState, away: {...scoreboardState.away, score: scoreboardState.away.score + 1}}})}
                        className="bg-gray-200 text-black font-black px-4 py-1 rounded text-lg active:scale-95"
                    >+1 VIS</button>
                 </div>
                 <span className="text-[10px] font-bold text-gray-500 mt-1 uppercase tracking-widest">Quick Score</span>
            </div>
        </div>

        <div className="flex gap-1 h-full">
            <button onClick={() => dispatch({type: 'SWITCHER_CUT'})} className="bg-red-700 hover:bg-red-600 text-white font-black px-6 rounded-l-md active:bg-red-500">CUT</button>
            <button onClick={() => dispatch({type: 'SWITCHER_AUTO'})} className="bg-green-600 hover:bg-green-500 text-white font-black px-6 rounded-r-md active:bg-green-400">AUTO</button>
        </div>
    </div>
);

const TabContent: React.FC<{ activeTab: TabId } & SingleModeLayoutProps> = ({ activeTab, ...props }) => {
    switch(activeTab) {
        case 'score': return <div className="p-2 h-full overflow-y-auto"><PerformancePads {...props} /></div>;
        case 'audio': return <MiniAudioMixer audioSources={props.audioSources} dispatch={props.dispatch} />;
        case 'ptz': return <div className="p-2"><PTZControls isGamepadConnected={props.isGamepadConnected} /></div>;
        case 'replay': return <ReplayPanel replayState={props.replayState} dispatch={props.dispatch} />;
        case 'overlays': return <div className="p-4"><SceneEditor scenes={props.scenes} sources={props.sources} dispatch={props.dispatch} /></div>;
        case 'callin': return <CallInPanel guests={props.guests} audioSources={props.audioSources} dispatch={props.dispatch} />;
        case 'config': return <div className="p-4 text-center">Estadísticas y Configuración</div>;
        default: return null;
    }
};

const SingleModeLayout: React.FC<SingleModeLayoutProps> = (props) => {
    const [activeTab, setActiveTab] = useState<TabId>('score');

    return (
        <main className="flex flex-col h-full bg-black overflow-hidden select-none">
            {/* 1. SECCIÓN DE MONITORES (Adaptativa) */}
            <div className="flex-grow flex portrait:flex-col landscape:flex-row gap-0.5 bg-gray-900 min-h-0">
                {/* PGM Principal */}
                <div className="relative flex-grow min-h-0">
                    <SourceMonitor 
                        item={props.programItem} label={es.program} isProgram={true} 
                        activeOverlays={props.activeOverlays} sources={props.allSources.filter(s => 'type' in s) as Source[]} 
                        branding={props.branding} liveTime={props.liveTime}
                        commentOverlayConfig={props.commentOverlayConfig}
                        onToggleFullscreen={() => props.setFullscreenMonitor('program')}
                        replayState={props.replayState}
                    />
                    
                    {/* PVW como PiP en Portrait o Monitor Side-by-Side en Landscape */}
                    <div className="absolute top-2 left-2 w-1/3 h-1/3 z-10 border-2 border-gray-800 rounded-md shadow-2xl">
                         <SourceMonitor 
                            item={props.previewItem} label={es.preview} isProgram={false}
                            sources={props.allSources.filter(s => 'type' in s) as Source[]} 
                            onToggleFullscreen={() => props.setFullscreenMonitor('preview')}
                        />
                    </div>
                </div>
            </div>

            {/* 2. PANEL DE TRABAJO (Tabs Dinámicos) */}
            <div className="portrait:h-1/2 landscape:h-full landscape:w-1/3 flex-shrink-0 bg-gray-800 border-t border-gray-700 flex flex-col min-h-0">
                 <div className="flex-grow min-h-0">
                    <TabContent activeTab={activeTab} {...props} />
                 </div>
                 
                 {/* Dock de navegación inferior */}
                 <div className="flex-shrink-0 grid grid-cols-8 gap-px bg-gray-900 h-14">
                    {tabs.map(tab => (
                        <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`flex flex-col items-center justify-center transition-colors ${activeTab === tab.id ? 'bg-blue-600 text-white' : 'text-gray-500 hover:bg-gray-800'}`}>
                            {tab.icon}
                            <span className="text-[9px] font-bold mt-0.5 uppercase">{tab.label}</span>
                        </button>
                    ))}
                 </div>
            </div>

            {/* 3. BARRA DE ACCIÓN GLOBAL (Crítica) */}
            <GlobalActionBar 
                dispatch={props.dispatch} 
                isLive={props.isLive} 
                isRecording={props.isRecording}
                scoreboardState={props.scoreboardState}
            />
        </main>
    );
};

export default SingleModeLayout;
