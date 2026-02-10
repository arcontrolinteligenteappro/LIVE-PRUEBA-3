
import { AppConfig } from './types';

export const config: AppConfig = {
  features: {
    audioConsole: true,
    videoConsole: true,
    crossfader: true,
    advancedOverlays: true,
    replay: true,
    sports: true,
    commerce: true,
    lighting: true,
  },
  audioConsole: {
    mode: "BROADCAST",
    channels: 8,
    masterLimiter: {
      enabled: true,
      thresholdDb: -1.0,
      releaseMs: 120
    },
    autoGainGuard: {
      enabled: true,
      clipCountThreshold: 3,
      autoReduceDb: 3
    },
    micLock: {
      defaultEnabled: true,
      protectedChannelId: "mic-1"
    },
    safeHeadroom: {
      enabled: true,
      targetLUFS: -14,
      maxPeakDbfs: -1.0
    }
  },
  lighting: {
    safeSceneId: 'safe-white',
  }
};
