/**
 * js/components/goal-screen.js — Экран выбора цели клиента
 */

import { GOALS } from '../data/scenes-two.js';

export function renderGoalScreen({ selectedGoalId = 'apply' }) {
  const goalCards = GOALS.map(g => {
    const isSelected = g.id === selectedGoalId;
    return `
      <button data-goal-id="${g.id}" class="goal-option-btn card-press w-full p-4 rounded-2xl border text-left flex items-center justify-between transition-all ${
        isSelected
          ? 'bg-[var(--color-surface)] border-[var(--color-accent)] shadow-md shadow-sky-500/10 text-white ring-1 ring-[var(--color-accent)]'
          : 'bg-[var(--color-surface)]/60 border-[var(--color-border)] hover:bg-[var(--color-surface)] text-slate-200'
      }">
        <div class="flex items-center gap-3">
          <div class="w-5 h-5 rounded-full border flex items-center justify-center ${
            isSelected ? 'border-[var(--color-accent)] bg-[var(--color-accent)] text-slate-950' : 'border-slate-500'
          }">
            ${isSelected ? '<i data-lucide="check" class="w-3.5 h-3.5"></i>' : ''}
          </div>
          <span class="font-semibold text-sm sm:text-base">${g.title}</span>
        </div>
      </button>
    `;
  }).join('');

  return `
    <div class="flex-1 flex flex-col justify-between p-6 fade-in safe-top safe-bottom max-w-md mx-auto w-full">
      <div class="pt-4 pb-2">
        <div class="inline-flex items-center gap-1.5 text-xs font-semibold text-[var(--color-accent)] uppercase tracking-wider mb-2">
          <i data-lucide="map-pin" class="w-4 h-4"></i>
          <span>Настройка сценария</span>
        </div>
        <h2 class="text-2xl sm:text-3xl font-extrabold text-white mb-2">
          Куда должен дойти твой клиент?
        </h2>
        <p class="text-sm text-[var(--color-muted)] leading-relaxed mb-6">
          Выбери целевое действие. Все игровые ситуации и тексты маршрута подстроятся под твою воронку.
        </p>

        <!-- Список целей -->
        <div class="flex flex-col gap-2.5">
          ${goalCards}
        </div>
      </div>

      <!-- Кнопка подтверждения -->
      <div class="pt-6">
        <button id="confirm-goal-btn" class="btn-press w-full py-4 px-6 bg-[var(--color-accent)] hover:bg-[var(--color-accent-hover)] text-slate-950 font-bold rounded-2xl text-base flex items-center justify-center gap-2 shadow-lg shadow-sky-500/20 transition-all">
          <span>Маршрут построен. Поехали!</span>
          <i data-lucide="arrow-right" class="w-5 h-5"></i>
        </button>
      </div>
    </div>
  `;
}
