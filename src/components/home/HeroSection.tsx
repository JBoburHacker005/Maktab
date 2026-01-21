import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Users, Award, BookOpen, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';

// Floating particle component
const FloatingParticle: React.FC<{
  size: number;
  top: string;
  left: string;
  delay: number;
  duration: number;
  color?: string;
  blur?: boolean;
}> = ({ size, top, left, delay, duration, color = 'primary', blur = false }) => (
  <motion.div
    className={`absolute rounded-full ${blur ? 'blur-sm' : ''}`}
    style={{
      width: size,
      height: size,
      top,
      left,
      background: color === 'primary'
        ? 'linear-gradient(135deg, rgba(59, 130, 246, 0.6), rgba(139, 92, 246, 0.4))'
        : color === 'accent'
          ? 'linear-gradient(135deg, rgba(14, 165, 233, 0.5), rgba(6, 182, 212, 0.3))'
          : color === 'white'
            ? 'rgba(255, 255, 255, 0.8)'
            : color,
      boxShadow: color === 'white' ? '0 0 10px rgba(255,255,255,0.5)' : 'none',
    }}
    animate={{
      y: [0, -30, 0],
      x: [0, 10, -10, 0],
      scale: [1, 1.1, 0.9, 1],
      opacity: [0.4, 0.8, 0.4],
    }}
    transition={{
      duration,
      delay,
      repeat: Infinity,
      ease: 'easeInOut',
    }}
  />
);

// Star component
const Star: React.FC<{ top: string; left: string; delay: number; size?: number }> = ({
  top,
  left,
  delay,
  size = 3,
}) => (
  <motion.div
    className="absolute"
    style={{
      width: size,
      height: size,
      top,
      left,
      background: 'white',
      borderRadius: '50%',
      boxShadow: '0 0 6px rgba(255,255,255,0.8), 0 0 12px rgba(59,130,246,0.5)',
    }}
    animate={{
      opacity: [0.2, 1, 0.2],
      scale: [0.8, 1.2, 0.8],
    }}
    transition={{
      duration: 2 + Math.random() * 2,
      delay,
      repeat: Infinity,
      ease: 'easeInOut',
    }}
  />
);

// Orbit ring component
const OrbitRing: React.FC<{
  size: number;
  top: string;
  left: string;
  duration: number;
  reverse?: boolean;
}> = ({ size, top, left, duration, reverse = false }) => (
  <motion.div
    className="absolute border border-primary/10 rounded-full"
    style={{
      width: size,
      height: size,
      top,
      left,
    }}
    animate={{ rotate: reverse ? -360 : 360 }}
    transition={{
      duration,
      repeat: Infinity,
      ease: 'linear',
    }}
  >
    <div
      className="absolute w-2 h-2 bg-primary/60 rounded-full shadow-lg"
      style={{
        top: '0%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        boxShadow: '0 0 8px rgba(59,130,246,0.8)',
      }}
    />
  </motion.div>
);

const HeroSection: React.FC = () => {
  const { t } = useLanguage();

  const stats = [
    { icon: Users, value: '295+', label: t('students') },
    { icon: BookOpen, value: '29+', label: t('teachersCount') },
    { icon: Calendar, value: '4+', label: t('yearsExp') },
    { icon: Award, value: '50+', label: t('awards') },
  ];

  // Generate random stars
  const stars = Array.from({ length: 30 }, (_, i) => ({
    id: i,
    top: `${Math.random() * 100}%`,
    left: `${Math.random() * 100}%`,
    delay: Math.random() * 3,
    size: Math.random() * 2 + 1,
  }));

  return (
    <section className="relative min-h-[90vh] flex items-center bg-gradient-hero overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: 'radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)',
          backgroundSize: '40px 40px'
        }} />
      </div>

      {/* ===== FAZOVIY ELEMENTLAR ===== */}

      {/* Stars - Yulduzlar */}
      {stars.map((star) => (
        <Star key={star.id} top={star.top} left={star.left} delay={star.delay} size={star.size} />
      ))}

      {/* Large Floating Orbs - Katta suzuvchi sharlar */}
      <motion.div
        animate={{
          y: [0, -40, 0],
          x: [0, 20, 0],
        }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute top-[10%] right-[15%] w-80 h-80 rounded-full blur-3xl"
        style={{
          background: 'radial-gradient(circle, rgba(59,130,246,0.15) 0%, rgba(139,92,246,0.1) 50%, transparent 70%)',
        }}
      />
      <motion.div
        animate={{
          y: [0, 30, 0],
          x: [0, -15, 0],
        }}
        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute bottom-[15%] left-[10%] w-96 h-96 rounded-full blur-3xl"
        style={{
          background: 'radial-gradient(circle, rgba(14,165,233,0.12) 0%, rgba(6,182,212,0.08) 50%, transparent 70%)',
        }}
      />
      <motion.div
        animate={{
          y: [0, -25, 0],
          scale: [1, 1.1, 1],
        }}
        transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute top-[40%] left-[5%] w-48 h-48 rounded-full blur-2xl"
        style={{
          background: 'radial-gradient(circle, rgba(168,85,247,0.1) 0%, transparent 70%)',
        }}
      />

      {/* Floating Particles - Parvozchi zarrachalar */}
      <FloatingParticle size={12} top="15%" left="20%" delay={0} duration={6} color="primary" />
      <FloatingParticle size={8} top="25%" left="80%" delay={1} duration={7} color="accent" />
      <FloatingParticle size={15} top="60%" left="15%" delay={2} duration={8} color="primary" blur />
      <FloatingParticle size={6} top="70%" left="75%" delay={0.5} duration={5} color="white" />
      <FloatingParticle size={10} top="45%" left="90%" delay={1.5} duration={9} color="accent" blur />
      <FloatingParticle size={4} top="80%" left="40%" delay={2.5} duration={6} color="white" />
      <FloatingParticle size={14} top="20%" left="60%" delay={0.8} duration={7} color="primary" blur />
      <FloatingParticle size={5} top="85%" left="85%" delay={1.2} duration={5} color="white" />

      {/* Orbit Rings - Aylanuvchi halqalar */}
      <OrbitRing size={300} top="5%" left="70%" duration={25} />
      <OrbitRing size={200} top="50%" left="-5%" duration={20} reverse />
      <OrbitRing size={150} top="70%" left="75%" duration={18} />

      {/* Meteor trails - Meteor izlari */}
      <motion.div
        className="absolute w-32 h-0.5 bg-gradient-to-r from-transparent via-white to-transparent opacity-60"
        style={{ top: '20%', left: '60%', transform: 'rotate(-45deg)' }}
        animate={{
          x: [-100, 200],
          y: [-50, 100],
          opacity: [0, 0.8, 0],
        }}
        transition={{
          duration: 2,
          delay: 3,
          repeat: Infinity,
          repeatDelay: 8,
          ease: 'easeOut',
        }}
      />
      <motion.div
        className="absolute w-24 h-0.5 bg-gradient-to-r from-transparent via-primary to-transparent opacity-50"
        style={{ top: '40%', left: '30%', transform: 'rotate(-35deg)' }}
        animate={{
          x: [-80, 180],
          y: [-40, 90],
          opacity: [0, 0.6, 0],
        }}
        transition={{
          duration: 1.5,
          delay: 6,
          repeat: Infinity,
          repeatDelay: 10,
          ease: 'easeOut',
        }}
      />

      {/* Glowing lines - Yorug' chiziqlar */}
      <motion.div
        className="absolute w-px h-40 bg-gradient-to-b from-transparent via-primary/30 to-transparent"
        style={{ top: '30%', left: '10%' }}
        animate={{ opacity: [0.2, 0.6, 0.2], scaleY: [0.8, 1, 0.8] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute w-px h-32 bg-gradient-to-b from-transparent via-accent/30 to-transparent"
        style={{ top: '50%', right: '8%' }}
        animate={{ opacity: [0.3, 0.7, 0.3], scaleY: [0.9, 1.1, 0.9] }}
        transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
      />

      {/* ===== ASOSIY KONTENT ===== */}
      <div className="container mx-auto px-4 py-12 lg:py-20 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-6 text-center lg:text-left"
          >
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground leading-tight"
            >
              {t('heroTitle').split(' ').map((word, i) => (
                <span key={i}>
                  {i === 1 ? <span className="text-gradient">{word} </span> : `${word} `}
                </span>
              ))}
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-lg text-muted-foreground max-w-xl mx-auto lg:mx-0"
            >
              {t('heroDescription')}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
            >
              <Button variant="hero" size="lg" asChild>
                <Link to="/contact">
                  {t('applyNow')}
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </Button>
              <Button variant="heroOutline" size="lg" asChild>
                <Link to="/about">{t('learnMore')}</Link>
              </Button>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-8"
            >
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.7 + index * 0.1 }}
                  className="text-center p-4 rounded-xl bg-card/80 backdrop-blur-sm shadow-sm border border-border/50"
                >
                  <stat.icon className="w-5 h-5 text-primary mx-auto mb-2" />
                  <div className="font-display font-bold text-2xl text-foreground">{stat.value}</div>
                  <div className="text-xs text-muted-foreground">{stat.label}</div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

          {/* Image */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="relative"
          >
            <div className="relative z-10">
              <div className="absolute -inset-4 bg-gradient-primary rounded-3xl opacity-20 blur-2xl" />
              <img
                src="/biz.png"
                alt="Tuproqqal'a tuman Ixtisoslashtirilgan maktabi emblem"
                className="relative rounded-3xl shadow-2xl w-full h-auto object-cover bg-white/10 p-6"
              />
            </div>
            {/* Decorative Elements */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
              className="absolute -top-8 -right-8 w-24 h-24 border-4 border-primary/20 rounded-full"
            />
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute -bottom-4 -left-4 w-16 h-16 bg-accent/20 rounded-xl"
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
