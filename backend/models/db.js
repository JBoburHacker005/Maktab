// ============================================
// DATABASE HELPER - JSON FILE STORAGE
// ============================================
// Bu modul JSON fayllar bilan ishlash uchun yordamchi funksiyalar
// Har bir jadval uchun alohida JSON fayl ishlatiladi
// ============================================

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import crypto from 'crypto';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Data papkasi yo'li
const DATA_DIR = path.join(__dirname, '..', 'data');

// Data papkasini yaratish (agar yo'q bo'lsa)
if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
}

/**
 * UUID generatsiya qilish
 * @returns {string} Yangi UUID
 */
export const generateId = () => {
    return crypto.randomUUID();
};

/**
 * JSON fayldan ma'lumot o'qish
 * @param {string} filename - Fayl nomi (masalan: 'news.json')
 * @returns {Array|Object} - O'qilgan ma'lumot
 */
export const readData = (filename) => {
    const filePath = path.join(DATA_DIR, filename);

    try {
        if (!fs.existsSync(filePath)) {
            // Fayl mavjud emas, bo'sh array qaytarish
            return [];
        }

        const data = fs.readFileSync(filePath, 'utf-8');
        return JSON.parse(data);
    } catch (error) {
        console.error(`Error reading ${filename}:`, error);
        return [];
    }
};

/**
 * JSON faylga ma'lumot yozish
 * @param {string} filename - Fayl nomi
 * @param {Array|Object} data - Yoziladigan ma'lumot
 * @returns {boolean} - Muvaffaqiyat holati
 */
export const writeData = (filename, data) => {
    const filePath = path.join(DATA_DIR, filename);

    try {
        fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
        return true;
    } catch (error) {
        console.error(`Error writing ${filename}:`, error);
        return false;
    }
};

/**
 * Yozuv qo'shish
 * @param {string} filename - Fayl nomi
 * @param {Object} item - Qo'shiladigan yozuv
 * @returns {Object} - Qo'shilgan yozuv (id bilan)
 */
export const addItem = (filename, item) => {
    const data = readData(filename);
    const newItem = {
        id: generateId(),
        ...item,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
    };

    data.unshift(newItem); // Boshiga qo'shish (eng yangi birinchi)
    writeData(filename, data);

    return newItem;
};

/**
 * Yozuvni yangilash
 * @param {string} filename - Fayl nomi
 * @param {string} id - Yozuv IDsi
 * @param {Object} updates - Yangilanishlar
 * @returns {Object|null} - Yangilangan yozuv yoki null
 */
export const updateItem = (filename, id, updates) => {
    const data = readData(filename);
    const index = data.findIndex(item => item.id === id);

    if (index === -1) {
        return null;
    }

    data[index] = {
        ...data[index],
        ...updates,
        id: data[index].id, // ID o'zgarmasligini ta'minlash
        created_at: data[index].created_at, // created_at o'zgarmasligini ta'minlash
        updated_at: new Date().toISOString(),
    };

    writeData(filename, data);
    return data[index];
};

/**
 * Yozuvni o'chirish
 * @param {string} filename - Fayl nomi
 * @param {string} id - Yozuv IDsi
 * @returns {boolean} - Muvaffaqiyat holati
 */
export const deleteItem = (filename, id) => {
    const data = readData(filename);
    const index = data.findIndex(item => item.id === id);

    if (index === -1) {
        return false;
    }

    data.splice(index, 1);
    writeData(filename, data);
    return true;
};

/**
 * ID bo'yicha yozuv topish
 * @param {string} filename - Fayl nomi
 * @param {string} id - Yozuv IDsi
 * @returns {Object|null} - Topilgan yozuv yoki null
 */
export const findById = (filename, id) => {
    const data = readData(filename);
    return data.find(item => item.id === id) || null;
};

/**
 * Barcha yozuvlarni o'chirish
 * @param {string} filename - Fayl nomi
 * @returns {boolean} - Muvaffaqiyat holati
 */
export const clearAll = (filename) => {
    return writeData(filename, []);
};

export default {
    generateId,
    readData,
    writeData,
    addItem,
    updateItem,
    deleteItem,
    findById,
    clearAll,
};
