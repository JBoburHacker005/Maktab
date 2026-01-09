import React from 'react';
import { motion } from 'framer-motion';
import { Phone, Send } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import { useLanguage } from '@/contexts/LanguageContext';

const Teachers: React.FC = () => {
  const { t } = useLanguage();

  const leaders = [
    {
      name: 'Matyoqubova Lobarxon',
      role: 'Direktor',
      image: '/teachers/deriktor.jpg',
      phone: '+998 (95) 444-14-74',
      telegram: '@lobar_ortiqboyevna',
    },
    {
      name: 'Kenjayev Maqsudbek',
      role: 'Direktor o‘rinbosari (ma’naviy-ma’rifiy)',
      image: '/teachers/maqsud ustoz.png',
      phone: '+998 (99) 963-50-60',
      telegram: '@Maqsudbek',
    },
    {
      name: 'Matyoqubov Ro‘zmatjon',
      role: 'Direktor maslahatchisi',
      image: '/teachers/maslahatchi.jpg',
      phone: '+998 (99) 338-91-11',
      telegram: '@rico9111',
    },
    {
      name: 'Otamurotov Farhod',
      role: 'Direktor o‘rinbosari (o’quv ishlari)',
      image: '/teachers/zavuch.JPG',
      phone: '+998 (97) 528-19-93',
      telegram: '@Farxod586',
    },
  ];

  const teachers = [
    // Mathematics - 6 total
    {
      name: 'Qolandarov Davronbek',
      subject: 'Mathematics',
      image: '/teachers/matematika5.png',
      telegram: '@Qalandarov_Davronbek',
      phone: '+998 (97) 458-25-87',
    },
    {
      name: 'Sapayev Doniyor',
      subject: 'Mathematics',
      image: '/teachers/matematika2.jpg',
      telegram: '@Sapayev_D',
      phone: '+998 (97) 430-80-15',
    },
    {
      name: 'Ibodullayev Sherzod',
      subject: 'Mathematics',
      image: '/teachers/matematika4.png',
      telegram: '@Sherzodbek_Ibadullayev',
      phone: '+998 (94) 117-90-20',
    },
    {
      name: 'Radjapov Davlatyor',
      subject: 'Mathematics',
      image: '/teachers/matematika3.jpg',
      telegram: '@DR0096X',
      phone: '+998 (99) 022-60-96',
    },
    {
      name: 'Matchanov Temur',
      subject: 'Mathematics',
      image: '/teachers/matematika.jpg',
      telegram: '@Temur_Matchanov',
      phone: '+998 (99) 747-21-13',
    },
    {
      name: 'Xojixonova Kumush',
      subject: 'Mathematics',
      image: '/teachers/matematika6.jpg',
      telegram: '@Math930919100',
      phone: '+998 (94) 676-48-46',
    },
    // Physics - 2 total (1 original + 1 new)
    {
      name: 'Matmurotov Quvandiq',
      subject: 'Physics',
      image: '/teachers/fizika.jpg',
      telegram: '@arnimen',
      phone: '+998 (97) 211-44-71',
    },
    {
      name: 'Jabborov Vohidjon',
      subject: 'Physics',
      image: '/teachers/fizika1.png',
      telegram: '@Vohidjon019',
      phone: '+998 (97) 859-01-86',
    },
    {
      name: 'Qurbonboyev Mardon',
      subject: 'Law teacher',
      image: '/teachers/huquq.JPG',
      telegram: '@alibekbobosi',
      phone: '+998 (97) 451-79-39',
    },
    {
      name: 'Durdiyeva Farzona',
      subject: 'History',
      image: '/teachers/tarix.JPG',
      telegram: '@Farzona_Durdiyeva',
      phone: '+998 (93) 116-29-94',
    },
    // English Literature - 5 total (1 original + 4 new)
    {
      name: 'Babajonova Dilfuza',
      subject: 'English Literature',
      image: '/teachers/ingliz tili4.png',
      telegram: '@D_Babajonova',
      phone: '+998 (99) 964-11-86',
    },
    {
      name: 'Urunova Malohat',
      subject: 'English Literature',
      image: '/teachers/ingliz tili.jpg',
      telegram: '@Malohat_Urunova',
      phone: '+998 (97) 130-56-88',
    },
    {
      name: 'Axmedova Shoira',
      subject: 'English Literature',
      image: '/teachers/ingliz tili3.JPG',
      telegram: '@Shoira_9475',
      phone: '+998 (97) 451-51-81',
    },
    {
      name: 'Madraimova Farangiz',
      subject: 'English Literature',
      image: '/teachers/ingliz tili2.jpg',
      telegram: '@farangizmadraimova',
      phone: '+998 (77) 408-05-31',
    },
    // Russian Literature - 3 total (1 changed + 2 new)
    {
      name: 'Bekturdiyev Gʹayrat',
      subject: 'Russian Literature',
      image: '/teachers/rus tili2.gif',
      telegram: '@G_Bekturdiyev',
      phone: '+998 (99) 747-21-13 ',
    },
    {
      name: 'Sultonova Maftuna',
      subject: 'Russian Literature',
      image: '/teachers/rus tili.jpg',
      telegram: '@Quyoshimning_Nurlariman',
      phone: '+998 (95) 361-80-95',
    },
    {
      name: 'Baxtiyorova Dinara',
      subject: 'Russian Literature',
      image: '/teachers/rus tili4.png',
      telegram: '@Dinara050125',
      phone: '+998 (50) 250-98-68',
    },
    // Chemistry - 1 total (keep original)
    {
      name: 'Allaberganova Gulbahor',
      subject: 'Chemistry',
      image: '/teachers/kimyo.jpg',
      telegram: '@Gulbahor_Allaberganova',
      phone: '+998 (99) 865-74-38',
    },
    // Computer Science - 2 total (1 original + 1 new)
    {
      name: 'Raximova Nifular',
      subject: 'Computer Science',
      image: '/teachers/informatika2.jpg',
      telegram: '@N_Rakhimova',
      phone: '+998 (97) 790-01-38',
    },
    {
      name: 'Ataboyeva Mahliyo',
      subject: 'Computer Science',
      image: '/teachers/informatika.jpg',
      telegram: '@M18082023',
      phone: '+998 (99) 739-40-78',
    },
    {
      name: 'Xakimov Xamza',
      subject: 'Geography',
      image: '/teachers/geografiya.JPG',
      telegram: '@Xakimov_Xamza',
      phone: '+998 (94) 110-40-84',
    },
    {
      name: 'Raxmonov Alisher',
      subject: 'Physical Education',
      image: '/teachers/jt.JPG',
      telegram: '@alisher_raxmonov',
      phone: '+998 (99) 757-47-54',
    },
    {
      name: 'Roʹzibayev Azizbek',
      subject: 'Pre-Military Training',
      image: '/teachers/chqbt.JPG',
      telegram: '@Azizbek_Rozibayev',
      phone: '+998 (88) 457-52-22',
    },
    {
      name: 'Atajonov Hasanboy',
      subject: 'Art',
      image: '/teachers/art.png',
      telegram: '@Xasanboy_80',
      phone: '+998 (91) 431-42-28',
    },
    {
      name: 'Madyorova Feruza',
      subject: 'Uzbek Literature',
      image: '/teachers/ona tili.jpg',
      telegram: '@Feruza_Madyorova',
      phone: '+998 (94) 195-14-19',
    },
    {
      name: 'Avezova Gulbadan',
      subject: 'Uzbek Literature',
      image: '/teachers/ona tili3.JPG',
      telegram: '@Gulbadan_Avezova',
      phone: '+998 (97) 561-10-37',
    },
    {
      name: 'Azatova Laylo',
      subject: 'Uzbek Literature',
      image: '/teachers/Ona tili 2.JPG',
      telegram: '@Laylo_Azatova',
      phone: '+998 (99)096-35-16',
    },
    {
      name: 'Arkayeva Iroda',
      subject: 'Uzbek Literature',
      image: '/teachers/IMG_9304.JPG',
      telegram: '+998 (97) 517-35-40',
      phone: '@iroda2907l',
    },
    // Biology - 1 total (keep original)
    {
      name: 'Radjabova Munisa',
      subject: 'Biology',
      image: '/teachers/munisa ustoz.JPG',
      telegram: '@Xonuwm',
      phone: '+998 (88) 525-54-45',
    },
    {
      name: 'Eshmuratova Munojat',
      subject: 'Biology',
      image: '/teachers/munojat ustoz.JPG',
      telegram: '@munojateshmuratova',
      phone: '+998 (97) 459-20-88',
    },
    {
      name: 'Oʹrinboyeva Shaxzoda',
      subject: 'Secretary',
      image: '/teachers/kotiba.jpg',
      telegram: '@Shaxzoda_O',
      phone: '+998 (97) 211-14-43',
    },
    {
      name: 'Saparova Sabohat',
      subject: 'Psychologist',
      image: '/teachers/psix.jpg',
      telegram: '@Sabohat_Saparova',
      phone: '+998 (97) 299-88-40',
    },
  ];

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
              {t('ourTeam')}
            </span>
            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground mt-3 mb-6">
              {t('meetTeachers')}
            </h1>
            <p className="text-lg text-muted-foreground">
              {t('meetTeachersDesc')}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Leadership */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl font-display font-bold mb-4">{t('schoolLeadership')}</h2>
            <div className="w-20 h-1.5 bg-primary mx-auto rounded-full" />
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {leaders.map((leader, index) => (
              <motion.div
                key={leader.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="group relative overflow-hidden rounded-2xl bg-card border border-border/50 hover:shadow-xl transition-all duration-300"
              >
                <div className="aspect-[4/3] overflow-hidden">
                  <img
                    src={leader.image}
                    alt={leader.name}
                    className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80" />

                  <div className="absolute bottom-0 left-0 right-0 p-6 text-white translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                    <h3 className="font-display font-bold text-xl mb-1">{leader.name}</h3>
                    <p className="text-primary-foreground/90 font-medium mb-4">{leader.role}</p>

                    <div className="flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100">
                      <a
                        href={`tel:${leader.phone}`}
                        className="flex items-center gap-2 text-sm hover:text-primary-foreground transition-colors"
                      >
                        <Phone className="w-4 h-4" />
                        {leader.phone}
                      </a>
                      <a
                        href={`https://t.me/${leader.telegram.replace('@', '')}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-sm hover:text-primary-foreground transition-colors"
                      >
                        <Send className="w-4 h-4" />
                        {leader.telegram}
                      </a>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Teachers Grid */}
      <section className="py-20 lg:py-28">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl font-display font-bold mb-4">{t('ourTeachers')}</h2>
            <div className="w-20 h-1.5 bg-primary mx-auto rounded-full" />
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {teachers.map((teacher, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                className="group bg-card rounded-xl border border-border/50 overflow-hidden hover:shadow-lg transition-all duration-300"
              >
                <div className="aspect-square overflow-hidden relative">
                  <img
                    src={teacher.image}
                    alt={teacher.name}
                    className="w-full h-full object-cover object-top group-hover:scale-110 transition-transform duration-500"
                  />

                  {/* Overlay with Contact Info */}
                  <div className="absolute inset-0 bg-primary/90 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <div className="text-center p-4 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                      <a
                        href={`tel:${teacher.phone}`}
                        className="flex items-center justify-center gap-2 text-primary-foreground mb-3 hover:opacity-80 transition-opacity"
                      >
                        <Phone className="w-4 h-4" />
                        <span className="text-sm font-medium">{teacher.phone}</span>
                      </a>
                      <a
                        href={`https://t.me/${teacher.telegram.replace('@', '')}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-2 text-primary-foreground hover:opacity-80 transition-opacity"
                      >
                        <Send className="w-4 h-4" />
                        <span className="text-sm font-medium">{teacher.telegram}</span>
                      </a>
                    </div>
                  </div>
                </div>

                <div className="p-4 text-center">
                  <h3 className="font-bold text-foreground mb-1">{teacher.name}</h3>
                  <p className="text-sm text-primary font-medium">{teacher.subject}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Teachers;
