export type GameState =
  | 'MENU'
  | 'SELECTING_SCENARIO'
  | 'LOADING'
  | 'OBSERVING'
  | 'DECISION'
  | 'RESOLVING'
  | 'RESULT'
  | 'PAUSED';

export interface ChoiceOption {
  id: string;
  label: string;
  description: string;
  conditions?: string;
  timeCost?: number; // seconds deducted if chosen (for investigative options)
  revealsUnknownId?: string; // reveals hidden fact
  outcomeId: string;
}

export interface SceneAction {
  type: 'SWITCH_TRACK' | 'EMERGENCY_BRAKE' | 'CONFIRM_RADIO' | 'REALLOCATE_RESOURCE' | 'WAIT';
  payload?: any;
}

export interface Outcome {
  id: string;
  title: string;
  summary: string;
  description: string;
  consequences: {
    casualties: number;
    saved: number;
    delayOrDamageNote: string;
  };
  trainBehavior: 'SWITCH_TO_BRANCH' | 'STAY_MAIN' | 'EMERGENCY_STOP' | 'DERAIL_CONTROLLED' | 'SLOW_PASS';
  reflectionNotes: string[];
}

export interface ReflectionQuestion {
  question: string;
  philosophicalContext: string;
}

export interface Scenario {
  id: string;
  code: string;
  title: string;
  subtitle: string;
  theme: string;
  description: string;
  briefing: string;
  knownFacts: string[];
  unknownFacts: {
    id: string;
    description: string;
    revealedByDefault: boolean;
  }[];
  duration: number; // in seconds for decision countdown
  defaultChoiceId: string; // choice if countdown runs out
  options: ChoiceOption[];
  outcomes: Record<string, Outcome>;
  reflectionQuestions: ReflectionQuestion[];
  sceneConfig: {
    weather: 'foggy_dawn' | 'dusk_storm' | 'midnight_snow' | 'overcast_noon';
    fogDensity: number;
    lightColor: string;
    ambientColor: string;
    playerSpawn: [number, number, number];
    playerLookAt: [number, number, number];
    trainSpeed: number;
    mainTrackVictims: number;
    branchTrackVictims: number;
    interactiveLever: boolean;
    interactiveBrake: boolean;
    interactiveRadio: boolean;
  };
}

export interface PlayerHistoryEntry {
  scenarioId: string;
  timestamp: number;
  chosenOptionId: string;
  outcomeId: string;
  timedOut: boolean;
}

export interface GameSettings {
  soundEnabled: boolean;
  masterVolume: number;
  mouseSensitivity: number;
  invertY: boolean;
  showTutorial: boolean;
}
