export const CONFIG = {
  appName: 'Ты бы дошёл?',
  ui: {
    maxWidth: '34rem',
    feedbackDelay: 2600,
    maxMetricValue: 5,
    minMetricValue: 0,
  },
  notibot: {
    formId: '5o9Qgbk90iwL4vryUdjyGW',
    // Куда перенаправить клиента после отправки (ссылка на канал, личку t.me/username, статью /page/ID или сайт).
    // Если оставить пустым ('') — приложение поблагодарит и закроется, вернув клиента в чат с ботом.
    redirectUrl: '',
    autoClose: true,
  },
};
