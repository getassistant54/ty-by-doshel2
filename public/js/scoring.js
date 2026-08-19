import { SCENES, getOption } from './data/scenes.js';
import { clamp } from './utils.js';

const BASE_METRICS = {
  interest: 5,
  load: 0,
  switches: 0,
  friction: 0,
  returnability: 0,
  search: 0,
  manual: 0,
};

export function calculateMetrics(answers = {}) {
  const metrics = { ...BASE_METRICS };
  SCENES.filter((scene) => scene.id !== 'return').forEach((scene) => {
    const selected = getOption(scene, answers[scene.id]);
    const effect = selected?.effect || selected?.effects || {};
    Object.entries(effect).forEach(([key, value]) => {
      metrics[key] = (metrics[key] || 0) + value;
    });
  });
  metrics.interest = clamp(metrics.interest, 0, 5);
  return metrics;
}

export function getRoute(answers = {}) {
  return SCENES.filter((scene) => scene.id !== 'return')
    .map((scene) => getOption(scene, answers[scene.id])?.route || getOption(scene, answers[scene.id])?.routeTitle).filter(Boolean);
}

export function getRecovery(answers = {}) {
  const scene = SCENES.find((item) => item.id === 'return');
  const option = getOption(scene, answers.return);
  return option ? { id: option.id, label: option.route, effect: option.effect || option.effects } : null;
}

export function shouldShowPause(answers = {}) {
  const { load, switches, friction, interest } = calculateMetrics(answers);
  return load + switches + friction >= 5 || interest <= 3;
}

export function getActionCount(answers = {}) {
  const mainCount = Object.keys(answers).filter((id) => id !== 'return').length;
  return mainCount + calculateMetrics(answers).friction;
}

export function scoreScene(scene, optionId) {
  const selected = getOption(scene, optionId);
  const effect = selected?.effect || selected?.effects || {};
  return (effect.load || 0) + (effect.switches || 0) + (effect.friction || 0)
    + (effect.search || 0) + (effect.manual || 0) - (effect.returnability || 0);
}
