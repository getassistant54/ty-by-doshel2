/**
 * js/components/compare-screen.js — Экран сравнения двух маршрутов (Неоновый Wow-контраст)
 */

import { getRouteComparisonData } from '../alternate.js';
import { escapeHtml } from '../utils.js';

export function renderCompareScreen({ originalAnswers, altAnswers }) {
  const data = getRouteComparisonData(originalAnswers, altAnswers);

  const statsRows = data.stats.map(s => `
    <div class="flex items-center justify-between p-3.5 rounded-2xl glass-card text-xs sm:text-sm">
      <span class="text-slate-200 font-semibold">${escapeHtml(s.label)}</span>
      <div class="flex items-center gap-3 font-extrabold">
        <span class="text-rose-400/80 line-through bg-rose-500/10 px-2 py-0.5 rounded-lg border border-rose-500/20">${s.original}</span>
        <i data-lucide="arrow-right" class="w-3.5 h-3.5 text-slate-400"></i>
        <span class="text-emerald-400 bg-emerald-500/15 px-2.5 py-0.5 rounded-lg border border-emerald-500/30 text-sm sm:text-base shadow-[0_0_10px_rgba(16,185,129,0.3)]">${s.alternate}</span>
      </div>
    </div>
  `).join('');

  return `
    <div class="flex-1 flex flex-col justify-between p-4 sm:p-6 fade-in safe-top safe-bottom max-w-md mx-auto w-full">
      <div class="pt-2 pb-4">
        <div class="inline-flex items-center gap-2 glass-card border-emerald-500/40 px-3.5 py-1.5 rounded-full text-xs font-bold text-emerald-300 mb-3 bg-emerald-500/10">
          <i data-lucide="sparkles" class="w-4 h-4 text-emerald-400"></i>
          <span>Сравнение опыта</span>
        </div>

        <h2 class="text-2xl sm:text-3xl font-black text-white mb-2 leading-tight">
          Почувствовал <span class="text-gradient-emerald">разницу?</span>
        </h2>
        <p class="text-xs sm:text-sm text-slate-300 mb-4">
          Вот как меняются ключевые показатели, если убрать барьеры:
        </p>

        <!-- Таблица изменений -->
        <div class="flex flex-col gap-2.5 mb-4">
          ${statsRows}
        </div>

        <!-- Было / Стало визуальный контраст -->
        <div class="grid grid-cols-2 gap-2.5 mb-4 text-xs">
          <div class="p-3.5 rounded-2xl bg-rose-950/30 border border-rose-500/30 text-rose-100">
            <div class="font-extrabold mb-1 uppercase tracking-wider text-[10px] text-rose-400 flex items-center gap-1">
              <span>✕ Было</span>
            </div>
            <p class="leading-relaxed text-[11px] text-rose-200/90 font-medium">${escapeHtml(data.origRouteList.slice(0, 3).join(' → '))}</p>
          </div>

          <div class="p-3.5 rounded-2xl bg-emerald-950/30 border border-emerald-500/30 text-emerald-100 shadow-[0_0_15px_rgba(16,185,129,0.15)]">
            <div class="font-extrabold mb-1 uppercase tracking-wider text-[10px] text-emerald-400 flex items-center gap-1">
              <span>✓ Стало</span>
            </div>
            <p class="leading-relaxed text-[11px] text-emerald-200 font-medium">${escapeHtml(data.altRouteList.slice(0, 3).join(' → '))}</p>
          </div>
        </div>

        <!-- Поясняющий блок -->
        <div class="p-3.5 rounded-2xl glass-card text-xs text-slate-300 leading-relaxed border-sky-500/20">
          <span class="text-sky-300 font-bold">Главный вывод:</span> Чем меньше остановок и решений на пути клиента, тем выше доходимость до целевого действия.
        </div>
      </div>

      <!-- Кнопка перехода к смысловому блоку -->
      <div class="pt-2">
        <button id="compare-next-btn" class="btn-glow w-full py-4 px-6 text-slate-950 font-black rounded-2xl text-base flex items-center justify-center gap-2 cursor-pointer">
          <span>Смотреть выводы</span>
          <i data-lucide="arrow-right" class="w-5 h-5"></i>
        </button>
      </div>
    </div>
  `;
}
