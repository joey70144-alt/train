import React from 'react';
import { X, MousePointer, Smartphone, KeyRound, Eye, ShieldAlert } from 'lucide-react';
import { sound } from '../audio/soundSystem';

interface GuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GuideModal: React.FC<GuideModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 select-none">
      <div className="relative w-full max-w-xl bg-zinc-900 border border-zinc-700 rounded-2xl shadow-2xl p-6 text-zinc-100 max-h-[85vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-zinc-800 mb-4">
          <div className="flex items-center gap-2">
            <KeyRound className="w-5 h-5 text-amber-400" />
            <h2 className="text-lg font-bold">遊戲操作與遊玩指南</h2>
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

        {/* Content */}
        <div className="overflow-y-auto space-y-5 text-xs sm:text-sm text-zinc-300 pr-1">
          {/* Desktop Controls */}
          <div className="p-4 rounded-xl bg-zinc-800/50 border border-zinc-700/60">
            <div className="flex items-center gap-2 text-white font-bold mb-3">
              <MousePointer className="w-4 h-4 text-amber-400" />
              電腦桌面端操作
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-2 rounded bg-zinc-900/60 border border-zinc-800 flex justify-between">
                <span className="text-zinc-400">移動站位：</span>
                <span className="font-mono text-amber-300">W / A / S / D</span>
              </div>
              <div className="p-2 rounded bg-zinc-900/60 border border-zinc-800 flex justify-between">
                <span className="text-zinc-400">環顧視角：</span>
                <span className="font-mono text-amber-300">滑鼠移動 (點擊鎖定)</span>
              </div>
              <div className="p-2 rounded bg-zinc-900/60 border border-zinc-800 flex justify-between">
                <span className="text-zinc-400">行動抉擇：</span>
                <span className="font-mono text-amber-300">點擊下方選項卡</span>
              </div>
              <div className="p-2 rounded bg-zinc-900/60 border border-zinc-800 flex justify-between">
                <span className="text-zinc-400">暫停選單：</span>
                <span className="font-mono text-amber-300">Esc 鍵</span>
              </div>
            </div>
          </div>

          {/* Mobile Controls */}
          <div className="p-4 rounded-xl bg-zinc-800/50 border border-zinc-700/60">
            <div className="flex items-center gap-2 text-white font-bold mb-3">
              <Smartphone className="w-4 h-4 text-amber-400" />
              行動手機與平板觸控
            </div>
            <ul className="space-y-1.5 text-xs">
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0" />
                <span>觸控螢幕滑動：自由旋轉 3D 環視視角，觀察鐵軌與人員。</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0" />
                <span>下方行動選項列：直接點選做出決策。</span>
              </li>
            </ul>
          </div>

          {/* Gameplay Core Cycle */}
          <div className="p-4 rounded-xl bg-zinc-950/60 border border-zinc-800 text-xs leading-relaxed space-y-2">
            <div className="flex items-center gap-1.5 text-amber-300 font-semibold">
              <ShieldAlert className="w-4 h-4" />
              核心遊戲哲學
            </div>
            <p>
              每一關皆取材自真實的鐵路、風險管理或哲學難題。
              遊戲不會以「善良」或「邪惡」為你的選擇打分數，也不預設任何標準答案。
              我們鼓勵你在倒數計時中傾聽自己的理性與直覺，並在事後反思中探究自己為何做出這樣的選擇。
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-4 mt-2 border-t border-zinc-800 flex justify-end">
          <button
            onClick={() => {
              sound.playClick();
              onClose();
            }}
            className="px-5 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-sm font-medium transition cursor-pointer"
          >
            了解
          </button>
        </div>
      </div>
    </div>
  );
};
