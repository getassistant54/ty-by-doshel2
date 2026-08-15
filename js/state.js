/**
 * js/state.js — Управление состоянием игры и история для кнопки «Назад»
 */

const STORAGE_KEY = 'vibe_simulator_state_v1';

const INITIAL_STATE = {
  view: 'hero',
  goalId: 'apply',
  sceneIndex: 0,
  answers: {},
  pauseSeen: false,
  altSceneIndex: 0,
  altAnswers: {},
  isTransitioning: false,
  history: []
};

let _state = loadPersistedState();

function loadPersistedState() {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (raw) return { ...INITIAL_STATE, ...JSON.parse(raw), isTransitioning: false };
  } catch (e) {
    console.warn('Session storage read error:', e);
  }
  return { ...INITIAL_STATE };
}

function persistState() {
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(_state));
  } catch (e) {
    console.warn('Session storage write error:', e);
  }
}

export function getState() {
  return _state;
}

export function setState(updates) {
  _state = { ..._state, ...updates };
  persistState();
  return _state;
}

export function saveAnswer(sceneId, option) {
  const answers = { ..._state.answers, [sceneId]: option };
  return setState({ answers });
}

export function saveAltAnswer(sceneId, option) {
  const altAnswers = { ..._state.altAnswers, [sceneId]: option };
  return setState({ altAnswers });
}

export function pushHistory(snapshot) {
  const history = [..._state.history, snapshot];
  return setState({ history });
}

export function popHistory() {
  if (_state.history.length === 0) return null;
  const history = [..._state.history];
  const last = history.pop();
  setState({ history });
  return last;
}

export function resetGame() {
  _state = { ...INITIAL_STATE };
  try {
    sessionStorage.removeItem(STORAGE_KEY);
  } catch (e) {}
  return _state;
}
