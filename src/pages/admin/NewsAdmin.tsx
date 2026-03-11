// ============================================
// NEWS ADMIN PAGE
// ============================================
// Yangiliklar boshqaruvi
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
import { newsApi, uploadApi } from '@/lib/api';
import AdminLayout from '@/components/admin/AdminLayout';
import { useLanguage } from '@/contexts/LanguageContext';

interface NewsItem {
  id: string;
  title_uz: string;
  title_ru: string;
  title_en: string;
  content_uz: string;
  content_ru: string;
  content_en: string;
  category: string;
  image_url: string | null;
  published: boolean;
  created_at: string;
  updated_at: string;
}

const NewsAdmin: React.FC = () => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<NewsItem | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [clearAllDialogOpen, setClearAllDialogOpen] = useState(false);
  const [published, setPublished] = useState(true);
  const [imageUrl, setImageUrl] = useState('');
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { toast } = useToast();
  const { language, t } = useLanguage();
  const queryClient = useQueryClient();

  // Ma'lumotlarni olish
  const { data: news, isLoading } = useQuery({
    queryKey: ['admin-news'],
    queryFn: async () => {
      const response = await newsApi.getAll();
      if (response.success) {
        return response.data as NewsItem[];
      }
      return [];
    },
  });

  // Saqlash mutation
  const saveMutation = useMutation({
    mutationFn: async (item: Partial<NewsItem>) => {
      if (editingItem?.id) {
        return newsApi.update(editingItem.id, item);
      } else {
        return newsApi.create(item);
      }
    },
    onSuccess: (response) => {
      if (response.success) {
        queryClient.invalidateQueries({ queryKey: ['admin-news'] });
        queryClient.invalidateQueries({ queryKey: ['news'] });
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

  // O'chirish mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      return newsApi.delete(id);
    },
    onSuccess: (response) => {
      if (response.success) {
        queryClient.invalidateQueries({ queryKey: ['admin-news'] });
        queryClient.invalidateQueries({ queryKey: ['news'] });
        setDeleteDialogOpen(false);
        setDeletingId(null);
        toast({
          title: t('deleted'),
          description: t('deleted'),
        });
      }
    },
  });

  // Published toggle mutation
  const togglePublished = useMutation({
    mutationFn: async ({ id, published }: { id: string; published: boolean }) => {
      return newsApi.update(id, { published });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-news'] });
      queryClient.invalidateQueries({ queryKey: ['news'] });
    },
  });

  // Hammasini o'chirish mutation
  const clearAllMutation = useMutation({
    mutationFn: async () => {
      return newsApi.clearAll();
    },
    onSuccess: (response) => {
      if (response.success) {
        queryClient.invalidateQueries({ queryKey: ['admin-news'] });
        queryClient.invalidateQueries({ queryKey: ['news'] });
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
      content_uz: formData.get('content_uz') as string,
      content_ru: formData.get('content_ru') as string,
      content_en: formData.get('content_en') as string,
      category: formData.get('category') as string || 'general',
      image_url: imageUrl || null,
      published: published,
    };

    saveMutation.mutate(item);
  };

  const handleOpenDialog = (item?: NewsItem) => {
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

  const getTitle = (item: NewsItem) => {
    if (language === 'uz') return item.title_uz;
    if (language === 'ru') return item.title_ru;
    return item.title_en;
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-display font-bold">{t('adminNews')}</h1>
            <p className="text-muted-foreground">{t('news')}</p>
          </div>
          <div className="flex items-center gap-2">
            {news && news.length > 0 && (
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
                    <Label htmlFor="content_uz">{t('descriptionUz')}</Label>
                    <Textarea
                      id="content_uz"
                      name="content_uz"
                      rows={4}
                      defaultValue={editingItem?.content_uz}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="content_ru">{t('descriptionRu')}</Label>
                    <Textarea
                      id="content_ru"
                      name="content_ru"
                      rows={4}
                      defaultValue={editingItem?.content_ru}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="content_en">{t('descriptionEn')}</Label>
                    <Textarea
                      id="content_en"
                      name="content_en"
                      rows={4}
                      defaultValue={editingItem?.content_en}
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="category">{t('category')}</Label>
                      <Input
                        id="category"
                        name="category"
                        defaultValue={editingItem?.category || 'general'}
                      />
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
                  </div>

                  <div className="flex items-center gap-2">
                    <Switch
                      id="published"
                      checked={published}
                      onCheckedChange={setPublished}
                    />
                    <Label htmlFor="published">{t('publish')}</Label>
                  </div>

                  <div className="flex justify-end gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleCloseDialog}
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
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {news?.map((item) => (
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
                  <p className="text-sm text-muted-foreground mb-4">
                    {new Date(item.created_at).toLocaleDateString()}
                  </p>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleOpenDialog(item)}
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

        <AlertDialog open={clearAllDialogOpen} onOpenChange={setClearAllDialogOpen}>
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

export default NewsAdmin;
