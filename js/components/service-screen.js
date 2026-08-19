/**
 * js/components/service-screen.js — Экран презентации услуги (Премиум Wow-стиль)
 */

export function renderServiceScreen() {
  return `
    <div class="flex-1 flex flex-col justify-between p-4 sm:p-6 fade-in safe-top safe-bottom max-w-md mx-auto w-full">
      <div class="pt-2 pb-4">
        <div class="inline-flex items-center gap-2 glass-card border-sky-500/30 px-3.5 py-1.5 rounded-full text-xs font-bold text-sky-300 mb-3">
          <i data-lucide="layers" class="w-4 h-4 text-sky-400"></i>
          <span>Архитектура клиентского пути</span>
        </div>

        <h2 class="text-2xl sm:text-3xl font-black text-white mb-2 leading-tight">
          Кто делает путь клиента <span class="text-gradient">бесшовным?</span>
        </h2>

        <p class="text-xs sm:text-sm text-slate-300 mb-4 leading-relaxed">
          MiniApp, чат-бот или сайт — это лишь инструменты. Результат зависит от того, как спроектирован каждый шаг.
        </p>

        <!-- 3 шага архитектора со стеклом -->
        <div class="flex flex-col gap-2.5 mb-4">
          <div class="p-3.5 rounded-2xl glass-card border-sky-500/20 flex items-start gap-3">
            <div class="w-8 h-8 rounded-xl bg-sky-500/20 border border-sky-500/40 flex items-center justify-center font-black text-sky-300 text-xs shrink-0 mt-0.5">1</div>
            <div>
              <div class="text-xs font-bold text-white">Аудит и отсечение лишнего</div>
              <div class="text-[11px] text-slate-300">Находим, где клиенты отваливаются и ждут менеджера.</div>
            </div>
          </div>

          <div class="p-3.5 rounded-2xl glass-card border-indigo-500/20 flex items-start gap-3">
            <div class="w-8 h-8 rounded-xl bg-indigo-500/20 border border-indigo-500/40 flex items-center justify-center font-black text-indigo-300 text-xs shrink-0 mt-0.5">2</div>
            <div>
              <div class="text-xs font-bold text-white">Единая среда в Telegram</div>
              <div class="text-[11px] text-slate-300">Упаковываем каталог, выбор и заявку без лишних вкладок.</div>
            </div>
          </div>

          <div class="p-3.5 rounded-2xl glass-card border-emerald-500/20 flex items-start gap-3">
            <div class="w-8 h-8 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center font-black text-emerald-300 text-xs shrink-0 mt-0.5">3</div>
            <div>
              <div class="text-xs font-bold text-white">Автоматический возврат</div>
              <div class="text-[11px] text-slate-300">Возвращаем отвлекшихся клиентов точно на брошенный шаг.</div>
            </div>
          </div>
        </div>
      </div>

      <!-- CTA кнопки -->
      <div class="flex flex-col gap-2.5 pt-2">
        <button id="open-lead-drawer-btn" class="btn-glow w-full py-4 px-6 text-slate-950 font-black rounded-2xl text-base flex items-center justify-center gap-2 cursor-pointer">
          <span>Разобрать мой маршрут</span>
          <i data-lucide="sparkles" class="w-5 h-5"></i>
        </button>
        <button id="service-restart-btn" class="w-full py-2.5 text-xs text-slate-400 hover:text-white transition-colors">
          Пройти симулятор заново
        </button>
      </div>
    </div>
  `;
}
