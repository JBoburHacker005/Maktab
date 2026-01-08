import React, { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ZoomIn, Loader2 } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import { useLanguage } from '@/contexts/LanguageContext';
import { supabase } from '@/integrations/supabase/client';
import { Tables } from '@/integrations/supabase/types';

type GalleryRow = Tables<'gallery'>;

const Gallery: React.FC = () => {
  const { t, language } = useLanguage();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  // Supabase'dan rasmlarni olish
  const { data: gallery, isLoading } = useQuery({
    queryKey: ['gallery', language],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('gallery')
        .select('*')
        .eq('published', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as GalleryRow[];
    },
  });

  // Hardcoded rasmlar (fallback)
  const hardcodedImages = [
    { src: '/png/a.png', alt: 'Campus life A' },
    { src: '/png/b.png', alt: 'Campus life B' },
    { src: '/png/c.png', alt: 'Campus life C' },
    { src: '/png/d.png', alt: 'Campus life D' },
    { src: '/png/e.png', alt: 'Campus life E' },
    { src: '/png/f.png', alt: 'Campus life F' },
    { src: '/png/g.png', alt: 'Campus life G' },
    { src: '/png/h.png', alt: 'Campus life H' },
    { src: '/png/i.png', alt: 'Campus life I' },
    { src: '/png/j.png', alt: 'Campus life J' },
    { src: '/png/k.png', alt: 'Campus life K' },
    { src: '/png/l.png', alt: 'Campus life L' },
  ];

  // Maktab rasmlarini qo'shish
  const maktabImages = [
    '/maktab/photo_2025-09-18_15-45-12.jpg',
    '/maktab/photo_2025-09-20_13-06-31.jpg',
    '/maktab/photo_2025-09-26_18-21-12.jpg',
    '/maktab/photo_2025-09-30_12-55-30.jpg',
    '/maktab/photo_2025-11-01_11-11-05.jpg',
    '/maktab/photo_2025-11-04_13-31-24.jpg',
    '/maktab/photo_2025-11-11_13-27-53.jpg',
    '/maktab/photo_2025-11-14_14-59-35.jpg',
    '/maktab/photo_2025-11-16_09-31-26.jpg',
    '/maktab/photo_2025-11-17_13-10-10.jpg',
    '/maktab/photo_2025-11-21_16-54-16.jpg',
    '/maktab/photo_2025-11-22_10-49-37.jpg',
    '/maktab/photo_2025-11-24_19-09-20.jpg',
    '/maktab/photo_2025-12-02_11-20-51.jpg',
    '/maktab/photo_2025-12-02_14-11-31.jpg',
    '/maktab/photo_2025-12-05_13-50-20.jpg',
    '/maktab/photo_2025-12-10_16-46-30.jpg',
    '/maktab/photo_2025-12-13_12-14-40.jpg',
    '/maktab/photo_2025-12-16_14-39-57.jpg',
    '/maktab/photo_2025-12-18_10-13-20.jpg',
    '/maktab/rasm.png',
    '/maktab/rasm4.png',
    '/maktab/rasm5.png',
    '/maktab/yutuq 2.png',
  ];

  // Barcha rasmlarni birlashtirish
  const allImages = useMemo(() => {
    const images: Array<{ src: string; alt: string }> = [];
    
    // Supabase'dan olingan rasmlar
    if (gallery && gallery.length > 0) {
      gallery.forEach((item) => {
        const title = language === 'uz' ? item.title_uz : language === 'ru' ? item.title_ru : item.title_en;
        images.push({
          src: item.image_url,
          alt: title,
        });
      });
    }
    
    // Maktab rasmlari
    maktabImages.forEach((src) => {
      const fileName = src.split('/').pop() || '';
      const alt = fileName.replace(/\.(jpg|png)$/i, '').replace(/_/g, ' ').replace(/photo /g, '');
      images.push({ src, alt });
    });
    
    // Hardcoded rasmlar (fallback)
    if (images.length === 0) {
      return hardcodedImages;
    }
    
    return images;
  }, [gallery, language]);

  return (
    <Layout>
      {/* Hero */}
      <section className="relative py-20 lg:py-28 bg-gradient-hero overflow-hidden">
        {/* Background Image with Backdrop */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: 'url(/ima.png)',
          }}
        />
        <div className="absolute inset-0 bg-background/60 backdrop-blur-md" />
        
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl mx-auto text-center"
          >
            <span className="text-primary font-medium text-sm uppercase tracking-wider">
              {t('gallery')}
            </span>
            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground mt-3 mb-6">
              {t('photoGalleryTitle')}
            </h1>
            <p className="text-lg text-muted-foreground">
              {t('photoGalleryDesc')}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Gallery Grid */}
      <section className="py-20 lg:py-28">
        <div className="container mx-auto px-4">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {allImages.map((image, index) => (
              <motion.div
                key={image.src}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                className="group relative aspect-square rounded-xl overflow-hidden cursor-pointer"
                onClick={() => setSelectedImage(image.src)}
              >
                <img
                  src={image.src}
                  alt={image.alt}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/30 transition-colors flex items-center justify-center">
                  <ZoomIn className="w-8 h-8 text-primary-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Lightbox */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-foreground/90 flex items-center justify-center p-4"
            onClick={() => setSelectedImage(null)}
          >
            <button
              className="absolute top-4 right-4 w-10 h-10 rounded-full bg-primary-foreground/20 flex items-center justify-center hover:bg-primary-foreground/30 transition-colors"
              onClick={() => setSelectedImage(null)}
            >
              <X className="w-6 h-6 text-primary-foreground" />
            </button>
            <motion.img
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              src={selectedImage}
              alt="Gallery Image"
              className="max-w-full max-h-[90vh] rounded-xl shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </Layout>
  );
};

export default Gallery;
