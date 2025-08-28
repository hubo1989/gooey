import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 不应该翻译的模式（技术性内容）
const SKIP_PATTERNS = [
  /\$[A-Z_]+/,           // 变量如 $ARGUMENTS
  /\/\/.*/,             // 单行注释
  /\/\*[\s\S]*?\*\//,   // 多行注释
  /\.\.\./,             // 省略号
  /[A-Za-z0-9_]+\.[A-Za-z0-9_]+/, // 对象属性访问
  /['"`][^'"`]*\.[^'"`]*['"`]/, // 包含点的字符串
  /import.*from/,       // import语句
  /require\(/,         // require调用
  /className="/,        // className属性
  /<[A-Za-z]+/,         // JSX标签
  /\/\w+\//,           // 正则表达式
  /http[s]?:\/\//,     // URL
  /[A-Za-z0-9_]+@[A-Za-z0-9_]+/, // 邮箱
  /[0-9]+/,             // 纯数字
  /[^A-Za-z0-9\s]/,    // 包含特殊字符
];

// 需要翻译的文本模式
const TEXT_PATTERNS = [
  /<h[1-6]>([^<]+)<\/h[1-6]>/,     // 标题
  /<p>([^<]+)<\/p>/,              // 段落
  /<span>([^<]+)<\/span>/,         // span
  /placeholder=["']([^"']+)["']/, // 占位符
  /title=["']([^"']+)["']/,       // title属性
  /aria-label=["']([^"']+)["']/,  // aria标签
  /['"`]([A-Za-z][^'"`]{2,}?)['"`](?![:A-Za-z0-9_])/, // 引号内的文本
];

function shouldSkipText(text) {
  // 过滤空文本和超短文本
  if (!text || text.length < 2) return true;
  
  // 检查技术性内容模式
  return SKIP_PATTERNS.some(pattern => pattern.test(text));
}

function extractFromFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const translations = new Set();
  
  TEXT_PATTERNS.forEach(pattern => {
    let match;
    while ((match = pattern.exec(content)) !== null) {
      const text = match[1] || match[0];
      if (!shouldSkipText(text)) {
        translations.add(text.trim());
      }
    }
  });
  
  // 额外捕获常见的UI文本
  const uiTextMatches = content.match(/[>\s]['"`]([A-Za-z][A-Za-z\s]{2,}?)['"`][<\.\s]/g) || [];
  uiTextMatches.forEach(match => {
    const text = match.replace(/[>\s]['"`]|['"`][<\.\s]/g, '').trim();
    if (!shouldSkipText(text)) {
      translations.add(text);
    }
  });
  
  return Array.from(translations);
}

function generateTranslationKey(text, componentName) {
  // 基于组件和文本内容生成有意义的键
  const baseKey = text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, '')
    .replace(/\s+/g, '_');
  
  return `${componentName}.${baseKey}`;
}

function extractTranslations() {
  const componentsDir = path.join(__dirname, '../src/components');
  const outputFile = path.join(__dirname, '../src/locales/en/translation.json');
  
  // 读取现有的翻译文件（如果有）
  let existingTranslations = {};
  try {
    existingTranslations = JSON.parse(fs.readFileSync(outputFile, 'utf8'));
  } catch (e) {
    existingTranslations = {};
  }
  
  const allTranslations = { ...existingTranslations };
  
  // 递归扫描组件目录
  function scanDirectory(dir) {
    const items = fs.readdirSync(dir);
    
    items.forEach(item => {
      const fullPath = path.join(dir, item);
      const stat = fs.statSync(fullPath);
      
      if (stat.isDirectory()) {
        scanDirectory(fullPath);
      } else if (item.endsWith('.tsx') || item.endsWith('.ts')) {
        const componentName = path.basename(item, path.extname(item));
        const texts = extractFromFile(fullPath);
        
        if (texts.length > 0) {
          if (!allTranslations[componentName]) {
            allTranslations[componentName] = {};
          }
          
          texts.forEach(text => {
            const key = generateTranslationKey(text, componentName);
            // 只在键不存在时才添加
            if (!allTranslations[componentName][key]) {
              allTranslations[componentName][key] = text;
            }
          });
        }
      }
    });
  }
  
  scanDirectory(componentsDir);
  
  // 确保输出目录存在
  const outputDir = path.dirname(outputFile);
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }
  
  // 写入翻译文件
  fs.writeFileSync(outputFile, JSON.stringify(allTranslations, null, 2));
  console.log('✓ 翻译字符串已提取到', outputFile);
  console.log('✓ 共提取了', Object.keys(allTranslations).length, '个组件的翻译');
}

extractTranslations();