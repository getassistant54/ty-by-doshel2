import { renderShell, renderTopbar } from './layout.js';
import { determineResult } from '../results.js';
import { getPersonalInsight, getRecoveryInsight, getPersonalTips } from '../insights.js';
import { calculateMetrics, getRoute, getRecovery } from '../scoring.js';
import { getCachedAiResult } from '../ai-handler.js';
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
    <p class="lead-text mt-4">${escapeHtml(result.summary || result.subtitle || '')}</p>
    <p class="text-sm mt-4">${escapeHtml(personalInsight)}</p>

    <!-- AI разбор (если доступен) -->
    ${cachedAi?.data ? `
      <div class="glass-card mt-5 border-[rgba(255,200,87,0.35)]">
        <div class="eyebrow flex items-center gap-1.5"><i data-lucide="sparkles" class="w-3.5 h-3.5 text-[var(--color-accent-2)]"></i> Нейро-разбор стратегии</div>
        <p class="text-sm font-bold mt-2">Архетип: <span class="text-[var(--color-accent-2)]">${escapeHtml(cachedAi.data.archetype || 'Стратег')}</span></p>
        <p class="muted text-xs leading-relaxed mt-1">${escapeHtml(cachedAi.data.analysis || cachedAi.raw || '')}</p>
      </div>
    ` : ''}

    <div class="result-card mt-6">
      <div class="metric-list">${metricRows.map(([icon, text]) => `
        <div class="metric-row"><span class="metric-icon"><i data-lucide="${icon}" class="w-4 h-4"></i></span><span class="text-sm">${escapeHtml(text)}</span></div>
      `).join('')}</div>
    </div>

    ${route && route.length ? `
      <div class="mt-6">
        <div class="eyebrow mb-3">Основной маршрут</div>
        <div class="route-chip-list">${route.map((item) => `<span class="route-chip">${escapeHtml(item)}</span>`).join('<span class="muted">→</span>')}</div>
      </div>
    ` : ''}

    ${recoveryInsight ? `
      <div class="recovery-card recovery-${recoveryInsight.tone || 'warning'} mt-6">
        <span class="metric-icon shrink-0"><i data-lucide="rotate-ccw" class="w-4 h-4"></i></span>
        <div>
          <div class="eyebrow">Если клиент остановился</div>
          <p class="font-bold text-sm mt-2">${escapeHtml(recoveryInsight.title)}</p>
          <p class="muted text-xs leading-relaxed mt-1">${escapeHtml(recoveryInsight.text)}</p>
          ${recovery?.label ? `<span class="route-chip inline-block mt-3">${escapeHtml(recovery.label)}</span>` : ''}
        </div>
      </div>
    ` : ''}

    <div class="glass-card mt-6">
      <p class="font-bold text-sm">Что можно улучшить</p>
      <div class="mt-4 space-y-3">${tips.map((tip) => `
        <div class="flex items-start gap-3"><span class="option-icon w-7 h-7 rounded-lg shrink-0"><i data-lucide="diamond" class="w-3 h-3"></i></span><p class="muted text-xs leading-relaxed">${escapeHtml(tip)}</p></div>
      `).join('')}</div>
    </div>

    <button class="primary-btn mt-6" id="try-alt-route-btn" data-action="alternate">Показать другой маршрут</button>
  `);
}
