/**
 * js/components/hero-screen.js — Главный экран симулятора
 */

export function renderHeroScreen() {
  return `
    <div class="flex-1 flex flex-col justify-between p-6 fade-in safe-top safe-bottom">
      <div class="flex-1 flex flex-col justify-center max-w-md mx-auto w-full py-8">
        <!-- Бейдж -->
        <div class="inline-flex items-center gap-2 self-start bg-[var(--color-surface)] border border-[var(--color-border)] px-3 py-1.5 rounded-full text-xs font-semibold text-[var(--color-accent)] mb-6 shadow-sm">
          <i data-lucide="gamepad-2" class="w-4 h-4"></i>
          <span>Игровой симулятор • ~3 минуты</span>
        </div>

        <!-- Заголовок -->
        <h1 class="text-3xl sm:text-4xl font-extrabold tracking-tight text-white mb-4 leading-tight">
          Ты бы дошёл?
        </h1>

        <!-- Подзаголовок -->
        <p class="text-base sm:text-lg text-[var(--color-accent)] font-medium mb-4 leading-snug">
          Попробуй пройти путь собственного клиента от первого интереса до целевого действия.
        </p>

        <!-- Описание -->
        <p class="text-sm text-[var(--color-muted)] leading-relaxed mb-6">
          Ты знаешь свой бизнес изнутри. Сейчас посмотрим на него с другой стороны: где клиент спотыкается, где теряется интерес и почему путь кажется длиннее, чем задумывалось.
        </p>

        <!-- Инфо-карточки контрольных точек -->
        <div class="grid grid-cols-2 gap-2.5 my-2">
          <div class="bg-[var(--color-surface)] border border-[var(--color-border)] p-3 rounded-xl flex items-center gap-2.5">
            <span class="text-xl">❤️</span>
            <div class="text-xs">
              <div class="font-bold text-slate-100">Интерес</div>
              <div class="text-[var(--color-muted)] text-[11px]">Теряется от пауз</div>
            </div>
          </div>
          <div class="bg-[var(--color-surface)] border border-[var(--color-border)] p-3 rounded-xl flex items-center gap-2.5">
            <span class="text-xl">🧠</span>
            <div class="text-xs">
              <div class="font-bold text-slate-100">Нагрузка</div>
              <div class="text-[var(--color-muted)] text-[11px]">Растёт от выбора</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Кнопка CTA -->
      <div class="w-full max-w-md mx-auto pt-4">
        <button id="start-game-btn" class="btn-press w-full py-4 px-6 bg-[var(--color-accent)] hover:bg-[var(--color-accent-hover)] text-slate-950 font-bold rounded-2xl text-base flex items-center justify-center gap-2 shadow-lg shadow-sky-500/20 transition-all">
          <span>Стать клиентом</span>
          <i data-lucide="arrow-right" class="w-5 h-5"></i>
        </button>
      </div>
    </div>
  `;
}
