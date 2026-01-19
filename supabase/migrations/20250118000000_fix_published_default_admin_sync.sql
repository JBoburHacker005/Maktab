-- ============================================
-- МИГРАЦИЯ: Исправление синхронизации Admin → Frontend
-- Проблема: Данные, добавленные через Supabase Admin Dashboard, не отображаются на Frontend
-- Причина: published DEFAULT false + Frontend фильтрует по .eq('published', true)
-- Решение: Добавление комментариев и документации для администраторов
-- ============================================

-- Комментарии к таблицам для напоминания администраторам
COMMENT ON TABLE public.news IS 
'ВАЖНО: При добавлении записей через Supabase Admin Dashboard обязательно установите published = true, иначе запись не будет видна на Frontend. Frontend фильтрует по .eq(''published'', true)';

COMMENT ON TABLE public.events IS 
'ВАЖНО: При добавлении записей через Supabase Admin Dashboard обязательно установите published = true, иначе запись не будет видна на Frontend. Frontend фильтрует по .eq(''published'', true)';

COMMENT ON TABLE public.gallery IS 
'ВАЖНО: При добавлении записей через Supabase Admin Dashboard обязательно установите published = true, иначе запись не будет видна на Frontend. Frontend фильтрует по .eq(''published'', true)';

COMMENT ON TABLE public.teachers IS 
'ВАЖНО: При добавлении записей через Supabase Admin Dashboard обязательно установите published = true, иначе запись не будет видна на Frontend. Frontend фильтрует по .eq(''published'', true)';

COMMENT ON TABLE public.departments IS 
'ВАЖНО: При добавлении записей через Supabase Admin Dashboard обязательно установите published = true, иначе запись не будет видна на Frontend. Frontend фильтрует по .eq(''published'', true)';

-- Комментарии к полю published для каждой таблицы
COMMENT ON COLUMN public.news.published IS 
'Флаг публикации. Должен быть TRUE для отображения на Frontend. По умолчанию FALSE для безопасности.';

COMMENT ON COLUMN public.events.published IS 
'Флаг публикации. Должен быть TRUE для отображения на Frontend. По умолчанию FALSE для безопасности.';

COMMENT ON COLUMN public.gallery.published IS 
'Флаг публикации. Должен быть TRUE для отображения на Frontend. По умолчанию FALSE для безопасности.';

COMMENT ON COLUMN public.teachers.published IS 
'Флаг публикации. Должен быть TRUE для отображения на Frontend. По умолчанию FALSE для безопасности.';

COMMENT ON COLUMN public.departments.published IS 
'Флаг публикации. Должен быть TRUE для отображения на Frontend. По умолчанию FALSE для безопасности.';

-- ============================================
-- ДОПОЛНИТЕЛЬНО: Функция для массовой публикации существующих записей (опционально)
-- Используйте только если нужно опубликовать все существующие записи
-- ============================================

-- Функция для публикации всех неопубликованных записей (использовать с осторожностью!)
CREATE OR REPLACE FUNCTION public.publish_all_unpublished_news()
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  updated_count INTEGER;
BEGIN
  UPDATE public.news 
  SET published = true 
  WHERE published = false;
  
  GET DIAGNOSTICS updated_count = ROW_COUNT;
  RETURN updated_count;
END;
$$;

-- Аналогичные функции для других таблиц (раскомментируйте при необходимости)
/*
CREATE OR REPLACE FUNCTION public.publish_all_unpublished_events()
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  updated_count INTEGER;
BEGIN
  UPDATE public.events 
  SET published = true 
  WHERE published = false;
  
  GET DIAGNOSTICS updated_count = ROW_COUNT;
  RETURN updated_count;
END;
$$;

CREATE OR REPLACE FUNCTION public.publish_all_unpublished_gallery()
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  updated_count INTEGER;
BEGIN
  UPDATE public.gallery 
  SET published = true 
  WHERE published = false;
  
  GET DIAGNOSTICS updated_count = ROW_COUNT;
  RETURN updated_count;
END;
$$;

CREATE OR REPLACE FUNCTION public.publish_all_unpublished_teachers()
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  updated_count INTEGER;
BEGIN
  UPDATE public.teachers 
  SET published = true 
  WHERE published = false;
  
  GET DIAGNOSTICS updated_count = ROW_COUNT;
  RETURN updated_count;
END;
$$;

CREATE OR REPLACE FUNCTION public.publish_all_unpublished_departments()
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  updated_count INTEGER;
BEGIN
  UPDATE public.departments 
  SET published = true 
  WHERE published = false;
  
  GET DIAGNOSTICS updated_count = ROW_COUNT;
  RETURN updated_count;
END;
$$;
*/

