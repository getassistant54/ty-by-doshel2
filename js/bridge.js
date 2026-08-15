/**
 * js/bridge.js — Адаптер Notibot Bridge SDK
 */

let _state = { user: null, app: null, colors: null, isInsideNotibot: false };
const _listeners = [];

export function initBridge(onReady) {
  if (!window.notibot) {
    if (onReady) onReady(_state);
    return;
  }

  _state.isInsideNotibot = !!(window.parent && window.parent !== window);

  window.notibot.onUpdate((user, app) => {
    _state.user = user;
    _state.app = app;
    _state.colors = app?.colors || null;
    _applyTheme(_state.colors);

    if (onReady) {
      onReady(_state);
      onReady = null;
    }
    _listeners.forEach(fn => fn(_state));
  });

  // Если Notibot не прислал INIT в течение 350мс, стартуем автономно
  setTimeout(() => {
    if (onReady) {
      onReady(_state);
      onReady = null;
    }
  }, 350);
}

export function getBridgeState() {
  return _state;
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
  const formId = window.NOTIBOT_FORM_ID || null;

  if (formId && window.notibot && typeof window.notibot.submitForm === 'function') {
    const formattedAnswers = Object.entries(payload).map(([k, v]) => ({
      title: k,
      answers: Array.isArray(v) ? v.map(String) : [String(v ?? '')]
    }));
    try {
      const res = await window.notibot.submitForm(formId, formattedAnswers);
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
