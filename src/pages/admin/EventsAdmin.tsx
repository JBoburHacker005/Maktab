// ============================================
// EVENTS ADMIN PAGE
// ============================================
// Tadbirlar boshqaruvi
// CRUD operatsiyalari
// ============================================

import React, { useState, useRef } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Pencil, Trash2, Eye, EyeOff, Loader2, Upload } from 'lucide-react';
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
import { eventsApi, uploadApi } from '@/lib/api';
import AdminLayout from '@/components/admin/AdminLayout';
import { useLanguage } from '@/contexts/LanguageContext';

interface EventItem {
  id: string;
  title_uz: string;
  title_ru: string;
  title_en: string;
  description_uz: string;
  description_ru: string;
  description_en: string;
  location: string | null;
  event_date: string;
  event_time: string | null;
  image_url: string | null;
  category: string;
  published: boolean;
  created_at: string;
  updated_at: string;
}

const EventsAdmin: React.FC = () => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [clearAllDialogOpen, setClearAllDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<EventItem | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [published, setPublished] = useState(true);
  const [imageUrl, setImageUrl] = useState('');
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { toast } = useToast();
  const { language, t } = useLanguage();
  const queryClient = useQueryClient();

  const { data: events, isLoading } = useQuery({
    queryKey: ['admin-events'],
    queryFn: async () => {
      const response = await eventsApi.getAll();
      if (response.success) {
        return response.data as EventItem[];
      }
      return [];
    },
  });

  const saveMutation = useMutation({
    mutationFn: async (item: Partial<EventItem>) => {
      if (editingItem?.id) {
        return eventsApi.update(editingItem.id, item);
      } else {
        return eventsApi.create(item);
      }
    },
    onSuccess: (response) => {
      if (response.success) {
        queryClient.invalidateQueries({ queryKey: ['admin-events'] });
        queryClient.invalidateQueries({ queryKey: ['events'] });
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
      return eventsApi.delete(id);
    },
    onSuccess: (response) => {
      if (response.success) {
        queryClient.invalidateQueries({ queryKey: ['admin-events'] });
        queryClient.invalidateQueries({ queryKey: ['events'] });
        setDeleteDialogOpen(false);
        setDeletingId(null);
        toast({
          title: t('deleted'),
          description: t('deleted'),
        });
      }
    },
  });

  const togglePublished = useMutation({
    mutationFn: async ({ id, published }: { id: string; published: boolean }) => {
      return eventsApi.update(id, { published });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-events'] });
      queryClient.invalidateQueries({ queryKey: ['events'] });
    },
  });

  const clearAllMutation = useMutation({
    mutationFn: async () => {
      return eventsApi.clearAll();
    },
    onSuccess: (response) => {
      if (response.success) {
        queryClient.invalidateQueries({ queryKey: ['admin-events'] });
        queryClient.invalidateQueries({ queryKey: ['events'] });
        setClearAllDialogOpen(false);
        toast({
          title: t('deleted'),
          description: t('deleted'),
        });
      }
    },
    onError: (error: Error) => {
      toast({
        variant: 'destructive',
        title: t('error'),
        description: error.message,
      });
    },
  });

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const reader = new FileReader();
      reader.onload = async () => {
        const base64 = reader.result as string;
        const response = await uploadApi.uploadImage(base64, file.name);
        if (response.success && response.data) {
          setImageUrl(response.data.url);
          toast({ title: t('success'), description: 'Rasm yuklandi' });
        } else {
          toast({ variant: 'destructive', title: t('error'), description: response.message });
        }
        setUploading(false);
      };
      reader.readAsDataURL(file);
    } catch {
      setUploading(false);
      toast({ variant: 'destructive', title: t('error'), description: 'Rasm yuklab bo\'lmadi' });
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const item = {
      title_uz: formData.get('title_uz') as string,
      title_ru: formData.get('title_ru') as string,
      title_en: formData.get('title_en') as string,
      description_uz: formData.get('description_uz') as string,
      description_ru: formData.get('description_ru') as string,
      description_en: formData.get('description_en') as string,
      location: formData.get('location') as string || null,
      event_date: formData.get('event_date') as string,
      event_time: formData.get('event_time') as string || null,
      category: formData.get('category') as string || 'Cultural',
      image_url: imageUrl || formData.get('image_url') as string || null,
      published: published,
    };

    saveMutation.mutate(item);
  };

  const handleOpenDialog = (item?: EventItem) => {
    if (item) {
      setEditingItem(item);
      setPublished(item.published ?? false);
      setImageUrl(item.image_url || '');
    } else {
      setEditingItem(null);
      setPublished(true);
      setImageUrl('');
    }
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setEditingItem(null);
    setPublished(true);
    setImageUrl('');
  };

  const getTitle = (item: EventItem) => {
    if (language === 'uz') return item.title_uz;
    if (language === 'ru') return item.title_ru;
    return item.title_en;
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-display font-bold">{t('adminEvents')}</h1>
            <p className="text-muted-foreground">{t('events')}</p>
          </div>
          <div className="flex items-center gap-2">
            {events && events.length > 0 && (
              <Button
                variant="destructive"
                onClick={() => setClearAllDialogOpen(true)}
              >
                {t('delete')} all
              </Button>
            )}
            <Dialog open={dialogOpen} onOpenChange={handleCloseDialog}>
              <DialogTrigger asChild>
                <Button onClick={() => handleOpenDialog()}>
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
                      <Input id="title_uz" name="title_uz" defaultValue={editingItem?.title_uz} required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="title_ru">{t('titleRu')}</Label>
                      <Input id="title_ru" name="title_ru" defaultValue={editingItem?.title_ru} required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="title_en">{t('titleEn')}</Label>
                      <Input id="title_en" name="title_en" defaultValue={editingItem?.title_en} required />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description_uz">{t('descriptionUz')}</Label>
                    <Textarea id="description_uz" name="description_uz" rows={3} defaultValue={editingItem?.description_uz} required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="description_ru">{t('descriptionRu')}</Label>
                    <Textarea id="description_ru" name="description_ru" rows={3} defaultValue={editingItem?.description_ru} required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="description_en">{t('descriptionEn')}</Label>
                    <Textarea id="description_en" name="description_en" rows={3} defaultValue={editingItem?.description_en} required />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="event_date">Sana</Label>
                      <Input id="event_date" name="event_date" type="date" defaultValue={editingItem?.event_date?.slice(0, 10)} required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="event_time">Vaqt</Label>
                      <Input id="event_time" name="event_time" type="time" defaultValue={editingItem?.event_time || ''} />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="location">Manzil</Label>
                      <Input id="location" name="location" defaultValue={editingItem?.location || ''} placeholder="School Yard, Main Hall..." />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="category">{t('category')}</Label>
                      <Input id="category" name="category" defaultValue={editingItem?.category || 'Cultural'} placeholder="Cultural, Academic..." />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="image_url">{t('imageUrl')}</Label>
                    <div className="flex gap-2">
                      <Input
                        id="image_url"
                        name="image_url"
                        value={imageUrl}
                        onChange={(e) => setImageUrl(e.target.value)}
                        placeholder="Rasm URL yoki yuklang"
                      />
                      <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleImageUpload}
                        accept="image/*"
                        className="hidden"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={uploading}
                      >
                        {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                      </Button>
                    </div>
                    {imageUrl && (
                      <img src={imageUrl} alt="Preview" className="w-full h-32 object-cover rounded mt-2" />
                    )}
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
            {events?.map((item) => (
              <Card key={item.id} className="overflow-hidden">
                {item.image_url && (
                  <img src={item.image_url} alt={getTitle(item)} className="w-full h-40 object-cover" />
                )}
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between gap-2">
                    <CardTitle className="text-lg line-clamp-2">{getTitle(item)}</CardTitle>
                    <Button variant="ghost" size="icon" onClick={() => togglePublished.mutate({ id: item.id, published: !item.published })}>
                      {item.published ? <Eye className="w-4 h-4 text-green-500" /> : <EyeOff className="w-4 h-4 text-muted-foreground" />}
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-sm text-muted-foreground mb-2">
                    <p>{new Date(item.event_date).toLocaleDateString()}{item.event_time ? ` • ${item.event_time}` : ''}</p>
                    {item.location && <p>{item.location}</p>}
                    {item.category && <p className="text-xs mt-1 bg-primary/10 rounded px-2 py-0.5 inline-block">{item.category}</p>}
                  </div>
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

export default EventsAdmin;
