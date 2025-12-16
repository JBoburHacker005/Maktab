import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Instagram, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';

const Footer: React.FC = () => {
  const { t } = useLanguage();
  const currentYear = new Date().getFullYear();

  const quickLinks = [
    { href: '/about', label: t('about') },
    { href: '/departments', label: t('departments') },
    { href: '/teachers', label: t('teachers') },
    { href: '/news', label: t('news') },
    { href: '/events', label: t('events') },
    { href: '/gallery', label: t('gallery') },
  ];

  const socialLinks = [
    { icon: Send, href: 'https://t.me/T2022PIMA', label: 'Telegram' },
    { icon: Instagram, href: 'https://www.instagram.com/tuproqqala_tuman_im_?igsh=MWtpNGRqdGxzajhhYg==', label: 'Instagram' },
    { icon: Mail, href: 'mailto:imx321@piima.uz', label: 'Email' },
    { icon: Phone, href: 'tel:+998993389111', label: 'Telefon' },
  ];

  return (
    <footer className="bg-card text-foreground border-t border-border">
      <div className="container mx-auto px-4 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-gradient-primary flex items-center justify-center overflow-hidden">
                <img src="/favicon.ico.png" alt="Tuproqqal'a tuman Ixtisoslashtirilgan maktabi logo" className="w-8 h-8 object-contain" />
              </div>
              <span className="font-display font-bold text-lg">Tuproqqal'a tuman Ixtisoslashtirilgan maktabi</span>
            </Link>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Empowering minds, shaping futures. We provide world-class education with a focus on innovation and excellence.
            </p>
            <div className="flex items-center gap-2">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  className="w-9 h-9 rounded-lg bg-muted flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors"
                >
                  <social.icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-display font-semibold text-lg mb-4">{t('quickLinks')}</h4>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    to={link.href}
                    className="text-muted-foreground hover:text-primary transition-colors text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="font-display font-semibold text-lg mb-4">{t('contactInfo')}</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 mt-[2px] text-accent" />
                <span className="text-muted-foreground text-sm">
                  Tuproqqal'a tuman, Sharlauq MFY, Vatanparvar ko'chasi 14-uy
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-accent" />
                <span className="text-muted-foreground text-sm">+998 (99) 338-91-11</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-accent" />
                <span className="text-muted-foreground text-sm">imx321@piima.uz</span>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="font-display font-semibold text-lg mb-4">{t('newsletter')}</h4>
            <p className="text-muted-foreground text-sm mb-4">
              Subscribe to our newsletter for updates and news.
            </p>
            <div className="flex gap-2">
              <input
                type="email"
                placeholder={t('yourEmail')}
                className="flex-1 h-10 px-3 rounded-lg bg-muted border border-border text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <Button variant="accent" size="default" className="shrink-0">
                {t('subscribe')}
              </Button>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-border flex flex-col items-center gap-4 text-center">
          <p className="text-muted-foreground text-sm">
            © {currentYear} Tuproqqal'a tuman Ixtisoslashtirilgan maktabi. {t('allRightsReserved')}.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 text-sm text-muted-foreground">
            <a href="#" className="hover:text-primary transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-primary transition-colors">Terms of Service</a>
            <div className="flex items-center gap-2">
              <span className="text-foreground font-medium">Creator:</span>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full overflow-hidden border border-border">
                  <img
                    src="/teachers/Bobur.jpg"
                    alt="Jovliyev Bobur"
                    className="w-full h-full object-cover"
                  />
                </div>
                <span className="text-foreground font-semibold">Jovliyev Bobur</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
