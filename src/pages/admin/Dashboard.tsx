import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { 
  Newspaper, 
  Calendar, 
  Images, 
  Users, 
  Building2, 
  TrendingUp, 
  History,
  Plus,
  ArrowUpRight,
  ArrowDownRight,
  Activity,
  Clock,
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import AdminLayout from '@/components/admin/AdminLayout';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const Dashboard: React.FC = () => {
  const { role, user } = useAuth();

  const { data: stats, isLoading } = useQuery({
    queryKey: ['admin-stats'],
    queryFn: async () => {
      const [news, events, gallery, teachers, departments, recentNews] = await Promise.all([
        supabase.from('news').select('id', { count: 'exact', head: true }),
        supabase.from('events').select('id', { count: 'exact', head: true }),
        supabase.from('gallery').select('id', { count: 'exact', head: true }),
        supabase.from('teachers').select('id', { count: 'exact', head: true }),
        supabase.from('departments').select('id', { count: 'exact', head: true }),
        supabase.from('news').select('*').order('created_at', { ascending: false }).limit(5),
      ]);

      return {
        news: news.count || 0,
        events: events.count || 0,
        gallery: gallery.count || 0,
        teachers: teachers.count || 0,
        departments: departments.count || 0,
        recentNews: recentNews.data || [],
      };
    },
  });

  const statCards = [
    { 
      label: 'Yangiliklar', 
      value: stats?.news || 0, 
      icon: Newspaper, 
      color: 'text-blue-500',
      bgColor: 'bg-blue-500/10',
      borderColor: 'border-blue-500/20',
      change: '+12%',
      changeType: 'up' as const,
    },
    { 
      label: 'Tadbirlar', 
      value: stats?.events || 0, 
      icon: Calendar, 
      color: 'text-green-500',
      bgColor: 'bg-green-500/10',
      borderColor: 'border-green-500/20',
      change: '+8%',
      changeType: 'up' as const,
    },
    { 
      label: 'Galereya', 
      value: stats?.gallery || 0, 
      icon: Images, 
      color: 'text-purple-500',
      bgColor: 'bg-purple-500/10',
      borderColor: 'border-purple-500/20',
      change: '+5%',
      changeType: 'up' as const,
    },
    { 
      label: 'O\'qituvchilar', 
      value: stats?.teachers || 0, 
      icon: Users, 
      color: 'text-orange-500',
      bgColor: 'bg-orange-500/10',
      borderColor: 'border-orange-500/20',
      change: '+3%',
      changeType: 'up' as const,
    },
    { 
      label: 'Bo\'limlar', 
      value: stats?.departments || 0, 
      icon: Building2, 
      color: 'text-pink-500',
      bgColor: 'bg-pink-500/10',
      borderColor: 'border-pink-500/20',
      change: '0%',
      changeType: 'neutral' as const,
    },
  ];

  const quickActions = [
    { 
      label: 'Yangilik qo\'shish', 
      icon: Newspaper, 
      href: '/admin/news?open=new',
      color: 'text-blue-500',
      bgColor: 'bg-blue-500/10 hover:bg-blue-500/20',
    },
    { 
      label: 'Tadbir qo\'shish', 
      icon: Calendar, 
      href: '/admin/events?open=new',
      color: 'text-green-500',
      bgColor: 'bg-green-500/10 hover:bg-green-500/20',
    },
    { 
      label: 'Rasm qo\'shish', 
      icon: Images, 
      href: '/admin/gallery?open=new',
      color: 'text-purple-500',
      bgColor: 'bg-purple-500/10 hover:bg-purple-500/20',
    },
    { 
      label: 'O\'qituvchi qo\'shish', 
      icon: Users, 
      href: '/admin/teachers?open=new',
      color: 'text-orange-500',
      bgColor: 'bg-orange-500/10 hover:bg-orange-500/20',
    },
    { 
      label: 'Bo\'lim qo\'shish', 
      icon: Building2, 
      href: '/admin/departments?open=new',
      color: 'text-pink-500',
      bgColor: 'bg-pink-500/10 hover:bg-pink-500/20',
    },
  ];

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-display font-bold tracking-tight">Dashboard</h1>
            <p className="text-muted-foreground mt-1">
              Xush kelibsiz, <span className="font-semibold text-foreground">{user?.email || (role === 'super_admin' ? 'Super Admin' : 'Admin')}</span>!
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" asChild>
              <Link to="/">
                <ArrowUpRight className="w-4 h-4 mr-2" />
                Saytga qaytish
              </Link>
            </Button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
          {statCards.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className={`hover:shadow-lg transition-all duration-300 border-2 ${stat.borderColor} hover:scale-105`}>
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                      <Icon className={`w-5 h-5 ${stat.color}`} />
                    </div>
                    {stat.changeType === 'up' && (
                      <div className="flex items-center gap-1 text-xs text-green-500 font-medium">
                        <ArrowUpRight className="w-3 h-3" />
                        {stat.change}
                      </div>
                    )}
                    {stat.changeType === 'down' && (
                      <div className="flex items-center gap-1 text-xs text-red-500 font-medium">
                        <ArrowDownRight className="w-3 h-3" />
                        {stat.change}
                      </div>
                    )}
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold mb-1">{stat.value}</div>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>

        {/* Quick Actions & Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Quick Actions */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="w-5 h-5" />
                Tezkor amallar
              </CardTitle>
              <CardDescription>
                Ma'lumotlarni tez qo'shish uchun quyidagi tugmalardan foydalaning
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {quickActions.map((action, index) => {
                  const Icon = action.icon;
                  return (
                    <motion.div
                      key={action.label}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <Link
                        to={action.href}
                        className={`flex flex-col items-center gap-3 p-4 rounded-lg ${action.bgColor} border border-border transition-all duration-200 hover:shadow-md group`}
                      >
                        <div className={`p-3 rounded-lg ${action.bgColor} group-hover:scale-110 transition-transform`}>
                          <Icon className={`w-6 h-6 ${action.color}`} />
                        </div>
                        <span className="text-sm font-medium text-center">{action.label}</span>
                        <Plus className={`w-4 h-4 ${action.color} opacity-0 group-hover:opacity-100 transition-opacity`} />
                      </Link>
                    </motion.div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="w-5 h-5" />
                So'nggi yangiliklar
              </CardTitle>
              <CardDescription>
                Eng so'nggi qo'shilgan yangiliklar
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {stats?.recentNews && stats.recentNews.length > 0 ? (
                  stats.recentNews.slice(0, 5).map((item: any) => (
                    <Link
                      key={item.id}
                      to="/admin/news"
                      className="block p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors group"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium line-clamp-2 group-hover:text-primary transition-colors">
                            {item.title_uz || item.title_en || item.title_ru}
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">
                            {new Date(item.created_at).toLocaleDateString('uz-UZ')}
                          </p>
                        </div>
                        {item.published ? (
                          <div className="w-2 h-2 rounded-full bg-green-500" />
                        ) : (
                          <div className="w-2 h-2 rounded-full bg-muted-foreground" />
                        )}
                      </div>
                    </Link>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    Hozircha yangiliklar yo'q
                  </p>
                )}
              </div>
              <Button variant="outline" className="w-full mt-4" asChild>
                <Link to="/admin/news">
                  Barcha yangiliklar
                  <ArrowUpRight className="w-4 h-4 ml-2" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Super Admin Only: Audit Log */}
        {role === 'super_admin' && (
          <Card className="border-2 border-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <History className="w-5 h-5 text-primary" />
                Super Admin Panel
              </CardTitle>
              <CardDescription>
                Tizim o'zgartirishlarini kuzatish
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link
                to="/admin/audit-logs"
                className="flex items-center gap-4 p-4 rounded-lg bg-primary/5 hover:bg-primary/10 border border-primary/20 transition-all duration-200 group"
              >
                <div className="p-3 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
                  <History className="w-6 h-6 text-primary" />
                </div>
                <div className="flex-1">
                  <div className="font-semibold">Audit Log</div>
                  <div className="text-sm text-muted-foreground">
                    Saytga kiritilgan barcha o'zgartirishlar tarixi
                  </div>
                </div>
                <ArrowUpRight className="w-5 h-5 text-primary group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
              </Link>
            </CardContent>
          </Card>
        )}
      </div>
    </AdminLayout>
  );
};

export default Dashboard;
