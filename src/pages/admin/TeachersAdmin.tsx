import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Pencil, Trash2, Eye, EyeOff, Loader2, Mail, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
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

type TeacherRow = Tables<'teachers'>;
type TeacherInsert = TablesInsert<'teachers'>;
type TeacherUpdate = TablesUpdate<'teachers'>;

const TeachersAdmin: React.FC = () => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<TeacherRow | null>(null);
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

  const { data: teachers, isLoading } = useQuery({
    queryKey: ['admin-teachers'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('teachers')
        .select('*')
        .order('name');

      if (error) throw error;
      return data as TeacherRow[];
    },
  });

  const saveMutation = useMutation({
    mutationFn: async (item: TeacherInsert | TeacherUpdate) => {
      if (editingItem?.id) {
        const { error } = await supabase
          .from('teachers')
          .update(item as TeacherUpdate)
          .eq('id', editingItem.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('teachers').insert([item as TeacherInsert]);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-teachers'] });
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
      const { error } = await supabase.from('teachers').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-teachers'] });
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
        .from('teachers')
        .update({ published })
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-teachers'] });
    },
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const item: TeacherInsert = {
      name: formData.get('name') as string,
      subject_uz: formData.get('subject_uz') as string,
      subject_ru: formData.get('subject_ru') as string,
      subject_en: formData.get('subject_en') as string,
      bio_uz: formData.get('bio_uz') as string || null,
      bio_ru: formData.get('bio_ru') as string || null,
      bio_en: formData.get('bio_en') as string || null,
      email: formData.get('email') as string || null,
      phone: formData.get('phone') as string || null,
      image_url: formData.get('image_url') as string || null,
      published: formData.get('published') === 'on',
    };

    saveMutation.mutate(item);
  };

  const getSubject = (item: TeacherRow) => {
    if (language === 'uz') return item.subject_uz;
    if (language === 'ru') return item.subject_ru;
    return item.subject_en;
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-display font-bold">{t('adminTeachers')}</h1>
            <p className="text-muted-foreground">{t('teachers')}</p>
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
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">{t('yourName')}</Label>
                    <Input
                      id="name"
                      name="name"
                      defaultValue={editingItem?.name}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="image_url">{t('imageUrl')}</Label>
                    <Input
                      id="image_url"
                      name="image_url"
                      defaultValue={editingItem?.image_url || ''}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="subject_uz">{t('descriptionUz')}</Label>
                    <Input
                      id="subject_uz"
                      name="subject_uz"
                      defaultValue={editingItem?.subject_uz}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="subject_ru">{t('descriptionRu')}</Label>
                    <Input
                      id="subject_ru"
                      name="subject_ru"
                      defaultValue={editingItem?.subject_ru}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="subject_en">{t('descriptionEn')}</Label>
                    <Input
                      id="subject_en"
                      name="subject_en"
                      defaultValue={editingItem?.subject_en}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bio_uz">Bio (UZ)</Label>
                  <Textarea
                    id="bio_uz"
                    name="bio_uz"
                    rows={2}
                    defaultValue={editingItem?.bio_uz || ''}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bio_ru">Bio (RU)</Label>
                  <Textarea
                    id="bio_ru"
                    name="bio_ru"
                    rows={2}
                    defaultValue={editingItem?.bio_ru || ''}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bio_en">Bio (EN)</Label>
                  <Textarea
                    id="bio_en"
                    name="bio_en"
                    rows={2}
                    defaultValue={editingItem?.bio_en || ''}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">{t('email')}</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      defaultValue={editingItem?.email || ''}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">{t('phone')}</Label>
                    <Input
                      id="phone"
                      name="phone"
                      defaultValue={editingItem?.phone || ''}
                    />
                  </div>
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
            {teachers?.map((item) => (
              <Card key={item.id} className="overflow-hidden">
                <CardHeader className="pb-2">
                  <div className="flex items-start gap-3">
                    <Avatar className="w-12 h-12">
                      <AvatarImage src={item.image_url || ''} />
                      <AvatarFallback>
                        {item.name.slice(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <CardTitle className="text-lg truncate">{item.name}</CardTitle>
                      <p className="text-sm text-muted-foreground">{getSubject(item)}</p>
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
                  <div className="space-y-1 text-sm text-muted-foreground mb-4">
                    {item.email && (
                      <p className="flex items-center gap-1 truncate">
                        <Mail className="w-3 h-3 shrink-0" />
                        {item.email}
                      </p>
                    )}
                    {item.phone && (
                      <p className="flex items-center gap-1">
                        <Phone className="w-3 h-3 shrink-0" />
                        {item.phone}
                      </p>
                    )}
                  </div>
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

export default TeachersAdmin;
