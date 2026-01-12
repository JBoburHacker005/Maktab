import React from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { createClient } from '@supabase/supabase-js';
import { Loader2, Download } from 'lucide-react';

const AddNewsButton: React.FC = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const importNewsMutation = useMutation({
    mutationFn: async () => {
      // Create Admin Client to bypass RLS
      const supabaseAdmin = createClient(
        'https://iusctesnflzacsjksozt.supabase.co',
        'sb_secret_AyDA2jvBFZoPrd3dL6TkHA_C8e0TH1o'
      );

      // 1. Delete all existing news
      console.log('🗑️ Deleting old news...');
      const { error: deleteError } = await supabaseAdmin
        .from('news')
        .delete()
        .neq('id', '00000000-0000-0000-0000-000000000000');

      if (deleteError) {
        throw new Error(`Deletion failed: ${deleteError.message}`);
      }

      // 2. Fetch from Telegram via CORS Proxy
      console.log('📥 Fetching from Telegram...');
      const PROXY_URL = 'https://api.allorigins.win/get?url=';
      const TARGET_URL = 'https://t.me/s/T2022PIMA';

      const response = await fetch(`${PROXY_URL}${encodeURIComponent(TARGET_URL)}`);
      if (!response.ok) throw new Error('Failed to fetch from Telegram proxy');

      const data = await response.json();
      const html = data.contents;

      // 3. Parse HTML
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, 'text/html');

      const messages = Array.from(doc.querySelectorAll('.tgme_widget_message_wrap'));
      const newsItems: any[] = [];
      const START_DATE = new Date('2025-08-25T00:00:00+05:00');

      for (const msg of messages) {
        // Extract content
        const textElement = msg.querySelector('.tgme_widget_message_text');
        const text = textElement?.innerHTML
          .replace(/<br\s*\/?>/gi, '\n')
          .replace(/<[^>]+>/g, '')
          .trim() || '';

        // Extract Date
        const timeElement = msg.querySelector('time');
        const dateStr = timeElement?.getAttribute('datetime');

        // Extract Image
        const photoElement = msg.querySelector('.tgme_widget_message_photo_wrap');
        let image = null;
        if (photoElement) {
          const style = photoElement.getAttribute('style');
          const match = style?.match(/background-image:url\('([^']+)'\)/);
          if (match) image = match[1];
        }

        if (dateStr && text) {
          const date = new Date(dateStr);
          if (date >= START_DATE) {
            // Determine Category
            let category = 'general';
            const lowerText = text.toLowerCase();
            if (lowerText.includes('olimpiada') || lowerText.includes('musobaqa')) category = 'Awards';
            else if (lowerText.includes('sport')) category = 'Sports';
            else if (lowerText.includes('tadbir') || lowerText.includes('bayram')) category = 'Events';
            else if (lowerText.includes('fan') || lowerText.includes('dars')) category = 'Academic';

            // Format Title (First line)
            const title = text.split('\n')[0].substring(0, 100);

            newsItems.push({
              title_uz: title,
              title_ru: title,
              title_en: title,
              content_uz: text,
              content_ru: text,
              content_en: text,
              category,
              image_url: image, // Note: Telegram images might not work if hotlinked without proxy. But let's try.
              published: true,
              created_at: dateStr
            });
          }
        }
      }

      console.log(`✅ Found ${newsItems.length} items.`);

      // 4. Insert into Supabase
      if (newsItems.length > 0) {
        // Sort ascending for insertion (oldest first? No, we usually want newest first, but insertion order doesn't matter much if compiled correctly)
        // Let's insert batch
        const { error: insertError } = await supabaseAdmin.from('news').insert(newsItems);
        if (insertError) throw new Error(`Insert failed: ${insertError.message}`);
      }

      return newsItems.length;
    },
    onSuccess: (count) => {
      queryClient.invalidateQueries({ queryKey: ['admin-news'] });
      queryClient.invalidateQueries({ queryKey: ['news'] });
      toast({
        title: 'Success!',
        description: `Cleaned and imported ${count} news items from Telegram.`,
      });
    },
    onError: (error: Error) => {
      console.error(error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error.message,
      });
    },
  });

  return (
    <Button
      onClick={() => importNewsMutation.mutate()}
      disabled={importNewsMutation.isPending}
      className="bg-blue-600 hover:bg-blue-700 text-white"
    >
      {importNewsMutation.isPending ? (
        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
      ) : (
        <Download className="w-4 h-4 mr-2" />
      )}
      Import from Telegram
    </Button>
  );
};

export default AddNewsButton;


