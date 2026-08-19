export const GOALS = [
  { id: 'lead', label: 'Оставить заявку', action: 'оставить заявку', icon: 'send' },
  { id: 'book', label: 'Записаться', action: 'записаться', icon: 'calendar-check' },
  { id: 'choose', label: 'Выбрать продукт', action: 'выбрать продукт', icon: 'layout-grid' },
  { id: 'buy', label: 'Купить', action: 'купить', icon: 'shopping-bag' },
  { id: 'register', label: 'Зарегистрироваться', action: 'зарегистрироваться', icon: 'badge-check' },
  { id: 'material', label: 'Получить материал', action: 'получить материал', icon: 'download' },
  { id: 'other', label: 'Другое', action: 'сделать целевое действие', icon: 'route' },
];

export function getGoal(id) {
  return GOALS.find((goal) => goal.id === id) || GOALS[0];
}
