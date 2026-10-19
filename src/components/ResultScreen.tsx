import React from 'react';
import { Scenario, Outcome, ChoiceOption } from '../types/game';
import { RotateCcw, ArrowRight, Menu, HelpCircle, HeartHandshake, ShieldAlert } from 'lucide-react';
import { sound } from '../audio/soundSystem';

interface ResultScreenProps {
  scenario: Scenario;
  selectedOption: ChoiceOption | null;
  outcome: Outcome;
  timedOut: boolean;
  onReplay: () => void;
  onNext: () => void;
  onMenu: () => void;
  hasNextScenario: boolean;
}

export const ResultScreen: React.FC<ResultScreenProps> = ({
  scenario,
  selectedOption,
  outcome,
  timedOut,
  onReplay,
  onNext,
  onMenu,
  hasNextScenario,
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-zinc-900 border border-zinc-700/80 rounded-2xl shadow-2xl p-6 sm:p-8 text-zinc-100 my-8">
        {/* Top Header */}
        <div className="border-b border-zinc-800 pb-4 mb-6">
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-xs font-mono px-2 py-0.5 rounded bg-zinc-800 text-amber-400 border border-zinc-700">
              {scenario.code} 結算與反思
            </span>
            <span className="text-xs text-zinc-400">主題：{scenario.theme}</span>
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-white">{outcome.title}</h2>
          <p className="text-sm text-zinc-400 mt-1">{outcome.summary}</p>
        </div>

        {/* Decision & Trigger Context */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="p-4 rounded-xl bg-zinc-800/60 border border-zinc-700/60">
            <div className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1">
              你的決策行動
            </div>
            <div className="text-sm font-semibold text-amber-300">
              {selectedOption ? selectedOption.label : '未在限時內做出決定 (逾時)'}
            </div>
            {timedOut && (
              <div className="mt-1 text-xs text-rose-400">
                ⚠️ 倒數歸零，系統依據預設無干預慣性演出。
              </div>
            )}
          </div>

          <div className="p-4 rounded-xl bg-zinc-800/60 border border-zinc-700/60">
            <div className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1">
              直接承受衝擊 / 傷亡
            </div>
            <div className="text-xl font-bold text-rose-400">
              {outcome.consequences.casualties} 人
            </div>
            <div className="text-xs text-zinc-400 mt-0.5">
              成功生還 / 避難：
              <span className="text-emerald-400 font-semibold">
                {' '}
                {outcome.consequences.saved} 人
              </span>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-zinc-800/60 border border-zinc-700/60">
            <div className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1">
              附隨影響與設備代價
            </div>
            <div className="text-xs text-zinc-300 leading-relaxed">
              {outcome.consequences.delayOrDamageNote}
            </div>
          </div>
        </div>

        {/* Narrative Description */}
        <div className="p-4 rounded-xl bg-zinc-950/60 border border-zinc-800 mb-6 text-sm text-zinc-200 leading-relaxed">
          <div className="flex items-center gap-2 text-xs font-semibold text-zinc-400 mb-2 uppercase tracking-wider">
            <ShieldAlert className="w-4 h-4 text-amber-400" />
            現場演繹實況
          </div>
          <p>{outcome.description}</p>
        </div>

        {/* Ethical Perspectives / Reflection Notes */}
        <div className="mb-6">
          <div className="flex items-center gap-2 text-xs font-semibold text-indigo-400 uppercase tracking-wider mb-2.5">
            <HeartHandshake className="w-4 h-4 text-indigo-400" />
            倫理維度剖析 (Ethical Perspectives)
          </div>
          <div className="space-y-2">
            {outcome.reflectionNotes.map((note, idx) => (
              <div
                key={idx}
                className="p-3 rounded-lg bg-indigo-950/20 border border-indigo-900/40 text-xs sm:text-sm text-indigo-200 leading-relaxed"
              >
                {note}
              </div>
            ))}
          </div>
        </div>

        {/* Reflection Questions */}
        <div className="mb-8">
          <div className="flex items-center gap-2 text-xs font-semibold text-amber-400 uppercase tracking-wider mb-2.5">
            <HelpCircle className="w-4 h-4 text-amber-400" />
            留給你的反思詰問 (Inquiry & Introspection)
          </div>
          <div className="space-y-3">
            {scenario.reflectionQuestions.map((q, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-xl bg-zinc-800/50 border border-zinc-700/60"
              >
                <div className="text-xs sm:text-sm font-medium text-zinc-200 mb-1">
                  {idx + 1}. {q.question}
                </div>
                <div className="text-xs text-zinc-400 italic">
                  💡 哲學脈絡：{q.philosophicalContext}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Navigation Buttons */}
        <div className="pt-4 border-t border-zinc-800 flex flex-wrap items-center justify-between gap-3">
          <button
            onClick={() => {
              sound.playClick();
              onMenu();
            }}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-sm font-medium transition cursor-pointer"
          >
            <Menu className="w-4 h-4" />
            關卡選單
          </button>

          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                sound.playClick();
                onReplay();
              }}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-sm font-medium transition cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              再玩一次
            </button>

            {hasNextScenario && (
              <button
                onClick={() => {
                  sound.playClick();
                  onNext();
                }}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-sm font-semibold transition shadow-lg shadow-amber-600/20 cursor-pointer"
              >
                下一關
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
