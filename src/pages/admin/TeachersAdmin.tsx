// ============================================
// TEACHERS ADMIN PAGE
// ============================================
// O'qituvchilar boshqaruvi
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
import { teachersApi, uploadApi } from '@/lib/api';
import AdminLayout from '@/components/admin/AdminLayout';
import { useLanguage } from '@/contexts/LanguageContext';

interface TeacherItem {
  id: string;
  name: string;
  subject_uz: string;
  subject_ru: string;
  subject_en: string;
  bio_uz: string | null;
  bio_ru: string | null;
  bio_en: string | null;
  image_url: string | null;
  email: string | null;
  phone: string | null;
  published: boolean;
  created_at: string;
}

const TeachersAdmin: React.FC = () => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [clearAllDialogOpen, setClearAllDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<TeacherItem | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [published, setPublished] = useState(true);
  const [imageUrl, setImageUrl] = useState('');
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { toast } = useToast();
  const { language, t } = useLanguage();
  const queryClient = useQueryClient();

  const { data: teachers, isLoading } = useQuery({
    queryKey: ['admin-teachers'],
    queryFn: async () => {
      const response = await teachersApi.getAll();
      if (response.success) {
        return response.data as TeacherItem[];
      }
      return [];
    },
  });

  const saveMutation = useMutation({
    mutationFn: async (item: Partial<TeacherItem>) => {
      if (editingItem?.id) {
        return teachersApi.update(editingItem.id, item);
      } else {
        return teachersApi.create(item);
      }
    },
    onSuccess: (response) => {
      if (response.success) {
        queryClient.invalidateQueries({ queryKey: ['admin-teachers'] });
        queryClient.invalidateQueries({ queryKey: ['teachers'] });
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
      return teachersApi.delete(id);
    },
    onSuccess: (response) => {
      if (response.success) {
        queryClient.invalidateQueries({ queryKey: ['admin-teachers'] });
        queryClient.invalidateQueries({ queryKey: ['teachers'] });
        setDeleteDialogOpen(false);
        setDeletingId(null);
        toast({ title: t('deleted'), description: t('deleted') });
      }
    },
  });

  const togglePublished = useMutation({
    mutationFn: async ({ id, published }: { id: string; published: boolean }) => {
      return teachersApi.update(id, { published });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-teachers'] });
      queryClient.invalidateQueries({ queryKey: ['teachers'] });
    },
  });

  const clearAllMutation = useMutation({
    mutationFn: async () => {
      return teachersApi.clearAll();
    },
    onSuccess: (response) => {
      if (response.success) {
        queryClient.invalidateQueries({ queryKey: ['admin-teachers'] });
        queryClient.invalidateQueries({ queryKey: ['teachers'] });
        setClearAllDialogOpen(false);
        toast({ title: t('deleted'), description: t('deleted') });
      }
    },
    onError: (error: Error) => {
      toast({ variant: 'destructive', title: t('error'), description: error.message });
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
      name: formData.get('name') as string,
      subject_uz: formData.get('subject_uz') as string,
      subject_ru: formData.get('subject_ru') as string,
      subject_en: formData.get('subject_en') as string,
      bio_uz: formData.get('bio_uz') as string || null,
      bio_ru: formData.get('bio_ru') as string || null,
      bio_en: formData.get('bio_en') as string || null,
      image_url: imageUrl || formData.get('image_url') as string || null,
      email: formData.get('email') as string || null,
      phone: formData.get('phone') as string || null,
      published: published,
    };

    saveMutation.mutate(item);
  };

  const handleOpenDialog = (item?: TeacherItem) => {
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

  const getSubject = (item: TeacherItem) => {
    if (language === 'uz') return item.subject_uz;
    if (language === 'ru') return item.subject_ru;
    return item.subject_en;
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-display font-bold">{t('adminTeachers')}</h1>
            <p className="text-muted-foreground">{t('teachers')}</p>
          </div>
          <div className="flex items-center gap-2">
            {teachers && teachers.length > 0 && (
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
                  <div className="space-y-2">
                    <Label htmlFor="name">Ism *</Label>
                    <Input id="name" name="name" defaultValue={editingItem?.name} required />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="subject_uz">Fan (UZ) *</Label>
                      <Input id="subject_uz" name="subject_uz" defaultValue={editingItem?.subject_uz} required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="subject_ru">Fan (RU) *</Label>
                      <Input id="subject_ru" name="subject_ru" defaultValue={editingItem?.subject_ru} required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="subject_en">Fan (EN) *</Label>
                      <Input id="subject_en" name="subject_en" defaultValue={editingItem?.subject_en} required />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="bio_uz">Biografiya (UZ)</Label>
                    <Textarea id="bio_uz" name="bio_uz" rows={2} defaultValue={editingItem?.bio_uz || ''} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="bio_ru">Biografiya (RU)</Label>
                    <Textarea id="bio_ru" name="bio_ru" rows={2} defaultValue={editingItem?.bio_ru || ''} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="bio_en">Biografiya (EN)</Label>
                    <Textarea id="bio_en" name="bio_en" rows={2} defaultValue={editingItem?.bio_en || ''} />
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
                      <img src={imageUrl} alt="Preview" className="w-20 h-20 object-cover rounded-full mt-2" />
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input id="email" name="email" type="email" defaultValue={editingItem?.email || ''} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Telefon</Label>
                      <Input id="phone" name="phone" defaultValue={editingItem?.phone || ''} />
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
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {teachers?.map((item) => (
              <Card key={item.id} className="overflow-hidden">
                {item.image_url && (
                  <img src={item.image_url} alt={item.name} className="w-full h-48 object-cover" />
                )}
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <CardTitle className="text-lg">{item.name}</CardTitle>
                      <p className="text-sm text-muted-foreground">{getSubject(item)}</p>
                    </div>
                    <Button variant="ghost" size="icon" onClick={() => togglePublished.mutate({ id: item.id, published: !item.published })}>
                      {item.published ? <Eye className="w-4 h-4 text-green-500" /> : <EyeOff className="w-4 h-4 text-muted-foreground" />}
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
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

export default TeachersAdmin;
