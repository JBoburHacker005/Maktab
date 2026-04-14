import React, { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Calendar, Clock, MapPin, Loader2 } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import { useLanguage } from '@/contexts/LanguageContext';
import { eventsApi } from '@/lib/api';

type EventItem = {
  id: string;
  title_uz: string;
  title_ru: string;
  title_en: string;
  description_uz: string;
  description_ru: string;
  description_en: string;
  location?: string;
  event_date: string;
  event_time?: string;
  image_url?: string;
  category?: string;
  published: boolean;
  created_at: string;
};

const Events: React.FC = () => {
  const { t, language } = useLanguage();

  // Backend API'dan tadbirlarni olish
  const { data: apiEventsResponse, isLoading } = useQuery({
    queryKey: ['events', 'published', language],
    queryFn: async () => {
      const response = await eventsApi.getAll(true);
      if (!response.success || !response.data) {
        throw new Error(response.message || 'Tadbirlar yuklanmadi');
      }
      // event_date bo'yicha kamayish tartibida tartiblash
      return (response.data as EventItem[]).sort((a, b) => {
        const dateA = new Date(a.event_date || 0).getTime();
        const dateB = new Date(b.event_date || 0).getTime();
        return dateB - dateA;
      });
    },
  });

  const apiEvents = apiEventsResponse || [];

  // Tadbirlarni tartiblash
  const events = useMemo(() => {
    if (!apiEvents || apiEvents.length === 0) return [];

    return apiEvents.map((event) => {
      const title = language === 'uz' ? event.title_uz : language === 'ru' ? event.title_ru : event.title_en;
      const description = language === 'uz' ? event.description_uz : language === 'ru' ? event.description_ru : event.description_en;
      const eventDate = event.event_date ? new Date(event.event_date).toISOString().split('T')[0] : '';
      const eventTime = event.event_time || '10:00 AM';
      const location = event.location || 'School';

      return {
        id: event.id,
        title,
        description: description || '',
        date: eventDate,
        time: eventTime,
        location,
        type: event.category || 'Cultural',
      };
    })
    .sort((a, b) => {
      const dateA = new Date(a.date).getTime();
      const dateB = new Date(b.date).getTime();
      return dateB - dateA; // Kamayish tartibida (eng yangi birinchi)
    });
  }, [apiEvents, language]);

  const getTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      Cultural: 'bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-400',
      Academic: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
      Meeting: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
      Career: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
      Sports: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
    };
    return colors[type] || 'bg-muted text-muted-foreground';
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
              {t('events')}
            </span>
            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground mt-3 mb-6">
              {t('upcomingEventsTitle')}
            </h1>
            <p className="text-lg text-muted-foreground">
              {t('upcomingEventsDesc')}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Events Timeline */}
      <section className="py-20 lg:py-28">
        <div className="container mx-auto px-4">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : events.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">{t('noEvents') || 'No events available'}</p>
            </div>
          ) : (
            <div className="max-w-4xl mx-auto">
              <div className="relative">
                {/* Timeline Line */}
                <div className="absolute left-0 md:left-1/2 top-0 bottom-0 w-px bg-border md:-translate-x-1/2" />

                {events.map((event, index) => (
                  <motion.div
                    key={event.id}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className={`relative flex flex-col md:flex-row gap-8 mb-12 ${index % 2 === 0 ? 'md:flex-row-reverse' : ''
                      }`}
                  >
                    {/* Timeline Dot */}
                    <div className="absolute left-0 md:left-1/2 w-4 h-4 rounded-full bg-primary border-4 border-background md:-translate-x-1/2 z-10" />

                    {/* Date Card */}
                    <div className={`md:w-1/2 ${index % 2 === 0 ? 'md:text-left md:pl-12' : 'md:text-right md:pr-12'}`}>
                      <div className="text-primary font-medium">
                        {new Date(event.date).toLocaleDateString(language === 'en' ? 'en-US' : language === 'ru' ? 'ru-RU' : 'uz-UZ', {
                          weekday: 'long',
                          month: 'long',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </div>
                    </div>

                    {/* Event Card */}
                    <div className={`md:w-1/2 ml-8 md:ml-0 ${index % 2 === 0 ? 'md:pr-12' : 'md:pl-12'}`}>
                      <div className="p-6 rounded-2xl bg-card border border-border/50 hover:shadow-lg transition-shadow">
                        <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium mb-3 ${getTypeColor(event.type)}`}>
                          {event.type}
                        </span>
                        <h3 className="font-display font-semibold text-xl text-foreground mb-2">
                          {event.title}
                        </h3>
                        <p className="text-muted-foreground text-sm mb-4">
                          {event.description}
                        </p>
                        <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            {event.time}
                          </span>
                          <span className="flex items-center gap-1">
                            <MapPin className="w-4 h-4" />
                            {event.location}
                          </span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default Events;
