/**
 * js/components/goal-screen.js — Экран выбора цели (Премиум Wow-стиль)
 */

import { escapeHtml } from '../utils.js';

export const GOALS = [
  { id: 'buy_service', label: 'Купить услугу или продукт', icon: 'shopping-bag', desc: 'Прямая покупка или заказ на сайте/в боте' },
  { id: 'consultation', label: 'Записаться на консультацию', icon: 'calendar-check', desc: 'Бронь слота или созвон с экспертом' },
  { id: 'lead_magnet', label: 'Скачать лид-магнит / войти в воронку', icon: 'gift', desc: 'Подписка на материалы, чек-лист, гайд' },
  { id: 'manager_chat', label: 'Написать менеджеру в чат', icon: 'message-circle', desc: 'Вопрос по условиям или расчет стоимости' }
];

export function renderGoalScreen({ selectedGoalId = null }) {
  const goalCards = GOALS.map(g => {
    const isSelected = g.id === selectedGoalId;
    return `
      <button data-goal-id="${g.id}" class="goal-option-btn card-press w-full p-4 rounded-2xl border text-left flex items-center justify-between transition-all duration-200 ${
        isSelected
          ? 'option-selected ring-2 ring-sky-400 text-white'
          : 'glass-card text-slate-100 hover:text-white'
      }">
        <div class="flex items-center gap-3.5">
          <div class="w-10 h-10 rounded-xl ${isSelected ? 'bg-sky-500 text-slate-950 shadow-[0_0_12px_#38bdf8]' : 'bg-white/5 text-sky-400 border border-white/10'} flex items-center justify-center text-lg shrink-0 transition-all">
            <i data-lucide="${g.icon}" class="w-5 h-5"></i>
          </div>
          <div>
            <div class="font-bold text-sm sm:text-base leading-snug">${escapeHtml(g.label)}</div>
            <div class="text-xs text-slate-300 font-medium">${escapeHtml(g.desc)}</div>
          </div>
        </div>
        <div class="w-6 h-6 rounded-full border ${isSelected ? 'border-sky-400 bg-sky-400 flex items-center justify-center' : 'border-slate-500'} shrink-0 ml-2">
          ${isSelected ? '<i data-lucide="check" class="w-3.5 h-3.5 text-slate-950 stroke-[3]"></i>' : ''}
        </div>
      </button>
    `;
  }).join('');

  const canContinue = !!selectedGoalId;

  return `
    <div class="flex-1 flex flex-col justify-between p-5 sm:p-6 fade-in safe-top safe-bottom max-w-md mx-auto w-full">
      <div class="pt-2">
        <div class="inline-flex items-center gap-2 glass-card px-3.5 py-1.5 rounded-full text-xs font-bold text-sky-300 mb-4 border-sky-500/30">
          <i data-lucide="crosshair" class="w-4 h-4 text-sky-400"></i>
          <span>Шаг 0 • Точка назначения</span>
        </div>

        <h2 class="text-2xl sm:text-3xl font-black text-white mb-2 leading-tight">
          Какое целевое действие <span class="text-gradient">ты тестируешь?</span>
        </h2>
        <p class="text-xs sm:text-sm text-slate-300 mb-6">
          Выбери действие, до которого клиент должен дойти в твоём проекте:
        </p>

        <div class="flex flex-col gap-3">
          ${goalCards}
        </div>
      </div>

      <div class="pt-4">
        <button id="confirm-goal-btn" ${canContinue ? '' : 'disabled'} class="${canContinue ? 'btn-glow text-slate-950 cursor-pointer' : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-white/5'} w-full py-4 px-6 font-black rounded-2xl text-base flex items-center justify-center gap-2 transition-all">
          <span>Начать маршрут</span>
          <i data-lucide="arrow-right" class="w-5 h-5"></i>
        </button>
      </div>
    </div>
  `;
}
