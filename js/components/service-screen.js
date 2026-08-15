/**
 * js/components/service-screen.js — Смысловой блок архитектора клиентского пути и главный CTA
 */

export function renderServiceScreen() {
  return `
    <div class="flex-1 flex flex-col justify-between p-4 sm:p-6 fade-in safe-top safe-bottom max-w-md mx-auto w-full">
      <div class="pt-2 pb-4">
        <div class="inline-flex items-center gap-1.5 bg-[var(--color-surface)] border border-[var(--color-border)] px-3 py-1 rounded-full text-xs font-semibold text-[var(--color-accent)] mb-3">
          <i data-lucide="compass" class="w-3.5 h-3.5"></i>
          <span>Архитектура клиентского пути</span>
        </div>

        <h2 class="text-2xl sm:text-3xl font-extrabold text-white mb-3 leading-tight">
          Вот этим и занимается архитектор клиентского пути
        </h2>

        <p class="text-xs sm:text-sm text-slate-300 mb-4 leading-relaxed">
          Главная ценность — не просто нарисовать страницы или собрать бота, а спроектировать путь без потерь:
        </p>

        <!-- Список компетенций -->
        <div class="space-y-2 mb-4 text-xs sm:text-sm text-slate-200">
          <div class="flex items-start gap-2.5 p-2.5 rounded-xl bg-[var(--color-surface)] border border-[var(--color-border)]">
            <span class="text-base">📍</span>
            <span>Понять, откуда приходит человек и с каким ожиданием</span>
          </div>
          <div class="flex items-start gap-2.5 p-2.5 rounded-xl bg-[var(--color-surface)] border border-[var(--color-border)]">
            <span class="text-base">✂️</span>
            <span>Убрать лишние промежуточные переходы и рутину</span>
          </div>
          <div class="flex items-start gap-2.5 p-2.5 rounded-xl bg-[var(--color-surface)] border border-[var(--color-border)]">
            <span class="text-base">🤖</span>
            <span>Автоматизировать возврат тех, кто отвлёкся на полпути</span>
          </div>
        </div>

        <p class="text-xs text-[var(--color-muted)] leading-relaxed p-3 rounded-xl bg-[var(--color-surface)]/50 border border-[var(--color-border)]">
          И только после этого выбирается инструмент реализации. Если маршрут проходит через Telegram — отличным решением может стать Telegram MiniApp.
        </p>
      </div>

      <!-- Главная CTA кнопка -->
      <div class="pt-2 flex flex-col gap-2.5">
        <button id="open-lead-drawer-btn" class="btn-press w-full py-4 px-6 bg-[var(--color-accent)] hover:bg-[var(--color-accent-hover)] text-slate-950 font-bold rounded-2xl text-base flex items-center justify-center gap-2 shadow-lg shadow-sky-500/20 transition-all">
          <span>Показать, как упростить мой путь</span>
          <i data-lucide="sparkles" class="w-5 h-5"></i>
        </button>
        <button id="service-restart-btn" class="py-2 text-xs text-[var(--color-muted)] hover:text-white transition-colors">
          Пройти симулятор заново
        </button>
      </div>
    </div>
  `;
}
