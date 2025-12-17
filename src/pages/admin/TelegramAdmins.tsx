import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Bot, Plus, Trash2, UserPlus } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import AdminLayout from '@/components/admin/AdminLayout';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';

interface TelegramAdmin {
  id: string;
  telegram_user_id: number | null;
  telegram_username: string | null;
  user_id: string;
  role: 'admin' | 'super_admin';
  created_at: string;
  user_email?: string;
}

const TelegramAdmins: React.FC = () => {
  const { role } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [telegramUsername, setTelegramUsername] = useState('');

  // Har qanday admin (role mavjud bo'lsa) Telegram adminlarini boshqara oladi
  if (!role) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <h2 className="text-xl font-display font-bold mb-2">Ruxsat yo'q</h2>
            <p className="text-muted-foreground">
              Sizda bu bo&apos;limga kirish huquqi mavjud emas.
            </p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  const { data: admins, isLoading } = useQuery({
    queryKey: ['telegram-admins'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('user_roles')
        .select(`
          id,
          telegram_user_id,
          telegram_username,
          user_id,
          role,
          created_at,
          user:user_id (
            email
          )
        `)
        .or('telegram_username.not.is.null,telegram_user_id.not.is.null')
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      return (data || []).map((item: any) => ({
        id: item.id,
        telegram_user_id: item.telegram_user_id,
        telegram_username: item.telegram_username,
        user_id: item.user_id,
        role: item.role,
        created_at: item.created_at,
        user_email: item.user?.email || 'N/A',
      })) as TelegramAdmin[];
    },
  });

  const addAdminMutation = useMutation({
    mutationFn: async (username: string) => {
      // Remove @ if present
      const cleanUsername = username.replace('@', '').trim();
      
      if (!cleanUsername) {
        throw new Error('Username kiritilishi shart');
      }

      // Check if telegram_username already exists
      const { data: existing } = await supabase
        .from('user_roles')
        .select('*')
        .ilike('telegram_username', cleanUsername)
        .maybeSingle();

      if (existing) {
        throw new Error('Bu Telegram username allaqachon admin');
      }

      // Create a system user for Telegram admin
      const { data: systemUser } = await supabase.auth.admin.createUser({
        email: `telegram_${cleanUsername}@admin.local`,
        password: Math.random().toString(36).slice(-12) + Math.random().toString(36).slice(-12),
        email_confirm: true,
      });

      if (!systemUser.user) {
        throw new Error('Foydalanuvchi yaratib bo\'lmadi');
      }

      // Add admin role with telegram_username
      const { error } = await supabase.from('user_roles').insert({
        user_id: systemUser.user.id,
        telegram_username: cleanUsername,
        role: 'admin',
      });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['telegram-admins'] });
      setDialogOpen(false);
      setTelegramUsername('');
      toast({
        title: 'Muvaffaqiyatli!',
        description: 'Telegram admin qo\'shildi',
      });
    },
    onError: (error: Error) => {
      toast({
        variant: 'destructive',
        title: 'Xatolik',
        description: error.message,
      });
    },
  });

  const deleteAdminMutation = useMutation({
    mutationFn: async (adminId: string) => {
      const { error } = await supabase
        .from('user_roles')
        .delete()
        .eq('id', adminId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['telegram-admins'] });
      toast({
        title: 'Muvaffaqiyatli!',
        description: 'Telegram admin o\'chirildi',
      });
    },
    onError: (error: Error) => {
      toast({
        variant: 'destructive',
        title: 'Xatolik',
        description: error.message,
      });
    },
  });

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-display font-bold flex items-center gap-2">
              <Bot className="w-6 h-6" />
              Telegram Adminlar
            </h1>
            <p className="text-muted-foreground">
              Telegram bot uchun adminlarni boshqarish
            </p>
          </div>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <UserPlus className="w-4 h-4 mr-2" />
                Admin qo'shish
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Yangi Telegram Admin</DialogTitle>
                <DialogDescription>
                  Telegram username ni kiriting (@ belgisiz yoki bilan). Masalan: username yoki @username
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="telegramUsername">Telegram Username</Label>
                  <Input
                    id="telegramUsername"
                    type="text"
                    placeholder="@username yoki username"
                    value={telegramUsername}
                    onChange={(e) => setTelegramUsername(e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground">
                    Username ni Telegram profilida topishingiz mumkin (Settings > Username)
                  </p>
                </div>
                <Button
                  onClick={() => {
                    if (telegramUsername) {
                      addAdminMutation.mutate(telegramUsername);
                    }
                  }}
                  disabled={addAdminMutation.isPending || !telegramUsername}
                  className="w-full"
                >
                  {addAdminMutation.isPending ? 'Qo\'shilmoqda...' : 'Qo\'shish'}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Admins List */}
        <Card>
          <CardHeader>
            <CardTitle>Adminlar ro'yxati</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <div className="text-muted-foreground">Yuklanmoqda...</div>
              </div>
            ) : admins && admins.length > 0 ? (
              <div className="space-y-3">
                {admins.map((admin) => (
                  <div
                    key={admin.id}
                    className="flex items-center justify-between p-4 rounded-lg border border-border bg-card"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <Bot className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <div className="font-medium">
                          @{admin.telegram_username || admin.telegram_user_id || 'N/A'}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {admin.user_email}
                        </div>
                      </div>
                      <Badge variant={admin.role === 'super_admin' ? 'default' : 'secondary'}>
                        {admin.role === 'super_admin' ? 'Super Admin' : 'Admin'}
                      </Badge>
                    </div>
                    <Button
                      variant="destructive"
                      size="icon"
                      onClick={() => {
                        if (confirm('Bu adminni o\'chirishni tasdiqlaysizmi?')) {
                          deleteAdminMutation.mutate(admin.id);
                        }
                      }}
                      disabled={deleteAdminMutation.isPending}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex items-center justify-center py-12">
                <div className="text-center">
                  <Bot className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">Hech qanday Telegram admin topilmadi</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default TelegramAdmins;

