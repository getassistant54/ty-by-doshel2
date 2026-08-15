/**
 * js/scoring.js — Подсчёт метрик основного и альтернативного маршрутов
 */

export function calculateMetrics(answers = {}) {
  const metrics = {
    interest: 5,
    load: 0,
    switches: 0,
    friction: 0,
    manual: 0,
    actions: 0
  };

  const mainSceneKeys = ['first_touch', 'offer_info', 'choice', 'action'];

  for (const sceneId of mainSceneKeys) {
    const opt = answers[sceneId];
    if (opt) {
      metrics.actions += 1;
      const eff = opt.effects || {};
      metrics.load += eff.load || 0;
      metrics.switches += eff.switches || 0;
      metrics.friction += eff.friction || 0;
      metrics.manual += eff.manual || 0;
      metrics.interest += eff.interest || 0;
    }
  }

  metrics.interest = Math.max(0, Math.min(5, metrics.interest));
  metrics.load = Math.max(0, metrics.load);
  metrics.switches = Math.max(0, metrics.switches);
  metrics.friction = Math.max(0, metrics.friction);
  metrics.manual = Math.max(0, metrics.manual);

  return metrics;
}

export function getSceneProblemScore(sceneId, option) {
  if (!option || !option.effects) return 0;
  const { load = 0, switches = 0, friction = 0, manual = 0, interest = 0 } = option.effects;
  return (load * 1.2) + (switches * 1.5) + (friction * 1.5) + (manual * 1.5) + (interest < 0 ? 1 : 0);
}

export function calculateAlternateMetrics(originalAnswers = {}, altAnswers = {}) {
  const mergedAnswers = { ...originalAnswers };

  for (const [sceneId, altOpt] of Object.entries(altAnswers)) {
    if (altOpt) {
      mergedAnswers[sceneId] = altOpt;
    }
  }

  return calculateMetrics(mergedAnswers);
}
