import React from 'react';
import { motion } from 'framer-motion';
import { Target, Eye, Award, BookOpen, Users, Calendar, GraduationCap, Trophy, FileText, Laptop, Leaf, Brain, FlaskConical, Atom, Calculator, Activity, Heart, BarChart3, Send, Github, Mail, PhoneCall } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip, LabelList as RechartsLabelList } from 'recharts';
import Layout from '@/components/layout/Layout';
import { useLanguage } from '@/contexts/LanguageContext';

const About: React.FC = () => {
  const { t } = useLanguage();

  const achievements = [
    { icon: Users, value: '295+', label: t('students') },
    { icon: BookOpen, value: '29+', label: t('teachersCount') },
    { icon: Calendar, value: '4+', label: t('yearsExp') },
    { icon: Award, value: '50+', label: t('awards') },
    { icon: GraduationCap, value: '95%', label: t('universityAdmission100') },
  ];

  const leadership = [
    {
      name: 'Jovliyev Bobur',
      image: '/teachers/Bobur.jpg',
    },
    {
      name: "Norimov G'anijon",
      image: '/teachers/Ganijon.JPG',
    },
    {
      name: "Komiljonov Bobur",
      image: '/teachers/Komiljonov Bobur.jpg',
    },
    {
      name: "Ilxomova Charosxon",
      image: '/teachers/ILXOMOVA CHAROS.jpg',
    },
    {
      name: "Ibragimova Ramzila",
      image: '/teachers/Ramzila.jpg',
    },
    {
      name: "Qalandarova Ruxsora",
      image: '/teachers/RUXSORA.jpg',
    },
    {
      name: "Sobirova Flyura",
      image: '/teachers/FLYURA.jpg',
    },
    {
      name: "Xudoyberganova Asalxon",
      image: '/teachers/Asalxon.jpg',
    },
    {
      name: "Komilova Xurshidabonu",
      image: '/teachers/XURSHIDA.jpg',
    },
    {
      name: "Karimova Charosxon",
      image: '/teachers/KARIMOVA CHAROS.jpg',
    },
    {
      name: "Safarboyev Mehrojbek",
      image: '/teachers/Mexroj.jpg',
    },
    {
      name: "Sadullayeva Yulduzxon",
      image: '/teachers/Yulduz.jpg',
    },
    {
      name: "Kuvandikov Muzrobbek",
      image: '/teachers/Muzrob.jpg',
    },
    {
      name: "Jumaniyozov Muhammadjon",
      image: '/teachers/Muhammad.jpg',
    },
    {
      name: "Eshchonov Xamidjon",
      image: '/teachers/XAMIDJON.jpg',
    },
  ];

  const teacherCategoryData = [
    { label: 'Mutaxassis', value: 1 },
    { label: 'Ikkinchi toifa', value: 2 },
    { label: 'Birinchi toifa', value: 5 },
    { label: 'Oliy toifa', value: 19 },
  ];

  const contactInfo = {
    telegramHandle: '@Jovliyev_Bobur',
    telegramUrl: 'https://t.me/Jovliyev_Bobur',
    githubUrl: 'https://github.com/JBoburHacker005/',
    email: 'jbobur005@gmail.com',
    phoneDisplay: '+998 (93) 005-42-87',
    phoneHref: '+998930054287',
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
        <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" />
        
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl mx-auto text-center"
          >
            <span className="text-primary font-medium text-sm uppercase tracking-wider">
              {t('about')}
            </span>
            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground mt-3 mb-6">
              {t('buildingFuturesSince')}
            </h1>
            <p className="text-lg text-muted-foreground">
              {t('aboutHeroDescription')}
            </p>
            <p className="text-base text-muted-foreground mt-4">
              {t('aboutEstablishment')}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-20 lg:py-28">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="p-8 lg:p-10 rounded-2xl bg-card border border-border/50"
            >
              <div className="w-14 h-14 rounded-xl bg-gradient-primary flex items-center justify-center mb-6">
                <Target className="w-7 h-7 text-primary-foreground" />
              </div>
              <h2 className="font-display text-2xl lg:text-3xl font-bold text-foreground mb-4">
                {t('ourMission')}
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                {t('missionText')}
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="p-8 lg:p-10 rounded-2xl bg-card border border-border/50"
            >
              <div className="w-14 h-14 rounded-xl bg-gradient-primary flex items-center justify-center mb-6">
                <Eye className="w-7 h-7 text-primary-foreground" />
              </div>
              <h2 className="font-display text-2xl lg:text-3xl font-bold text-foreground mb-4">
                {t('ourVision')}
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                {t('visionText')}
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Spiritual, Educational, and Sports Activities & Psychological Support */}
      <section className="relative py-20 lg:py-28 overflow-hidden">
        {/* Background Image with Backdrop */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: 'url(/maktab/rasm.png)',
          }}
        />
        <div className="absolute inset-0 bg-background/60 backdrop-blur-md" />
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="p-8 lg:p-10 rounded-2xl bg-card border border-border/50"
            >
              <div className="w-14 h-14 rounded-xl bg-gradient-primary flex items-center justify-center mb-6">
                <Activity className="w-7 h-7 text-primary-foreground" />
              </div>
              <h2 className="font-display text-2xl lg:text-3xl font-bold text-foreground mb-4">
                Spiritual, Educational, and Sports Activities
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                Great attention is paid to the physical and moral development of students at the school. Winners of national and international competitions in sports such as karate and Turon martial arts are being trained. In addition, festive events, contests, and military-sports competitions are regularly organized.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="p-8 lg:p-10 rounded-2xl bg-card border border-border/50"
            >
              <div className="w-14 h-14 rounded-xl bg-gradient-primary flex items-center justify-center mb-6">
                <Heart className="w-7 h-7 text-primary-foreground" />
              </div>
              <h2 className="font-display text-2xl lg:text-3xl font-bold text-foreground mb-4">
                Psychological Support
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                Throughout the academic year, the school psychologist conducts more than 45 psychological training sessions aimed at developing students' teamwork, leadership, and social adaptation skills.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Quality of Education and Achievements */}
      <section className="py-20 lg:py-28 bg-muted/50">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto"
          >
            <div className="p-8 lg:p-10 rounded-2xl bg-card border border-border/50">
              <div className="w-14 h-14 rounded-xl bg-gradient-primary flex items-center justify-center mb-6">
                <Award className="w-7 h-7 text-primary-foreground" />
              </div>
              <h2 className="font-display text-2xl lg:text-3xl font-bold text-foreground mb-4">
                Quality of Education and Achievements
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-8">
                Highly qualified teachers holding national and international certifications work at the school. Our students actively and successfully participate in regional, national, and international academic olympiads, competitions, and sports events, consistently achieving prize-winning places.
              </p>
              
              <div className="grid md:grid-cols-3 gap-6">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="p-6 rounded-xl bg-muted/50 border border-border/50"
                >
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                    <Trophy className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="font-semibold text-foreground mb-2">
                    Winners of regional and national olympiads
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    in mathematics and other subjects
                  </p>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.1 }}
                  className="p-6 rounded-xl bg-muted/50 border border-border/50"
                >
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                    <FileText className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="font-semibold text-foreground mb-2">
                    Students holding certificates
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    IELTS, CEFR, and national certificates
                  </p>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 }}
                  className="p-6 rounded-xl bg-muted/50 border border-border/50"
                >
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                    <GraduationCap className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="font-semibold text-foreground mb-2">
                    100% University Admission
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    In the 2024/2025 academic year, 100% of graduates were admitted to higher education institutions
                  </p>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Clubs and Development */}
      <section className="relative py-20 lg:py-28 overflow-hidden">
        {/* Background Image with Backdrop */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: 'url(/maktab/rasm5.png)',
          }}
        />
        <div className="absolute inset-0 bg-background/60 backdrop-blur-md" />
        
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto"
          >
            <div className="p-8 lg:p-10 rounded-2xl bg-card border border-border/50">
              <div className="w-14 h-14 rounded-xl bg-gradient-primary flex items-center justify-center mb-6">
                <Users className="w-7 h-7 text-primary-foreground" />
              </div>
              <h2 className="font-display text-2xl lg:text-3xl font-bold text-foreground mb-4">
                Clubs and Development
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-8">
                At the school, the following clubs operate with the aim of developing students' interests and talents:
              </p>
              
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="p-6 rounded-xl bg-muted/50 border border-border/50"
                >
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                    <Laptop className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="font-semibold text-foreground">
                    Computer Literacy
                  </h3>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.1 }}
                  className="p-6 rounded-xl bg-muted/50 border border-border/50"
                >
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                    <Leaf className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="font-semibold text-foreground">
                    Biology
                  </h3>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 }}
                  className="p-6 rounded-xl bg-muted/50 border border-border/50"
                >
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                    <Brain className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="font-semibold text-foreground">
                    Zakovat (Intellectual Club)
                  </h3>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 }}
                  className="p-6 rounded-xl bg-muted/50 border border-border/50"
                >
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                    <FlaskConical className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="font-semibold text-foreground">
                    Young Chemists
                  </h3>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.4 }}
                  className="p-6 rounded-xl bg-muted/50 border border-border/50"
                >
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                    <Atom className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="font-semibold text-foreground">
                    Young Physicists
                  </h3>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.5 }}
                  className="p-6 rounded-xl bg-muted/50 border border-border/50"
                >
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                    <Calculator className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="font-semibold text-foreground">
                    Mathematicians
                  </h3>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Teacher Qualification Categories */}
      <section className="py-20 lg:py-28">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-6xl mx-auto"
          >
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              {/* Content */}
              <div>
                <div className="w-14 h-14 rounded-xl bg-gradient-primary flex items-center justify-center mb-6">
                  <BarChart3 className="w-7 h-7 text-primary-foreground" />
                </div>
                <h2 className="font-display text-2xl lg:text-3xl font-bold text-foreground mb-6">
                  Teacher Qualification Categories
                </h2>
                <div className="space-y-4 text-muted-foreground leading-relaxed">
                  <p>
                    In the 2024–2025 academic year, an analysis was conducted of the professional qualification categories of teachers working at the Tuproqqal'a District Specialized School. These indicators demonstrate the high level of teachers' qualifications and the quality of education.
                  </p>
                  <p className="font-semibold text-foreground">According to the analysis results:</p>
                  <ul className="space-y-2 list-disc list-inside">
                    <li>1 teacher holds the Specialist category,</li>
                    <li>2 teachers are in the Second category,</li>
                    <li>5 teachers are in the First category,</li>
                    <li>19 teachers hold the Highest category.</li>
                  </ul>
                  <p>
                    These results clearly indicate that the school has a high proportion of experienced and highly qualified teachers. In particular, the large number of teachers with the highest qualification category significantly contributes to improving the effectiveness of the educational process and has a positive impact on students' academic performance and achievements.
                  </p>
                </div>
              </div>

              {/* Chart */}
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="relative"
              >
                <div className="relative z-10">
                  <div className="absolute -inset-4 bg-gradient-primary rounded-3xl opacity-20 blur-2xl" />
                  <div className="relative rounded-2xl shadow-2xl w-full h-auto bg-card border border-border/50 p-4">
                    <ResponsiveContainer width="100%" height={320}>
                      <BarChart
                        data={teacherCategoryData}
                        margin={{ top: 24, right: 24, left: 0, bottom: 40 }}
                      >
                        <CartesianGrid
                          strokeDasharray="3 3"
                          stroke="#4b5563"
                          opacity={0.4}
                        />
                        <XAxis
                          dataKey="label"
                          tick={{ fill: '#e5e7eb', fontSize: 12, fontWeight: 500 }}
                          angle={-30}
                          textAnchor="end"
                          height={60}
                        />
                        <YAxis
                          allowDecimals={false}
                          tick={{ fill: '#e5e7eb', fontSize: 12, fontWeight: 500 }}
                        />
                        <Tooltip
                          cursor={{ fill: '#1f2937', opacity: 0.3 }}
                          contentStyle={{
                            borderRadius: 12,
                            border: '1px solid #4b5563',
                            background: '#020617',
                            color: '#f9fafb',
                            fontSize: 13,
                          }}
                          formatter={(val: number) => [`${val} ta`, 'Soni']}
                        />
                        <Bar
                          dataKey="value"
                          radius={[8, 8, 0, 0]}
                          fill="url(#teacher3DGradient)"
                          stroke="#1d4ed8"
                          strokeWidth={2}
                        >
                          <defs>
                            <linearGradient id="teacher3DGradient" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="0%" stopColor="#93c5fd" />
                              <stop offset="35%" stopColor="#60a5fa" />
                              <stop offset="100%" stopColor="#1d4ed8" />
                            </linearGradient>
                          </defs>
                          <RechartsLabelList
                            dataKey="value"
                            position="top"
                            fill="#f9fafb"
                            fontSize={14}
                            fontWeight={600}
                          />
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Achievements */}
      <section className="py-20 lg:py-28">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-10"
          >
            <h2 className="font-display text-3xl lg:text-4xl font-bold text-foreground">
              {t('ourAchievements')}
            </h2>
          </motion.div>
          <div className="max-w-5xl mx-auto grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
            {achievements.map((item, index) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center p-4 rounded-xl bg-card shadow-sm border border-border/50"
              >
                <item.icon className="w-6 h-6 text-primary mx-auto mb-2" />
                <div className="font-display font-bold text-2xl text-foreground mb-1">
                  {item.value}
                </div>
                <div className="text-xs text-muted-foreground">{item.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Leadership */}
      <section className="py-20 lg:py-28 bg-muted/50">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="font-display text-3xl lg:text-4xl font-bold text-foreground">
              {t('leadershipTitle')}
            </h2>
            <p className="text-muted-foreground mt-3">
              {t('leadershipSubtitle')}
            </p>
          </motion.div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 lg:gap-8 max-w-7xl mx-auto">
            {leadership.map((person, index) => (
              <motion.div
                key={person.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <div className="relative w-32 h-32 mx-auto mb-4 rounded-full overflow-hidden ring-4 ring-primary/20 bg-muted">
                  <img
                    src={person.image}
                    alt={person.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = '/placeholder.svg';
                    }}
                  />
                </div>
                <h3 className="font-display font-semibold text-lg text-foreground">
                  {person.name}
                </h3>
                <div className="mt-3 flex items-center justify-center gap-2">
                  <a
                    href={contactInfo.telegramUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-[#111827] text-muted-foreground hover:text-primary transition-colors"
                    aria-label="Telegram"
                  >
                    <Send className="w-5 h-5" />
                  </a>
                  <a
                    href={contactInfo.githubUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-[#111827] text-muted-foreground hover:text-primary transition-colors"
                    aria-label="GitHub"
                  >
                    <Github className="w-5 h-5" />
                  </a>
                  <a
                    href={`mailto:${contactInfo.email}`}
                    className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-[#111827] text-muted-foreground hover:text-primary transition-colors"
                    aria-label="Email"
                  >
                    <Mail className="w-5 h-5" />
                  </a>
                  <a
                    href={`tel:${contactInfo.phoneHref}`}
                    className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-[#111827] text-muted-foreground hover:text-primary transition-colors"
                    aria-label="Phone"
                  >
                    <PhoneCall className="w-5 h-5" />
                  </a>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default About;
