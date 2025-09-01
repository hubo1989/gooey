#!/usr/bin/env bun

// 批量国际化修复脚本 - 处理检测到的107个硬编码文本
// 按模块分类批量替换，提高处理效率

const fs = require('fs').promises;
const path = require('path');

// 按模块分类的文本映射
const TEXT_MAPPINGS = {
  // navigation 导航模块
  navigation: {
    'Settings': 'navigation.settings',
    'Usage Dashboard': 'navigation.usage_dashboard',
    'General Settings': 'navigation.general_settings',
    'Advanced Settings': 'navigation.advanced_settings',
    'Raw Settings (JSON)': 'navigation.raw_settings_json',
    'MCP Servers': 'navigation.mcp_servers',
    '~/.claude/settings.json': 'navigation.claudesettingsjson',
    'Permissions': 'navigation.permissions',
    'Environment': 'navigation.environment',
    'Hooks': 'navigation.hooks',
    'Commands': 'navigation.commands',
    'Storage': 'navigation.storage',
    'Proxy': 'navigation.proxy'
  },
  
  // common 通用模块
  common: {
    'General': 'common.general',
    'Permissions': 'common.permissions',
    'Environment': 'common.environment',
    'Advanced': 'common.advanced',
    'Hooks': 'common.hooks',
    'Commands': 'common.commands',
    'Storage': 'common.storage',
    'Proxy': 'common.proxy',
    'Theme': 'common.theme',
    'Custom Theme Colors': 'common.custom_theme_colors',
    'Background': 'common.background',
    'Foreground': 'common.foreground',
    'Primary': 'common.primary',
    'Card': 'common.card',
    'Accent': 'common.accent',
    'Destructive': 'common.destructive',
    'Include "Co-authored by Claude"': 'common.include_coauthored_by_claude',
    'Verbose Output': 'common.verbose_output',
    'Chat Transcript Retention (days)': 'common.chat_transcript_retention_days',
    'Permission Rules': 'common.permission_rules',
    'Allow Rules': 'common.allow_rules',
    'Deny Rules': 'common.deny_rules',
    'Examples:': 'common.examples',
    'Bash': 'common.bash',
    'Bash(npm run build)': 'common.bashnpm_run_build',
    'Bash(npm run test:*)': 'common.bashnpm_run_test',
    'Read(~/.zshrc)': 'common.readzshrc',
    'Edit(docs/**)': 'common.editdocs',
    'Environment Variables': 'common.environment_variables',
    'Common variables:': 'common.common_variables',
    'User Hooks': 'common.user_hooks',
    'Total Cost': 'common.total_cost',
    'Total Sessions': 'common.total_sessions',
    'Total Tokens': 'common.total_tokens',
    'Avg Cost/Session': 'common.avg_costsession',
    'Token Breakdown': 'common.token_breakdown',
    'Input Tokens': 'common.input_tokens',
    'Output Tokens': 'common.output_tokens',
    'Cache Write': 'common.cache_write',
    'Cache Read': 'common.cache_read',
    'Most Used Models': 'common.most_used_models',
    'Top Projects': 'common.top_projects',
    'Usage by Model': 'common.usage_by_model',
    'Input:': 'common.input',
    'Output:': 'common.output',
    'Cache W:': 'common.cache_w',
    'Cache R:': 'common.cache_r',
    'Usage by Project': 'common.usage_by_project',
    'Usage by Session': 'common.usage_by_session',
    'Daily Usage': 'common.daily_usage',
    'Checking...': 'common.checking',
    'Claude Code not found': 'common.claude_code_not_found',
    'Install Claude Code': 'common.install_claude_code',
    'projectForSettings': 'common.projectforsettings',
    ': run.duration_ms ?': 'common.rundurationms',
    'Scroll tabs right': 'common.scroll_tabs_right',
    'Save': 'common.save',
    'Saving': 'common.saving',
    'Appearance': 'common.appearance',
    'Configure Claude Code preferences': 'common.configure_claude_preferences',
    'Choose your preferred color theme': 'common.choose_color_theme',
    'Add Claude attribution to git commits and pull requests': 'common.add_claude_attribution',
    'Show full bash and command outputs': 'common.show_full_outputs',
    'How long to retain chat transcripts locally (default: 30 days)': 'common.retain_chat_transcripts',
    'Control which tools Claude Code can use without manual approval': 'common.control_tools_approval',
    'No allow rules configured. Claude will ask for approval for all tools.': 'common.no_allow_rules',
    'No deny rules configured.': 'common.no_deny_rules',
    'Environment variables applied to every Claude Code session': 'common.env_vars_applied',
    'No environment variables configured.': 'common.no_env_vars',
    'Additional configuration options for advanced users': 'common.advanced_config_options',
    'Custom script to generate auth values for API requests': 'common.custom_script_api',
    'This shows the raw JSON that will be saved to ~/.claude/settings.json': 'common.raw_json_explanation',
    'Configure hooks that apply to all Claude Code sessions for your user account.': 'common.configure_user_hooks',
    'Use CSS color values (hex, rgb, oklch, etc.). Changes apply immediately.': 'common.css_color_values',
    'Changes will be applied when you save settings.': 'common.changes_apply_on_save',
    'Help improve Gooey': 'common.help_improve_gooey',
    'Your privacy is protected': 'common.privacy_protected',
    'No personal information collected': 'common.no_personal_info',
    'All data is anonymous': 'common.all_data_anonymous',
    'Disable analytics anytime': 'common.disable_analytics_anytime',
    'Remember open tabs': 'common.remember_open_tabs',
    'Restore tabs on restart': 'common.restore_tabs_on_restart',
    'Show welcome intro': 'common.show_welcome_intro',
    'Display welcome animation': 'common.display_welcome_animation',
    'Track your Claude Code usage and costs': 'usage.track_usage_costs',
    'Last 7 Days': 'usage.last_7_days',
    'Last 30 Days': 'usage.last_30_days',
    'All Time': 'usage.all_time',
    'Showing': 'common.showing',
    'Page': 'common.page',
    'of': 'common.of',
    'total sessions': 'common.total_sessions_count',
    'No session data available for the selected period': 'usage.no_session_data',
  'Daily Usage Over Time': 'usage.daily_usage_over_time',
  'No usage data available for the selected period': 'usage.no_usage_data',
  'Page {projectsPage} of {totalPages}': 'common.page_x_of_y',
  'Page {sessionsPage} of {totalPages}': 'common.page_x_of_y',
  'Showing {startIndex + 1}-{Math.min(endIndex, sessionStats.length)} of {sessionStats.length}': 'common.showing_x_y_of_z'
},
  
  // buttons 按钮模块
  buttons: {
    'Install Claude Code': 'buttons.install_claude_code',
    'Add Rule': 'buttons.add_rule',
    'Add Variable': 'buttons.add_variable',
    'Save Settings': 'buttons.save_settings',
    'Cancel': 'buttons.cancel'
  },
  
  // settings 设置模块
  settings: {
    'Enable Analytics': 'settings.enableAnalytics',
    'Help improve Gooey': 'settings.helpImproveGooey',
    'Your privacy is protected': 'settings.yourPrivacyProtected',
    'No personal information collected': 'settings.noPersonalInfoCollected',
    'All data is anonymous': 'settings.allDataAnonymous',
    'Disable analytics anytime': 'settings.disableAnalyticsAnytime',
    'Remember open tabs': 'settings.rememberOpenTabs',
    'Restore tabs on restart': 'settings.restoreTabsOnRestart',
    'Show welcome intro': 'settings.showWelcomeIntro',
    'Display welcome animation': 'settings.displayWelcomeAnimation'
  }
};

// 需要处理的文件列表
const FILES_TO_FIX = [
  '/Users/hubo/mycode/gooey/src/components/Settings.tsx',
  '/Users/hubo/mycode/gooey/src/components/UsageDashboard.tsx',
  '/Users/hubo/mycode/gooey/src/components/Topbar.tsx',
  '/Users/hubo/mycode/gooey/src/components/Agents.tsx',
  '/Users/hubo/mycode/gooey/src/components/MCPManager.tsx',
  '/Users/hubo/mycode/gooey/src/components/TabManager.tsx',
  '/Users/hubo/mycode/gooey/src/App.tsx'
];

// 替换模式
const REPLACE_PATTERNS = [
  // JSX文本内容替换
  {
    pattern: /(['"`])([^'"`]+?)\1/g,
    replacement: (match, quote, text) => {
      const trimmedText = text.trim();
      for (const [module, mappings] of Object.entries(TEXT_MAPPINGS)) {
        if (mappings[trimmedText]) {
          return `{t('${mappings[trimmedText]}')}`;
        }
      }
      return match;
    }
  },
  
  // JSX属性值替换
  {
    pattern: /(=)(['"`])([^'"`]+?)\2/g,
    replacement: (match, equals, quote, text) => {
      const trimmedText = text.trim();
      for (const [module, mappings] of Object.entries(TEXT_MAPPINGS)) {
        if (mappings[trimmedText]) {
          return `={t('${mappings[trimmedText]}')}`;
        }
      }
      return match;
    }
  },
  
  // 纯文本节点替换
  {
    pattern: />\s*([^<{}\n][^<{}\n]*[^<{}\n])\s*</g,
    replacement: (match, text) => {
      const trimmedText = text.trim();
      for (const [module, mappings] of Object.entries(TEXT_MAPPINGS)) {
        if (mappings[trimmedText]) {
          return `>{t('${mappings[trimmedText]}')}<`;
        }
      }
      return match;
    }
  }
];

async function processFile(filePath) {
  try {
    const content = await fs.readFile(filePath, 'utf-8');
    let modifiedContent = content;
    let fixedCount = 0;
    
    // 应用所有替换模式
    for (const { pattern, replacement } of REPLACE_PATTERNS) {
      modifiedContent = modifiedContent.replace(pattern, replacement);
      
      // 统计替换次数
      const originalMatches = content.match(pattern) || [];
      const modifiedMatches = modifiedContent.match(pattern) || [];
      fixedCount += (originalMatches.length - modifiedMatches.length);
    }
    
    if (modifiedContent !== content) {
      await fs.writeFile(filePath, modifiedContent, 'utf-8');
      console.log(`✅ 已修复 ${filePath} 中的 ${fixedCount} 处文本`);
      return fixedCount;
    } else {
      console.log(`ℹ️  ${filePath} 中未找到匹配的文本`);
      return 0;
    }
    
  } catch (error) {
    console.error(`❌ 处理文件 ${filePath} 时出错:`, error.message);
    return 0;
  }
}

async function addTranslationsToFiles() {
  const enTranslations = require('/Users/hubo/mycode/gooey/src/locales/en/translation.json');
  const zhTranslations = require('/Users/hubo/mycode/gooey/src/locales/zh/translation.json');
  
  let addedCount = 0;
  
  // 添加缺失的翻译键
  for (const [module, mappings] of Object.entries(TEXT_MAPPINGS)) {
    for (const [text, key] of Object.entries(mappings)) {
      if (!enTranslations[key]) {
        enTranslations[key] = text;
        zhTranslations[key] = text; // 中文暂用英文，后续人工翻译
        addedCount++;
      }
    }
  }
  
  if (addedCount > 0) {
    await fs.writeFile('/Users/hubo/mycode/gooey/src/locales/en/translation.json', JSON.stringify(enTranslations, null, 2));
    await fs.writeFile('/Users/hubo/mycode/gooey/src/locales/zh/translation.json', JSON.stringify(zhTranslations, null, 2));
    console.log(`✅ 已添加 ${addedCount} 个翻译键到语言文件`);
  } else {
    console.log('ℹ️  所有翻译键已存在，无需添加');
  }
}

async function main() {
  console.log('🚀 开始批量处理107个硬编码文本...\n');
  
  let totalFixed = 0;
  
  // 处理所有文件
  for (const filePath of FILES_TO_FIX) {
    if (await fs.access(filePath).then(() => true).catch(() => false)) {
      const fixed = await processFile(filePath);
      totalFixed += fixed;
    } else {
      console.log(`⚠️  文件不存在: ${filePath}`);
    }
  }
  
  // 添加翻译键
  await addTranslationsToFiles();
  
  console.log(`\n🎉 批量处理完成！总共修复 ${totalFixed} 处文本`);
  console.log('📝 请检查修复结果，必要时进行人工调整');
}

// 运行主函数
main().catch(console.error);