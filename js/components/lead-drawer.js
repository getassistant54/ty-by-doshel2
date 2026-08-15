/**
 * js/components/lead-drawer.js — Bottom Sheet Лид-форма
 */

import { getBridgeState, submitToNotibot, hapticImpact, hapticSelection } from '../bridge.js';
import { calculateMetrics } from '../scoring.js';
import { determineResult, getRecoveryData } from '../results.js';
import { initIcons } from '../utils.js';

export function renderLeadDrawer() {
  const bridge = getBridgeState();
  const isContactRequired = !bridge.user?.id;

  return `
    <div id="lead-drawer" class="drawer-overlay">
      <div id="drawer-backdrop" class="drawer-backdrop"></div>
      <div class="drawer-sheet">
        <div class="w-10 h-1 bg-slate-600 rounded-full mx-auto mb-4 cursor-pointer"></div>
        <div class="flex items-center justify-between mb-3">
          <h3 class="text-lg sm:text-xl font-bold text-white">Разбор твоего маршрута</h3>
          <button id="drawer-close-btn" class="p-1 text-slate-400 hover:text-white rounded-lg">
            <i data-lucide="x" class="w-5 h-5"></i>
          </button>
        </div>

        <p class="text-xs text-[var(--color-muted)] mb-4">
          Посмотрю на твою реальную воронку и покажу, какие этапы можно объединить, убрать или автоматизировать.
        </p>

        <form id="lead-form" class="space-y-3">
          <div>
            <label class="block text-xs font-semibold text-slate-300 mb-1">Твоё имя</label>
            <input type="text" id="lead-name" required placeholder="Как к тебе обращаться?"
                   class="w-full px-3.5 py-2.5 rounded-xl bg-[var(--color-bg)] border border-[var(--color-border)] text-sm text-white focus:border-[var(--color-accent)] focus:outline-none" />
          </div>

          <div>
            <label class="block text-xs font-semibold text-slate-300 mb-1">
              Куда отправить разбор? ${isContactRequired ? '<span class="text-rose-400">*</span>' : '(опционально)'}
            </label>
            <input type="text" id="lead-contact" ${isContactRequired ? 'required' : ''} placeholder="@username в Telegram или телефон"
                   class="w-full px-3.5 py-2.5 rounded-xl bg-[var(--color-bg)] border border-[var(--color-border)] text-sm text-white focus:border-[var(--color-accent)] focus:outline-none" />
          </div>

          <div>
            <label class="block text-xs font-semibold text-slate-300 mb-1">Что сейчас важнее всего?</label>
            <select id="lead-goal" class="w-full px-3.5 py-2.5 rounded-xl bg-[var(--color-bg)] border border-[var(--color-border)] text-sm text-white focus:border-[var(--color-accent)] focus:outline-none">
              <option value="more_leads">Больше заявок без потерь</option>
              <option value="less_manual">Меньше ручной работы менеджеров</option>
              <option value="easier_choice">Упростить выбор продукта для клиента</option>
              <option value="all_in_one">Собрать клиентский путь в одном месте</option>
              <option value="better_analytics">Лучше видеть действия клиентов</option>
              <option value="other">Другая задача</option>
            </select>
          </div>

          <div id="lead-status" class="hidden text-xs p-3 rounded-xl"></div>

          <button type="submit" id="lead-submit-btn" class="btn-press w-full mt-2 py-3.5 px-5 bg-[var(--color-accent)] hover:bg-[var(--color-accent-hover)] text-slate-950 font-bold rounded-xl text-sm shadow-md transition-all">
            Получить разбор
          </button>
        </form>
      </div>
    </div>
  `;
}

export function setupLeadDrawer(rootEl, getState) {
  const overlay = rootEl.querySelector('#lead-drawer');
  const backdrop = rootEl.querySelector('#drawer-backdrop');
  const closeBtn = rootEl.querySelector('#drawer-close-btn');
  const form = rootEl.querySelector('#lead-form');
  const statusEl = rootEl.querySelector('#lead-status');
  const submitBtn = rootEl.querySelector('#lead-submit-btn');

  const close = () => {
    overlay.classList.remove('active');
    document.body.style.overflow = '';
    hapticSelection();
  };

  const open = () => {
    overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
    hapticImpact('medium');
    initIcons();
  };

  backdrop.addEventListener('click', close);
  closeBtn.addEventListener('click', close);

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const st = getState();
    const metrics = calculateMetrics(st.answers);
    const result = determineResult(metrics, st.answers);
    const recovery = getRecoveryData(st.answers);

    const payload = {
      name: form.querySelector('#lead-name').value.trim(),
      contact: form.querySelector('#lead-contact').value.trim(),
      leadGoal: form.querySelector('#lead-goal').value,
      selectedGoal: st.goalId,
      resultType: result.id,
      interest: metrics.interest,
      load: metrics.load,
      switches: metrics.switches,
      friction: metrics.friction,
      recoveryId: recovery.recoveryId,
      returnability: recovery.returnability
    };

    submitBtn.disabled = true;
    submitBtn.textContent = 'Отправляем...';

    const res = await submitToNotibot(payload);

    statusEl.classList.remove('hidden');
    if (res.mode === 'prototype') {
      statusEl.className = 'text-xs p-3 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/30';
      statusEl.textContent = '✅ Демо-режим: Данные собраны и выведены в консоль.';
    } else if (res.success) {
      statusEl.className = 'text-xs p-3 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/30';
      statusEl.textContent = '✅ Заявка успешно отправлена! Скоро свяжемся.';
    } else {
      statusEl.className = 'text-xs p-3 rounded-xl bg-rose-500/20 text-rose-300 border border-rose-500/30';
      statusEl.textContent = '❌ Не удалось отправить. Попробуйте позже.';
    }

    submitBtn.textContent = 'Отправлено';
    hapticImpact('light');
    setTimeout(close, 2200);
  });

  return { open, close };
}
