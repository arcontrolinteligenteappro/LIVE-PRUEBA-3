
import React from 'react';
import { ProgramItem, Source, Scene, AudioSource, TransitionState, VJMixerState, ControlSurfaceState, ProductionMode, Overlay, BrandingState, CommentOverlayConfig, LightingState, StreamDestination, Guest, AiSuggestion, AudioFXState, BroadcastSession } from '../../types';
import { Command } from './CommandBus';
import { SourceMonitor } from '../ProgramPreview';
import { es } from '../../localization';
import MainConsole from './MainConsole';
import MasterControls from './MasterControls';

interface ConsoleLayoutProps {
    fullscreenMonitor: 'preview' | 'program' | null;
    setFullscreenMonitor: (monitor: 'preview' | 'program' | null) => void;
    programItem?: ProgramItem;
    previewItem?: ProgramItem;
    allSources: (Source | Scene)[];
    audioSources: AudioSource[];
    previewId: string;
    programId: string;
    transitionState: TransitionState;
    vjMixerState: VJMixerState;
    controlSurfaceState: ControlSurfaceState;
    productionMode: ProductionMode;
    activeOverlays: Overlay[];
    branding: BrandingState;
    liveTime: number;
    commentOverlayConfig: CommentOverlayConfig;
    isLive: boolean;
    isRecording: boolean;
    lightingState: LightingState;
    dispatch: (command: Command) => void;
    isGamepadConnected: boolean;
    // New props for MainConsole -> RightPanel
    sources: Source[];
    overlays: Overlay[];
    streamDestinations: StreamDestination[];
    guests: Guest[];
    systemStatus: 'Normal' | 'CpuStress' | 'NetworkStress';
    aiSuggestions: AiSuggestion[];
    audioFXState: AudioFXState;
    broadcastSession: BroadcastSession;
}

const ConsoleLayout: React.FC<ConsoleLayoutProps> = (props) => {
    const fromItem = props.transitionState.isActive ? (props.allSources.find(s => s.id === props.programId)) : undefined;
    const toItem = props.transitionState.isActive ? (props.allSources.find(s => s.id === props.previewId)) : undefined;

    if (props.fullscreenMonitor) {
        const item = props.fullscreenMonitor === 'program' ? props.programItem : props.previewItem;
        const isProgram = props.fullscreenMonitor === 'program';
        return (
            <main className="flex-grow p-0 flex flex-col overflow-hidden">
                <SourceMonitor
                    item={item}
                    label={isProgram ? es.program : es.preview}
                    isProgram={isProgram}
                    activeOverlays={isProgram ? props.activeOverlays : []}
                    sources={props.allSources.filter(s => 'type' in s) as Source[]}
                    branding={isProgram ? props.branding : undefined}
                    liveTime={isProgram ? props.liveTime : undefined}
                    commentOverlayConfig={isProgram ? props.commentOverlayConfig : undefined}
                    vjMixerState={isProgram ? props.vjMixerState : undefined}
                    isFullscreen={true}
                    onToggleFullscreen={() => props.setFullscreenMonitor(null)}
                />
            </main>
        );
    }


    return (
        <main className="flex-grow p-2 md:p-4 flex flex-col gap-4 overflow-hidden">
            {/* Monitors Section */}
            <div className="grid grid-cols-2 gap-4 flex-grow min-h-0">
                <SourceMonitor item={props.previewItem} label={es.preview} isProgram={false} sources={props.allSources.filter(s => 'type' in s) as Source[]} onToggleFullscreen={() => props.setFullscreenMonitor('preview')} />
                <SourceMonitor 
                    item={props.programItem} 
                    label={es.program} 
                    isProgram={true} 
                    activeOverlays={props.activeOverlays} 
                    sources={props.allSources.filter(s => 'type' in s) as Source[]} 
                    branding={props.branding} 
                    fromItem={fromItem} 
                    toItem={toItem} 
                    transitionState={props.transitionState} 
                    liveTime={props.liveTime} 
                    commentOverlayConfig={props.commentOverlayConfig} 
                    vjMixerState={props.vjMixerState} 
                    onToggleFullscreen={() => props.setFullscreenMonitor('program')}
                />
            </div>

            {/* Console Section */}
            <div className="flex-shrink-0 bg-gray-800 rounded-lg p-2 flex flex-col gap-2">
                <MasterControls 
                    isLive={props.isLive} 
                    isRecording={props.isRecording} 
                    dispatch={props.dispatch}
                />
                <MainConsole {...props} />
            </div>
        </main>
    );
};

export default ConsoleLayout;
