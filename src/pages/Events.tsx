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
      title_uz: 'Bilimlar kuni',
      title_ru: 'День знаний',
      title_en: 'Knowledge Day',
      description_uz: 'Yangi o‘quv yilining boshlanishiga bag‘ishlangan tantanali tadbir.',
      description_ru: 'Торжественное мероприятие, посвященное началу нового учебного года.',
      description_en: 'A solemn event dedicated to the beginning of the new academic year.',
      date: '2025-09-02',
      time: '10:00 AM',
      location: 'School Yard',
      type: 'Cultural',
    },
    {
      id: 2,
      title_uz: 'Ustoz va Murabbiylar kuni',
      title_ru: 'День учителя и наставника',
      title_en: 'Teachers and Mentors Day',
      description_uz: 'Ustozlarga hurmat va ehtirom ko‘rsatish maqsadida tashkil etilgan bayram.',
      description_ru: 'Праздник, организованный для выражения уважения и почтения учителям.',
      description_en: 'A holiday organized to show respect and honor to teachers.',
      date: '2025-09-30',
      time: '10:00 AM',
      location: 'Main Hall',
      type: 'Cultural',
    },
    {
      id: 3,
      title_uz: 'O‘zbek tiliga davlat tili maqomi berilgan kun',
      title_ru: 'День придания узбекскому языку статуса государственного языка',
      title_en: 'Day of Granting State Language Status to Uzbek',
      description_uz: 'Davlat tilining nufuzi va ahamiyatiga bag‘ishlangan ma’naviy tadbir.',
      description_ru: 'Духовное мероприятие, посвященное престижу и важности государственного языка.',
      description_en: 'A spiritual event dedicated to the prestige and importance of the state language.',
      date: '2025-10-21',
      time: '10:00 AM',
      location: 'Assembly Hall',
      type: 'Cultural',
    },
    {
      id: 4,
      title_uz: 'Olimpiada g‘oliblarini taqdirlash',
      title_ru: 'Награждение победителей олимпиады',
      title_en: 'Awarding Olympiad Winners',
      description_uz: 'Fan olimpiadalarida yuqori natijalarga erishgan o‘quvchilarni taqdirlash marosimi.',
      description_ru: 'Церемония награждения учащихся, достигших высоких результатов на предметных олимпиадах.',
      description_en: 'A ceremony to award students who have achieved high results in subject olympiads.',
      date: '2025-11-11',
      time: '10:00 AM',
      location: 'Main Hall',
      type: 'Academic',
    },
    {
      id: 5,
      title_uz: 'Davlat Bayrog‘i qabul qilingan kun',
      title_ru: 'День принятия Государственного флага',
      title_en: 'State Flag Adoption Day',
      description_uz: 'Vatan ramzlariga hurmat va vatanparvarlik ruhidagi tadbir.',
      description_ru: 'Мероприятие в духе уважения к символам Родины и патриотизма.',
      description_en: 'An event in the spirit of respect for the symbols of the Motherland and patriotism.',
      date: '2025-11-18',
      time: '10:00 AM',
      location: 'School Yard',
      type: 'Cultural',
    },
    {
      id: 6,
      title_uz: 'Konstitutsiya qabul qilingan kun',
      title_ru: 'День принятия Конституции',
      title_en: 'Constitution Adoption Day',
      description_uz: 'Huquqiy bilimlarni oshirishga qaratilgan ma’rifiy tadbir.',
      description_ru: 'Просветительское мероприятие, направленное на повышение правовых знаний.',
      description_en: 'An educational event aimed at improving legal knowledge.',
      date: '2025-12-07',
      time: '10:00 AM',
      location: 'Assembly Hall',
      type: 'Cultural',
    },
    {
      id: 7,
      title_uz: 'Davlat Madhiyasi qabul qilingan kun',
      title_ru: 'День принятия Государственного гимна',
      title_en: 'State Anthem Adoption Day',
      description_uz: 'Vatanparvarlik va milliy g‘ururni mustahkamlovchi tadbir.',
      description_ru: 'Мероприятие, укрепляющее патриотизм и национальную гордость.',
      description_en: 'An event that strengthens patriotism and national pride.',
      date: '2025-12-10',
      time: '10:00 AM',
      location: 'School Yard',
      type: 'Cultural',
    },
    {
      id: 8,
      title_uz: '"Zakovat" intellektual o‘yini',
      title_ru: 'Интеллектуальная игра "Заковат"',
      title_en: '"Zakovat" Intellectual Game',
      description_uz: 'Bilim, mantiq va tezkor fikrlashni sinovdan o‘tkazuvchi musobaqa.',
      description_ru: 'Соревнование, проверяющее знания, логику и быстроту мышления.',
      description_en: 'A competition that tests knowledge, logic and quick thinking.',
      date: '2025-12-12',
      time: '10:00 AM',
      location: 'Classrooms',
      type: 'Academic',
    },
    {
      id: 9,
      title_uz: 'Matematika fani tadbiri',
      title_ru: 'Мероприятие по математике',
      title_en: 'Mathematics Event',
      description_uz: 'Aniq fanlarga qiziqishni oshirishga qaratilgan bellashuvlar.',
      description_ru: 'Соревнования, направленные на повышение интереса к точным наукам.',
      description_en: 'Competitions aimed at increasing interest in exact sciences.',
      date: '2025-12-16',
      time: '10:00 AM',
      location: 'STEM Room',
      type: 'Academic',
    },
    {
      id: 10,
      title_uz: 'Kimyo fani tadbiri',
      title_ru: 'Мероприятие по химии',
      title_en: 'Chemistry Event',
      description_uz: 'Qiziqarli tajribalar va ilmiy ko‘rgazmalar.',
      description_ru: 'Интересные эксперименты и научные выставки.',
      description_en: 'Interesting experiments and scientific exhibitions.',
      date: '2025-12-18',
      time: '10:00 AM',
      location: 'Laboratory',
      type: 'Academic',
    },
    {
      id: 11,
      title_uz: 'Fizika fani tadbiri',
      title_ru: 'Мероприятие по физике',
      title_en: 'Physics Event',
      description_uz: 'Fizika fanining amaliy ahamiyatiga bag‘ishlangan tadbir.',
      description_ru: 'Мероприятие, посвященное практическому значению физики.',
      description_en: 'An event dedicated to the practical importance of physics.',
      date: '2025-12-20',
      time: '10:00 AM',
      location: 'Laboratory',
      type: 'Academic',
    },
    {
      id: 12,
      title_uz: 'Yangi yil tadbiri',
      title_ru: 'Новогоднее мероприятие',
      title_en: 'New Year Event',
      description_uz: 'Bayramona sahna ko‘rinishlari va tantanali yangi yil dasturi.',
      description_ru: 'Праздничные сценические представления и торжественная новогодняя программа.',
      description_en: 'Festive stage performances and solemn New Year\'s program.',
      date: '2025-12-26',
      time: '10:00 AM',
      location: 'Main Hall',
      type: 'Cultural',
    },
    {
      id: 13,
      title_uz: '14-yanvar Vatan himoyachilari kuni',
      title_ru: '14 января - День защитников Родины',
      title_en: 'January 14 - Defenders of the Homeland Day',
      description_uz: 'Bayramona sahna ko‘rinishlari va tantanali Harbiy dasturlar.',
      description_ru: 'Праздничные сценические представления и торжественные военные программы.',
      description_en: 'Festive stage performances and solemn military programs.',
      date: '2026-01-13',
      time: '10:00 AM',
      location: 'Main Hall',
      type: 'Cultural',
    },
    {
      id: 14,
      title_uz: 'Eco Qumita Yig\'ilishi',
      title_ru: 'Заседание Эко-комитета',
      title_en: 'Eco Committee Meeting',
      description_uz: '✅Bugun Tuproqqalʼa tuman ixtisoslashtirilgan maktabida Eco-Schools xalqaro ekologik ta\'lim loyihasi doirasida navbatdagi muhim tadbir tashkil etildi.',
      description_ru: 'Сегодня в специализированной школе Тупроккалинского района прошло очередное важное мероприятие в рамках международного проекта экологического образования Eco-Schools.',
      description_en: 'Today, another important event was organized at the specialized school of Tuproqqala district within the framework of the Eco-Schools international environmental education project.',
      date: '2026-01-19',
      time: '10:00 AM',
      location: 'Main Hall',
      type: 'Cultural',
    },
    {
      id: 15,
      title_uz: '"ZAKOVAT" intellektual oʻyini',
      title_ru: 'Интеллектуальная игра "Заковат"',
      title_en: '"Zakovat" Intellectual Game',
      description_uz: 'Oʻtkir Hoshimov ijodiga bag\'ishlangan "ZAKOVAT" intellektual o\'yini tashkil etildi.',
      description_ru: 'Организована интеллектуальная игра "Заковат", посвященная творчеству Уткира Хашимова.',
      description_en: 'An intellectual game "Zakovat" dedicated to the work of Utkir Hoshimov was organized.',
      date: '2026-01-29',
      time: '1:00 PM',
      location: 'Main Hall',
      type: 'Cultural',
    },
    {
      id: 16,
      title_uz: '"BOʻLAJAK MEDIKLAR" nomli tadbir',
      title_ru: 'Мероприятие "БУДУЩИЕ МЕДИКИ"',
      title_en: 'Event "FUTURE MEDICS"',
      description_uz: '11-"B" sinf oʻquvchilari ishtirokida "BOʻLAJAK MEDIKLAR" nomli tadbir tashkil etildi',
      description_ru: 'С участием учеников 11-"В" класса организовано мероприятие "БУДУЩИЕ МЕДИКИ"',
      description_en: 'Event "FUTURE MEDICS" was organized with the participation of students from class 11-"B"',
      date: '2026-01-28',
      time: '11:00 AM',
      location: 'Main Hall',
      type: 'Cultural',
    },
    {
      id: 17,
      title_uz: '🕯IKKI BUYUK SIYMO🕯',
      title_ru: '🕯ДВЕ ВЕЛИКИЕ ФИГУРЫ🕯',
      title_en: '🕯TWO GREAT FIGURES🕯',
      description_uz: '🕯Tadbirda Alisher Navoiy va Zahiriddin Muhammad Bobur ijodidan gʻazal va ruboiylar, hikmatli soʻzlar aytildi.',
      description_ru: 'На мероприятии прозвучали газели, рубаи и мудрые слова из творчества Алишера Навои и Захириддина Мухаммада Бабура.',
      description_en: 'Ghazals, rubais, and words of wisdom from the works of Alisher Navoi and Zahiriddin Muhammad Babur were recited at the event.',
      date: '2026-02-09',
      time: '10:00 AM',
      location: 'Main Hall',
      type: 'Cultural',
    },
    {
      id: 18,
      title_uz: 'Xalqaro ilm fan sohasidagi xotin-qizlar kuni',
      title_ru: 'Международный день женщин и девочек в науке',
      title_en: 'International Day of Women and Girls in Science',
      description_uz: 'Xalqaro ilm fan sohasidagi xotin-qizlar kuni munosabati bilan ma\'naviy-ma\'rifiy tadbir tashkil etildi.',
      description_ru: 'В связи с Международным днем женщин в науке было организовано духовно-просветительское мероприятие.',
      description_en: 'A spiritual and educational event was organized on the occasion of the International Day of Women in Science.',
      date: '2026-02-13',
      time: '10:00 AM',
      location: 'Main Hall',
      type: 'Cultural',
    },
    {
      id: 19,
      title_uz: 'Zulfiya Isroilova tavallud tadbiri',
      title_ru: 'Мероприятие ко дню рождения Зульфии Исраиловой',
      title_en: 'Zulfiya Israilova\'s Birthday Event',
      description_uz: 'Zulfiya Isroilova tavallud sanasiga bagʻishlangan maʼnaviy-maʼrifiy tadbir boʻlib oʻtdi.',
      description_ru: 'Состоялось духовно-просветительское мероприятие, посвященное дню рождения Зульфии Исраиловой.',
      description_en: 'A spiritual and educational event dedicated to the birthday of Zulfiya Israilova was held.',
      date: '2026-02-27',
      time: '1:00 PM',
      location: 'Main Hall',
      type: 'Cultural',
    },
    {
      id: 20,
      title_uz: '“МАСЛЕНИЦА”',
      title_ru: '“МАСЛЕНИЦА”',
      title_en: '“MASLENITSA”',
      description_uz: '“МАСЛЕНИЦА” mavzusida ma\'naviy-ma\'rifiy tadbir tashkil etildi.',
      description_ru: 'Организовано духовно-просветительское мероприятие на тему “МАСЛЕНИЦА”.',
      description_en: 'A spiritual and educational event on the theme of “MASLENITSA” was organized.',
      date: '2026-03-05',
      time: '10:00 AM',
      location: 'Main Hall',
      type: 'Cultural',
    },
    {
      id: 21,
      title_uz: '8-mart Xalqaro xotin-qizlar kuni',
      title_ru: '8 марта - Международный женский день',
      title_en: 'March 8 - International Women\'s Day',
      description_uz: 'Tuproqqalʼa tuman ixtisoslashtirilgan maktabida "Ayol baxtli bo\'lsa, jamiyat baxtlidir" shiori ostidagi tadbir o\'tkazildi',
      description_ru: 'В специализированной школе Тупроккалинского района прошло мероприятие под девизом "Если женщина счастлива, счастливо и общество"',
      description_en: 'An event under the motto "If a woman is happy, society is happy" was held at the specialized school of Tuproqqala district',
      date: '2026-03-06',
      time: '1:00 PM',
      location: 'Main Hall',
      type: 'Cultural',
    },
    {
      id: 22,
      title_uz: '🎓 Osiyo xalqaro universiteti vakillari bilan uchrashuv tashkil etildi.',
      title_ru: '🎓 Организована встреча с представителями Международного Азиатского университета.',
      title_en: '🎓 A meeting with representatives of Asian International University was organized.',
      description_uz: '🎓 Osiyo xalqaro universiteti vakillari bilan uchrashuv tashkil etildi.',
      description_ru: '🎓 Организована встреча с представителями Международного Азиатского университета.',
      description_en: '🎓 A meeting with representatives of Asian International University was organized.',
      date: '2026-03-13',
      time: '11:00 AM',
      location: 'Main Hall',
      type: 'Cultural',
    },
    {
      id: 23,
      title_uz: '21-mart "Navro\'z" umumxalq bayrami',
      title_ru: '21 марта — всенародный праздник «Навруз»',
      title_en: 'March 21 - "Navruz" national holiday',
      description_uz: '"Navro\'zni ulug\'lash – insonni ulug\'lashdir!" degan bosh g\'oya asosida oʻtkazish maqsadida Tuproqqalʼa tuman ixtisoslashtirilgan maktabida "Navroʻz sayli" boʻlib oʻtdi.',
      description_ru: 'В целях проведения под главной идеей «Прославлять Навруз – прославлять человека!» в специализированной школе Тупроккалинского района прошел «Праздник Навруз».',
      description_en: 'In order to hold it under the main idea "To glorify Navruz is to glorify a person!", a "Navruz festival" was held at the specialized school of Tuproqqala district.',
      date: '2026-03-19',
      time: '11:00 AM',
      location: 'Main Hall',
      type: 'Cultural',
    },
    {
      id: 24,
      title_uz: '"DIREKTOR STIPENDIYASI" topshirish tadbiri',
      title_ru: 'Церемония вручения "СТИПЕНДИИ ДИРЕКТОРА"',
      title_en: '"PRINCIPAL\'S SCHOLARSHIP" Awarding Event',
      description_uz: 'Kurbanbayev Bunyodbek Jumaboy oʻgʻli 5-"A" sinf oʻquvchisi. Quranboyev Suhrobbek Yunusbek oʻgʻli 5-"A" sinf oʻquvchisi. Xudayberganova Goʻzalxon Oybek qizi 8-"A" sinf o\'quvchisi',
      description_ru: 'Ученик 5-"А" класса Курбанбаев Бунёдбек Жумабой угли. Ученик 5-"А" класса Куранбоев Сухроббек Юнусбек угли. Ученица 8-"А" класса Худайберганова Гюзалхон Ойбек кизи',
      description_en: '5th-"A" grade student Kurbanbayev Bunyodbek Jumaboy ugli. 5th-"A" grade student Quranboyev Suhrobbek Yunusbek ugli. 8th-"A" grade student Khudayberganova Guzalxon Oybek kizi',
      date: '2026-04-03',
      time: '11:00 AM',
      location: 'School Yard',
      type: 'Cultural',
    },
    {
      id: 25,
      title_uz: 'Amir Temur tavalludining 690 yilligi',
      title_ru: '690-летие со дня рождения Амира Темура',
      title_en: '690th anniversary of the birth of Amir Temur',
      description_uz: 'Sohibqiron Amir Temur hayoti hamda tarixiy merosini keng targ\'ib qilish, o\'quvchilarda vatanparvarlik, tarixiy xotiraga hurmat tuyg\'ularini yanada mustahkamlashdan iborat bo\'ldi',
      description_ru: 'Мероприятие было направлено на широкую популяризацию жизни и исторического наследия Амира Темура, дальнейшее укрепление чувства патриотизма и уважения к исторической памяти у учащихся',
      description_en: 'The event aimed at widely promoting the life and historical legacy of Amir Temur, further strengthening feelings of patriotism and respect for historical memory among students',
      date: '2026-04-09',
      time: '12:30 PM',
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

    // Hardcoded tadbirlar (har doim qo'shiladi, dublikatlar tekshiriladi)
    const apiTitles = new Set(allEventsList.map(e => e.title.toLowerCase().trim()));
    hardcodedEvents.forEach((event) => {
      const eventTitle = language === 'uz' ? event.title_uz : language === 'ru' ? event.title_ru : event.title_en;
      const eventDescription = language === 'uz' ? event.description_uz : language === 'ru' ? event.description_ru : event.description_en;

      if (!apiTitles.has(eventTitle.toLowerCase().trim()) && !apiTitles.has(event.title_uz.toLowerCase().trim())) {
        allEventsList.push({
          id: event.id,
          title: eventTitle || event.title_uz,
          description: eventDescription || event.description_uz,
          date: event.date,
          time: event.time,
          location: event.location,
          type: event.type,
        });
      }
    });

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
