import { SCENES, getOption } from './data/scenes.js';
import { scoreScene, getActionCount, calculateMetrics } from './scoring.js';
import { clamp } from './utils.js';

const MAIN_SCENES = SCENES.filter((scene) => scene.id !== 'return');

const ORIGINAL_CONTEXTS = {
  'search-channel': 'Нужную информацию пришлось искать в канале.',
  website: 'За подробностями пришлось перейти на другой сайт.',
  message: 'Следующий шаг зависел от ответа человека.',
  links: 'Пришлось выбирать нужный путь среди нескольких ссылок.',
  pages: 'Условия пришлось собирать на нескольких страницах.',
  posts: 'Нужные условия пришлось искать среди публикаций.',
  'price-search': 'Стоимость и программу пришлось искать отдельно.',
  ask: 'Чтобы узнать условия, пришлось писать вопрос.',
  consult: 'Чтобы получить информацию, пришлось ждать консультацию.',
  compare: 'Пришлось самостоятельно сравнивать несколько продуктов.',
  catalog: 'Пришлось самостоятельно разбираться в большой линейке.',
  manager: 'Чтобы выбрать вариант, пришлось обращаться к менеджеру.',
  random: 'Понятного ориентира не было — оставалось выбирать наугад.',
  'short-form': 'Перед финалом появилась ещё одна форма.',
  platform: 'Перед финалом пришлось перейти на другую площадку.',
  'write-manager': 'Перед финалом пришлось снова писать менеджеру.',
  'long-form': 'Перед финалом появилась длинная анкета.',
  auth: 'Перед целевым действием пришлось регистрироваться.',
};

export function buildAlternateRoute(answers = {}) {
  return MAIN_SCENES
    .filter((scene) => answers[scene.id])
    .map((scene) => {
      const original = getOption(scene, answers[scene.id]);
      const optId = typeof answers[scene.id] === 'object' ? answers[scene.id].id : answers[scene.id];
      return {
        ...scene.alt,
        sceneId: scene.id,
        originalId: original?.id,
        originalLabel: original?.label,
        originalRoute: original?.route,
        originalContext: ORIGINAL_CONTEXTS[optId] || `На этом месте был лишний этап: «${original?.route || original?.label || ''}».`,
        score: scoreScene(scene, optId),
      };
    })
    .filter((step) => step.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 3);
}

export function calculateFullAlternateMetrics(answers = {}, route = [], alternateAnswers = {}) {
  const metrics = calculateMetrics(answers);
  route.forEach((step) => {
    const scene = MAIN_SCENES.find((item) => item.id === step.sceneId);
    const original = getOption(scene, answers[step.sceneId]);
    const choice = step.options?.find((item) => item.id === alternateAnswers[step.sceneId]);
    if (!choice) return;
    const origEff = original?.effect || original?.effects || {};
    const choiceEff = choice?.effect || choice?.effects || {};
    Object.entries(origEff).forEach(([key, value]) => {
      metrics[key] = (metrics[key] || 0) - value;
    });
    Object.entries(choiceEff).forEach(([key, value]) => {
      metrics[key] = (metrics[key] || 0) + value;
    });
  });
  metrics.interest = clamp(metrics.interest, 0, 5);
  return metrics;
}

export function buildFullAlternateRoute(answers = {}, route = [], alternateAnswers = {}) {
  const replacements = new Map(route.map((step) => [step.sceneId, step]));
  return MAIN_SCENES.map((scene) => {
    const step = replacements.get(scene.id);
    const choice = step?.options.find((item) => item.id === alternateAnswers[scene.id]);
    return choice?.route || getOption(scene, answers[scene.id])?.route;
  }).filter(Boolean);
}

export function getComparison(answers = {}, route = [], alternateAnswers = {}) {
  const firstMetrics = calculateMetrics(answers);
  const alternateMetrics = calculateFullAlternateMetrics(answers, route, alternateAnswers);
  const mainActions = getActionCount(answers) - firstMetrics.friction;
  return {
    first: {
      actions: getActionCount(answers),
      switches: firstMetrics.switches,
      decisions: firstMetrics.load,
      friction: firstMetrics.friction,
    },
    alternate: {
      actions: mainActions + alternateMetrics.friction,
      switches: alternateMetrics.switches,
      decisions: alternateMetrics.load,
      friction: alternateMetrics.friction,
    },
    beforeRoute: MAIN_SCENES.map((scene) => getOption(scene, answers[scene.id])?.route).filter(Boolean),
    afterRoute: buildFullAlternateRoute(answers, route, alternateAnswers),
  };
}
