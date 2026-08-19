import { renderShell } from './layout.js';

export function renderHeroScreen(hasSession = false) {
  return renderShell(`
    <div class="screen-center flex-1 flex flex-col justify-center">
      <div class="eyebrow">Игровой симулятор</div>
      <h1 class="display-title">Ты бы<br><span class="accent">дошёл?</span></h1>
      <p class="lead-text mt-6">Попробуй пройти путь собственного клиента от первого интереса до целевого действия.</p>
      <div class="route-visual" aria-hidden="true">
        <span class="route-dot active"></span><span class="route-line"></span><span class="route-dot"></span><span class="route-line"></span><span class="route-dot"></span>
      </div>
      <div class="glass-card mb-6">
        <p class="text-sm font-semibold">Ты знаешь свой бизнес изнутри.</p>
        <p class="muted text-xs mt-2">Сейчас посмотрим на него с другой стороны. Примерно 3 минуты.</p>
      </div>
      <button class="primary-btn" id="start-game-btn" data-action="start">${hasSession ? 'Продолжить маршрут' : 'Стать клиентом'}</button>
      ${hasSession ? '<button class="text-btn mt-2" id="restart-game-btn" data-action="restart">Начать заново</button>' : ''}
    </div>`);
}
