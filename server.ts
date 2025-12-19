// Railway uchun Express server (Backend API + Telegram Bot)
// Bu fayl Railway deployment uchun ishlatiladi
import express from 'express';
import cors from 'cors';
import { createClient } from '@supabase/supabase-js';

const app = express();

// CORS sozlash - Vercel frontend uchun
const allowedOrigins = [
  process.env.FRONTEND_URL || 'http://localhost:5173',
  process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : '',
  'https://*.vercel.app',
].filter(Boolean);

app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? allowedOrigins 
    : '*', // Development da barcha originlarga ruxsat
  credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// PORT - Railway avtomatik beradi
const PORT = process.env.PORT || 5000;
const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || '';
const SUPABASE_URL = process.env.VITE_SUPABASE_URL || '';
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

// Supabase client
const supabase =
  SUPABASE_URL && SUPABASE_SERVICE_KEY
    ? createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY)
    : null;

// Language translations
const translations = {
  uz: {
    welcome: 'Xush kelibsiz!',
    selectLanguage: 'Tilni tanlang:',
    changeLanguage: 'Tilni o\'zgartirish',
    news: '📰 Yangiliklar',
    events: '📅 Tadbirlar',
    gallery: '🖼 Galereya',
    add: '➕ Qo\'shish',
    back: '⬅️ Orqaga',
    addNews: 'Yangilik qo\'shish',
    addEvent: 'Tadbir qo\'shish',
    addGallery: 'Rasm qo\'shish',
    enterTitle: 'Sarlavha kiriting:',
    enterDescription: 'Tavsif kiriting:',
    enterDate: 'Sana kiriting (YYYY-MM-DD):',
    sendImage: 'Rasm yuboring:',
    enterCaption: 'Rasm uchun izoh kiriting (ixtiyoriy):',
    success: 'Muvaffaqiyatli qo\'shildi!',
    error: 'Xatolik yuz berdi',
    cancel: 'Bekor qilish',
  },
  en: {
    welcome: 'Welcome!',
    selectLanguage: 'Select language:',
    changeLanguage: 'Change Language',
    news: '📰 News',
    events: '📅 Events',
    gallery: '🖼 Gallery',
    add: '➕ Add',
    back: '⬅️ Back',
    addNews: 'Add News',
    addEvent: 'Add Event',
    addGallery: 'Add Image',
    enterTitle: 'Enter title:',
    enterDescription: 'Enter description:',
    enterDate: 'Enter date (YYYY-MM-DD):',
    sendImage: 'Send image:',
    enterCaption: 'Enter caption (optional):',
    success: 'Successfully added!',
    error: 'An error occurred',
    cancel: 'Cancel',
  },
  ru: {
    welcome: 'Добро пожаловать!',
    selectLanguage: 'Выберите язык:',
    changeLanguage: 'Изменить язык',
    news: '📰 Новости',
    events: '📅 События',
    gallery: '🖼 Галерея',
    add: '➕ Добавить',
    back: '⬅️ Назад',
    addNews: 'Добавить новость',
    addEvent: 'Добавить событие',
    addGallery: 'Добавить изображение',
    enterTitle: 'Введите заголовок:',
    enterDescription: 'Введите описание:',
    enterDate: 'Введите дату (YYYY-MM-DD):',
    sendImage: 'Отправьте изображение:',
    enterCaption: 'Введите подпись (необязательно):',
    success: 'Успешно добавлено!',
    error: 'Произошла ошибка',
    cancel: 'Отмена',
  },
};

async function isAdmin(_user: any): Promise<boolean> {
  return true;
}

async function getUserLanguage(telegramUserId: number): Promise<'uz' | 'en' | 'ru'> {
  if (!supabase) return 'uz';
  try {
    const { data } = await supabase
      .from('telegram_user_preferences')
      .select('language')
      .eq('telegram_user_id', telegramUserId)
      .maybeSingle();
    
    return (data?.language as 'uz' | 'en' | 'ru') || 'uz';
  } catch {
    return 'uz';
  }
}

async function saveUserLanguage(telegramUserId: number, language: 'uz' | 'en' | 'ru') {
  if (!supabase) return;
  await supabase
    .from('telegram_user_preferences')
    .upsert({
      telegram_user_id: telegramUserId,
      language,
      updated_at: new Date().toISOString(),
    });
}

async function sendMessage(chatId: number, text: string, replyMarkup?: any) {
  if (!BOT_TOKEN) {
    console.error('BOT_TOKEN is missing!');
    return;
  }
  
  const url = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`;
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text,
        reply_markup: replyMarkup,
        parse_mode: 'HTML',
      }),
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      console.error('Telegram API error:', errorData);
    }
  } catch (error) {
    console.error('Failed to send message:', error);
  }
}

async function handleStart(chatId: number, user: any) {
  const telegramUserId = user.id;
  const t = translations[await getUserLanguage(telegramUserId)];
  
  await sendMessage(chatId, t.welcome + '\n\n' + t.selectLanguage, {
    inline_keyboard: [
      [
        { text: '🇺🇿 Uzbek', callback_data: 'lang_uz' },
        { text: '🇬🇧 English', callback_data: 'lang_en' },
      ],
      [
        { text: '🇷🇺 Russian', callback_data: 'lang_ru' },
      ],
    ],
  });
}

async function showPanels(chatId: number, language: 'uz' | 'en' | 'ru') {
  const t = translations[language];
  
  await sendMessage(chatId, t.selectLanguage, {
    inline_keyboard: [
      [
        { text: t.news, callback_data: 'panel_news' },
        { text: t.events, callback_data: 'panel_events' },
      ],
      [
        { text: t.gallery, callback_data: 'panel_gallery' },
      ],
      [
        { text: t.changeLanguage, callback_data: 'change_lang' },
      ],
    ],
  });
}

async function handleCallback(chatId: number, user: any, data: string, messageId: number) {
  // Endi barcha foydalanuvchilar foydalanishi mumkin
  if (!supabase) {
    await sendMessage(chatId, 'Server sozlanmagan (Supabase env yo\'q).');
    return;
  }
  
  const telegramUserId = user.id;

  if (data.startsWith('lang_')) {
    const lang = data.split('_')[1] as 'uz' | 'en' | 'ru';
    await saveUserLanguage(telegramUserId, lang);
    await showPanels(chatId, lang);
  } else if (data === 'change_lang') {
    const t = translations[await getUserLanguage(telegramUserId)];
    await sendMessage(chatId, t.selectLanguage, {
      inline_keyboard: [
        [
          { text: '🇺🇿 Uzbek', callback_data: 'lang_uz' },
          { text: '🇬🇧 English', callback_data: 'lang_en' },
        ],
        [
          { text: '🇷🇺 Russian', callback_data: 'lang_ru' },
        ],
      ],
    });
  } else if (data.startsWith('panel_')) {
    const panel = data.split('_')[1];
    const language = await getUserLanguage(telegramUserId);
    const t = translations[language];
    
    await supabase
      .from('telegram_user_preferences')
      .upsert({
        telegram_user_id: telegramUserId,
        current_panel: panel,
        language,
      });

    let panelText = '';
    if (panel === 'news') panelText = t.addNews;
    else if (panel === 'events') panelText = t.addEvent;
    else if (panel === 'gallery') panelText = t.addGallery;

    await sendMessage(chatId, panelText, {
      inline_keyboard: [
        [{ text: t.add, callback_data: `add_${panel}` }],
        [{ text: t.back, callback_data: 'back_panels' }],
      ],
    });
  } else if (data.startsWith('add_')) {
    const panel = data.split('_')[1];
    const language = await getUserLanguage(telegramUserId);
    const t = translations[language];
    
    await supabase
      .from('telegram_user_preferences')
      .upsert({
        telegram_user_id: telegramUserId,
        waiting_for: `title_${panel}`,
        current_panel: panel,
        language,
        temp_data: {},
      });

    await sendMessage(chatId, t.enterTitle, {
      inline_keyboard: [[{ text: t.cancel, callback_data: 'cancel' }]],
    });
  } else if (data === 'back_panels') {
    const language = await getUserLanguage(telegramUserId);
    await showPanels(chatId, language);
  } else if (data === 'cancel') {
    const language = await getUserLanguage(telegramUserId);
    await supabase
      .from('telegram_user_preferences')
      .update({ waiting_for: null, temp_data: null })
      .eq('telegram_user_id', telegramUserId);
    await showPanels(chatId, language);
  } else if (data === 'skip_image_news') {
    const { data: prefs } = await supabase
      .from('telegram_user_preferences')
      .select('temp_data, language')
      .eq('telegram_user_id', telegramUserId)
      .maybeSingle();

    const tempData = prefs?.temp_data || {};
    const language = (prefs?.language || 'uz') as 'uz' | 'en' | 'ru';
    const t = translations[language];

    const { error } = await supabase.from('news').insert({
      title_uz: tempData.title,
      title_en: tempData.title,
      title_ru: tempData.title,
      content_uz: tempData.description,
      content_en: tempData.description,
      content_ru: tempData.description,
      published: true,
    });

    await supabase
      .from('telegram_user_preferences')
      .update({ waiting_for: null, temp_data: null })
      .eq('telegram_user_id', telegramUserId);

    if (error) {
      await sendMessage(chatId, t.error);
    } else {
      await sendMessage(chatId, t.success);
      await showPanels(chatId, language);
    }
  } else if (data === 'skip_caption') {
    const { data: prefs } = await supabase
      .from('telegram_user_preferences')
      .select('temp_data, language')
      .eq('telegram_user_id', telegramUserId)
      .maybeSingle();

    const tempData = prefs?.temp_data || {};
    const language = (prefs?.language || 'uz') as 'uz' | 'en' | 'ru';
    const t = translations[language];

    const { error } = await supabase.from('gallery').insert({
      title_uz: '',
      title_en: '',
      title_ru: '',
      image_url: tempData.image_url,
      published: true,
    });

    await supabase
      .from('telegram_user_preferences')
      .update({ waiting_for: null, temp_data: null })
      .eq('telegram_user_id', telegramUserId);

    if (error) {
      await sendMessage(chatId, t.error);
    } else {
      await sendMessage(chatId, t.success);
      await showPanels(chatId, language);
    }
  }
}

async function handleText(chatId: number, user: any, text: string) {
  // Endi barcha foydalanuvchilar foydalanishi mumkin
  if (!supabase) {
    await sendMessage(chatId, 'Server sozlanmagan (Supabase env yo\'q).');
    return;
  }
  
  const telegramUserId = user.id;

  const { data: prefs } = await supabase
    .from('telegram_user_preferences')
    .select('*')
    .eq('telegram_user_id', telegramUserId)
    .maybeSingle();

  if (!prefs?.waiting_for) {
    return;
  }

  const language = (prefs.language || 'uz') as 'uz' | 'en' | 'ru';
  const t = translations[language];
  const [waitType, panel] = prefs.waiting_for.split('_');

  if (waitType === 'title') {
    await supabase
      .from('telegram_user_preferences')
      .update({
        temp_data: { title: text },
        waiting_for: `description_${panel}`,
      })
      .eq('telegram_user_id', telegramUserId);

    await sendMessage(chatId, t.enterDescription, {
      inline_keyboard: [[{ text: t.cancel, callback_data: 'cancel' }]],
    });
  } else if (waitType === 'description') {
    const { data: prefs2 } = await supabase
      .from('telegram_user_preferences')
      .select('temp_data')
      .eq('telegram_user_id', telegramUserId)
      .maybeSingle();

    const tempData = prefs2?.temp_data || {};

    if (panel === 'news') {
      await supabase
        .from('telegram_user_preferences')
        .update({
          temp_data: { ...tempData, description: text },
          waiting_for: 'image_news',
        })
        .eq('telegram_user_id', telegramUserId);

      await sendMessage(chatId, t.sendImage + ' (ixtiyoriy)', {
        inline_keyboard: [
          [{ text: t.cancel, callback_data: 'cancel' }],
          [{ text: 'Skip', callback_data: 'skip_image_news' }],
        ],
      });
    } else if (panel === 'events') {
      await supabase
        .from('telegram_user_preferences')
        .update({
          temp_data: { ...tempData, description: text },
          waiting_for: 'date_events',
        })
        .eq('telegram_user_id', telegramUserId);

      await sendMessage(chatId, t.enterDate, {
        inline_keyboard: [[{ text: t.cancel, callback_data: 'cancel' }]],
      });
    }
  } else if (waitType === 'date') {
    const { data: prefs2 } = await supabase
      .from('telegram_user_preferences')
      .select('temp_data')
      .eq('telegram_user_id', telegramUserId)
      .maybeSingle();

    const tempData = prefs2?.temp_data || {};
    
    const { error } = await supabase.from('events').insert({
      title_uz: tempData.title,
      title_en: tempData.title,
      title_ru: tempData.title,
      description_uz: tempData.description,
      description_en: tempData.description,
      description_ru: tempData.description,
      event_date: text,
      published: true,
    });

    await supabase
      .from('telegram_user_preferences')
      .update({ waiting_for: null, temp_data: null })
      .eq('telegram_user_id', telegramUserId);

    if (error) {
      await sendMessage(chatId, t.error);
    } else {
      await sendMessage(chatId, t.success);
      await showPanels(chatId, language);
    }
  } else if (waitType === 'caption') {
    const { data: prefs2 } = await supabase
      .from('telegram_user_preferences')
      .select('temp_data')
      .eq('telegram_user_id', telegramUserId)
      .maybeSingle();

    const tempData = prefs2?.temp_data || {};
    
    const { error } = await supabase.from('gallery').insert({
      title_uz: tempData.caption || '',
      title_en: tempData.caption || '',
      title_ru: tempData.caption || '',
      image_url: tempData.image_url,
      published: true,
    });

    await supabase
      .from('telegram_user_preferences')
      .update({ waiting_for: null, temp_data: null })
      .eq('telegram_user_id', telegramUserId);

    if (error) {
      await sendMessage(chatId, t.error);
    } else {
      await sendMessage(chatId, t.success);
      await showPanels(chatId, language);
    }
  }
}

async function handlePhoto(chatId: number, user: any, photo: any[]) {
  // Endi barcha foydalanuvchilar foydalanishi mumkin
  if (!supabase) {
    await sendMessage(chatId, 'Server sozlanmagan (Supabase env yo\'q).');
    return;
  }
  
  const telegramUserId = user.id;

  const { data: prefs } = await supabase
    .from('telegram_user_preferences')
    .select('*')
    .eq('telegram_user_id', telegramUserId)
    .maybeSingle();

  if (!prefs?.waiting_for || !prefs.waiting_for.startsWith('image_')) {
    return;
  }

  const language = (prefs.language || 'uz') as 'uz' | 'en' | 'ru';
  const t = translations[language];
  
  const largestPhoto = photo[photo.length - 1];
  const fileId = largestPhoto.file_id;
  
  const fileUrl = `https://api.telegram.org/bot${BOT_TOKEN}/getFile?file_id=${fileId}`;
  const fileResponse = await fetch(fileUrl);
  const fileData = await fileResponse.json();
  const filePath = fileData.result.file_path;
  
  const imageUrl = `https://api.telegram.org/file/bot${BOT_TOKEN}/${filePath}`;

  const panel = prefs.waiting_for.split('_')[1];
  const tempData = prefs.temp_data || {};

  if (panel === 'news') {
    const { error } = await supabase.from('news').insert({
      title_uz: tempData.title,
      title_en: tempData.title,
      title_ru: tempData.title,
      content_uz: tempData.description,
      content_en: tempData.description,
      content_ru: tempData.description,
      image_url: imageUrl,
      published: true,
    });

    await supabase
      .from('telegram_user_preferences')
      .update({ waiting_for: null, temp_data: null })
      .eq('telegram_user_id', telegramUserId);

    if (error) {
      await sendMessage(chatId, t.error);
    } else {
      await sendMessage(chatId, t.success);
      await showPanels(chatId, language);
    }
  } else if (panel === 'gallery') {
    await supabase
      .from('telegram_user_preferences')
      .update({
        temp_data: { ...tempData, image_url: imageUrl },
        waiting_for: 'caption_gallery',
      })
      .eq('telegram_user_id', telegramUserId);

    await sendMessage(chatId, t.enterCaption, {
      inline_keyboard: [
        [{ text: t.cancel, callback_data: 'cancel' }],
        [{ text: 'Skip', callback_data: 'skip_caption' }],
      ],
    });
  }
}

// Telegram webhook endpoint
app.post('/api/telegram-webhook', async (req, res) => {
  try {
    const update = req.body;

    // Handle callback queries
    if (update.callback_query) {
      const { message, from, data } = update.callback_query;
      await handleCallback(message.chat.id, from, data, message.message_id);
      
      await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/answerCallbackQuery`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ callback_query_id: update.callback_query.id }),
      });
    }
    // Handle /start command
    else if (update.message?.text && update.message.text.startsWith('/start')) {
      await handleStart(update.message.chat.id, update.message.from);
    }
    // Handle text messages
    else if (update.message?.text) {
      await handleText(update.message.chat.id, update.message.from, update.message.text);
    }
    // Handle photo messages
    else if (update.message?.photo) {
      await handlePhoto(update.message.chat.id, update.message.from, update.message.photo);
    }

    res.json({ ok: true });
  } catch (error: any) {
    console.error('Telegram webhook error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Server ishga tushirish
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Backend server running on port ${PORT}`);
  console.log(`📍 Health check: http://localhost:${PORT}/health`);
  console.log(`🤖 Telegram webhook: http://localhost:${PORT}/api/telegram-webhook`);
});

