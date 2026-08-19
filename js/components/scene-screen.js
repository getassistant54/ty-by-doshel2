/**
 * js/components/scene-screen.js — Карточка вопроса сцены (Glassmorphism + Neon)
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
          ? 'option-selected ring-2 ring-sky-400 text-white'
          : 'glass-card text-slate-100 hover:text-white'
      }">
        <span class="font-medium text-sm sm:text-base leading-snug">${escapeHtml(opt.text)}</span>
        <div class="w-7 h-7 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0 ml-3">
          <i data-lucide="chevron-right" class="w-4 h-4 text-sky-400"></i>
        </div>
      </button>
    `;
  }).join('');

  return `
    <div class="flex-1 flex flex-col justify-between p-4 sm:p-6 fade-in max-w-md mx-auto w-full">
      <div class="pt-2">
        <!-- Тематический бейдж со свечением -->
        <div class="inline-flex items-center gap-2 glass-card px-3.5 py-1.5 rounded-full text-xs font-bold text-sky-300 mb-3 border-sky-500/30">
          <i data-lucide="${scene.icon || 'help-circle'}" class="w-4 h-4 text-sky-400"></i>
          <span>${escapeHtml(title)}</span>
        </div>

        <p class="text-xs sm:text-sm text-slate-300 mb-2 font-medium leading-relaxed">
          ${escapeHtml(subtitle)}
        </p>

        <h2 class="text-xl sm:text-2xl font-black text-white mb-5 leading-tight">
          ${escapeHtml(question)}
        </h2>

        <!-- Список вариантов -->
        <div id="options-container" class="flex flex-col gap-3">
          ${optionCards}
        </div>
      </div>

      <!-- Зона микро-реакции и всплывающих бейджей изменения метрик -->
      <div id="reaction-container" class="min-h-[64px] pt-4 flex flex-col items-center justify-center text-center transition-all duration-300">
        <div id="metric-deltas" class="flex gap-2 mb-1.5"></div>
        <p id="reaction-text" class="text-xs sm:text-sm font-semibold text-sky-300 italic opacity-0 transition-opacity duration-200"></p>
      </div>
    </div>
  `;
}
