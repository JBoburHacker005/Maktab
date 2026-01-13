import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Newspaper, Calendar, Images, Users, Building2, TrendingUp, History, Loader2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import AdminLayout from '@/components/admin/AdminLayout';
import { Link } from 'react-router-dom';

const Dashboard: React.FC = () => {
  const { role } = useAuth();

  const { data: stats } = useQuery({
    queryKey: ['admin-stats'],
    queryFn: async () => {
      const [news, events, gallery, teachers, departments] = await Promise.all([
        supabase.from('news').select('id', { count: 'exact', head: true }),
        supabase.from('events').select('id', { count: 'exact', head: true }),
        supabase.from('gallery').select('id', { count: 'exact', head: true }),
        supabase.from('teachers').select('id', { count: 'exact', head: true }),
        supabase.from('departments').select('id', { count: 'exact', head: true }),
      ]);

      return {
        news: news.count || 0,
        events: events.count || 0,
        gallery: gallery.count || 0,
        teachers: teachers.count || 0,
        departments: departments.count || 0,
      };
    },
  });

  const statCards = [
    { label: 'Yangiliklar', value: stats?.news ?? 0, icon: Newspaper, color: 'text-blue-500', link: '/admin/news' },
    { label: 'Tadbirlar', value: stats?.events ?? 0, icon: Calendar, color: 'text-green-500', link: '/admin/events' },
    { label: 'Galereya', value: stats?.gallery ?? 0, icon: Images, color: 'text-purple-500', link: '/admin/gallery' },
    { label: 'O\'qituvchilar', value: stats?.teachers ?? 0, icon: Users, color: 'text-orange-500', link: '/admin/teachers' },
    { label: 'Bo\'limlar', value: stats?.departments ?? 0, icon: Building2, color: 'text-pink-500', link: '/admin/departments' },
  ];

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-display font-bold">Dashboard</h1>
          <p className="text-muted-foreground">
            Xush kelibsiz, {role === 'super_admin' ? 'Super Admin' : 'Admin'}!
          </p>
        </div>

        {/* Stats Grid */}
        {!stats ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : (
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
                  <Link to={stat.link}>
                    <Card className="hover:shadow-lg transition-all hover:scale-105 cursor-pointer">
                      <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">
                          {stat.label}
                        </CardTitle>
                        <Icon className={`w-4 h-4 ${stat.color}`} />
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">{stat.value}</div>
                        <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                          <TrendingUp className="w-3 h-3 text-green-500" />
                          Jami
                        </p>
                      </CardContent>
                    </Card>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        )}

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Tezkor amallar</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
                {[
                  { to: '/admin/news?open=new', icon: Newspaper, color: 'text-blue-500', label: 'Yangilik qo\'shish' },
                  { to: '/admin/events?open=new', icon: Calendar, color: 'text-green-500', label: 'Tadbir qo\'shish' },
                  { to: '/admin/gallery?open=new', icon: Images, color: 'text-purple-500', label: 'Rasm qo\'shish' },
                  { to: '/admin/teachers?open=new', icon: Users, color: 'text-orange-500', label: 'O\'qituvchi qo\'shish' },
                  { to: '/admin/departments?open=new', icon: Building2, color: 'text-pink-500', label: 'Bo\'lim qo\'shish' },
                ].map((action, index) => {
                  const Icon = action.icon;
                  return (
                    <motion.div
                      key={action.to}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.4 + index * 0.1 }}
                    >
                      <Link
                        to={action.to}
                        className="flex flex-col items-center gap-2 p-4 rounded-lg bg-muted hover:bg-muted/80 transition-all hover:scale-105"
                      >
                        <Icon className={`w-6 h-6 ${action.color}`} />
                        <span className="text-sm font-medium">{action.label}</span>
                      </Link>
                    </motion.div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Super Admin Only: Audit Log */}
        {role === 'super_admin' && (
          <Card>
            <CardHeader>
              <CardTitle>Super Admin</CardTitle>
            </CardHeader>
            <CardContent>
              <Link
                to="/admin/audit-logs"
                className="flex items-center gap-3 p-4 rounded-lg bg-muted hover:bg-muted/80 transition-colors"
              >
                <History className="w-6 h-6 text-primary" />
                <div>
                  <div className="font-medium">Audit Log</div>
                  <div className="text-sm text-muted-foreground">
                    Saytga kiritilgan barcha o'zgartirishlar tarixi
                  </div>
                </div>
              </Link>
            </CardContent>
          </Card>
        )}
      </div>
    </AdminLayout>
  );
};

export default Dashboard;
