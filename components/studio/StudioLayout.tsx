
import React, { useState } from 'react';
import { ProgramItem, Source, Scene, AudioSource, BrandingState, CommentOverlayConfig, ControlSurfaceState, Overlay, ProductionMode, LightingState, BroadcastSession, StreamDestination, TransitionState, ReplayState, OutputState, ScoreboardState, SystemHealthState } from '../../types';
import { Command } from '../console/CommandBus';
import { es } from '../../localization';
import { SourceMonitor } from '../ProgramPreview';
import SourceBus from './SourceBus';
import PTZControls from '../PTZControls';
import SidePanelTabs from '../console/SidePanelTabs';
import AudioMixerConsole from '../console/AudioMixerConsole';
import Multiviewer from '../Multiviewer';
import PerformancePads from '../console/PerformancePads';

interface StudioLayoutProps {
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
    systemStatus: 'Normal' | 'CpuStress' | 'NetworkStress';
}

const CriticalBar: React.FC<{dispatch: (c: Command) => void}> = ({ dispatch }) => (
    <div className="flex justify-center items-center gap-4 h-full bg-gray-800 dark:bg-gray-800 p-2 rounded-lg">
        <button onClick={() => dispatch({type: 'SWITCHER_CUT'})} className="px-10 py-3 bg-red-700 text-white font-black rounded-lg text-xl">CUT</button>
        <button onClick={() => dispatch({type: 'SWITCHER_AUTO'})} className="px-10 py-3 bg-green-600 text-white font-black rounded-lg text-xl">AUTO</button>
        {/* Quick Score, Rec, Stream buttons could go here */}
    </div>
);


const StudioLayout: React.FC<StudioLayoutProps> = (props) => {
    const [studioLevel, setStudioLevel] = useState<'NORMAL' | 'EXPANDED'>('NORMAL');

    const fromItem = props.transitionState.isActive ? (props.allSources.find(s => s.id === props.programId)) : undefined;
    const toItem = props.transitionState.isActive ? (props.allSources.find(s => s.id === props.previewId)) : undefined;
    
    const monitors = (
        <div className={`grid gap-4 flex-grow min-h-0 ${studioLevel === 'NORMAL' ? 'grid-cols-12' : 'grid-cols-12'}`}>
            <div className={`${studioLevel === 'NORMAL' ? 'col-span-7' : 'col-span-6'}`}>
                <SourceMonitor 
                    item={props.programItem} label={es.program} isProgram={true} 
                    activeOverlays={props.activeOverlays} sources={props.allSources.filter(s => 'type' in s) as Source[]} 
                    audioSources={props.audioSources} branding={props.branding} fromItem={fromItem} 
                    toItem={toItem} transitionState={props.transitionState} liveTime={props.liveTime} 
                    commentOverlayConfig={props.commentOverlayConfig} replayState={props.replayState}
                    onToggleFullscreen={() => props.setFullscreenMonitor('program')}
                />
            </div>
            <div className={`${studioLevel === 'NORMAL' ? 'col-span-5' : 'col-span-4'}`}>
                <SourceMonitor 
                    item={props.previewItem} label={es.preview} isProgram={false} 
                    sources={props.allSources.filter(s => 'type' in s) as Source[]} 
                    audioSources={props.audioSources}
                    onToggleFullscreen={() => props.setFullscreenMonitor('preview')} 
                />
            </div>
            {studioLevel === 'EXPANDED' && (
                <div className="col-span-2 bg-gray-800 dark:bg-gray-800 p-2 rounded-lg">
                    <Multiviewer 
                        sources={props.allSources} 
                        programId={props.programId} 
                        previewId={props.previewId} 
                        setPreviewId={(id) => props.dispatch({ type: 'SET_PREVIEW', payload: id })}
                     />
                </div>
            )}
        </div>
    );

    const controlsNormal = (
        <div className="grid grid-cols-12 gap-4 flex-shrink-0 h-[22rem]">
            <div className="col-span-8 flex flex-col gap-2">
                 <SourceBus sources={props.allSources} previewId={props.previewId} programId={props.programId} dispatch={props.dispatch}/>
                 <CriticalBar dispatch={props.dispatch} />
            </div>
            <div className="col-span-4 bg-gray-200 dark:bg-gray-800 rounded-lg p-2">
                 <SidePanelTabs {...props} />
            </div>
        </div>
    );

    const controlsExpanded = (
         <div className="grid grid-cols-12 gap-4 flex-shrink-0 h-[22rem]">
            <div className="col-span-5 flex flex-col gap-2">
                <SourceBus sources={props.allSources} previewId={props.previewId} programId={props.programId} dispatch={props.dispatch}/>
                <CriticalBar dispatch={props.dispatch} />
                 {/* Macro Panel Placeholder */}
            </div>
            <div className="col-span-4 bg-gray-200 dark:bg-gray-800 rounded-lg p-2">
                <AudioMixerConsole 
                    audioSources={props.audioSources}
                    controlSurfaceState={props.controlSurfaceState}
                    isLive={props.isLive}
                    dispatch={props.dispatch}
                />
            </div>
            <div className="col-span-3 bg-gray-200 dark:bg-gray-800 rounded-lg p-2 flex flex-col gap-2">
                <div className="flex-1"><PerformancePads {...props} /></div>
                <div className="flex-1"><PTZControls isGamepadConnected={props.isGamepadConnected}/></div>
            </div>
        </div>
    );

    return (
        <main className="flex-grow p-2 md:p-4 flex flex-col gap-4 overflow-hidden">
            <div className="flex-shrink-0">
                 <button onClick={() => setStudioLevel(l => l === 'NORMAL' ? 'EXPANDED' : 'NORMAL')} className="px-3 py-1 text-xs font-bold bg-gray-300 dark:bg-gray-700 rounded-md">
                   {studioLevel === 'NORMAL' ? '[ Studio Expandido ]' : '[ Studio Normal ]'}
                </button>
            </div>
            {monitors}
            {studioLevel === 'NORMAL' ? controlsNormal : controlsExpanded}
        </main>
    );
};

export default StudioLayout;
