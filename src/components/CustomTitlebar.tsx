import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Settings, Minus, Square, X, Bot, BarChart3, FileText, Network, Info, MoreVertical } from 'lucide-react';
import { getCurrentWindow } from '@tauri-apps/api/window';
import { TooltipProvider, TooltipSimple } from '@/components/ui/tooltip-modern';
import { useTranslation } from 'react-i18next';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';

interface CustomTitlebarProps {
  onSettingsClick?: () => void;
  onAgentsClick?: () => void;
  onUsageClick?: () => void;
  onClaudeClick?: () => void;
  onMCPClick?: () => void;
  onInfoClick?: () => void;
}

export const CustomTitlebar: React.FC<CustomTitlebarProps> = ({
  onSettingsClick,
  onAgentsClick,
  onUsageClick,
  onClaudeClick,
  onMCPClick,
  onInfoClick
}) => {
  const { t } = useTranslation();
  const [isHovered, setIsHovered] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleMinimize = async () => {
    try {
      const window = getCurrentWindow();
      await window.minimize();
    } catch (error) {
      console.error('Failed to minimize window:', error);
    }
  };

  const handleMaximize = async () => {
    try {
      const window = getCurrentWindow();
      const isMaximized = await window.isMaximized();
      if (isMaximized) {
        await window.unmaximize();
      } else {
        await window.maximize();
      }
    } catch (error) {
      console.error('Failed to maximize/unmaximize window:', error);
    }
  };

  const handleClose = async () => {
    try {
      const window = getCurrentWindow();
      await window.close();
    } catch (error) {
      console.error('Failed to close window:', error);
    }
  };

  return (
    <TooltipProvider>
    <div 
      className="relative z-[200] h-11 bg-background/95 backdrop-blur-sm flex items-center justify-between select-none border-b border-border/50 tauri-drag"
      data-tauri-drag-region
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Left side - macOS Traffic Light buttons */}
      <div className="flex items-center space-x-2 pl-5">
        <div className="flex items-center space-x-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleClose();
            }}
            className="group relative w-3 h-3 rounded-full bg-red-500 hover:bg-red-600 transition-all duration-200 flex items-center justify-center tauri-no-drag"
            title={t('titlebar.close')}
          >
            {isHovered && (
              <X size={8} className="text-red-900 opacity-60 group-hover:opacity-100" />
            )}
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              handleMinimize();
            }}
            className="group relative w-3 h-3 rounded-full bg-yellow-500 hover:bg-yellow-600 transition-all duration-200 flex items-center justify-center tauri-no-drag"
            title={t('titlebar.minimize')}
          >
            {isHovered && (
              <Minus size={8} className="text-yellow-900 opacity-60 group-hover:opacity-100" />
            )}
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              handleMaximize();
            }}
            className="group relative w-3 h-3 rounded-full bg-green-500 hover:bg-green-600 transition-all duration-200 flex items-center justify-center tauri-no-drag"
            title={t('titlebar.maximize')}
          >
            {isHovered && (
              <Square size={6} className="text-green-900 opacity-60 group-hover:opacity-100" />
            )}
          </button>
        </div>
      </div>

      {/* Right side - Navigation icons */}
      <div className="flex items-center pr-5 gap-3 tauri-no-drag">
        <div className="flex items-center gap-1">
          {onAgentsClick && (
            <TooltipSimple content={t('titlebar.agents')} side="bottom">
              <motion.button
                onClick={onAgentsClick}
                whileTap={{ scale: 0.97 }}
                transition={{ duration: 0.15 }}
                className="p-2 rounded-md hover:bg-accent hover:text-accent-foreground transition-colors tauri-no-drag"
                type="button"
              >
                <Bot size={16} />
              </motion.button>
            </TooltipSimple>
          )}
          
          {onUsageClick && (
            <TooltipSimple content={t('titlebar.usage')} side="bottom">
              <motion.button
                onClick={onUsageClick}
                whileTap={{ scale: 0.97 }}
                transition={{ duration: 0.15 }}
                className="p-2 rounded-md hover:bg-accent hover:text-accent-foreground transition-colors tauri-no-drag"
                type="button"
              >
                <BarChart3 size={16} />
              </motion.button>
            </TooltipSimple>
          )}
        </div>

        <div className="w-px h-5 bg-border/50" />

        <div className="flex items-center gap-1">
          {onSettingsClick && (
            <TooltipSimple content={t('titlebar.settings')} side="bottom">
              <motion.button
                onClick={onSettingsClick}
                whileTap={{ scale: 0.97 }}
                transition={{ duration: 0.15 }}
                className="p-2 rounded-md hover:bg-accent hover:text-accent-foreground transition-colors tauri-no-drag"
                type="button"
              >
                <Settings size={16} />
              </motion.button>
            </TooltipSimple>
          )}

          {/* Language Switcher */}
          <LanguageSwitcher className="p-2 rounded-md hover:bg-accent hover:text-accent-foreground transition-colors tauri-no-drag" />

          <div className="relative" ref={dropdownRef}>
            <TooltipSimple content={t('titlebar.moreOptions')} side="bottom">
              <motion.button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                whileTap={{ scale: 0.97 }}
                transition={{ duration: 0.15 }}
                className="p-2 rounded-md hover:bg-accent hover:text-accent-foreground transition-colors flex items-center gap-1"
                type="button"
              >
                <MoreVertical size={16} />
              </motion.button>
            </TooltipSimple>

            {isDropdownOpen && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: -5 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: -5 }}
                transition={{ duration: 0.15 }}
                className="absolute right-0 top-full mt-1 w-48 bg-popover border border-border rounded-md shadow-lg py-1 z-50"
              >
                {onClaudeClick && (
                  <button
                    onClick={() => {
                      onClaudeClick();
                      setIsDropdownOpen(false);
                    }}
                    className="w-full px-3 py-2 text-sm text-left hover:bg-accent hover:text-accent-foreground flex items-center gap-2"
                  >
                    <FileText size={14} />
                    {t('titlebar.projects')}
                  </button>
                )}
                
                {onMCPClick && (
                  <button
                    onClick={() => {
                      onMCPClick();
                      setIsDropdownOpen(false);
                    }}
                    className="w-full px-3 py-2 text-sm text-left hover:bg-accent hover:text-accent-foreground flex items-center gap-2"
                  >
                    <Network size={14} />
                    {t('titlebar.mcpServers')}
                  </button>
                )}
                
                {onInfoClick && (
                  <button
                    onClick={() => {
                      onInfoClick();
                      setIsDropdownOpen(false);
                    }}
                    className="w-full px-3 py-2 text-sm text-left hover:bg-accent hover:text-accent-foreground flex items-center gap-2"
                  >
                    <Info size={14} />
                    {t('titlebar.about')}
                  </button>
                )}
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
    </TooltipProvider>
  );
};
