import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, MapPin } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import { useLanguage } from '@/contexts/LanguageContext';

const Events: React.FC = () => {
  const { t } = useLanguage();

  const events = [
    {
      id: 1,
      title: 'Bilimlar kuni',
      description: 'Yangi o\'quv yilining boshlanishiga bag\'ishlangan tantanali tadbir.',
      date: '2025-09-02',
      time: '10:00 AM',
      location: 'Maktab binosi',
      type: 'Cultural',
    },
    {
      id: 2,
      title: 'O\'zbek tiliga davlat tili maqomi berilgan kun',
      description: 'Davlat tilining nufuzi va ahamiyatiga bag\'ishlangan ma\'naviy tadbir.',
      date: '2025-10-21',
      time: '10:00 AM',
      location: 'Maktab binosi',
      type: 'Cultural',
    },
    {
      id: 3,
      title: 'Ustoz va Murabbiylar kuni',
      description: 'Ustozlarga hurmat va ehtirom ko\'rsatish maqsadida o\'tkazilgan bayram tadbiri.',
      date: '2025-10-30',
      time: '10:00 AM',
      location: 'Maktab binosi',
      type: 'Cultural',
    },
    {
      id: 4,
      title: 'Olimpiada g\'oliblarini taqdirlash tadbiri',
      description: 'Yuqori natijalarga erishgan o\'quvchilarni rag\'batlantirish marosimi.',
      date: '2025-11-11',
      time: '10:00 AM',
      location: 'Maktab binosi',
      type: 'Academic',
    },
    {
      id: 5,
      title: 'O\'zbekiston Respublikasi Davlat Bayrog\'i qabul qilingan kun',
      description: 'Vatan ramzlariga hurmat ruhidagi tadbir.',
      date: '2025-11-18',
      time: '10:00 AM',
      location: 'Maktab binosi',
      type: 'Cultural',
    },
    {
      id: 6,
      title: 'O\'zbekiston Respublikasi Konstitutsiyasi qabul qilingan kun',
      description: 'Huquqiy-ma\'rifiy tadbir.',
      date: '2025-12-07',
      time: '10:00 AM',
      location: 'Maktab binosi',
      type: 'Cultural',
    },
    {
      id: 7,
      title: 'O\'zbekiston Respublikasi Davlat Madhiyasi qabul qilingan kun',
      description: 'Vatanparvarlik ruhidagi tantanali tadbir.',
      date: '2025-12-10',
      time: '10:00 AM',
      location: 'Maktab binosi',
      type: 'Cultural',
    },
    {
      id: 8,
      title: '"Zakovat" intellektual o\'yini',
      description: 'Bilim va mantiqiy fikrlashni rivojlantirishga qaratilgan musobaqa.',
      date: '2025-12-12',
      time: '10:00 AM',
      location: 'Maktab binosi',
      type: 'Academic',
    },
    {
      id: 9,
      title: 'Matematika fani tadbiri',
      description: 'Aniq fanlarga qiziqishni oshirishga qaratilgan tadbir.',
      date: '2025-12-16',
      time: '10:00 AM',
      location: 'Maktab binosi',
      type: 'Academic',
    },
    {
      id: 10,
      title: 'Kimyo fani tadbiri',
      description: 'Qiziqarli tajribalar va fan ko\'rgazmalari.',
      date: '2025-12-18',
      time: '10:00 AM',
      location: 'Maktab binosi',
      type: 'Academic',
    },
    {
      id: 11,
      title: 'Fizika fani tadbiri',
      description: 'Fizika fanining amaliy ahamiyatiga bag\'ishlangan tadbir.',
      date: '2025-12-20',
      time: '10:00 AM',
      location: 'Maktab binosi',
      type: 'Academic',
    },
    {
      id: 12,
      title: 'Yangi yil tadbiri',
      description: 'Bayramona sahna ko\'rinishlari va tantanali dastur.',
      date: '2025-12-26',
      time: '10:00 AM',
      location: 'Maktab binosi',
      type: 'Cultural',
    },
  ];

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
                  className={`relative flex flex-col md:flex-row gap-8 mb-12 ${
                    index % 2 === 0 ? 'md:flex-row-reverse' : ''
                  }`}
                >
                  {/* Timeline Dot */}
                  <div className="absolute left-0 md:left-1/2 w-4 h-4 rounded-full bg-primary border-4 border-background md:-translate-x-1/2 z-10" />

                  {/* Date Card */}
                  <div className={`md:w-1/2 ${index % 2 === 0 ? 'md:text-left md:pl-12' : 'md:text-right md:pr-12'}`}>
                    <div className="text-primary font-medium">
                      {new Date(event.date).toLocaleDateString('en-US', {
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
        </div>
      </section>
    </Layout>
  );
};

export default Events;
