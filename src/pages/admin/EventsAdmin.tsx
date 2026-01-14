import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Pencil, Trash2, Eye, EyeOff, Loader2, MapPin, Calendar } from 'lucide-react';
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

type EventRow = Tables<'events'>;
type EventInsert = TablesInsert<'events'>;
type EventUpdate = TablesUpdate<'events'>;

const EventsAdmin: React.FC = () => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<EventRow | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const { toast } = useToast();
  const { language, t } = useLanguage();
  const queryClient = useQueryClient();

  const { data: events, isLoading } = useQuery({
    queryKey: ['admin-events'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .order('event_date', { ascending: false });

      if (error) throw error;
      return data as EventRow[];
    },
  });

  const saveMutation = useMutation({
    mutationFn: async (item: EventInsert | EventUpdate) => {
      if (editingItem?.id) {
        const { error } = await supabase
          .from('events')
          .update(item as EventUpdate)
          .eq('id', editingItem.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('events').insert([item as EventInsert]);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-events'] });
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
      const { error } = await supabase.from('events').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-events'] });
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
        .from('events')
        .update({ published })
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-events'] });
    },
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const item: EventInsert = {
      title_uz: formData.get('title_uz') as string,
      title_ru: formData.get('title_ru') as string,
      title_en: formData.get('title_en') as string,
      description_uz: formData.get('description_uz') as string,
      description_ru: formData.get('description_ru') as string,
      description_en: formData.get('description_en') as string,
      event_date: formData.get('event_date') as string,
      location: formData.get('location') as string || null,
      image_url: formData.get('image_url') as string || null,
      published: formData.get('published') === 'on',
    };

    saveMutation.mutate(item);
  };

  const getTitle = (item: EventRow) => {
    if (language === 'uz') return item.title_uz;
    if (language === 'ru') return item.title_ru;
    return item.title_en;
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-display font-bold">{t('adminEvents')}</h1>
            <p className="text-muted-foreground">{t('events')}</p>
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
                    <Label htmlFor="title_uz">{t('titleUz')}</Label>
                    <Input
                      id="title_uz"
                      name="title_uz"
                      defaultValue={editingItem?.title_uz}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="title_ru">{t('titleRu')}</Label>
                    <Input
                      id="title_ru"
                      name="title_ru"
                      defaultValue={editingItem?.title_ru}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="title_en">{t('titleEn')}</Label>
                    <Input
                      id="title_en"
                      name="title_en"
                      defaultValue={editingItem?.title_en}
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

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="event_date">{t('date')}</Label>
                    <Input
                      id="event_date"
                      name="event_date"
                      type="datetime-local"
                      defaultValue={editingItem?.event_date?.slice(0, 16)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="location">{t('location')}</Label>
                    <Input
                      id="location"
                      name="location"
                      defaultValue={editingItem?.location || ''}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="image_url">{t('imageUrl')}</Label>
                  <Input
                    id="image_url"
                    name="image_url"
                    defaultValue={editingItem?.image_url || ''}
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
            {events?.map((item) => (
              <Card key={item.id} className="overflow-hidden">
                {item.image_url && (
                  <img
                    src={item.image_url}
                    alt={getTitle(item)}
                    className="w-full h-40 object-cover"
                  />
                )}
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between gap-2">
                    <CardTitle className="text-lg line-clamp-2">
                      {getTitle(item)}
                    </CardTitle>
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
                    <p className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {new Date(item.event_date).toLocaleDateString()}
                    </p>
                    {item.location && (
                      <p className="flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {item.location}
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

export default EventsAdmin;
