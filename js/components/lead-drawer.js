import { getBridgeState, submitToNotibot, hapticImpact, hapticSelection } from '../bridge.js';
import { calculateMetrics } from '../scoring.js';
import { determineResult } from '../results.js';
import { CONFIG } from '../config.js';
import { getRecoveryInsight } from '../insights.js';
import { getRecovery } from '../scoring.js';
import { initIcons } from '../utils.js';

const LEAD_GOALS = [
  'Больше заявок',
  'Меньше ручной работы',
  'Упростить выбор продукта',
  'Собрать путь в одном месте',
  'Лучше видеть действия клиентов',
  'Другое',
];

export function renderLeadDrawer() {
  const bridge = getBridgeState ? getBridgeState() : {};
  const isIdentified = Boolean(bridge.user?.id);

  return `
    <div id="lead-drawer" class="drawer" aria-hidden="true">
      <div class="drawer-backdrop" data-drawer-close></div>
      <section class="drawer-panel" role="dialog" aria-modal="true" aria-labelledby="drawer-title">
        <div class="drawer-handle"></div>
        <button class="back-btn absolute top-4 right-4" data-drawer-close aria-label="Закрыть"><i data-lucide="x" class="w-5 h-5"></i></button>
        <div class="eyebrow">Персональный разбор</div>
        <h2 id="drawer-title" class="text-2xl font-extrabold tracking-tight mt-2 pr-12">Хочешь маршрут уже под свой проект?</h2>
        <p class="muted text-sm leading-relaxed mt-3">Покажу, какие этапы можно убрать, объединить или автоматизировать.</p>

        <form id="lead-form" novalidate>
          <label class="field-label">Имя
            <input class="field" name="name" id="lead-name" autocomplete="name" required placeholder="Как к тебе обращаться?">
          </label>
          <label class="field-label" data-contact-field ${isIdentified ? 'hidden' : ''}>
            <span>Куда написать?</span>
            <input class="field" name="contact" id="lead-contact" autocomplete="off" ${isIdentified ? '' : 'required'} placeholder="Telegram, email или телефон">
          </label>
          <label class="field-label">Что сейчас важнее всего?
            <select class="field" name="leadGoal" id="lead-goal" required>
              <option value="">Выбрать</option>
              ${LEAD_GOALS.map((goal) => `<option value="${goal}">${goal}</option>`).join('')}
            </select>
          </label>
          <div id="form-message" class="form-message muted" role="status"></div>
          <button class="primary-btn mt-2" type="submit" id="lead-submit-btn">Получить разбор</button>
        </form>
      </section>
    </div>
  `;
}

export function setupLeadDrawer(rootEl, getState, onRestart) {
  const drawer = rootEl.querySelector('#lead-drawer');
  const contactField = rootEl.querySelector('[data-contact-field]');
  const contactInput = rootEl.querySelector('#lead-contact');
  const submitButton = rootEl.querySelector('#lead-submit-btn');
  const form = rootEl.querySelector('#lead-form');
  const message = rootEl.querySelector('#form-message');
  let lastFocus = null;

  const close = () => {
    drawer.classList.remove('drawer-visible');
    drawer.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    hapticSelection();
    lastFocus?.focus();
  };

  const handleKeydown = (event) => {
    if (!drawer.classList.contains('drawer-visible')) return;
    if (event.key === 'Escape') return close();
    if (event.key !== 'Tab') return;
    const focusable = [...drawer.querySelectorAll('button:not(:disabled), input:not(:disabled), select:not(:disabled)')]
      .filter((element) => !element.hidden);
    const first = focusable[0];
    const last = focusable.at(-1);
    if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
    if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
  };

  rootEl.querySelectorAll('[data-drawer-close]').forEach((button) => button.addEventListener('click', close));
  document.addEventListener('keydown', handleKeydown);

  form?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const st = typeof getState === 'function' ? getState() : {};
    const answers = st.answers || {};
    const metrics = calculateMetrics(answers);
    const result = determineResult(metrics);
    const recovery = getRecovery ? getRecovery(answers) : null;
    const recoveryInsight = getRecoveryInsight(recovery);

    const nameVal = form.querySelector('#lead-name')?.value.trim();
    const contactVal = form.querySelector('#lead-contact')?.value.trim();
    const leadGoalVal = form.querySelector('#lead-goal')?.value;

    if (!nameVal) {
      message.textContent = 'Пожалуйста, укажите имя';
      message.className = 'form-message text-rose-400';
      return;
    }

    const payload = {
      name: nameVal,
      contact: contactVal || 'Telegram',
      leadGoal: leadGoalVal || 'Больше заявок',
      selectedGoal: st.goalId,
      resultType: result.title || result.id,
      interest: metrics.interest,
      load: metrics.load,
      switches: metrics.switches,
      friction: metrics.friction,
      recoveryId: recovery?.id || 'unknown',
      returnability: recovery?.effect?.returnability || 0,
    };

    submitButton.disabled = true;
    submitButton.textContent = 'Отправляем...';
    
    let res;
    try {
      res = await submitToNotibot(payload);
    } catch (err) {
      console.error('Submit error:', err);
      res = { success: false, error: err.message };
    }

    if (res && res.success) {
      hapticImpact('medium');
      const articleUrl = 'https://t.me/em_rto_bot?start=page_3w8WBNVTfFQ3Evg7dBStwq';
      form.innerHTML = `
        <div class="text-center py-2">
          <div class="option-icon mx-auto mb-3 w-12 h-12 rounded-2xl bg-[rgba(121,215,167,0.15)] text-[#79d7a7]">
            <i data-lucide="check-circle" class="w-6 h-6"></i>
          </div>
          <h3 class="text-lg font-extrabold text-white mb-1.5">Заявка принята!</h3>
          <p class="muted text-xs leading-relaxed mb-4">Скоро свяжусь с вами для разбора. А пока смотрите готовые решения:</p>
          <div class="space-y-2.5">
            <a href="${articleUrl}" id="drawer-article-cta" class="primary-btn flex items-center justify-center gap-2" target="_top">
              <span>⚡ 7 схем: как сократить путь клиента</span>
              <i data-lucide="arrow-right" class="w-4 h-4"></i>
            </a>
            <button type="button" id="drawer-restart-btn" class="secondary-btn flex items-center justify-center gap-2 w-full">
              <i data-lucide="rotate-ccw" class="w-4 h-4"></i>
              <span>🔄 Пройти интерактив ещё раз</span>
            </button>
          </div>
        </div>
      `;
      initIcons();

      const articleBtn = form.querySelector('#drawer-article-cta');
      articleBtn?.addEventListener('click', () => {
        if (window.notibot?.openArticle) {
          window.notibot.openArticle('3w8WBNVTfFQ3Evg7dBStwq');
        }
        if (window.Telegram?.WebApp?.openTelegramLink) {
          window.Telegram.WebApp.openTelegramLink(articleUrl);
        }
      });

      const restartBtn = form.querySelector('#drawer-restart-btn');
      restartBtn?.addEventListener('click', () => {
        close();
        if (typeof onRestart === 'function') {
          onRestart();
        } else {
          const restartActionBtn = document.querySelector('[data-action="restart"]');
          if (restartActionBtn) {
            restartActionBtn.click();
          } else {
            window.location.reload();
          }
        }
      });
    } else {
      message.className = 'form-message text-rose-400';
      message.textContent = `❌ Ошибка: ${res?.error || 'Не удалось отправить форму'}`;
      submitButton.disabled = false;
      submitButton.textContent = 'Попробовать снова';
    }
  });

  return {
    open() {
      lastFocus = document.activeElement;
      drawer.classList.add('drawer-visible');
      drawer.setAttribute('aria-hidden', 'false');
      if (submitButton) submitButton.disabled = false;
      if (submitButton) submitButton.textContent = 'Получить разбор';
      if (message) message.textContent = '';
      document.body.style.overflow = 'hidden';
      hapticImpact('medium');
      drawer.querySelector('input')?.focus();
      initIcons();
    },
    close,
    form,
    message,
  };
}
