import { getState, updateState } from './state.js';
import { SCENES } from './data/scenes.js';
import { shouldShowPause } from './scoring.js';

export function advanceMainRoute() {
  const state = getState();
  const nextIndex = state.sceneIndex + 1;
  if (nextIndex >= SCENES.length) return updateState({ view: 'result' });
  if (nextIndex === 3 && !state.pauseSeen && shouldShowPause(state.answers)) {
    return updateState({ view: 'pause', pauseSeen: true });
  }
  return updateState({ sceneIndex: nextIndex });
}

export function advanceAlternateRoute(total) {
  const state = getState();
  return updateState(state.alternateIndex + 1 >= total
    ? { view: 'comparison' }
    : { alternateIndex: state.alternateIndex + 1 });
}

export function goBack(alternateTotal = 0) {
  const state = getState();
  if (state.view === 'goal') return updateState({ view: 'intro' });
  if (state.view === 'play' && state.sceneIndex === 0) return updateState({ view: 'goal' });
  if (state.view === 'play') return updateState({ sceneIndex: state.sceneIndex - 1 });
  if (state.view === 'pause') return updateState({ view: 'play', sceneIndex: 2 });
  if (state.view === 'result') return updateState({ view: 'play', sceneIndex: SCENES.length - 1 });
  if (state.view === 'alternate-intro') return updateState({ view: 'result' });
  if (state.view === 'alternate-empty') return updateState({ view: 'result' });
  if (state.view === 'alternate' && state.alternateIndex > 0) return updateState({ alternateIndex: state.alternateIndex - 1 });
  if (state.view === 'alternate') return updateState({ view: 'alternate-intro' });
  if (state.view === 'comparison') return updateState({ view: 'alternate', alternateIndex: Math.max(0, alternateTotal - 1) });
  return updateState({ view: 'result' });
}
