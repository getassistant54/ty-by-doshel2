import { getBridgeState, submitToNotibot, hapticImpact, hapticSelection } from '../bridge.js';
import { calculateMetrics } from '../scoring.js';
import { determineResult } from '../results.js';
import { getRecoveryInsight } from '../insights.js';
import { getRecovery } from '../scoring.js';
import { initIcons } from '../utils.js';

const LEAD_GOALS = [
  'Больше заявок',
  'Меньше ручной работы',
  'Упростить выбор продукта',
  'Собрать путь в одном месте',
  'Лучше видеть действия клиентов',
  'Другое',
];

export function renderLeadDrawer() {
  const bridge = getBridgeState ? getBridgeState() : {};
  const isIdentified = Boolean(bridge.user?.id);

  return `
    <div id="lead-drawer" class="drawer" aria-hidden="true">
      <div class="drawer-backdrop" data-drawer-close></div>
      <section class="drawer-panel" role="dialog" aria-modal="true" aria-labelledby="drawer-title">
        <div class="drawer-handle"></div>
        <button class="back-btn absolute top-4 right-4" data-drawer-close aria-label="Закрыть"><i data-lucide="x" class="w-5 h-5"></i></button>
        <div class="eyebrow">Персональный разбор</div>
        <h2 id="drawer-title" class="text-2xl font-extrabold tracking-tight mt-2 pr-12">Хочешь маршрут уже под свой проект?</h2>
        <p class="muted text-sm leading-relaxed mt-3">Покажу, какие этапы можно убрать, объединить или автоматизировать.</p>

        <form id="lead-form" novalidate>
          <label class="field-label">Имя
            <input class="field" name="name" id="lead-name" autocomplete="name" required placeholder="Как к тебе обращаться?">
          </label>
          <label class="field-label" data-contact-field ${isIdentified ? 'hidden' : ''}>
            <span>Куда написать?</span>
            <input class="field" name="contact" id="lead-contact" autocomplete="off" ${isIdentified ? '' : 'required'} placeholder="Telegram, email или телефон">
          </label>
          <label class="field-label">Что сейчас важнее всего?
            <select class="field" name="leadGoal" id="lead-goal" required>
              <option value="">Выбрать</option>
              ${LEAD_GOALS.map((goal) => `<option value="${goal}">${goal}</option>`).join('')}
            </select>
          </label>
          <div id="form-message" class="form-message muted" role="status"></div>
          <button class="primary-btn mt-2" type="submit" id="lead-submit-btn">Получить разбор</button>
        </form>
      </section>
    </div>
  `;
}

export function setupLeadDrawer(rootEl, getState) {
  const drawer = rootEl.querySelector('#lead-drawer');
  const contactField = rootEl.querySelector('[data-contact-field]');
  const contactInput = rootEl.querySelector('#lead-contact');
  const submitButton = rootEl.querySelector('#lead-submit-btn');
  const form = rootEl.querySelector('#lead-form');
  const message = rootEl.querySelector('#form-message');
  let lastFocus = null;

  const close = () => {
    drawer.classList.remove('drawer-visible');
    drawer.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    hapticSelection();
    lastFocus?.focus();
  };

  const handleKeydown = (event) => {
    if (!drawer.classList.contains('drawer-visible')) return;
    if (event.key === 'Escape') return close();
    if (event.key !== 'Tab') return;
    const focusable = [...drawer.querySelectorAll('button:not(:disabled), input:not(:disabled), select:not(:disabled)')]
      .filter((element) => !element.hidden);
    const first = focusable[0];
    const last = focusable.at(-1);
    if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
    if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
  };

  rootEl.querySelectorAll('[data-drawer-close]').forEach((button) => button.addEventListener('click', close));
  document.addEventListener('keydown', handleKeydown);

  form?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const st = typeof getState === 'function' ? getState() : {};
    const answers = st.answers || {};
    const metrics = calculateMetrics(answers);
    const result = determineResult(metrics);
    const recovery = getRecovery ? getRecovery(answers) : null;
    const recoveryInsight = getRecoveryInsight(recovery);

    const nameVal = form.querySelector('#lead-name')?.value.trim();
    const contactVal = form.querySelector('#lead-contact')?.value.trim();
    const leadGoalVal = form.querySelector('#lead-goal')?.value;

    if (!nameVal) {
      message.textContent = 'Пожалуйста, укажите имя';
      message.className = 'form-message text-rose-400';
      return;
    }

    const aiResult = (await import('../ai-handler.js')).getCachedAiResult();

    const payload = {
      name: nameVal,
      contact: contactVal || 'Telegram',
      leadGoal: leadGoalVal,
      selectedGoal: st.goalId,
      resultType: result.id,
      aiArchetype: aiResult?.data?.archetype || 'N/A',
      aiAnalysis: aiResult?.data?.analysis || 'N/A',
      interest: metrics.interest,
      load: metrics.load,
      switches: metrics.switches,
      friction: metrics.friction,
      recoveryId: recovery?.id || 'unknown',
      returnability: recovery?.effect?.returnability || 0,
    };

    submitButton.disabled = true;
    submitButton.textContent = 'Отправляем...';
    message.textContent = '';

    const res = await submitToNotibot(payload);

    if (res.mode === 'prototype') {
      message.className = 'form-message text-amber-300';
      message.textContent = '✅ Демо-режим: заявка зафиксирована.';
    } else if (res.success) {
      message.className = 'form-message text-emerald-300';
      message.textContent = '✅ Заявка отправлена! Скоро свяжемся.';
    } else {
      message.className = 'form-message text-rose-400';
      message.textContent = '❌ Ошибка отправки. Попробуйте позже.';
    }

    submitButton.textContent = 'Отправлено';
    hapticImpact('light');
    setTimeout(close, 2000);
  });

  return {
    open() {
      lastFocus = document.activeElement;
      drawer.classList.add('drawer-visible');
      drawer.setAttribute('aria-hidden', 'false');
      if (submitButton) submitButton.disabled = false;
      if (submitButton) submitButton.textContent = 'Получить разбор';
      if (message) message.textContent = '';
      document.body.style.overflow = 'hidden';
      hapticImpact('medium');
      drawer.querySelector('input')?.focus();
      initIcons();
    },
    close,
    form,
    message,
  };
}
