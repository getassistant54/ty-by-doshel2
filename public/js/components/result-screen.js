import { renderShell, renderTopbar } from './layout.js';
import { determineResult } from '../results.js';
import { getPersonalInsight, getRecoveryInsight, getPersonalTips } from '../insights.js';
import { calculateMetrics, getRoute, getRecovery } from '../scoring.js';
import { getCachedAiResult, isAiGenerating } from '../ai-handler.js';
import { escapeHtml } from '../utils.js';

export function renderResultScreen({ answers = {}, goalId, metrics: customMetrics, result: customResult }) {
  const metrics = customMetrics || calculateMetrics(answers);
  const result = customResult || determineResult(metrics);
  const route = getRoute ? getRoute(answers) : Object.values(answers).map(a => a.routeTitle || a.label || a.text).filter(Boolean);
  const recovery = getRecovery ? getRecovery(answers) : null;
  const recoveryInsight = getRecoveryInsight(recovery);
  const personalInsight = getPersonalInsight(answers, metrics, result);
  const tips = getPersonalTips(result, recoveryInsight);
  const cachedAi = getCachedAiResult();
  const generating = isAiGenerating();

  const metricRows = [
    ['repeat-2', `Переключиться между площадками: ${metrics.switches ?? 0} раз`],
    ['brain', `Принять дополнительные решения: ${metrics.load ?? 0}`],
    ['timer', `Столкнуться с лишними действиями: ${metrics.friction ?? 0}`],
    ['heart', `Остаток интереса: ${metrics.interest ?? 5} из 5`],
  ];

  return renderShell(`
    ${renderTopbar(82)}
    <div class="eyebrow">Ты дошёл</div>
    <h1 class="screen-title">${escapeHtml(result.title)}</h1>
    <p class="lead-text mt-2">${escapeHtml(result.summary || result.subtitle || '')}</p>
    <p class="text-sm mt-3 leading-relaxed text-[#f8f7f3]">${escapeHtml(personalInsight)}</p>

    <!-- Блок ИИ-разбора от Hydra AI -->
    ${cachedAi?.data ? `
      <div class="ai-card mt-4">
        <div class="flex items-center justify-between gap-2 mb-2">
          <div class="eyebrow flex items-center gap-1.5 text-[var(--color-accent-2)]">
            <i data-lucide="sparkles" class="w-4 h-4"></i> Нейро-разбор Hydra AI
          </div>
          <span class="ai-badge">${escapeHtml(cachedAi.data.archetype || 'Стратег')}</span>
        </div>
        <p class="text-xs leading-relaxed text-[#f8f7f3] mt-1">${escapeHtml(cachedAi.data.analysis || cachedAi.raw || '')}</p>
        ${cachedAi.data.recommendations && cachedAi.data.recommendations.length ? `
          <div class="mt-3 pt-2 border-t border-[rgba(255,255,255,0.08)]">
            <div class="text-[0.68rem] font-bold uppercase tracking-wider text-[var(--color-accent-2)] mb-1.5">Рекомендации ИИ:</div>
            <ul class="text-xs space-y-1 text-muted">
              ${cachedAi.data.recommendations.map(r => `<li class="flex items-start gap-1.5"><span>•</span><span>${escapeHtml(r)}</span></li>`).join('')}
            </ul>
          </div>
        ` : ''}
        ${cachedAi.data.scoreForecast ? `
          <div class="mt-2.5 text-[0.72rem] text-muted"><span class="font-bold text-[#79d7a7]">Прогноз:</span> ${escapeHtml(cachedAi.data.scoreForecast)}</div>
        ` : ''}
      </div>
    ` : generating ? `
      <div class="ai-card mt-4 animate-pulse">
        <div class="eyebrow flex items-center gap-1.5 text-[var(--color-accent-2)]">
          <i data-lucide="sparkles" class="w-4 h-4"></i> Нейро-разбор Hydra AI
        </div>
        <p class="text-xs text-muted mt-2 flex items-center gap-2">
          <span class="inline-block w-2 h-2 rounded-full bg-[var(--color-accent-2)]"></span>
          Генерируем персональный разбор стратегии...
        </p>
      </div>
    ` : ''}

    <div class="result-card mt-4">
      <div class="metric-list">${metricRows.map(([icon, text]) => `
        <div class="metric-row">
          <span class="metric-icon"><i data-lucide="${icon}" class="w-4 h-4"></i></span>
          <span class="metric-text">${escapeHtml(text)}</span>
        </div>
      `).join('')}</div>
    </div>

    ${route && route.length ? `
      <div class="mt-4">
        <div class="eyebrow mb-2">Основной маршрут</div>
        <div class="route-chip-list">${route.map((item) => `<span class="route-chip">${escapeHtml(item)}</span>`).join('<span class="muted text-xs">→</span>')}</div>
      </div>
    ` : ''}

    ${recoveryInsight ? `
      <div class="recovery-card recovery-${recoveryInsight.tone || 'warning'} mt-4">
        <span class="metric-icon shrink-0"><i data-lucide="rotate-ccw" class="w-4 h-4"></i></span>
        <div>
          <div class="eyebrow">Если клиент остановился</div>
          <p class="font-bold text-sm mt-1">${escapeHtml(recoveryInsight.title)}</p>
          <p class="muted text-xs leading-relaxed mt-1">${escapeHtml(recoveryInsight.text)}</p>
          ${recovery?.label ? `<span class="route-chip inline-block mt-2">${escapeHtml(recovery.label)}</span>` : ''}
        </div>
      </div>
    ` : ''}

    <div class="glass-card mt-4">
      <div class="eyebrow text-[var(--color-accent-2)] mb-1">Точки роста</div>
      <p class="font-bold text-sm">Что можно улучшить</p>
      <div class="tip-list">
        ${tips.map((tip) => `
          <div class="tip-item">
            <span class="tip-icon"><i data-lucide="check" class="w-3 h-3"></i></span>
            <span class="tip-text">${escapeHtml(tip)}</span>
          </div>
        `).join('')}
      </div>
    </div>

    <button class="primary-btn mt-5 mb-4" id="try-alt-route-btn" data-action="alternate">Показать другой маршрут</button>
  `);
}
