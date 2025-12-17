// Telegram Bot Webhook Handler for Vercel
import { createClient } from '@supabase/supabase-js';

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || '';
const SUPABASE_URL = process.env.VITE_SUPABASE_URL || '';
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

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

// Check if user is admin by username
async function isAdminByUsername(username: string): Promise<boolean> {
  try {
    if (!username) return false;
    
    const cleanUsername = username.replace('@', '').toLowerCase();
    
    const { data, error } = await supabase
      .from('user_roles')
      .select('role')
      .ilike('telegram_username', cleanUsername)
      .maybeSingle();

    if (error || !data) return false;
    return data.role === 'admin' || data.role === 'super_admin';
  } catch {
    return false;
  }
}

// Check if user is admin by user_id (fallback)
async function isAdminByUserId(telegramUserId: number): Promise<boolean> {
  try {
    const { data, error } = await supabase
      .from('user_roles')
      .select('role')
      .eq('telegram_user_id', telegramUserId)
      .maybeSingle();

    if (error || !data) return false;
    return data.role === 'admin' || data.role === 'super_admin';
  } catch {
    return false;
  }
}

// Main admin check function
async function isAdmin(user: any): Promise<boolean> {
  // First try username
  if (user.username) {
    const isAdminByUser = await isAdminByUsername(user.username);
    if (isAdminByUser) return true;
  }
  
  // Fallback to user_id
  if (user.id) {
    return await isAdminByUserId(user.id);
  }
  
  return false;
}

// Get user language preference
async function getUserLanguage(telegramUserId: number): Promise<'uz' | 'en' | 'ru'> {
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

// Save user language preference
async function saveUserLanguage(telegramUserId: number, language: 'uz' | 'en' | 'ru') {
  await supabase
    .from('telegram_user_preferences')
    .upsert({
      telegram_user_id: telegramUserId,
      language,
      updated_at: new Date().toISOString(),
    });
}

// Send message via Telegram API
async function sendMessage(chatId: number, text: string, replyMarkup?: any) {
  const url = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`;
  await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      chat_id: chatId,
      text,
      reply_markup: replyMarkup,
      parse_mode: 'HTML',
    }),
  });
}

// Handle /start command
async function handleStart(chatId: number, user: any) {
  const isUserAdmin = await isAdmin(user);
  
  if (!isUserAdmin) {
    // Silent - do nothing for non-admins
    return;
  }
  
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

// Show main panels
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

// Handle callback queries
async function handleCallback(chatId: number, user: any, data: string, messageId: number) {
  const isUserAdmin = await isAdmin(user);
  if (!isUserAdmin) return;
  
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
    
    // Store current panel in user state
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
      
      // Set user state to waiting for input
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

      // Save news without image
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

      // Save gallery item without caption
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

// Handle text messages (for form inputs)
async function handleText(chatId: number, user: any, text: string) {
  const isUserAdmin = await isAdmin(user);
  if (!isUserAdmin) return;
  
  const telegramUserId = user.id;

  const { data: prefs } = await supabase
    .from('telegram_user_preferences')
    .select('*')
    .eq('telegram_user_id', telegramUserId)
    .maybeSingle();

  if (!prefs?.waiting_for) {
    // Not in input mode, ignore
    return;
  }

  const language = (prefs.language || 'uz') as 'uz' | 'en' | 'ru';
  const t = translations[language];
  const [waitType, panel] = prefs.waiting_for.split('_');

  if (waitType === 'title') {
    // Save title, ask for description
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
      // Ask for image (optional)
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
      // Ask for date
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
    
    // Save event
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
    
    // Save gallery item
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

// Handle photo messages
async function handlePhoto(chatId: number, user: any, photo: any[]) {
  const isUserAdmin = await isAdmin(user);
  if (!isUserAdmin) return;
  
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
  
  // Get largest photo
  const largestPhoto = photo[photo.length - 1];
  const fileId = largestPhoto.file_id;
  
  // Get file path
  const fileUrl = `https://api.telegram.org/bot${BOT_TOKEN}/getFile?file_id=${fileId}`;
  const fileResponse = await fetch(fileUrl);
  const fileData = await fileResponse.json();
  const filePath = fileData.result.file_path;
  
  // Construct image URL
  const imageUrl = `https://api.telegram.org/file/bot${BOT_TOKEN}/${filePath}`;

  const panel = prefs.waiting_for.split('_')[1];
  const tempData = prefs.temp_data || {};

  if (panel === 'news') {
    // Save news with image
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
    // Ask for caption
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

export default async function handler(req: Request) {
  if (req.method !== 'POST') {
    return Response.json({ error: 'Method not allowed' }, { status: 405 });
  }

  try {
    const update = await req.json();

    // Handle callback queries
    if (update.callback_query) {
      const { message, from, data } = update.callback_query;
      await handleCallback(message.chat.id, from, data, message.message_id);
      
      // Answer callback
      await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/answerCallbackQuery`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ callback_query_id: update.callback_query.id }),
      });
    }
    // Handle /start command
    else if (update.message?.text === '/start') {
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

    return Response.json({ ok: true }, { status: 200 });
  } catch (error: any) {
    console.error('Telegram webhook error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}

