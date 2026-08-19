import { renderShell, renderTopbar } from './layout.js';

export function renderPauseScreen() {
  return renderShell(`
    ${renderTopbar(62)}
    <div class="flex-1 flex flex-col justify-center">
      <div class="option-icon mb-6 w-14 h-14 rounded-2xl"><i data-lucide="log-out" class="w-7 h-7"></i></div>
      <div class="eyebrow">Может, потом?</div>
      <h1 class="screen-title">Есть вариант попроще</h1>
      <p class="lead-text mt-4">Можно закрыть всё это и вернуться потом.</p>
      <div class="mt-8 space-y-3">
        <button class="primary-btn" id="pause-continue-btn" data-action="continue-route">Идти дальше</button>
        <button class="secondary-btn" id="pause-later-btn" data-action="later">Разобраться потом</button>
      </div>
      <div id="pause-reaction" class="reaction mt-5 hidden" role="status" aria-live="polite">
        Знакомо? Реальный клиент тоже часто выбирает «потом». Но ты сегодня очень мотивирован.
      </div>
    </div>`);
}
