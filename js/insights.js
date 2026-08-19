import { SCENES_PART_ONE } from './data/scenes-one.js';
import { SCENE_ACTION, SCENE_RETURN } from './data/scenes-two.js';

const ALL_SCENES = [...SCENES_PART_ONE, SCENE_ACTION, SCENE_RETURN];

function getOption(scene, optIdOrObj) {
  if (!scene || !optIdOrObj) return null;
  const id = typeof optIdOrObj === 'object' ? optIdOrObj.id : optIdOrObj;
  return scene.options?.find((o) => o.id === id) || null;
}

const mainSelections = (answers) => ALL_SCENES
  .filter((scene) => scene.id !== 'return')
  .map((scene) => getOption(scene, answers[scene.id]))
  .filter(Boolean);

export function getPersonalInsight(answers = {}, metrics = {}, result = {}) {
  const choices = mainSelections(answers);
  const problemKeys = {
    'too-many-doors': 'load',
    'tab-quest': 'switches',
    operator: 'manual',
    'where-was-it': 'search',
  };
  const key = problemKeys[result.id];
  const problemRoute = key
    ? choices.filter((choice) => (choice.effects?.[key] || choice.effect?.[key] || 0) > 0).map((choice) => choice.route || choice.routeTitle || choice.label)
    : [];

  if (problemRoute.length) {
    return `В твоём маршруте это особенно заметно на этапах: ${problemRoute.join(' → ')}.`;
  }
  if (result.id === 'seamless' && (metrics.friction || 0) > 0) {
    const frictionPoint = choices.find((choice) => (choice.effects?.friction || choice.effect?.friction))?.route;
    if (frictionPoint) {
      return `Основной путь уже логичен. Самая заметная точка для улучшения — ${frictionPoint.toLowerCase()}.`;
    }
  }
  return 'Основной путь выглядит логично. Здесь нужна скорее точечная оптимизация, а не большая перестройка.';
}

export function getRecoveryInsight(recovery) {
  const insights = {
    lost: { tone: 'warning', title: 'Клиент теряется', text: 'Если человек отвлечётся, маршрут сейчас никак его не возвращает.' },
    unknown: { tone: 'warning', title: 'Сценарий возврата не определён', text: 'После остановки клиента следующий шаг для бизнеса пока неясен.' },
    'manager-remind': { tone: 'manual', title: 'Возврат остаётся ручным', text: 'Команде приходится самостоятельно замечать остановку и возвращать человека.' },
    broadcast: { tone: 'neutral', title: 'Есть общий возврат', text: 'Рассылка может напомнить о бизнесе, но не возвращает к конкретному шагу.' },
    auto: { tone: 'positive', title: 'Маршрут умеет напоминать', text: 'Если клиент остановится, автоматическое сообщение помогает вернуть его.' },
    context: { tone: 'positive', title: 'Контекст сохраняется', text: 'Клиента можно вернуть именно к тому шагу, где он остановился.' },
  };
  const recId = recovery?.id || recovery?.recoveryId || 'unknown';
  return insights[recId] || insights.unknown;
}

export function getPersonalTips(result = {}, recoveryInsight = {}) {
  const tips = result.tips || result.fixes || [];
  if (result.id !== 'seamless' || recoveryInsight.tone !== 'positive') return tips;
  return tips.filter((tip) => !tip.toLowerCase().includes('возврат'));
}
