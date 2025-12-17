-- Telegram bot user preferences table
CREATE TABLE IF NOT EXISTS public.telegram_user_preferences (
  telegram_user_id BIGINT PRIMARY KEY,
  language TEXT DEFAULT 'uz' CHECK (language IN ('uz', 'en', 'ru')),
  current_panel TEXT,
  waiting_for TEXT,
  temp_data JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.telegram_user_preferences ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Users can only view/update their own preferences
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

-- Function to check if telegram user is admin
CREATE OR REPLACE FUNCTION public.is_telegram_admin(_telegram_user_id BIGINT)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE telegram_user_id = _telegram_user_id
      AND (role = 'admin' OR role = 'super_admin')
  )
$$;

-- Update trigger for telegram_user_preferences
CREATE TRIGGER update_telegram_preferences_updated_at
  BEFORE UPDATE ON public.telegram_user_preferences
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

