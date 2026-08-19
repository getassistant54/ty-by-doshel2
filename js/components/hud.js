/**
 * js/components/hud.js — Игровой HUD (Геймерский неоновый стиль)
 */

import { calculateMetrics } from '../scoring.js';

export function renderHUD({ answers, progressPercent, showBack = false }) {
  const m = calculateMetrics(answers);

  return `
    <header class="safe-top px-4 pt-3 pb-2.5 border-b border-[var(--color-border)] bg-[#090d16]/85 backdrop-blur-xl sticky top-0 z-40">
      <div class="flex items-center justify-between gap-2 mb-2.5">
        <div class="flex items-center gap-2">
          ${showBack ? `
            <button id="hud-back-btn" class="p-1.5 -ml-1 text-slate-300 hover:text-white rounded-xl bg-[var(--color-surface)] border border-[var(--color-border)] transition-all active:scale-95" aria-label="Назад">
              <i data-lucide="arrow-left" class="w-4 h-4"></i>
            </button>
          ` : `
            <div class="w-2.5 h-2.5 rounded-full bg-sky-400 shadow-[0_0_8px_#38bdf8] animate-pulse"></div>
          `}
          <span class="text-[11px] font-bold tracking-wider text-slate-300 uppercase">
            Маршрут: <span class="text-sky-400 font-extrabold">${progressPercent}%</span>
          </span>
        </div>
      </div>

      <!-- Игровые капсулы метрик -->
      <div class="grid grid-cols-4 gap-2 text-xs">
        <div class="flex items-center justify-center gap-1.5 glass-card py-2 px-1.5 rounded-xl border border-rose-500/25 bg-rose-500/10">
          <span class="text-sm">❤️</span>
          <span class="font-extrabold text-white">${m.interest}/5</span>
        </div>
        <div class="flex items-center justify-center gap-1.5 glass-card py-2 px-1.5 rounded-xl border border-indigo-500/25 bg-indigo-500/10">
          <span class="text-sm">🧠</span>
          <span class="font-extrabold text-white">${m.load}</span>
        </div>
        <div class="flex items-center justify-center gap-1.5 glass-card py-2 px-1.5 rounded-xl border border-cyan-500/25 bg-cyan-500/10">
          <span class="text-sm">🔄</span>
          <span class="font-extrabold text-white">${m.switches}</span>
        </div>
        <div class="flex items-center justify-center gap-1.5 glass-card py-2 px-1.5 rounded-xl border border-amber-500/25 bg-amber-500/10">
          <span class="text-sm">⏱</span>
          <span class="font-extrabold text-white">${m.friction}</span>
        </div>
      </div>

      <!-- Неоновый прогресс-бар -->
      <div class="w-full bg-slate-800/60 h-2 rounded-full overflow-hidden mt-2.5 p-0.5 border border-white/5">
        <div class="h-full rounded-full transition-all duration-300 ease-out shadow-[0_0_12px_#38bdf8]" style="width: ${progressPercent}%; background: var(--color-accent-gradient);"></div>
      </div>
    </header>
  `;
}
