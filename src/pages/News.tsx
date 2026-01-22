import React, { useState, useMemo, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar, ArrowRight, Tag, Loader2 } from 'lucide-react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { supabase } from '@/integrations/supabase/client';
import { Tables } from '@/integrations/supabase/types';

type NewsRow = Tables<'news'>;

const News: React.FC = () => {
  const { t, language } = useLanguage();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const queryClient = useQueryClient();

  // Yangilikni qo'shish funksiyasi
  useEffect(() => {
    const addFirstBellNews = async () => {
      try {
        const newsData = {
          title_uz: '2-sentabr — Yangi o\'quv yilining ilk qo\'ng\'irog\'i!',
          title_ru: '2 сентября — Первый звонок нового учебного года!',
          title_en: 'September 2 — First Bell of the New Academic Year!',
          content_uz: `📚✨ 2-sentabr — Yangi o'quv yilining ilk qo'ng'irog'i!



Bugun maktabimizda "Vatan uchun, millat uchun, xalq uchun" shiori ostida 5–11-sinflar o'quvchilari uchun tantanali "Birinchi qo'ng'iroq" tadbiri bo'lib o'tdi.

🎉 Tadbirda o'quvchilar, ustozlar va ota-onalar birgalikda yangi bilim yilini katta hayajon va quvonch bilan qarshi oldilar. Kuy-qo'shiqlar, she'rlar, dil so'zlari, ezgu tilaklar yangradi.

📖 "Birinchi qo'ng'iroq" nafaqat yangi dars yilining boshlanishi, balki o'quvchilarimizni bilim sari, yurt ravnaqi yo'lida intilish sari chorlovchi ramziy daqiqadir.





🌿 Tadbirda vatanparvarlik, millatga sadoqat, xalqimiz kelajagiga ishonch kabi g'oyalar tarannum etildi. Yangi o'quv yilida barcha o'quvchilarimizga mustahkam salomatlik, ilmga chanqoqlik va ulkan yutuqlar tilaymiz!`,
          content_ru: `📚✨ 2 сентября — Первый звонок нового учебного года!



Сегодня в нашей школе под девизом "За Родину, за нацию, за народ" состоялось торжественное мероприятие "Первый звонок" для учащихся 5–11 классов.

🎉 На мероприятии учащиеся, учителя и родители вместе встретили новый учебный год с большим волнением и радостью. Звучали песни, стихи, добрые слова и пожелания.

📖 "Первый звонок" — это не только начало нового учебного года, но и символический момент, призывающий наших учащихся стремиться к знаниям, к процветанию страны.





🌿 На мероприятии звучали идеи патриотизма, верности нации, веры в будущее нашего народа. В новом учебном году желаем всем нашим учащимся крепкого здоровья, жажды знаний и больших достижений!`,
          content_en: `📚✨ September 2 — First Bell of the New Academic Year!



Today at our school, under the motto "For the Homeland, for the Nation, for the People", a ceremonial "First Bell" event was held for students in grades 5–11.

🎉 At the event, students, teachers, and parents together welcomed the new academic year with great excitement and joy. Songs, poems, kind words, and wishes were heard.

📖 "First Bell" is not only the beginning of a new academic year, but also a symbolic moment calling our students to strive for knowledge and the prosperity of the country.





🌿 At the event, ideas of patriotism, loyalty to the nation, and faith in our people's future were expressed. In the new academic year, we wish all our students strong health, thirst for knowledge, and great achievements!`,
          category: 'Events',
          image_url: '/photo_2025-09-02_09-42-21.jpg',
          published: true,
          created_at: new Date('2025-09-02T10:00:00+05:00').toISOString(),
        };

        // Duplikatni tekshirish
        const { data: existing } = await supabase
          .from('news')
          .select('id')
          .eq('title_uz', newsData.title_uz)
          .limit(1)
          .maybeSingle();

        if (existing) {
          console.log('✅ Yangilik allaqachon mavjud');
          return;
        }

        // Yangilikni qo'shish
        const { error } = await supabase
          .from('news')
          .insert([newsData]);

        if (error) {
          console.error('❌ Yangilik qo\'shishda xatolik:', error.message);
          return;
        }

        console.log('✅ Yangilik muvaffaqiyatli qo\'shildi!');
        // Yangiliklar ro'yxatini yangilash
        queryClient.invalidateQueries({ queryKey: ['news'] });
      } catch (error: any) {
        console.error('❌ Xatolik:', error.message);
      }
    };

    // Faqat bir marta ishga tushirish
    addFirstBellNews();
  }, [queryClient]);

  const categories = [
    { key: 'all', label: t('all') },
    { key: 'Academic', label: t('newsCategoryAcademic') },
    { key: 'Sports', label: t('newsCategorySports') },
    { key: 'Events', label: t('newsCategoryEvents') },
    { key: 'Awards', label: t('newsCategoryAwards') },
  ];

  const { data: news, isLoading, error } = useQuery({
    queryKey: ['news'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('news')
        .select('*')
        .eq('published', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as NewsRow[];
    },
  });

  const filteredNews = useMemo(() => {
    if (!news) return [];
    const filtered = selectedCategory === 'all' 
    ? news 
    : news.filter(item => item.category === selectedCategory);
    return filtered;
  }, [news, selectedCategory]);

  const getTitle = (item: NewsRow) => {
    if (language === 'uz') return item.title_uz;
    if (language === 'ru') return item.title_ru;
    return item.title_en;
  };

  const getContent = (item: NewsRow) => {
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
                className="group rounded-2xl bg-card border border-border/50 overflow-hidden hover:shadow-xl transition-all duration-300"
              >
                    {item.image_url && (
                <div className="aspect-video overflow-hidden">
                  <img
                          src={item.image_url.startsWith('http') ? item.image_url : item.image_url.startsWith('/') ? item.image_url : `/${item.image_url}`}
                          alt={title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = 'https://via.placeholder.com/600x400?text=News';
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
                          {new Date(item.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  <h3 className="font-display font-semibold text-lg text-foreground mb-2 group-hover:text-primary transition-colors">
                        {title}
                  </h3>
                  <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                        {excerpt}
                  </p>
                  <Button variant="link" className="p-0 h-auto text-primary">
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
    </Layout>
  );
};

export default News;
