// ============================================
// DEPARTMENTS ADMIN PAGE
// ============================================
// Bo'limlar boshqaruvi
// CRUD operatsiyalari
// ============================================

import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Pencil, Trash2, Eye, EyeOff, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';
import { departmentsApi } from '@/lib/api';
import AdminLayout from '@/components/admin/AdminLayout';
import { useLanguage } from '@/contexts/LanguageContext';

interface DepartmentItem {
  id: string;
  name_uz: string;
  name_ru: string;
  name_en: string;
  description_uz: string;
  description_ru: string;
  description_en: string;
  icon: string;
  published: boolean;
  created_at: string;
}

const DepartmentsAdmin: React.FC = () => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [clearAllDialogOpen, setClearAllDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<DepartmentItem | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [published, setPublished] = useState(true);

  const { toast } = useToast();
  const { language, t } = useLanguage();
  const queryClient = useQueryClient();

  const { data: departments, isLoading } = useQuery({
    queryKey: ['admin-departments'],
    queryFn: async () => {
      const response = await departmentsApi.getAll();
      if (response.success) {
        return response.data as DepartmentItem[];
      }
      return [];
    },
  });

  const saveMutation = useMutation({
    mutationFn: async (item: Partial<DepartmentItem>) => {
      if (editingItem?.id) {
        return departmentsApi.update(editingItem.id, item);
      } else {
        return departmentsApi.create(item);
      }
    },
    onSuccess: (response) => {
      if (response.success) {
        queryClient.invalidateQueries({ queryKey: ['admin-departments'] });
        queryClient.invalidateQueries({ queryKey: ['departments'] });
        handleCloseDialog();
        toast({
          title: t('success'),
          description: editingItem ? t('updated') : t('added'),
        });
      } else {
        toast({
          variant: 'destructive',
          title: t('error'),
          description: response.message,
        });
      }
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      return departmentsApi.delete(id);
    },
    onSuccess: (response) => {
      if (response.success) {
        queryClient.invalidateQueries({ queryKey: ['admin-departments'] });
        queryClient.invalidateQueries({ queryKey: ['departments'] });
        setDeleteDialogOpen(false);
        setDeletingId(null);
        toast({ title: t('deleted'), description: t('deleted') });
      }
    },
  });

  const togglePublished = useMutation({
    mutationFn: async ({ id, published }: { id: string; published: boolean }) => {
      return departmentsApi.update(id, { published });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-departments'] });
      queryClient.invalidateQueries({ queryKey: ['departments'] });
    },
  });

  const clearAllMutation = useMutation({
    mutationFn: async () => {
      return departmentsApi.clearAll();
    },
    onSuccess: (response) => {
      if (response.success) {
        queryClient.invalidateQueries({ queryKey: ['admin-departments'] });
        queryClient.invalidateQueries({ queryKey: ['departments'] });
        setClearAllDialogOpen(false);
        toast({ title: t('deleted'), description: t('deleted') });
      }
    },
    onError: (error: Error) => {
      toast({ variant: 'destructive', title: t('error'), description: error.message });
    },
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const item = {
      name_uz: formData.get('name_uz') as string,
      name_ru: formData.get('name_ru') as string,
      name_en: formData.get('name_en') as string,
      description_uz: formData.get('description_uz') as string,
      description_ru: formData.get('description_ru') as string,
      description_en: formData.get('description_en') as string,
      icon: formData.get('icon') as string || 'BookOpen',
      published: published,
    };

    saveMutation.mutate(item);
  };

  const handleOpenDialog = (item?: DepartmentItem) => {
    if (item) {
      setEditingItem(item);
      setPublished(item.published ?? false);
    } else {
      setEditingItem(null);
      setPublished(true);
    }
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setEditingItem(null);
    setPublished(true);
  };

  const getName = (item: DepartmentItem) => {
    if (language === 'uz') return item.name_uz;
    if (language === 'ru') return item.name_ru;
    return item.name_en;
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-display font-bold">{t('adminDepartments')}</h1>
            <p className="text-muted-foreground">{t('departments')}</p>
          </div>
          <div className="flex items-center gap-2">
            {departments && departments.length > 0 && (
              <Button
                variant="destructive"
                onClick={() => setClearAllDialogOpen(true)}
              >
                {t('delete')} all
              </Button>
            )}
            <Dialog open={dialogOpen} onOpenChange={(open) => open ? setDialogOpen(true) : handleCloseDialog()}>
              <DialogTrigger asChild>
                <Button onClick={() => handleOpenDialog()}>
                  <Plus className="w-4 h-4 mr-2" />
                  {t('add')}
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>{editingItem ? t('edit') : t('add')}</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name_uz">Nom (UZ) *</Label>
                      <Input id="name_uz" name="name_uz" defaultValue={editingItem?.name_uz} required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="name_ru">Nom (RU) *</Label>
                      <Input id="name_ru" name="name_ru" defaultValue={editingItem?.name_ru} required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="name_en">Nom (EN) *</Label>
                      <Input id="name_en" name="name_en" defaultValue={editingItem?.name_en} required />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description_uz">{t('descriptionUz')} *</Label>
                    <Textarea id="description_uz" name="description_uz" rows={3} defaultValue={editingItem?.description_uz} required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="description_ru">{t('descriptionRu')} *</Label>
                    <Textarea id="description_ru" name="description_ru" rows={3} defaultValue={editingItem?.description_ru} required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="description_en">{t('descriptionEn')} *</Label>
                    <Textarea id="description_en" name="description_en" rows={3} defaultValue={editingItem?.description_en} required />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="icon">Icon (Lucide icon nomi)</Label>
                    <Input id="icon" name="icon" defaultValue={editingItem?.icon || 'BookOpen'} placeholder="BookOpen, Users, Building2..." />
                  </div>

                  <div className="flex items-center gap-2">
                    <Switch id="published" checked={published} onCheckedChange={setPublished} />
                    <Label htmlFor="published">{t('publish')}</Label>
                  </div>

                  <div className="flex justify-end gap-2">
                    <Button type="button" variant="outline" onClick={handleCloseDialog}>{t('cancel')}</Button>
                    <Button type="submit" disabled={saveMutation.isPending}>
                      {saveMutation.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                      {t('save')}
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {departments?.map((item) => (
              <Card key={item.id} className="overflow-hidden">
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between gap-2">
                    <CardTitle className="text-lg">{getName(item)}</CardTitle>
                    <Button variant="ghost" size="icon" onClick={() => togglePublished.mutate({ id: item.id, published: !item.published })}>
                      {item.published ? <Eye className="w-4 h-4 text-green-500" /> : <EyeOff className="w-4 h-4 text-muted-foreground" />}
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">Icon: {item.icon}</p>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => handleOpenDialog(item)}>
                      <Pencil className="w-4 h-4" />
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => { setDeletingId(item.id); setDeleteDialogOpen(true); }}>
                      <Trash2 className="w-4 h-4 text-destructive" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>{t('confirmDelete')}</AlertDialogTitle>
              <AlertDialogDescription>{t('cannotUndo')}</AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>{t('cancel')}</AlertDialogCancel>
              <AlertDialogAction onClick={() => deletingId && deleteMutation.mutate(deletingId)}>{t('delete')}</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        <AlertDialog open={clearAllDialogOpen} onOpenChange={setClearAllDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>{t('confirmDelete')}</AlertDialogTitle>
              <AlertDialogDescription>{t('cannotUndo')}</AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>{t('cancel')}</AlertDialogCancel>
              <AlertDialogAction
                onClick={() => clearAllMutation.mutate()}
                disabled={clearAllMutation.isPending}
              >
                {t('delete')} all
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </AdminLayout>
  );
};

export default DepartmentsAdmin;
