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
      title: 'Winter Concert',
      description: 'Join us for an enchanting evening of musical performances by our talented students.',
      date: '2024-12-20',
      time: '6:00 PM',
      location: 'School Auditorium',
      type: 'Cultural',
    },
    {
      id: 2,
      title: 'Science Fair 2024',
      description: 'Explore innovative projects and experiments created by our budding scientists.',
      date: '2024-12-22',
      time: '9:00 AM',
      location: 'STEM Building',
      type: 'Academic',
    },
    {
      id: 3,
      title: 'Parent-Teacher Conference',
      description: "Meet with teachers to discuss your child's progress and development.",
      date: '2025-01-10',
      time: '2:00 PM',
      location: 'Classrooms',
      type: 'Meeting',
    },
    {
      id: 4,
      title: 'Career Day',
      description: 'Professionals from various fields share insights about career opportunities.',
      date: '2025-01-15',
      time: '10:00 AM',
      location: 'Main Hall',
      type: 'Career',
    },
    {
      id: 5,
      title: 'Inter-School Sports Tournament',
      description: 'Cheer for our teams as they compete against schools from across the region.',
      date: '2025-01-25',
      time: '8:00 AM',
      location: 'Sports Complex',
      type: 'Sports',
    },
    {
      id: 6,
      title: 'Art Exhibition Opening',
      description: 'Celebrate creativity at our annual student art exhibition showcasing diverse artworks.',
      date: '2025-02-01',
      time: '5:00 PM',
      location: 'Art Gallery',
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
