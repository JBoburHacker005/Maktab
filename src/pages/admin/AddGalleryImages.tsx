import React from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Loader2 } from 'lucide-react';

const AddGalleryImages: React.FC = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Maktab papkasidagi barcha rasmlar
  const galleryImages = [
    { file: 'photo_2025-09-18_15-45-12.jpg', date: '2025-09-18', category: 'general' },
    { file: 'photo_2025-09-20_13-06-31.jpg', date: '2025-09-20', category: 'general' },
    { file: 'photo_2025-09-26_18-21-12.jpg', date: '2025-09-26', category: 'general' },
    { file: 'photo_2025-09-30_12-55-30.jpg', date: '2025-09-30', category: 'general' },
    { file: 'photo_2025-11-01_11-11-05.jpg', date: '2025-11-01', category: 'general' },
    { file: 'photo_2025-11-04_13-31-24.jpg', date: '2025-11-04', category: 'general' },
    { file: 'photo_2025-11-11_13-27-53.jpg', date: '2025-11-11', category: 'general' },
    { file: 'photo_2025-11-14_14-59-35.jpg', date: '2025-11-14', category: 'general' },
    { file: 'photo_2025-11-16_09-31-26.jpg', date: '2025-11-16', category: 'general' },
    { file: 'photo_2025-11-17_13-10-10.jpg', date: '2025-11-17', category: 'general' },
    { file: 'photo_2025-11-21_16-54-16.jpg', date: '2025-11-21', category: 'general' },
    { file: 'photo_2025-11-22_10-49-37.jpg', date: '2025-11-22', category: 'general' },
    { file: 'photo_2025-11-24_19-09-20.jpg', date: '2025-11-24', category: 'general' },
    { file: 'photo_2025-12-02_11-20-51.jpg', date: '2025-12-02', category: 'general' },
    { file: 'photo_2025-12-02_14-11-31.jpg', date: '2025-12-02', category: 'general' },
    { file: 'photo_2025-12-05_13-50-20.jpg', date: '2025-12-05', category: 'general' },
    { file: 'photo_2025-12-10_16-46-30.jpg', date: '2025-12-10', category: 'general' },
    { file: 'photo_2025-12-13_12-14-40.jpg', date: '2025-12-13', category: 'general' },
    { file: 'photo_2025-12-16_14-39-57.jpg', date: '2025-12-16', category: 'general' },
    { file: 'photo_2025-12-18_10-13-20.jpg', date: '2025-12-18', category: 'general' },
    { file: 'rasm.png', date: '2025-01-01', category: 'general' },
    { file: 'rasm4.png', date: '2025-01-01', category: 'general' },
    { file: 'rasm5.png', date: '2025-01-01', category: 'general' },
    { file: 'yutuq 2.png', date: '2025-01-01', category: 'Awards' },
  ];

  const addAllImagesMutation = useMutation({
    mutationFn: async () => {
      const results = [];
      let successCount = 0;
      let skipCount = 0;
      let errorCount = 0;

      for (const image of galleryImages) {
        try {
          const imageUrl = `/maktab/${image.file}`;
          const title = image.file.replace(/\.(jpg|png)$/i, '').replace(/_/g, ' ');

          // Check if image already exists
          const { data: existing } = await supabase
            .from('gallery')
            .select('id')
            .eq('image_url', imageUrl)
            .limit(1)
            .maybeSingle();

          if (existing) {
            skipCount++;
            continue;
          }

          // Insert image
          const { error } = await supabase.from('gallery').insert({
            title_uz: title,
            title_ru: title,
            title_en: title,
            image_url: imageUrl,
            category: image.category,
            published: true,
            created_at: new Date(`${image.date}T12:00:00+05:00`).toISOString(),
          });

          if (error) {
            console.error(`Error inserting ${image.file}:`, error.message);
            errorCount++;
          } else {
            successCount++;
          }

          // Small delay to avoid rate limiting
          await new Promise(resolve => setTimeout(resolve, 50));

        } catch (error: any) {
          console.error(`Error processing ${image.file}:`, error.message);
          errorCount++;
        }
      }

      return { successCount, skipCount, errorCount, total: galleryImages.length };
    },
    onSuccess: (result) => {
      queryClient.invalidateQueries({ queryKey: ['admin-gallery'] });
      toast({
        title: 'Muvaffaqiyatli!',
        description: `✅ ${result.successCount} ta rasm qo'shildi | ⏭️ ${result.skipCount} ta o'tkazib yuborildi | ❌ ${result.errorCount} ta xatolik`,
      });
    },
    onError: (error: Error) => {
      toast({
        variant: 'destructive',
        title: 'Xatolik',
        description: error.message,
      });
    },
  });

  return (
    <Button
      onClick={() => addAllImagesMutation.mutate()}
      disabled={addAllImagesMutation.isPending}
      className="bg-blue-600 hover:bg-blue-700"
    >
      {addAllImagesMutation.isPending && (
        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
      )}
      Maktab rasmlarini qo'shish ({galleryImages.length} ta)
    </Button>
  );
};

export default AddGalleryImages;

