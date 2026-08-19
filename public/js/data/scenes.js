import { SCENES_ONE } from './scenes-one.js';
import { SCENES_TWO } from './scenes-two.js';

export const SCENES = [...SCENES_ONE, ...SCENES_TWO];

export function getScene(id) {
  return SCENES.find((scene) => scene.id === id);
}

export function getOption(scene, optionId) {
  if (!scene || !optionId) return null;
  const id = typeof optionId === 'object' ? optionId.id : optionId;
  return scene.options?.find((option) => option.id === id) || null;
}

export function getRoute(answers = {}) {
  return SCENES.filter((scene) => scene.id !== 'return')
    .map((scene) => {
      const opt = getOption(scene, answers[scene.id]);
      return opt ? (opt.route || opt.routeTitle || opt.label || opt.text) : null;
    })
    .filter(Boolean);
}
