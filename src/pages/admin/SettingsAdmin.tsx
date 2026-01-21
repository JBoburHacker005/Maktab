// ============================================
// SETTINGS ADMIN PAGE
// ============================================
// Sayt sozlamalari boshqaruvi
// Hero, Header, Footer, Contact
// ============================================

import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Loader2, Save, Settings, Home, Menu, FileText, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { settingsApi } from '@/lib/api';
import AdminLayout from '@/components/admin/AdminLayout';

interface SettingsData {
    hero: {
        title_uz: string;
        title_ru: string;
        title_en: string;
        subtitle_uz: string;
        subtitle_ru: string;
        subtitle_en: string;
        background_image: string | null;
    };
    header: {
        logo: string | null;
        phone: string;
        email: string;
    };
    footer: {
        address_uz: string;
        address_ru: string;
        address_en: string;
        social_links: {
            telegram: string;
            instagram: string;
            facebook: string;
            youtube: string;
        };
    };
    contact: {
        phone: string;
        email: string;
        address_uz: string;
        address_ru: string;
        address_en: string;
        map_embed: string;
        working_hours_uz: string;
        working_hours_ru: string;
        working_hours_en: string;
    };
}

const SettingsAdmin: React.FC = () => {
    const { toast } = useToast();
    const queryClient = useQueryClient();

    const { data: settings, isLoading } = useQuery({
        queryKey: ['admin-settings'],
        queryFn: async () => {
            const response = await settingsApi.getAll();
            if (response.success) {
                return response.data as SettingsData;
            }
            return null;
        },
    });

    const updateMutation = useMutation({
        mutationFn: async ({ section, data }: { section: string; data: any }) => {
            return settingsApi.updateSection(section, data);
        },
        onSuccess: (response) => {
            if (response.success) {
                queryClient.invalidateQueries({ queryKey: ['admin-settings'] });
                queryClient.invalidateQueries({ queryKey: ['settings'] });
                toast({
                    title: 'Muvaffaqiyat',
                    description: 'Sozlamalar saqlandi',
                });
            } else {
                toast({
                    variant: 'destructive',
                    title: 'Xato',
                    description: response.message,
                });
            }
        },
        onError: (error: Error) => {
            toast({
                variant: 'destructive',
                title: 'Xato',
                description: error.message,
            });
        },
    });

    const handleHeroSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        updateMutation.mutate({
            section: 'hero',
            data: {
                title_uz: formData.get('title_uz'),
                title_ru: formData.get('title_ru'),
                title_en: formData.get('title_en'),
                subtitle_uz: formData.get('subtitle_uz'),
                subtitle_ru: formData.get('subtitle_ru'),
                subtitle_en: formData.get('subtitle_en'),
                background_image: formData.get('background_image') || null,
            },
        });
    };

    const handleHeaderSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        updateMutation.mutate({
            section: 'header',
            data: {
                logo: formData.get('logo') || null,
                phone: formData.get('phone'),
                email: formData.get('email'),
            },
        });
    };

    const handleFooterSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        updateMutation.mutate({
            section: 'footer',
            data: {
                address_uz: formData.get('address_uz'),
                address_ru: formData.get('address_ru'),
                address_en: formData.get('address_en'),
                social_links: {
                    telegram: formData.get('telegram'),
                    instagram: formData.get('instagram'),
                    facebook: formData.get('facebook'),
                    youtube: formData.get('youtube'),
                },
            },
        });
    };

    const handleContactSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        updateMutation.mutate({
            section: 'contact',
            data: {
                phone: formData.get('phone'),
                email: formData.get('email'),
                address_uz: formData.get('address_uz'),
                address_ru: formData.get('address_ru'),
                address_en: formData.get('address_en'),
                map_embed: formData.get('map_embed'),
                working_hours_uz: formData.get('working_hours_uz'),
                working_hours_ru: formData.get('working_hours_ru'),
                working_hours_en: formData.get('working_hours_en'),
            },
        });
    };

    if (isLoading) {
        return (
            <AdminLayout>
                <div className="flex items-center justify-center py-12">
                    <Loader2 className="w-8 h-8 animate-spin text-primary" />
                </div>
            </AdminLayout>
        );
    }

    return (
        <AdminLayout>
            <div className="space-y-6">
                <div>
                    <h1 className="text-2xl font-display font-bold flex items-center gap-2">
                        <Settings className="w-6 h-6" />
                        Sayt Sozlamalari
                    </h1>
                    <p className="text-muted-foreground">Hero, Header, Footer va Contact sozlamalari</p>
                </div>

                <Tabs defaultValue="hero" className="space-y-6">
                    <TabsList className="grid w-full grid-cols-4">
                        <TabsTrigger value="hero" className="flex items-center gap-2">
                            <Home className="w-4 h-4" />
                            Hero
                        </TabsTrigger>
                        <TabsTrigger value="header" className="flex items-center gap-2">
                            <Menu className="w-4 h-4" />
                            Header
                        </TabsTrigger>
                        <TabsTrigger value="footer" className="flex items-center gap-2">
                            <FileText className="w-4 h-4" />
                            Footer
                        </TabsTrigger>
                        <TabsTrigger value="contact" className="flex items-center gap-2">
                            <Phone className="w-4 h-4" />
                            Contact
                        </TabsTrigger>
                    </TabsList>

                    {/* Hero Settings */}
                    <TabsContent value="hero">
                        <Card>
                            <CardHeader>
                                <CardTitle>Hero Section</CardTitle>
                                <CardDescription>Bosh sahifadagi Hero qismi sozlamalari</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <form onSubmit={handleHeroSubmit} className="space-y-4">
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="title_uz">Sarlavha (UZ)</Label>
                                            <Input id="title_uz" name="title_uz" defaultValue={settings?.hero?.title_uz} />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="title_ru">Sarlavha (RU)</Label>
                                            <Input id="title_ru" name="title_ru" defaultValue={settings?.hero?.title_ru} />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="title_en">Sarlavha (EN)</Label>
                                            <Input id="title_en" name="title_en" defaultValue={settings?.hero?.title_en} />
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="subtitle_uz">Qism sarlavha (UZ)</Label>
                                            <Input id="subtitle_uz" name="subtitle_uz" defaultValue={settings?.hero?.subtitle_uz} />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="subtitle_ru">Qism sarlavha (RU)</Label>
                                            <Input id="subtitle_ru" name="subtitle_ru" defaultValue={settings?.hero?.subtitle_ru} />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="subtitle_en">Qism sarlavha (EN)</Label>
                                            <Input id="subtitle_en" name="subtitle_en" defaultValue={settings?.hero?.subtitle_en} />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="background_image">Background rasm URL</Label>
                                        <Input id="background_image" name="background_image" defaultValue={settings?.hero?.background_image || ''} />
                                    </div>
                                    <Button type="submit" disabled={updateMutation.isPending}>
                                        {updateMutation.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                                        <Save className="w-4 h-4 mr-2" />
                                        Saqlash
                                    </Button>
                                </form>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* Header Settings */}
                    <TabsContent value="header">
                        <Card>
                            <CardHeader>
                                <CardTitle>Header</CardTitle>
                                <CardDescription>Sayt header sozlamalari</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <form onSubmit={handleHeaderSubmit} className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="logo">Logo URL</Label>
                                        <Input id="logo" name="logo" defaultValue={settings?.header?.logo || ''} />
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="phone">Telefon</Label>
                                            <Input id="phone" name="phone" defaultValue={settings?.header?.phone} />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="email">Email</Label>
                                            <Input id="email" name="email" type="email" defaultValue={settings?.header?.email} />
                                        </div>
                                    </div>
                                    <Button type="submit" disabled={updateMutation.isPending}>
                                        {updateMutation.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                                        <Save className="w-4 h-4 mr-2" />
                                        Saqlash
                                    </Button>
                                </form>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* Footer Settings */}
                    <TabsContent value="footer">
                        <Card>
                            <CardHeader>
                                <CardTitle>Footer</CardTitle>
                                <CardDescription>Sayt footer sozlamalari</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <form onSubmit={handleFooterSubmit} className="space-y-4">
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="address_uz">Manzil (UZ)</Label>
                                            <Textarea id="address_uz" name="address_uz" rows={2} defaultValue={settings?.footer?.address_uz} />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="address_ru">Manzil (RU)</Label>
                                            <Textarea id="address_ru" name="address_ru" rows={2} defaultValue={settings?.footer?.address_ru} />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="address_en">Manzil (EN)</Label>
                                            <Textarea id="address_en" name="address_en" rows={2} defaultValue={settings?.footer?.address_en} />
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="telegram">Telegram</Label>
                                            <Input id="telegram" name="telegram" defaultValue={settings?.footer?.social_links?.telegram} />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="instagram">Instagram</Label>
                                            <Input id="instagram" name="instagram" defaultValue={settings?.footer?.social_links?.instagram} />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="facebook">Facebook</Label>
                                            <Input id="facebook" name="facebook" defaultValue={settings?.footer?.social_links?.facebook} />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="youtube">YouTube</Label>
                                            <Input id="youtube" name="youtube" defaultValue={settings?.footer?.social_links?.youtube} />
                                        </div>
                                    </div>
                                    <Button type="submit" disabled={updateMutation.isPending}>
                                        {updateMutation.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                                        <Save className="w-4 h-4 mr-2" />
                                        Saqlash
                                    </Button>
                                </form>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* Contact Settings */}
                    <TabsContent value="contact">
                        <Card>
                            <CardHeader>
                                <CardTitle>Contact</CardTitle>
                                <CardDescription>Aloqa sahifasi sozlamalari</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <form onSubmit={handleContactSubmit} className="space-y-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="contact_phone">Telefon</Label>
                                            <Input id="contact_phone" name="phone" defaultValue={settings?.contact?.phone} />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="contact_email">Email</Label>
                                            <Input id="contact_email" name="email" type="email" defaultValue={settings?.contact?.email} />
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="contact_address_uz">Manzil (UZ)</Label>
                                            <Textarea id="contact_address_uz" name="address_uz" rows={2} defaultValue={settings?.contact?.address_uz} />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="contact_address_ru">Manzil (RU)</Label>
                                            <Textarea id="contact_address_ru" name="address_ru" rows={2} defaultValue={settings?.contact?.address_ru} />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="contact_address_en">Manzil (EN)</Label>
                                            <Textarea id="contact_address_en" name="address_en" rows={2} defaultValue={settings?.contact?.address_en} />
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="working_hours_uz">Ish vaqti (UZ)</Label>
                                            <Input id="working_hours_uz" name="working_hours_uz" defaultValue={settings?.contact?.working_hours_uz} />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="working_hours_ru">Ish vaqti (RU)</Label>
                                            <Input id="working_hours_ru" name="working_hours_ru" defaultValue={settings?.contact?.working_hours_ru} />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="working_hours_en">Ish vaqti (EN)</Label>
                                            <Input id="working_hours_en" name="working_hours_en" defaultValue={settings?.contact?.working_hours_en} />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="map_embed">Google Maps Embed HTML</Label>
                                        <Textarea id="map_embed" name="map_embed" rows={3} defaultValue={settings?.contact?.map_embed} placeholder="<iframe src='...'></iframe>" />
                                    </div>
                                    <Button type="submit" disabled={updateMutation.isPending}>
                                        {updateMutation.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                                        <Save className="w-4 h-4 mr-2" />
                                        Saqlash
                                    </Button>
                                </form>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>
        </AdminLayout>
    );
};

export default SettingsAdmin;
