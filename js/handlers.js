/**
 * js/handlers.js — Обработчики событий и переходов симулятора
 */

import { getState, setState, saveAnswer, saveAltAnswer, pushHistory, popHistory, resetGame } from './state.js';
import { calculateMetrics } from './scoring.js';
import { getProblemScenes, getAlternateEpisodesList } from './alternate.js';
import { hapticImpact, hapticSelection } from './bridge.js';

export function attachEventListeners({ allScenes, renderApp, drawer }) {
  const st = getState();

  document.getElementById('hud-back-btn')?.addEventListener('click', () => {
    const prev = popHistory();
    if (prev) { setState(prev); hapticSelection(); renderApp(); }
  });

  document.getElementById('start-game-btn')?.addEventListener('click', () => {
    pushHistory({ view: 'hero' });
    setState({ view: 'goal' });
    hapticImpact('light');
    renderApp();
  });

  document.querySelectorAll('.goal-option-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      setState({ goalId: btn.dataset.goalId });
      hapticSelection();
      renderApp();
    });
  });

  document.getElementById('confirm-goal-btn')?.addEventListener('click', () => {
    pushHistory({ view: 'goal', goalId: st.goalId });
    setState({ view: 'scene', sceneIndex: 0 });
    hapticImpact('medium');
    renderApp();
  });

  document.querySelectorAll('.scene-option-btn').forEach(btn => {
    btn.addEventListener('click', () => handleSceneOption(btn.dataset.optionId, allScenes, renderApp));
  });

  document.getElementById('pause-continue-btn')?.addEventListener('click', () => {
    setState({ view: 'scene', pauseSeen: true });
    hapticImpact('light');
    renderApp();
  });
  document.getElementById('pause-later-btn')?.addEventListener('click', () => {
    document.getElementById('pause-reaction')?.classList.remove('hidden');
    hapticImpact('medium');
    setTimeout(() => { setState({ view: 'scene', pauseSeen: true }); renderApp(); }, 1400);
  });

  document.getElementById('try-alt-route-btn')?.addEventListener('click', () => {
    pushHistory({ view: 'result' }); setState({ view: 'alt_scene', altSceneIndex: 0, altAnswers: {} }); hapticImpact('medium'); renderApp();
  });
  document.getElementById('restart-game-btn')?.addEventListener('click', () => { resetGame(); renderApp(); });

  document.querySelectorAll('.alt-option-btn').forEach(btn => {
    btn.addEventListener('click', () => handleAltOption(btn.dataset.altOptionId, renderApp));
  });
  document.getElementById('alt-skip-to-service-btn')?.addEventListener('click', () => {
    pushHistory({ view: 'alt_scene' });
    setState({ view: 'service' });
    renderApp();
  });

  document.getElementById('compare-next-btn')?.addEventListener('click', () => {
    pushHistory({ view: 'compare' });
    setState({ view: 'service' });
    renderApp();
  });

  document.getElementById('open-lead-drawer-btn')?.addEventListener('click', () => drawer?.open());
  document.getElementById('service-restart-btn')?.addEventListener('click', () => { resetGame(); renderApp(); });
}

function handleSceneOption(optId, allScenes, renderApp) {
  const st = getState();
  if (st.isTransitioning) return;
  setState({ isTransitioning: true });

  const currentScene = allScenes[st.sceneIndex];
  const option = currentScene?.options.find(o => o.id === optId);
  if (!option) return;

  saveAnswer(currentScene.id, option);
  hapticImpact('medium');

  const reactEl = document.getElementById('reaction-text');
  const deltaContainer = document.getElementById('metric-deltas');
  if (reactEl) { reactEl.textContent = option.reaction || ''; reactEl.style.opacity = '1'; }
  if (deltaContainer && option.effects) {
    deltaContainer.innerHTML = Object.entries(option.effects)
      .filter(([_, v]) => v !== 0)
      .map(([k, v]) => `<span class="metric-pop bg-[var(--color-surface)] border border-[var(--color-border)] px-2 py-0.5 rounded text-xs font-bold ${v > 0 ? (k === 'interest' ? 'text-emerald-400' : 'text-rose-400') : 'text-emerald-400'}">${k === 'load' ? '🧠' : k === 'switches' ? '🔄' : k === 'friction' ? '⏱' : '❤️'} ${v > 0 ? '+' : ''}${v}</span>`)
      .join('');
  }

  setTimeout(() => {
    setState({ isTransitioning: false });
    pushHistory({ view: 'scene', sceneIndex: st.sceneIndex, answers: st.answers });

    const currentMetrics = calculateMetrics(getState().answers);
    const frictionSum = currentMetrics.load + currentMetrics.switches + currentMetrics.friction;
    if (st.sceneIndex === 2 && frictionSum >= 2 && !st.pauseSeen) {
      setState({ view: 'pause' });
      renderApp();
      return;
    }

    if (st.sceneIndex + 1 < allScenes.length) {
      setState({ sceneIndex: st.sceneIndex + 1 });
    } else {
      setState({ view: 'result' });
    }
    renderApp();
  }, 750);
}

function handleAltOption(optId, renderApp) {
  const st = getState();
  if (st.isTransitioning) return;
  setState({ isTransitioning: true });

  const problemScenes = getProblemScenes(st.answers);
  const episodes = getAlternateEpisodesList(problemScenes);
  const ep = episodes[st.altSceneIndex];
  const option = ep?.options.find(o => o.id === optId);

  if (ep && option) {
    saveAltAnswer(ep.sceneId, option);
    hapticImpact('light');
    const reactEl = document.getElementById('alt-reaction-text');
    if (reactEl) { reactEl.textContent = option.reaction || ''; reactEl.style.opacity = '1'; }
  }

  setTimeout(() => {
    setState({ isTransitioning: false });
    if (st.altSceneIndex + 1 < episodes.length) {
      setState({ altSceneIndex: st.altSceneIndex + 1 });
    } else {
      setState({ view: 'compare' });
    }
    renderApp();
  }, 650);
}
