/**
 * js/data/scenes-one.js — Сцены 1–3
 */

export const SCENES_PART_ONE = [
  {
    id: 'first_touch',
    title: 'Первое касание',
    subtitle: 'Тебя заинтересовало предложение. Хочется быстро понять, что это и подходит ли тебе.',
    question: 'Что приходится делать дальше?',
    icon: 'sparkles',
    options: [
      { id: 'one-button', text: 'Нажать одну понятную кнопку', effects: { load: 0, switches: 0, friction: 0, interest: 0 }, reaction: 'Прямой маршрут без лишних остановок.', routeTitle: 'Понятная кнопка' },
      { id: 'search-channel', text: 'Искать информацию в канале', effects: { load: 1, friction: 1, interest: -1 }, reaction: 'Информация есть. Осталось её найти.', routeTitle: 'Поиск в канале' },
      { id: 'open-site', text: 'Перейти на сайт', effects: { switches: 1, load: 0 }, reaction: 'Ещё одна вкладка. И ещё одна.', routeTitle: 'Переход на сайт' },
      { id: 'write-person', text: 'Написать человеку', effects: { friction: 1, manual: 1, interest: -1 }, reaction: 'Кажется, теперь всё зависит от того, когда ответят.', routeTitle: 'Диалог с человеком' },
      { id: 'multi-links', text: 'Выбрать из нескольких ссылок', effects: { load: 1, switches: 1 }, reaction: 'Пять дверей. Где-то за одной из них нужное.', routeTitle: 'Выбор из ссылок' }
    ]
  },
  {
    id: 'offer_info',
    title: 'Понимание предложения',
    subtitle: 'Интерес ещё есть. Теперь хочется понять условия, цену и что именно получишь.',
    question: 'Где клиент это выясняет?',
    icon: 'file-text',
    options: [
      { id: 'single-page', text: 'Всё понятно на одной странице', effects: { load: 0, switches: 0 }, reaction: 'Формат, цена и результат сразу перед глазами.', routeTitle: 'Условия на странице' },
      { id: 'many-pages', text: 'Открывает несколько страниц', effects: { switches: 1, load: 1, friction: 1 }, reaction: 'Чтобы узнать цену, открываем третью вкладку.', routeTitle: 'Несколько страниц' },
      { id: 'read-posts', text: 'Читает посты и закрепленные сообщения', effects: { load: 1, friction: 1 }, reaction: 'Погружение в архив постов ради одного ответа.', routeTitle: 'Чтение постов' },
      { id: 'search-price', text: 'Ищет программу или прайс', effects: { load: 1, friction: 1, interest: -1 }, reaction: 'Цена есть. Но она любит прятки.', routeTitle: 'Поиск прайса' },
      { id: 'ask-chat', text: 'Пишет вопрос в чат / менеджеру', effects: { friction: 1, manual: 1 }, reaction: 'Вопрос отправлен. Засекаем время ответа.', routeTitle: 'Вопрос в чат' },
      { id: 'wait-consult', text: 'Ждёт консультацию', effects: { friction: 2, manual: 1, interest: -1 }, reaction: 'Менеджер свяжется с вами в течение дня.', routeTitle: 'Ожидание консультации' }
    ]
  },
  {
    id: 'choice',
    title: 'Выбор продукта',
    subtitle: 'Вроде подходит. Осталось понять, какой вариант выбрать.',
    question: 'Что делает клиент?',
    icon: 'layout-grid',
    options: [
      { id: 'obvious-one', text: 'Видит один очевидный вариант', effects: { load: 0 }, reaction: 'Выбор без мучительных сомнений.', routeTitle: 'Один вариант' },
      { id: 'compare-simple', text: 'Сравнивает 2–3 понятных тарифа', effects: { load: 0 }, reaction: 'Понятная разница: базовый или расширенный.', routeTitle: 'Сравнение 2-3 тарифов' },
      { id: 'huge-lineup', text: 'Разбирается в большой линейке', effects: { load: 2, interest: -1 }, reaction: 'Таблица тарифов на 15 пунктов. Придётся вчитываться.', routeTitle: 'Сложная линейка' },
      { id: 'interactive-quiz', text: 'Проходит короткий подбор', effects: { load: 0 }, reaction: 'Пара кликов — и подходящий тариф на экране.', routeTitle: 'Короткий подбор' },
      { id: 'ask-manager', text: 'Спрашивает совет у менеджера', effects: { friction: 1, manual: 1 }, reaction: '«А какой вариант мне лучше подойдёт?»', routeTitle: 'Совет менеджера' },
      { id: 'guess', text: 'Выбирает наугад', effects: { load: 1, friction: 1, interest: -1 }, reaction: 'Пальцем в небо. Надеемся, что попали.', routeTitle: 'Выбор наугад' }
    ]
  }
];
