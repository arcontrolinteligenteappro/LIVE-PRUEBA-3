
import React, { useState, useEffect } from 'react';
import { Source, ProgramItem, Overlay, OverlayType, SceneItem, SourceType, BrandingState, BrandingPosition, TransitionState, TransitionType, CommentOverlayConfig, VJMixerState, ReplayState, ScoreboardState, AudioSource } from '../types';
import { IconYouTube, IconFacebook, IconTikTok, IconExpand, IconCompress } from './Icons';

// --- BROADCAST VUMETER ---
const VUMeter: React.FC<{ volume: number, isMuted: boolean, label: string }> = ({ volume, isMuted, label }) => {
    const [peak, setPeak] = useState(0);

    useEffect(() => {
        let timeout: number;
        if (!isMuted && volume > 0) {
            // Simulate audio signal with random peaks
            const randomPeak = (volume / 100) * (0.6 + Math.random() * 0.5);
            setPeak(p => Math.max(p, randomPeak)); // Hold peak
            timeout = window.setTimeout(() => setPeak(p => p * 0.7), 700); // Slower decay for peak hold
        } else {
            setPeak(0);
        }
        return () => clearTimeout(timeout);
    }, [volume, isMuted]);

    const level = isMuted ? 0 : volume / 100;
    const peakLevel = Math.min(1, peak);
    const isClipping = peakLevel > 0.95;

    return (
        <div className="flex items-center gap-2 px-2 py-1 bg-black/40 text-xs w-full">
            <span className="font-bold text-gray-400 w-8">{label}</span>
            <div className="relative flex-grow h-4 bg-gray-800 rounded-sm overflow-hidden border border-gray-900">
                <div className="absolute top-0 left-0 h-full bg-gradient-to-r from-green-600 via-yellow-500 to-red-600" style={{ width: `${level * 100}%` }}></div>
                <div className={`absolute top-0 h-full w-0.5 bg-white/80`} style={{ left: `${peakLevel * 100}%` }}></div>
            </div>
            <div className={`w-4 h-4 rounded-sm ${isClipping ? 'bg-red-600 animate-pulse' : 'bg-gray-700'}`}></div>
        </div>
    );
};


// --- SPORT-SPECIFIC SCOREBOARD RENDERERS ---

const SoccerScoreboard: React.FC<{ state: ScoreboardState }> = ({ state }) => (
    <div className="absolute top-4 right-4 bg-black/70 text-white p-2 rounded-lg shadow-lg text-center w-56 pointer-events-auto">
        <div className="flex justify-between items-center mt-1">
            <div className="flex-1 text-center">
                <div className="text-lg font-bold">{state.home.short}</div>
                <div className="text-4xl font-black">{state.home.score}</div>
            </div>
            <div className="text-2xl font-bold mx-2">{state.period.label}</div>
            <div className="flex-1 text-center">
                <div className="text-lg font-bold">{state.away.short}</div>
                <div className="text-4xl font-black">{state.away.score}</div>
            </div>
        </div>
        <div className="mt-1 text-2xl font-mono">{state.clock.display}</div>
    </div>
);

const BasketballScoreboard: React.FC<{ state: ScoreboardState }> = ({ state }) => (
     <div className="absolute top-4 inset-x-4 max-w-sm mx-auto bg-black/70 text-white p-2 rounded-lg shadow-lg flex justify-between items-center pointer-events-auto">
        <div className="text-center">
            <span className="text-2xl font-bold">{state.home.short}</span>
            <span className="text-4xl font-black ml-2">{state.home.score}</span>
        </div>
        <div className="text-center">
             <div className="text-2xl font-bold">{state.period.label}</div>
             <div className="text-2xl font-mono">{state.clock.display}</div>
        </div>
        <div className="text-center">
            <span className="text-4xl font-black mr-2">{state.away.score}</span>
            <span className="text-2xl font-bold">{state.away.short}</span>
        </div>
    </div>
);

const BaseballScoreboard: React.FC<{ state: ScoreboardState }> = ({ state }) => (
    <div className="absolute bottom-4 inset-x-4 max-w-md mx-auto bg-black/70 text-white p-2 rounded-lg shadow-lg flex items-center justify-around text-center pointer-events-auto">
        <div>
            <div className="text-sm">BALL</div>
            <div className="text-2xl font-bold">{state.count?.balls || 0}</div>
        </div>
         <div>
            <div className="text-sm">STRIKE</div>
            <div className="text-2xl font-bold">{state.count?.strikes || 0}</div>
        </div>
         <div>
            <div className="text-sm">OUT</div>
            <div className="text-2xl font-bold">{state.outs || 0}</div>
        </div>
        <div className="text-2xl font-bold">{state.inning?.half} {state.inning?.index}</div>
    </div>
);

const BoxingScoreboard: React.FC<{ state: ScoreboardState }> = ({ state }) => (
    <div className="absolute top-4 inset-x-4 max-w-md mx-auto bg-black/70 text-white p-2 rounded-lg shadow-lg flex justify-between items-center pointer-events-auto">
        <div className="text-center text-red-400">
            <span className="text-2xl font-bold">{state.red?.name}</span>
            <span className="text-4xl font-black ml-2">{state.red?.score || 0}</span>
        </div>
        <div className="text-center">
             <div className="text-2xl font-bold">R{state.round?.index}</div>
             <div className="text-2xl font-mono">{state.clock.display}</div>
        </div>
        <div className="text-center text-blue-400">
            <span className="text-4xl font-black mr-2">{state.blue?.score || 0}</span>
            <span className="text-2xl font-bold">{state.blue?.name}</span>
        </div>
    </div>
);

const renderSceneItem = (item: SceneItem, sources: Source[]) => {
    const source = sources.find(s => s.id === item.sourceId);
    if (!source) return null;

    const style: React.CSSProperties = {
        position: 'absolute',
        left: `${item.transform.x}%`,
        top: `${item.transform.y}%`,
        width: `${item.transform.width}%`,
        height: `${item.transform.height}%`,
        zIndex: item.transform.zIndex,
        opacity: item.properties.opacity,
        border: '1px solid #4a5568',
    };

    switch(source.type) {
        case SourceType.IMAGE: return <img src={source.content} style={style} className="object-contain" alt={source.name} />;
        case SourceType.TEXT: return <div style={style} className="flex items-center justify-center text-white font-bold text-2xl bg-black/30 p-2 break-all">{source.content}</div>;
        default: return <img src={`https://picsum.photos/seed/${source.id}/320/180`} style={style} className="object-cover" alt={source.name} />;
    }
}

const renderItemContent = (item: ProgramItem | undefined, sources: Source[]) => {
    if (!item || item.id === 'blank') return <div className="text-gray-500 text-2xl font-bold">BLACK</div>;
    if ('items' in item) return <div className="w-full h-full relative bg-gray-700">{item.items.map(sceneItem => renderSceneItem(sceneItem, sources))}</div>;
    return <img src={`https://picsum.photos/seed/${item.id}/640/360`} alt={item.name} className="object-cover w-full h-full" />;
};

const renderScoreboardOverlay = (overlay: Overlay) => {
    const state = overlay.content as ScoreboardState;
    if (!state || !state.sportId) return null;

    switch(state.sportId) {
        case 'soccer':
        case 'rapido':
            return <SoccerScoreboard state={state} />;
        case 'basketball':
            return <BasketballScoreboard state={state} />;
        case 'baseball':
        case 'softball':
            return <BaseballScoreboard state={state} />;
        case 'boxing':
            return <BoxingScoreboard state={state} />;
        default:
            // Fallback for other sports
            return <SoccerScoreboard state={state} />;
    }
};

const renderLowerThirdOverlay = (overlay: Overlay) => (
     <div key={overlay.id} className="absolute bottom-16 left-8 bg-blue-600/80 text-white p-3 rounded-md shadow-lg text-left max-w-md break-words pointer-events-auto">
        <p className="font-bold text-2xl">{overlay.content.title}</p><p className="text-md">{overlay.content.subtitle}</p>
    </div>
);

const platformIcons = {
    YouTube: <IconYouTube className="w-5 h-5 text-red-500" />,
    Facebook: <IconFacebook className="w-5 h-5 text-blue-500" />,
    TikTok: <IconTikTok className="w-5 h-5" />,
};
const renderCommentOverlay = (overlay: Overlay, config: CommentOverlayConfig) => (
    <div key={overlay.id} className="absolute bottom-16 right-8 p-3 rounded-md shadow-lg text-left max-w-sm break-words pointer-events-auto" style={{backgroundColor: `${config.backgroundColor}${Math.round(config.opacity * 255).toString(16).padStart(2, '0')}`}}>
        <div className="flex items-center space-x-2 mb-1">
            {platformIcons[overlay.content.platform as keyof typeof platformIcons]}
            <p className="font-bold text-md">{overlay.content.author}</p>
        </div>
        <p className="text-sm">{overlay.content.text}</p>
    </div>
);


const positionClasses: Record<BrandingPosition, string> = { 'top-left': 'top-4 left-4', 'top-right': 'top-4 right-4', 'bottom-left': 'bottom-4 left-4', 'bottom-right': 'bottom-4 right-4' };

export const SourceMonitor: React.FC<{
    item?: ProgramItem, fromItem?: ProgramItem | null, toItem?: ProgramItem | null,
    transitionState?: TransitionState, label: string, isProgram: boolean,
    activeOverlays?: Overlay[], branding?: BrandingState, sources: Source[], audioSources?: AudioSource[],
    liveTime?: number, commentOverlayConfig?: CommentOverlayConfig, vjMixerState?: VJMixerState,
    replayState?: ReplayState,
    onToggleFullscreen?: () => void;
    isFullscreen?: boolean;
}> = ({ item, fromItem, toItem, transitionState, label, isProgram, activeOverlays, branding, sources, audioSources, liveTime, commentOverlayConfig, vjMixerState, replayState, onToggleFullscreen, isFullscreen }) => {
    const borderColor = isProgram ? 'border-red-600' : 'border-green-600';
    const labelColor = isProgram ? 'bg-red-600' : 'bg-green-600';

    const formatTime = (seconds: number) => {
        const h = Math.floor(seconds / 3600).toString().padStart(2, '0');
        const m = Math.floor((seconds % 3600) / 60).toString().padStart(2, '0');
        const s = (seconds % 60).toString().padStart(2, '0');
        return `${h}:${m}:${s}`;
    };

    const renderOverlays = () => {
        if (!activeOverlays) return null;
        return (
            <div className="absolute inset-0 pointer-events-none z-20">
                {activeOverlays.map(overlay => {
                    switch(overlay.type) {
                        case OverlayType.SCOREBOARD: return renderScoreboardOverlay(overlay);
                        case OverlayType.LOWER_THIRD: return renderLowerThirdOverlay(overlay);
                        case OverlayType.COMMENT: return commentOverlayConfig ? renderCommentOverlay(overlay, commentOverlayConfig) : null;
                        case OverlayType.REPLAY: return <div className="absolute top-4 left-4 bg-blue-600/80 text-white p-2 font-bold text-xl rounded">REPLAY</div>
                        default: return null;
                    }
                })}
            </div>
        );
    }

    const renderBranding = () => {
        if (!branding) return null;
        return (
            <div className="absolute inset-0 pointer-events-none z-30">
                {branding.logo.enabled && (<img src={branding.logo.content} className={`absolute ${positionClasses[branding.logo.position]}`} style={{ opacity: branding.logo.opacity, width: `${branding.logo.size}%`}} alt="Branding Logo"/>)}
                {branding.text.enabled && (<p className={`absolute ${positionClasses[branding.text.position]} font-bold`} style={{ opacity: branding.text.opacity, fontSize: `${branding.text.size}px`, color: branding.text.color }}>{branding.text.content}</p>)}
            </div>
        )
    };
    
    const getTransitionStyles = () => {
        const styles: { from: React.CSSProperties, to: React.CSSProperties } = { from: {}, to: {} };
        if (!transitionState?.isActive) return styles;
        const { type, progress } = transitionState;
        switch (type) {
            case TransitionType.FADE: styles.from = { opacity: 1 - progress, position: 'absolute', inset: 0, zIndex: 1 }; styles.to = { opacity: progress, position: 'absolute', inset: 0, zIndex: 2 }; break;
            case TransitionType.WIPE_LR: styles.from = { clipPath: `polygon(0 0, ${100 - progress * 100}% 0, ${100 - progress * 100}% 100%, 0 100%)`, position: 'absolute', inset: 0, zIndex: 1 }; styles.to = { clipPath: `polygon(${100 - progress * 100}% 0, 100% 0, 100% 100%, ${100 - progress * 100}% 100%)`, position: 'absolute', inset: 0, zIndex: 2 }; break;
        }
        return styles;
    };

    const renderContent = () => {
        if (isProgram && vjMixerState?.mode === 'vj') {
            const deckAItem = sources.find(s => s.id === vjMixerState.deckA);
            const deckBItem = sources.find(s => s.id === vjMixerState.deckB);
            const crossfade = vjMixerState.crossfade; // -1 to 1
            const opacityA = Math.max(0, 1 - (crossfade + 1) / 2);
            const opacityB = Math.max(0, (crossfade + 1) / 2);

            return (<>
                <div style={{opacity: opacityA, position: 'absolute', inset: 0, zIndex: 1}} className="w-full h-full">{renderItemContent(deckAItem, sources)}</div>
                <div style={{opacity: opacityB, position: 'absolute', inset: 0, zIndex: 2}} className="w-full h-full">{renderItemContent(deckBItem, sources)}</div>
            </>);
        }

        if (isProgram && transitionState?.isActive && fromItem && toItem) {
            const styles = getTransitionStyles();
            return (<><div style={styles.from} className="w-full h-full">{renderItemContent(fromItem, sources)}</div><div style={styles.to} className="w-full h-full">{renderItemContent(toItem, sources)}</div></>);
        }
        return renderItemContent(item, sources);
    };

    const masterAudio = audioSources?.find(s => s.id === 'master');
    const sourceAudioId = `audio-${item?.id.replace('scene-', 'cam-')}`;
    const sourceAudio = audioSources?.find(s => s.id === sourceAudioId);

    return (
        <div className="flex flex-col h-full bg-black rounded-lg overflow-hidden">
            {!isFullscreen && (
                <div className={`text-white text-xs font-bold uppercase p-1 flex justify-between items-center ${labelColor}`}>
                    <div className="flex items-center gap-2">
                        <span>{label}: {item?.name || 'BLACK'}</span>
                        {isProgram && liveTime !== undefined && liveTime > 0 && <span className="font-mono bg-black/30 px-2 py-0.5 rounded">{formatTime(liveTime)}</span>}
                    </div>
                    {onToggleFullscreen && (
                        <button onClick={onToggleFullscreen} className="p-1 hover:bg-white/20 rounded-full" aria-label="Toggle Fullscreen">
                            <IconExpand className="w-4 h-4" />
                        </button>
                    )}
                </div>
            )}
            <div className={`relative flex-grow ${!isFullscreen ? `border-4 ${borderColor}`: ''} flex items-center justify-center overflow-hidden`}>
                {renderContent()}
                {isProgram && renderOverlays()}
                {isProgram && renderBranding()}
                {isProgram && replayState?.isActive && (
                    <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center z-40 pointer-events-none">
                        <div className="text-4xl lg:text-6xl font-black text-blue-400 tracking-widest animate-pulse" style={{ textShadow: '0 0 15px rgba(59, 130, 246, 0.7)' }}>REPLAY</div>
                        {replayState.isSlowMo && <div className="mt-2 px-4 py-1 bg-white/20 text-white rounded-full text-lg lg:text-xl font-bold">SLOW MOTION 0.5x</div>}
                    </div>
                )}
                {isFullscreen && onToggleFullscreen && (
                    <button onClick={onToggleFullscreen} className="absolute top-4 right-4 p-2 bg-black/50 hover:bg-black/80 rounded-full z-40" aria-label="Exit Fullscreen">
                        <IconCompress className="w-6 h-6" />
                    </button>
                )}
            </div>
             {audioSources && !isFullscreen && (
                <div className="flex-shrink-0">
                    {sourceAudio && <VUMeter volume={sourceAudio.volume} isMuted={sourceAudio.isMuted} label={sourceAudio.name.substring(0,3).toUpperCase()} />}
                    {isProgram && masterAudio && <VUMeter volume={masterAudio.volume} isMuted={masterAudio.isMuted} label="MST"/>}
                </div>
            )}
        </div>
    );
};
