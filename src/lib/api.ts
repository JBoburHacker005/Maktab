// ============================================
// API CLIENT
// ============================================
// Supabase o'rniga Express backend bilan ishlash
// Barcha API so'rovlari uchun yagona client
// ============================================

// API base URL (development va production uchun)
const API_BASE_URL = import.meta.env.VITE_API_URL || '';

/**
 * Token olish localStorage dan
 */
const getToken = (): string | null => {
  return localStorage.getItem('admin_token');
};

/**
 * Token saqlash
 */
export const setToken = (token: string): void => {
  localStorage.setItem('admin_token', token);
};

/**
 * Token o'chirish
 */
export const removeToken = (): void => {
  localStorage.removeItem('admin_token');
};

/**
 * API so'rov yuborish
 */
const request = async <T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<{ success: boolean; data?: T; message?: string; count?: number }> => {
  const token = getToken();

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        message: data.message || 'Xatolik yuz berdi',
      };
    }

    return data;
  } catch (error) {
    console.error('API request error:', error);
    return {
      success: false,
      message: 'Server bilan bog\'lanib bo\'lmadi',
    };
  }
};

// ============================================
// AUTH API
// ============================================

export const authApi = {
  login: async (username: string, password: string) => {
    return request<{ user: any; token: string }>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    });
  },

  getMe: async () => {
    return request<{ user: any }>('/api/auth/me');
  },

  logout: async () => {
    removeToken();
    return request('/api/auth/logout', { method: 'POST' });
  },
};

// ============================================
// NEWS API
// ============================================

export const newsApi = {
  getAll: async (published?: boolean) => {
    const query = published !== undefined ? `?published=${published}` : '';
    return request<any[]>(`/api/news${query}`);
  },

  getById: async (id: string) => {
    return request<any>(`/api/news/${id}`);
  },

  create: async (data: any) => {
    return request<any>('/api/news', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  update: async (id: string, data: any) => {
    return request<any>(`/api/news/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  delete: async (id: string) => {
    return request(`/api/news/${id}`, { method: 'DELETE' });
  },

  clearAll: async () => {
    return request('/api/news', { method: 'DELETE' });
  },
};

// ============================================
// EVENTS API
// ============================================

export const eventsApi = {
  getAll: async (published?: boolean) => {
    const query = published !== undefined ? `?published=${published}` : '';
    return request<any[]>(`/api/events${query}`);
  },

  getById: async (id: string) => {
    return request<any>(`/api/events/${id}`);
  },

  create: async (data: any) => {
    return request<any>('/api/events', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  update: async (id: string, data: any) => {
    return request<any>(`/api/events/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  delete: async (id: string) => {
    return request(`/api/events/${id}`, { method: 'DELETE' });
  },

  clearAll: async () => {
    return request('/api/events', { method: 'DELETE' });
  },
};

// ============================================
// GALLERY API
// ============================================

export const galleryApi = {
  getAll: async (published?: boolean, category?: string) => {
    const params = new URLSearchParams();
    if (published !== undefined) params.append('published', String(published));
    if (category) params.append('category', category);
    const query = params.toString() ? `?${params.toString()}` : '';
    return request<any[]>(`/api/gallery${query}`);
  },

  getById: async (id: string) => {
    return request<any>(`/api/gallery/${id}`);
  },

  create: async (data: any) => {
    return request<any>('/api/gallery', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  update: async (id: string, data: any) => {
    return request<any>(`/api/gallery/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  delete: async (id: string) => {
    return request(`/api/gallery/${id}`, { method: 'DELETE' });
  },

  clearAll: async () => {
    return request('/api/gallery', { method: 'DELETE' });
  },
};

// ============================================
// TEACHERS API
// ============================================

export const teachersApi = {
  getAll: async (published?: boolean) => {
    const query = published !== undefined ? `?published=${published}` : '';
    return request<any[]>(`/api/teachers${query}`);
  },

  getById: async (id: string) => {
    return request<any>(`/api/teachers/${id}`);
  },

  create: async (data: any) => {
    return request<any>('/api/teachers', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  update: async (id: string, data: any) => {
    return request<any>(`/api/teachers/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  delete: async (id: string) => {
    return request(`/api/teachers/${id}`, { method: 'DELETE' });
  },

  clearAll: async () => {
    return request('/api/teachers', { method: 'DELETE' });
  },
};

// ============================================
// DEPARTMENTS API
// ============================================

export const departmentsApi = {
  getAll: async (published?: boolean) => {
    const query = published !== undefined ? `?published=${published}` : '';
    return request<any[]>(`/api/departments${query}`);
  },

  getById: async (id: string) => {
    return request<any>(`/api/departments/${id}`);
  },

  create: async (data: any) => {
    return request<any>('/api/departments', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  update: async (id: string, data: any) => {
    return request<any>(`/api/departments/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  delete: async (id: string) => {
    return request(`/api/departments/${id}`, { method: 'DELETE' });
  },

  clearAll: async () => {
    return request('/api/departments', { method: 'DELETE' });
  },
};

// ============================================
// SETTINGS API
// ============================================

export const settingsApi = {
  getAll: async () => {
    return request<any>('/api/settings');
  },

  getSection: async (section: string) => {
    return request<any>(`/api/settings/${section}`);
  },

  updateAll: async (data: any) => {
    return request<any>('/api/settings', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  updateSection: async (section: string, data: any) => {
    return request<any>(`/api/settings/${section}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },
};

// ============================================
// UPLOAD API
// ============================================

export const uploadApi = {
  uploadImage: async (image: string, filename?: string) => {
    return request<{ url: string; filename: string }>('/api/upload', {
      method: 'POST',
      body: JSON.stringify({ image, filename }),
    });
  },

  uploadFromUrl: async (url: string) => {
    return request<{ url: string; filename: string }>('/api/upload/url', {
      method: 'POST',
      body: JSON.stringify({ url }),
    });
  },

  deleteImage: async (filename: string) => {
    return request(`/api/upload/${filename}`, { method: 'DELETE' });
  },
};

// ============================================
// CONTACT API
// ============================================

export const contactApi = {
  submit: async (data: { name: string; email: string; subject: string; message: string }) => {
    return request('/api/contact', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },
};

// ============================================
// STATS API (Dashboard uchun)
// ============================================

export const statsApi = {
  getStats: async () => {
    // Faqat published ma'lumotlarni olish (saytda ko'rinadiganlar)
    const [news, events, gallery, teachers, departments] = await Promise.all([
      newsApi.getAll(), // barcha yangiliklar
      eventsApi.getAll(), // barcha tadbirlar
      galleryApi.getAll(), // barcha rasmlar
      teachersApi.getAll(), // barcha o'qituvchilar
      departmentsApi.getAll(), // barcha bo'limlar
    ]);

    // Ma'lumotlarni tartiblash (eng yangi birinchi)
    const sortedNews = (news.data || []).sort((a: any, b: any) => {
      const dateA = new Date(a.created_at || 0).getTime();
      const dateB = new Date(b.created_at || 0).getTime();
      return dateB - dateA;
    });

    return {
      news: news.data?.length || 0,
      events: events.data?.length || 0,
      gallery: gallery.data?.length || 0,
      teachers: teachers.data?.length || 0,
      departments: departments.data?.length || 0,
      recentNews: sortedNews.slice(0, 5),
    };
  },
};

export default {
  auth: authApi,
  news: newsApi,
  events: eventsApi,
  gallery: galleryApi,
  teachers: teachersApi,
  departments: departmentsApi,
  settings: settingsApi,
  upload: uploadApi,
  contact: contactApi,
  stats: statsApi,
  setToken,
  removeToken,
};
