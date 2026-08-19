import { GOALS } from '../data/goals.js';
import { renderShell, renderTopbar } from './layout.js';

export function renderGoalScreen({ selectedGoalId } = {}) {
  const cards = GOALS.map((goal) => `
    <button class="option-card goal-option-btn ${selectedGoalId === goal.id ? 'option-selected' : ''}" data-goal-id="${goal.id}" data-goal="${goal.id}">
      <span class="option-icon"><i data-lucide="${goal.icon}" class="w-5 h-5"></i></span>
      <span class="option-copy">${goal.label}</span>
      <i data-lucide="chevron-right" class="w-4 h-4 muted"></i>
    </button>`).join('');
  return renderShell(`
    ${renderTopbar(5)}
    <div class="eyebrow">Строим маршрут</div>
    <h1 class="screen-title">Куда должен дойти твой клиент?</h1>
    <div class="option-list">${cards}</div>`);
}
