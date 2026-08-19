const option = (id, label, icon, route, effect = {}, reaction = '') => ({ id, label, icon, route, effect, reaction });

export const SCENES_ONE = [
  {
    id: 'first-touch',
    kicker: 'Первое касание',
    title: 'Тебя заинтересовало предложение',
    text: 'Хочется быстро понять, что это и подходит ли тебе.',
    question: 'Что приходится делать дальше?',
    options: [
      option('one-button', 'Нажать одну понятную кнопку', 'mouse-pointer-click', 'Понятная кнопка'),
      option('search-channel', 'Искать информацию в канале', 'search', 'Поиск в канале', { load: 1, friction: 1, search: 2 }, 'Информация есть. Осталось её найти.'),
      option('website', 'Перейти на сайт', 'external-link', 'Сайт', { switches: 1 }, 'Новая вкладка. Интерес пока с тобой.'),
      option('message', 'Написать человеку', 'message-circle', 'Менеджер', { friction: 1, manual: 2, interest: -1 }, 'Кажется, теперь всё зависит от ответа.'),
      option('links', 'Выбрать из нескольких ссылок', 'split', 'Меню ссылок', { load: 1 }, 'Пять дверей. Где-то за одной из них нужное.'),
    ],
    alt: {
      title: 'Следующий шаг перед глазами',
      text: 'Больше не нужно искать вход или угадывать, куда нажать.',
      icon: 'door-open',
      question: 'Что тебе нужно узнать сейчас?',
      options: [
        option('alt-entry-offer', 'Понять, что мне предлагают', 'badge-info', 'Описание', {}, 'Нужное открылось сразу.'),
        option('alt-entry-fit', 'Проверить, подходит ли мне', 'scan-search', 'Проверка подходящего варианта', {}, 'Без прогулки по меню.'),
      ],
    },
  },
  {
    id: 'clarity',
    kicker: 'Условия',
    title: 'Интерес ещё есть',
    text: 'Теперь хочется понять цену, условия и что именно получишь.',
    question: 'Где клиент это выясняет?',
    options: [
      option('one-page', 'Всё понятно на одной странице', 'file-check', 'Условия в одном месте'),
      option('pages', 'Открывает несколько страниц', 'panels-top-left', 'Несколько страниц', { load: 1, switches: 1 }, 'Ещё одна вкладка. И ещё одна.'),
      option('posts', 'Читает посты', 'newspaper', 'Посты канала', { load: 1, friction: 1, search: 2 }, 'Где-то там был пост с ценой.'),
      option('price-search', 'Ищет программу или прайс', 'file-search', 'Поиск прайса', { load: 1, friction: 1, search: 2, interest: -1 }, 'Цена есть. Но она любит прятки.'),
      option('ask', 'Пишет вопрос', 'messages-square', 'Вопрос менеджеру', { friction: 1, manual: 2 }, 'Вопрос отправлен. Теперь ждём.'),
      option('consult', 'Ждёт консультацию', 'clock-3', 'Ожидание консультации', { friction: 2, manual: 3, interest: -1 }, 'Пока ответа нет, решение тоже подождёт.'),
    ],
    alt: {
      title: 'Теперь всё нужное перед тобой',
      text: 'Условия не нужно вылавливать из потока.',
      icon: 'scan-text',
      question: 'Открой нужную информацию',
      options: [
        option('alt-clarity-content', 'Что входит', 'list-checks', 'Состав продукта', {}, 'Нашлось с первого раза.'),
        option('alt-clarity-price', 'Сколько стоит', 'badge-russian-ruble', 'Цена', {}, 'Цена не прячется. Непривычно, да?'),
        option('alt-clarity-format', 'Как всё проходит', 'workflow', 'Формат', {}, 'Один клик. Без консультации по навигации.'),
      ],
    },
  },
];
