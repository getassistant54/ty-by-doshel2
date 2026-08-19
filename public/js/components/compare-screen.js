import { renderShell, renderTopbar } from './layout.js';

const METRICS = {
  actions: 'действий',
  switches: 'переключений',
  decisions: 'дополнительных решений',
  friction: 'лишних действий',
};

function comparisonCard(title, values, keys, highlight = false) {
  return `<div class="glass-card ${highlight ? 'border-[var(--color-accent)]' : ''}">
    <div class="eyebrow">${title}</div>
    <div class="mt-4 space-y-2 text-sm">
      ${keys.map((key) => `<p><strong>${values[key] ?? 0}</strong> ${METRICS[key]}</p>`).join('')}
    </div>
  </div>`;
}

const routeText = (route) => (route || []).join(' → ');

export function renderCompareScreen(comparison = {}) {
  const first = comparison.first || { actions: 4, switches: 2, decisions: 3, friction: 2 };
  const alt = comparison.alternate || { actions: 2, switches: 0, decisions: 1, friction: 0 };
  const beforeRoute = comparison.beforeRoute || [];
  const afterRoute = comparison.afterRoute || [];

  const changedKeys = Object.keys(METRICS).filter((key) => first[key] !== alt[key]);
  const visibleKeys = changedKeys.length ? changedKeys : ['actions', 'friction'];

  return renderShell(`
    ${renderTopbar(98, false)}
    <div class="eyebrow">Сравнение</div>
    <h1 class="screen-title">Почувствовал разницу?</h1>
    <div class="grid gap-3 mt-7">
      ${comparisonCard('Первый маршрут', first, visibleKeys)}
      ${comparisonCard('Альтернативный', alt, visibleKeys, true)}
    </div>
    ${beforeRoute.length && afterRoute.length ? `
      <div class="glass-card mt-4 text-sm">
        <p class="eyebrow">Было</p><p class="muted mt-2">${routeText(beforeRoute)}</p>
        <p class="eyebrow mt-5">Стало</p><p class="muted mt-2">${routeText(afterRoute)}</p>
      </div>
    ` : ''}
    <p class="lead-text text-sm mt-6">${changedKeys.length
      ? 'Это не готовая схема твоего бизнеса. Это пример того, как меняется ощущение маршрута, когда следующий шаг становится очевиднее.'
      : 'Здесь разница небольшая — основной маршрут и так был достаточно простым.'}</p>
    <button class="primary-btn mt-7" id="compare-next-btn" data-action="service">А как это собрать?</button>
  `);
}
