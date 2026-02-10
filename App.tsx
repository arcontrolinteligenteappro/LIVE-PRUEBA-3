
import React, { useState, useCallback, useEffect, useRef } from 'react';
import { ProductionMode, UiMode, Source, Scene, Overlay, AudioSource, StreamDestination, OverlayType, SceneItem, BrandingState, TransitionState, TransitionType, Comment, CommentOverlayConfig, ConfigPreset, AppState, AiSuggestion, VJMixerState, AudioFXState, Guest, SourceType, ControlSurfaceState, SingleModePanel, LightingState, BroadcastSession, AppSetupState, ReplayState, OutputState, ScoreboardState, SystemHealthState } from './types';
import { Command, dispatchCommand } from './components/console/CommandBus';
import { INITIAL_SOURCES, INITIAL_SCENES, INITIAL_AUDIO_SOURCES, INITIAL_STREAM_DESTINATIONS, INITIAL_LIGHTING_SCENES } from './constants';
import Header from './components/Header';
import SingleModeLayout from './components/single/SingleModeLayout';
import ConsoleLayout from './components/console/ConsoleLayout';
import SetupWizard from './components/SetupWizard';
import { es } from './localization';
import { useGamepad } from './hooks/useGamepad';
import { loadScoreboardState } from './data/sports';
import GlobalSelectors from './components/GlobalSelectors';
import { useResponsiveLayout } from './hooks/useResponsiveLayout';

const App: React.FC = () => {
  const [appSetupState, setAppSetupState] = useState<AppSetupState>(() => {
    return localStorage.getItem('arcls-setup-complete') === 'true'
        ? 'configured'
        : 'unconfigured';
  });
  const [productionMode, setProductionMode] = useState<ProductionMode>(ProductionMode.SPORTS);
  const uiFace = useResponsiveLayout();
  const [theme, setTheme] = useState<'light' | 'dark'>(() => (localStorage.getItem('arcls-theme') as 'light' | 'dark') || 'dark');

  const [isLive, setIsLive] = useState<boolean>(false);
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [liveTime, setLiveTime] = useState(0);
  const [recordingTime, setRecordingTime] = useState(0);
  const [fullscreenMonitor, setFullscreenMonitor] = useState<'preview' | 'program' | null>(null);

  const [sources, setSources] = useState<Source[]>(INITIAL_SOURCES);
  const [scenes, setScenes] = useState<Scene[]>(INITIAL_SCENES);
  const [audioSources, setAudioSources] = useState<AudioSource[]>(INITIAL_AUDIO_SOURCES);
  const [streamDestinations, setStreamDestinations] = useState<StreamDestination[]>(INITIAL_STREAM_DESTINATIONS);
  const [overlays, setOverlays] = useState<Overlay[]>([{ id: 'main_scoreboard', type: OverlayType.SCOREBOARD, active: false, content: {} }]);

  const [previewId, setPreviewId] = useState<string>('scene-1');
  const [programId, setProgramId] = useState<string>('blank');

  const [branding, setBranding] = useState<BrandingState>({
    logo: { enabled: false, content: 'https://picsum.photos/seed/brandlogo/200/100', opacity: 0.8, size: 10, position: 'bottom-right' },
    text: { enabled: false, content: 'ARCLS Production', opacity: 0.8, size: 16, position: 'bottom-left', color: '#FFFFFF' }
  });
  const [transition, setTransition] = useState<TransitionState>({ type: TransitionType.FADE, duration: 500, isActive: false, progress: 0 });
  const [commentOverlayConfig, setCommentOverlayConfig] = useState<CommentOverlayConfig>({ backgroundColor: '#1a202c', opacity: 0.8 });
  
  const [savedConfigs, setSavedConfigs] = useState<ConfigPreset[]>([]);
  const [aiSuggestions, setAiSuggestions] = useState<AiSuggestion[]>([]);

  const [vjMixerState, setVJMixerState] = useState<VJMixerState>({ deckA: null, deckB: null, crossfade: 0, mode: 'transition' });
  const [audioFXState, setAudioFXState] = useState<AudioFXState>({ filter: 0, echo: 0, reverb: 0 });
  const [guests, setGuests] = useState<Guest[]>([]);
  const [controlSurfaceState, setControlSurfaceState] = useState<ControlSurfaceState>({ audioFollowsVideo: false, micLock: true, activeSingleModePanel: SingleModePanel.NONE });
  const [lightingState, setLightingState] = useState<LightingState>({
      scenes: INITIAL_LIGHTING_SCENES,
      activeSceneId: INITIAL_LIGHTING_SCENES[0]?.id || null,
      masterIntensity: 100,
      colorTemperature: 5600,
  });
  const [broadcastSession, setBroadcastSession] = useState<BroadcastSession>({
    eventName: 'Mi Evento en Vivo', date: new Date().toISOString().split('T')[0], sport: 'Soccer', venue: 'Estadio Local', league: 'Liga Master', homeTeam: 'Equipo A', awayTeam: 'Equipo B', sponsors: 'Sponsor Principal'
  });
  const [replayState, setReplayState] = useState<ReplayState>({ isActive: false, isSlowMo: false });
  const [outputState, setOutputState] = useState<OutputState>({ resolution: '1080p', fps: 30 });
  const [scoreboardState, setScoreboardState] = useState<ScoreboardState>(loadScoreboardState('soccer'));
  const [systemHealth, setSystemHealth] = useState<SystemHealthState>({
    temperature: 45, battery: 90, signal: 95, bitrate: 5500, fps: 29.97, droppedFrames: 0, latency: 25
  });
  const animationFrameRef = useRef<number | null>(null);

  useEffect(() => {
    document.documentElement.classList.remove('light', 'dark');
    document.documentElement.classList.add(theme);
    localStorage.setItem('arcls-theme', theme);
  }, [theme]);


  const state = { sources, scenes, audioSources, streamDestinations, overlays, previewId, programId, branding, transition, commentOverlayConfig, savedConfigs, aiSuggestions, vjMixerState, audioFXState, guests, controlSurfaceState, isLive, isRecording, lightingState, broadcastSession, replayState, outputState, scoreboardState, systemHealth };
  const setters = { setSources, setScenes, setAudioSources, setStreamDestinations, setOverlays, setPreviewId, setProgramId, setBranding, setTransition, setCommentOverlayConfig, setSavedConfigs, setAiSuggestions, setVJMixerState, setAudioFXState, setGuests, setSystemHealth, setControlSurfaceState, setIsLive, setIsRecording, setLightingState, setBroadcastSession, setReplayState, setOutputState, setScoreboardState };

  const handleDispatch = (command: Command) => {
    dispatchCommand(command, state, setters);
  };
  
  const isGamepadConnected = useGamepad(handleDispatch);
  
  const handleSetupComplete = () => {
    localStorage.setItem('arcls-setup-complete', 'true');
    setAppSetupState('configured');
  };

  useEffect(() => {
    if (scoreboardState) {
        setOverlays(prevOverlays => {
            const scoreboardOverlay = prevOverlays.find(o => o.id === 'main_scoreboard');
            if (scoreboardOverlay && scoreboardOverlay.content !== scoreboardState) {
                return prevOverlays.map(o => o.id === 'main_scoreboard' ? { ...o, content: scoreboardState } : o);
            }
            return prevOverlays;
        });
    }
  }, [scoreboardState]);

  // Transition Engine
  useEffect(() => {
    // Start the animation if transition is active and we're at the beginning
    if (transition.isActive && transition.progress === 0) {
        const startTime = performance.now();

        const animate = (currentTime: number) => {
            const elapsedTime = currentTime - startTime;
            const progress = Math.min(elapsedTime / transition.duration, 1);
            
            handleDispatch({ type: 'SWITCHER_SET_TRANSITION_PROGRESS', payload: progress });

            if (progress < 1) {
                animationFrameRef.current = requestAnimationFrame(animate);
            } else {
                animationFrameRef.current = null;
            }
        };
        animationFrameRef.current = requestAnimationFrame(animate);
    }

    // Cleanup function to cancel animation if component unmounts or transition is cancelled
    return () => {
        if (animationFrameRef.current) {
            cancelAnimationFrame(animationFrameRef.current);
            animationFrameRef.current = null;
        }
    };
  }, [transition.isActive, transition.duration]);

  useEffect(() => {
    let liveTimer: number;
    if (isLive) { 
      liveTimer = window.setInterval(() => { setLiveTime(prevTime => prevTime + 1); }, 1000); 
      const healthInterval = window.setInterval(() => {
        setSystemHealth(prev => ({
          ...prev,
          bitrate: 5200 + Math.floor(Math.random() * 800),
          droppedFrames: prev.droppedFrames + (Math.random() > 0.98 ? 1 : 0),
          temperature: prev.temperature + 0.1,
          latency: 20 + Math.floor(Math.random() * 15)
        }))
      }, 2000);
      return () => {
        clearInterval(liveTimer);
        clearInterval(healthInterval);
      };
    } 
    else { 
      setLiveTime(0); 
      setSystemHealth(prev => ({ ...prev, bitrate: 0, droppedFrames: 0, latency: 0 }));
    }
    
    let recTimer: number;
    if (isRecording) { recTimer = window.setInterval(() => { setRecordingTime(prevTime => prevTime + 1); }, 1000); }
    else { setRecordingTime(0); }
    
    return () => { 
        if(liveTimer) clearInterval(liveTimer);
        if(recTimer) clearInterval(recTimer);
    };
  }, [isLive, isRecording]);

  if (appSetupState === 'unconfigured') {
    return <SetupWizard onComplete={handleSetupComplete} dispatch={handleDispatch} />;
  }
  
  const programItem = scenes.find(s => s.id === programId) || sources.find(s => s.id === programId);
  const previewItem = scenes.find(s => s.id === previewId) || sources.find(s => s.id === previewId);
  
  const allSources = [...sources, ...scenes];

  const commonLayoutProps = {
    fullscreenMonitor, setFullscreenMonitor, programItem, previewItem, allSources,
    audioSources, previewId, programId, activeOverlays: overlays.filter(o => o.active),
    branding, productionMode, overlays, scenes, liveTime, commentOverlayConfig,
    controlSurfaceState, transitionState: transition, lightingState, replayState, outputState,
    dispatch: handleDispatch, broadcastSession, isGamepadConnected, streamDestinations,
    isLive, isRecording, guests, scoreboardState,
    sources: sources,
    systemStatus: systemHealth.temperature > 75 ? 'CpuStress' : (systemHealth.bitrate < 2000 && isLive) ? 'NetworkStress' : 'Normal',
    aiSuggestions: aiSuggestions,
    audioFXState: audioFXState,
    vjMixerState: vjMixerState
  };

  return (
    <div className={`flex flex-col h-screen font-sans bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200 overflow-hidden ${fullscreenMonitor ? 'bg-black' : ''}`}>
      {!fullscreenMonitor && (
        <>
          <Header 
            isLive={isLive} 
            isRecording={isRecording}
            liveTime={liveTime}
            recordingTime={recordingTime}
            systemHealth={systemHealth}
          />
          <GlobalSelectors 
             productionMode={productionMode}
             setProductionMode={setProductionMode}
             theme={theme}
             setTheme={setTheme}
             isLive={isLive}
          />
        </>
      )}
      
      {uiFace === UiMode.STUDIO ? (
        <ConsoleLayout {...commonLayoutProps} />
      ) : (
        <SingleModeLayout {...commonLayoutProps} />
      )}

      {!fullscreenMonitor && (
        <footer className="bg-gray-200 dark:bg-gray-900/50 text-center p-2 border-t border-gray-300 dark:border-gray-700 text-xs text-gray-500 dark:text-gray-500 flex-shrink-0">{es.footer}</footer>
      )}
    </div>
  );
};

export default App;
