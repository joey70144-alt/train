import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { SCENARIOS } from './data/scenarios';
import {
  GameState,
  Scenario,
  ChoiceOption,
  Outcome,
  PlayerHistoryEntry,
  GameSettings,
} from './types/game';
import { SceneManager } from './game3d/SceneManager';
import { PlayerController } from './game3d/PlayerController';
import { InteractionSystem, InteractionTarget } from './game3d/InteractionSystem';
import { sound } from './audio/soundSystem';

// UI Components
import { MainMenu } from './components/MainMenu';
import { ScenarioSelect } from './components/ScenarioSelect';
import { HUD } from './components/HUD';
import { InfoPanel } from './components/InfoPanel';
import { ResultScreen } from './components/ResultScreen';
import { SettingsModal } from './components/SettingsModal';
import { GuideModal } from './components/GuideModal';
import { PauseModal } from './components/PauseModal';

const SETTINGS_KEY = 'ethics_switch_game_settings';
const HISTORY_KEY = 'ethics_switch_game_history';

const DEFAULT_SETTINGS: GameSettings = {
  soundEnabled: true,
  masterVolume: 0.7,
  mouseSensitivity: 1.0,
  invertY: false,
  showTutorial: true,
};

export default function App() {
  const mountRef = useRef<HTMLDivElement>(null);

  // 3D Engine references
  const sceneManagerRef = useRef<SceneManager | null>(null);
  const playerControllerRef = useRef<PlayerController | null>(null);
  const interactionSystemRef = useRef<InteractionSystem | null>(null);
  const clockRef = useRef(new THREE.Clock());
  const reqIdRef = useRef<number | null>(null);

  // Game States
  const [gameState, setGameState] = useState<GameState>('MENU');
  const [currentScenarioIndex, setCurrentScenarioIndex] = useState<number>(0);
  const [remainingTime, setRemainingTime] = useState<number>(25);
  const [selectedOption, setSelectedOption] = useState<ChoiceOption | null>(null);
  const [currentOutcome, setCurrentOutcome] = useState<Outcome | null>(null);
  const [timedOut, setTimedOut] = useState<boolean>(false);
  const [revealedUnknownIds, setRevealedUnknownIds] = useState<string[]>([]);

  // Hover target from raycaster
  const [hoverTarget, setHoverTarget] = useState<InteractionTarget | null>(null);

  // Modals & Panels
  const [isInfoOpen, setIsInfoOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isGuideOpen, setIsGuideOpen] = useState(false);

  // Persistent settings & history
  const [settings, setSettings] = useState<GameSettings>(() => {
    try {
      const saved = localStorage.getItem(SETTINGS_KEY);
      return saved ? { ...DEFAULT_SETTINGS, ...JSON.parse(saved) } : DEFAULT_SETTINGS;
    } catch {
      return DEFAULT_SETTINGS;
    }
  });

  const [history, setHistory] = useState<Record<string, PlayerHistoryEntry>>(() => {
    try {
      const saved = localStorage.getItem(HISTORY_KEY);
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  // Current Scenario
  const currentScenario = SCENARIOS[currentScenarioIndex] || SCENARIOS[0];

  // Sync settings with audio system
  useEffect(() => {
    sound.setMuted(!settings.soundEnabled);
    sound.setVolume(settings.masterVolume);
    playerControllerRef.current?.updateSettings(settings);
    try {
      localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
    } catch (_) {}
  }, [settings]);

  // Sync history to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
    } catch (_) {}
  }, [history]);

  // Initialize Three.js 3D Engine once
  useEffect(() => {
    if (!mountRef.current) return;

    const sceneManager = new SceneManager(mountRef.current);
    const playerController = new PlayerController(
      sceneManager.camera,
      sceneManager.renderer.domElement,
      settings
    );
    const interactionSystem = new InteractionSystem(sceneManager);

    sceneManagerRef.current = sceneManager;
    playerControllerRef.current = playerController;
    interactionSystemRef.current = interactionSystem;

    // Load initial scenario config
    sceneManager.loadScenario(SCENARIOS[0]);

    // Hook raycast hover updates
    interactionSystem.onHoverChange = (target) => {
      setHoverTarget(target);
    };

    // Keyboard interact (E) and Pause (Esc) hooks
    playerController.onInteractRequest = () => {
      handlePhysicalInteraction();
    };

    playerController.onPauseRequest = () => {
      setGameState((prev) => {
        if (prev === 'OBSERVING' || prev === 'DECISION') {
          return 'PAUSED';
        }
        if (prev === 'PAUSED') {
          return 'DECISION';
        }
        return prev;
      });
    };

    // Animation Loop
    let lastMenuAngle = 0;
    const animate = () => {
      reqIdRef.current = requestAnimationFrame(animate);
      const delta = Math.min(clockRef.current.getDelta(), 0.1);

      // If in MENU, slowly pan camera for atmospheric 3D cinematic feel
      if (sceneManagerRef.current) {
        if (gameState === 'MENU') {
          lastMenuAngle += delta * 0.08;
          sceneManagerRef.current.camera.position.x = 3.5 + Math.sin(lastMenuAngle) * 0.8;
          sceneManagerRef.current.camera.position.z = 4.0 + Math.cos(lastMenuAngle) * 0.6;
          sceneManagerRef.current.camera.lookAt(0, 1.2, -15);
        } else if (gameState !== 'PAUSED') {
          playerControllerRef.current?.update(delta);
          interactionSystemRef.current?.update();
        }

        sceneManagerRef.current.update(delta);
      }
    };

    animate();

    return () => {
      if (reqIdRef.current) cancelAnimationFrame(reqIdRef.current);
      playerController.dispose();
      sceneManager.dispose();
      sound.stopTrainRumble();
    };
  }, []);

  // Handle Physical Interaction in 3D Scene
  const handlePhysicalInteraction = () => {
    if (gameState !== 'DECISION' && gameState !== 'OBSERVING') return;

    const hover = interactionSystemRef.current?.getCurrentHover();
    if (!hover || !sceneManagerRef.current) return;

    sound.playClick();

    if (hover.id === 'switch_stand') {
      sound.playLeverClank();
      const isBranch = sceneManagerRef.current.toggleSwitch();

      // Find switch option
      const switchOpt = currentScenario.options.find((o) =>
        isBranch ? o.id === 'switch' : o.id === 'maintain'
      );
      if (switchOpt && gameState === 'DECISION') {
        executeChoice(switchOpt);
      }
    } else if (hover.id === 'brake_valve') {
      sound.playEmergencyBrake();
      const brakeOpt = currentScenario.options.find(
        (o) => o.id === 'emergency_brake' || o.id === 'halt_and_verify'
      );
      if (brakeOpt && gameState === 'DECISION') {
        executeChoice(brakeOpt);
      }
    } else if (hover.id === 'radio_console') {
      sound.playRadioChirp();
      const radioOpt = currentScenario.options.find(
        (o) => o.id === 'verify_status' || o.id === 'divert_to_relief'
      );
      if (radioOpt && gameState === 'DECISION') {
        executeChoice(radioOpt);
      } else {
        setIsInfoOpen(true);
      }
    }
  };

  // Start Scenario
  const startScenario = (scenario: Scenario) => {
    const idx = SCENARIOS.findIndex((s) => s.id === scenario.id);
    setCurrentScenarioIndex(idx >= 0 ? idx : 0);
    setRemainingTime(scenario.duration);
    setSelectedOption(null);
    setCurrentOutcome(null);
    setTimedOut(false);
    setRevealedUnknownIds([]);
    setIsInfoOpen(false);

    if (sceneManagerRef.current) {
      sceneManagerRef.current.loadScenario(scenario);
    }

    setGameState('OBSERVING');
    sound.startAmbientWind();
  };

  // Transition from OBSERVING to DECISION
  useEffect(() => {
    if (gameState === 'OBSERVING') {
      // Auto-transition to DECISION after brief observation window (e.g. 5 seconds)
      const timer = setTimeout(() => {
        setGameState('DECISION');
        sound.playRadioChirp();
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [gameState]);

  // Decision Countdown Timer
  useEffect(() => {
    if (gameState !== 'DECISION') return;

    const interval = setInterval(() => {
      setRemainingTime((prev) => {
        const next = prev - 0.2;
        if (Math.floor(next) !== Math.floor(prev)) {
          sound.playTimerTick(next <= 6);
        }

        if (next <= 0) {
          clearInterval(interval);
          handleTimeout();
          return 0;
        }
        return next;
      });
    }, 200);

    return () => clearInterval(interval);
  }, [gameState, currentScenario]);

  // Handle Timeout
  const handleTimeout = () => {
    setTimedOut(true);
    const defaultOpt =
      currentScenario.options.find((o) => o.id === currentScenario.defaultChoiceId) ||
      currentScenario.options[0];
    executeChoice(defaultOpt, true);
  };

  // Execute Choice
  const executeChoice = (option: ChoiceOption, isTimeout: boolean = false) => {
    if (gameState === 'RESOLVING' || gameState === 'RESULT') return; // Prevent double-triggering

    // Deduct time cost if an option (like telemetry check) consumes time
    if (option.timeCost && !isTimeout) {
      setRemainingTime((prev) => Math.max(1, prev - option.timeCost!));
      if (option.revealsUnknownId) {
        setRevealedUnknownIds((prev) => [...prev, option.revealsUnknownId!]);
        setIsInfoOpen(true); // Open dossier with new revealed info
      }
    }

    setSelectedOption(option);
    const outcome = currentScenario.outcomes[option.outcomeId];
    setCurrentOutcome(outcome);
    setGameState('RESOLVING');

    // Perform 3D Scene Resolution
    if (sceneManagerRef.current) {
      if (outcome.trainBehavior === 'SWITCH_TO_BRANCH') {
        sceneManagerRef.current.setSwitchState(true);
        sceneManagerRef.current.trainSystem.startRunning(currentScenario.sceneConfig.trainSpeed);
      } else if (outcome.trainBehavior === 'STAY_MAIN') {
        sceneManagerRef.current.setSwitchState(false);
        sceneManagerRef.current.trainSystem.startRunning(currentScenario.sceneConfig.trainSpeed);
      } else if (outcome.trainBehavior === 'EMERGENCY_STOP') {
        sceneManagerRef.current.trainSystem.startRunning(currentScenario.sceneConfig.trainSpeed * 0.7);
        setTimeout(() => {
          sceneManagerRef.current?.trainSystem.triggerEmergencyBrake();
        }, 1200);
      } else if (outcome.trainBehavior === 'DERAIL_CONTROLLED') {
        sceneManagerRef.current.trainSystem.startRunning(currentScenario.sceneConfig.trainSpeed);
        setTimeout(() => {
          sceneManagerRef.current?.trainSystem.triggerDerail();
        }, 1800);
      } else {
        sceneManagerRef.current.trainSystem.startRunning(currentScenario.sceneConfig.trainSpeed * 0.5);
      }
    }

    // Save history
    setHistory((prev) => ({
      ...prev,
      [currentScenario.id]: {
        scenarioId: currentScenario.id,
        timestamp: Date.now(),
        chosenOptionId: option.id,
        outcomeId: outcome.id,
        timedOut: isTimeout,
      },
    }));

    // Transition to RESULT screen after resolution scene plays out
    setTimeout(() => {
      setGameState('RESULT');
      sound.playReflectionTone();
    }, 5500);
  };

  // Replay
  const handleReplay = () => {
    startScenario(currentScenario);
  };

  // Next Scenario
  const handleNext = () => {
    if (currentScenarioIndex < SCENARIOS.length - 1) {
      startScenario(SCENARIOS[currentScenarioIndex + 1]);
    } else {
      setGameState('SELECTING_SCENARIO');
    }
  };

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-black select-none font-sans">
      {/* 3D WebGL Canvas Mounting Container */}
      <div
        ref={mountRef}
        className="absolute inset-0 z-0 cursor-grab active:cursor-grabbing"
        tabIndex={0}
      />

      {/* Main Menu */}
      {gameState === 'MENU' && (
        <MainMenu
          onStartGame={() => startScenario(SCENARIOS[0])}
          onOpenScenarioSelect={() => setGameState('SELECTING_SCENARIO')}
          onOpenSettings={() => setIsSettingsOpen(true)}
          onOpenGuide={() => setIsGuideOpen(true)}
          isMuted={!settings.soundEnabled}
          onToggleMute={() => setSettings((s) => ({ ...s, soundEnabled: !s.soundEnabled }))}
        />
      )}

      {/* Scenario Select Screen */}
      {gameState === 'SELECTING_SCENARIO' && (
        <ScenarioSelect
          onSelectScenario={(s) => startScenario(s)}
          onBack={() => setGameState('MENU')}
          history={history}
        />
      )}

      {/* In-game HUD */}
      {(gameState === 'OBSERVING' ||
        gameState === 'DECISION' ||
        gameState === 'RESOLVING' ||
        gameState === 'PAUSED') && (
        <HUD
          scenario={currentScenario}
          gameState={gameState}
          remainingTime={remainingTime}
          hoverTarget={hoverTarget}
          onSelectOption={(opt) => executeChoice(opt)}
          onOpenInfo={() => setIsInfoOpen(true)}
          onPause={() => setGameState('PAUSED')}
          onOpenGuide={() => setIsGuideOpen(true)}
          isMuted={!settings.soundEnabled}
          onToggleMute={() => setSettings((s) => ({ ...s, soundEnabled: !s.soundEnabled }))}
          onStartDecisionNow={() => setGameState('DECISION')}
        />
      )}

      {/* Result & Reflection Screen */}
      {gameState === 'RESULT' && currentOutcome && (
        <ResultScreen
          scenario={currentScenario}
          selectedOption={selectedOption}
          outcome={currentOutcome}
          timedOut={timedOut}
          onReplay={handleReplay}
          onNext={handleNext}
          onMenu={() => setGameState('SELECTING_SCENARIO')}
          hasNextScenario={currentScenarioIndex < SCENARIOS.length - 1}
        />
      )}

      {/* Modals */}
      <InfoPanel
        scenario={currentScenario}
        isOpen={isInfoOpen}
        onClose={() => setIsInfoOpen(false)}
        revealedUnknownIds={revealedUnknownIds}
      />

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        settings={settings}
        onUpdateSettings={(newVals) => setSettings((s) => ({ ...s, ...newVals }))}
        onResetProgress={() => {
          setHistory({});
          localStorage.removeItem(HISTORY_KEY);
        }}
      />

      <GuideModal isOpen={isGuideOpen} onClose={() => setIsGuideOpen(false)} />

      <PauseModal
        isOpen={gameState === 'PAUSED'}
        onResume={() => setGameState('DECISION')}
        onRestart={handleReplay}
        onScenarioSelect={() => setGameState('SELECTING_SCENARIO')}
        onMainMenu={() => {
          sound.stopTrainRumble();
          setGameState('MENU');
        }}
        isMuted={!settings.soundEnabled}
        onToggleMute={() => setSettings((s) => ({ ...s, soundEnabled: !s.soundEnabled }))}
      />
    </div>
  );
}
