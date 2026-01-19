# ✅ Railway Deploy Checklist - Готовность к деплою

## 📋 Статус конфигурационных файлов

### ✅ Готовые файлы

1. **`Dockerfile`** ✅
   - Использует `oven/bun:1.3.5`
   - Устанавливает зависимости через `bun install`
   - Собирает фронтенд через `bun run build`
   - Запускает сервер через `bun start` (порт 5000)

2. **`railway.json`** ✅
   - Указан builder: `DOCKERFILE`
   - Указан путь к Dockerfile: `Dockerfile`
   - Настроен restart policy: `ON_FAILURE` с максимум 10 попытками

3. **`nixpacks.toml`** ✅ (резервный вариант)
   - Указаны Node.js 20 и Bun
   - Команды установки, сборки и запуска

4. **`server.ts`** ✅ (обновлён)
   - Раздаёт статический фронтенд из `dist/`
   - Health check endpoint: `/health`
   - SPA fallback для всех маршрутов
   - CORS настроен для production

5. **`package.json`** ✅
   - Скрипт `build`: `bun run copy-teacher-images && vite build`
   - Скрипт `start`: `tsx server.ts`
   - Все зависимости указаны

6. **`copy-teacher-images.js`** ✅ (исправлен)
   - Не падает при отсутствии файлов (только предупреждения)
   - Создаёт директории автоматически

---

## 🚀 Что нужно сделать для деплоя

### Шаг 1: Проверка локально

```bash
# Убедись, что проект собирается без ошибок
bun install
bun run build

# Проверь, что сервер запускается
bun start
# Открой http://localhost:5000/health - должен вернуть {"status":"ok",...}
```

### Шаг 2: Push в GitHub

```bash
git add .
git commit -m "Ready for Railway deployment"
git push origin main
```

### Шаг 3: Создание проекта на Railway

1. Зайди на [railway.app](https://railway.app)
2. **New Project** → **Deploy from GitHub Repo**
3. Выбери свой репозиторий
4. Railway автоматически определит Dockerfile

### Шаг 4: Настройка Environment Variables

В Railway Dashboard → **Variables** добавь:

#### Обязательные:
- `VITE_SUPABASE_URL` = `https://iusctesnflzacsjksozt.supabase.co`
- `VITE_SUPABASE_PUBLISHABLE_KEY` = `sb_publishable_U3VLAHp7uU4N1ltkv2JdJg_5DA5ZONq`
- `SUPABASE_SERVICE_ROLE_KEY` = `sb_secret_AyDA2jvBFZoPrd3dL6TkHA_C8e0TH1o`

#### Опциональные:
- `TELEGRAM_BOT_TOKEN` = (если используешь бота)
- `FRONTEND_URL` = (если фронтенд на отдельном домене, например Vercel)
- `PORT` = (Railway обычно задаёт автоматически, но можно указать явно)

### Шаг 5: Проверка деплоя

После успешного билда Railway выдаст URL вида:
- `https://<project-name>.up.railway.app`

Проверь:
1. **Health check**: `https://<project-name>.up.railway.app/health`
   - Должен вернуть: `{"status":"ok","timestamp":"..."}`

2. **Frontend**: `https://<project-name>.up.railway.app`
   - Должна открыться главная страница сайта

---

## 🔍 Возможные проблемы и решения

### Проблема: Build падает на `bun run build`

**Решение:**
- Проверь логи билда в Railway Dashboard → **Deploy Logs**
- Чаще всего это синтаксическая ошибка в JSX/TSX
- Исправь в коде, закоммить и запушь изменения

### Проблема: `/health` возвращает 404

**Решение:**
- Убедись, что `server.ts` запускается корректно
- Проверь логи в Railway Dashboard → **HTTP Logs**
- Убедись, что порт правильный (Railway задаёт через `PORT` env var)

### Проблема: Frontend не загружается / белый экран

**Решение:**
- Проверь, что `dist/` директория создаётся при билде
- Убедись, что `server.ts` правильно раздаёт статику из `dist/`
- Проверь консоль браузера на ошибки (F12)

### Проблема: Supabase не работает

**Решение:**
- Проверь Environment Variables в Railway
- Убедись, что ключи правильные (без пробелов, без кавычек)
- Проверь, что в Supabase применена схема из `database_schema.sql`

---

## 📝 Дополнительные заметки

### Архитектура деплоя

Текущая конфигурация поддерживает **два варианта**:

1. **Вариант A: Полный деплой на Railway** (текущий)
   - Frontend + Backend в одном контейнере
   - Express раздаёт статику из `dist/`
   - Один URL для всего приложения

2. **Вариант B: Раздельный деплой** (опционально)
   - Frontend на Vercel
   - Backend на Railway (только API)
   - Нужно будет убрать раздачу статики из `server.ts`

### Порты

- Railway автоматически задаёт порт через переменную `PORT`
- В `server.ts` есть fallback на `5000` для локальной разработки
- Railway проксирует трафик на этот порт

### Кэширование

- Railway кэширует Docker layers
- При изменении только кода (не зависимостей) билд будет быстрее
- При изменении `package.json` билд займёт больше времени

---

## ✅ Финальная проверка перед деплоем

- [ ] Локально `bun run build` проходит без ошибок
- [ ] Локально `bun start` запускает сервер и `/health` работает
- [ ] Все изменения закоммичены и запушены в GitHub
- [ ] Environment Variables подготовлены (Supabase ключи)
- [ ] Railway проект создан и подключён к репозиторию
- [ ] Variables добавлены в Railway Dashboard

**Готово к деплою! 🚀**

