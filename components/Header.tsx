
import React, { useState, useEffect } from 'react';
import { ProductionMode, UiMode, ConfigPreset, StreamDestination, AudioSource, SystemHealthState } from '../types';
import { es } from '../localization';
import { IconBroadcast, IconRecord, IconYouTube, IconFacebook, IconTikTok, IconAudio, IconStream, IconWarning } from './Icons';
import HealthMonitor from './HealthMonitor';

const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600).toString().padStart(2, '0');
    const m = Math.floor((seconds % 3600) / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${h}:${m}:${s}`;
};

const StatusIndicators: React.FC<{
    isLive: boolean;
    isRecording: boolean;
    liveTime: number;
    recordingTime: number;
}> = ({ isLive, isRecording, liveTime, recordingTime }) => {
    const [currentTime, setCurrentTime] = useState(new Date());

    useEffect(() => {
        const timerId = setInterval(() => setCurrentTime(new Date()), 1000);
        return () => clearInterval(timerId);
    }, []);

    return (
        <div className="flex items-center justify-center gap-2 md:gap-3 text-sm font-semibold text-gray-800 dark:text-gray-200">
            {/* Live Indicator */}
            {isLive ? (
                <div className="flex items-center gap-2 px-2 md:px-3 py-1 bg-red-600/80 text-white rounded-md">
                    <IconBroadcast className="w-4 h-4 animate-pulse" />
                    <span className="hidden sm:inline">LIVE:</span>
                    <span>{formatTime(liveTime)}</span>
                </div>
            ) : (
                 <div className="flex items-center gap-2 px-2 md:px-3 py-1 bg-gray-500/50 dark:bg-gray-700/50 rounded-md">
                    <IconBroadcast className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                    <span className="hidden sm:inline">OFFLINE</span>
                </div>
            )}
            {/* REC Indicator */}
            {isRecording && (
                <div className={`flex items-center gap-2 px-2 md:px-3 py-1 rounded-md ${isLive ? 'bg-red-500/50 text-white' : 'bg-red-600/80 text-white'}`}>
                    <IconRecord className="w-4 h-4" />
                    <span className="hidden sm:inline">REC:</span>
                    <span>{formatTime(recordingTime)}</span>
                </div>
            )}
            {/* Clock */}
            <div className="font-mono px-2 md:px-3 py-1 bg-gray-500/50 dark:bg-gray-700/50 rounded-md tabular-nums tracking-wider text-xs sm:text-sm">
                <span>{currentTime.toLocaleTimeString()}</span>
            </div>
        </div>
    );
};


interface HeaderProps {
  isLive: boolean;
  isRecording: boolean;
  liveTime: number;
  recordingTime: number;
  systemHealth: SystemHealthState;
}

const Header: React.FC<HeaderProps> = (props) => {
  return (
    <header className="bg-gray-200 dark:bg-gray-800 shadow-md p-2 flex items-center justify-between z-10 border-b border-gray-300 dark:border-gray-700">
      <div className="flex items-center space-x-2 sm:space-x-4">
        <img src="https://picsum.photos/seed/ar-control-apk-icon/40/40" alt="AR CONTROL LIVE STUDIO Icon" className="h-8 w-8 sm:h-10 sm:w-10 rounded-lg" />
        <h1 className="font-black text-sm md:text-lg hidden sm:block">ARCLS</h1>
      </div>
      
      <div className="flex-1 flex justify-center px-2">
        <StatusIndicators 
            isLive={props.isLive} 
            isRecording={props.isRecording}
            liveTime={props.liveTime}
            recordingTime={props.recordingTime}
        />
      </div>

      <div className="flex items-center space-x-2 sm:space-x-4">
        <HealthMonitor health={props.systemHealth} />
      </div>
    </header>
  );
};

export default Header;
