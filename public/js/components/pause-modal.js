import { renderShell, renderTopbar } from './layout.js';

export function renderPauseScreen() {
  return renderShell(`
    ${renderTopbar(62)}
    <div class="flex-1 flex flex-col justify-center">
      <div class="option-icon mb-4 w-12 h-12 rounded-2xl"><i data-lucide="log-out" class="w-6 h-6"></i></div>
      <div class="eyebrow">Может, потом?</div>
      <h1 class="screen-title">Есть вариант попроще</h1>
      <p class="lead-text mt-2">Можно закрыть всё это и вернуться потом.</p>
      
      <div class="mt-6 space-y-3" id="pause-buttons">
        <button class="primary-btn" id="pause-continue-btn" data-action="continue-route">Идти дальше</button>
        <button class="secondary-btn" id="pause-later-btn" data-action="later">Разобраться потом</button>
      </div>

      <div id="pause-reaction" class="choice-feedback mt-4 hidden" role="status" aria-live="polite">
        <div class="feedback-badge-row">
          <span class="feedback-tag">Инсайт</span>
        </div>
        <div class="reaction-bubble">
          Знакомо? Реальный клиент тоже часто выбирает «потом». Но ты сегодня очень мотивирован.
        </div>
        <div class="feedback-timer"><div class="feedback-timer-bar"></div></div>
      </div>
    </div>`);
}
