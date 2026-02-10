
import { ScoreboardState, SportDefinition } from '../types';
import { deepMerge } from '../utils';

// Universal Base Template - ARCLS Standard
export const baseScoreboard: ScoreboardState = {
  sportId: "unknown",
  matchId: "MATCH-0001",
  status: "READY",
  home: { name: "LOCAL", short: "LOC", score: 0, color: "#2563eb", logo: null },
  away: { name: "VISITA", short: "VIS", score: 0, color: "#dc2626", logo: null },
  clock: { running: false, seconds: 0, display: "00:00" },
  period: { label: "", index: 1 },
  rules: {},
  events: [],
  ui: { 
    primaryActions: ["START_STOP_CLOCK", "NEXT_PERIOD"],
    secondaryActions: ["TOGGLE_SCOREBOARD", "UNDO_EVENT", "RESET_MATCH"]
  },
  actions: {},
};

const sportsData: Record<string, SportDefinition> = {
    soccer: {
        sportId: "soccer",
        clock: { seconds: 2700, display: "45:00" },
        period: { label: "1H", index: 1 },
        rules: { halfDurationSeconds: 2700, allowStoppageTime: true },
        stoppageTime: { enabled: false, seconds: 0, display: "+0" },
        cards: { homeYellow: 0, homeRed: 0, awayYellow: 0, awayRed: 0 },
        ui: {
            primaryActions: ["GOAL_HOME", "GOAL_AWAY", "START_STOP_CLOCK", "NEXT_HALF"],
            secondaryActions: ["FOUL_HOME", "FOUL_AWAY", "ADD_STOPPAGE_TIME", "RESET_MATCH"],
        },
        actions: {
            GOAL_HOME: { delta: { home: { score: 1 } } },
            GOAL_AWAY: { delta: { away: { score: 1 } } },
        }
    },
    basketball: {
        sportId: "basketball",
        clock: { seconds: 600, display: "10:00" },
        shotClock: { enabled: true, seconds: 24 },
        period: { label: "Q1", index: 1 },
        fouls: { home: 0, away: 0 },
        timeouts: { home: 5, away: 5 },
        possession: "HOME",
        ui: {
            primaryActions: ["SCORE_2_HOME", "SCORE_2_AWAY", "SCORE_1_HOME", "SCORE_1_AWAY", "START_STOP_CLOCK"],
            secondaryActions: ["SCORE_3_HOME", "SCORE_3_AWAY", "RESET_SHOT_CLOCK", "FOUL_HOME", "FOUL_AWAY", "TIMEOUT_HOME", "TIMEOUT_AWAY", "NEXT_QUARTER"],
        },
        actions: {
            SCORE_1_HOME: { delta: { home: { score: 1 } } },
            SCORE_2_HOME: { delta: { home: { score: 2 } } },
            SCORE_3_HOME: { delta: { home: { score: 3 } } },
            SCORE_1_AWAY: { delta: { away: { score: 1 } } },
            SCORE_2_AWAY: { delta: { away: { score: 2 } } },
            SCORE_3_AWAY: { delta: { away: { score: 3 } } },
            FOUL_HOME: { delta: { fouls: { home: 1 } } },
            FOUL_AWAY: { delta: { fouls: { away: 1 } } },
            TIMEOUT_HOME: { delta: { timeouts: { home: -1 } } },
            TIMEOUT_AWAY: { delta: { timeouts: { away: -1 } } },
            RESET_SHOT_CLOCK: { set: { "shotClock.seconds": 24 } }
        }
    },
    baseball: {
        sportId: "baseball",
        clock: { running: false, seconds: 0, display: "" },
        inning: { index: 1, half: "TOP" },
        outs: 0,
        bases: { first: false, second: false, third: false },
        count: { balls: 0, strikes: 0 },
        ui: {
            primaryActions: ["RUN_HOME", "RUN_AWAY", "STRIKE", "BALL", "OUT"],
            secondaryActions: ["NEXT_INNING_HALF", "RESET_COUNT", "CLEAR_BASES", "RESET_MATCH"],
        },
        actions: {
            RUN_HOME: { delta: { home: { score: 1 } } },
            RUN_AWAY: { delta: { away: { score: 1 } } },
            STRIKE: { delta: { count: { strikes: 1 } } },
            BALL: { delta: { count: { balls: 1 } } },
            OUT: { delta: { outs: 1 } },
        }
    },
     boxing: {
        sportId: "boxing",
        red: { name: "ROJO", score: 0, knockdowns: 0, warnings: 0, color: "#ef4444" },
        blue: { name: "AZUL", score: 0, knockdowns: 0, warnings: 0, color: "#3b82f6" },
        clock: { seconds: 180, display: "03:00" },
        round: { index: 1, total: 12 },
        ui: {
            primaryActions: ["KD_RED", "KD_BLUE", "START_STOP_CLOCK"],
            secondaryActions: ["WARN_RED", "WARN_BLUE", "NEXT_ROUND", "RESET_MATCH"],
        },
        actions: {
            KD_RED: { delta: { red: { knockdowns: 1 } } },
            KD_BLUE: { delta: { blue: { knockdowns: 1 } } },
            WARN_RED: { delta: { red: { warnings: 1 } } },
            WARN_BLUE: { delta: { blue: { warnings: 1 } } },
        }
    }
};

export const loadScoreboardState = (sportId: string): ScoreboardState => {
    const sportDef = sportsData[sportId.toLowerCase()] || sportsData['soccer'];
    // Use JSON cloning to avoid mutation of the base object
    const baseClone = JSON.parse(JSON.stringify(baseScoreboard));
    return deepMerge(baseClone, sportDef) as ScoreboardState;
};
