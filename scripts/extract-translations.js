const fs = require('fs');
const path = require('path');

// 简单的翻译字符串提取器
function extractTranslations() {
  const sourceDir = path.join(__dirname, '../src');
  const outputFile = path.join(__dirname, '../src/locales/en/translation.json');
  
  // 确保输出目录存在
  const outputDir = path.dirname(outputFile);
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }
  
  // 基础翻译结构
  const translations = {
    welcome: {
      title: 'Welcome to Gooey',
      description: 'A desktop GUI for Claude Code'
    },
    navigation: {
      agents: 'CC Agents',
      projects: 'Projects',
      settings: 'Settings',
      usage: 'Usage Dashboard',
      mcp: 'MCP Manager'
    },
    common: {
      loading: 'Loading...',
      error: 'Error',
      success: 'Success',
      back: 'Back'
    }
  };
  
  // 写入翻译文件
  fs.writeFileSync(outputFile, JSON.stringify(translations, null, 2));
  console.log('✓ Translation strings extracted to', outputFile);
}

extractTranslations();