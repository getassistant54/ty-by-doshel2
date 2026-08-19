/**
 * js/bridge.js — Адаптер Notibot Bridge SDK
 */

import { CONFIG } from './config.js';

let _state = { user: null, app: null, colors: null, isInsideNotibot: false };
const _listeners = [];

export function initBridge(onReady) {
  _state.isInsideNotibot = !!(window.parent && window.parent !== window);

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
  const formId = window.NOTIBOT_FORM_ID || CONFIG?.notibot?.formId || '5o9Qgbk90iwL4vryUdjyGW';
  const isInsideNotibot = !!(window.parent && window.parent !== window);

  // Формируем краткий и понятный текст для поля "Результат диагностики"
  const summaryText = `Диагноз: ${payload.resultType || 'N/A'} | Цель: ${payload.selectedGoal || 'N/A'} | Интерес: ${payload.interest ?? 5}/5 | Нагрузка: ${payload.load ?? 0} | Переходы: ${payload.switches ?? 0} | Трение: ${payload.friction ?? 0}`;

  // Точные 4 вопроса из схемы формы Notibot (formId: 5o9Qgbk90iwL4vryUdjyGW)
  const answers = [
    { title: 'Имя', answers: [payload.name || 'Клиент'] },
    { title: 'Куда написать', answers: [payload.contact || 'Telegram'] },
    { title: 'Что сейчас важнее всего', answers: [payload.leadGoal || 'Больше заявок'] },
    { title: 'Результат диагностики', answers: [summaryText] },
  ];

  if (isInsideNotibot && window.notibot && typeof window.notibot.submitForm === 'function') {
    try {
      const res = await window.notibot.submitForm(formId, answers);
      return { success: true, mode: 'real', data: res };
    } catch (err) {
      console.error('Notibot submit error:', err);
      return { success: false, mode: 'real', error: err };
    }
  }

  // Если симулятор запущен в обычном браузере на ПК вне фрейма Telegram
  console.info('🚀 [Browser Mode] Заявка зафиксирована со схемой Notibot:', { formId, answers, payload });
  await new Promise(r => setTimeout(r, 600));
  return { success: true, mode: 'standalone', answers };
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
