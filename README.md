# 🚀 Интерактивный симулятор «Ты бы дошёл?»

Мобильное Vibe-приложение — игровой симулятор клиентского опыта. Позволяет владельцу бизнеса пройти маршрут собственного клиента, увидеть узкие места воронки и ощутить разницу с бесшовным путем.

---

## 🛠️ Стек технологий
* **HTML5** + **Vanilla JavaScript** (ES Modules)
* **Tailwind CSS** (CDN) + **Lucide Icons** (CDN) + **Inter Font** (Google Fonts)
* **Notibot Bridge SDK** (локальный скрипт для Telegram/Notibot)
* Без сборщиков (чистый статический проект для GitHub Pages / Notibot)

---

## ⚡ Как запустить локально
```bash
npm start
# Или любой статический сервер:
# npx serve .
```

---

## 🧪 Проверка правил и кода
```bash
npm run audit
```

---

## 📂 Структура проекта
* `index.html` — точка входа (CSP, подключение библиотек).
* `css/styles.css` — стили, темы, анимации HUD, Bottom Sheet.
* `js/data/` — массивы сценариев, альтернативных эпизодов и результатов.
* `js/components/` — изолированные экраны приложения.
* `js/bridge.js` — адаптер Notibot SDK (haptics, темы, лид-форма).
* `js/state.js`, `js/scoring.js`, `js/results.js`, `js/alternate.js` — игровая логика.
