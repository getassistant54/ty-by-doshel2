/**
 * js/components/hud.js — Игровой HUD (Интерес, Нагрузка, Переключения, Трение, Прогресс)
 */

import { calculateMetrics } from '../scoring.js';

export function renderHUD({ answers, progressPercent, showBack = false, onBack }) {
  const m = calculateMetrics(answers);

  return `
    <header class="safe-top px-4 pt-3 pb-2 border-b border-[var(--color-border)] bg-[var(--color-bg)]/80 backdrop-blur-md sticky top-0 z-40">
      <div class="flex items-center justify-between gap-2 mb-2">
        <div class="flex items-center gap-1.5">
          ${showBack ? `
            <button id="hud-back-btn" class="p-1.5 -ml-1 text-[var(--color-muted)] hover:text-white rounded-lg hover:bg-[var(--color-surface)] transition-colors" aria-label="Назад">
              <i data-lucide="arrow-left" class="w-5 h-5"></i>
            </button>
          ` : `
            <div class="w-2 h-2 rounded-full bg-[var(--color-accent)] animate-pulse"></div>
          `}
          <span class="text-xs font-semibold tracking-wide text-[var(--color-muted)] uppercase">
            Маршрут пройден на ${progressPercent}%
          </span>
        </div>
      </div>

      <!-- Игровые показатели -->
      <div class="grid grid-cols-4 gap-1.5 py-1 text-xs">
        <div class="flex items-center justify-center gap-1 bg-[var(--color-surface)] py-1.5 px-2 rounded-lg border border-[var(--color-border)]">
          <span class="text-sm">❤️</span>
          <span class="font-bold text-slate-100">${m.interest}/5</span>
        </div>
        <div class="flex items-center justify-center gap-1 bg-[var(--color-surface)] py-1.5 px-2 rounded-lg border border-[var(--color-border)]">
          <span class="text-sm">🧠</span>
          <span class="font-bold text-slate-100">${m.load}</span>
        </div>
        <div class="flex items-center justify-center gap-1 bg-[var(--color-surface)] py-1.5 px-2 rounded-lg border border-[var(--color-border)]">
          <span class="text-sm">🔄</span>
          <span class="font-bold text-slate-100">${m.switches}</span>
        </div>
        <div class="flex items-center justify-center gap-1 bg-[var(--color-surface)] py-1.5 px-2 rounded-lg border border-[var(--color-border)]">
          <span class="text-sm">⏱</span>
          <span class="font-bold text-slate-100">${m.friction}</span>
        </div>
      </div>

      <!-- Прогресс-бар -->
      <div class="w-full bg-[var(--color-surface)] h-1.5 rounded-full overflow-hidden mt-2">
        <div class="bg-[var(--color-accent)] h-full transition-all duration-300 ease-out" style="width: ${progressPercent}%"></div>
      </div>
    </header>
  `;
}
