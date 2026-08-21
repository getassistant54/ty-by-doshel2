/**
 * js/bridge.js — Адаптер Notibot Bridge SDK (по стандарту vibe-html-kit)
 */

import { CONFIG } from './config.js';

let _state = { user: null, app: null, colors: null, isInsideNotibot: false };
const _listeners = [];

export function initBridge(onReady) {
  _state.isInsideNotibot = !!(window.parent && window.parent !== window);

  if (window.notibot?.onUpdate) {
    window.notibot.onUpdate((user, app) => {
      _state.user = user || {};
      _state.app = app || {};
      _state.colors = app?.colors || null;
      // Сохраняем авторскую цветовую палитру симулятора (Codex dark theme),
      // чтобы сторонние цвета Telegram/бота не ломали контрастность заголовков и кнопок.

      if (typeof onReady === 'function') {
        onReady(_state);
        onReady = null;
      }
      _listeners.forEach((fn) => fn(_state));
    });
  }

  // Резервный таймер инициализации для автономного запуска
  if (typeof onReady === 'function') {
    setTimeout(() => {
      if (onReady) {
        onReady(_state);
        onReady = null;
      }
    }, 150);
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

/**
 * Отправка формы в Notibot в строгом соответствии с SDK-reference
 * @param {Object} payload
 * @returns {Promise<{success: boolean, mode: string, data?: any, error?: any}>}
 */
export async function submitToNotibot(payload) {
  const formId = window.NOTIBOT_FORM_ID || CONFIG?.notibot?.formId || '5o9Qgbk90iwL4vryUdjyGW';
  const isInsideNotibot = !!(window.parent && window.parent !== window);

  const summaryText = `Диагноз: ${payload.resultType || 'N/A'} | Цель: ${payload.selectedGoal || 'N/A'} | Интерес: ${payload.interest ?? 5}/5 | Нагрузка: ${payload.load ?? 0} | Переходы: ${payload.switches ?? 0} | Трение: ${payload.friction ?? 0}`;

  // Строгое сопоставление вопросов по схеме формы Notibot (formId: 5o9Qgbk90iwL4vryUdjyGW)
  const answers = [
    {
      title: 'Имя',
      answers: payload.name && payload.name.trim() ? [payload.name.trim()] : [],
    },
    {
      title: 'Куда написать',
      answers: payload.contact && payload.contact.trim() ? [payload.contact.trim()] : (_state.user?.id ? [`tg_id: ${_state.user.id}`] : ['Telegram']),
    },
    {
      title: 'Что сейчас важнее всего',
      answers: payload.leadGoal && payload.leadGoal.trim() ? [payload.leadGoal.trim()] : ['Больше заявок'],
    },
    {
      title: 'Результат диагностики',
      answers: [summaryText],
    },
  ];

  // 1. Если симулятор открыт внутри Telegram / Notibot фрейма
  if (isInsideNotibot && window.notibot && typeof window.notibot.submitForm === 'function') {
    try {
      const result = await Promise.race([
        window.notibot.submitForm(formId, answers),
        new Promise((_, reject) => setTimeout(() => reject(new Error('Превышено время ожидания ответа от Notibot')), 7000))
      ]);
      return { success: true, mode: 'real', data: result };
    } catch (error) {
      console.error('Notibot submit error:', error);
      return {
        success: false,
        mode: 'real',
        error: error.message || 'Ошибка отправки формы в Notibot',
        code: error.code,
      };
    }
  }

  // 2. Если симулятор открыт в браузере вне Telegram
  console.info('🚀 [Browser Standalone] Форма готова. Данные для отправки:', { formId, answers });
  await new Promise((r) => setTimeout(r, 600));
  return {
    success: true,
    mode: 'standalone',
    errorNotice: 'Запущено в браузере вне Telegram. Для отправки в Notibot откройте ссылку внутри Telegram-бота.',
    data: answers,
  };
}
