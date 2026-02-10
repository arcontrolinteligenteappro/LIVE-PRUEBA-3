
import { Source, Scene, SourceType, AudioSource, StreamDestination, Comment, LightingScene } from './types';

export const INITIAL_SOURCES: Source[] = [
  { id: 'cam-1', type: SourceType.INTERNAL, name: 'Camera 1 (Internal)', isVisible: true },
  { id: 'cam-2', type: SourceType.USB, name: 'Camera 2 (USB)', isVisible: true },
  { id: 'cam-3', type: SourceType.NDI, name: 'Camera 3 (NDI)', isVisible: true },
  { id: 'ptz-1', type: SourceType.PTZ_CAM, name: 'PTZ Cam 1 (Rooftop)', isVisible: true },
  { id: 'media-1', type: SourceType.SRT, name: 'Video Playback', isVisible: true },
  { id: 'logo-img', type: SourceType.IMAGE, name: 'Logo', content: 'https://picsum.photos/seed/logo/200/100', isVisible: false },
  { id: 'live-text', type: SourceType.TEXT, name: 'Live Title', content: 'LIVE FROM THE STUDIO', isVisible: false },
  { id: 'blank', type: SourceType.BLANK, name: 'BLACK', isVisible: true },
  { id: 'safe-scene-src', type: SourceType.SAFE, name: 'SAFE SCENE', content: 'https://picsum.photos/seed/safescene/640/360', isVisible: true },
];

export const INITIAL_SCENES: Scene[] = [
    { id: 'scene-1', name: 'Intro Scene', items: [
        {
            id: 'item-1-1', sourceId: 'cam-1', type: SourceType.INTERNAL,
            transform: { x: 0, y: 0, width: 100, height: 100, zIndex: 1 },
            properties: { opacity: 1 }
        },
        {
            id: 'item-1-2', sourceId: 'logo-img', type: SourceType.IMAGE,
            transform: { x: 5, y: 5, width: 15, height: 10, zIndex: 2 },
            properties: { opacity: 0.9 }
        }
    ] },
    { id: 'scene-2', name: 'Picture-in-Picture', items: [
        {
            id: 'item-2-1', sourceId: 'cam-2', type: SourceType.USB,
            transform: { x: 0, y: 0, width: 100, height: 100, zIndex: 1 },
            properties: { opacity: 1 }
        },
        {
            id: 'item-2-2', sourceId: 'ptz-1', type: SourceType.PTZ_CAM,
            transform: { x: 70, y: 65, width: 28, height: 28, zIndex: 2 },
            properties: { opacity: 1 }
        }
    ] },
    { id: 'scene-3', name: 'Cam 2 + Media', items: [
        {
            id: 'item-3-1', sourceId: 'cam-2', type: SourceType.USB,
            transform: { x: 0, y: 0, width: 50, height: 100, zIndex: 1 },
            properties: { opacity: 1 }
        },
        {
            id: 'item-3-2', sourceId: 'media-1', type: SourceType.SRT,
            transform: { x: 50, y: 0, width: 50, height: 100, zIndex: 1 },
            properties: { opacity: 1 }
        }
    ] },
];

export const INITIAL_AUDIO_SOURCES: AudioSource[] = [
    { id: 'master', name: 'PGM Master', volume: 80, gain: 0, isMuted: false, isSolo: false, pan: 0, hpf: { enabled: false, frequency: 80 }, eq: { low: 0, mid1: 0, mid2: 0, high: 0 }, compressor: { threshold: 0, ratio: 1 }, gate: { threshold: -60 }, busSends: { aux1: 0, aux2: 0 }, mixMinus: false },
    { id: 'mic-1', name: 'Mic 1 (Host)', volume: 90, gain: 6, isMuted: false, isMasterLock: true, isSolo: false, pan: 0, hpf: { enabled: true, frequency: 100 }, eq: { low: 0, mid1: 0, mid2: 0, high: 0 }, compressor: { threshold: -12, ratio: 2 }, gate: { threshold: -45 }, busSends: { aux1: 0, aux2: 0 }, mixMinus: false },
    { id: 'audio-cam-1', name: 'Cam 1 Audio', volume: 50, gain: 0, isMuted: true, isSolo: false, pan: 0, hpf: { enabled: false, frequency: 80 }, eq: { low: 0, mid1: 0, mid2: 0, high: 0 }, compressor: { threshold: 0, ratio: 1 }, gate: { threshold: -60 }, busSends: { aux1: 0, aux2: 0 }, mixMinus: false },
    { id: 'audio-media-1', name: 'Media Audio', volume: 60, gain: 0, isMuted: false, isSolo: false, pan: 0, hpf: { enabled: false, frequency: 80 }, eq: { low: 0, mid1: 0, mid2: 0, high: 0 }, compressor: { threshold: 0, ratio: 1 }, gate: { threshold: -60 }, busSends: { aux1: 0, aux2: 0 }, mixMinus: false },
];

export const INITIAL_STREAM_DESTINATIONS: StreamDestination[] = [
    { id: 'yt', name: 'YouTube', platform: 'YouTube', isActive: false, status: 'Offline', liveSince: null, viewers: 0 },
    { id: 'fb', name: 'Facebook', platform: 'Facebook', isActive: false, status: 'Offline', liveSince: null, viewers: 0 },
    { id: 'tk', name: 'TikTok', platform: 'TikTok', isActive: false, status: 'Offline', liveSince: null, viewers: 0 },
];

export const INITIAL_COMMENTS: Comment[] = [
    { id: 'c1', author: 'Alice', text: 'This is an amazing live stream!', platform: 'YouTube' },
    { id: 'c2', author: 'Bob', text: 'Great content, keep it up!', platform: 'Facebook' },
    { id: 'c3', author: 'Charlie', text: 'Loving the PTZ camera shots!', platform: 'YouTube' },
    { id: 'c4', author: 'Diana', text: 'Can you show the new product again?', platform: 'TikTok' },
];

export const INITIAL_LIGHTING_SCENES: LightingScene[] = [
    { id: 'safe-white', name: 'Safe White', color: '#FFFFFF' },
    { id: 'podcast-soft', name: 'Podcast Soft', color: '#FFDDC4' },
    { id: 'podcast-dramatic', name: 'Podcast Dramatic', color: '#A0C4FF' },
    { id: 'product-showcase', name: 'Product Showcase', color: '#EAEAEA' },
    { id: 'goal-flash', name: 'Goal Flash', color: '#FF0000' },
];
