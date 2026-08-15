/**
 * js/components/pause-modal.js — Развилка «Может, потом?»
 */

export function renderPauseScreen() {
  return `
    <div class="flex-1 flex flex-col justify-between p-6 fade-in safe-top safe-bottom max-w-md mx-auto w-full">
      <div class="pt-8">
        <div class="inline-flex items-center gap-2 bg-amber-500/10 border border-amber-500/30 px-3 py-1.5 rounded-full text-xs font-semibold text-amber-400 mb-4">
          <i data-lucide="coffee" class="w-4 h-4"></i>
          <span>Опасный момент воронки</span>
        </div>

        <h2 class="text-2xl sm:text-3xl font-extrabold text-white mb-3 leading-tight">
          Есть вариант попроще...
        </h2>

        <p class="text-base text-slate-300 mb-6 leading-relaxed">
          Можно закрыть всё это прямо сейчас и «вернуться потом». Что выберешь?
        </p>

        <div id="pause-actions" class="flex flex-col gap-3">
          <button id="pause-continue-btn" class="card-press w-full py-4 px-5 rounded-2xl bg-[var(--color-surface)] border border-[var(--color-border)] hover:border-slate-400 text-white font-semibold text-sm sm:text-base flex items-center justify-between transition-all">
            <span>Идти дальше к цели</span>
            <i data-lucide="arrow-right" class="w-4 h-4 text-slate-400"></i>
          </button>

          <button id="pause-later-btn" class="card-press w-full py-4 px-5 rounded-2xl bg-amber-500/10 border border-amber-500/30 hover:bg-amber-500/20 text-amber-300 font-semibold text-sm sm:text-base flex items-center justify-between transition-all">
            <span>Разобраться потом</span>
            <i data-lucide="x-circle" class="w-4 h-4 text-amber-400"></i>
          </button>
        </div>

        <!-- Контейнер ироничного ответа -->
        <div id="pause-reaction" class="hidden mt-6 p-4 rounded-2xl bg-[var(--color-surface)] border border-amber-500/30 text-left fade-in">
          <div class="text-xs font-bold text-amber-400 uppercase tracking-wider mb-1">Знакомо?</div>
          <p class="text-sm text-slate-200 leading-relaxed mb-2">
            Именно в таких местах реальный клиент чаще всего закрывает вкладку и забывает о продукте.
          </p>
          <div class="text-xs font-semibold text-[var(--color-accent)]">
            Но сегодня ты очень мотивированный клиент. Продолжаем!
          </div>
        </div>
      </div>
    </div>
  `;
}
