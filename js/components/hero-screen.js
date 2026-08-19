/**
 * js/components/hero-screen.js — Главный экран симулятора (Премиум Wow-дизайн)
 */

export function renderHeroScreen() {
  return `
    <div class="flex-1 flex flex-col justify-between p-5 sm:p-6 fade-in safe-top safe-bottom">
      <div class="flex-1 flex flex-col justify-center max-w-md mx-auto w-full py-6">
        <!-- Неоновый бейдж -->
        <div class="inline-flex items-center gap-2 self-start glass-card px-3.5 py-1.5 rounded-full text-xs font-semibold text-[var(--color-accent)] mb-6">
          <i data-lucide="gamepad-2" class="w-4 h-4 text-sky-400"></i>
          <span>Игровой симулятор • 3 минуты</span>
        </div>

        <!-- Заголовок с градиентом -->
        <h1 class="text-3xl sm:text-4xl font-black tracking-tight text-white mb-3 leading-[1.15]">
          Ты бы <span class="text-gradient">дошёл?</span>
        </h1>

        <!-- Подзаголовок -->
        <p class="text-base sm:text-lg text-sky-200/90 font-semibold mb-4 leading-snug">
          Пройди путь своего клиента от первого касания до заявки.
        </p>

        <!-- Описание -->
        <p class="text-xs sm:text-sm text-slate-300 leading-relaxed mb-6">
          Ты отлично знаешь бизнес изнутри. Давай посмотрим со стороны покупателя: где он путается, почему остывает интерес и на каком шаге воронка теряет деньги.
        </p>

        <!-- Инфо-карточки контрольных точек со стеклом -->
        <div class="grid grid-cols-2 gap-3 my-2">
          <div class="glass-card p-3.5 rounded-2xl flex items-center gap-3">
            <div class="w-9 h-9 rounded-xl bg-rose-500/15 border border-rose-500/30 flex items-center justify-center text-lg shrink-0">
              ❤️
            </div>
            <div>
              <div class="font-bold text-xs text-white">Интерес</div>
              <div class="text-[11px] text-slate-400">Гаснет от пауз</div>
            </div>
          </div>

          <div class="glass-card p-3.5 rounded-2xl flex items-center gap-3">
            <div class="w-9 h-9 rounded-xl bg-indigo-500/15 border border-indigo-500/30 flex items-center justify-center text-lg shrink-0">
              🧠
            </div>
            <div>
              <div class="font-bold text-xs text-white">Нагрузка</div>
              <div class="text-[11px] text-slate-400">Растёт от выбора</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Кнопка CTA со свечением -->
      <div class="w-full max-w-md mx-auto pt-3">
        <button id="start-game-btn" class="btn-glow w-full py-4 px-6 text-slate-950 font-extrabold rounded-2xl text-base flex items-center justify-center gap-2 cursor-pointer">
          <span>Стать своим клиентом</span>
          <i data-lucide="arrow-right" class="w-5 h-5"></i>
        </button>
      </div>
    </div>
  `;
}
