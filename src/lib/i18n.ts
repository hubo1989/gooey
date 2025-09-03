import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// 扩展Window接口以包含i18n
declare global {
  interface Window {
    i18n: typeof i18n;
  }
}

// 导入所有翻译资源
import enTranslation from '@/locales/en/translation.json';
import zhCNTranslation from '@/locales/zh-CN/translation.json';
import zhTWTranslation from '@/locales/zh-TW/translation.json';
import jaTranslation from '@/locales/ja/translation.json';
import koTranslation from '@/locales/ko/translation.json';
import deTranslation from '@/locales/de/translation.json';
import frTranslation from '@/locales/fr/translation.json';
import esTranslation from '@/locales/es/translation.json';
import itTranslation from '@/locales/it/translation.json';
import ptTranslation from '@/locales/pt/translation.json';
import ruTranslation from '@/locales/ru/translation.json';

// 定义资源对象
const resources = {
  en: {
    translation: enTranslation
  },
  'zh-CN': {
    translation: zhCNTranslation
  },
  'zh-TW': {
    translation: zhTWTranslation
  },
  ja: {
    translation: jaTranslation
  },
  ko: {
    translation: koTranslation
  },
  de: {
    translation: deTranslation
  },
  fr: {
    translation: frTranslation
  },
  es: {
    translation: esTranslation
  },
  it: {
    translation: itTranslation
  },
  pt: {
    translation: ptTranslation
  },
  ru: {
    translation: ruTranslation
  }
};

// 初始化 i18n
export const i18nInitPromise = i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    debug: process.env.NODE_ENV === 'development',
    interpolation: {
      escapeValue: false
    },
    // 配置语言检测器，降低优先级，允许手动设置覆盖
    detection: {
      order: ['localStorage', 'navigator', 'htmlTag'],
      caches: ['localStorage'],
      lookupLocalStorage: 'i18nextLng',
    },
    // 支持的语言列表
    supportedLngs: ['en', 'zh-CN', 'zh-TW', 'ja', 'ko', 'de', 'fr', 'es', 'it', 'pt', 'ru']
  }, (err) => {
    if (err) {
      console.error('i18n initialization failed:', err);
    }
  });

// 将i18n暴露到全局window对象
if (typeof window !== 'undefined') {
  window.i18n = i18n;
}

export default i18n;