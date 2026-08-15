/**
 * js/components/compare-screen.js — Экран сравнения двух маршрутов
 */

import { getRouteComparisonData } from '../alternate.js';
import { escapeHtml } from '../utils.js';

export function renderCompareScreen({ originalAnswers, altAnswers }) {
  const data = getRouteComparisonData(originalAnswers, altAnswers);

  const statsRows = data.stats.map(s => `
    <div class="flex items-center justify-between p-3 rounded-xl bg-[var(--color-surface)] border border-[var(--color-border)] text-xs sm:text-sm">
      <span class="text-slate-300 font-medium">${escapeHtml(s.label)}</span>
      <div class="flex items-center gap-3 font-bold">
        <span class="text-rose-400 line-through">${s.original}</span>
        <i data-lucide="arrow-right" class="w-3.5 h-3.5 text-slate-400"></i>
        <span class="text-emerald-400 text-sm sm:text-base">${s.alternate}</span>
      </div>
    </div>
  `).join('');

  return `
    <div class="flex-1 flex flex-col justify-between p-4 sm:p-6 fade-in safe-top safe-bottom max-w-md mx-auto w-full">
      <div class="pt-2 pb-4">
        <div class="inline-flex items-center gap-1.5 bg-emerald-500/10 border border-emerald-500/30 px-3 py-1 rounded-full text-xs font-semibold text-emerald-400 mb-3">
          <i data-lucide="git-compare" class="w-3.5 h-3.5"></i>
          <span>Сравнение ощущений</span>
        </div>

        <h2 class="text-2xl sm:text-3xl font-extrabold text-white mb-2 leading-tight">
          Почувствовал разницу?
        </h2>
        <p class="text-xs sm:text-sm text-[var(--color-muted)] mb-5">
          Вот как изменились реальные показатели пути после устранения барьеров:
        </p>

        <!-- Таблица изменений -->
        <div class="flex flex-col gap-2 mb-5">
          ${statsRows}
        </div>

        <!-- Было / Стало текстом -->
        <div class="grid grid-cols-2 gap-2 mb-5 text-xs">
          <div class="p-3 rounded-xl bg-rose-950/20 border border-rose-900/30 text-rose-200">
            <div class="font-bold mb-1 uppercase tracking-wider text-[10px] text-rose-400">Было:</div>
            <p class="leading-relaxed text-[11px]">${escapeHtml(data.origRouteList.slice(0, 3).join(' → '))}</p>
          </div>
          <div class="p-3 rounded-xl bg-emerald-950/20 border border-emerald-900/30 text-emerald-200">
            <div class="font-bold mb-1 uppercase tracking-wider text-[10px] text-emerald-400">Стало:</div>
            <p class="leading-relaxed text-[11px]">${escapeHtml(data.altRouteList.slice(0, 3).join(' → '))}</p>
          </div>
        </div>

        <!-- Поясняющий блок -->
        <div class="p-3.5 rounded-2xl bg-[var(--color-surface)]/80 border border-[var(--color-border)] text-xs text-slate-300 leading-relaxed">
          <span class="text-white font-semibold">Важно:</span> Это не готовая схема твоего бизнеса, а демонстрация того, как меняется конверсия и клиентский опыт, когда следующий шаг очевиден.
        </div>
      </div>

      <!-- Кнопка перехода к смысловому блоку -->
      <div class="pt-2">
        <button id="compare-next-btn" class="btn-press w-full py-4 px-6 bg-[var(--color-accent)] hover:bg-[var(--color-accent-hover)] text-slate-950 font-bold rounded-2xl text-base flex items-center justify-center gap-2 shadow-lg shadow-sky-500/20 transition-all">
          <span>Как это внедрить?</span>
          <i data-lucide="arrow-right" class="w-5 h-5"></i>
        </button>
      </div>
    </div>
  `;
}
