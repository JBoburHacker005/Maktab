import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  LayoutDashboard,
  Newspaper,
  Calendar,
  Images,
  Users,
  Building2,
  LogOut,
  Menu,
  X,
  ChevronRight,
  History,
  Bot,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { cn } from '@/lib/utils';

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const { user, role, signOut } = useAuth();
  const { language, setLanguage } = useLanguage();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    // Admin panel har doim dark mode’da
    document.documentElement.classList.add('dark');
    localStorage.setItem('theme', 'dark');
  }, []);

  const handleSignOut = async () => {
    await signOut();
    navigate('/auth');
  };

  const navItems = [
    { href: '/admin', icon: LayoutDashboard, label: 'Dashboard' },
    { href: '/admin/news', icon: Newspaper, label: 'Yangiliklar' },
    { href: '/admin/events', icon: Calendar, label: 'Tadbirlar' },
    { href: '/admin/gallery', icon: Images, label: 'Galereya' },
    { href: '/admin/teachers', icon: Users, label: "O'qituvchilar" },
    { href: '/admin/departments', icon: Building2, label: "Bo'limlar" },
    // Har qanday admin (admin yoki super_admin) Telegram Adminlar’ni ko‘radi
    ...(role
      ? [
          { href: '/admin/telegram-admins', icon: Bot, label: 'Telegram Adminlar' },
          ...(role === 'super_admin'
            ? [{ href: '/admin/audit-logs', icon: History, label: 'Audit Log' }]
            : []),
        ]
      : []),
  ];

  const languages = [
    { code: 'en', label: 'EN' },
    { code: 'uz', label: 'UZ' },
    { code: 'ru', label: 'RU' },
  ] as const;

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile Header */}
      <header className="lg:hidden fixed top-0 left-0 right-0 z-50 h-16 bg-card border-b border-border flex items-center justify-between px-4">
        <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(true)}>
          <Menu className="w-5 h-5" />
        </Button>
        <span className="font-display font-bold text-lg">Admin Panel</span>
      </header>

      {/* Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 z-40 bg-foreground/50"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed top-0 left-0 z-50 h-full w-64 bg-card border-r border-border transition-transform duration-300 lg:translate-x-0',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full',
        )}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="h-16 flex items-center justify-between px-4 border-b border-border">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-gradient-primary flex items-center justify-center overflow-hidden">
                <img src="/favicon.ico.png" alt="Logo" className="w-6 h-6 object-contain" />
              </div>
              <span className="font-display font-bold text-sm">Admin Panel</span>
            </Link>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto p-4 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.href}
                  to={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={cn(
                    'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200',
                    isActive
                      ? 'bg-primary text-primary-foreground shadow-md'
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted',
                  )}
                >
                  <Icon className="w-4 h-4" />
                  {item.label}
                  {isActive && <ChevronRight className="w-4 h-4 ml-auto" />}
                </Link>
              );
            })}
          </nav>

          {/* User Info & Actions */}
          <div className="p-4 border-t border-border space-y-3">
            {/* Language Selector */}
            <div className="flex items-center gap-1 bg-muted rounded-lg p-1">
              {languages.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => setLanguage(lang.code)}
                  className={cn(
                    'flex-1 px-2 py-1 text-xs font-medium rounded-md transition-all duration-200',
                    language === lang.code
                      ? 'bg-background text-foreground shadow-sm'
                      : 'text-muted-foreground hover:text-foreground',
                  )}
                >
                  {lang.label}
                </button>
              ))}
            </div>

            {/* User & Sign Out */}
            <div className="flex items-center gap-2 p-2 bg-muted rounded-lg">
              <div className="flex-1 min-w-0">
                <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
                <p className="text-xs font-medium text-primary capitalize">{role || 'user'}</p>
              </div>
              <Button variant="ghost" size="icon" onClick={handleSignOut}>
                <LogOut className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="lg:ml-64 min-h-screen pt-16 lg:pt-0">
        <motion.div
          key={location.pathname}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
          className="p-4 lg:p-6"
        >
          {children}
        </motion.div>
      </main>
    </div>
  );
};

export default AdminLayout;