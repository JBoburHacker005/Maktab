-- Audit log table to track all changes made by admins
CREATE TABLE public.audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  user_email TEXT,
  action TEXT NOT NULL, -- 'create', 'update', 'delete'
  table_name TEXT NOT NULL, -- 'news', 'events', 'gallery', 'teachers', 'departments'
  record_id UUID NOT NULL,
  old_data JSONB,
  new_data JSONB,
  changes JSONB, -- Only the fields that changed
  ip_address TEXT,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create index for faster queries
CREATE INDEX idx_audit_logs_user_id ON public.audit_logs(user_id);
CREATE INDEX idx_audit_logs_table_name ON public.audit_logs(table_name);
CREATE INDEX idx_audit_logs_created_at ON public.audit_logs(created_at DESC);
CREATE INDEX idx_audit_logs_action ON public.audit_logs(action);

ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Only super admins can view audit logs
CREATE POLICY "Super admins can view audit logs"
ON public.audit_logs
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'super_admin'));

-- Function to log audit events
CREATE OR REPLACE FUNCTION public.log_audit_event(
  _action TEXT,
  _table_name TEXT,
  _record_id UUID,
  _old_data JSONB DEFAULT NULL,
  _new_data JSONB DEFAULT NULL
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _user_id UUID;
  _user_email TEXT;
  _changes JSONB;
  _log_id UUID;
BEGIN
  -- Get current user
  _user_id := auth.uid();
  
  -- Get user email
  SELECT email INTO _user_email
  FROM auth.users
  WHERE id = _user_id;
  
  -- Calculate changes (only fields that changed)
  IF _old_data IS NOT NULL AND _new_data IS NOT NULL THEN
    SELECT jsonb_object_agg(key, value)
    INTO _changes
    FROM jsonb_each(_new_data)
    WHERE value IS DISTINCT FROM (_old_data->key);
  END IF;
  
  -- Insert audit log
  INSERT INTO public.audit_logs (
    user_id,
    user_email,
    action,
    table_name,
    record_id,
    old_data,
    new_data,
    changes
  )
  VALUES (
    _user_id,
    _user_email,
    _action,
    _table_name,
    _record_id,
    _old_data,
    _new_data,
    _changes
  )
  RETURNING id INTO _log_id;
  
  RETURN _log_id;
END;
$$;

-- Trigger function for INSERT
CREATE OR REPLACE FUNCTION public.audit_insert()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _table_name TEXT;
BEGIN
  -- Get table name from trigger
  _table_name := TG_TABLE_SCHEMA || '.' || TG_TABLE_NAME;
  -- Remove schema prefix for public schema
  IF _table_name LIKE 'public.%' THEN
    _table_name := REPLACE(_table_name, 'public.', '');
  END IF;
  
  PERFORM public.log_audit_event(
    'create',
    _table_name,
    NEW.id,
    NULL,
    to_jsonb(NEW)
  );
  RETURN NEW;
END;
$$;

-- Trigger function for UPDATE
CREATE OR REPLACE FUNCTION public.audit_update()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _table_name TEXT;
BEGIN
  -- Get table name from trigger
  _table_name := TG_TABLE_SCHEMA || '.' || TG_TABLE_NAME;
  -- Remove schema prefix for public schema
  IF _table_name LIKE 'public.%' THEN
    _table_name := REPLACE(_table_name, 'public.', '');
  END IF;
  
  PERFORM public.log_audit_event(
    'update',
    _table_name,
    NEW.id,
    to_jsonb(OLD),
    to_jsonb(NEW)
  );
  RETURN NEW;
END;
$$;

-- Trigger function for DELETE
CREATE OR REPLACE FUNCTION public.audit_delete()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _table_name TEXT;
BEGIN
  -- Get table name from trigger
  _table_name := TG_TABLE_SCHEMA || '.' || TG_TABLE_NAME;
  -- Remove schema prefix for public schema
  IF _table_name LIKE 'public.%' THEN
    _table_name := REPLACE(_table_name, 'public.', '');
  END IF;
  
  PERFORM public.log_audit_event(
    'delete',
    _table_name,
    OLD.id,
    to_jsonb(OLD),
    NULL
  );
  RETURN OLD;
END;
$$;

-- Create triggers for all tables
CREATE TRIGGER audit_news_insert
  AFTER INSERT ON public.news
  FOR EACH ROW EXECUTE FUNCTION public.audit_insert();

CREATE TRIGGER audit_news_update
  AFTER UPDATE ON public.news
  FOR EACH ROW EXECUTE FUNCTION public.audit_update();

CREATE TRIGGER audit_news_delete
  AFTER DELETE ON public.news
  FOR EACH ROW EXECUTE FUNCTION public.audit_delete();

CREATE TRIGGER audit_events_insert
  AFTER INSERT ON public.events
  FOR EACH ROW EXECUTE FUNCTION public.audit_insert();

CREATE TRIGGER audit_events_update
  AFTER UPDATE ON public.events
  FOR EACH ROW EXECUTE FUNCTION public.audit_update();

CREATE TRIGGER audit_events_delete
  AFTER DELETE ON public.events
  FOR EACH ROW EXECUTE FUNCTION public.audit_delete();

CREATE TRIGGER audit_gallery_insert
  AFTER INSERT ON public.gallery
  FOR EACH ROW EXECUTE FUNCTION public.audit_insert();

CREATE TRIGGER audit_gallery_update
  AFTER UPDATE ON public.gallery
  FOR EACH ROW EXECUTE FUNCTION public.audit_update();

CREATE TRIGGER audit_gallery_delete
  AFTER DELETE ON public.gallery
  FOR EACH ROW EXECUTE FUNCTION public.audit_delete();

CREATE TRIGGER audit_teachers_insert
  AFTER INSERT ON public.teachers
  FOR EACH ROW EXECUTE FUNCTION public.audit_insert();

CREATE TRIGGER audit_teachers_update
  AFTER UPDATE ON public.teachers
  FOR EACH ROW EXECUTE FUNCTION public.audit_update();

CREATE TRIGGER audit_teachers_delete
  AFTER DELETE ON public.teachers
  FOR EACH ROW EXECUTE FUNCTION public.audit_delete();

CREATE TRIGGER audit_departments_insert
  AFTER INSERT ON public.departments
  FOR EACH ROW EXECUTE FUNCTION public.audit_insert();

CREATE TRIGGER audit_departments_update
  AFTER UPDATE ON public.departments
  FOR EACH ROW EXECUTE FUNCTION public.audit_update();

CREATE TRIGGER audit_departments_delete
  AFTER DELETE ON public.departments
  FOR EACH ROW EXECUTE FUNCTION public.audit_delete();

