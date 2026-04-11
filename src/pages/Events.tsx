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

  // Hardcoded tadbirlar (fallback)
  const hardcodedEvents = [
    {
      id: 1,
      title: 'Bilimlar kuni',
      description:
        'Yangi o‘quv yilining boshlanishiga bag‘ishlangan tantanali tadbir.',
      date: '2025-09-02',
      time: '10:00 AM',
      location: 'School Yard',
      type: 'Cultural',
    },
    {
      id: 2,
      title: 'Ustoz va Murabbiylar kuni',
      description:
        'Ustozlarga hurmat va ehtirom ko‘rsatish maqsadida tashkil etilgan bayram.',
      date: '2025-09-30',
      time: '10:00 AM',
      location: 'Main Hall',
      type: 'Cultural',
    },
    {
      id: 3,
      title: 'O‘zbek tiliga davlat tili maqomi berilgan kun',
      description:
        'Davlat tilining nufuzi va ahamiyatiga bag‘ishlangan ma’naviy tadbir.',
      date: '2025-10-21',
      time: '10:00 AM',
      location: 'Assembly Hall',
      type: 'Cultural',
    },
    {
      id: 4,
      title: 'Olimpiada g‘oliblarini taqdirlash',
      description:
        'Fan olimpiadalarida yuqori natijalarga erishgan o‘quvchilarni taqdirlash marosimi.',
      date: '2025-11-11',
      time: '10:00 AM',
      location: 'Main Hall',
      type: 'Academic',
    },
    {
      id: 5,
      title: 'Davlat Bayrog‘i qabul qilingan kun',
      description:
        'Vatan ramzlariga hurmat va vatanparvarlik ruhidagi tadbir.',
      date: '2025-11-18',
      time: '10:00 AM',
      location: 'School Yard',
      type: 'Cultural',
    },
    {
      id: 6,
      title: 'Konstitutsiya qabul qilingan kun',
      description:
        'Huquqiy bilimlarni oshirishga qaratilgan ma’rifiy tadbir.',
      date: '2025-12-07',
      time: '10:00 AM',
      location: 'Assembly Hall',
      type: 'Cultural',
    },
    {
      id: 7,
      title: 'Davlat Madhiyasi qabul qilingan kun',
      description:
        'Vatanparvarlik va milliy g‘ururni mustahkamlovchi tadbir.',
      date: '2025-12-10',
      time: '10:00 AM',
      location: 'School Yard',
      type: 'Cultural',
    },
    {
      id: 8,
      title: '"Zakovat" intellektual o‘yini',
      description:
        'Bilim, mantiq va tezkor fikrlashni sinovdan o‘tkazuvchi musobaqa.',
      date: '2025-12-12',
      time: '10:00 AM',
      location: 'Classrooms',
      type: 'Academic',
    },
    {
      id: 9,
      title: 'Matematika fani tadbiri',
      description:
        'Aniq fanlarga qiziqishni oshirishga qaratilgan bellashuvlar.',
      date: '2025-12-16',
      time: '10:00 AM',
      location: 'STEM Room',
      type: 'Academic',
    },
    {
      id: 10,
      title: 'Kimyo fani tadbiri',
      description:
        'Qiziqarli tajribalar va ilmiy ko‘rgazmalar.',
      date: '2025-12-18',
      time: '10:00 AM',
      location: 'Laboratory',
      type: 'Academic',
    },
    {
      id: 11,
      title: 'Fizika fani tadbiri',
      description:
        'Fizika fanining amaliy ahamiyatiga bag‘ishlangan tadbir.',
      date: '2025-12-20',
      time: '10:00 AM',
      location: 'Laboratory',
      type: 'Academic',
    },
    {
      id: 12,
      title: 'Yangi yil tadbiri',
      description:
        'Bayramona sahna ko‘rinishlari va tantanali yangi yil dasturi.',
      date: '2025-12-26',
      time: '10:00 AM',
      location: 'Main Hall',
      type: 'Cultural',
    },
    {
      id: 13,
      title: '14-yanvar Vatan himoyachilari kuni',
      description:
        'Bayramona sahna ko‘rinishlari va tantanali Harbiy dasturlar.',
      date: '2026-01-13',
      time: '10:00 AM',
      location: 'Main Hall',
      type: 'Cultural',
    },
    {
      id: 14,
      title: 'Eco Qumita Yig\'ilishi',
      description:
        '✅Bugun Tuproqqalʼa tuman ixtisoslashtirilgan maktabida Eco-Schools xalqaro ekologik ta\'lim loyihasi doirasida navbatdagi muhim tadbir tashkil etildi.',
      date: '2026-01-19',
      time: '10:00',
      location: 'Main Hall',
      type: 'Cultural',
    },
    {
      id: 15,
      title: '"ZAKOVAT" intellektual oʻyini',
      description:
        'Oʻtkir Hoshimov ijodiga bag\'ishlangan "ZAKOVAT" intellektual o\'yini tashkil etildi.',
      date: '2026-01-29',
      time: '13:00',
      location: 'Main Hall',
      type: 'Cultural',
    },
    {
      id: 16,
      title: '"BOʻLAJAK MEDIKLAR" nomli tadbir',
      description:
        '11-"B" sinf oʻquvchilari ishtirokida "BOʻLAJAK MEDIKLAR" nomli tadbir tashkil etildi',
      date: '2026-01-28',
      time: '11:00',
      location: 'Main Hall',
      type: 'Cultural',
    },
    {
      id: 17,
      title: '🕯IKKI BUYUK SIYMO🕯',
      description:
        '🕯Tadbirda Alisher Navoiy va Zahiriddin Muhammad Bobur ijodidan gʻazal va ruboiylar, hikmatli soʻzlar aytildi.',
      date: '2026-02-09',
      time: '10:00',
      location: 'Main Hall',
      type: 'Cultural',
    },
    {
      id: 18,
      title: 'Xalqaro ilm fan sohasidagi xotin-qizlar kuni',
      description:
        'Xalqaro ilm fan sohasidagi xotin-qizlar kuni munosabati bilan ma\'naviy-ma\'rifiy tadbir tashkil etildi.',
      date: '2026-02-13',
      time: '10:00',
      location: 'Main Hall',
      type: 'Cultural',
    },
    {
      id: 19,
      title: 'Zulfiya Isroilova tavallud tadbiri',
      description:
        'Zulfiya Isroilova tavallud sanasiga bagʻishlangan maʼnaviy-maʼrifiy tadbir boʻlib oʻtdi.',
      date: '2026-02-27',
      time: '13:00',
      location: 'Main Hall',
      type: 'Cultural',
    },
    {
      id: 20,
      title: '“МАСЛЕНИЦА”',
      description:
        '“МАСЛЕНИЦА” mavzusida ma\'naviy-ma\'rifiy tadbir tashkil etildi.',
      date: '2026-03-05',
      time: '10:00',
      location: 'Main Hall',
      type: 'Cultural',
    },
    {
      id: 21,
      title: '8-mart Xalqaro xotin-qizlar kuni',
      description:
        'Tuproqqalʼa tuman ixtisoslashtirilgan maktabida "Ayol baxtli bo\'lsa, jamiyat baxtlidir" shiori ostidagi tadbir o\'tkazildi',
      date: '2026-03-06',
      time: '13:00',
      location: 'Main Hall',
      type: 'Cultural',
    },
    {
      id: 22,
      title: '🎓 Osiyo xalqaro universiteti vakillari bilan uchrashuv tashkil etildi.',
      description:
        '🎓 Osiyo xalqaro universiteti vakillari bilan uchrashuv tashkil etildi.',
      date: '2026-03-13',
      time: '11:00',
      location: 'Main Hall',
      type: 'Cultural',
    },
    {
      id: 23,
      title: '21-mart "Navro\'z" umumxalq bayramini',
      description:
        'Navro\'zni ulug\'lash – insonni ulug\'lashdir!" degan bosh g\'oya asosida oʻtkazish maqsadida Tuproqqalʼa tuman ixtisoslashtirilgan maktabida "Navroʻz sayli" boʻlib oʻtdi.',
      date: '2026-03-19',
      time: '11:00',
      location: 'Main Hall',
      type: 'Cultural',
    },
    {
      id: 24,
      title: '"DIREKTOR STIPENDIYASI" topshirish tadbiri',
      description:
        'Kurbanbayev Bunyodbek Jumaboy oʻgʻli 5-"A" sinf oʻquvchisi. Quranboyev Suhrobbek Yunusbek oʻgʻli 5-"A" sinf oʻquvchisi. Xudayberganova Goʻzalxon Oybek qizi 8-"A" sinf o\'quvchisi',
      date: '2026-04-03',
      time: '11:00',
      location: 'School Yard',
      type: 'Cultural',
    },
    {
      id: 25,
      title: 'Amir Temur tavalludining 690 yilligi',
      description:
        'Sohibqiron Amir Temur hayoti hamda tarixiy merosini keng targ\'ib qilish, o\'quvchilarda vatanparvarlik, tarixiy xotiraga hurmat tuyg\'ularini yanada mustahkamlashdan iborat bo\'ldi',
      date: '2026-04-09',
      time: '12:30',
      location: 'Main Hall',
      type: 'Cultural',
    },
  ];

  // Tadbirlarni birlashtirish va tartiblash
  const events = useMemo(() => {
    const allEventsList: Array<{
      id: string | number;
      title: string;
      description: string;
      date: string;
      time: string;
      location: string;
      type: string;
    }> = [];

    // Backend API'dan olingan tadbirlar
    if (apiEvents && apiEvents.length > 0) {
      apiEvents.forEach((event) => {
        const title = language === 'uz' ? event.title_uz : language === 'ru' ? event.title_ru : event.title_en;
        const description = language === 'uz' ? event.description_uz : language === 'ru' ? event.description_ru : event.description_en;
        const eventDate = event.event_date ? new Date(event.event_date).toISOString().split('T')[0] : '';
        const eventTime = event.event_time || '10:00 AM';
        const location = event.location || 'School';

        allEventsList.push({
          id: event.id,
          title,
          description: description || '',
          date: eventDate,
          time: eventTime,
          location,
          type: event.category || 'Cultural',
        });
      });
    }

    // Hardcoded tadbirlar (fallback yoki qo'shimcha)
    if (allEventsList.length === 0) {
      hardcodedEvents.forEach((event) => {
        allEventsList.push({
          id: event.id,
          title: event.title,
          description: event.description,
          date: event.date,
          time: event.time,
          location: event.location,
          type: event.type,
        });
      });
    }

    // Sanasi bo'yicha kamayish tartibida tartiblash (eng yangi birinchi)
    return allEventsList.sort((a, b) => {
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
          )}
        </div>
      </section>
    </Layout>
  );
};

export default Events;
