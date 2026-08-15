/**
 * js/alternate.js — Выбор проблемных участков и подготовка второго интерактивного акта
 */

import { ALT_EPISODES } from './data/alt-scenes.js';
import { getSceneProblemScore, calculateMetrics, calculateAlternateMetrics } from './scoring.js';

export function getProblemScenes(answers = {}) {
  const sceneKeys = ['first_touch', 'offer_info', 'choice', 'action'];
  const scored = [];

  for (const key of sceneKeys) {
    const opt = answers[key];
    if (opt) {
      const score = getSceneProblemScore(key, opt);
      if (score > 0) {
        scored.push({ sceneId: key, score, originalOption: opt });
      }
    }
  }

  // Сортируем по убыванию проблемности и берем максимум 3
  scored.sort((a, b) => b.score - a.score);
  return scored.slice(0, 3);
}

export function getAlternateEpisodesList(problemScenes = []) {
  const episodes = [];
  for (const item of problemScenes) {
    const ep = ALT_EPISODES[item.sceneId];
    if (ep) {
      episodes.push(ep);
    }
  }
  return episodes;
}

export function getRouteComparisonData(originalAnswers = {}, altAnswers = {}) {
  const origMetrics = calculateMetrics(originalAnswers);
  const altMetrics = calculateAlternateMetrics(originalAnswers, altAnswers);

  const stats = [
    {
      id: 'switches',
      label: 'Переключений между средами',
      original: origMetrics.switches,
      alternate: altMetrics.switches,
      icon: 'refresh-cw'
    },
    {
      id: 'load',
      label: 'Когнитивная нагрузка / выбор',
      original: origMetrics.load,
      alternate: altMetrics.load,
      icon: 'brain'
    },
    {
      id: 'friction',
      label: 'Точек трения и ожидания',
      original: origMetrics.friction,
      alternate: altMetrics.friction,
      icon: 'timer'
    }
  ];

  const origRouteList = Object.values(originalAnswers).map(o => o.routeTitle).filter(Boolean);
  const fullAltAnswers = { ...originalAnswers, ...altAnswers };
  const altRouteList = Object.values(fullAltAnswers).map(o => o.routeTitle).filter(Boolean);

  return {
    origMetrics,
    altMetrics,
    stats,
    origRouteList,
    altRouteList
  };
}
