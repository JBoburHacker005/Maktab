import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Newspaper, Calendar, Images, Users, Building2, TrendingUp, History } from 'lucide-react';
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
    { label: 'Yangiliklar', value: stats?.news || 0, icon: Newspaper, color: 'text-blue-500' },
    { label: 'Tadbirlar', value: stats?.events || 0, icon: Calendar, color: 'text-green-500' },
    { label: 'Galereya', value: stats?.gallery || 0, icon: Images, color: 'text-purple-500' },
    { label: 'O\'qituvchilar', value: stats?.teachers || 0, icon: Users, color: 'text-orange-500' },
    { label: 'Bo\'limlar', value: stats?.departments || 0, icon: Building2, color: 'text-pink-500' },
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
          {statCards.map((stat) => {
            const Icon = stat.icon;
            return (
              <Card key={stat.label} className="hover:shadow-lg transition-shadow">
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
            );
          })}
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Tezkor amallar</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
              <a
                href="/admin/news"
                className="flex flex-col items-center gap-2 p-4 rounded-lg bg-muted hover:bg-muted/80 transition-colors"
              >
                <Newspaper className="w-6 h-6 text-blue-500" />
                <span className="text-sm font-medium">Yangilik qo'shish</span>
              </a>
              <a
                href="/admin/events"
                className="flex flex-col items-center gap-2 p-4 rounded-lg bg-muted hover:bg-muted/80 transition-colors"
              >
                <Calendar className="w-6 h-6 text-green-500" />
                <span className="text-sm font-medium">Tadbir qo'shish</span>
              </a>
              <a
                href="/admin/gallery"
                className="flex flex-col items-center gap-2 p-4 rounded-lg bg-muted hover:bg-muted/80 transition-colors"
              >
                <Images className="w-6 h-6 text-purple-500" />
                <span className="text-sm font-medium">Rasm qo'shish</span>
              </a>
              <a
                href="/admin/teachers"
                className="flex flex-col items-center gap-2 p-4 rounded-lg bg-muted hover:bg-muted/80 transition-colors"
              >
                <Users className="w-6 h-6 text-orange-500" />
                <span className="text-sm font-medium">O'qituvchi qo'shish</span>
              </a>
              <a
                href="/admin/departments"
                className="flex flex-col items-center gap-2 p-4 rounded-lg bg-muted hover:bg-muted/80 transition-colors"
              >
                <Building2 className="w-6 h-6 text-pink-500" />
                <span className="text-sm font-medium">Bo'lim qo'shish</span>
              </a>
            </div>
          </CardContent>
        </Card>

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
