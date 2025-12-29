import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Search, Sun, Moon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { cn } from '@/lib/utils';
const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isDark, setIsDark] = useState(() => {
    const saved = localStorage.getItem('theme');
    if (saved) return saved === 'dark';
    return document.documentElement.classList.contains('dark');
  });
  const [searchOpen, setSearchOpen] = useState(false);
  const {
    language,
    setLanguage,
    t
  } = useLanguage();
  const location = useLocation();
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDark]);
  const navLinks = [{
    href: '/',
    label: t('home')
  }, {
    href: '/about',
    label: t('about')
  }, {
    href: '/departments',
    label: t('departments')
  }, {
    href: '/news',
    label: t('news')
  }, {
    href: '/events',
    label: t('events')
  }, {
    href: '/gallery',
    label: t('gallery')
  }, {
    href: '/teachers',
    label: t('teachers')
  }, {
    href: '/contact',
    label: t('contact')
  }];
  const languages = [{
    code: 'en',
    label: 'EN'
  }, {
    code: 'uz',
    label: 'UZ'
  }, {
    code: 'ru',
    label: 'RU'
  }] as const;
  return <header className={cn('fixed top-0 left-0 right-0 z-50 transition-all duration-300', isScrolled ? 'bg-card/95 backdrop-blur-md shadow-md' : 'bg-transparent')}>
      <nav className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 rounded-full bg-gradient-primary flex items-center justify-center shadow-md group-hover:shadow-lg transition-shadow overflow-hidden">
              <img src="/favicon.ico.png" alt="School logo" className="w-8 h-8 object-contain" />
            </div>
            <span className="font-display font-bold text-lg text-foreground hidden lg:block">Tuproqqal'a tuman Ixtisoslashtirilgan maktabi</span>
          </Link>

          {/* Mobile School Name */}
          <span className="font-display font-bold text-sm text-foreground flex-1 text-center lg:hidden px-2">Tuproqqal'a tuman Ixtisoslashtirilgan maktabi</span>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map(link => <Link key={link.href} to={link.href} className={cn('px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200', location.pathname === link.href ? 'text-primary bg-primary/10' : 'text-muted-foreground hover:text-foreground hover:bg-muted')}>
                {link.label}
              </Link>)}
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-2">
            {/* Search */}
            <AnimatePresence>
              {searchOpen && <motion.input initial={{
              width: 0,
              opacity: 0
            }} animate={{
              width: 200,
              opacity: 1
            }} exit={{
              width: 0,
              opacity: 0
            }} type="text" placeholder={t('search')} className="h-9 px-3 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring" />}
            </AnimatePresence>
            <Button variant="ghost" size="icon" onClick={() => setSearchOpen(!searchOpen)} className="hidden sm:flex">
              <Search className="w-4 h-4" />
            </Button>

            {/* Language Selector */}
            <div className="hidden sm:flex items-center gap-1 bg-muted rounded-lg p-1">
              {languages.map(lang => <button key={lang.code} onClick={() => setLanguage(lang.code)} className={cn('px-2 py-1 text-xs font-medium rounded-md transition-all duration-200', language === lang.code ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground')}>
                  {lang.label}
                </button>)}
            </div>

            {/* Dark Mode Toggle */}
            <Button variant="ghost" size="icon" onClick={() => setIsDark(!isDark)} className="hidden sm:flex">
              {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </Button>

            {/* Mobile Menu Button */}
            <Button variant="ghost" size="icon" onClick={() => setIsOpen(!isOpen)} className="lg:hidden">
              {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isOpen && <motion.div initial={{
          opacity: 0,
          height: 0
        }} animate={{
          opacity: 1,
          height: 'auto'
        }} exit={{
          opacity: 0,
          height: 0
        }} className="lg:hidden overflow-hidden bg-card rounded-b-xl">
              <div className="py-4 space-y-1">
                {navLinks.map(link => <Link key={link.href} to={link.href} onClick={() => setIsOpen(false)} className={cn('block px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200', location.pathname === link.href ? 'text-primary bg-primary/10' : 'text-muted-foreground hover:text-foreground hover:bg-muted')}>
                    {link.label}
                  </Link>)}
                
                {/* Mobile Language & Theme */}
                <div className="flex items-center justify-between px-4 pt-4 border-t border-border mt-4">
                  <div className="flex items-center gap-1 bg-muted rounded-lg p-1">
                    {languages.map(lang => <button key={lang.code} onClick={() => setLanguage(lang.code)} className={cn('px-2 py-1 text-xs font-medium rounded-md transition-all duration-200', language === lang.code ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground')}>
                        {lang.label}
                      </button>)}
                  </div>
                  <Button variant="ghost" size="icon" onClick={() => setIsDark(!isDark)}>
                    {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                  </Button>
                </div>
              </div>
            </motion.div>}
        </AnimatePresence>
      </nav>
    </header>;
};
export default Navbar;