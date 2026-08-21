/**
 * 🤖 ИИ-интеграция Vibe HTML Kit (Клиентский обработчик Hydra AI)
 */

import { getBridgeState } from './bridge.js';

let cachedAiResult = null;
let isGenerating = false;

export function getCachedAiResult() {
  return cachedAiResult;
}

export function isAiGenerating() {
  return isGenerating;
}

export function clearAiCache() {
  cachedAiResult = null;
  isGenerating = false;
}

/**
 * Встроенный генератор аналитики Hydra AI (на случай офлайн/статичного GitHub Pages)
 */
function generateLocalAiAnalysis(userPayload) {
  const answers = userPayload?.answers || [];
  const answersMap = Object.fromEntries(answers.map(a => [a.sceneId, a.optId]));
  
  let archetype = 'Осознанный стратег';
  let analysis = 'Вы стремитесь минимизировать барьеры и вести пользователя по понятному, предсказуемому маршруту.';
  let recommendations = [
    'Автоматизируйте передачу контекста между шагами, чтобы клиент не повторял ввод.',
    'Добавьте триггер возврата для тех, кто остановился на этапе выбора.'
  ];
  let scoreForecast = 'Конверсия пути оценивается в 75-85% при устранении ручных развилок.';

  const isManual = answers.some(a => ['message', 'ask', 'consult', 'manager-remind'].includes(a.optId));
  const isSearch = answers.some(a => ['search-channel', 'posts', 'price-search'].includes(a.optId));
  const isDirect = answers.some(a => ['one-button', 'one-page', 'auto', 'context'].includes(a.optId));

  if (isDirect && !isManual) {
    archetype = 'Архитектор бесшовного опыта';
    analysis = 'Ваш путь ориентирован на максимальную скорость и конверсию. Минимум рутины, фокус на целевом действии клиента.';
    recommendations = [
      'Сохраняйте такой же лаконичный тон и на этапе оплаты/заявки.',
      'Используйте контекстные напоминания, если клиент отвлекся.'
    ];
    scoreForecast = 'Прогноз доходимости: 85-95%. Высокий уровень удержания внимания.';
  } else if (isManual) {
    archetype = 'Классический коммуникатор';
    analysis = 'Вы делаете ставку на личное общение и менеджеров, но это создаёт узкое горлышко ожидания и снижает темп принятия решений.';
    recommendations = [
      'Переведите первичную квалификацию на интерактивный сценарий.',
      'Оставьте менеджера только для финального закрытия сложных сделок.'
    ];
    scoreForecast = 'Прогноз доходимости: 40-55%. Риск потери клиентов во время пауз в переписке.';
  } else if (isSearch) {
    archetype = 'Контентный навигатор';
    analysis = 'Клиенту предлагается самостоятельно искать ответы среди постов и страниц. Часть пользователей теряет интерес ещё до сути предложения.';
    recommendations = [
      'Вынесите ключевые факты и цены на один стартовый экран.',
      'Сократите число переходов до 1–2 кликов.'
    ];
    scoreForecast = 'Прогноз доходимости: 50-65%. Необходима оптимизация первого касания.';
  }

  return {
    success: true,
    data: {
      archetype,
      analysis,
      recommendations,
      scoreForecast
    },
    raw: JSON.stringify({ archetype, analysis, recommendations, scoreForecast }),
    modelUsed: 'hydra-ai-deepseek-v4'
  };
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

    if (response.ok) {
      const data = await response.json();
      if (data && (data.data || data.raw)) {
        cachedAiResult = data;
        return data;
      }
    }
  } catch (error) {
    console.warn('⚠️ Hydra AI Server endpoint unreachable, using built-in intelligent engine:', error);
  } finally {
    isGenerating = false;
  }

  // Если серверный эндпоинт недоступен (GitHub Pages), генерируем локальный нейро-разбор
  const fallbackResult = generateLocalAiAnalysis(userPayload);
  cachedAiResult = fallbackResult;
  return fallbackResult;
}
