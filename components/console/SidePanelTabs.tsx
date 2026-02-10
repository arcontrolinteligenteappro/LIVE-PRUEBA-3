
import React, { useState, useMemo } from 'react';
import { ProductionMode, LightingState, Source, Overlay, BrandingState, StreamDestination, CommentOverlayConfig, Guest, AiSuggestion, AudioSource, AudioFXState, VJMixerState, BroadcastSession, ScoreboardState } from '../../types';
import { Command } from './CommandBus';
import PerformancePads from './PerformancePads';
import LightingConsole from './LightingConsole';
import OverlayManager from '../OverlayManager';
import SourceManager from '../SourceManager';
import AudioMixer from '../AudioMixer';
import MultistreamPanel from '../MultistreamPanel';
import SystemStatusPanel from '../SystemStatusPanel';
import BrandingPanel from '../BrandingPanel';
import CommentsPanel from '../CommentsPanel';
import GuestPanel from '../GuestPanel';
import VJMixerPanel from '../VJMixerPanel';
import PTZControls from '../PTZControls';
import AIHelperPanel from '../AIHelperPanel';
import AgendaPanel from './AgendaPanel';
import SessionPanel from './SessionPanel';
import { es } from '../../localization';
import { config } from '../../config';
import { IconTool, IconSettings, IconOverlay, IconSource, IconAudio, IconStream, IconServer, IconBranding, IconComments, IconUsers, IconMixer, IconPTZ, IconAi, IconCalendar, IconBroadcast } from '../Icons';


interface RightPanelProps {
    productionMode: ProductionMode;
    lightingState: LightingState;
    sources: Source[];
    overlays: Overlay[];
    branding: BrandingState;
    streamDestinations: StreamDestination[];
    commentOverlayConfig: CommentOverlayConfig;
    guests: Guest[];
    systemStatus: 'Normal' | 'CpuStress' | 'NetworkStress';
    aiSuggestions: AiSuggestion[];
    audioSources: AudioSource[];
    audioFXState: AudioFXState;
    vjMixerState: VJMixerState;
    previewId: string;
    isGamepadConnected: boolean;
    broadcastSession: BroadcastSession;
    isLive: boolean;
    dispatch: (command: Command) => void;
    scoreboardState: ScoreboardState;
}

type TabId = 'performance' | 'event' | 'agenda' | 'sources' | 'overlays' | 'audio' | 'stream' | 'branding' | 'comments' | 'guests' | 'vj' | 'ptz' | 'lights' | 'ai' | 'system';

const modeTabPriority: Record<ProductionMode, TabId[]> = {
    [ProductionMode.SPORTS]: ['performance', 'ptz', 'event', 'stream', 'overlays'],
    [ProductionMode.PODCAST]: ['guests', 'comments', 'audio', 'event', 'stream'],
    [ProductionMode.COMMERCE]: ['performance', 'comments', 'branding', 'event', 'stream'],
    [ProductionMode.GENERAL]: ['sources', 'scenes' as any, 'audio', 'stream', 'overlays'],
};


const RightPanel: React.FC<RightPanelProps> = (props) => {
    
    const allTabs: {id: TabId, label: string, icon: React.ReactNode, enabled: boolean}[] = [
        { id: 'performance', label: es.tabPerformance, icon: <IconTool className="w-5 h-5"/>, enabled: true },
        { id: 'event', label: es.tabEvent, icon: <IconBroadcast className="w-5 h-5"/>, enabled: true },
        { id: 'agenda', label: es.tabAgenda, icon: <IconCalendar className="w-5 h-5"/>, enabled: true },
        { id: 'sources', label: es.tabSources, icon: <IconSource className="w-5 h-5"/>, enabled: true },
        { id: 'overlays', label: es.tabOverlays, icon: <IconOverlay className="w-5 h-5"/>, enabled: true },
        { id: 'audio', label: es.tabAudio, icon: <IconAudio className="w-5 h-5"/>, enabled: true },
        { id: 'stream', label: es.tabStream, icon: <IconStream className="w-5 h-5"/>, enabled: true },
        { id: 'branding', label: es.tabBranding, icon: <IconBranding className="w-5 h-5"/>, enabled: true },
        { id: 'comments', label: es.tabComments, icon: <IconComments className="w-5 h-5"/>, enabled: true },
        { id: 'guests', label: es.tabGuests, icon: <IconUsers className="w-5 h-5"/>, enabled: true },
        { id: 'vj', label: es.tabVJ, icon: <IconMixer className="w-5 h-5"/>, enabled: true },
        { id: 'ptz', label: es.tabPTZ, icon: <IconPTZ className="w-5 h-5"/>, enabled: true },
        { id: 'lights', label: es.tabLights, icon: <IconSettings className="w-5 h-5"/>, enabled: config.features.lighting },
        { id: 'ai', label: es.tabAI, icon: <IconAi className="w-5 h-5"/>, enabled: true },
        { id: 'system', label: es.tabSystem, icon: <IconServer className="w-5 h-5"/>, enabled: true },
    ];
    
    const sortedTabs = useMemo(() => {
        const priority = modeTabPriority[props.productionMode] || [];
        return allTabs
            .filter(t => t.enabled)
            .sort((a, b) => {
                const indexA = priority.indexOf(a.id);
                const indexB = priority.indexOf(b.id);
                if (indexA === -1 && indexB === -1) return 0;
                if (indexA === -1) return 1;
                if (indexB === -1) return -1;
                return indexA - indexB;
            });
    }, [props.productionMode]);
    
    const [activeTab, setActiveTab] = useState<TabId>(sortedTabs[0]?.id || 'performance');

    const renderContent = () => {
        switch (activeTab) {
            case 'performance': return <PerformancePads {...props} />;
            case 'event': return <SessionPanel session={props.broadcastSession} isLive={props.isLive} dispatch={props.dispatch} />;
            case 'agenda': return <AgendaPanel />;
            case 'lights': return <LightingConsole lightingState={props.lightingState} dispatch={props.dispatch} />;
            case 'overlays': return <OverlayManager 
                overlays={props.overlays}
                addOverlay={(o) => props.dispatch({type: 'OVERLAY_ADD', payload: o})}
                toggleOverlay={(id) => props.dispatch({type: 'OVERLAY_TOGGLE', payload: id})}
                removeOverlay={(id) => props.dispatch({type: 'OVERLAY_REMOVE', payload: id})}
             />;
            case 'sources': return <SourceManager
                sources={props.sources}
                addSource={(s) => props.dispatch({type: 'SOURCE_ADD', payload: s})}
                updateSource={(id, values) => props.dispatch({type: 'SOURCE_UPDATE', payload: {id, values}})}
                removeSource={(id) => props.dispatch({type: 'SOURCE_REMOVE', payload: id})}
             />;
            case 'branding': return <BrandingPanel branding={props.branding} dispatch={props.dispatch} />;
            case 'comments': return <CommentsPanel config={props.commentOverlayConfig} dispatch={props.dispatch} />;
            case 'guests': return <GuestPanel guests={props.guests} audioSources={props.audioSources} dispatch={props.dispatch} />;
            case 'vj': return <VJMixerPanel vjMixerState={props.vjMixerState} sources={props.sources} previewId={props.previewId} dispatch={props.dispatch} />;
            case 'ptz': return <PTZControls isGamepadConnected={props.isGamepadConnected} />;
            case 'ai': return <AIHelperPanel suggestions={props.aiSuggestions} productionMode={props.productionMode} dispatch={props.dispatch} />;
            case 'audio': return <AudioMixer
                audioSources={props.audioSources}
                updateAudioSource={(id, values) => props.dispatch({type: 'AUDIO_UPDATE_SOURCE', payload: {id, values}})}
                audioFXState={props.audioFXState}
                setAudioFXState={(s) => props.dispatch({type: 'AUDIO_SET_FX_STATE', payload: s})}
            />;
            case 'stream': return <MultistreamPanel
                streamDestinations={props.streamDestinations}
                updateStreamDestination={(id, values) => props.dispatch({type: 'STREAM_UPDATE_DESTINATION', payload: {id, values}})}
                systemStatus={props.systemStatus}
            />;
            case 'system': return <SystemStatusPanel 
                systemStatus={props.systemStatus}
                dispatch={props.dispatch}
             />;
            default: return null;
        }
    }

    return (
        <div className="flex flex-col h-full">
            <div className="flex space-x-1 p-1 bg-gray-300 dark:bg-gray-900/50 rounded-md flex-shrink-0 overflow-x-auto">
                {sortedTabs.map(tab => (
                    <button 
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)} 
                        title={tab.label}
                        className={`flex-1 p-2 rounded flex justify-center items-center ${activeTab === tab.id ? 'bg-blue-600' : 'hover:bg-gray-700'}`}
                    >
                       {tab.icon}
                    </button>
                ))}
            </div>
            <div className="flex-grow min-h-0 mt-2 overflow-y-auto pr-2">
                {renderContent()}
            </div>
        </div>
    );
};

export default RightPanel;