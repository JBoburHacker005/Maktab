import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
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
import { supabase } from '@/integrations/supabase/client';
import AdminLayout from '@/components/admin/AdminLayout';
import { useLanguage } from '@/contexts/LanguageContext';
import { Tables, TablesInsert, TablesUpdate } from '@/integrations/supabase/types';

type DepartmentRow = Tables<'departments'>;
type DepartmentInsert = TablesInsert<'departments'>;
type DepartmentUpdate = TablesUpdate<'departments'>;

const DepartmentsAdmin: React.FC = () => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<DepartmentRow | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const { toast } = useToast();
  const { language, t } = useLanguage();
  const queryClient = useQueryClient();
  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    if (searchParams.get('open') === 'new') {
      setEditingItem(null);
      setDialogOpen(true);
      // Clean up the query param
      setSearchParams(params => {
        params.delete('open');
        return params;
      });
    }
  }, [searchParams, setSearchParams]);

  const { data: departments, isLoading } = useQuery({
    queryKey: ['admin-departments'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('departments')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as DepartmentRow[];
    },
  });

  const saveMutation = useMutation({
    mutationFn: async (item: DepartmentInsert | DepartmentUpdate) => {
      if (editingItem?.id) {
        const { error } = await supabase
          .from('departments')
          .update(item as DepartmentUpdate)
          .eq('id', editingItem.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('departments').insert([item as DepartmentInsert]);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-departments'] });
      setDialogOpen(false);
      setEditingItem(null);
      toast({
        title: t('success'),
        description: editingItem ? t('updated') : t('added'),
      });
    },
    onError: (error: Error) => {
      toast({
        variant: 'destructive',
        title: t('error'),
        description: error.message,
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('departments').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-departments'] });
      setDeleteDialogOpen(false);
      setDeletingId(null);
      toast({
        title: t('deleted'),
        description: t('deleted'),
      });
    },
  });

  const togglePublished = useMutation({
    mutationFn: async ({ id, published }: { id: string; published: boolean }) => {
      const { error } = await supabase
        .from('departments')
        .update({ published })
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-departments'] });
    },
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const item: DepartmentInsert = {
      name_uz: formData.get('name_uz') as string,
      name_ru: formData.get('name_ru') as string,
      name_en: formData.get('name_en') as string,
      description_uz: formData.get('description_uz') as string,
      description_ru: formData.get('description_ru') as string,
      description_en: formData.get('description_en') as string,
      icon: formData.get('icon') as string || 'BookOpen',
      published: formData.get('published') === 'on',
    };

    saveMutation.mutate(item);
  };

  const getName = (item: DepartmentRow) => {
    if (language === 'uz') return item.name_uz;
    if (language === 'ru') return item.name_ru;
    return item.name_en;
  };

  const getDescription = (item: DepartmentRow) => {
    if (language === 'uz') return item.description_uz;
    if (language === 'ru') return item.description_ru;
    return item.description_en;
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-display font-bold">{t('adminDepartments')}</h1>
            <p className="text-muted-foreground">{t('departments')}</p>
          </div>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => setEditingItem(null)}>
                <Plus className="w-4 h-4 mr-2" />
                {t('add')}
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  {editingItem ? t('edit') : t('add')}
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name_uz">{t('nameUz')}</Label>
                    <Input
                      id="name_uz"
                      name="name_uz"
                      defaultValue={editingItem?.name_uz}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="name_ru">{t('nameRu')}</Label>
                    <Input
                      id="name_ru"
                      name="name_ru"
                      defaultValue={editingItem?.name_ru}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="name_en">{t('nameEn')}</Label>
                    <Input
                      id="name_en"
                      name="name_en"
                      defaultValue={editingItem?.name_en}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description_uz">{t('descriptionUz')}</Label>
                  <Textarea
                    id="description_uz"
                    name="description_uz"
                    rows={3}
                    defaultValue={editingItem?.description_uz}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description_ru">{t('descriptionRu')}</Label>
                  <Textarea
                    id="description_ru"
                    name="description_ru"
                    rows={3}
                    defaultValue={editingItem?.description_ru}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description_en">{t('descriptionEn')}</Label>
                  <Textarea
                    id="description_en"
                    name="description_en"
                    rows={3}
                    defaultValue={editingItem?.description_en}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="icon">{t('iconName')}</Label>
                  <Input
                    id="icon"
                    name="icon"
                    defaultValue={editingItem?.icon || 'BookOpen'}
                    placeholder="BookOpen, Calculator, Atom..."
                  />
                </div>

                <div className="flex items-center gap-2">
                  <Switch
                    id="published"
                    name="published"
                    defaultChecked={editingItem?.published ?? false}
                  />
                  <Label htmlFor="published">{t('publish')}</Label>
                </div>

                <div className="flex justify-end gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setDialogOpen(false)}
                  >
                    {t('cancel')}
                  </Button>
                  <Button type="submit" disabled={saveMutation.isPending}>
                    {saveMutation.isPending && (
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    )}
                    {t('save')}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {departments?.map((item) => (
              <Card key={item.id}>
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                        📚
                      </div>
                      <CardTitle className="text-lg">{getName(item)}</CardTitle>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() =>
                        togglePublished.mutate({
                          id: item.id,
                          published: !item.published,
                        })
                      }
                    >
                      {item.published ? (
                        <Eye className="w-4 h-4 text-green-500" />
                      ) : (
                        <EyeOff className="w-4 h-4 text-muted-foreground" />
                      )}
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                    {getDescription(item)}
                  </p>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setEditingItem(item);
                        setDialogOpen(true);
                      }}
                    >
                      <Pencil className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setDeletingId(item.id);
                        setDeleteDialogOpen(true);
                      }}
                    >
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
              <AlertDialogDescription>
                {t('cannotUndo')}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>{t('cancel')}</AlertDialogCancel>
              <AlertDialogAction
                onClick={() => deletingId && deleteMutation.mutate(deletingId)}
              >
                {t('delete')}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </AdminLayout>
  );
};

export default DepartmentsAdmin;
