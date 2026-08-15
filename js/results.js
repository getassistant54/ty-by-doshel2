/**
 * js/results.js — Определение 5 типов диагнозов, персонализированные инсайты и Recovery
 */

export const RESULT_TYPES = {
  doors: {
    id: 'doors',
    title: 'Слишком много дверей',
    subtitle: 'Клиенту слишком часто приходится решать, куда идти дальше.',
    description: 'Каждый отдельный выбор кажется небольшим, но вместе они превращают интерес в отдельную задачу.',
    fixes: [
      'Сделать следующий шаг очевидным сразу',
      'Помочь с выбором продукта на более раннем этапе',
      'Сократить количество параллельных вариантов и ссылок'
    ],
    color: '#f59e0b',
    icon: 'door-open'
  },
  tabs: {
    id: 'tabs',
    title: 'Квест по вкладкам',
    subtitle: 'Маршрут работает, но постоянно выбрасывает клиента из одного контекста в другой.',
    description: 'Telegram → сайт → форма → мессенджер → оплата. Каждый переход — риск, что клиент не вернётся.',
    fixes: [
      'Объединить последовательные действия в единой среде',
      'Определить одну главную точку маршрута',
      'Убрать промежуточные переходы, не дающие ценности'
    ],
    color: '#38bdf8',
    icon: 'external-link'
  },
  wait: {
    id: 'wait',
    title: 'Ждите ответа оператора',
    subtitle: 'Маршрут движется, только пока рядом есть человек, который его двигает.',
    description: 'Отправить ссылку, помочь выбрать, ответить на вопросы, напомнить — ручная работа съедает конверсию.',
    fixes: [
      'Автоматизировать повторяющиеся типовые действия',
      'Дать клиенту самостоятельный доступ к ключевой информации',
      'Оставить менеджерам только сложные индивидуальные консультации'
    ],
    color: '#f43f5e',
    icon: 'user-check'
  },
  search: {
    id: 'search',
    title: 'А где это было?',
    subtitle: 'У клиента есть доступ к информации, но сначала её нужно найти.',
    description: 'Проблема не в недостатке контента — его просто слишком сложно получить в нужный момент принятия решения.',
    fixes: [
      'Выстроить информацию строго вокруг задач клиента',
      'Показывать цены и форматы в момент выбора',
      'Убрать необходимость искать следующий шаг самостоятельно'
    ],
    color: '#a855f7',
    icon: 'search'
  },
  good: {
    id: 'good',
    title: 'Почти бесшовно',
    subtitle: 'До цели действительно можно добраться без лишних приключений.',
    description: 'Основной каркас выстроен логично. Большая перестройка не требуется, важна точечная оптимизация.',
    fixes: [
      'Усилить сценарий возврата отвлекшихся клиентов',
      'Убрать последние мелкие точки трения перед оплатой',
      'Отслеживать аналитику прохождения шагов'
    ],
    color: '#10b981',
    icon: 'check-circle'
  }
};

export function determineResult(metrics, answers = {}) {
  // Условие для «Почти бесшовно»
  const isGood = metrics.load <= 1 && metrics.switches <= 1 && metrics.friction <= 1 && metrics.manual === 0 && metrics.interest >= 4;
  if (isGood) return RESULT_TYPES.good;

  // Проверяем доминирующий поиск
  const touchOpt = answers.first_touch?.id;
  const infoOpt = answers.offer_info?.id;
  const isSearchHeavy = (touchOpt === 'search-channel') || (infoOpt === 'read-posts' || infoOpt === 'search-price');

  if (metrics.manual >= 2 || (metrics.manual >= 1 && metrics.friction >= 2)) {
    return RESULT_TYPES.wait;
  }
  if (metrics.switches >= 2 && metrics.switches >= metrics.load) {
    return RESULT_TYPES.tabs;
  }
  if (isSearchHeavy && metrics.load >= metrics.switches) {
    return RESULT_TYPES.search;
  }
  if (metrics.load >= 2) {
    return RESULT_TYPES.doors;
  }
  if (metrics.switches >= 1) {
    return RESULT_TYPES.tabs;
  }
  return RESULT_TYPES.doors;
}

export function getRecoveryData(answers = {}) {
  const retOpt = answers.return;
  if (!retOpt) {
    return {
      title: 'Не настроено',
      returnability: 0,
      recoveryId: 'unknown',
      insight: 'Маршрут пока не отслеживает отвлекшихся пользователей.'
    };
  }

  const map = {
    lost: {
      title: 'Ничего — клиент теряется',
      insight: 'Слабая точка: если клиент отвлечётся и закроет диалог, вернуть его сейчас нельзя.'
    },
    'manager-remind': {
      title: 'Менеджер напоминает вручную',
      insight: 'Возврат работает, но требует ручного труда команды и постоянного контроля.'
    },
    digest: {
      title: 'Общая рассылка',
      insight: 'Клиент получит общее письмо, но оно не привязано к брошенному целевому действию.'
    },
    auto: {
      title: 'Автоматическое напоминание',
      insight: 'Сильная сторона: маршрут аккуратно возвращает клиента без участия менеджера.'
    },
    context: {
      title: 'Контекстное возвращение',
      insight: 'Отличная механика: клиент возвращается ровно на тот шаг, где остановился.'
    },
    unknown: {
      title: 'Не определено',
      insight: 'Сценарий возврата пока остаётся серой зоной.'
    }
  };

  const info = map[retOpt.recoveryId] || map.unknown;
  return {
    title: info.title,
    recoveryId: retOpt.recoveryId || 'unknown',
    returnability: retOpt.returnability || 0,
    insight: info.insight
  };
}

export function getPersonalInsight(answers = {}) {
  const parts = [];
  if (answers.first_touch?.routeTitle) parts.push(`начинается через «${answers.first_touch.routeTitle.toLowerCase()}»`);
  if (answers.offer_info?.routeTitle) parts.push(`информация выясняется через «${answers.offer_info.routeTitle.toLowerCase()}»`);
  if (answers.choice?.routeTitle) parts.push(`выбор делается через «${answers.choice.routeTitle.toLowerCase()}»`);
  if (answers.action?.routeTitle) parts.push(`финал проходит как «${answers.action.routeTitle.toLowerCase()}»`);

  if (parts.length < 2) return 'Маршрут сформирован на основе ваших ответов.';
  return `Твой маршрут: ${parts.join(', затем ')}.`;
}
