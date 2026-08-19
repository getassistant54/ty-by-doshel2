import { renderShell } from './layout.js';

const ITEMS = [
  ['map', 'Откуда приходит человек'],
  ['circle-help', 'Что он должен понять'],
  ['git-fork', 'Какие решения принимает'],
  ['octagon-x', 'Где может остановиться'],
  ['combine', 'Что объединить или автоматизировать'],
];

export function renderServiceScreen() {
  return renderShell(`
    <div class="eyebrow">Архитектор клиентского пути</div>
    <h1 class="screen-title">Вот этим и занимается архитектор маршрута</h1>
    <p class="lead-text mt-4">Не рисует набор страниц. А разбирает весь путь.</p>
    <div class="glass-card mt-6 space-y-4">${ITEMS.map(([icon, label]) => `
      <div class="flex items-start gap-4"><span class="option-icon shrink-0"><i data-lucide="${icon}" class="w-4 h-4"></i></span><p class="text-sm pt-2">${label}</p></div>
    `).join('')}</div>
    <p class="muted text-xs leading-relaxed mt-5">И только потом выбирается способ реализации. Если маршрут идёт через Telegram, одним из вариантов может быть MiniApp.</p>
    <div class="mt-auto pt-7">
      <button class="primary-btn" id="open-lead-drawer-btn" data-action="open-lead">Показать, как упростить мой путь</button>
      <button class="text-btn w-full mt-2" id="service-restart-btn" data-action="restart">Пройти ещё раз</button>
    </div>`);
}
