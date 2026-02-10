
export enum ProductionMode {
  GENERAL = 'General',
  PODCAST = 'Podcast',
  SPORTS = 'Deportivo',
  COMMERCE = 'Venta',
}

export enum UiMode {
  STUDIO = 'Studio Mode',
  SINGLE = 'Single Mode',
}

export enum SourceType {
    NDI = 'NDI',
    SRT = 'SRT',
    RTSP = 'RTSP',
    USB = 'USB',
    INTERNAL = 'Internal Cam',
    PTZ_CAM = 'PTZ Cam',
    BLANK = 'Blank',
    IMAGE = 'Image',
    TEXT = 'Text',
    WEBRTC_GUEST = 'Invitado WebRTC',
    SCREEN_CAPTURE = 'Screen Capture',
    SAFE = 'Safe Scene',
}

export interface Source {
  id: string;
  type: SourceType;
  name:string;
  content?: string;
  isVisible?: boolean; 
}

export interface SceneItem {
  id: string;
  sourceId: string;
  type: SourceType;
  transform: {
    x: number; y: number; width: number; height: number; zIndex: number;
  };
  properties: {
    opacity: number; 
    text?: string;
  };
}

export interface Scene {
  id: string;
  name: string;
  items: SceneItem[]; 
  timing?: {
    mode: 'TIMED';
    durationSec: number;
    onFinish: 'RETURN_PREVIOUS';
  }
}

export type ProgramItem = Source | Scene | { id: string; name: string; };

export enum OverlayType {
    LOWER_THIRD = 'Lower Third',
    SPONSOR = 'Sponsor',
    CHAT = 'Chat',
    PRODUCT = 'Product',
    SCOREBOARD = 'Scoreboard',
    COMMENT = 'Comment',
    REPLAY = 'Replay'
}

export interface Overlay {
    id: string;
    type: OverlayType;
    content: Record<string, any> | ScoreboardState;
    active: boolean;
}

export interface AudioSource {
    id: string;
    name: string;
    volume: number; // Fader level (0-100)
    gain: number; // Trim/pre-amp (-12 to 12)
    isMuted: boolean;
    isSolo: boolean;
    isMasterLock?: boolean;
    pan: number; // -100 (L) to 100 (R)
    hpf: { enabled: boolean; frequency: number; }; // High Pass Filter
    eq: { 
        low: number; 
        mid1: number; 
        mid2: number; 
        high: number; 
    }; // 4-band EQ, -12 to 12 dB
    compressor: { threshold: number, ratio: number }; // dB, ratio
    gate: { threshold: number }; // dB
    busSends: { aux1: number; aux2: number; }; // 0-100
    mixMinus: boolean;
    delayMs?: number;
}

export interface StreamDestination {
    id: string;
    name: string;
    platform: 'YouTube' | 'Facebook' | 'TikTok';
    isActive: boolean;
    status: 'Offline' | 'Connecting' | 'Live' | 'Error';
    liveSince: number | null;
    viewers: number;
}

export type BrandingPosition = 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';

export interface BrandingElement {
    enabled: boolean;
    content: string;
    opacity: number;
    size: number;
    position: BrandingPosition;
    color?: string;
}

export interface BrandingState {
    logo: BrandingElement;
    text: BrandingElement;
}

export enum TransitionType {
    CUT = 'Cut',
    FADE = 'Fade',
    WIPE_LR = 'Wipe L-R',
}

export interface TransitionState {
    type: TransitionType;
    duration: number; // in ms
    isActive: boolean;
    progress: number; // 0 to 1
}

export interface Comment {
    id: string;
    author: string;
    text: string;
    platform: 'YouTube' | 'Facebook' | 'TikTok';
}

export interface CommentOverlayConfig {
    backgroundColor: string;
    opacity: number;
}

export interface ReplayState {
    isActive: boolean;
    isSlowMo: boolean;
}

export interface Player {
    id: string;
    name: string;
    number: number;
}

export interface Team {
    name: string;
    lineup: Player[];
}

export interface AiSuggestion {
    id: string;
    text: string;
}

export interface AppState {
    sources: Source[];
    scenes: Scene[];
    overlays: Overlay[];
    branding: BrandingState;
    scoreboardState?: ScoreboardState;
}

export type AppSetupState = 'unconfigured' | 'configured';

export interface ConfigPreset {
    name: string;
    state: AppState;
}

export interface AudioFXState {
    filter: number; // 0-100
    echo: number; // 0-100
    reverb: number; // 0-100
}

export interface VJMixerState {
    deckA: string | null;
    deckB: string | null;
    crossfade: number; // -1 (A) to 1 (B)
    mode: 'transition' | 'vj';
}

export interface Guest {
    id: string;
    name: string;
    status: 'Conectado' | 'Conectando' | 'Caído';
    type: 'WEBRTC' | 'CAPTURE';
    platform?: 'WhatsApp' | 'Zoom' | 'Meet' | 'Skype' | 'Teams' | 'Discord' | 'Telegram' | 'Messenger';
    sourceId?: string;
    audioSourceId?: string;
}
export enum SingleModePanel {
    NONE = 'none',
    AUDIO = 'audio',
    OVERLAYS = 'overlays',
    PERFORMANCE = 'performance'
}

export interface ControlSurfaceState {
    audioFollowsVideo: boolean;
    micLock: boolean;
    activeSingleModePanel: SingleModePanel;
}

// Lighting Types
export interface LightingScene {
    id: string;
    name: string;
    color: string;
}

export interface LightingState {
    scenes: LightingScene[];
    activeSceneId: string | null;
    masterIntensity: number; // 0-100
    colorTemperature: number; // 3200-6500
}

export interface PTZState {
    activeCameraId: string | null;
    zoom: number; // 0-100
    focus: number; // 0-100
    iris: number; // 0-100
    speed: number; // 1-10
}

export interface BroadcastSession {
    eventName: string;
    date: string;
    sport: string;
    venue: string;
    league: string;
    homeTeam: string;
    awayTeam: string;
    sponsors: string;
}

export interface OutputState {
    resolution: '720p' | '1080p' | '1440p';
    fps: 30 | 60;
}

export interface SystemHealthState {
    temperature: number; // Celsius
    battery: number; // Percentage
    signal: number; // Percentage
    bitrate: number; // kbps
    fps: number;
    droppedFrames: number;
    latency: number; // ms
}

// --- NEW SCOREBOARD ENGINE TYPES ---
export interface ScoreboardTeam {
    name: string;
    short: string;
    score: number;
    color: string;
    logo: string | null;
    [key: string]: any; // For sport-specific fields like 'sets' in volleyball
}

export interface ScoreboardClock {
    running: boolean;
    seconds: number;
    display: string;
}

export interface ScoreboardPeriod {
    label: string;
    index: number;
}

export interface ScoreboardEvent {
    type: string;
    team?: 'home' | 'away' | 'red' | 'blue';
    timestamp: string;
    payload: Record<string, any>;
}

export interface ScoreboardAction {
    delta?: Record<string, any>;
    set?: Record<string, any>;
    toggle?: string;
    special?: string;
}

export interface ScoreboardState {
    sportId: string;
    matchId: string;
    status: 'READY' | 'LIVE' | 'PAUSED' | 'FINISHED';
    home: ScoreboardTeam;
    away: ScoreboardTeam;
    red?: ScoreboardTeam;
    blue?: ScoreboardTeam;
    clock: ScoreboardClock;
    period: ScoreboardPeriod;
    rules: Record<string, any>;
    events: ScoreboardEvent[];
    ui: {
        primaryActions: string[];
        secondaryActions: string[];
    };
    actions: Record<string, ScoreboardAction>;
    // Optional Sport-Specific Fields
    possession?: 'HOME' | 'AWAY';
    down?: number;
    distance?: number;
    ballOn?: number;
    timeouts?: { home: number; away: number };
    fouls?: { home: number; away: number };
    shotClock?: { enabled: boolean; seconds: number };
    inning?: { index: number; half: 'TOP' | 'BOT' };
    count?: { balls: number; strikes: number };
    outs?: number;
    bases?: { first: boolean; second: boolean; third: boolean; };
    stoppageTime?: { enabled: boolean; seconds: number; display: string };
    cards?: { homeYellow: number; homeRed: number; awayYellow: number; awayRed: number; };
    [key: string]: any; // For sport-specific root fields
}

export type SportDefinition = Partial<Omit<ScoreboardState, 'home' | 'away'>> & {
    home?: Partial<ScoreboardTeam>;
    away?: Partial<ScoreboardTeam>;
};


// Configuration Types
export interface AppConfig {
    features: {
        audioConsole: boolean;
        videoConsole: boolean;
        crossfader: boolean;
        advancedOverlays: boolean;
        replay: boolean;
        sports: boolean;
        commerce: boolean;
        lighting: boolean;
    };
    audioConsole: {
        mode: 'BROADCAST' | 'DJ';
        channels: number;
        masterLimiter: {
            enabled: boolean;
            thresholdDb: number;
            releaseMs: number;
        };
        autoGainGuard: {
            enabled: boolean;
            clipCountThreshold: number;
            autoReduceDb: number;
        };
        micLock: {
            defaultEnabled: boolean;
            protectedChannelId: string;
        };
        safeHeadroom: {
            enabled: boolean;
            targetLUFS: number;
            maxPeakDbfs: number;
        };
    };
    lighting: {
        safeSceneId: string;
    }
}
