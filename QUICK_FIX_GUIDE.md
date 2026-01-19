# 🚀 Быстрое исправление: Admin → Frontend синхронизация

## Проблема
Данные, добавленные через Supabase Admin Dashboard, не отображаются на сайте.

## Причина
Поле `published` по умолчанию `false`, а Frontend показывает только записи с `published = true`.

## Решение (3 шага)

### Шаг 1: Применить миграцию

**Через Supabase Dashboard:**
1. Откройте Supabase Dashboard → SQL Editor
2. Скопируйте содержимое файла `supabase/migrations/20250118000000_fix_published_default_admin_sync.sql`
3. Вставьте и выполните (Run)

**Через CLI:**
```bash
cd supabase
supabase migration up
```

### Шаг 2: Опубликовать существующие записи (если нужно)

Если у вас есть записи, которые не отображаются, выполните в SQL Editor:

```sql
-- Опубликовать все неопубликованные записи
UPDATE news SET published = true WHERE published = false;
UPDATE events SET published = true WHERE published = false;
UPDATE gallery SET published = true WHERE published = false;
UPDATE teachers SET published = true WHERE published = false;
UPDATE departments SET published = true WHERE published = false;
```

### Шаг 3: При создании новых записей

**ВАЖНО:** При добавлении записей через Supabase Admin Dashboard обязательно установите `published = true`!

**Или используйте Frontend Admin Panel** (`/admin/*`) - там есть удобный переключатель.

---

## ✅ Проверка

1. Создайте тестовую запись через Admin Dashboard с `published = true`
2. Откройте публичную страницу сайта
3. Убедитесь, что запись отображается

---

📖 **Подробная документация:** см. `ADMIN_TO_FRONTEND_SYNC_FIX.md`

