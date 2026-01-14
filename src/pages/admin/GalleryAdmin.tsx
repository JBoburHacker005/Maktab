import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Trash2, Eye, EyeOff, Loader2, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
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
import { supabase } from '@/integrations/supabase/client';
import AdminLayout from '@/components/admin/AdminLayout';
import { useLanguage } from '@/contexts/LanguageContext';
import { Tables, TablesInsert, TablesUpdate } from '@/integrations/supabase/types';
import AddGalleryImages from './AddGalleryImages';

type GalleryRow = Tables<'gallery'>;
type GalleryInsert = TablesInsert<'gallery'>;

const GalleryAdmin: React.FC = () => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string>('');

  const { toast } = useToast();
  const { language, t } = useLanguage();
  const queryClient = useQueryClient();

  const { data: gallery, isLoading } = useQuery({
    queryKey: ['admin-gallery'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('gallery')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as GalleryRow[];
    },
  });

  const saveMutation = useMutation({
    mutationFn: async (item: GalleryInsert) => {
      const { error } = await supabase.from('gallery').insert([item]);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-gallery'] });
      setDialogOpen(false);
      setPreviewUrl('');
      toast({
        title: t('success'),
        description: t('added'),
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
      const { error } = await supabase.from('gallery').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-gallery'] });
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
        .from('gallery')
        .update({ published })
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-gallery'] });
    },
  });

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = `gallery/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('uploads')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: urlData } = supabase.storage
        .from('uploads')
        .getPublicUrl(filePath);

      setPreviewUrl(urlData.publicUrl);
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: t('error'),
        description: error.message,
      });
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const imageUrl = previewUrl || (formData.get('image_url') as string);
    if (!imageUrl) {
      toast({
        variant: 'destructive',
        title: t('error'),
        description: 'Image URL is required',
      });
      return;
    }

    const item: GalleryInsert = {
      title_uz: formData.get('title_uz') as string,
      title_ru: formData.get('title_ru') as string,
      title_en: formData.get('title_en') as string,
      image_url: imageUrl,
      category: formData.get('category') as string || 'general',
      published: formData.get('published') === 'on',
    };

    saveMutation.mutate(item);
  };

  const getTitle = (item: GalleryRow) => {
    if (language === 'uz') return item.title_uz;
    if (language === 'ru') return item.title_ru;
    return item.title_en;
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-display font-bold">{t('adminGallery')}</h1>
            <p className="text-muted-foreground">{t('gallery')}</p>
          </div>
          <div className="flex items-center gap-2">
            <AddGalleryImages />
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                {t('add')}
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg">
              <DialogHeader>
                <DialogTitle>{t('add')}</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label>{t('imageUrl')}</Label>
                  <div className="border-2 border-dashed border-border rounded-lg p-4 text-center">
                    {previewUrl ? (
                      <img
                        src={previewUrl}
                        alt="Preview"
                        className="w-full h-40 object-cover rounded-lg mb-2"
                      />
                    ) : (
                      <Upload className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                    )}
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      disabled={uploading}
                      className="hidden"
                      id="file-upload"
                    />
                    <Label
                      htmlFor="file-upload"
                      className="cursor-pointer text-primary hover:underline"
                    >
                      {uploading ? 'Loading...' : 'Select image'}
                    </Label>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="image_url">Or enter URL</Label>
                  <Input
                    id="image_url"
                    name="image_url"
                    placeholder="https://..."
                    disabled={!!previewUrl}
                  />
                </div>

                <div className="grid grid-cols-1 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="title_uz">{t('titleUz')}</Label>
                    <Input id="title_uz" name="title_uz" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="title_ru">{t('titleRu')}</Label>
                    <Input id="title_ru" name="title_ru" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="title_en">{t('titleEn')}</Label>
                    <Input id="title_en" name="title_en" required />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="category">{t('category')}</Label>
                  <Input id="category" name="category" defaultValue="general" />
                </div>

                <div className="flex items-center gap-2">
                  <Switch id="published" name="published" />
                  <Label htmlFor="published">{t('publish')}</Label>
                </div>

                <div className="flex justify-end gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setDialogOpen(false);
                      setPreviewUrl('');
                    }}
                  >
                    {t('cancel')}
                  </Button>
                  <Button type="submit" disabled={saveMutation.isPending || uploading}>
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
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {gallery?.map((item) => (
              <Card key={item.id} className="overflow-hidden group">
                <div className="relative aspect-square">
                  <img
                    src={item.image_url}
                    alt={getTitle(item)}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-foreground/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <Button
                      variant="secondary"
                      size="icon"
                      onClick={() =>
                        togglePublished.mutate({
                          id: item.id,
                          published: !item.published,
                        })
                      }
                    >
                      {item.published ? (
                        <Eye className="w-4 h-4" />
                      ) : (
                        <EyeOff className="w-4 h-4" />
                      )}
                    </Button>
                    <Button
                      variant="destructive"
                      size="icon"
                      onClick={() => {
                        setDeletingId(item.id);
                        setDeleteDialogOpen(true);
                      }}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                <CardContent className="p-3">
                  <p className="text-sm font-medium truncate">{getTitle(item)}</p>
                  <p className="text-xs text-muted-foreground">{item.category}</p>
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

export default GalleryAdmin;
