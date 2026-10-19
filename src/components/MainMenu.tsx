import React from 'react';
import { Play, ListFilter, Settings, HelpCircle, Volume2, VolumeX } from 'lucide-react';
import { sound } from '../audio/soundSystem';

interface MainMenuProps {
  onStartGame: () => void;
  onOpenScenarioSelect: () => void;
  onOpenSettings: () => void;
  onOpenGuide: () => void;
  isMuted: boolean;
  onToggleMute: () => void;
}

export const MainMenu: React.FC<MainMenuProps> = ({
  onStartGame,
  onOpenScenarioSelect,
  onOpenSettings,
  onOpenGuide,
  isMuted,
  onToggleMute,
}) => {
  return (
    <div className="fixed inset-0 z-40 flex flex-col justify-between p-6 sm:p-12 pointer-events-auto bg-gradient-to-t from-zinc-950 via-zinc-950/70 to-zinc-900/40 text-zinc-100 select-none">
      {/* Top Header */}
      <header className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
          <span className="text-xs font-mono tracking-widest text-zinc-400 uppercase">
            3D 鐵路倫理抉擇體驗 • 第一版
          </span>
        </div>
        <button
          onClick={() => {
            sound.playClick();
            onToggleMute();
          }}
          className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-zinc-900/80 hover:bg-zinc-800 border border-zinc-700 text-xs text-zinc-300 transition cursor-pointer"
        >
          {isMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4" />}
          <span>{isMuted ? '靜音中' : '音效開啟'}</span>
        </button>
      </header>

      {/* Center Title & Tagline */}
      <div className="max-w-xl my-auto">
        <div className="inline-block px-3 py-1 rounded-md bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold uppercase tracking-wider mb-3">
          Ethical Switchpoint
        </div>
        <h1 className="text-5xl sm:text-7xl font-black tracking-tight text-white mb-4">
          道 岔
        </h1>
        <p className="text-sm sm:text-base text-zinc-300 leading-relaxed max-w-lg mb-8">
          一列疾馳而來的失控列車，四個沒有標準答案的道德困局。
          在冰冷的鋼軌與迷霧之中，你手握唯一的開關——
          沒有絕對的善惡評判，只有無法迴避的代價與反思。
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={() => {
              sound.playClick();
              onStartGame();
            }}
            className="flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-base transition shadow-xl shadow-amber-500/20 cursor-pointer"
          >
            <Play className="w-5 h-5 fill-current" />
            開始遊戲
          </button>

          <button
            onClick={() => {
              sound.playClick();
              onOpenScenarioSelect();
            }}
            className="flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-zinc-900/90 hover:bg-zinc-800 border border-zinc-700 text-zinc-200 font-semibold text-sm transition cursor-pointer"
          >
            <ListFilter className="w-4 h-4" />
            關卡選擇
          </button>
        </div>
      </div>

      {/* Footer Navigation */}
      <footer className="flex items-center justify-between text-xs text-zinc-400 border-t border-zinc-800/80 pt-4">
        <div className="flex items-center gap-4">
          <button
            onClick={() => {
              sound.playClick();
              onOpenGuide();
            }}
            className="flex items-center gap-1.5 hover:text-white transition cursor-pointer"
          >
            <HelpCircle className="w-4 h-4" />
            操作說明
          </button>
          <button
            onClick={() => {
              sound.playClick();
              onOpenSettings();
            }}
            className="flex items-center gap-1.5 hover:text-white transition cursor-pointer"
          >
            <Settings className="w-4 h-4" />
            遊戲設定
          </button>
        </div>
        <div className="text-zinc-500 text-[11px]">
          支援 WASD / 滑鼠視角 / 行動觸控
        </div>
      </footer>
    </div>
  );
};
