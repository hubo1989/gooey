// 已知的翻译键映射，用于区分硬编码文本和缺少翻译的文本
export const KNOWN_TRANSLATION_KEYS = new Set([
  // 项目相关翻译键
  'projects.openProject',
  'projects.recentProjects', 
  'projects.noRecentProjects',
  'projects.openToGetStarted',
  'projects.openFirstProject',
  'projects.viewAll',
  'projects.viewLess',
  
  // 设置相关翻译键
  'settings.enableAnalytics',
  'settings.helpImproveGooey',
  'settings.yourPrivacyProtected',
  'settings.noPersonalInfoCollected',
  'settings.allDataAnonymous',
  'settings.disableAnalyticsAnytime',
  'settings.rememberOpenTabs',
  'settings.restoreTabsOnRestart',
  'settings.showWelcomeIntro',
  'settings.displayWelcomeAnimation',
  'settings.exportData',
  'settings.exportDataDescription',
  
  // 导航相关翻译键
  'navigation.settings',
  'navigation.projects',
  'navigation.agents',
  'navigation.usage',
  'navigation.mcp',
  
  // 会话相关翻译键
  'session.cancelledByUser',
  'session.completed',
  'session.failed',
  'session.running',
  
  // 时间线相关翻译键
  'timeline.addedFiles',
  'timeline.checkpoint',
  'timeline.sessionStarted',
  
  // 代理相关翻译键
  'agents.createAgent',
  'agents.editAgent',
  'agents.runAgent',
  'agents.agentSettings',
  
  // 通用UI翻译键
  'common.save',
  'common.cancel',
  'common.delete',
  'common.edit',
  'common.view',
  'common.close',
  'common.yes',
  'common.no',
  'common.ok',
  'common.back',
  'common.create',
  
  // 错误消息翻译键
  'errors.generic',
  'errors.network',
  'errors.permission',
  'errors.validation',
  
  // 成功消息翻译键
  'success.saved',
  'success.deleted',
  'success.updated',
  'success.created'
]);

// 获取所有已知翻译键的函数
export function getAllTranslationKeys(): string[] {
  return Array.from(KNOWN_TRANSLATION_KEYS);
}

// 检查文本是否为已知翻译键
export function isKnownTranslationKey(text: string): boolean {
  return KNOWN_TRANSLATION_KEYS.has(text);
}

// 添加新的翻译键
export function addTranslationKey(key: string): void {
  KNOWN_TRANSLATION_KEYS.add(key);
}

// 批量添加翻译键
export function addTranslationKeys(keys: string[]): void {
  keys.forEach(key => KNOWN_TRANSLATION_KEYS.add(key));
}