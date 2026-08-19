import { renderShell, renderTopbar, renderHud } from './layout.js';

function renderAlternateTopbar(index, total) {
  const progress = Math.round(75 + ((index + 1) / total) * 20);
  return `
    <div class="topbar alternate-topbar">
      <button class="back-btn" id="alt-back-btn" data-action="back" aria-label="Назад"><i data-lucide="arrow-left" class="w-5 h-5"></i></button>
      <div class="alternate-progress">
        <span>Маршрут 2 · пробуем иначе</span>
        <strong>${index + 1} / ${total}</strong>
      </div>
    </div>`;
}

function renderFirstRouteContext(step) {
  return `
    <div class="alternate-context">
      <div class="eyebrow">Было в первом пути</div>
      <p>${step.originalContext}</p>
    </div>`;
}

function renderGoalAction(step, goal) {
  const action = goal?.action || 'сделать действие';
  return `
    <div class="alternate-direct">
      <div class="eyebrow">Целевое действие</div>
      <h2 class="text-base font-bold mt-2">Осталось только ${action}</h2>
      <p class="muted text-xs leading-relaxed mt-2">Маршрут не уводит на новые круги. Человек сразу делает то, за чем пришёл.</p>
      <button class="primary-btn mt-6 alt-option-btn" data-alt-option-id="${step.options[0].id}" data-alt-option="${step.options[0].id}">${step.options[0].label}</button>
    </div>`;
}

function renderRegularAction(step, selected) {
  return `
    <h2 class="text-base font-bold mt-7">${step.question || 'Что выбираем?'}</h2>
    <div class="option-list">
      ${step.options.map((option) => `
        <button class="option-card alt-option-btn ${selected === option.id ? 'option-selected' : ''}" data-alt-option-id="${option.id}" data-alt-option="${option.id}">
          <span class="option-icon"><i data-lucide="${option.icon}" class="w-5 h-5"></i></span>
          <span class="option-copy">${option.label}</span>
        </button>`).join('')}
    </div>`;
}

export function renderAlternateIntro() {
  return renderShell(`
    <div class="topbar alternate-topbar">
      <button class="back-btn" id="alt-back-btn" data-action="back" aria-label="Назад"><i data-lucide="arrow-left" class="w-5 h-5"></i></button>
      <div class="alternate-progress"><strong>Маршрут 2 · пробуем иначе</strong></div>
    </div>
    <div class="flex-1 flex flex-col justify-center">
      <div class="eyebrow">Тот же путь — меньше барьеров</div>
      <h1 class="screen-title">Теперь переиграем неудобные моменты</h1>
      <p class="lead-text mt-4">Меняем только те места, где в первом пути было лишнее трение. Ты сразу попробуешь более простой вариант.</p>
      <button class="primary-btn mt-8" id="start-alternate-btn" data-action="start-alternate">Попробовать иначе</button>
    </div>`);
}

export function renderNoAlternateScreen(recoveryInsight) {
  return renderShell(`
    ${renderTopbar(90)}
    <div class="flex-1 flex flex-col justify-center">
      <div class="eyebrow">Маршрут уже работает</div>
      <h1 class="screen-title">Здесь нечего чинить ради самого чинить</h1>
      <p class="lead-text mt-4">Основной маршрут уже выглядит логично. Большая перестройка ему не нужна.</p>
      ${recoveryInsight ? `
        <div class="recovery-card recovery-${recoveryInsight.tone} mt-6">
          <div>
            <p class="font-bold text-sm">${recoveryInsight.title}</p>
            <p class="muted text-xs leading-relaxed mt-2">${recoveryInsight.text}</p>
          </div>
        </div>
      ` : ''}
      <button class="primary-btn mt-8" id="service-btn" data-action="service">Что делать дальше?</button>
    </div>`);
}

export function renderAltScreen({ step, episode, episodeIndex, index, total, totalEpisodes, metrics, selected, goal }) {
  const currentStep = step || episode;
  const currIndex = index ?? episodeIndex ?? 0;
  const currTotal = total ?? totalEpisodes ?? 1;

  if (!currentStep) return renderAlternateIntro();

  return renderShell(`
    ${renderAlternateTopbar(currIndex, currTotal)}
    ${metrics ? renderHud(metrics) : ''}
    <div class="flex-1 flex flex-col">
      ${currentStep.originalContext ? renderFirstRouteContext(currentStep) : ''}
      <div class="eyebrow mt-6">Пробуем иначе</div>
      <h1 class="screen-title">${currentStep.title}</h1>
      <p class="lead-text mt-4">${currentStep.text || ''}</p>
      ${currentStep.sceneId === 'action' ? renderGoalAction(currentStep, goal) : renderRegularAction(currentStep, selected)}
      <div id="metric-deltas" class="metric-deltas" aria-live="polite"></div>
      <div id="alt-reaction-text" class="reaction" role="status"></div>
    </div>`);
}
