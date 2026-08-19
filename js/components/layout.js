export function renderShell(content, className = '') {
  return `<main class="app-shell"><section class="screen screen-enter ${className}">${content}</section></main>`;
}

export function renderTopbar(progress, showBack = true) {
  return `
    <div class="topbar">
      ${showBack ? '<button class="back-btn" id="hud-back-btn" data-action="back" aria-label="Назад"><i data-lucide="arrow-left" class="w-5 h-5"></i></button>' : ''}
      <div class="progress-wrap">
        <div class="progress-label">Маршрут пройден на ${progress}%</div>
        <div class="progress-track"><div class="progress-fill" style="width:${progress}%"></div></div>
      </div>
    </div>`;
}

export function renderHud(metrics) {
  const items = [
    ['interest', '❤️', `${metrics?.interest ?? 5}/5`, 'Интерес'],
    ['load', '🧠', metrics?.load ?? 0, 'Нагрузка'],
    ['switches', '🔄', metrics?.switches ?? 0, 'Переходы'],
    ['friction', '⏱', metrics?.friction ?? 0, 'Трение'],
  ];
  return `<div class="hud">${items.map(([key, icon, value, label]) => `
    <div class="hud-item" title="${label}" data-hud="${key}"><span>${icon}</span><span class="hud-value">${value}</span></div>
  `).join('')}</div>`;
}
