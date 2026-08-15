/**
 * js/app.js — Главная точка входа и роутер приложения «Ты бы дошёл?»
 */

import { initBridge } from './bridge.js';
import { getState } from './state.js';
import { SCENES_PART_ONE } from './data/scenes-one.js';
import { SCENE_ACTION, SCENE_RETURN } from './data/scenes-two.js';
import { getProblemScenes, getAlternateEpisodesList } from './alternate.js';
import { initIcons } from './utils.js';
import { attachEventListeners } from './handlers.js';

import { renderHUD } from './components/hud.js';
import { renderHeroScreen } from './components/hero-screen.js';
import { renderGoalScreen } from './components/goal-screen.js';
import { renderSceneScreen } from './components/scene-screen.js';
import { renderPauseScreen } from './components/pause-modal.js';
import { renderResultScreen } from './components/result-screen.js';
import { renderAltScreen } from './components/alt-screen.js';
import { renderCompareScreen } from './components/compare-screen.js';
import { renderServiceScreen } from './components/service-screen.js';
import { renderLeadDrawer, setupLeadDrawer } from './components/lead-drawer.js';

const ALL_SCENES = [...SCENES_PART_ONE, SCENE_ACTION, SCENE_RETURN];
let _drawer = null;

function renderApp() {
  const st = getState();
  const appEl = document.getElementById('app');
  let contentHtml = '';

  if (st.view === 'hero') {
    contentHtml = renderHeroScreen();
  } else if (st.view === 'goal') {
    contentHtml = renderGoalScreen({ selectedGoalId: st.goalId });
  } else if (st.view === 'pause') {
    contentHtml = renderPauseScreen();
  } else if (st.view === 'scene') {
    const scene = ALL_SCENES[st.sceneIndex];
    const progress = Math.round(((st.sceneIndex + 1) / ALL_SCENES.length) * 100);
    const hudHtml = renderHUD({ answers: st.answers, progressPercent: progress, showBack: st.history.length > 0 });
    const sceneHtml = renderSceneScreen({ scene, goalId: st.goalId, selectedOptionId: st.answers[scene.id]?.id });
    contentHtml = hudHtml + sceneHtml;
  } else if (st.view === 'result') {
    contentHtml = renderResultScreen({ answers: st.answers });
  } else if (st.view === 'alt_scene') {
    const problemScenes = getProblemScenes(st.answers);
    const episodes = getAlternateEpisodesList(problemScenes);
    const ep = episodes[st.altSceneIndex] || null;
    contentHtml = renderAltScreen({ episode: ep, episodeIndex: st.altSceneIndex, totalEpisodes: episodes.length });
  } else if (st.view === 'compare') {
    contentHtml = renderCompareScreen({ originalAnswers: st.answers, altAnswers: st.altAnswers });
  } else if (st.view === 'service') {
    contentHtml = renderServiceScreen();
  }

  appEl.innerHTML = contentHtml;
  initIcons();
  attachEventListeners({ allScenes: ALL_SCENES, renderApp, drawer: _drawer });
}

document.addEventListener('DOMContentLoaded', () => {
  const drawerRoot = document.getElementById('drawer-root');
  if (drawerRoot) {
    drawerRoot.innerHTML = renderLeadDrawer();
    _drawer = setupLeadDrawer(drawerRoot, getState);
  }

  initBridge(() => {
    const loader = document.getElementById('loading');
    if (loader) loader.style.display = 'none';
    renderApp();
  });
});
