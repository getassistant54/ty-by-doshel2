/**
 * js/handlers.js — Совместимость и обработка событий
 */

import { getState, setState, saveAnswer, saveAltAnswer, pushHistory, popHistory, resetGame } from './state.js';
import { calculateMetrics } from './scoring.js';
import { hapticImpact, hapticSelection } from './bridge.js';

export function attachEventListeners({ allScenes, renderApp, drawer }) {
  // app.js делегирует события на корневом элементе app.
}
