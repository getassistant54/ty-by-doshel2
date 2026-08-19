import { renderShell, renderTopbar } from './layout.js';
import { GOALS } from '../data/goals.js';

export function renderGoalScreen({ selectedGoalId = null } = {}) {
  return renderShell(`
    ${renderTopbar(10)}
    <div class="flex-1 flex flex-col pt-1">
      <div class="eyebrow">Шаг 0 · Настройка симуляции</div>
      <h1 class="screen-title">Какое целевое действие должен сделать клиент?</h1>
      <p class="lead-text mt-1">Выбери цель — под неё настроится сценарий и финальный шаг симулятора.</p>

      <div class="option-list mt-3">
        ${GOALS.map((goal) => `
          <button class="option-card goal-option-btn ${selectedGoalId === goal.id ? 'option-selected' : ''}" data-goal-id="${goal.id}" aria-pressed="${selectedGoalId === goal.id}">
            <span class="option-icon"><i data-lucide="${goal.icon}" class="w-4 h-4"></i></span>
            <span class="option-copy">${goal.label || goal.title}</span>
          </button>
        `).join('')}
      </div>
    </div>
  `);
}
