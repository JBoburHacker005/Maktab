import React from 'react';
import { motion } from 'framer-motion';
import { Calculator, Atom, Languages, Palette, Dumbbell, Monitor, Music, FlaskConical } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import { useLanguage } from '@/contexts/LanguageContext';

const Departments: React.FC = () => {
  const { t } = useLanguage();

  const departments = [
    {
      icon: Calculator,
      name: t('mathematics'),
      description: 'Advanced mathematics curriculum covering algebra, calculus, statistics, and applied mathematics.',
      subjects: ['Algebra', 'Calculus', 'Statistics', 'Geometry'],
    },
    {
      icon: Atom,
      name: t('science'),
      description: 'Comprehensive science programs with hands-on laboratory experiences and research opportunities.',
      subjects: ['Physics', 'Chemistry', 'Biology', 'Environmental Science'],
    },
    {
      icon: Languages,
      name: t('languages'),
      description: 'Multilingual education fostering communication skills in English, Uzbek, Russian, and more.',
      subjects: ['English', 'Uzbek', 'Russian', 'French'],
    },
    {
      icon: Palette,
      name: t('arts'),
      description: 'Creative arts programs nurturing artistic expression through various mediums and techniques.',
      subjects: ['Visual Arts', 'Digital Design', 'Photography', 'Sculpture'],
    },
    {
      icon: Dumbbell,
      name: t('sports'),
      description: 'Comprehensive physical education promoting fitness, teamwork, and sportsmanship.',
      subjects: ['Football', 'Basketball', 'Swimming', 'Athletics'],
    },
    {
      icon: Monitor,
      name: t('technology'),
      description: 'Cutting-edge technology education preparing students for the digital future.',
      subjects: ['Programming', 'Robotics', 'AI Basics', 'Web Development'],
    },
    {
      icon: Music,
      name: t('music'),
      description: 'Musical education developing rhythm, harmony, and performance skills across instruments.',
      subjects: ['Piano', 'Guitar', 'Orchestra', 'Music Theory'],
    },
    {
      icon: FlaskConical,
      name: t('researchLab'),
      description: 'Advanced research opportunities for students interested in scientific exploration.',
      subjects: ['Research Methods', 'Data Analysis', 'Lab Techniques', 'Project Work'],
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
              {t('departments')}
            </span>
            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground mt-3 mb-6">
              {t('academicExcellence')}
            </h1>
            <p className="text-lg text-muted-foreground">
              {t('academicExcellenceDesc')}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Departments Grid */}
      <section className="py-20 lg:py-28">
        <div className="container mx-auto px-4">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {departments.map((dept, index) => (
              <motion.div
                key={dept.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                className="group p-6 rounded-2xl bg-card border border-border/50 hover:border-primary/30 hover:shadow-xl transition-all duration-300"
              >
                <div className="w-12 h-12 rounded-xl bg-gradient-primary flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <dept.icon className="w-6 h-6 text-primary-foreground" />
                </div>
                <h3 className="font-display font-semibold text-xl text-foreground mb-2 group-hover:text-primary transition-colors">
                  {dept.name}
                </h3>
                <p className="text-muted-foreground text-sm mb-4 leading-relaxed">
                  {dept.description}
                </p>
                <div className="flex flex-wrap gap-2">
                  {dept.subjects.map((subject) => (
                    <span
                      key={subject}
                      className="px-2 py-1 text-xs rounded-md bg-muted text-muted-foreground"
                    >
                      {subject}
                    </span>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Departments;
