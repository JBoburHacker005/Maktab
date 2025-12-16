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
      phone: '+998 (90) 000-00-01',
      telegram: '@Lobarxon_Direktor',
    },
    {
      name: 'Kenjayev Maqsudbek',
      role: 'Direktor o‘rinbosari (ma’naviy-ma’rifiy)',
      image: '/teachers/zam d.JPG',
      phone: '+998 (90) 000-00-02',
      telegram: '@Maqsudbek_K',
    },
    {
      name: 'Matyoqubov Ro‘zmatjon',
      role: 'Direktor maslahatchisi',
      image: '/teachers/maslahatchi.jpg',
      phone: '+998 (90) 000-00-03',
      telegram: '@Rozmatjon_M',
    },
    {
      name: 'Otamurotov Farhod',
      role: 'Direktor o‘rinbosari (o’quv ishlari)',
      image: '/teachers/zavuch.JPG',
      phone: '+998 (90) 000-00-04',
      telegram: '@Farhod_O',
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
      telegram: '',
      phone: '+998 (97) 211-44-71',
    },
    {
      name: 'Jabborov Vohidjon',
      subject: 'Physics',
      image: '/teachers/fizika1.png',
      telegram: '',
      phone: '+998 (97) 859-01-86',
    },
    {
      name: 'Qurbonboyev Mardon',
      subject: 'Law teacher',
      image: '/teachers/huquq.JPG',
      telegram: '',
      phone: '+998 (97) 451-79-39',
    },
    {
      name: 'Durdiyeva Farzona',
      subject: 'History',
      image: '/teachers/tarix.JPG',
      telegram: '',
      phone: '+998 (93) 116-29-94',
    },
    // English Literature - 5 total (1 original + 4 new)
    {
      name: 'Babajonova Dilfuza',
      subject: 'English Literature',
      image: '/teachers/ingliz tili4.png',
      telegram: '',
      phone: '+998 (99) 964-11-86',
    },
    {
      name: 'Urunova Malohat',
      subject: 'English Literature',
      image: '/teachers/ingliz tili.jpg',
      telegram: '',
      phone: '+998 (97) 130-56-88',
    },
    {
      name: 'Axmedova Shoira',
      subject: 'English Literature',
      image: '/teachers/ingliz tili3.JPG',
      telegram: '',
      phone: '+998 (97) 451-51-81',
    },
    {
      name: 'Madraimova Farangiz',
      subject: 'English Literature',
      image: '/teachers/ingliz tili2.jpg',
      telegram: '',
      phone: '',
    },
    // Russian Literature - 3 total (1 changed + 2 new)
    {
      name: 'Bekturdiyev Gʹayrat',
      subject: 'Russian Literature',
      image: '/teachers/rus tili2.gif',
      telegram: '',
      phone: '+998 (99) 747-21-13 ',
    },
    {
      name: 'Sultonova Maftuna',
      subject: 'Russian Literature',
      image: '/teachers/rus tili.jpg',
      telegram: '',
      phone: '+998 (95) 361-80-95',
    },
    {
      name: 'Baxtiyorova Dinara',
      subject: 'Russian Literature',
      image: '',
      telegram: '',
      phone: '+998 (50) 250-98-68',
    },
    // Chemistry - 1 total (keep original)
    {
      name: 'Allaberganova Gulbahor',
      subject: 'Chemistry',
      image: '/teachers/kimyo.jpg',
      telegram: '',
      phone: '+998 (99) 865-74-38',
    },
    // Computer Science - 2 total (1 original + 1 new)
    {
      name: 'Raximova Nifular',
      subject: 'Computer Science',
      image: '/teachers/informatika2.jpg',
      telegram: '',
      phone: '+998 (97) 790-01-38',
    },
    {
      name: 'Ataboyeva Mahliyo',
      subject: 'Computer Science',
      image: '/teachers/informatika.jpg',
      telegram: '',
      phone: '+998 (99) 739-40-78',
    },
    {
      name: 'Xakimov Xamza',
      subject: 'Geography',
      image: '/teachers/geografiya.JPG',
      telegram: '',
      phone: '+998 (94) 110-40-84',
    },
    {
      name: 'Raxmonov Alisher',
      subject: 'Physical Education',
      image: '/teachers/jt.JPG',
      telegram: '',
      phone: '',
    },
    {
      name: 'Roʹzibayev Azizbek',
      subject: 'Pre-Military Training',
      image: '/teachers/chqbt.JPG',
      telegram: '',
      phone: '',
    },
    {
      name: ' Hasanboy',
      subject: 'Art',
      image: '',
      telegram: '',
      phone: '',
    },
    {
      name: 'Madyorova Feruza',
      subject: 'Uzbek Literature',
      image: '/teachers/ona tili.jpg',
      telegram: '',
      phone: '+998 (94) 195-14-19',
    },
    {
      name: 'Avezova Gulbadan',
      subject: 'Uzbek Literature',
      image: '/teachers/ona tili3.JPG',
      telegram: '',
      phone: '+998 (97) 561-10-37',
    },
    {
      name: 'Azatova Laylo',
      subject: 'Uzbek Literature',
      image: '/teachers/Ona tili 2.JPG',
      telegram: '',
      phone: '',
    },
    {
      name: 'Arkayeva Iroda',
      subject: 'Uzbek Literature',
      image: '/teachers/IMG_9304.JPG',
      telegram: '',
      phone: '',
    },
    // Biology - 1 total (keep original)
    {
      name: 'Radjabova Munisa',
      subject: 'Biology',
      // Fayl nomi kichik harflarda: biologiya.jpg
      image: '/teachers/biologiya.jpg',
      telegram: '',
      phone: '+998 (88) 525-54-45',
    },
    {
      name: 'Eshmuratova Munojat',
      subject: 'Biology',
      // Fayl nomi kichik harflarda: biologiya2.jpg
      image: '/teachers/biologiya2.jpg',
      telegram: '',
      phone: '+998 (97) 459-20-88',
    },
    {
      name: 'Oʹrinboyeva Shaxzoda',
      subject: 'Secretary',
      image: '/teachers/kotiba.jpg',
      telegram: '',
      phone: '+998 (97) 211-14-43',
    },
    {
      name: 'Saparova Sabohat',
      subject: 'Psychologist',
      image: '/teachers/psixolog.jpg',
      telegram: '',
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
              {t('teachers')}
            </span>
            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground mt-3 mb-6">
              Meet Our Teachers
            </h1>
            <p className="text-lg text-muted-foreground">
              Our dedicated faculty members bring expertise, passion, and a commitment 
              to nurturing every student's potential.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Teachers Grid */}
      <section className="py-20 lg:py-28">
        <div className="container mx-auto px-4">
          {/* Leadership */}
          <div className="mb-14">
            <div className="mb-6 text-center">
              <h2 className="font-display text-3xl font-bold text-foreground">Rahbariyat</h2>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {leaders.map((leader, index) => (
                <motion.div
                  key={leader.name}
                  initial={{ opacity: 0, y: 25 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05 }}
                  className="p-6 rounded-2xl bg-card border border-primary/20 shadow-[0_10px_40px_-20px_rgba(59,130,246,0.6)] text-center"
                >
                  <div className="relative w-24 h-24 mx-auto mb-4 rounded-full overflow-hidden ring-4 ring-primary/20">
                    <img
                      src={leader.image}
                      alt={leader.name}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  </div>
                  <h3 className="font-display font-semibold text-lg text-foreground mb-1">
                    {leader.name}
                  </h3>
                  <p className="text-primary text-sm font-medium mb-3">{leader.role}</p>
                  <div className="flex justify-center gap-2">
                    {leader.telegram && (
                      <a
                        href={leader.telegram.startsWith('http') ? leader.telegram : `https://t.me/${leader.telegram.replace('@', '')}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-9 h-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition"
                        title="Telegram"
                      >
                        <Send className="w-4 h-4" />
                      </a>
                    )}
                    {leader.phone && (
                      <a
                        href={`tel:${leader.phone}`}
                        className="w-9 h-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition"
                        title="Phone"
                      >
                        <Phone className="w-4 h-4" />
                      </a>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Teachers heading */}
          <div className="mb-8 text-center">
            <h2 className="font-display text-3xl font-bold text-foreground">O'qituvchilar</h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {teachers.map((teacher, index) => (
              <motion.div
                key={teacher.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                className="group p-6 rounded-2xl bg-card border border-border/50 text-center hover:shadow-xl transition-all duration-300"
              >
                <div className="relative w-24 h-24 mx-auto mb-4 rounded-full overflow-hidden ring-4 ring-primary/10 group-hover:ring-primary/30 transition-all">
                  <img
                    src={teacher.image}
                    alt={teacher.name}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>
                <h3 className="font-display font-semibold text-lg text-foreground mb-1">
                  {teacher.name}
                </h3>
                <p className="text-primary text-sm font-medium mb-4">
                  {teacher.subject}
                </p>
                <div className="flex justify-center gap-2">
                  {teacher.telegram && (
                    <a
                      href={teacher.telegram.startsWith('http') ? teacher.telegram : `https://t.me/${teacher.telegram.replace('@', '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-9 h-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors"
                      title="Telegram"
                    >
                      <Send className="w-4 h-4" />
                    </a>
                  )}
                  {teacher.phone && (
                    <a
                      href={`tel:${teacher.phone}`}
                      className="w-9 h-9 rounded-lg bg-muted flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors"
                      title="Phone"
                    >
                      <Phone className="w-4 h-4" />
                    </a>
                  )}
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
