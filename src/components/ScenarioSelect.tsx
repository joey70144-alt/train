import React from 'react';
import { SCENARIOS } from '../data/scenarios';
import { Scenario, PlayerHistoryEntry } from '../types/game';
import { ArrowLeft, Play, CheckCircle2, CircleDashed } from 'lucide-react';
import { sound } from '../audio/soundSystem';

interface ScenarioSelectProps {
  onSelectScenario: (scenario: Scenario) => void;
  onBack: () => void;
  history: Record<string, PlayerHistoryEntry>;
}

export const ScenarioSelect: React.FC<ScenarioSelectProps> = ({
  onSelectScenario,
  onBack,
  history,
}) => {
  return (
    <div className="fixed inset-0 z-40 flex flex-col p-6 sm:p-12 pointer-events-auto bg-zinc-950/95 text-zinc-100 overflow-y-auto select-none">
      {/* Header */}
      <div className="flex items-center justify-between mb-8 pb-4 border-b border-zinc-800">
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              sound.playClick();
              onBack();
            }}
            className="p-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-zinc-300 transition cursor-pointer"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">關卡選擇</h1>
            <p className="text-xs text-zinc-400 mt-0.5">選擇一項鐵路情境進行觀察與抉擇</p>
          </div>
        </div>
      </div>

      {/* Grid of 4 Scenarios */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto w-full my-auto">
        {SCENARIOS.map((scenario, index) => {
          const completed = !!history[scenario.id];
          const record = history[scenario.id];

          return (
            <div
              key={scenario.id}
              className="flex flex-col justify-between p-6 rounded-2xl bg-zinc-900/80 border border-zinc-800 hover:border-amber-500/80 transition-all duration-200 shadow-xl group"
            >
              <div>
                {/* Top Badge */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono px-2 py-0.5 rounded bg-zinc-800 text-amber-400 border border-zinc-700">
                      {scenario.code}
                    </span>
                    <span className="text-xs text-zinc-400 font-medium">主題：{scenario.theme}</span>
                  </div>
                  {completed ? (
                    <span className="flex items-center gap-1 text-[11px] font-medium text-emerald-400 bg-emerald-950/40 border border-emerald-800/40 px-2 py-0.5 rounded-full">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      已完成
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-[11px] font-medium text-zinc-400 bg-zinc-800 px-2 py-0.5 rounded-full">
                      <CircleDashed className="w-3.5 h-3.5" />
                      待體驗
                    </span>
                  )}
                </div>

                {/* Scenario Title */}
                <h2 className="text-xl font-bold text-white group-hover:text-amber-300 transition mb-1">
                  {scenario.title}
                </h2>
                <div className="text-xs text-amber-400/90 font-medium mb-3">
                  {scenario.subtitle}
                </div>

                {/* Description */}
                <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed mb-4">
                  {scenario.description}
                </p>

                {/* Previous Decision summary if completed */}
                {record && (
                  <div className="p-2.5 rounded-lg bg-zinc-950/60 border border-zinc-800/80 text-xs text-zinc-300 mb-4">
                    <span className="text-zinc-400">上次抉擇：</span>
                    <span className="font-semibold text-amber-300 ml-1">
                      {scenario.options.find((o) => o.id === record.chosenOptionId)?.label ||
                        '未及時決定 (逾時)'}
                    </span>
                  </div>
                )}
              </div>

              {/* Start Button */}
              <button
                onClick={() => {
                  sound.playClick();
                  onSelectScenario(scenario);
                }}
                className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-sm transition shadow cursor-pointer mt-2"
              >
                <Play className="w-4 h-4 fill-current" />
                {completed ? '重新體驗此關卡' : '進入此情境'}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};
