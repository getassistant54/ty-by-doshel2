import { renderShell } from './layout.js';

const ITEMS = [
  ['map', 'Откуда приходит человек'],
  ['help-circle', 'Что он должен понять'],
  ['git-fork', 'Какие решения принимает'],
  ['x-octagon', 'Где может остановиться'],
  ['combine', 'Что объединить или автоматизировать'],
];

export function renderServiceScreen() {
  return renderShell(`
    <div class="flex-1 flex flex-col pt-1">
      <div class="eyebrow">Архитектор клиентского пути</div>
      <h1 class="screen-title">Вот этим и занимается архитектор маршрута</h1>
      <p class="lead-text mt-1">Не рисует набор страниц. А разбирает весь путь.</p>
      
      <div class="glass-card mt-3 space-y-2.5">
        ${ITEMS.map(([icon, label]) => `
          <div class="flex items-center gap-3">
            <span class="option-icon shrink-0 w-7 h-7"><i data-lucide="${icon}" class="w-3.5 h-3.5"></i></span>
            <p class="text-xs text-white font-medium">${label}</p>
          </div>
        `).join('')}
      </div>

      <p class="muted text-xs leading-relaxed mt-3">И только потом выбирается способ реализации. Если маршрут идёт через Telegram, одним из вариантов может быть MiniApp.</p>

      <div class="mt-auto pt-4 pb-2">
        <button class="primary-btn" id="open-lead-drawer-btn" data-action="open-lead">Показать, как упростить мой путь</button>
        <button class="text-btn w-full mt-1.5" id="service-restart-btn" data-action="restart">Пройти ещё раз</button>
      </div>
    </div>
  `);
}
