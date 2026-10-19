import React, { useState, useEffect, useRef } from 'react';
import { Scenario, GameState, ChoiceOption } from '../types/game';
import { InteractionTarget } from '../game3d/InteractionSystem';
import {
  FileText,
  Pause,
  HelpCircle,
  Volume2,
  VolumeX,
  Play,
  RotateCcw,
  Clock,
  Compass,
} from 'lucide-react';
import { sound } from '../audio/soundSystem';

interface HUDProps {
  scenario: Scenario;
  gameState: GameState;
  remainingTime: number;
  hoverTarget: InteractionTarget | null;
  onSelectOption: (option: ChoiceOption) => void;
  onOpenInfo: () => void;
  onPause: () => void;
  onOpenGuide: () => void;
  isMuted: boolean;
  onToggleMute: () => void;
  onStartDecisionNow: () => void;
}

export const HUD: React.FC<HUDProps> = ({
  scenario,
  gameState,
  remainingTime,
  hoverTarget,
  onSelectOption,
  onOpenInfo,
  onPause,
  onOpenGuide,
  isMuted,
  onToggleMute,
  onStartDecisionNow,
}) => {
  const isDecision = gameState === 'DECISION';
  const isObserving = gameState === 'OBSERVING';
  const isResolving = gameState === 'RESOLVING';

  // Calculate progress percent for decision countdown
  const timeProgress = Math.max(0, Math.min(100, (remainingTime / scenario.duration) * 100));
  const isUrgent = remainingTime <= 6 && remainingTime > 0;

  return (
    <div className="absolute inset-0 pointer-events-none select-none overflow-hidden">
      {/* Top Bar: Level title, status badge & top actions */}
      <header className="absolute top-4 left-4 right-4 flex items-start justify-between z-20">
        {/* Left: Scenario Info */}
        <div className="pointer-events-auto flex items-center gap-3 bg-zinc-950/80 border border-zinc-800 rounded-xl px-4 py-2.5 text-zinc-100 shadow-lg">
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono px-2 py-0.5 rounded bg-zinc-800 text-amber-400 border border-zinc-700">
                {scenario.code}
              </span>
              <h1 className="text-sm sm:text-base font-bold tracking-tight">{scenario.title}</h1>
            </div>
            <div className="flex items-center gap-2 mt-0.5 text-xs text-zinc-400">
              <span>{scenario.theme}</span>
              <span>•</span>
              <span
                className={`font-semibold ${
                  isDecision
                    ? 'text-amber-400'
                    : isResolving
                    ? 'text-rose-400'
                    : 'text-emerald-400'
                }`}
              >
                {isDecision ? '【抉擇階段】' : isResolving ? '【演繹中】' : '【觀察階段】'}
              </span>
            </div>
          </div>
        </div>

        {/* Right: Quick actions (Info Dossier, Guide, Mute, Pause) */}
        <div className="pointer-events-auto flex items-center gap-2">
          <button
            onClick={() => {
              sound.playClick();
              onOpenInfo();
            }}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-zinc-900/80 hover:bg-zinc-800 border border-zinc-700 text-zinc-200 text-xs font-medium shadow-lg transition cursor-pointer"
            title="查看情境資訊案卷"
          >
            <FileText className="w-4 h-4 text-amber-400" />
            <span className="hidden sm:inline">情報案卷</span>
          </button>

          <button
            onClick={() => {
              sound.playClick();
              onOpenGuide();
            }}
            className="p-2 rounded-xl bg-zinc-900/80 hover:bg-zinc-800 border border-zinc-700 text-zinc-300 shadow-lg transition cursor-pointer"
            title="操作指南"
          >
            <HelpCircle className="w-4 h-4" />
          </button>

          <button
            onClick={() => {
              sound.playClick();
              onToggleMute();
            }}
            className="p-2 rounded-xl bg-zinc-900/80 hover:bg-zinc-800 border border-zinc-700 text-zinc-300 shadow-lg transition cursor-pointer"
            title={isMuted ? '解除靜音' : '靜音'}
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4" />}
          </button>

          <button
            onClick={() => {
              sound.playClick();
              onPause();
            }}
            className="p-2 rounded-xl bg-zinc-900/80 hover:bg-zinc-800 border border-zinc-700 text-zinc-300 shadow-lg transition cursor-pointer"
            title="暫停遊戲 (Esc)"
          >
            <Pause className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Decision Countdown Timer Banner (Only active during DECISION) */}
      {isDecision && (
        <div className="absolute top-20 left-1/2 -translate-x-1/2 pointer-events-auto z-20">
          <div
            className={`flex items-center gap-3 px-5 py-2.5 rounded-2xl border shadow-2xl transition-all ${
              isUrgent
                ? 'bg-rose-950/90 border-rose-500 text-rose-100 scale-105'
                : 'bg-zinc-900/90 border-amber-500/60 text-amber-100'
            }`}
          >
            <Clock className={`w-5 h-5 ${isUrgent ? 'text-rose-400 animate-bounce' : 'text-amber-400'}`} />
            <div className="flex flex-col">
              <span className="text-[10px] uppercase font-bold tracking-wider opacity-80">
                距離撞擊關鍵點剩餘
              </span>
              <div className="flex items-baseline gap-1 font-mono font-bold text-xl leading-none">
                <span>{Math.ceil(remainingTime)}</span>
                <span className="text-xs">秒</span>
              </div>
            </div>
            {/* Visual circular/pill mini progress */}
            <div className="w-20 h-2 bg-zinc-800 rounded-full overflow-hidden border border-zinc-700">
              <div
                className={`h-full transition-all duration-200 ${
                  isUrgent ? 'bg-rose-500' : 'bg-amber-400'
                }`}
                style={{ width: `${timeProgress}%` }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Observation Mode Prompt */}
      {isObserving && (
        <div className="absolute top-20 left-1/2 -translate-x-1/2 pointer-events-auto z-20 text-center">
          <div className="flex items-center gap-3 px-4 py-2 rounded-xl bg-zinc-950/75 border border-zinc-800 text-xs text-zinc-300 shadow-lg">
            <span>正在觀察現場情境... 移動視角檢視軌道與人員</span>
            <button
              onClick={() => {
                sound.playClick();
                onStartDecisionNow();
              }}
              className="px-2.5 py-1 rounded bg-amber-600 hover:bg-amber-500 text-white font-medium text-xs transition cursor-pointer"
            >
              立刻進入決策
            </button>
          </div>
        </div>
      )}

      {/* Center Reticle & Hover Information */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        {/* Reticle */}
        <div
          className={`w-3.5 h-3.5 rounded-full border-2 transition-all duration-150 ${
            hoverTarget
              ? 'border-amber-400 bg-amber-400/40 scale-125'
              : 'border-white/50 bg-white/10'
          }`}
        />

        {/* Hover Target Tooltip (Clean Object Identifier, No E prompt) */}
        {hoverTarget && (
          <div className="absolute top-[54%] flex flex-col items-center bg-zinc-950/90 border border-zinc-700 rounded-xl px-3.5 py-1.5 text-zinc-100 shadow-xl">
            <span className="text-xs font-semibold text-amber-300">
              {hoverTarget.label}
            </span>
            <span className="text-[10px] text-zinc-400 mt-0.5">{hoverTarget.description}</span>
          </div>
        )}
      </div>

      {/* Bottom Dock: Decision options & Controls */}
      <footer className="absolute bottom-6 left-1/2 -translate-x-1/2 w-full max-w-3xl px-4 pointer-events-none z-20">
        {isDecision && (
          <div className="pointer-events-auto bg-zinc-950/90 border border-zinc-800 rounded-2xl p-3 sm:p-4 shadow-2xl">
            <div className="text-xs font-semibold text-zinc-300 mb-2 uppercase tracking-wider text-center">
              {scenario.title} — {scenario.subtitle}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
              {scenario.options.map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => {
                    sound.playClick();
                    onSelectOption(opt);
                  }}
                  className="flex flex-col text-left px-3.5 py-2.5 rounded-xl border bg-zinc-900/90 hover:bg-zinc-800 border-zinc-700/80 hover:border-amber-500 text-zinc-100 transition shadow cursor-pointer group active:scale-[0.98]"
                >
                  <div className="flex items-center justify-between w-full">
                    <span className="text-xs sm:text-sm font-bold text-amber-400 group-hover:text-amber-300">
                      {opt.label}
                    </span>
                    {opt.timeCost && (
                      <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-zinc-800 text-rose-400 border border-zinc-700">
                        -{opt.timeCost}s
                      </span>
                    )}
                  </div>
                  {opt.description && (
                    <span className="text-[11px] text-zinc-400 mt-0.5 line-clamp-1">
                      {opt.description}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>
        )}

        {isResolving && (
          <div className="pointer-events-auto bg-zinc-950/85 border border-zinc-800 rounded-xl py-3 px-6 text-center text-xs sm:text-sm text-zinc-300 shadow-xl max-w-md mx-auto">
            <span className="font-semibold text-amber-400">正在演繹決策結果...</span>
            <span className="ml-2 text-zinc-400">列車正在通過道岔樞紐</span>
          </div>
        )}
      </footer>
    </div>
  );
};
