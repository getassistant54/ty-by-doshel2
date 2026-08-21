import { renderShell, renderTopbar, renderHud } from './layout.js';

const GOAL_ACTIONS = {
  lead: { title: 'Ты готов оставить заявку', cta: 'Оставить заявку' },
  book: { title: 'Ты готов записаться', cta: 'Записаться' },
  choose: { title: 'Подходящий вариант уже найден', cta: 'Выбрать подходящий вариант' },
  buy: { title: 'Ты готов перейти к оплате', cta: 'Перейти к оплате' },
  register: { title: 'Ты готов зарегистрироваться', cta: 'Зарегистрироваться' },
  material: { title: 'Материал готов', cta: 'Получить материал' },
  other: { title: 'Следующий шаг перед тобой', cta: 'Продолжить' },
};

function renderAlternateTopbar(index, total) {
  return `
    <div class="topbar alternate-topbar">
      <button class="back-btn" id="alt-back-btn" data-action="back" aria-label="Назад"><i data-lucide="arrow-left" class="w-5 h-5"></i></button>
      <div class="alternate-progress">
        <strong>Маршрут 2 · пробуем иначе</strong>
        <span>${index + 1} из ${total}</span>
      </div>
    </div>`;
}

function renderFirstRouteContext(step) {
  return `
    <div class="alternate-context">
      <div class="eyebrow">В первом маршруте</div>
      <p>${step.originalContext}</p>
    </div>`;
}

function renderGoalAction(step, goal) {
  const action = GOAL_ACTIONS[goal?.id] || GOAL_ACTIONS.other;
  return `
    <div class="alternate-direct">
      <h2 class="text-xl font-extrabold">${action.title}</h2>
      <p class="muted mt-2">Никаких дополнительных форм — следующий шаг сразу здесь.</p>
      <button class="primary-btn mt-6 alt-option-btn" data-alt-option-id="${step.options[0].id}" data-alt-option="${step.options[0].id}">${action.cta}</button>
    </div>`;
}

function renderRegularAction(step, selected) {
  return `
    <h2 class="text-base font-bold mt-7">${step.question || 'Что выбираем?'}</h2>
    <div class="option-list">
      ${step.options.map((option) => `
        <button class="option-card alt-option-btn ${selected === option.id ? 'option-selected' : ''}" data-alt-option-id="${option.id}" data-alt-option="${option.id}" aria-pressed="${selected === option.id}">
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
    <div class="flex-1 flex flex-col pt-4 pb-6">
      <div class="option-icon mb-5 w-12 h-12 rounded-2xl">
        <i data-lucide="git-compare-arrows" class="w-6 h-6"></i>
      </div>
      <div class="eyebrow">Тот же путь — меньше барьеров</div>
      <h1 class="screen-title">Теперь переиграем неудобные моменты</h1>
      <p class="lead-text mt-4">Меняем только те места, где в первом пути было лишнее трение. Ты сразу попробуешь более простой вариант.</p>
      
      <div class="route-visual" aria-hidden="true">
        <span class="route-dot active"></span><span class="route-line"></span><span class="route-dot active"></span><span class="route-line"></span><span class="route-dot active"></span>
      </div>

      <div class="glass-card mb-6">
        <p class="text-sm font-semibold">Убираем барьеры и тупики</p>
        <p class="muted text-xs leading-relaxed mt-2">Посмотрим, как сокращается путь клиента, когда убраны лишние развилки, ожидание ответа и переходы между вкладками.</p>
      </div>

      <div class="mt-auto">
        <button class="primary-btn" id="start-alternate-btn" data-action="start-alternate">Попробовать иначе</button>
      </div>
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
      <div id="choice-feedback" class="choice-feedback hidden">
        <div class="feedback-badge-row">
          <span class="feedback-tag">Результат шага</span>
          <div id="metric-deltas" class="metric-deltas" aria-live="polite"></div>
        </div>
        <div id="alt-reaction-text" class="reaction-bubble" role="status"></div>
        <div class="feedback-timer"><div class="feedback-timer-bar"></div></div>
      </div>
    </div>`);
}
