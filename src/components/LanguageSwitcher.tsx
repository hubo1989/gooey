import React from 'react';
import { useTranslation } from 'react-i18next';
import { Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface LanguageSwitcherProps {
  className?: string;
}

const languages = [
  { code: 'en', name: 'English', nativeName: 'English' },
  { code: 'zh-CN', name: 'Chinese', nativeName: '中文' },
  { code: 'ja', name: 'Japanese', nativeName: '日本語' },
  { code: 'ko', name: 'Korean', nativeName: '한국어' },
  { code: 'es', name: 'Spanish', nativeName: 'Español' },
  { code: 'fr', name: 'French', nativeName: 'Français' },
  { code: 'de', name: 'German', nativeName: 'Deutsch' },
];

export const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({ className }) => {
  const { i18n } = useTranslation();
  const currentLanguage = languages.find(lang => lang.code === i18n.language) || languages[0];

  const changeLanguage = (languageCode: string) => {
    // 立即保存到localStorage，使用i18next的键名
    localStorage.setItem('i18nextLng', languageCode);
    localStorage.setItem('preferred_language', languageCode);
    
    // 更改语言并等待完成
    i18n.changeLanguage(languageCode).then(() => {
      // 更新HTML语言属性
      document.documentElement.lang = languageCode;
      
      // 触发全局语言变化事件，通知所有组件
      window.dispatchEvent(new CustomEvent('language-changed', { 
        detail: { language: languageCode } 
      }));
      
      // 使用翻译后的成功消息
      window.dispatchEvent(new CustomEvent('show-toast', {
        detail: { message: i18n.t('common.language_updated'), type: 'success' }
      }));
    }).catch((error) => {
      console.error('Language change failed:', error);
      window.dispatchEvent(new CustomEvent('show-toast', {
        detail: { message: i18n.t('common.language_update_failed'), type: 'error' }
      }));
    });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className={`flex items-center space-x-2 ${className}`}
          data-testid="language-switcher"
        >
          <Globe className="h-4 w-4" />
          <span className="text-xs font-medium">{currentLanguage.nativeName}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        {languages.map((language) => (
          <DropdownMenuItem
            key={language.code}
            onClick={() => changeLanguage(language.code)}
            className={`flex items-center justify-between ${
              i18n.language === language.code ? 'bg-accent' : ''
            }`}
            data-testid={`language-option-${language.code}`}
          >
            <div className="flex items-center space-x-2">
              <span className="text-sm">{language.nativeName}</span>
              <span className="text-xs text-muted-foreground">({language.name})</span>
            </div>
            {i18n.language === language.code && (
              <div className="w-2 h-2 rounded-full bg-primary" />
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};