/**
 * js/data/scenes-two.js — Цели, Сцена 5 (Action) и Сцена 6 (Return)
 */

export const GOALS = [
  { id: 'apply', title: 'Оставить заявку', prep: 'до заявки', targetAction: 'оставить заявку' },
  { id: 'book', title: 'Записаться', prep: 'до записи', targetAction: 'записаться' },
  { id: 'choose', title: 'Выбрать продукт', prep: 'до выбора', targetAction: 'выбрать продукт' },
  { id: 'buy', title: 'Купить', prep: 'до покупки', targetAction: 'купить' },
  { id: 'register', title: 'Зарегистрироваться', prep: 'до регистрации', targetAction: 'зарегистрироваться' },
  { id: 'material', title: 'Получить материал', prep: 'до материала', targetAction: 'получить материал' },
  { id: 'other', title: 'Другое действие', prep: 'до цели', targetAction: 'сделать целевое действие' }
];

export const SCENE_ACTION = {
  id: 'action',
  title: 'Целевое действие',
  icon: 'check-circle-2',
  getDynamicContent: (goalId) => {
    if (goalId === 'choose') {
      return {
        subtitle: 'Подходящий вариант найден. Интерес на максимуме.',
        question: 'Что происходит после выбора?'
      };
    }
    const goal = GOALS.find(g => g.id === goalId) || GOALS[0];
    return {
      subtitle: `Решение принято. Осталось ${goal.targetAction}.`,
      question: 'Что требуется теперь?'
    };
  },
  options: [
    {
      id: 'click-done',
      text: 'Нажать одну кнопку и завершить',
      effects: { load: 0, switches: 0, friction: 0 },
      reaction: 'Действие в один клик. Никаких препятствий.',
      routeTitle: 'Быстрое действие'
    },
    {
      id: 'short-form',
      text: 'Заполнить короткую форму (1–2 поля)',
      effects: { load: 0, friction: 1 },
      reaction: 'Пара секунд на ввод — и готово.',
      routeTitle: 'Короткая форма'
    },
    {
      id: 'switch-platform',
      text: 'Перейти ещё на одну площадку',
      effects: { switches: 1, friction: 1 },
      reaction: 'Снова смена контекста на самом финише.',
      routeTitle: 'Переход на площадку'
    },
    {
      id: 'write-manager',
      text: 'Написать менеджеру для подтверждения',
      effects: { friction: 1, manual: 1 },
      reaction: 'Заявка отправлена, ждём ручной проверки.',
      routeTitle: 'Подтверждение менеджера'
    },
    {
      id: 'long-form',
      text: 'Заполнить длинную анкету (5+ полей)',
      effects: { load: 1, friction: 2, interest: -1 },
      reaction: 'Опрос на 10 минут перед финальным шагом.',
      routeTitle: 'Длинная анкета'
    },
    {
      id: 'auth-first',
      text: 'Сначала зарегистрироваться / авторизоваться',
      effects: { load: 1, switches: 1, friction: 2, interest: -1 },
      reaction: 'Создайте пароль, подтвердите почту, вернитесь обратно.',
      routeTitle: 'Обязательная регистрация'
    }
  ]
};

export const SCENE_RETURN = {
  id: 'return',
  title: 'Если клиент остановился',
  subtitle: 'Представим, что клиент отвлёкся на звонок и не закончил действие.',
  question: 'Что происходит дальше?',
  icon: 'history',
  options: [
    {
      id: 'lost',
      text: 'Ничего, мы его потеряли',
      recoveryId: 'lost',
      returnability: -2,
      reaction: 'Контакт оборвался. Клиент ушёл.',
      routeTitle: 'Клиент теряется'
    },
    {
      id: 'manager-remind',
      text: 'Менеджер напишет или позвонит вручную',
      recoveryId: 'manager-remind',
      returnability: 1,
      manual: 1,
      reaction: 'Менеджер вручную находит диалог и напоминает.',
      routeTitle: 'Ручное напоминание'
    },
    {
      id: 'digest',
      text: 'Получит общую рассылку',
      recoveryId: 'digest',
      returnability: 0,
      reaction: 'Общее письмо со всеми новостями канала.',
      routeTitle: 'Общая рассылка'
    },
    {
      id: 'auto',
      text: 'Получит автоматическое напоминание',
      recoveryId: 'auto',
      returnability: 2,
      reaction: 'Через пару часов бот аккуратно напоминает.',
      routeTitle: 'Авто-напоминание'
    },
    {
      id: 'context',
      text: 'Получит сообщение именно по своему шагу',
      recoveryId: 'context',
      returnability: 3,
      reaction: '«Вы остановились на выборе тарифа, продолжим?»',
      routeTitle: 'Контекстный возврат'
    },
    {
      id: 'unknown',
      text: 'Пока не знаю / не настроено',
      recoveryId: 'unknown',
      returnability: -1,
      reaction: 'Серая зона: маршрут не отслеживает брошенные шаги.',
      routeTitle: 'Не настроено'
    }
  ]
};
