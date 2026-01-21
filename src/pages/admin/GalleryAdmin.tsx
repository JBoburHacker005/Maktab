// ============================================
// GALLERY ADMIN PAGE
// ============================================
// Galereya boshqaruvi
// CRUD operatsiyalari
// ============================================

import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Pencil, Trash2, Eye, EyeOff, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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
import { galleryApi } from '@/lib/api';
import AdminLayout from '@/components/admin/AdminLayout';
import { useLanguage } from '@/contexts/LanguageContext';

interface GalleryItem {
  id: string;
  title_uz: string;
  title_ru: string;
  title_en: string;
  image_url: string;
  category: string;
  published: boolean;
  created_at: string;
}

const GalleryAdmin: React.FC = () => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<GalleryItem | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [published, setPublished] = useState(true);

  const { toast } = useToast();
  const { language, t } = useLanguage();
  const queryClient = useQueryClient();

  const { data: gallery, isLoading } = useQuery({
    queryKey: ['admin-gallery'],
    queryFn: async () => {
      const response = await galleryApi.getAll();
      if (response.success) {
        return response.data as GalleryItem[];
      }
      return [];
    },
  });

  const saveMutation = useMutation({
    mutationFn: async (item: Partial<GalleryItem>) => {
      if (editingItem?.id) {
        return galleryApi.update(editingItem.id, item);
      } else {
        return galleryApi.create(item);
      }
    },
    onSuccess: (response) => {
      if (response.success) {
        queryClient.invalidateQueries({ queryKey: ['admin-gallery'] });
        queryClient.invalidateQueries({ queryKey: ['gallery'] });
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
      return galleryApi.delete(id);
    },
    onSuccess: (response) => {
      if (response.success) {
        queryClient.invalidateQueries({ queryKey: ['admin-gallery'] });
        queryClient.invalidateQueries({ queryKey: ['gallery'] });
        setDeleteDialogOpen(false);
        setDeletingId(null);
        toast({ title: t('deleted'), description: t('deleted') });
      }
    },
  });

  const togglePublished = useMutation({
    mutationFn: async ({ id, published }: { id: string; published: boolean }) => {
      return galleryApi.update(id, { published });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-gallery'] });
      queryClient.invalidateQueries({ queryKey: ['gallery'] });
    },
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const item = {
      title_uz: formData.get('title_uz') as string,
      title_ru: formData.get('title_ru') as string,
      title_en: formData.get('title_en') as string,
      image_url: formData.get('image_url') as string,
      category: formData.get('category') as string || 'general',
      published: published,
    };

    saveMutation.mutate(item);
  };

  const handleOpenDialog = (item?: GalleryItem) => {
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

  const getTitle = (item: GalleryItem) => {
    if (language === 'uz') return item.title_uz;
    if (language === 'ru') return item.title_ru;
    return item.title_en;
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-display font-bold">{t('adminGallery')}</h1>
            <p className="text-muted-foreground">{t('gallery')}</p>
          </div>
          <Dialog open={dialogOpen} onOpenChange={handleCloseDialog}>
            <DialogTrigger asChild>
              <Button onClick={() => handleOpenDialog()}>
                <Plus className="w-4 h-4 mr-2" />
                {t('add')}
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>{editingItem ? t('edit') : t('add')}</DialogTitle>
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

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="image_url">{t('imageUrl')} *</Label>
                    <Input id="image_url" name="image_url" defaultValue={editingItem?.image_url} required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="category">{t('category')}</Label>
                    <Input id="category" name="category" defaultValue={editingItem?.category || 'general'} />
                  </div>
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

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {gallery?.map((item) => (
              <Card key={item.id} className="overflow-hidden group">
                <div className="relative aspect-square">
                  <img src={item.image_url} alt={getTitle(item)} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <Button variant="secondary" size="icon" onClick={() => handleOpenDialog(item)}>
                      <Pencil className="w-4 h-4" />
                    </Button>
                    <Button variant="secondary" size="icon" onClick={() => { setDeletingId(item.id); setDeleteDialogOpen(true); }}>
                      <Trash2 className="w-4 h-4 text-destructive" />
                    </Button>
                    <Button variant="secondary" size="icon" onClick={() => togglePublished.mutate({ id: item.id, published: !item.published })}>
                      {item.published ? <Eye className="w-4 h-4 text-green-500" /> : <EyeOff className="w-4 h-4" />}
                    </Button>
                  </div>
                </div>
                <CardContent className="p-2">
                  <p className="text-sm font-medium truncate">{getTitle(item)}</p>
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
      </div>
    </AdminLayout>
  );
};

export default GalleryAdmin;
