import { renderShell, renderTopbar, renderHud } from './layout.js';
import { getGoal } from '../data/goals.js';

function getSceneCopy(scene, goal) {
  if (scene.id !== 'action' || goal?.id !== 'choose') {
    return { 
      title: scene.dynamic ? `Осталось ${goal?.action || 'сделать действие'}` : scene.title, 
      text: scene.text, 
      question: scene.question 
    };
  }
  return {
    title: 'Подходящий вариант найден',
    text: 'Выбор сделан. Теперь важно не потерять клиента на следующем шаге.',
    question: 'Что происходит после выбора?',
  };
}

export function renderSceneScreen({ scene, metrics, index, total, selected, goal, goalId }) {
  const currentGoal = goal || getGoal(goalId);
  const progress = Math.round(10 + (((index ?? 0) + 1) / (total ?? 5)) * 65);
  const copy = getSceneCopy(scene, currentGoal);
  const options = (scene.options || []).map((option) => `
    <button class="option-card scene-option-btn ${selected === option.id ? 'option-selected' : ''}" data-option-id="${option.id}" data-option="${option.id}" aria-pressed="${selected === option.id}">
      <span class="option-icon"><i data-lucide="${option.icon || 'circle'}" class="w-4 h-4"></i></span>
      <span class="option-copy">${option.label || option.text}</span>
    </button>`).join('');

  return renderShell(`
    ${renderTopbar(progress)}
    ${renderHud(metrics)}
    <div class="eyebrow">${scene.kicker || 'Шаг ' + ((index ?? 0) + 1)}</div>
    <h1 class="screen-title">${copy.title}</h1>
    <p class="lead-text mt-1">${copy.text}</p>
    <h2 class="text-xs font-bold uppercase tracking-wider text-muted mt-3 mb-1">${copy.question}</h2>
    <div class="option-list">${options}</div>
    <div id="metric-deltas" class="metric-deltas" aria-live="polite"></div>
    <div id="reaction-text" class="reaction" role="status"></div>
  `);
}
