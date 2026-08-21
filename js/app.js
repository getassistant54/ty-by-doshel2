/**
 * app.js — Главный контроллер интерактивного симулятора
 */

import { renderHeroScreen } from './components/hero-screen.js?v=5.6';
import { renderGoalScreen } from './components/goal-screen.js?v=5.6';
import { renderSceneScreen } from './components/scene-screen.js?v=5.6';
import { renderPauseScreen } from './components/pause-modal.js?v=5.6';
import { renderResultScreen } from './components/result-screen.js?v=5.6';
import { renderAlternateIntro, renderNoAlternateScreen, renderAltScreen } from './components/alt-screen.js?v=5.6';
import { renderCompareScreen } from './components/compare-screen.js?v=5.6';
import { renderServiceScreen } from './components/service-screen.js?v=5.6';
import { renderLeadDrawer, setupLeadDrawer } from './components/lead-drawer.js?v=5.6';

import { GOALS, getGoal } from './data/goals.js';
import { SCENES, getOption, getRoute } from './data/scenes.js';
import { calculateMetrics } from './scoring.js';
import { determineResult } from './results.js';
import { buildAlternateRoute, calculateFullAlternateMetrics } from './alternate.js';
import { getComparison } from './alternate.js';
import { getPersonalInsight, getRecoveryInsight, getPersonalTips } from './insights.js';
import { getRecovery } from './scoring.js';
import { showChoiceFeedback } from './interaction.js';
import { advanceMainRoute, advanceAlternateRoute, goBack } from './navigation.js';
import { initIcons, resetScroll } from './utils.js';
import { CONFIG } from './config.js';
import { getState, setState, updateState, resetState, saveAnswer, saveAlternateAnswer } from './state.js';
import { initBridge, hapticImpact } from './bridge.js';

const app = document.getElementById('app');
let drawerRoot = null;
let drawerApi = null;
let isTransitioning = false;

if (!document.getElementById('drawer-root')) {
  drawerRoot = document.createElement('div');
  drawerRoot.id = 'drawer-root';
  document.body.appendChild(drawerRoot);
} else {
  drawerRoot = document.getElementById('drawer-root');
}

export function render() {
  const state = getState();
  const goal = getGoal(state.goalId);
  const metrics = calculateMetrics(state.answers);
  const alternate = buildAlternateRoute(state.answers);


  const alternateMetrics = calculateFullAlternateMetrics(state.answers, alternate, state.alternateAnswers);
  const result = determineResult(metrics);
  const recovery = getRecovery(state.answers);
  const recoveryInsight = getRecoveryInsight(recovery);

  const nextAction = alternate.length
    ? { action: 'alternate', label: 'Показать другой маршрут' }
    : recoveryInsight.tone === 'positive'
      ? { action: 'service', label: 'Что делать дальше?' }
      : { action: 'alternate-empty', label: 'Посмотреть точку возврата' };

  const currentScene = SCENES[state.sceneIndex] || SCENES[0];

  const screens = {
    hero: () => renderHeroScreen(Boolean(state.goalId)),
    intro: () => renderHeroScreen(Boolean(state.goalId)),
    goal: () => renderGoalScreen({ selectedGoalId: state.goalId }),
    scene: () => renderSceneScreen({
      scene: currentScene,
      metrics,
      index: state.sceneIndex,
      total: SCENES.length,
      selected: state.answers[currentScene.id],
      goal,
    }),
    play: () => renderSceneScreen({
      scene: currentScene,
      metrics,
      index: state.sceneIndex,
      total: SCENES.length,
      selected: state.answers[currentScene.id],
      goal,
    }),
    pause: renderPauseScreen,
    result: () => {
      return renderResultScreen({
        result,
        metrics,
        route: getRoute(state.answers),
        personalInsight: getPersonalInsight(state.answers, metrics, result),
        recovery,
        recoveryInsight,
        tips: getPersonalTips(result, recoveryInsight),
        nextAction,
      });
    },
    'alternate-intro': renderAlternateIntro,
    'alternate-empty': () => renderNoAlternateScreen(recoveryInsight),
    alt_scene: () => renderAltScreen({
      step: alternate[state.alternateIndex],
      index: state.alternateIndex,
      total: alternate.length,
      metrics: alternateMetrics,
      selected: state.alternateAnswers[alternate[state.alternateIndex]?.sceneId],
      goal,
    }),
    alternate: () => renderAltScreen({
      step: alternate[state.alternateIndex],
      index: state.alternateIndex,
      total: alternate.length,
      metrics: alternateMetrics,
      selected: state.alternateAnswers[alternate[state.alternateIndex]?.sceneId],
      goal,
    }),
    compare: () => renderCompareScreen(getComparison(state.answers, alternate, state.alternateAnswers)),
    comparison: () => renderCompareScreen(getComparison(state.answers, alternate, state.alternateAnswers)),
    service: renderServiceScreen,
  };

  app.innerHTML = (screens[state.view] || screens.hero)();
  initIcons();
  resetScroll();
  isTransitioning = false;
}

function handleBack() {
  if (isTransitioning) return;
  const alternate = buildAlternateRoute(getState().answers);
  goBack(alternate.length);
  render();
}

function handleOption(button) {
  if (isTransitioning) return;
  isTransitioning = true;
  const state = getState();
  const scene = SCENES[state.sceneIndex];
  const optId = button.dataset.option || button.dataset.optionId;
  const choice = getOption(scene, optId);
  const before = calculateMetrics(state.answers);
  saveAnswer(scene.id, choice?.id || optId);
  const updatedState = getState();
  const after = calculateMetrics(updatedState.answers);
  hapticImpact('light');
  showChoiceFeedback({ root: app, button, before, after, reaction: choice?.reaction });

  // Фоновая предзагрузка разбора стратегии во время таймера анимации
  if (state.sceneIndex >= SCENES.length - 2) {
    import('./ai-handler.js').then(({ getCachedAiResult, sendToAi }) => {
      if (!getCachedAiResult()) {
        const payload = {
          project: "Интерактивный симулятор «Ты бы дошёл?»",
          answers: Object.entries(updatedState.answers).map(([sceneId, oId]) => ({ sceneId, optId: oId })),
          goalId: updatedState.goalId
        };
        sendToAi(payload).catch(() => {});
      }
    }).catch(() => {});
  }

  setTimeout(() => { advanceMainRoute(); render(); }, CONFIG.ui.feedbackDelay);
}

function handleAlternateOption(button) {
  if (isTransitioning) return;
  isTransitioning = true;
  const state = getState();
  const route = buildAlternateRoute(state.answers);
  const step = route[state.alternateIndex];
  const optId = button.dataset.altOption || button.dataset.altOptionId;
  const choice = step?.options?.find((option) => option.id === optId);
  const before = calculateFullAlternateMetrics(state.answers, route, state.alternateAnswers);
  saveAlternateAnswer(step?.sceneId, choice?.id || optId);
  const after = calculateFullAlternateMetrics(state.answers, route, getState().alternateAnswers);
  hapticImpact('light');
  showChoiceFeedback({ root: app, button, before, after, reaction: choice?.reaction });
  setTimeout(() => { advanceAlternateRoute(route.length); render(); }, CONFIG.ui.feedbackDelay);
}

function handleAction(action) {
  const state = getState();
  if (action === 'start') updateState({ view: state.goalId ? 'play' : 'goal' });
  if (action === 'restart') { 
    import('./ai-handler.js').then(m => m.clearAiCache?.()).catch(() => {});
    resetState(); 
    updateState({ view: 'goal' }); 
  }
  if (action === 'back') return handleBack();
  if (action === 'continue-route') {
    updateState({ view: 'play', sceneIndex: 3, pauseSeen: true });
    render();
    return;
  }
  if (action === 'later') return showLaterReaction();
  if (action === 'alternate') updateState({ view: 'alternate-intro' });
  if (action === 'alternate-empty') updateState({ view: 'alternate-empty' });
  if (action === 'start-alternate') updateState({ view: 'alternate', alternateIndex: 0, alternateAnswers: {} });
  if (action === 'service') updateState({ view: 'service' });
  if (action === 'open-lead') return drawerApi?.open();
  render();
}

function showLaterReaction() {
  if (isTransitioning) return;
  isTransitioning = true;
  const el = document.getElementById('pause-reaction');
  const btnGroup = document.getElementById('pause-buttons');
  if (btnGroup) {
    const laterBtn = btnGroup.querySelector('#pause-later-btn');
    if (laterBtn) laterBtn.classList.add('option-selected');
    const contBtn = btnGroup.querySelector('#pause-continue-btn');
    if (contBtn) contBtn.classList.add('option-hidden');
  }
  if (el) {
    el.classList.remove('hidden');
  }
  hapticImpact('medium');
  setTimeout(() => {
    updateState({ view: 'play', sceneIndex: 3, pauseSeen: true });
    render();
  }, 2200);
}

app.addEventListener('click', (event) => {
  const goal = event.target.closest('[data-goal]') || event.target.closest('[data-goal-id]');
  const option = event.target.closest('[data-option]') || event.target.closest('[data-option-id]');
  const alternateOption = event.target.closest('[data-alt-option]') || event.target.closest('[data-alt-option-id]');
  const action = event.target.closest('[data-action]');
  const backBtn = event.target.closest('.back-btn');

  if (backBtn && !action) {
    handleBack();
  } else if (goal && !action) {
    const goalId = goal.dataset.goal || goal.dataset.goalId;
    updateState({ goalId, view: 'play', sceneIndex: 0 });
    hapticImpact('medium');
    render();
  } else if (option && !action) {
    handleOption(option);
  } else if (alternateOption && !action) {
    handleAlternateOption(alternateOption);
  } else if (action) {
    handleAction(action.dataset.action);
  }
});

document.addEventListener('DOMContentLoaded', () => {
  if (drawerRoot) {
    drawerRoot.innerHTML = renderLeadDrawer();
    drawerApi = setupLeadDrawer(drawerRoot, getState);
  }

  initBridge(() => {
    const loader = document.getElementById('loading');
    if (loader) loader.style.display = 'none';
    render();
  });
  render();
});
