/**
 * js/components/alt-screen.js — Второй интерактивный акт (улучшенные шаги)
 */

import { escapeHtml } from '../utils.js';

export function renderAltScreen({ episode, episodeIndex, totalEpisodes, recoveryInsight = null }) {
  // Экран для сценария, когда проблемных сцен не найдено («Почти бесшовно»)
  if (!episode) {
    return `
      <div class="flex-1 flex flex-col justify-between p-6 fade-in safe-top safe-bottom max-w-md mx-auto w-full">
        <div class="pt-8 pb-4">
          <div class="inline-flex items-center gap-1.5 bg-emerald-500/10 border border-emerald-500/30 px-3 py-1 rounded-full text-xs font-semibold text-emerald-400 mb-4">
            <i data-lucide="check-check" class="w-4 h-4"></i>
            <span>Чистый маршрут</span>
          </div>

          <h2 class="text-2xl sm:text-3xl font-extrabold text-white mb-3">
            Здесь нечего чинить ради самого чинить
          </h2>
          <p class="text-sm text-slate-300 leading-relaxed mb-6">
            Твой основной маршрут уже выглядит логично и не требует масштабной перестройки.
          </p>

          ${recoveryInsight ? `
            <div class="bg-[var(--color-surface)] border border-[var(--color-border)] p-4 rounded-2xl mb-4 text-xs text-slate-300">
              <div class="font-bold text-[var(--color-accent)] mb-1">Точка роста:</div>
              <p>${escapeHtml(recoveryInsight)}</p>
            </div>
          ` : ''}
        </div>

        <div class="pt-4">
          <button id="alt-skip-to-service-btn" class="btn-press w-full py-4 px-6 bg-[var(--color-accent)] hover:bg-[var(--color-accent-hover)] text-slate-950 font-bold rounded-2xl text-base flex items-center justify-center gap-2 shadow-lg shadow-sky-500/20 transition-all">
            <span>Посмотреть выводы и роль архитектора</span>
            <i data-lucide="arrow-right" class="w-5 h-5"></i>
          </button>
        </div>
      </div>
    `;
  }

  const optionCards = episode.options.map(opt => `
    <button data-alt-option-id="${opt.id}" class="alt-option-btn card-press w-full p-4 rounded-2xl border bg-[var(--color-surface)]/80 border-[var(--color-border)] hover:border-emerald-500 text-left flex items-center justify-between transition-all">
      <span class="font-medium text-sm sm:text-base text-slate-100">${escapeHtml(opt.text)}</span>
      <i data-lucide="chevron-right" class="w-4 h-4 text-emerald-400 shrink-0 ml-2"></i>
    </button>
  `).join('');

  return `
    <div class="flex-1 flex flex-col justify-between p-4 sm:p-6 fade-in safe-top safe-bottom max-w-md mx-auto w-full">
      <div class="pt-2">
        <div class="flex items-center justify-between gap-2 mb-3">
          <div class="inline-flex items-center gap-1.5 bg-emerald-500/10 border border-emerald-500/30 px-3 py-1 rounded-full text-xs font-semibold text-emerald-400">
            <i data-lucide="sparkles" class="w-3.5 h-3.5"></i>
            <span>Второй акт • Шаг ${episodeIndex + 1} из ${totalEpisodes}</span>
          </div>
        </div>

        <p class="text-xs sm:text-sm text-[var(--color-muted)] mb-2 font-medium">
          ${escapeHtml(episode.subtitle)}
        </p>

        <h2 class="text-xl sm:text-2xl font-extrabold text-white mb-5 leading-tight">
          ${escapeHtml(episode.question)}
        </h2>

        <div id="alt-options-container" class="flex flex-col gap-2.5">
          ${optionCards}
        </div>
      </div>

      <div id="alt-reaction-container" class="min-h-[56px] pt-4 flex flex-col items-center justify-center text-center">
        <p id="alt-reaction-text" class="text-xs sm:text-sm font-semibold text-emerald-400 italic opacity-0 transition-opacity duration-200"></p>
      </div>
    </div>
  `;
}
