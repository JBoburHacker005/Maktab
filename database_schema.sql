-- ============================================
-- TO'LIQ POSTGRESQL DATABASE SCHEMA
-- Maktab Website uchun
-- ============================================
-- Bu skriptni Supabase SQL Editor'da RUN qiling
-- ============================================

-- 1. MAVJUD JADVALLARNI O'CHIRISH (agar mavjud bo'lsa)
DROP TABLE IF EXISTS public.news CASCADE;
DROP TABLE IF EXISTS public.events CASCADE;
DROP TABLE IF EXISTS public.gallery CASCADE;
DROP TABLE IF EXISTS public.teachers CASCADE;
DROP TABLE IF EXISTS public.departments CASCADE;
DROP TABLE IF EXISTS public.admin_permissions CASCADE;
DROP TABLE IF EXISTS public.user_roles CASCADE;
DROP TABLE IF EXISTS public.telegram_user_preferences CASCADE;
DROP TABLE IF EXISTS public.audit_logs CASCADE;

-- 2. MAVJUD FUNKSIYALARNI O'CHIRISH
DROP FUNCTION IF EXISTS public.has_role(UUID, app_role) CASCADE;
DROP FUNCTION IF EXISTS public.has_permission(UUID, admin_permission) CASCADE;
DROP FUNCTION IF EXISTS public.get_role_by_telegram_id(BIGINT) CASCADE;
DROP FUNCTION IF EXISTS public.update_updated_at_column() CASCADE;

-- 3. MAVJUD ENUM'LARNI O'CHIRISH
DROP TYPE IF EXISTS public.app_role CASCADE;
DROP TYPE IF EXISTS public.admin_permission CASCADE;

-- ============================================
-- 4. YANGI ENUM'LARNI YARATISH
-- ============================================

CREATE TYPE public.app_role AS ENUM ('super_admin', 'admin');

CREATE TYPE public.admin_permission AS ENUM (
  'news_create', 'news_edit', 'news_delete',
  'events_create', 'events_edit', 'events_delete',
  'gallery_create', 'gallery_delete',
  'teachers_create', 'teachers_edit', 'teachers_delete',
  'departments_create', 'departments_edit', 'departments_delete'
);

-- ============================================
-- 5. USER ROLES JADVALI
-- ============================================

CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  telegram_user_id BIGINT UNIQUE,
  telegram_username TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- ============================================
-- 6. ADMIN PERMISSIONS JADVALI
-- ============================================

CREATE TABLE public.admin_permissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_role_id UUID REFERENCES public.user_roles(id) ON DELETE CASCADE NOT NULL,
  permission admin_permission NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE (user_role_id, permission)
);

ALTER TABLE public.admin_permissions ENABLE ROW LEVEL SECURITY;

-- ============================================
-- 7. SECURITY FUNKSIYALARI
-- ============================================

CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

CREATE OR REPLACE FUNCTION public.has_permission(_user_id UUID, _permission admin_permission)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.admin_permissions ap
    JOIN public.user_roles ur ON ap.user_role_id = ur.id
    WHERE ur.user_id = _user_id
      AND ap.permission = _permission
  ) OR public.has_role(_user_id, 'super_admin')
$$;

CREATE OR REPLACE FUNCTION public.get_role_by_telegram_id(_telegram_id BIGINT)
RETURNS TABLE (user_id UUID, role app_role)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT user_id, role
  FROM public.user_roles
  WHERE telegram_user_id = _telegram_id
$$;

-- ============================================
-- 8. RLS POLICIES - USER ROLES
-- ============================================

CREATE POLICY "Super admins can view all roles"
ON public.user_roles
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'super_admin'));

CREATE POLICY "Super admins can insert roles"
ON public.user_roles
FOR INSERT
TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'super_admin'));

CREATE POLICY "Super admins can delete roles"
ON public.user_roles
FOR DELETE
TO authenticated
USING (public.has_role(auth.uid(), 'super_admin'));

CREATE POLICY "Admins can view own role"
ON public.user_roles
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- ============================================
-- 9. RLS POLICIES - ADMIN PERMISSIONS
-- ============================================

CREATE POLICY "Super admins can manage permissions"
ON public.admin_permissions
FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'super_admin'))
WITH CHECK (public.has_role(auth.uid(), 'super_admin'));

CREATE POLICY "Admins can view own permissions"
ON public.admin_permissions
FOR SELECT
TO authenticated
USING (
  user_role_id IN (
    SELECT id FROM public.user_roles WHERE user_id = auth.uid()
  )
);

-- ============================================
-- 10. NEWS JADVALI
-- ============================================

CREATE TABLE public.news (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title_uz TEXT NOT NULL,
  title_en TEXT NOT NULL,
  title_ru TEXT NOT NULL,
  content_uz TEXT NOT NULL,
  content_en TEXT NOT NULL,
  content_ru TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'general',
  image_url TEXT,
  author_id UUID REFERENCES auth.users(id),
  published BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.news ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view published news"
ON public.news
FOR SELECT
USING (published = true);

CREATE POLICY "Admins can view all news"
ON public.news
FOR SELECT
TO authenticated
USING (
  public.has_role(auth.uid(), 'super_admin') OR
  public.has_permission(auth.uid(), 'news_edit')
);

CREATE POLICY "Admins can manage news"
ON public.news
FOR ALL
TO authenticated
USING (
  public.has_role(auth.uid(), 'super_admin') OR
  public.has_permission(auth.uid(), 'news_create') OR
  public.has_permission(auth.uid(), 'news_edit') OR
  public.has_permission(auth.uid(), 'news_delete')
)
WITH CHECK (
  public.has_role(auth.uid(), 'super_admin') OR
  public.has_permission(auth.uid(), 'news_create')
);

-- ============================================
-- 11. EVENTS JADVALI
-- ============================================

CREATE TABLE public.events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title_uz TEXT NOT NULL,
  title_en TEXT NOT NULL,
  title_ru TEXT NOT NULL,
  description_uz TEXT NOT NULL,
  description_en TEXT NOT NULL,
  description_ru TEXT NOT NULL,
  location TEXT,
  event_date TIMESTAMP WITH TIME ZONE NOT NULL,
  image_url TEXT,
  published BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view published events"
ON public.events
FOR SELECT
USING (published = true);

CREATE POLICY "Admins can manage events"
ON public.events
FOR ALL
TO authenticated
USING (
  public.has_role(auth.uid(), 'super_admin') OR
  public.has_permission(auth.uid(), 'events_create') OR
  public.has_permission(auth.uid(), 'events_edit') OR
  public.has_permission(auth.uid(), 'events_delete')
)
WITH CHECK (
  public.has_role(auth.uid(), 'super_admin') OR
  public.has_permission(auth.uid(), 'events_create')
);

-- ============================================
-- 12. GALLERY JADVALI
-- ============================================

CREATE TABLE public.gallery (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title_uz TEXT NOT NULL,
  title_en TEXT NOT NULL,
  title_ru TEXT NOT NULL,
  image_url TEXT NOT NULL,
  category TEXT DEFAULT 'general',
  published BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.gallery ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view published gallery"
ON public.gallery
FOR SELECT
USING (published = true);

CREATE POLICY "Admins can manage gallery"
ON public.gallery
FOR ALL
TO authenticated
USING (
  public.has_role(auth.uid(), 'super_admin') OR
  public.has_permission(auth.uid(), 'gallery_create') OR
  public.has_permission(auth.uid(), 'gallery_delete')
)
WITH CHECK (
  public.has_role(auth.uid(), 'super_admin') OR
  public.has_permission(auth.uid(), 'gallery_create')
);

-- ============================================
-- 13. TEACHERS JADVALI
-- ============================================

CREATE TABLE public.teachers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  subject_uz TEXT NOT NULL,
  subject_en TEXT NOT NULL,
  subject_ru TEXT NOT NULL,
  bio_uz TEXT,
  bio_en TEXT,
  bio_ru TEXT,
  image_url TEXT,
  email TEXT,
  phone TEXT,
  published BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.teachers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view published teachers"
ON public.teachers
FOR SELECT
USING (published = true);

CREATE POLICY "Admins can manage teachers"
ON public.teachers
FOR ALL
TO authenticated
USING (
  public.has_role(auth.uid(), 'super_admin') OR
  public.has_permission(auth.uid(), 'teachers_create') OR
  public.has_permission(auth.uid(), 'teachers_edit') OR
  public.has_permission(auth.uid(), 'teachers_delete')
)
WITH CHECK (
  public.has_role(auth.uid(), 'super_admin') OR
  public.has_permission(auth.uid(), 'teachers_create')
);

-- ============================================
-- 14. DEPARTMENTS JADVALI
-- ============================================

CREATE TABLE public.departments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name_uz TEXT NOT NULL,
  name_en TEXT NOT NULL,
  name_ru TEXT NOT NULL,
  description_uz TEXT NOT NULL,
  description_en TEXT NOT NULL,
  description_ru TEXT NOT NULL,
  icon TEXT DEFAULT 'BookOpen',
  published BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.departments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view published departments"
ON public.departments
FOR SELECT
USING (published = true);

CREATE POLICY "Admins can manage departments"
ON public.departments
FOR ALL
TO authenticated
USING (
  public.has_role(auth.uid(), 'super_admin') OR
  public.has_permission(auth.uid(), 'departments_create') OR
  public.has_permission(auth.uid(), 'departments_edit') OR
  public.has_permission(auth.uid(), 'departments_delete')
)
WITH CHECK (
  public.has_role(auth.uid(), 'super_admin') OR
  public.has_permission(auth.uid(), 'departments_create')
);

-- ============================================
-- 15. AUDIT LOGS JADVALI
-- ============================================

CREATE TABLE public.audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  action TEXT NOT NULL,
  table_name TEXT NOT NULL,
  record_id UUID,
  old_data JSONB,
  new_data JSONB,
  ip_address TEXT,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Super admins can view all audit logs"
ON public.audit_logs
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'super_admin'));

-- ============================================
-- 16. TELEGRAM USER PREFERENCES JADVALI
-- ============================================

CREATE TABLE public.telegram_user_preferences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  telegram_user_id BIGINT UNIQUE NOT NULL,
  language TEXT DEFAULT 'uz' CHECK (language IN ('uz', 'en', 'ru')),
  current_panel TEXT,
  waiting_for TEXT,
  temp_data JSONB,
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.telegram_user_preferences ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own telegram preferences"
ON public.telegram_user_preferences
FOR ALL
TO authenticated
USING (
  telegram_user_id IN (
    SELECT telegram_user_id FROM public.user_roles WHERE user_id = auth.uid()
  )
)
WITH CHECK (
  telegram_user_id IN (
    SELECT telegram_user_id FROM public.user_roles WHERE user_id = auth.uid()
  )
);

-- ============================================
-- 17. UPDATED_AT TRIGGER FUNKSIYASI
-- ============================================

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- ============================================
-- 18. TRIGGER'LARNI QO'SHISH
-- ============================================

CREATE TRIGGER update_news_updated_at
  BEFORE UPDATE ON public.news
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_events_updated_at
  BEFORE UPDATE ON public.events
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_teachers_updated_at
  BEFORE UPDATE ON public.teachers
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_departments_updated_at
  BEFORE UPDATE ON public.departments
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ============================================
-- 19. STORAGE BUCKET YARATISH
-- ============================================

INSERT INTO storage.buckets (id, name, public)
VALUES ('uploads', 'uploads', true)
ON CONFLICT (id) DO NOTHING;

-- ============================================
-- 20. STORAGE POLICIES
-- ============================================

CREATE POLICY "Anyone can view uploads"
ON storage.objects
FOR SELECT
USING (bucket_id = 'uploads');

CREATE POLICY "Admins can upload files"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'uploads' AND (
    public.has_role(auth.uid(), 'super_admin') OR
    public.has_role(auth.uid(), 'admin')
  )
);

CREATE POLICY "Admins can delete uploads"
ON storage.objects
FOR DELETE
TO authenticated
USING (
  bucket_id = 'uploads' AND (
    public.has_role(auth.uid(), 'super_admin') OR
    public.has_role(auth.uid(), 'admin')
  )
);

-- ============================================
-- TAYYOR! 
-- ============================================
-- Endi barcha jadvallar yaratildi va RLS policies o'rnatildi.
-- Admin panel orqali yangiliklar, tadbirlar, galereya va boshqalarni qo'shishingiz mumkin.
-- ============================================

