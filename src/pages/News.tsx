import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Calendar, ArrowRight, Tag } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';

const News: React.FC = () => {
  const { t } = useLanguage();
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = [
    { key: 'all', label: t('all') },
    { key: 'Academic', label: t('newsCategoryAcademic') },
    { key: 'Sports', label: t('newsCategorySports') },
    { key: 'Events', label: t('newsCategoryEvents') },
    { key: 'Awards', label: t('newsCategoryAwards') },
  ];

  const { language } = useLanguage();

  const { data: newsData, isLoading } = useQuery({
    queryKey: ['news'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('news')
        .select('*')
        .eq('published', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  const news = (newsData || []).map(item => ({
    id: item.id,
    title: language === 'uz' ? item.title_uz : (language === 'ru' ? item.title_ru : item.title_en),
    excerpt: language === 'uz' ? item.content_uz : (language === 'ru' ? item.content_ru : item.content_en),
    category: item.category,
    date: item.created_at,
    image: item.image_url || 'https://images.unsplash.com/photo-1506748687234-ddc8d355e845', // Default placeholder
  }));

  const filteredNews = selectedCategory === 'all'
    ? news
    : news.filter(item => item.category === selectedCategory);

  const getCategoryLabel = (categoryKey: string) => {
    const cat = categories.find(c => c.key === categoryKey);
    return cat ? cat.label : categoryKey;
  };

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
              {t('news')}
            </span>
            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground mt-3 mb-6">
              {t('latestNewsTitle')}
            </h1>
            <p className="text-lg text-muted-foreground">
              {t('latestNewsDesc')}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-8 border-b border-border">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap gap-2 justify-center">
            {categories.map((category) => (
              <button
                key={category.key}
                onClick={() => setSelectedCategory(category.key)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${selectedCategory === category.key
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-muted-foreground hover:bg-muted/80'
                  }`}
              >
                {category.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* News Grid */}
      <section className="py-20 lg:py-28">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredNews.map((item, index) => (
              <motion.article
                key={item.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="group rounded-2xl bg-card border border-border/50 overflow-hidden hover:shadow-xl transition-all duration-300"
              >
                <div className="aspect-video overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-4 mb-3">
                    <span className="inline-flex items-center gap-1 text-xs font-medium text-primary">
                      <Tag className="w-3 h-3" />
                      {getCategoryLabel(item.category)}
                    </span>
                    <span className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Calendar className="w-3 h-3" />
                      {new Date(item.date).toLocaleDateString()}
                    </span>
                  </div>
                  <h3 className="font-display font-semibold text-lg text-foreground mb-2 group-hover:text-primary transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                    {item.excerpt}
                  </p>
                  <Button variant="link" className="p-0 h-auto text-primary">
                    {t('readMore')} <ArrowRight className="w-4 h-4 ml-1" />
                  </Button>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default News;
