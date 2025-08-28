import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 从清理后的报告中提取需要翻译的文本
function parseCleanedReport() {
  const reportPath = path.join(__dirname, '../HARDCODED_TEXTS_SCAN_CLEANED.md');
  const content = fs.readFileSync(reportPath, 'utf8');
  
  const translations = {};
  let currentFile = '';
  
  content.split('\n').forEach(line => {
    // 检测文件标题
    const fileMatch = line.match(/^###\s+(.+)$/);
    if (fileMatch) {
      currentFile = fileMatch[1].trim();
      translations[currentFile] = [];
      return;
    }
    
    // 检测表格行
    const rowMatch = line.match(/\|\s*text\s*\|\s*(\d+)\s*\|\s*([^|]+)\s*\|/);
    if (rowMatch && currentFile) {
      const lineNumber = parseInt(rowMatch[1]);
      const text = rowMatch[2].trim();
      
      // 生成翻译键（基于文件和文本内容）
      const key = generateTranslationKey(currentFile, text);
      
      translations[currentFile].push({
        line: lineNumber,
        text: text,
        key: key
      });
    }
  });
  
  return translations;
}

// 生成有意义的翻译键
function generateTranslationKey(filePath, text) {
  const fileName = path.basename(filePath, '.tsx').toLowerCase();
  const cleanText = text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, '')
    .replace(/\s+/g, '_');
  
  return `${fileName}.${cleanText}`;
}

// 替换文件中的文本
function replaceInFile(filePath, replacements) {
  if (!fs.existsSync(filePath)) {
    console.log(`⚠️  文件不存在: ${filePath}`);
    return false;
  }
  
  let content = fs.readFileSync(filePath, 'utf8');
  const lines = content.split('\n');
  let changed = false;
  
  replacements.forEach(({ line, text, key }) => {
    const actualLine = line - 1; // 转换为0-based索引
    
    if (actualLine >= 0 && actualLine < lines.length) {
      const originalLine = lines[actualLine];
      
      // 创建替换模式（处理可能的HTML转义）
      const escapedText = text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const pattern = new RegExp(`>\\s*${escapedText}\\s*<`, 'g');
      
      if (pattern.test(originalLine)) {
        const newLine = originalLine.replace(
          new RegExp(`>\\s*${escapedText}\\s*<`), 
          `>{t('${key}')}<`
        );
        
        if (newLine !== originalLine) {
          lines[actualLine] = newLine;
          changed = true;
          console.log(`✅ 替换: ${filePath}:${line} "${text}" → t('${key}')`);
        }
      } else {
        console.log(`⚠️  未找到文本: ${filePath}:${line} "${text}"`);
      }
    }
  });
  
  if (changed) {
    fs.writeFileSync(filePath, lines.join('\n'));
    console.log(`💾 已保存: ${filePath}`);
  }
  
  return changed;
}

// 更新翻译文件
function updateTranslationFile(translations) {
  const translationPath = path.join(__dirname, '../src/locales/en/translation.json');
  
  let existingTranslations = {};
  try {
    existingTranslations = JSON.parse(fs.readFileSync(translationPath, 'utf8'));
  } catch (error) {
    existingTranslations = {};
  }
  
  // 收集所有新的翻译键
  const allKeys = {};
  Object.values(translations).forEach(fileReplacements => {
    fileReplacements.forEach(({ key, text }) => {
      allKeys[key] = text;
    });
  });
  
  // 合并到现有翻译中
  Object.assign(existingTranslations, allKeys);
  
  // 写入翻译文件
  fs.writeFileSync(translationPath, JSON.stringify(existingTranslations, null, 2));
  console.log(`📝 更新翻译文件: ${translationPath}`);
  console.log(`🔑 新增 ${Object.keys(allKeys).length} 个翻译键`);
}

async function main() {
  console.log('🚀 开始替换硬编码文本为翻译函数...\n');
  
  // 解析清理后的报告
  const translations = parseCleanedReport();
  
  let totalReplacements = 0;
  
  // 对每个文件进行替换
  for (const [filePath, replacements] of Object.entries(translations)) {
    const fullPath = path.join(__dirname, '..', filePath);
    
    console.log(`\n📁 处理文件: ${filePath}`);
    console.log(`📋 需要替换: ${replacements.length} 处`);
    
    const changed = replaceInFile(fullPath, replacements);
    if (changed) {
      totalReplacements += replacements.length;
    }
  }
  
  // 更新翻译文件
  updateTranslationFile(translations);
  
  console.log(`\n🎉 完成！共替换了 ${totalReplacements} 处文本`);
  console.log('📋 下一步: 运行 npm run i18n:sync 同步到其他语言');
}

main().catch(console.error);