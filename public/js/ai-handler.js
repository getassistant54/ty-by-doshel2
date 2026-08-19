/**
 * 🤖 ИИ-интеграция Vibe HTML Kit (Клиентский обработчик Hydra AI)
 */

import { getBridgeState } from './bridge.js';

let cachedAiResult = null;
let isGenerating = false;

export function getCachedAiResult() {
  return cachedAiResult;
}

export function clearAiCache() {
  cachedAiResult = null;
  isGenerating = false;
}

/**
 * Отправка данных сессии в Hydra AI для генерации персонального разбора
 */
export async function sendToAi(userPayload, model) {
  if (cachedAiResult) {
    return cachedAiResult;
  }

  if (isGenerating) {
    return null;
  }

  isGenerating = true;

  const bridge = getBridgeState();
  const notibotUserId = bridge.user?.id || 'guest_user';

  try {
    const response = await fetch('/api/ai/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-notibot-user-id': String(notibotUserId)
      },
      body: JSON.stringify({
        userPayload,
        notibotUserId,
        model: model || undefined
      })
    });

    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      throw new Error(errData.error || `Ошибка сервера (${response.status})`);
    }

    const data = await response.json();
    cachedAiResult = data;
    return data;
  } catch (error) {
    console.error('⚠️ Hydra AI Handler Error:', error);
    throw error;
  } finally {
    isGenerating = false;
  }
}
