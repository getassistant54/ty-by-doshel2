const METRIC_META = {
  interest: { icon: '❤️', format: (value) => `${value}/5` },
  load: { icon: '🧠', format: String },
  switches: { icon: '🔄', format: String },
  friction: { icon: '⏱', format: String },
};

export function getMetricDeltas(before, after) {
  return Object.keys(METRIC_META).flatMap((key) => {
    const delta = (after[key] || 0) - (before[key] || 0);
    return delta ? [{ key, delta, ...METRIC_META[key] }] : [];
  });
}

export function showChoiceFeedback({ root, button, before, after, reaction }) {
  // Скрываем невыбранные кнопки и выделяем выбранную
  root.querySelectorAll('[data-option], [data-alt-option], [data-option-id], [data-alt-option-id]').forEach((option) => {
    option.disabled = true;
    option.setAttribute('aria-disabled', 'true');
    if (option === button) {
      option.classList.add('option-selected');
      option.classList.remove('option-muted', 'option-hidden');
    } else {
      option.classList.add('option-hidden');
      option.classList.remove('option-selected');
    }
  });

  // Показываем контейнер обратной связи
  const feedbackContainer = root.querySelector('#choice-feedback');
  if (feedbackContainer) {
    feedbackContainer.classList.remove('hidden');
    feedbackContainer.classList.add('choice-feedback-visible');
    
    // Перезапуск анимации таймера
    const timerBar = feedbackContainer.querySelector('.feedback-timer-bar');
    if (timerBar) {
      timerBar.style.animation = 'none';
      void timerBar.offsetHeight; // trigger reflow
      timerBar.style.animation = '';
    }
  }

  const deltas = getMetricDeltas(before, after);
  const deltaBox = root.querySelector('#metric-deltas');
  if (deltaBox) {
    const badges = deltas.map(({ key, icon, delta }) => {
      const badge = document.createElement('span');
      const isPositive = key === 'interest' ? delta > 0 : delta < 0;
      badge.className = `metric-delta metric-pop ${isPositive ? 'delta-pos' : 'delta-neg'}`;
      badge.textContent = `${icon} ${delta > 0 ? '+' : '−'}${Math.abs(delta)}`;
      return badge;
    });
    deltaBox.replaceChildren(...badges);
  }

  deltas.forEach(({ key, format }) => {
    const item = root.querySelector(`[data-hud="${key}"]`);
    if (!item) return;
    const valEl = item.querySelector('.hud-value');
    if (valEl) valEl.textContent = format(after[key]);
    item.classList.add('metric-pop', 'hud-changed');
  });

  const reactionBox = root.querySelector('#reaction-text') || root.querySelector('#reaction') || root.querySelector('#alt-reaction-text');
  if (reactionBox) reactionBox.textContent = reaction || 'Шаг пройден. Идём дальше.';
  return deltas.length;
}
