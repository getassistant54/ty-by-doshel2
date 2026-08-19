const STORAGE_KEY = 'ty-by-doshel-session';

const freshState = () => ({
  view: 'intro',
  goalId: null,
  sceneIndex: 0,
  answers: {},
  pauseSeen: false,
  alternateIndex: 0,
  alternateAnswers: {},
  isTransitioning: false,
  history: [],
});

function loadState() {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      return {
        ...freshState(),
        ...parsed,
        isTransitioning: false,
        answers: parsed.answers || {},
        alternateAnswers: parsed.alternateAnswers || parsed.altAnswers || {},
      };
    }
  } catch (e) {
    console.warn('Session storage read error:', e);
  }
  return freshState();
}

let state = loadState();

function persistState() {
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (e) {
    console.warn('Session storage write error:', e);
  }
}

export function getState() {
  return state;
}

export function updateState(patch) {
  state = { ...state, ...patch };
  persistState();
  return state;
}

export function setState(patch) {
  return updateState(patch);
}

export function saveAnswer(sceneId, optionId) {
  const optId = typeof optionId === 'object' ? optionId.id : optionId;
  return updateState({ answers: { ...state.answers, [sceneId]: optId } });
}

export function saveAlternateAnswer(sceneId, optionId) {
  const optId = typeof optionId === 'object' ? optionId.id : optionId;
  return updateState({
    alternateAnswers: { ...state.alternateAnswers, [sceneId]: optId },
  });
}

export function saveAltAnswer(sceneId, optionId) {
  return saveAlternateAnswer(sceneId, optionId);
}

export function pushHistory(snapshot) {
  const history = [...state.history, snapshot];
  return updateState({ history });
}

export function popHistory() {
  if (state.history.length === 0) return null;
  const history = [...state.history];
  const last = history.pop();
  updateState({ history });
  return last;
}

export function resetState() {
  state = freshState();
  try {
    sessionStorage.removeItem(STORAGE_KEY);
  } catch (e) {}
  return state;
}

export function resetGame() {
  return resetState();
}
