import React from 'react';
import { GameSettings } from '../types/game';
import { X, Volume2, VolumeX, Eye, Sliders, Trash2 } from 'lucide-react';
import { sound } from '../audio/soundSystem';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: GameSettings;
  onUpdateSettings: (newSettings: Partial<GameSettings>) => void;
  onResetProgress: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  settings,
  onUpdateSettings,
  onResetProgress,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 select-none">
      <div className="relative w-full max-w-md bg-zinc-900 border border-zinc-700 rounded-2xl shadow-2xl p-6 text-zinc-100">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-zinc-800 mb-5">
          <div className="flex items-center gap-2">
            <Sliders className="w-5 h-5 text-amber-400" />
            <h2 className="text-lg font-bold">遊戲設定</h2>
          </div>
          <button
            onClick={() => {
              sound.playClick();
              onClose();
            }}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Settings Body */}
        <div className="space-y-5 text-sm">
          {/* Sound Mute Toggle */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              {settings.soundEnabled ? (
                <Volume2 className="w-4 h-4 text-amber-400" />
              ) : (
                <VolumeX className="w-4 h-4 text-zinc-500" />
              )}
              <span>音效開關</span>
            </div>
            <button
              onClick={() => {
                sound.playClick();
                onUpdateSettings({ soundEnabled: !settings.soundEnabled });
              }}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition cursor-pointer ${
                settings.soundEnabled
                  ? 'bg-amber-500 text-zinc-950'
                  : 'bg-zinc-800 text-zinc-400'
              }`}
            >
              {settings.soundEnabled ? '開啟' : '靜音'}
            </button>
          </div>

          {/* Volume Slider */}
          <div>
            <div className="flex justify-between text-xs text-zinc-400 mb-1.5">
              <span>主音量大小</span>
              <span>{Math.round(settings.masterVolume * 100)}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={settings.masterVolume}
              onChange={(e) => {
                onUpdateSettings({ masterVolume: parseFloat(e.target.value) });
              }}
              className="w-full accent-amber-500 cursor-pointer"
            />
          </div>

          {/* Mouse Sensitivity */}
          <div>
            <div className="flex justify-between text-xs text-zinc-400 mb-1.5">
              <span>滑鼠 / 觸控視角靈敏度</span>
              <span>{settings.mouseSensitivity.toFixed(1)}x</span>
            </div>
            <input
              type="range"
              min="0.4"
              max="2.5"
              step="0.1"
              value={settings.mouseSensitivity}
              onChange={(e) => {
                onUpdateSettings({ mouseSensitivity: parseFloat(e.target.value) });
              }}
              className="w-full accent-amber-500 cursor-pointer"
            />
          </div>

          {/* Invert Y */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <Eye className="w-4 h-4 text-zinc-400" />
              <span>垂直視角反轉 (Invert Y)</span>
            </div>
            <button
              onClick={() => {
                sound.playClick();
                onUpdateSettings({ invertY: !settings.invertY });
              }}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition cursor-pointer ${
                settings.invertY ? 'bg-amber-500 text-zinc-950' : 'bg-zinc-800 text-zinc-400'
              }`}
            >
              {settings.invertY ? '反轉' : '標準'}
            </button>
          </div>

          {/* Clear Progress */}
          <div className="pt-4 border-t border-zinc-800 flex items-center justify-between">
            <span className="text-xs text-zinc-400">清除本機關卡遊玩紀錄</span>
            <button
              onClick={() => {
                sound.playClick();
                if (window.confirm('確定要清除所有關卡遊玩紀錄嗎？')) {
                  onResetProgress();
                }
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-950/40 hover:bg-rose-900/60 border border-rose-800/60 text-xs text-rose-300 transition cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              清除紀錄
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 pt-3 border-t border-zinc-800 flex justify-end">
          <button
            onClick={() => {
              sound.playClick();
              onClose();
            }}
            className="px-5 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-sm font-medium transition cursor-pointer"
          >
            完成
          </button>
        </div>
      </div>
    </div>
  );
};
