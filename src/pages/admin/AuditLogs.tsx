import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { History, Filter, Search, Calendar, User, FileText, Trash2, Plus, Edit } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import AdminLayout from '@/components/admin/AdminLayout';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';

interface AuditLog {
  id: string;
  user_id: string | null;
  user_email: string | null;
  action: 'create' | 'update' | 'delete';
  table_name: string;
  record_id: string;
  old_data: any;
  new_data: any;
  changes: any;
  created_at: string;
}

const AuditLogs: React.FC = () => {
  const { role } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [tableFilter, setTableFilter] = useState<string>('all');
  const [actionFilter, setActionFilter] = useState<string>('all');

  // Only super admins can access
  if (role !== 'super_admin') {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <h2 className="text-xl font-display font-bold mb-2">Ruxsat yo'q</h2>
            <p className="text-muted-foreground">
              Faqat super admin audit loglarni ko'ra oladi.
            </p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  const { data: logs, isLoading } = useQuery({
    queryKey: ['audit-logs', tableFilter, actionFilter, searchTerm],
    queryFn: async () => {
      let query = supabase
        .from('audit_logs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(100);

      if (tableFilter !== 'all') {
        query = query.eq('table_name', tableFilter);
      }

      if (actionFilter !== 'all') {
        query = query.eq('action', actionFilter);
      }

      if (searchTerm) {
        query = query.or(`user_email.ilike.%${searchTerm}%,record_id.ilike.%${searchTerm}%`);
      }

      const { data, error } = await query;

      if (error) throw error;
      return data as AuditLog[];
    },
  });

  const getActionIcon = (action: string) => {
    switch (action) {
      case 'create':
        return <Plus className="w-4 h-4" />;
      case 'update':
        return <Edit className="w-4 h-4" />;
      case 'delete':
        return <Trash2 className="w-4 h-4" />;
      default:
        return <FileText className="w-4 h-4" />;
    }
  };

  const getActionColor = (action: string) => {
    switch (action) {
      case 'create':
        return 'bg-green-500/10 text-green-500 border-green-500/20';
      case 'update':
        return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
      case 'delete':
        return 'bg-red-500/10 text-red-500 border-red-500/20';
      default:
        return 'bg-gray-500/10 text-gray-500 border-gray-500/20';
    }
  };

  const getTableNameLabel = (tableName: string) => {
    const labels: Record<string, string> = {
      news: 'Yangiliklar',
      events: 'Tadbirlar',
      gallery: 'Galereya',
      teachers: "O'qituvchilar",
      departments: "Bo'limlar",
    };
    return labels[tableName] || tableName;
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-display font-bold flex items-center gap-2">
            <History className="w-6 h-6" />
            Audit Log
          </h1>
          <p className="text-muted-foreground">
            Saytga kiritilgan barcha o'zgartirishlar tarixi
          </p>
        </div>

        {/* Filters */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="w-4 h-4" />
              Filtrlar
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium flex items-center gap-2">
                  <Search className="w-4 h-4" />
                  Qidirish
                </label>
                <Input
                  placeholder="Email yoki ID bo'yicha qidirish..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  Jadval
                </label>
                <Select value={tableFilter} onValueChange={setTableFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Barcha jadvallar" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Barcha jadvallar</SelectItem>
                    <SelectItem value="news">Yangiliklar</SelectItem>
                    <SelectItem value="events">Tadbirlar</SelectItem>
                    <SelectItem value="gallery">Galereya</SelectItem>
                    <SelectItem value="teachers">O'qituvchilar</SelectItem>
                    <SelectItem value="departments">Bo'limlar</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium flex items-center gap-2">
                  <History className="w-4 h-4" />
                  Amal
                </label>
                <Select value={actionFilter} onValueChange={setActionFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Barcha amallar" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Barcha amallar</SelectItem>
                    <SelectItem value="create">Yaratish</SelectItem>
                    <SelectItem value="update">O'zgartirish</SelectItem>
                    <SelectItem value="delete">O'chirish</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Logs List */}
        <Card>
          <CardHeader>
            <CardTitle>O'zgartirishlar tarixi</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <div className="text-muted-foreground">Yuklanmoqda...</div>
              </div>
            ) : logs && logs.length > 0 ? (
              <div className="space-y-4">
                {logs.map((log) => (
                  <div
                    key={log.id}
                    className="p-4 rounded-lg border border-border bg-card hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center gap-2 flex-wrap">
                          <Badge
                            variant="outline"
                            className={getActionColor(log.action)}
                          >
                            {getActionIcon(log.action)}
                            <span className="ml-1 capitalize">{log.action}</span>
                          </Badge>
                          <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
                            {getTableNameLabel(log.table_name)}
                          </Badge>
                          <span className="text-xs text-muted-foreground font-mono">
                            ID: {log.record_id.substring(0, 8)}...
                          </span>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <User className="w-4 h-4" />
                            {log.user_email || 'Noma\'lum'}
                          </div>
                          <div className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            {format(new Date(log.created_at), 'dd.MM.yyyy HH:mm')}
                          </div>
                        </div>
                        {log.changes && Object.keys(log.changes).length > 0 && (
                          <div className="mt-2 p-2 bg-muted rounded text-xs">
                            <div className="font-medium mb-1">O'zgargan maydonlar:</div>
                            <div className="space-y-1">
                              {Object.entries(log.changes).slice(0, 3).map(([key, value]) => (
                                <div key={key} className="flex items-center gap-2">
                                  <span className="font-mono text-primary">{key}:</span>
                                  <span className="truncate">
                                    {typeof value === 'object' ? JSON.stringify(value).substring(0, 50) : String(value).substring(0, 50)}
                                  </span>
                                </div>
                              ))}
                              {Object.keys(log.changes).length > 3 && (
                                <div className="text-muted-foreground">
                                  +{Object.keys(log.changes).length - 3} boshqa maydon
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex items-center justify-center py-12">
                <div className="text-center">
                  <History className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">Hech qanday log topilmadi</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default AuditLogs;

