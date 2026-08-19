const option = (id, label, icon, route, effect = {}, reaction = '') => ({ id, label, icon, route, effect, reaction });

export const SCENES_TWO = [
  {
    id: 'choice',
    kicker: 'Выбор продукта',
    title: 'Вроде подходит',
    text: 'Осталось понять, какой именно вариант выбрать.',
    question: 'Что делает клиент?',
    options: [
      option('obvious', 'Видит один очевидный вариант', 'sparkles', 'Один понятный вариант'),
      option('compare', 'Сравнивает 2–3 понятных тарифа', 'columns-2', '2–3 тарифа'),
      option('catalog', 'Разбирается в большой линейке', 'layers', 'Большая линейка', { load: 2, interest: -1 }, 'Таблица тарифов на 15 пунктов. Придётся вчитываться.'),
      option('manager', 'Спрашивает совет у менеджера', 'message-circle-question', 'Выбор через менеджера', { friction: 1, manual: 2 }),
      option('random', 'Выбирает наугад', 'dices', 'Выбор наугад', { load: 1, friction: 1, interest: -1 }, 'Пальцем в небо. Надеемся, что попали.'),
    ],
    alt: {
      title: 'Подходящий вариант уже близко',
      text: 'Вместо всего каталога — один вопрос, который действительно помогает.',
      icon: 'git-compare-arrows',
      question: 'Что тебе сейчас нужно?',
      options: [
        option('alt-choice-speed', 'Быстрый результат', 'gauge', 'Быстрый вариант', {}, 'Остался один подходящий вариант.'),
        option('alt-choice-depth', 'Глубокая проработка', 'layers-3', 'Углублённый вариант', {}, 'Выбор сузился без таблицы на семь экранов.'),
        option('alt-choice-support', 'Поддержка на старте', 'life-buoy', 'Вариант с поддержкой', {}, 'Нужная опция уже на экране.'),
      ],
    },
  },
  {
    id: 'action',
    kicker: 'Целевое действие',
    title: 'Решение принято',
    text: 'Цель уже близко.',
    question: 'Что требуется теперь?',
    dynamic: true,
    options: [
      option('direct', 'Нажать кнопку и выполнить действие', 'zap', 'Целевое действие'),
      option('short-form', 'Заполнить короткую форму', 'text-cursor-input', 'Короткая форма', { friction: 1 }),
      option('platform', 'Перейти ещё на одну площадку', 'move-up-right', 'Ещё одна площадка', { switches: 1, friction: 1, interest: -1 }, 'Финальная прямая. И ещё один переход.'),
      option('write-manager', 'Написать менеджеру', 'message-square-more', 'Диалог с менеджером', { friction: 2, manual: 3, interest: -1 }),
      option('long-form', 'Заполнить длинную анкету', 'clipboard-list', 'Длинная анкета', { load: 1, friction: 2, interest: -1 }),
      option('auth', 'Сначала зарегистрироваться', 'key-round', 'Регистрация', { load: 1, friction: 2, interest: -1 }),
    ],
    alt: {
      title: 'Решение уже принято',
      text: 'Не нужно ещё раз доказывать свою заинтересованность.',
      icon: 'flag',
      question: '',
      options: [
        option('alt-action-now', 'Выполнить целевое действие', 'zap', 'Целевое действие', {}, 'Готово. Не пришлось ещё раз доказывать, что ты действительно заинтересован.'),
        option('alt-action-short', 'Ответить на два коротких вопроса', 'text-cursor-input', 'Короткая форма', { friction: 1 }, 'Два поля. Ни одного сочинения.'),
      ],
    },
  },
  {
    id: 'return',
    kicker: 'После действия',
    title: 'Клиент отвлёкся и не закончил',
    text: 'Такое случается даже с самыми мотивированными.',
    question: 'Что происходит?',
    options: [
      option('lost', 'Ничего, мы его потеряли', 'user-x', 'Маршрут прерван', { returnability: -2 }),
      option('manager-remind', 'Менеджер может написать', 'user-round-check', 'Ручное напоминание', { manual: 2, returnability: 1 }),
      option('broadcast', 'Получит общую рассылку', 'mails', 'Общая рассылка', { returnability: 1 }),
      option('auto', 'Получит автоматическое напоминание', 'bell-ring', 'Автонапоминание', { returnability: 2 }),
      option('context', 'Получит сообщение по своему действию', 'message-circle-heart', 'Контекстное возвращение', { returnability: 3 }),
      option('unknown', 'Не знаю', 'help-circle', 'Нет сценария возврата', { returnability: -1 }),
    ],
    alt: {
      title: 'Маршрут помнит клиента',
      text: 'Если человек отвлёкся, контекст не исчезает.',
      icon: 'history',
      question: 'Куда вернёмся?',
      options: [
        option('alt-return-step', 'К незавершённому шагу', 'undo-2', 'Возврат к шагу', {}, 'Вот он. Не нужно вспоминать, где ты был.'),
        option('alt-return-details', 'К сохранённому выбору', 'bookmark-check', 'Возврат к выбору', {}, 'Выбор на месте. Маршрут не обнулился.'),
      ],
    },
  },
];
