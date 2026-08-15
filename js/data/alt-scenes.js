/**
 * js/data/alt-scenes.js — Интерактивные эпизоды второго акта
 */

export const ALT_EPISODES = {
  first_touch: {
    sceneId: 'first_touch',
    title: 'Первое касание (Улучшенный путь)',
    subtitle: 'Ты снова видишь предложение. Но теперь всё собрано в одном месте.',
    question: 'Что делаешь?',
    icon: 'sparkles',
    options: [
      {
        id: 'alt-touch-direct',
        text: 'Нажимаю «Узнать подробнее» в боте',
        effects: { load: 0, switches: 0, friction: 0, interest: 0 },
        reaction: 'Мгновенный вход в сценарий без переходов и поиска.',
        routeTitle: 'Единая точка входа'
      },
      {
        id: 'alt-touch-menu',
        text: 'Выбираю интересующую тему в меню',
        effects: { load: 0, switches: 0, friction: 0, interest: 0 },
        reaction: 'Сразу открывается нужная ветка маршрута.',
        routeTitle: 'Прямой пункт меню'
      }
    ]
  },
  offer_info: {
    sceneId: 'offer_info',
    title: 'Понимание условий (Улучшенный путь)',
    subtitle: 'Ты хочешь быстро узнать цену, формат и результат.',
    question: 'Что хочешь узнать в первую очередь?',
    icon: 'file-text',
    options: [
      {
        id: 'alt-info-price',
        text: 'Сколько стоит и тарифы',
        effects: { load: 0, switches: 0, friction: 0, interest: 0 },
        reaction: 'Нашлось с первого раза. Стоимость видна сразу.',
        routeTitle: 'Прозрачные цены'
      },
      {
        id: 'alt-info-format',
        text: 'Что входит и какой формат',
        effects: { load: 0, switches: 0, friction: 0, interest: 0 },
        reaction: 'Короткий структурированный список без лишней «воды».',
        routeTitle: 'Структура предложения'
      }
    ]
  },
  choice: {
    sceneId: 'choice',
    title: 'Выбор продукта (Улучшенный путь)',
    subtitle: 'Перед тобой понятная линейка или умный помощник.',
    question: 'Как делаешь выбор?',
    icon: 'layout-grid',
    options: [
      {
        id: 'alt-choice-quiz',
        text: 'Отвечаю на 2 вопроса в экспресс-подборе',
        effects: { load: 0, switches: 0, friction: 0, interest: 0 },
        reaction: 'Идеальный тариф подобран за 10 секунд.',
        routeTitle: 'Умный экспресс-подбор'
      },
      {
        id: 'alt-choice-cards',
        text: 'Сравниваю 2 главных тарифа в карточках',
        effects: { load: 0, switches: 0, friction: 0, interest: 0 },
        reaction: 'Ключевые отличия понятны с первого взгляда.',
        routeTitle: 'Наглядное сравнение'
      }
    ]
  },
  action: {
    sceneId: 'action',
    title: 'Целевое действие (Улучшенный путь)',
    subtitle: 'Ты готов оставить заявку или оплатить.',
    question: 'Как подтверждаешь действие?',
    icon: 'check-circle-2',
    options: [
      {
        id: 'alt-act-instant',
        text: 'Жму кнопку «Подтвердить» в 1 клик',
        effects: { load: 0, switches: 0, friction: 0, interest: 0 },
        reaction: 'Данные подтянуты автоматически. Действие завершено.',
        routeTitle: 'Оформление в 1 клик'
      },
      {
        id: 'alt-act-short',
        text: 'Ввожу только телефон и жму кнопку',
        effects: { load: 0, switches: 0, friction: 0, interest: 0 },
        reaction: 'Быстрый ввод без лишних регистраций и длинных анкет.',
        routeTitle: 'Минимум полей'
      }
    ]
  }
};
