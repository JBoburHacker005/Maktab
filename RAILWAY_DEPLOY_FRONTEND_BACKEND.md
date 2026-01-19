## Railway deploy: frontend + backend

Этот проект уже готов к деплою на Railway с помощью Docker. Один контейнер запускает:
- **Frontend**: статически собранный Vite/React (через `bun run build`).
- **Backend**: минимальный Express‑сервер из `server.ts` (порт `5000`, эндпоинт `/health`).

Ниже — полный чек‑лист настройки.

---

## 1. Подготовка репозитория

- Убедись, что на GitHub (или другом git‑хостинге) лежит **актуальная версия кода**:
  - Все последние изменения закоммичены и запушены.
  - Файл `Dockerfile` в корне проекта **не менялся вручную** (в репо уже лежит корректная версия).

---

## 2. Создание проекта на Railway (web‑сервис)

1. Зайди в [`railway.app`](https://railway.app) под своим аккаунтом.
2. Нажми **New Project** → **Deploy from GitHub Repo**.
3. Выбери репозиторий с этим проектом.
4. Railway автоматически прочитает `railway.json` и `Dockerfile`:
   - builder: **DOCKERFILE**
   - Dockerfile path: `Dockerfile`

После создания проекта Railway сам запустит первый билд и деплой.

---

## 3. Важные переменные окружения (Environment Variables)

Зайди во вкладку **Variables** сервиса `web` и создай переменные:

### 3.1. Supabase (обязательно)

- `VITE_SUPABASE_URL` — URL проекта Supabase  
  Пример: `https://<your-project>.supabase.co`
- `VITE_SUPABASE_PUBLISHABLE_KEY` — public `anon` key из Supabase.
- `SUPABASE_SERVICE_ROLE_KEY` — `service_role` key из Supabase (используется только на сервере, не на клиенте).

Эти значения можно взять в Supabase Dashboard → **Settings → API**.

### 3.2. Telegram Bot (если используешь бота)

- `TELEGRAM_BOT_TOKEN` — токен бота от `@BotFather`.

### 3.3. Server / CORS

- `PORT` — Railway обычно сам задаёт порт через системную переменную, но в Express‑сервере уже есть fallback `5000`. Дополнительно можно задать:
  - `FRONTEND_URL` — если фронтенд будет на отдельном домене (например, на Vercel):  
    Пример: `https://ima-uz.vercel.app`

---

## 4. Как работает Dockerfile на Railway

Файл `Dockerfile` делает следующее:

```Dockerfile
FROM oven/bun:1.3.5 AS base
WORKDIR /app

# 1) Установка зависимостей
COPY package.json ./
RUN bun install

# 2) Копирование кода и сборка фронтенда
COPY . .
RUN bun run build

# 3) Запуск backend-сервера
EXPOSE 5000
ENV NODE_ENV=production
CMD ["bun", "start"]
```

- Команда `bun run build`:
  - Копирует изображения учителей в `public/teachers` (`copy-teacher-images.js`).
  - Собирает Vite/React в режим production (`vite build`).
- Команда `bun start`:
  - Запускает `server.ts` (`express` сервер) на порту `5000`.
  - Эндпоинт `/health` отдаёт `{ status: 'ok', timestamp: ... }`.

---

## 5. Настройка домена и проверка здоровья сервиса

После успешного деплоя Railway выдаст домен вида:

- `https://<project-name>.up.railway.app`

### 5.1. Проверка health‑эндпоинта

Открой в браузере или через curl:

- `https://<project-name>.up.railway.app/health`

Ожидаемый ответ:

```json
{ "status": "ok", "timestamp": "..." }
```

Если это работает — backend запущен корректно.

---

## 6. Варианты использования frontend

### Вариант A: фронтенд как статический билд (рекомендуется Vercel)

Архитектура проекта изначально рассчитана на:

- **Frontend**: Vite/React на Vercel.
- **Backend / Telegram bot**: Railway.
- **Database**: Supabase.

Рекомендуемый вариант:

1. Оставить на Railway только backend (этот контейнер с `/health`, Telegram‑ботом и доступом к Supabase).
2. Собрать фронтенд отдельно на Vercel (или другом static hosting):
   - В Vercel указать:
     - Build Command: `npm run build` (или `bun run build`, если используешь Bun).
     - Output Directory: `dist`.
   - В Variables на Vercel задать:
     - `VITE_SUPABASE_URL`
     - `VITE_SUPABASE_PUBLISHABLE_KEY`
     - `VITE_API_URL` — URL Railway backend, если будешь вызывать его с фронта.

### Вариант B: фронтенд + backend в одном контейнере на Railway

Текущий `Dockerfile` уже собирает фронтенд и запускает backend. Для полного объединения нужно:

- Убедиться, что сервер либо:
  - Раздаёт собранный фронтенд (`dist`) как статический контент, **или**
  - Ты используешь Railway только как API/бот, а фронтенд всё равно идёт через Vercel.

Сейчас `server.ts` — минимальный (только `/health`). Если хочешь полностью обслуживать SPA с Railway, можно доработать:

```ts
// server.ts (идея)
import path from 'path';
import express from 'express';

const app = express();
const PORT = process.env.PORT || 5000;

const distPath = path.join(__dirname, 'dist');
app.use(express.static(distPath));

app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// SPA fallback
app.get('*', (req, res) => {
  res.sendFile(path.join(distPath, 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server listening on ${PORT}`);
});
```

Если пойдёшь по этому пути — фронтенд и backend будут жить по одному Railway‑домену.

---

## 7. Типичный сценарий деплоя шаг за шагом

1. **Локально**:
   - Настроить `.env` (см. `ENV_TEMPLATE.md`).
   - Убедиться, что `bun run build` проходит без ошибок.
   - Закоммитить и запушить изменения.

2. **Railway**:
   - Создать проект из репозитория.
   - Задать Variables: Supabase, Telegram bot, `FRONTEND_URL` (если нужно).
   - Дождаться успешного билда Docker‑образа.
   - Проверить `/health` по Railway‑URL.

3. **(Опционально) Vercel**:
   - Подключить тот же репозиторий.
   - Настроить Build (`npm run build` / `bun run build`) и Output dir `dist`.
   - Задать `VITE_SUPABASE_URL`, `VITE_SUPABASE_PUBLISHABLE_KEY`, `VITE_API_URL` (URL Railway).
   - Деплой и финальная проверка UI.

---

## 8. Частые проблемы при деплое на Railway

- **Сборка падает на шаге `bun run build`**:
  - Смотреть build logs: чаще всего это синтаксическая ошибка в JSX/TSX или неправильный импорт.
  - Исправить в репозитории, запушить, заново деплоить.

- **Supabase не отвечает / пустые данные**:
  - Проверить `VITE_SUPABASE_URL` и `VITE_SUPABASE_PUBLISHABLE_KEY` в Railway Variables.
  - Убедиться, что в Supabase применена схема из `database_schema.sql` и есть тестовые данные.

- **CORS‑ошибки с фронтенда**:
  - Убедиться, что переменная `FRONTEND_URL` на Railway соответствует фактическому домену фронтенда.

---

Если будешь использовать чисто Railway (без Vercel) и хочешь, чтобы Express раздавал SPA из `dist`, можно доработать `server.ts` по примеру выше — я могу это тоже реализовать в коде.


