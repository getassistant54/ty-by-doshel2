/**
 * js/components/result-screen.js — Экран диагноза (Премиум Wow-стиль)
 */

import { determineResult, getRecoveryData, getPersonalInsight } from '../results.js';
import { calculateMetrics } from '../scoring.js';
import { escapeHtml } from '../utils.js';

export function renderResultScreen({ answers }) {
  const metrics = calculateMetrics(answers);
  const result = determineResult(metrics, answers);
  const recovery = getRecoveryData(answers);
  const personalInsight = getPersonalInsight(answers);

  const fixList = result.fixes.map(f => `
    <li class="flex items-start gap-2.5 text-xs sm:text-sm text-slate-200">
      <div class="w-5 h-5 rounded-lg bg-sky-500/20 border border-sky-500/30 flex items-center justify-center shrink-0 mt-0.5">
        <i data-lucide="check" class="w-3.5 h-3.5 text-sky-400"></i>
      </div>
      <span>${escapeHtml(f)}</span>
    </li>
  `).join('');

  return `
    <div class="flex-1 flex flex-col justify-between p-4 sm:p-6 fade-in safe-top safe-bottom max-w-md mx-auto w-full">
      <div class="pt-2 pb-4">
        <!-- Бейдж диагноза -->
        <div class="inline-flex items-center gap-2 glass-card px-3.5 py-1.5 rounded-full text-xs font-bold text-sky-300 mb-3 border-sky-500/30">
          <i data-lucide="activity" class="w-4 h-4 text-sky-400"></i>
          <span>Диагностика маршрута</span>
        </div>

        <!-- Главная карточка диагноза -->
        <div class="glass-card p-5 rounded-3xl mb-4 relative overflow-hidden border-sky-500/30 shadow-[0_0_30px_rgba(56,189,248,0.15)]">
          <div class="flex items-center gap-3.5 mb-3">
            <div class="w-12 h-12 rounded-2xl flex items-center justify-center text-white shrink-0 shadow-lg" style="background: linear-gradient(135deg, ${result.color} 0%, #0f172a 100%); border: 1px solid ${result.color};">
              <i data-lucide="${result.icon || 'alert-triangle'}" class="w-6 h-6"></i>
            </div>
            <div>
              <div class="text-xs font-bold uppercase tracking-wider text-slate-400">Твой диагноз:</div>
              <h2 class="text-xl sm:text-2xl font-black text-white leading-tight">${escapeHtml(result.title)}</h2>
            </div>
          </div>
          <p class="text-xs sm:text-sm text-sky-200/90 font-medium mb-3">${escapeHtml(result.subtitle)}</p>
          <p class="text-xs text-slate-300 leading-relaxed">${escapeHtml(result.description)}</p>
        </div>

        <!-- Персональный инсайт -->
        <div class="p-3.5 rounded-2xl bg-sky-950/30 border border-sky-500/25 mb-4 text-xs text-sky-200 flex items-center gap-2.5">
          <i data-lucide="compass" class="w-5 h-5 text-sky-400 shrink-0"></i>
          <p class="font-medium">${escapeHtml(personalInsight)}</p>
        </div>

        <!-- Что можно улучшить -->
        <div class="glass-card p-4 rounded-2xl mb-4">
          <div class="text-xs font-bold uppercase tracking-wider text-slate-300 mb-3 flex items-center gap-1.5">
            <i data-lucide="zap" class="w-4 h-4 text-amber-400"></i>
            <span>Точки роста в маршруте:</span>
          </div>
          <ul class="space-y-2.5">${fixList}</ul>
        </div>
      </div>

      <!-- Кнопка перехода во Второй Акт -->
      <div class="pt-2">
        <button id="try-alt-route-btn" class="btn-glow w-full py-4 px-6 text-slate-950 font-black rounded-2xl text-base flex items-center justify-center gap-2 cursor-pointer">
          <span>Собрать идеальный маршрут</span>
          <i data-lucide="sparkles" class="w-5 h-5"></i>
        </button>
      </div>
    </div>
  `;
}
