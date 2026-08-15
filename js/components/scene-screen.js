/**
 * js/components/scene-screen.js — Карточка вопроса сцены
 */

import { escapeHtml } from '../utils.js';

export function renderSceneScreen({ scene, goalId, selectedOptionId = null }) {
  let title = scene.title;
  let subtitle = scene.subtitle;
  let question = scene.question;

  if (typeof scene.getDynamicContent === 'function') {
    const dyn = scene.getDynamicContent(goalId);
    subtitle = dyn.subtitle;
    question = dyn.question;
  }

  const optionCards = scene.options.map(opt => {
    const isSelected = opt.id === selectedOptionId;
    return `
      <button data-option-id="${opt.id}" class="scene-option-btn card-press w-full p-4 rounded-2xl border text-left flex items-center justify-between transition-all duration-200 ${
        isSelected
          ? 'bg-[var(--color-surface)] border-[var(--color-accent)] ring-2 ring-[var(--color-accent)]/50 text-white shadow-md'
          : 'bg-[var(--color-surface)]/70 border-[var(--color-border)] hover:bg-[var(--color-surface)] hover:border-slate-500 text-slate-200'
      }">
        <span class="font-medium text-sm sm:text-base leading-snug">${escapeHtml(opt.text)}</span>
        <i data-lucide="chevron-right" class="w-4 h-4 text-slate-400 shrink-0 ml-2"></i>
      </button>
    `;
  }).join('');

  return `
    <div class="flex-1 flex flex-col justify-between p-4 sm:p-6 fade-in max-w-md mx-auto w-full">
      <div class="pt-2">
        <!-- Тематический бейдж -->
        <div class="inline-flex items-center gap-1.5 bg-[var(--color-surface)] border border-[var(--color-border)] px-3 py-1 rounded-full text-xs font-semibold text-[var(--color-accent)] mb-3">
          <i data-lucide="${scene.icon || 'help-circle'}" class="w-3.5 h-3.5"></i>
          <span>${escapeHtml(title)}</span>
        </div>

        <p class="text-xs sm:text-sm text-[var(--color-muted)] mb-2 font-medium">
          ${escapeHtml(subtitle)}
        </p>

        <h2 class="text-xl sm:text-2xl font-extrabold text-white mb-5 leading-tight">
          ${escapeHtml(question)}
        </h2>

        <!-- Список вариантов -->
        <div id="options-container" class="flex flex-col gap-2.5">
          ${optionCards}
        </div>
      </div>

      <!-- Зона микро-реакции и всплывающих бейджей изменения метрик -->
      <div id="reaction-container" class="min-h-[64px] pt-4 flex flex-col items-center justify-center text-center transition-all duration-300">
        <div id="metric-deltas" class="flex gap-2 mb-1.5"></div>
        <p id="reaction-text" class="text-xs sm:text-sm font-medium text-[var(--color-accent)] italic opacity-0 transition-opacity duration-200"></p>
      </div>
    </div>
  `;
}
