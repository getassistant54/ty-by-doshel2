import { renderShell } from './layout.js';

export function renderHeroScreen() {
  return renderShell(`
    <div class="flex-1 flex flex-col justify-center py-2">
      <div class="eyebrow">Игровой симулятор</div>
      <h1 class="display-title"><span style="color: var(--color-text);">Ты бы</span> <span class="accent">дошёл?</span></h1>
      <p class="lead-text mt-3">Попробуй пройти путь собственного клиента от первого интереса до целевого действия.</p>

      <div class="route-visual" aria-hidden="true">
        <span class="route-dot active"></span>
        <span class="route-line"></span>
        <span class="route-dot"></span>
        <span class="route-line"></span>
        <span class="route-dot"></span>
      </div>

      <div class="glass-card mb-5">
        <p class="text-xs font-semibold text-white">Ты знаешь свой бизнес изнутри.</p>
        <p class="muted text-xs leading-relaxed mt-1">Сейчас посмотрим на него с другой стороны. Примерно 3 минуты.</p>
      </div>

      <div>
        <button class="primary-btn" id="hero-start-btn" data-action="start">Стать клиентом</button>
      </div>
    </div>
  `);
}
