import React from 'react';
import { Play, RotateCcw, ListFilter, Home, Volume2, VolumeX } from 'lucide-react';
import { sound } from '../audio/soundSystem';

interface PauseModalProps {
  isOpen: boolean;
  onResume: () => void;
  onRestart: () => void;
  onScenarioSelect: () => void;
  onMainMenu: () => void;
  isMuted: boolean;
  onToggleMute: () => void;
}

export const PauseModal: React.FC<PauseModalProps> = ({
  isOpen,
  onResume,
  onRestart,
  onScenarioSelect,
  onMainMenu,
  isMuted,
  onToggleMute,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 select-none">
      <div className="relative w-full max-w-sm bg-zinc-900 border border-zinc-700 rounded-2xl shadow-2xl p-6 text-zinc-100 flex flex-col items-center">
        <h2 className="text-xl font-bold tracking-tight mb-1">遊戲暫停</h2>
        <p className="text-xs text-zinc-400 mb-6">決策倒數與列車演繹已凍結</p>

        <div className="w-full space-y-2.5">
          <button
            onClick={() => {
              sound.playClick();
              onResume();
            }}
            className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-sm transition cursor-pointer shadow-lg shadow-amber-500/20"
          >
            <Play className="w-4 h-4 fill-current" />
            繼續遊戲
          </button>

          <button
            onClick={() => {
              sound.playClick();
              onRestart();
            }}
            className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-sm font-medium transition cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            重新開始本關
          </button>

          <button
            onClick={() => {
              sound.playClick();
              onScenarioSelect();
            }}
            className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-sm font-medium transition cursor-pointer"
          >
            <ListFilter className="w-4 h-4" />
            選擇其他關卡
          </button>

          <button
            onClick={() => {
              sound.playClick();
              onMainMenu();
            }}
            className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-sm font-medium transition cursor-pointer"
          >
            <Home className="w-4 h-4" />
            返回主選單
          </button>
        </div>

        {/* Audio quick toggle */}
        <div className="mt-5 pt-4 border-t border-zinc-800 w-full flex justify-between items-center text-xs text-zinc-400">
          <span>遊戲音效</span>
          <button
            onClick={() => {
              sound.playClick();
              onToggleMute();
            }}
            className="flex items-center gap-1.5 px-3 py-1 rounded bg-zinc-800 text-zinc-300 hover:text-white transition cursor-pointer"
          >
            {isMuted ? <VolumeX className="w-3.5 h-3.5 text-rose-400" /> : <Volume2 className="w-3.5 h-3.5" />}
            <span>{isMuted ? '靜音' : '開啟'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
