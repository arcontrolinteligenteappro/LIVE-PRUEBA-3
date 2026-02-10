
import React from 'react';
import { TransitionType, AudioSource, VJMixerState, ControlSurfaceState, AppState, ConfigPreset, Overlay, TransitionState, SingleModePanel, LightingState, Source, StreamDestination, BrandingState, CommentOverlayConfig, Guest, AiSuggestion, AudioFXState, BroadcastSession, ReplayState, OutputState, Scene, SourceType, ScoreboardState, SystemHealthState } from '../../types';
import { es } from '../../localization';
import { config } from '../../config';

// A. Command Definitions
export type Command =
  // Switcher
  | { type: 'SET_PREVIEW'; payload: string }
  | { type: 'SWITCHER_CUT' }
  | { type: 'SWITCHER_AUTO' }
  | { type: 'SWITCHER_SET_TRANSITION_TYPE'; payload: TransitionType }
  | { type: 'SWITCHER_SET_TRANSITION_DURATION'; payload: number }
  | { type: 'SWITCHER_SET_TRANSITION_PROGRESS'; payload: number }
  // Audio
  | { type: 'AUDIO_SET_FADER_LEVEL'; payload: { channelId: string; level: number } }
  | { type: 'AUDIO_SET_GAIN_TRIM'; payload: { channelId: string; gain: number } }
  | { type: 'AUDIO_TOGGLE_MUTE'; payload: string }
  | { type: 'AUDIO_TOGGLE_SOLO'; payload: string }
  | { type: 'AUDIO_SET_EQ'; payload: { channelId: string; band: 'low' | 'mid1' | 'mid2' | 'high'; value: number } }
  | { type: 'AUDIO_SET_COMPRESSOR'; payload: { channelId: string; threshold: number; ratio: number } }
  | { type: 'AUDIO_SET_GATE'; payload: { channelId: string; threshold: number } }
  | { type: 'AUDIO_SET_PAN'; payload: { channelId: string; pan: number } }
  | { type: 'AUDIO_TOGGLE_HPF'; payload: string }
  | { type: 'AUDIO_SET_BUS_SEND'; payload: { channelId: string; bus: 'aux1' | 'aux2'; level: number } }
  | { type: 'AUDIO_UPDATE_SOURCE'; payload: { id: string, values: Partial<AudioSource> } }
  | { type: 'AUDIO_SET_FX_STATE', payload: AudioFXState }
  | { type: 'AUDIO_SET_MIX_MINUS', payload: { channelId: string, enabled: boolean } }
  // Console Surface
  | { type: 'CONSOLE_TOGGLE_AFV' }
  | { type: 'CONSOLE_TOGGLE_MIC_LOCK' }
  // VJ Mixer
  | { type: 'VJMixer_SET_MODE'; payload: VJMixerState['mode'] }
  | { type: 'VJMixer_SET_CROSSFADE'; payload: number }
  | { type: 'VJMixer_ASSIGN_DECK'; payload: { deck: 'deckA' | 'deckB', sourceId: string } }
  | { type: 'VJMixer_CLEAR_DECK'; payload: { deck: 'deckA' | 'deckB' } }
  // Master Output
  | { type: 'MASTER_GO_LIVE' }
  | { type: 'MASTER_TOGGLE_RECORD' }
  | { type: 'OUTPUT_SET_STATE'; payload: OutputState }
  // System & Config
  | { type: 'SYSTEM_TRIGGER_FAILSAFE' }
  | { type: 'SYSTEM_SET_HEALTH', payload: Partial<SystemHealthState> }
  | { type: 'SAVE_CONFIGURATION' }
  | { type: 'LOAD_CONFIGURATION'; payload: number }
  | { type: 'SESSION_UPDATE_METADATA'; payload: Partial<BroadcastSession> }
  // Overlays & Content
  | { type: 'SCOREBOARD_SET_STATE'; payload: ScoreboardState }
  | { type: 'OVERLAY_ADD'; payload: Overlay }
  | { type: 'OVERLAY_REMOVE'; payload: string }
  | { type: 'OVERLAY_TOGGLE'; payload: string }
  | { type: 'OVERLAY_UPDATE_CONTENT', payload: { id: string; content: any } }
  | { type: 'COMMENT_CONFIG_UPDATE', payload: CommentOverlayConfig }
  // UI
  | { type: 'UI_TOGGLE_SINGLE_MODE_PANEL', payload: SingleModePanel }
  // Lighting
  | { type: 'LIGHTING_SET_SCENE', payload: string }
  | { type: 'LIGHTING_SET_MASTER_INTENSITY', payload: number }
  | { type: 'LIGHTING_SET_COLOR_TEMP', payload: number }
  // Sources
  | { type: 'SOURCE_ADD', payload: Source }
  | { type: 'SOURCE_BATCH_ADD', payload: { video: Source[], audio: AudioSource[] } }
  | { type: 'SOURCE_UPDATE', payload: { id: string, values: Partial<Source> } }
  | { type: 'SOURCE_REMOVE', payload: string }
  | { type: 'SOURCE_ADD_GUEST', payload: { guest: Guest, sourceType: SourceType } }
  // Scenes
  | { type: 'SCENE_ADD', payload: { name: string } }
  | { type: 'SCENE_REMOVE', payload: string }
  | { type: 'SCENE_UPDATE', payload: { id: string, values: Partial<Scene> } }
  | { type: 'SCENE_ADD_LAYER', payload: { sceneId: string, sourceId: string } }
  | { type: 'SCENE_REMOVE_LAYER', payload: { sceneId: string, itemId: string } }
  | { type: 'SCENE_UPDATE_LAYER', payload: { sceneId: string, itemId: string, values: Partial<Scene['items'][0]> } }
  // Stream
  | { type: 'STREAM_UPDATE_DESTINATION', payload: { id: string, values: Partial<StreamDestination> } }
  // Branding
  | { type: 'BRANDING_UPDATE', payload: BrandingState }
  // Guests
  | { type: 'GUEST_ADD_SIMULATED'; payload: { type: 'WEBRTC' } | { type: 'CAPTURE', platform: Guest['platform'] } }
  | { type: 'GUEST_UPDATE', payload: { id: string, values: Partial<Guest> } }
  | { type: 'GUEST_REMOVE', payload: string }
  // AI
  | { type: 'AI_SET_SUGGESTIONS', payload: AiSuggestion[] }
  // Replay
  | { type: 'REPLAY_TRIGGER'; payload: { duration: number } }
  | { type: 'REPLAY_TOGGLE_SLOMO' }
  | { type: 'REPLAY_RETURN_LIVE' };


// B. State & Setters Interfaces (for the dispatcher)
interface AppStateForCommand extends AppState {
    previewId: string;
    programId: string;
    audioSources: AudioSource[];
    streamDestinations: StreamDestination[];
    transition: TransitionState;
    vjMixerState: VJMixerState;
    controlSurfaceState: ControlSurfaceState;
    savedConfigs: ConfigPreset[];
    isLive: boolean;
    isRecording: boolean;
    lightingState: LightingState;
    guests: Guest[];
    systemHealth: SystemHealthState;
    broadcastSession: BroadcastSession;
    replayState: ReplayState;
    outputState: OutputState;
    scoreboardState: ScoreboardState;
}

interface AppSetters {
    setPreviewId: React.Dispatch<React.SetStateAction<string>>;
    setProgramId: React.Dispatch<React.SetStateAction<string>>;
    setAudioSources: React.Dispatch<React.SetStateAction<AudioSource[]>>;
    setTransition: React.Dispatch<React.SetStateAction<TransitionState>>;
    setVJMixerState: React.Dispatch<React.SetStateAction<VJMixerState>>;
    setControlSurfaceState: React.Dispatch<React.SetStateAction<ControlSurfaceState>>;
    setSavedConfigs: React.Dispatch<React.SetStateAction<ConfigPreset[]>>;
    setOverlays: React.Dispatch<React.SetStateAction<Overlay[]>>;
    setIsLive: React.Dispatch<React.SetStateAction<boolean>>;
    setIsRecording: React.Dispatch<React.SetStateAction<boolean>>;
    setSources: React.Dispatch<React.SetStateAction<Source[]>>;
    setScenes: React.Dispatch<React.SetStateAction<Scene[]>>;
    setBranding: React.Dispatch<React.SetStateAction<BrandingState>>;
    setLightingState: React.Dispatch<React.SetStateAction<LightingState>>;
    setStreamDestinations: React.Dispatch<React.SetStateAction<StreamDestination[]>>;
    setCommentOverlayConfig: React.Dispatch<React.SetStateAction<CommentOverlayConfig>>;
    setGuests: React.Dispatch<React.SetStateAction<Guest[]>>;
    setSystemHealth: React.Dispatch<React.SetStateAction<SystemHealthState>>;
    setAiSuggestions: React.Dispatch<React.SetStateAction<AiSuggestion[]>>;
    setAudioFXState: React.Dispatch<React.SetStateAction<AudioFXState>>;
    setBroadcastSession: React.Dispatch<React.SetStateAction<BroadcastSession>>;
    setReplayState: React.Dispatch<React.SetStateAction<ReplayState>>;
    setOutputState: React.Dispatch<React.SetStateAction<OutputState>>;
    setScoreboardState: React.Dispatch<React.SetStateAction<ScoreboardState>>;
}

const handleProgramChange = (newProgramId: string, state: AppStateForCommand, setters: AppSetters) => {
    const oldProgramId = state.programId;
    setters.setProgramId(newProgramId);

    if (state.controlSurfaceState.audioFollowsVideo) {
        const audioSourceForOldPgm = `audio-${oldProgramId.replace('scene-', 'cam-')}`;
        const audioSourceForNewPgm = `audio-${newProgramId.replace('scene-', 'cam-')}`;

        setters.setAudioSources(sources => sources.map(s => {
            if (s.id === audioSourceForOldPgm) return {...s, isMuted: true};
            if (s.id === audioSourceForNewPgm) return {...s, isMuted: false};
            return s;
        }));
    }
};


// C. Command Dispatcher Function (The simulated "engine-control-surface")
export const dispatchCommand = (command: Command, state: AppStateForCommand, setters: AppSetters) => {
    // ON AIR Safety Checks
    if (state.isLive) {
        switch (command.type) {
            case 'SAVE_CONFIGURATION':
            case 'LOAD_CONFIGURATION':
            case 'SOURCE_ADD':
            case 'SOURCE_REMOVE':
            case 'SCENE_ADD':
            case 'SCENE_REMOVE':
            case 'SESSION_UPDATE_METADATA':
                 alert("Cannot change configuration while live.");
                 return;
        }
    }
    
    switch (command.type) {
        // Switcher
        case 'SET_PREVIEW': setters.setPreviewId(command.payload); break;
        case 'SWITCHER_CUT': 
            if (state.programId !== state.previewId) {
                handleProgramChange(state.previewId, state, setters);
            }
            break;
        case 'SWITCHER_AUTO': 
            if (state.programId !== state.previewId && !state.transition.isActive) {
                // Start the transition. The actual animation is handled by a useEffect in App.tsx
                setters.setTransition({ ...state.transition, isActive: true, progress: 0 });
            }
            break;
        case 'SWITCHER_SET_TRANSITION_TYPE': setters.setTransition(t => ({...t, type: command.payload})); break;
        case 'SWITCHER_SET_TRANSITION_DURATION': setters.setTransition(t => ({...t, duration: command.payload})); break;
        case 'SWITCHER_SET_TRANSITION_PROGRESS':
             setters.setTransition(t => ({...t, isActive: true, progress: command.payload }));
             if (command.payload >= 1) {
                 handleProgramChange(state.previewId, state, setters);
                 setters.setTransition(t => ({...t, isActive: false, progress: 0}));
             } else if (command.payload <= 0) {
                 setters.setTransition(t => ({...t, isActive: false, progress: 0}));
             }
            break;

        // Audio
        case 'AUDIO_SET_FADER_LEVEL': setters.setAudioSources(sources => sources.map(s => s.id === command.payload.channelId ? {...s, volume: command.payload.level} : s)); break;
        case 'AUDIO_SET_GAIN_TRIM': setters.setAudioSources(sources => sources.map(s => s.id === command.payload.channelId ? {...s, gain: command.payload.gain} : s)); break;
        case 'AUDIO_TOGGLE_MUTE':
            if (state.controlSurfaceState.micLock && command.payload === config.audioConsole.micLock.protectedChannelId) { console.warn("AUDIO SAFETY: Cannot mute locked microphone."); return; }
            setters.setAudioSources(sources => sources.map(s => s.id === command.payload ? {...s, isMuted: !s.isMuted} : s));
            break;
        case 'AUDIO_TOGGLE_SOLO':
             setters.setAudioSources(sources => {
                const isSoloActive = sources.some(s => s.id !== command.payload && s.isSolo);
                return sources.map(s => {
                    if (s.id === command.payload) return {...s, isSolo: !s.isSolo, isMuted: false};
                    if (!isSoloActive && !s.isSolo) return {...s, isMuted: true};
                    return s;
                })
            });
            break;
        case 'AUDIO_SET_EQ': setters.setAudioSources(sources => sources.map(s => s.id === command.payload.channelId ? {...s, eq: {...s.eq, [command.payload.band]: command.payload.value}} : s)); break;
        case 'AUDIO_SET_COMPRESSOR': setters.setAudioSources(sources => sources.map(s => s.id === command.payload.channelId ? {...s, compressor: { threshold: command.payload.threshold, ratio: command.payload.ratio }} : s)); break;
        case 'AUDIO_SET_GATE': setters.setAudioSources(sources => sources.map(s => s.id === command.payload.channelId ? {...s, gate: { threshold: command.payload.threshold }} : s)); break;
        case 'AUDIO_SET_PAN': setters.setAudioSources(sources => sources.map(s => s.id === command.payload.channelId ? {...s, pan: command.payload.pan } : s)); break;
        case 'AUDIO_TOGGLE_HPF': setters.setAudioSources(sources => sources.map(s => s.id === command.payload ? {...s, hpf: {...s.hpf, enabled: !s.hpf.enabled}} : s)); break;
        case 'AUDIO_SET_BUS_SEND': setters.setAudioSources(sources => sources.map(s => s.id === command.payload.channelId ? {...s, busSends: {...s.busSends, [command.payload.bus]: command.payload.level}} : s)); break;
        case 'AUDIO_UPDATE_SOURCE': setters.setAudioSources(sources => sources.map(s => s.id === command.payload.id ? {...s, ...command.payload.values} : s)); break;
        case 'AUDIO_SET_FX_STATE': setters.setAudioFXState(command.payload); break;
        case 'AUDIO_SET_MIX_MINUS': setters.setAudioSources(sources => sources.map(s => s.id === command.payload.channelId ? {...s, mixMinus: command.payload.enabled} : s)); break;
        
        // Console
        case 'CONSOLE_TOGGLE_AFV': setters.setControlSurfaceState(s => ({...s, audioFollowsVideo: !s.audioFollowsVideo})); break;
        case 'CONSOLE_TOGGLE_MIC_LOCK': setters.setControlSurfaceState(s => ({...s, micLock: !s.micLock})); break;

        // VJ Mixer
        case 'VJMixer_SET_MODE': setters.setVJMixerState(s => ({...s, mode: command.payload})); break;
        case 'VJMixer_SET_CROSSFADE': setters.setVJMixerState(s => ({...s, crossfade: command.payload})); break;
        case 'VJMixer_ASSIGN_DECK': setters.setVJMixerState(s => ({...s, [command.payload.deck]: command.payload.sourceId})); break;
        case 'VJMixer_CLEAR_DECK': setters.setVJMixerState(s => ({...s, [command.payload.deck]: null})); break;

        // Master & Output
        case 'MASTER_GO_LIVE': setters.setIsLive(l => !l); if (!state.isLive) setters.setIsRecording(true); break;
        case 'MASTER_TOGGLE_RECORD': setters.setIsRecording(r => !r); break;
        case 'OUTPUT_SET_STATE': setters.setOutputState(command.payload); break;

        // System
        case 'SYSTEM_TRIGGER_FAILSAFE': setters.setProgramId('safe-scene-src'); setters.setLightingState(ls => ({...ls, activeSceneId: config.lighting.safeSceneId })); break;
        case 'SYSTEM_SET_HEALTH': setters.setSystemHealth(s => ({ ...s, ...command.payload })); break;
        case 'SESSION_UPDATE_METADATA': setters.setBroadcastSession(s => ({ ...s, ...command.payload })); break;
        case 'SAVE_CONFIGURATION':
            const name = prompt(es.promptConfigName);
            if (name) {
                const newState: AppState = { sources: state.sources, scenes: state.scenes, overlays: state.overlays, branding: state.branding };
                const newPreset: ConfigPreset = { name, state: newState };
                setters.setSavedConfigs(p => [...p, newPreset]);
                alert(`'${name}' ${es.configSaved}`);
            }
            break;
        case 'LOAD_CONFIGURATION':
             const loadedConfig = state.savedConfigs[command.payload];
            if (loadedConfig) {
                setters.setSources(loadedConfig.state.sources);
                setters.setScenes(loadedConfig.state.scenes);
                setters.setOverlays(loadedConfig.state.overlays);
                setters.setBranding(loadedConfig.state.branding);
                alert(`'${loadedConfig.name}' ${es.configLoaded}`);
            }
            break;
        
        // Overlays & Scoreboard
        case 'SCOREBOARD_SET_STATE': setters.setScoreboardState(command.payload); break;
        case 'OVERLAY_ADD': setters.setOverlays(o => [...o, command.payload]); break;
        case 'OVERLAY_REMOVE': setters.setOverlays(o => o.filter(ov => ov.id !== command.payload)); break;
        case 'OVERLAY_TOGGLE': setters.setOverlays(overlays => overlays.map(o => o.id === command.payload ? {...o, active: !o.active} : o)); break;
        case 'OVERLAY_UPDATE_CONTENT': setters.setOverlays(o => o.map(ov => ov.id === command.payload.id ? {...ov, content: {...ov.content, ...command.payload.content}} : ov)); break;
        case 'COMMENT_CONFIG_UPDATE': setters.setCommentOverlayConfig(command.payload); break;

        // UI
        case 'UI_TOGGLE_SINGLE_MODE_PANEL': setters.setControlSurfaceState(s => ({...s, activeSingleModePanel: s.activeSingleModePanel === command.payload ? SingleModePanel.NONE : command.payload })); break;
        
        // Lighting
        case 'LIGHTING_SET_SCENE': setters.setLightingState(ls => ({...ls, activeSceneId: command.payload })); break;
        case 'LIGHTING_SET_MASTER_INTENSITY': setters.setLightingState(ls => ({...ls, masterIntensity: command.payload })); break;
        case 'LIGHTING_SET_COLOR_TEMP': setters.setLightingState(ls => ({...ls, colorTemperature: command.payload })); break;
        
        // Sources
        case 'SOURCE_ADD': setters.setSources(s => [...s, command.payload]); break;
        case 'SOURCE_BATCH_ADD':
            setters.setSources(s => [...s, ...command.payload.video]);
            setters.setAudioSources(a => [...a, ...command.payload.audio]);
            break;
        case 'SOURCE_UPDATE': setters.setSources(s => s.map(src => src.id === command.payload.id ? {...src, ...command.payload.values} : src)); break;
        case 'SOURCE_REMOVE': setters.setSources(s => s.filter(src => src.id !== command.payload)); break;
        case 'SOURCE_ADD_GUEST':
            const { guest, sourceType } = command.payload;
            const newSourceName = guest.platform ? `${guest.name} (${guest.platform})` : guest.name;
            const newSourceId = `guest-src-${guest.id}`;
            const newAudioSourceId = `guest-audio-${guest.id}`;

            const newGuestSource: Source = {
                id: newSourceId,
                name: newSourceName,
                type: sourceType,
                isVisible: true,
            };
            const newGuestAudioSource: AudioSource = {
                id: newAudioSourceId, name: guest.name, volume: 70, gain: 0, isMuted: false, isSolo: false, pan: 0, hpf: { enabled: true, frequency: 100 }, eq: { low: 0, mid1: 0, mid2: 0, high: 0 }, compressor: { threshold: -18, ratio: 3 }, gate: { threshold: -50 }, busSends: { aux1: 0, aux2: 0 }, mixMinus: false
            };
            
            setters.setSources(s => [...s, newGuestSource]);
            setters.setAudioSources(a => [...a, newGuestAudioSource]);
            setters.setGuests(guests => guests.map(g => g.id === guest.id ? { ...g, sourceId: newSourceId, audioSourceId: newAudioSourceId } : g));
            break;
        
        // Scenes
        case 'SCENE_ADD':
            const newScene: Scene = { id: `scene-${Date.now()}`, name: command.payload.name, items: [] };
            setters.setScenes(s => [...s, newScene]);
            break;
        case 'SCENE_REMOVE': setters.setScenes(s => s.filter(sc => sc.id !== command.payload)); break;
        case 'SCENE_UPDATE': setters.setScenes(s => s.map(sc => sc.id === command.payload.id ? {...sc, ...command.payload.values} : sc)); break;
        case 'SCENE_ADD_LAYER':
            const sourceToAdd = state.sources.find(s => s.id === command.payload.sourceId);
            if (!sourceToAdd) break;
            const newLayer: Scene['items'][0] = {
                id: `item-${Date.now()}`, sourceId: command.payload.sourceId, type: sourceToAdd.type,
                transform: { x: 25, y: 25, width: 50, height: 50, zIndex: 1 },
                properties: { opacity: 1 }
            };
            setters.setScenes(s => s.map(sc => sc.id === command.payload.sceneId ? {...sc, items: [...sc.items, newLayer]} : sc));
            break;
        case 'SCENE_REMOVE_LAYER':
             setters.setScenes(s => s.map(sc => sc.id === command.payload.sceneId ? {...sc, items: sc.items.filter(item => item.id !== command.payload.itemId)} : sc));
            break;
        case 'SCENE_UPDATE_LAYER':
             setters.setScenes(s => s.map(sc => {
                if (sc.id !== command.payload.sceneId) return sc;
                const newItems = sc.items.map(item => item.id === command.payload.itemId ? { ...item, ...command.payload.values } : item);
                return {...sc, items: newItems};
            }));
            break;
        
        // Stream
        case 'STREAM_UPDATE_DESTINATION': setters.setStreamDestinations(d => d.map(dest => dest.id === command.payload.id ? {...dest, ...command.payload.values} : dest)); break;
        
        // Branding
        case 'BRANDING_UPDATE': setters.setBranding(command.payload); break;

        // Guests
        case 'GUEST_ADD_SIMULATED':
            const guestNum = state.guests.length + 1;
            const newGuest: Guest = { 
                id: `guest-${Date.now()}`, 
                name: `Invitado ${guestNum}`, 
                status: 'Conectado', 
                type: command.payload.type,
                ...(command.payload.type === 'CAPTURE' && { platform: command.payload.platform })
            };
            setters.setGuests(g => [...g, newGuest]);
            break;
        case 'GUEST_UPDATE':
            setters.setGuests(guests => guests.map(g => g.id === command.payload.id ? {...g, ...command.payload.values} : g));
            break;
        case 'GUEST_REMOVE':
            const guestToRemove = state.guests.find(g => g.id === command.payload);
            if(guestToRemove) {
                if(guestToRemove.sourceId) setters.setSources(s => s.filter(src => src.id !== guestToRemove.sourceId));
                if(guestToRemove.audioSourceId) setters.setAudioSources(a => a.filter(aud => aud.id !== guestToRemove.audioSourceId));
                setters.setGuests(g => g.filter(gst => gst.id !== command.payload));
            }
            break;

        // AI
        case 'AI_SET_SUGGESTIONS': setters.setAiSuggestions(command.payload); break;
        
        // Replay
        case 'REPLAY_TRIGGER':
            if (state.replayState.isActive) break;
            setters.setReplayState({ isActive: true, isSlowMo: false });
            setTimeout(() => {
                setters.setReplayState(s => s.isActive ? { ...s, isActive: false } : s);
            }, command.payload.duration * 1000);
            break;
        case 'REPLAY_TOGGLE_SLOMO': setters.setReplayState(s => ({...s, isSlowMo: s.isActive ? !s.isSlowMo : s.isSlowMo })); break;
        case 'REPLAY_RETURN_LIVE': setters.setReplayState(s => ({...s, isActive: false })); break;

        default: break;
    }
};
