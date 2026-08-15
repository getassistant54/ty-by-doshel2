/**
 * js/components/result-screen.js — Экран первого финала и диагностики
 */

import { calculateMetrics } from '../scoring.js';
import { determineResult, getRecoveryData, getPersonalInsight } from '../results.js';
import { escapeHtml } from '../utils.js';

export function renderResultScreen({ answers = {} }) {
  const m = calculateMetrics(answers);
  const result = determineResult(m, answers);
  const recovery = getRecoveryData(answers);
  const personalSummary = getPersonalInsight(answers);

  const fixItems = result.fixes.map(f => `
    <li class="flex items-start gap-2 text-xs sm:text-sm text-slate-300">
      <i data-lucide="arrow-right-circle" class="w-4 h-4 text-[var(--color-accent)] shrink-0 mt-0.5"></i>
      <span>${escapeHtml(f)}</span>
    </li>
  `).join('');

  return `
    <div class="flex-1 flex flex-col justify-between p-4 sm:p-6 fade-in safe-top safe-bottom max-w-md mx-auto w-full">
      <div class="pt-2 pb-4">
        <!-- Заголовок финала -->
        <div class="inline-flex items-center gap-1.5 bg-[var(--color-surface)] border border-[var(--color-border)] px-3 py-1 rounded-full text-xs font-semibold text-[var(--color-accent)] mb-3">
          <i data-lucide="flag" class="w-3.5 h-3.5"></i>
          <span>Финиш первого маршрута</span>
        </div>

        <h1 class="text-2xl sm:text-3xl font-extrabold text-white mb-1">
          Ты дошёл
        </h1>
        <p class="text-sm font-medium text-slate-300 mb-4">
          ${m.friction > 2 || m.load > 2 || m.switches > 2 ? 'Но клиенту пришлось изрядно постараться.' : 'Маршрут пройден без критических барьеров.'}
        </p>

        <!-- Сводка по показателям -->
        <div class="grid grid-cols-2 gap-2 mb-4">
          <div class="bg-[var(--color-surface)] border border-[var(--color-border)] p-2.5 rounded-xl">
            <div class="text-[11px] text-[var(--color-muted)]">Переключений</div>
            <div class="text-base font-bold text-slate-100 flex items-center gap-1.5">
              <span>🔄 ${m.switches}</span>
            </div>
          </div>
          <div class="bg-[var(--color-surface)] border border-[var(--color-border)] p-2.5 rounded-xl">
            <div class="text-[11px] text-[var(--color-muted)]">Решений / выбор</div>
            <div class="text-base font-bold text-slate-100 flex items-center gap-1.5">
              <span>🧠 ${m.load}</span>
            </div>
          </div>
          <div class="bg-[var(--color-surface)] border border-[var(--color-border)] p-2.5 rounded-xl">
            <div class="text-[11px] text-[var(--color-muted)]">Точек трения</div>
            <div class="text-base font-bold text-slate-100 flex items-center gap-1.5">
              <span>⏱ ${m.friction}</span>
            </div>
          </div>
          <div class="bg-[var(--color-surface)] border border-[var(--color-border)] p-2.5 rounded-xl">
            <div class="text-[11px] text-[var(--color-muted)]">Остаток интереса</div>
            <div class="text-base font-bold text-slate-100 flex items-center gap-1.5">
              <span>❤️ ${m.interest}/5</span>
            </div>
          </div>
        </div>

        <!-- Главный диагноз (1 из 5 типов) -->
        <div class="bg-[var(--color-surface)] border-2 p-4 rounded-2xl mb-4" style="border-color: ${result.color}">
          <div class="flex items-center gap-2 mb-1.5">
            <i data-lucide="${result.icon}" class="w-5 h-5" style="color: ${result.color}"></i>
            <h3 class="font-extrabold text-base sm:text-lg text-white">${escapeHtml(result.title)}</h3>
          </div>
          <p class="text-xs sm:text-sm font-semibold text-slate-200 mb-2">${escapeHtml(result.subtitle)}</p>
          <p class="text-xs text-[var(--color-muted)] leading-relaxed mb-3">${escapeHtml(result.description)}</p>
          <div class="border-t border-[var(--color-border)] pt-2.5">
            <div class="text-[11px] uppercase font-bold text-[var(--color-accent)] mb-2">Что стоит изменить:</div>
            <ul class="space-y-1.5">${fixItems}</ul>
          </div>
        </div>

        <!-- Персональный маршрут -->
        <div class="bg-[var(--color-surface)]/60 border border-[var(--color-border)] p-3 rounded-xl mb-3 text-xs text-slate-300">
          <span class="font-bold text-white">Основной путь:</span> ${escapeHtml(personalSummary)}
        </div>

        <!-- Отдельный блок Recovery -->
        <div class="bg-[var(--color-surface)]/60 border border-[var(--color-border)] p-3 rounded-xl mb-4 text-xs">
          <div class="flex items-center justify-between gap-2 mb-1">
            <span class="font-bold text-white flex items-center gap-1">
              <i data-lucide="history" class="w-3.5 h-3.5 text-[var(--color-accent)]"></i>
              Если клиент остановился:
            </span>
            <span class="text-[var(--color-muted)] font-medium">${escapeHtml(recovery.title)}</span>
          </div>
          <p class="text-slate-300 leading-relaxed">${escapeHtml(recovery.insight)}</p>
        </div>
      </div>

      <!-- Кнопка перехода ко 2 акту -->
      <div class="pt-2 flex flex-col gap-2">
        <button id="try-alt-route-btn" class="btn-press w-full py-4 px-6 bg-[var(--color-accent)] hover:bg-[var(--color-accent-hover)] text-slate-950 font-bold rounded-2xl text-base flex items-center justify-center gap-2 shadow-lg shadow-sky-500/20 transition-all">
          <span>А теперь попробуем по-другому?</span>
          <i data-lucide="sparkles" class="w-5 h-5"></i>
        </button>
        <button id="restart-game-btn" class="py-2.5 text-xs text-[var(--color-muted)] hover:text-white transition-colors">
          Пройти с другими ответами
        </button>
      </div>
    </div>
  `;
}
