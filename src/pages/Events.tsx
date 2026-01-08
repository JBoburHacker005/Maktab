import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, MapPin, Loader2 } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import { useLanguage } from '@/contexts/LanguageContext';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Tables } from '@/integrations/supabase/types';

type EventRow = Tables<'events'>;

type HardcodedEvent = {
  id: number;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  type: string;
};

const Events: React.FC = () => {
  const { t, language } = useLanguage();

  const { data: events, isLoading } = useQuery({
    queryKey: ['events', language],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .eq('published', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as EventRow[];
    },
  });

  const getTitle = (event: EventRow) => {
    if (language === 'uz') return event.title_uz;
    if (language === 'ru') return event.title_ru;
    return event.title_en;
  };

  const getDescription = (event: EventRow) => {
    if (language === 'uz') return event.description_uz;
    if (language === 'ru') return event.description_ru;
    return event.description_en;
  };

  const getTypeColor = (category: string) => {
    const colors: Record<string, string> = {
      Cultural: 'bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-400',
      Academic: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
      Meeting: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
      Career: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
      Sports: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
      Event: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
    };
    return colors[category] || 'bg-muted text-muted-foreground';
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
          <div className="max-w-4xl mx-auto">
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
              </div>
            ) : events && events.length > 0 ? (
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
                    className={`relative flex flex-col md:flex-row gap-8 mb-12 ${
                      index % 2 === 0 ? 'md:flex-row-reverse' : ''
                    }`}
                  >
                    {/* Timeline Dot */}
                    <div className="absolute left-0 md:left-1/2 w-4 h-4 rounded-full bg-primary border-4 border-background md:-translate-x-1/2 z-10" />

                    {/* Date Card */}
                    <div className={`md:w-1/2 ${index % 2 === 0 ? 'md:text-left md:pl-12' : 'md:text-right md:pr-12'}`}>
                      <div className="text-primary font-medium">
                        {new Date(event.event_date).toLocaleDateString('en-US', {
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
                        {event.location && (
                          <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium mb-3 ${getTypeColor('Event')}`}>
                            {event.location}
                          </span>
                        )}
                        <h3 className="font-display font-semibold text-xl text-foreground mb-2">
                          {getTitle(event)}
                        </h3>
                        <p className="text-muted-foreground text-sm mb-4">
                          {getDescription(event)}
                        </p>
                        <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            {new Date(event.event_date).toLocaleTimeString('en-US', {
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </span>
                          {event.location && (
                            <span className="flex items-center gap-1">
                              <MapPin className="w-4 h-4" />
                              {event.location}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-muted-foreground">No events available</p>
              </div>
            )}
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Events;
