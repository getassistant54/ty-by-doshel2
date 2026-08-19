import { renderTopbar, renderHud } from './layout.js';

export function renderHUD({ metrics, progressPercent = 0, showBack = true } = {}) {
  return `
    ${renderTopbar(progressPercent, showBack)}
    ${renderHud(metrics)}
  `;
}
