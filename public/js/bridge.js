/**
 * js/bridge.js — Адаптер Notibot Bridge SDK
 */

import { CONFIG } from './config.js';

let _state = { user: null, app: null, colors: null, isInsideNotibot: false };
const _listeners = [];

export function initBridge(onReady) {
  if (window.notibot?.onUpdate) {
    window.notibot.onUpdate((user, app) => {
      _state.user = user;
      _state.app = app;
      _state.colors = app?.colors || null;
      _applyTheme(_state.colors);

      if (typeof onReady === 'function') {
        onReady(_state);
        onReady = null;
      }
      _listeners.forEach(fn => fn(_state));
    });
  }

  _state.isInsideNotibot = !!(window.parent && window.parent !== window);

  if (typeof onReady === 'function') {
    setTimeout(() => {
      if (onReady) {
        onReady(_state);
        onReady = null;
      }
    }, 100);
  }
}

export function getBridgeState() {
  return _state;
}

export function hasIdentifiedNotibotUser() {
  return Boolean(_state.user?.id);
}

export function haptic(style = 'light') {
  hapticImpact(style);
}

export function hapticImpact(style = 'light') {
  if (window.notibot?.hapticImpact) {
    window.notibot.hapticImpact(style);
  }
}

export function hapticSelection() {
  if (window.notibot?.hapticSelection) {
    window.notibot.hapticSelection();
  }
}

export async function submitToNotibot(payload) {
  const formId = window.NOTIBOT_FORM_ID || CONFIG?.notibot?.formId || null;

  if (formId && window.notibot && typeof window.notibot.submitForm === 'function') {
    const summaryText = `Диагноз: ${payload.resultType || 'N/A'} | Цель: ${payload.selectedGoal || 'N/A'} | Интерес: ${payload.interest}/5 | Нагрузка: ${payload.load} | Переходы: ${payload.switches} | Трение: ${payload.friction}`;

    const answers = [
      { title: 'Имя', answers: payload.name ? [payload.name] : [] },
      { title: 'Куда написать', answers: payload.contact ? [payload.contact] : [] },
      { title: 'Контакт', answers: payload.contact ? [payload.contact] : [] },
      { title: 'Что сейчас важнее всего', answers: payload.leadGoal ? [payload.leadGoal] : [] },
      { title: 'Цель разбора', answers: payload.leadGoal ? [payload.leadGoal] : [] },
      { title: 'Результат диагностики', answers: [summaryText] },
      { title: 'Детали', answers: [JSON.stringify(payload)] },
    ];

    try {
      const res = await window.notibot.submitForm(formId, answers);
      return { success: true, mode: 'real', data: res };
    } catch (err) {
      console.error('Notibot submit error:', err);
      return { success: false, mode: 'real', error: err };
    }
  }

  console.log('🚀 [DEMO / PROTOTYPE] Payload submitted:', payload);
  await new Promise(r => setTimeout(r, 600));
  return { success: true, mode: 'prototype', payload };
}

function _applyTheme(colors) {
  if (!colors) return;
  const r = document.documentElement;
  if (colors.background) r.style.setProperty('--color-bg', colors.background);
  if (colors.surface) r.style.setProperty('--color-surface', colors.surface);
  if (colors.textPrimary) r.style.setProperty('--color-text', colors.textPrimary);
  if (colors.textSecondary) r.style.setProperty('--color-muted', colors.textSecondary);
  if (colors.primaryMain) r.style.setProperty('--color-accent', colors.primaryMain);
}
