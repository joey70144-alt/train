import React from 'react';
import { Scenario } from '../types/game';
import { FileText, AlertTriangle, HelpCircle, X, ShieldAlert, CheckCircle2 } from 'lucide-react';
import { sound } from '../audio/soundSystem';

interface InfoPanelProps {
  scenario: Scenario;
  isOpen: boolean;
  onClose: () => void;
  revealedUnknownIds: string[];
}

export const InfoPanel: React.FC<InfoPanelProps> = ({
  scenario,
  isOpen,
  onClose,
  revealedUnknownIds,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60">
      <div className="relative w-full max-w-2xl bg-zinc-900/95 border border-zinc-700 rounded-xl shadow-2xl p-6 text-zinc-100 max-h-[85vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-zinc-800">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono px-2 py-0.5 rounded bg-zinc-800 text-amber-400 border border-zinc-700">
                  {scenario.code}
                </span>
                <h2 className="text-lg font-bold tracking-wide">{scenario.title} — 情境資訊案卷</h2>
              </div>
              <p className="text-xs text-zinc-400 mt-0.5">{scenario.subtitle}</p>
            </div>
          </div>
          <button
            onClick={() => {
              sound.playClick();
              onClose();
            }}
            className="p-2 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Scrollable */}
        <div className="overflow-y-auto pr-1 my-4 space-y-5 text-sm">
          {/* Briefing */}
          <div className="p-3.5 rounded-lg bg-zinc-800/60 border border-zinc-700/60">
            <div className="flex items-center gap-2 text-xs font-semibold text-zinc-300 mb-1.5 uppercase tracking-wider">
              <ShieldAlert className="w-4 h-4 text-amber-400" />
              現場簡報與任務背景
            </div>
            <p className="text-zinc-300 leading-relaxed text-xs sm:text-sm">{scenario.briefing}</p>
          </div>

          {/* Known Facts */}
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400 mb-2 uppercase tracking-wider">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              目前已確認資訊 (Known Facts)
            </div>
            <ul className="space-y-2">
              {scenario.knownFacts.map((fact, idx) => (
                <li
                  key={idx}
                  className="p-2.5 rounded-md bg-zinc-800/40 border border-zinc-800 text-zinc-300 text-xs sm:text-sm flex items-start gap-2.5"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 shrink-0" />
                  <span>{fact}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Unknown Facts */}
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-amber-400 mb-2 uppercase tracking-wider">
              <HelpCircle className="w-4 h-4 text-amber-400" />
              未完全確認資訊與潛在變數 (Unknowns & Latent Risks)
            </div>
            <ul className="space-y-2">
              {scenario.unknownFacts.map((fact) => {
                const isRevealed = fact.revealedByDefault || revealedUnknownIds.includes(fact.id);
                return (
                  <li
                    key={fact.id}
                    className={`p-2.5 rounded-md border text-xs sm:text-sm flex items-start gap-2.5 ${
                      isRevealed
                        ? 'bg-amber-950/20 border-amber-800/40 text-amber-200'
                        : 'bg-zinc-900 border-zinc-800 text-zinc-500'
                    }`}
                  >
                    <AlertTriangle
                      className={`w-4 h-4 mt-0.5 shrink-0 ${
                        isRevealed ? 'text-amber-400' : 'text-zinc-600'
                      }`}
                    />
                    <div>
                      {isRevealed ? (
                        <span>{fact.description}</span>
                      ) : (
                        <span className="italic">
                          [情報受限] 現場感測器未能完全回傳細節，需消耗時間遙測或事後驗證。
                        </span>
                      )}
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-zinc-800 flex justify-end">
          <button
            onClick={() => {
              sound.playClick();
              onClose();
            }}
            className="px-5 py-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-sm font-medium transition cursor-pointer"
          >
            關閉案卷
          </button>
        </div>
      </div>
    </div>
  );
};
