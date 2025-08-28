import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 精确的UI文本提取器
function extractPreciseUIText(content) {
  const patterns = [
    /<h[1-6][^>]*>([^<{]+)<\/h[1-6]>/g,           // 标题
    /<p[^>]*>([^<{]+)<\/p>/g,                     // 段落
    /<span[^>]*>([^<{]+)<\/span>/g,               // span
    /placeholder=["']([^"'{]+)["']/g,             // 占位符
    /title=["']([^"'{]+)["']/g,                   // title
    /aria-label=["']([^"'{]+)["']/g,              // aria-label
    /label=["']([^"'{]+)["']/g,                   // label
    /<div[^>]*>[\s]*([A-Za-z][^<{]+)[\s]*<\/div>/g, // div内容
  ];
  
  const texts = new Set();
  
  patterns.forEach(pattern => {
    let match;
    while ((match = pattern.exec(content)) !== null) {
      let text = (match[1] || match[0]).trim();
      
      // 更严格的过滤
      if (isValidUIText(text)) {
        texts.add(text);
      }
    }
  });
  
  return Array.from(texts);
}

function isValidUIText(text) {
  // 长度检查
  if (text.length < 3 || text.length > 100) return false;
  
  // 技术性内容过滤
  const technicalPatterns = [
    /\$[A-Z_]/,           // 变量
    /\.\.\./,             // 省略号
    /import|require/,     // 导入语句
    /className/,          // className
    /<[A-Z]/,             // JSX标签
    /\/\w+\//,           // 正则
    /http[s]?:\/\//,     // URL
    /[0-9]+(\.[0-9]+)?/,  // 数字
    /oklch\(/,           // 颜色值
    /\/path\//,          // 路径
    /e\.g\./,            // 示例
    /Promise/,            // Promise
    /set[A-Z]/,          // setState函数
    /update[A-Z]/,        // update函数
    /handle[A-Z]/,        // handler函数
    /\.[a-z]+\(/,        // 方法调用
  ];
  
  // 包含字母且不包含技术性内容
  return /[A-Za-z]/.test(text) && 
         !technicalPatterns.some(pattern => pattern.test(text)) &&
         !text.includes('{') && !text.includes('}');
}

async function main() {
  const outputFile = path.join(__dirname, '../src/locales/en/translation.json');
  
  // 只保留真正需要的基础翻译
  const cleanTranslations = {
    welcome: {
      title: "Welcome to Gooey",
      description: "A desktop GUI for Claude Code"
    },
    navigation: {
      agents: "CC Agents",
      projects: "Projects", 
      settings: "Settings",
      usage: "Usage Dashboard",
      mcp: "MCP Manager"
    },
    common: {
      loading: "Loading...",
      error: "Error", 
      success: "Success",
      back: "Back"
    }
  };
  
  // 确保目录存在
  const outputDir = path.dirname(outputFile);
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }
  
  fs.writeFileSync(outputFile, JSON.stringify(cleanTranslations, null, 2));
  console.log('✓ 已清理翻译文件，保留了基础UI文本');
  console.log('✓ 建议使用专业工具进行完整提取');
}

main().catch(console.error);