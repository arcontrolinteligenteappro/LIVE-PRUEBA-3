
import React from 'react';
import { AudioSource, ControlSurfaceState, ProductionMode, ProgramItem, Scene, Source, TransitionState, VJMixerState, LightingState, Overlay, BrandingState, StreamDestination, CommentOverlayConfig, Guest, AiSuggestion, AudioFXState, BroadcastSession } from '../../types';
import { Command } from './CommandBus';
import VideoSwitcherConsole from './VideoSwitcherConsole';
import AudioMixerConsole from './AudioMixerConsole';
import RightPanel from './SidePanelTabs';
import Multiviewer from '../Multiviewer';

interface MainConsoleProps {
    allSources: (Source | Scene)[];
    audioSources: AudioSource[];
    previewId: string;
    programId: string;
    transitionState: TransitionState;
    vjMixerState: VJMixerState;
    controlSurfaceState: ControlSurfaceState;
    productionMode: ProductionMode;
    isLive: boolean;
    lightingState: LightingState;
    dispatch: (command: Command) => void;
    isGamepadConnected: boolean;
    // Props for RightPanel
    sources: Source[];
    overlays: Overlay[];
    branding: BrandingState;
    streamDestinations: StreamDestination[];
    commentOverlayConfig: CommentOverlayConfig;
    guests: Guest[];
    systemStatus: 'Normal' | 'CpuStress' | 'NetworkStress';
    aiSuggestions: AiSuggestion[];
    audioFXState: AudioFXState;
    broadcastSession: BroadcastSession;
}

const MainConsole: React.FC<MainConsoleProps> = (props) => {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-2 h-full lg:h-[26rem]">
            {/* Left Side: Multiviewer and Video Switcher */}
            <div className="lg:col-span-5 flex flex-col gap-2">
                <div className="bg-gray-900/50 rounded-md p-2 flex-grow">
                     <Multiviewer 
                        sources={props.allSources} 
                        programId={props.programId} 
                        previewId={props.previewId} 
                        setPreviewId={(id) => props.dispatch({ type: 'SET_PREVIEW', payload: id })}
                     />
                </div>
                <div className="bg-gray-900/50 rounded-md p-2 flex-shrink-0">
                    <VideoSwitcherConsole
                        transitionState={props.transitionState}
                        vjMixerState={props.vjMixerState}
                        dispatch={props.dispatch}
                    />
                </div>
            </div>

            {/* Center: Audio Mixer */}
            <div className="lg:col-span-4 bg-gray-900/50 rounded-md p-2 min-h-[26rem]">
                <AudioMixerConsole 
                    audioSources={props.audioSources}
                    controlSurfaceState={props.controlSurfaceState}
                    isLive={props.isLive}
                    dispatch={props.dispatch}
                />
            </div>

            {/* Right Side: Tabbed Panels */}
            <div className="lg:col-span-3 bg-gray-900/50 rounded-md p-2 min-h-[26rem]">
                <RightPanel {...props} />
            </div>
        </div>
    );
};

export default MainConsole;
