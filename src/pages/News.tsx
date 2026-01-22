import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, ArrowRight, Tag, Loader2, X } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { newsApi } from '@/lib/api';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

type NewsItem = {
  id: string;
  title_uz: string;
  title_ru: string;
  title_en: string;
  content_uz: string;
  content_ru: string;
  content_en: string;
  category: string;
  image_url?: string;
  published: boolean;
  created_at: string;
};

const News: React.FC = () => {
  const { t, language } = useLanguage();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedNews, setSelectedNews] = useState<NewsItem | null>(null);

  const categories = [
    { key: 'all', label: t('all') },
    { key: 'Academic', label: t('newsCategoryAcademic') },
    { key: 'Sports', label: t('newsCategorySports') },
    { key: 'Events', label: t('newsCategoryEvents') },
    { key: 'Awards', label: t('newsCategoryAwards') },
  ];

  const { data: newsResponse, isLoading, error } = useQuery({
    queryKey: ['news', 'published'],
    queryFn: async () => {
      const response = await newsApi.getAll(true);
      if (!response.success || !response.data) {
        throw new Error(response.message || 'Yangiliklar yuklanmadi');
      }
      // created_at bo'yicha kamayish tartibida tartiblash
      return (response.data as NewsItem[]).sort((a, b) => {
        const dateA = new Date(a.created_at || 0).getTime();
        const dateB = new Date(b.created_at || 0).getTime();
        return dateB - dateA;
      });
    },
  });

  const news = newsResponse || [];

  const filteredNews = useMemo(() => {
    if (!news) return [];
    const filtered = selectedCategory === 'all' 
    ? news 
    : news.filter(item => item.category === selectedCategory);
    return filtered;
  }, [news, selectedCategory]);

  const getTitle = (item: NewsItem) => {
    if (language === 'uz') return item.title_uz;
    if (language === 'ru') return item.title_ru;
    return item.title_en;
  };

  const getContent = (item: NewsItem) => {
    if (language === 'uz') return item.content_uz;
    if (language === 'ru') return item.content_ru;
    return item.content_en;
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
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  selectedCategory === category.key
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
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <p className="text-destructive">{t('error')}: {error.message}</p>
            </div>
          ) : filteredNews.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">{t('noNews')}</p>
            </div>
          ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredNews.map((item, index) => {
                const title = getTitle(item);
                const content = getContent(item);
                const excerpt = content ? content.substring(0, 150) + '...' : '';
                const categoryLabel = categories.find(c => c.key === item.category)?.label || item.category;
                
                return (
              <motion.article
                key={item.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="group rounded-2xl bg-card border border-border/50 overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer"
                onClick={() => setSelectedNews(item)}
              >
                    {item.image_url && (
                <div className="aspect-video overflow-hidden">
                  <img
                          src={item.image_url.startsWith('http') ? item.image_url : item.image_url.startsWith('/') ? item.image_url : `/${item.image_url}`}
                          alt={title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = '/placeholder.svg';
                          }}
                  />
                </div>
                    )}
                <div className="p-6">
                  <div className="flex items-center gap-4 mb-3">
                    <span className="inline-flex items-center gap-1 text-xs font-medium text-primary">
                      <Tag className="w-3 h-3" />
                          {categoryLabel}
                    </span>
                    <span className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Calendar className="w-3 h-3" />
                          {item.created_at ? new Date(item.created_at).toLocaleDateString() : ''}
                    </span>
                  </div>
                  <h3 className="font-display font-semibold text-lg text-foreground mb-2 group-hover:text-primary transition-colors">
                        {title}
                  </h3>
                  <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                        {excerpt}
                  </p>
                  <Button 
                    variant="link" 
                    className="p-0 h-auto text-primary"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedNews(item);
                    }}
                  >
                        {t('readMore')} <ArrowRight className="w-4 h-4 ml-1" />
                  </Button>
                </div>
              </motion.article>
                );
              })}
          </div>
          )}
        </div>
      </section>

      {/* News Detail Modal */}
      <Dialog open={!!selectedNews} onOpenChange={(open) => !open && setSelectedNews(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          {selectedNews && (
            <>
              <DialogHeader>
                <DialogTitle className="text-2xl">
                  {getTitle(selectedNews)}
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                {selectedNews.image_url && (
                  <div className="w-full aspect-video overflow-hidden rounded-lg">
                    <img
                      src={selectedNews.image_url.startsWith('http') 
                        ? selectedNews.image_url 
                        : selectedNews.image_url.startsWith('/') 
                          ? selectedNews.image_url 
                          : `/${selectedNews.image_url}`}
                      alt={getTitle(selectedNews)}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = '/placeholder.svg';
                      }}
                    />
                  </div>
                )}
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span className="inline-flex items-center gap-1">
                    <Tag className="w-4 h-4" />
                    {categories.find(c => c.key === selectedNews.category)?.label || selectedNews.category}
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    {selectedNews.created_at ? new Date(selectedNews.created_at).toLocaleDateString() : ''}
                  </span>
                </div>
                <div className="prose prose-sm max-w-none dark:prose-invert">
                  <div className="text-foreground leading-relaxed space-y-3">
                    {getContent(selectedNews).split('\n\n').map((paragraph, idx) => {
                      const trimmed = paragraph.trim();
                      if (!trimmed) return null;
                      
                      // Emoji bilan boshlanadigan paragraflar
                      if (trimmed.startsWith('📖') || trimmed.startsWith('✅') || trimmed.startsWith('💫') || trimmed.startsWith('🌳') || trimmed.startsWith('♻️') || trimmed.startsWith('🌍') || trimmed.startsWith('⚡️') || trimmed.startsWith('🎯') || trimmed.startsWith('📸') || trimmed.startsWith('🗓') || trimmed.startsWith('🏢') || trimmed.startsWith('✨') || trimmed.startsWith('🎖') || trimmed.startsWith('👫') || trimmed.startsWith('🇺🇿') || trimmed.startsWith('📌')) {
                        return (
                          <p key={idx} className="font-medium text-base">
                            {trimmed}
                          </p>
                        );
                      }
                      // Raqamli ro'yxatlar
                      if (/^\d+\./.test(trimmed)) {
                        return (
                          <p key={idx} className="ml-4">
                            {trimmed}
                          </p>
                        );
                      }
                      // Oddiy paragraflar
                      return (
                        <p key={idx}>
                          {trimmed}
                        </p>
                      );
                    })}
                  </div>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </Layout>
  );
};

export default News;
